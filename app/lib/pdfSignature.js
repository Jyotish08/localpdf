import { PDFDocument } from "pdf-lib";

export const SIGNATURE_MODES = {
  DRAW: "draw",
  TYPE: "type",
  UPLOAD: "upload",
};

export const DRAW_CONFIG = {
  strokeColor: "#000000",
  lineWidth: 2.5,
  lineCap: "round",
  lineJoin: "round",
  smoothingFactor: 0.15,
};

export const PLACEMENT_CONFIG = {
  PAGE_NUMBER: 1,
  POSITION: "bottom-right",
  CUSTOM_X: null,
  CUSTOM_Y: null,
  WIDTH_PERCENT: 0.3,
  MARGIN_PT: 28.35,
  OPACITY: 1.0,
};

const TYPE_CONFIG = {
  TYPE_FONT_SIZE: 64,
  TYPE_PADDING: 24,
  TYPE_COLOR: "#000000",
};

const SIGNATURE_FONT_NAME = "Dancing Script";
const SIGNATURE_FONT_URL =
  "https://fonts.gstatic.com/s/dancingscript/v25/If2cXTr6YS-zF4S-kcSWSVi_sxjsohD9F50Ruu7BMSo3Sup6hNX6plRP.woff2";
const MAX_HISTORY_ENTRIES = 20;

let signatureFontPromise = null;

function isBrowserFile(file) {
  return typeof File !== "undefined" && file instanceof File;
}

export function isValidPdfFile(file) {
  return isBrowserFile(file) && file.type === "application/pdf" && file.size > 0;
}

export function isValidImageFile(file) {
  if (!isBrowserFile(file) || file.size === 0) {
    return false;
  }

  const mimeType = String(file.type || "").toLowerCase();
  return mimeType === "image/png" || mimeType === "image/jpeg" || mimeType === "image/jpg";
}

function baseNameFromFileName(fileName) {
  const cleaned = String(fileName || "document").replace(/\.[^.]+$/, "");
  return cleaned || "document";
}

function downloadPdfBytes(pdfBytes, originalName) {
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = `${baseNameFromFileName(originalName)}_signed.pdf`;
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  URL.revokeObjectURL(objectUrl);
}

function isCanvasBlank(canvas) {
  if (!(canvas instanceof HTMLCanvasElement) || canvas.width === 0 || canvas.height === 0) {
    return true;
  }

  const context = canvas.getContext("2d");
  if (!context) {
    return true;
  }

  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  return !data.some((channel) => channel !== 0);
}

