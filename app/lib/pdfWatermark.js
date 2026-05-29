import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";

export const CONFIG = {
  WATERMARK_TYPE: "text", // 'text' | 'image'
  TEXT: "CONFIDENTIAL",
  FONT_SIZE: 48,
  OPACITY: 0.25,
  ROTATION_DEGREES: 45,
  COLOR: { r: 0.4, g: 0.4, b: 0.4 },
  POSITION: "center", // 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  IMAGE_SCALE: 0.3,
  JPEG_QUALITY: 0.92,
};

function ensureBrowserFile(file) {
  return typeof File !== "undefined" && file instanceof File;
}

export function isValidPdfFile(file) {
  return ensureBrowserFile(file) && file.type === "application/pdf" && file.size > 0;
}

export function isValidImageFile(file) {
  if (!ensureBrowserFile(file) || file.size === 0) {
    return false;
  }

  const mimeType = file.type.toLowerCase();
  return mimeType === "image/png" || mimeType === "image/jpeg" || mimeType === "image/jpg";
}

function baseNameFromFileName(fileName) {
  return fileName.replace(/\.[^.]+$/, "") || "document";
}

function downloadPdfBytes(pdfBytes, originalName) {
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = `${baseNameFromFileName(originalName)}_watermarked.pdf`;
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  URL.revokeObjectURL(objectUrl);
}

function getEffectivePageSize(page) {
  const rotation = page.getRotation().angle;
  const { width, height } = page.getSize();
  const isSideways = rotation === 90 || rotation === 270;

  return {
    rotation,
    width: isSideways ? height : width,
    height: isSideways ? width : height,
  };
}

function getPlacementPosition(position, width, height, contentWidth, contentHeight) {
  switch (position) {
    case "top-left":
      return { x: 0, y: height - contentHeight };
    case "top-right":
      return { x: width - contentWidth, y: height - contentHeight };
    case "bottom-left":
      return { x: 0, y: 0 };
    case "bottom-right":
      return { x: width - contentWidth, y: 0 };
    case "center":
    default:
      return {
        x: (width - contentWidth) / 2,
        y: (height - contentHeight) / 2,
      };
  }
}

function normalizeConfig(options = {}) {
  const color = options.COLOR ?? options.color ?? {};

  return {
    WATERMARK_TYPE: options.WATERMARK_TYPE ?? options.watermarkType ?? CONFIG.WATERMARK_TYPE,
    TEXT: options.TEXT ?? options.text ?? CONFIG.TEXT,
    FONT_SIZE: options.FONT_SIZE ?? options.fontSize ?? CONFIG.FONT_SIZE,
    OPACITY: options.OPACITY ?? options.opacity ?? CONFIG.OPACITY,
    ROTATION_DEGREES: options.ROTATION_DEGREES ?? options.rotationDegrees ?? CONFIG.ROTATION_DEGREES,
    COLOR: {
      r: color.r ?? CONFIG.COLOR.r,
      g: color.g ?? CONFIG.COLOR.g,
      b: color.b ?? CONFIG.COLOR.b,
    },
    POSITION: options.POSITION ?? options.position ?? CONFIG.POSITION,
    IMAGE_SCALE: options.IMAGE_SCALE ?? options.imageScale ?? CONFIG.IMAGE_SCALE,
    JPEG_QUALITY: options.JPEG_QUALITY ?? options.jpegQuality ?? CONFIG.JPEG_QUALITY,
  };
}

function applyTextWatermarkToPage(page, font, config) {
  const { width, height } = getEffectivePageSize(page);
  const textWidth = font.widthOfTextAtSize(config.TEXT, config.FONT_SIZE);
  const textHeight = font.heightAtSize(config.FONT_SIZE);
  const { x, y } = getPlacementPosition(config.POSITION, width, height, textWidth, textHeight);

  page.drawText(config.TEXT, {
    x,
    y,
    size: config.FONT_SIZE,
    font,
    color: rgb(config.COLOR.r, config.COLOR.g, config.COLOR.b),
    opacity: config.OPACITY,
    rotate: degrees(config.ROTATION_DEGREES),
  });
}

function applyImageWatermarkToPage(page, embeddedImg, config) {
  const { width, height } = getEffectivePageSize(page);
  const drawWidth = width * config.IMAGE_SCALE;
  const scale = drawWidth / embeddedImg.width;
  const drawHeight = embeddedImg.height * scale;
  const { x, y } = getPlacementPosition(config.POSITION, width, height, drawWidth, drawHeight);

  page.drawImage(embeddedImg, {
    x,
    y,
    width: drawWidth,
    height: drawHeight,
    opacity: config.OPACITY,
    rotate: degrees(config.ROTATION_DEGREES),
  });
}

export async function applyWatermark(pdfFile, options = {}, onProgress = null) {
  if (!isValidPdfFile(pdfFile)) {
    if (ensureBrowserFile(pdfFile) && pdfFile.size === 0) {
      throw new Error("The selected file is empty.");
    }
    throw new Error("Only PDF files are accepted.");
  }

  const config = normalizeConfig(options);
  const watermarkType = String(config.WATERMARK_TYPE).toLowerCase();

  if (watermarkType === "text") {
    const text = String(config.TEXT ?? "").trim();
    if (!text) {
      throw new Error("Watermark text cannot be empty.");
    }
    config.TEXT = text;
  }

  if (watermarkType === "image") {
    const imageFile = options.imageFile ?? options.watermarkImageFile ?? options.image ?? null;
    if (!isValidImageFile(imageFile)) {
      throw new Error("Watermark image must be PNG or JPG.");
    }
  }

  let pdfDoc;

  try {
    const pdfBytes = await pdfFile.arrayBuffer();
    pdfDoc = await PDFDocument.load(pdfBytes);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/encrypted/i.test(message)) {
      throw new Error("This PDF is password-protected and cannot be watermarked.");
    }
    throw new Error("Could not parse this PDF. The file may be corrupt.");
  }

  try {
    let font = null;
    let embeddedImg = null;

    if (watermarkType === "text") {
      font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    } else if (watermarkType === "image") {
      const imageFile = options.imageFile ?? options.watermarkImageFile ?? options.image ?? null;
      const imgBytes = await imageFile.arrayBuffer();

      try {
        embeddedImg = imageFile.type === "image/png" ? await pdfDoc.embedPng(imgBytes) : await pdfDoc.embedJpg(imgBytes);
      } catch {
        throw new Error("Watermark image must be PNG or JPG.");
      }
    } else {
      throw new Error("Unsupported watermark type.");
    }

    const totalPages = pdfDoc.getPageCount();

    for (let i = 0; i < totalPages; i++) {
      const page = pdfDoc.getPage(i);

      if (watermarkType === "text") {
        applyTextWatermarkToPage(page, font, config);
      } else {
        applyImageWatermarkToPage(page, embeddedImg, config);
      }

      onProgress?.(i + 1, totalPages);
    }

    const outputBytes = await pdfDoc.save({ useObjectStreams: true });
    downloadPdfBytes(outputBytes, pdfFile.name);
  } finally {
    await pdfDoc?.destroy?.();
  }
}