function canvasToPngBytes(canvas) {
  const dataUrl = canvas.toDataURL("image/png");
  const [, base64 = ""] = dataUrl.split(",");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

async function loadSignatureFont() {
  if (signatureFontPromise) {
    return signatureFontPromise;
  }

  signatureFontPromise = (async () => {
    if (typeof FontFace === "undefined" || typeof document === "undefined") {
      throw new Error("Failed to load signature font. Check your internet connection.");
    }

    const font = new FontFace(SIGNATURE_FONT_NAME, `url(${SIGNATURE_FONT_URL})`);
    await font.load();
    document.fonts.add(font);
    return font;
  })().catch((error) => {
    signatureFontPromise = null;
    throw error;
  });

  try {
    await signatureFontPromise;
  } catch {
    signatureFontPromise = null;
    throw new Error("Failed to load signature font. Check your internet connection.");
  }
}

function calcPlacement(pageWidth, pageHeight, sigWidth, sigHeight, config) {
  void pageHeight;
  void sigHeight;

  const margin = config.MARGIN_PT;
  const positions = {
    "bottom-right": { x: pageWidth - sigWidth - margin, y: margin },
    "bottom-left": { x: margin, y: margin },
    "bottom-center": { x: (pageWidth - sigWidth) / 2, y: margin },
    custom: { x: config.CUSTOM_X, y: config.CUSTOM_Y },
  };

  return positions[config.POSITION] ?? positions["bottom-right"];
}

function getEffectivePageSize(page) {
  const rotation = page.getRotation().angle;
  const { width, height } = page.getSize();

  return {
    rotation,
    width: rotation === 90 || rotation === 270 ? height : width,
    height: rotation === 90 || rotation === 270 ? width : height,
  };
}

function normalizeMode(mode) {
  const normalized = String(mode || "").toLowerCase();
  if (normalized !== SIGNATURE_MODES.DRAW && normalized !== SIGNATURE_MODES.TYPE && normalized !== SIGNATURE_MODES.UPLOAD) {
    throw new Error("Unsupported signature mode.");
  }
  return normalized;
}

async function normalizeImageToPng(file) {
  const fileType = String(file.type || "").toLowerCase();

  if (fileType === "image/png") {
    return new Uint8Array(await file.arrayBuffer());
  }

  if (fileType !== "image/jpeg" && fileType !== "image/jpg") {
    throw new Error("Signature image must be PNG or JPG.");
  }

  const bitmap = await createImageBitmap(
    new Blob([await file.arrayBuffer()], {
      type: file.type || "image/jpeg",
    }),
  );

  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Could not process the signature image.");
  }

  context.drawImage(bitmap, 0, 0);
  bitmap.close();

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) {
        resolve(result);
        return;
      }
      reject(new Error("Could not process the signature image."));
    }, "image/png");
  });

  canvas.width = 0;
  canvas.height = 0;

  return new Uint8Array(await blob.arrayBuffer());
}

async function getSignatureBytes(mode, payload) {
  switch (mode) {
    case SIGNATURE_MODES.DRAW:
      if (!(payload instanceof HTMLCanvasElement)) {
        throw new Error("Please draw your signature before applying.");
      }
      return canvasToPngBytes(payload);

    case SIGNATURE_MODES.TYPE: {
      const text = String(payload ?? "").trim();
      if (!text) {
        throw new Error("Please type your signature text.");
      }

      await loadSignatureFont();

      const offscreen = document.createElement("canvas");
      const measureContext = offscreen.getContext("2d");
      if (!measureContext) {
        throw new Error("Could not process the signature text.");
      }

      measureContext.font = `${TYPE_CONFIG.TYPE_FONT_SIZE}px "${SIGNATURE_FONT_NAME}"`;
      const metrics = measureContext.measureText(text);
      const textWidth = Math.ceil(metrics.width);
      const ascent = metrics.actualBoundingBoxAscent ?? TYPE_CONFIG.TYPE_FONT_SIZE * 0.8;
      const descent = metrics.actualBoundingBoxDescent ?? TYPE_CONFIG.TYPE_FONT_SIZE * 0.2;
      const textHeight = Math.ceil(ascent + descent);

      offscreen.width = Math.max(1, textWidth + TYPE_CONFIG.TYPE_PADDING * 2);
      offscreen.height = Math.max(1, textHeight + TYPE_CONFIG.TYPE_PADDING * 2);

      const drawContext = offscreen.getContext("2d");
      if (!drawContext) {
        throw new Error("Could not process the signature text.");
      }

      drawContext.font = `${TYPE_CONFIG.TYPE_FONT_SIZE}px "${SIGNATURE_FONT_NAME}"`;
      drawContext.fillStyle = TYPE_CONFIG.TYPE_COLOR;
      drawContext.textBaseline = "alphabetic";
      drawContext.fillText(text, TYPE_CONFIG.TYPE_PADDING, TYPE_CONFIG.TYPE_PADDING + ascent);

      return canvasToPngBytes(offscreen);
    }

    case SIGNATURE_MODES.UPLOAD:
      if (!isBrowserFile(payload) || payload.size === 0) {
        throw new Error("Please upload a signature image.");
      }
      if (!isValidImageFile(payload)) {
        throw new Error("Signature image must be PNG or JPG.");
      }
      return normalizeImageToPng(payload);

    default:
      throw new Error("Unsupported signature mode.");
  }
}

export function clearSignatureCanvas(canvas) {
  const context = canvas?.getContext?.("2d");
  if (!context || !canvas) {
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
}

export function undoLastStroke(canvas, strokeHistory) {
  if (!Array.isArray(strokeHistory) || strokeHistory.length === 0) return;

  strokeHistory.pop();
  const previous = strokeHistory[strokeHistory.length - 1];

  if (previous) {
    canvas.getContext("2d").putImageData(previous, 0, 0);
  } else {
    clearSignatureCanvas(canvas);
  }
}

export function initDrawCanvas(canvas, strokeHistory = []) {
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not initialize the signature canvas.");
  }

  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const rect = canvas.getBoundingClientRect();
  const cssWidth = Math.max(1, Math.round(rect.width || canvas.width || 840));
  const cssHeight = Math.max(1, Math.round(rect.height || canvas.height || 260));

  canvas.width = Math.max(1, Math.round(cssWidth * dpr));
  canvas.height = Math.max(1, Math.round(cssHeight * dpr));
  canvas.style.touchAction = "none";

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.strokeStyle = DRAW_CONFIG.strokeColor;
  context.lineWidth = DRAW_CONFIG.lineWidth;
  context.lineCap = DRAW_CONFIG.lineCap;
  context.lineJoin = DRAW_CONFIG.lineJoin;

  let isDrawing = false;
  let activePointerId = null;
  let lastPoint = null;
  let pendingPoints = [];
  let rafId = 0;

  const pointFromEvent = (event) => {
    const bounds = canvas.getBoundingClientRect();
    return {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
  };

  const flushPoints = () => {
    rafId = 0;
    if (!isDrawing || pendingPoints.length === 0) {
      return;
    }

    while (pendingPoints.length > 0) {
      const currentPoint = pendingPoints.shift();
      if (!lastPoint) {
        lastPoint = currentPoint;
        context.beginPath();
        context.moveTo(currentPoint.x, currentPoint.y);
        continue;
      }

      const midX = (lastPoint.x + currentPoint.x) / 2;
      const midY = (lastPoint.y + currentPoint.y) / 2;

      context.quadraticCurveTo(lastPoint.x, lastPoint.y, midX, midY);
      context.stroke();
      lastPoint = currentPoint;
    }
  };

  const scheduleFlush = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(flushPoints);
  };

  const snapshotStroke = () => {
    if (canvas.width === 0 || canvas.height === 0) return;
    const snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
    if (!Array.isArray(strokeHistory)) return;
    strokeHistory.push(snapshot);
    if (strokeHistory.length > MAX_HISTORY_ENTRIES) {
      strokeHistory.shift();
    }
  };

  const finishStroke = (event) => {
    if (!isDrawing || (activePointerId !== null && event.pointerId !== activePointerId)) {
      return;
    }

    if (rafId) {
      window.cancelAnimationFrame(rafId);
      flushPoints();
    }

    isDrawing = false;
    activePointerId = null;
    lastPoint = null;
    pendingPoints = [];

    if (canvas.hasPointerCapture?.(event.pointerId)) {
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch {
        // Ignore capture release failures.
      }
    }

    snapshotStroke();
  };

  const onPointerDown = (event) => {
    event.preventDefault();
    if (event.button !== 0 && event.pointerType === "mouse") {
      return;
    }

    isDrawing = true;
    activePointerId = event.pointerId;
    lastPoint = pointFromEvent(event);
    pendingPoints = [];

    context.beginPath();
    context.moveTo(lastPoint.x, lastPoint.y);

    canvas.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!isDrawing || (activePointerId !== null && event.pointerId !== activePointerId)) {
      return;
    }

    pendingPoints.push(pointFromEvent(event));
    scheduleFlush();
  };

  const onPointerUp = (event) => {
    finishStroke(event);
  };

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointerout", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);

  const destroy = () => {
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }

    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointerout", onPointerUp);
    canvas.removeEventListener("pointercancel", onPointerUp);
  };

  return { destroy };
}

export async function applySignature(pdfFile, mode, payload, options = {}, onProgress = null) {
  if (!isBrowserFile(pdfFile)) {
    throw new Error("Only PDF files are accepted.");
  }

  if (pdfFile.size === 0) {
    throw new Error("The selected PDF file is empty.");
  }

  if (pdfFile.type !== "application/pdf") {
    throw new Error("Only PDF files are accepted.");
  }

  const normalizedMode = normalizeMode(mode);
  const config = {
    ...PLACEMENT_CONFIG,
    ...options,
  };

  if (normalizedMode === SIGNATURE_MODES.DRAW) {
    if (!(payload instanceof HTMLCanvasElement) || isCanvasBlank(payload)) {
      throw new Error("Please draw your signature before applying.");
    }
  } else if (normalizedMode === SIGNATURE_MODES.TYPE) {
    if (!String(payload ?? "").trim()) {
      throw new Error("Please type your signature text.");
    }
  } else if (normalizedMode === SIGNATURE_MODES.UPLOAD) {
    if (!isBrowserFile(payload) || payload.size === 0) {
      throw new Error("Please upload a signature image.");
    }
    if (!isValidImageFile(payload)) {
      throw new Error("Signature image must be PNG or JPG.");
    }
  }

  if (
    config.POSITION === "custom" &&
    (!Number.isFinite(Number(config.CUSTOM_X)) || !Number.isFinite(Number(config.CUSTOM_Y)))
  ) {
    throw new Error("Please provide custom X and Y coordinates.");
  }

  let pdfDoc;

  try {
    onProgress?.("Loading PDF");
    const pdfBytes = await pdfFile.arrayBuffer();
    pdfDoc = await PDFDocument.load(pdfBytes);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/encrypted|password/i.test(message)) {
      throw new Error("This PDF is password-protected and cannot be signed.");
    }
    throw new Error("Could not parse this PDF. The file may be corrupt.");
  }

  try {
    const totalPages = pdfDoc.getPageCount();
    const pageNumber = Number(config.PAGE_NUMBER);
    const widthPercent = Number(config.WIDTH_PERCENT);
    const opacity = Number(config.OPACITY);

    if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
      throw new Error(
        `Invalid page number ${config.PAGE_NUMBER}. ` +
          `This PDF has ${totalPages} page${totalPages > 1 ? "s" : ""}.`,
      );
    }

    if (!Number.isFinite(widthPercent)) {
      throw new Error("Signature width is too small to be legible. Increase WIDTH_PERCENT.");
    }

    onProgress?.("Preparing signature");
    const signatureBytes = await getSignatureBytes(normalizedMode, payload);
    const embeddedImg = await pdfDoc.embedPng(signatureBytes);
    const page = pdfDoc.getPage(pageNumber - 1);
    const { width, height } = getEffectivePageSize(page);
    const targetWidth = width * widthPercent;

    if (targetWidth < 40) {
      throw new Error("Signature width is too small to be legible. Increase WIDTH_PERCENT.");
    }

    const aspectRatio = embeddedImg.height / embeddedImg.width;
    const targetHeight = targetWidth * aspectRatio;
    const placement = calcPlacement(width, height, targetWidth, targetHeight, config);

    onProgress?.("Applying signature");
    page.drawImage(embeddedImg, {
      x: placement.x,
      y: placement.y,
      width: targetWidth,
      height: targetHeight,
      opacity: Number.isFinite(opacity) ? opacity : PLACEMENT_CONFIG.OPACITY,
    });

    onProgress?.("Saving PDF");
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    downloadPdfBytes(pdfBytes, pdfFile.name);
    onProgress?.("Download started");
  } finally {
    await pdfDoc?.destroy?.();
  }
}
