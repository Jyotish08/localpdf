import * as pdfjsLib from "pdfjs-dist";
import JSZip from "jszip";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export const CONFIG = {
  RENDER_SCALE: 2.5,
  JPEG_QUALITY: 0.92,
  MAX_CANVAS_PX: 16383,
};

function ensureBrowserFile(file) {
  if (typeof File === "undefined" || !(file instanceof File)) {
    throw new TypeError("Please select a valid PDF file.");
  }
}

export function isValidPdfFile(file) {
  return typeof File !== "undefined" && file instanceof File && file.type === "application/pdf" && file.size > 0;
}

function baseNameFromFileName(fileName) {
  return fileName.replace(/\.[^.]+$/, "") || "document";
}

function dataUrlToBlob(dataUrl) {
  const [meta, base64] = dataUrl.split(",");
  const mimeMatch = /data:(.*?);base64/.exec(meta || "");
  const mimeType = mimeMatch?.[1] || "image/jpeg";
  const binary = atob(base64 || "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function getZeroPadWidth(totalPages) {
  return String(totalPages).length;
}

export async function convertPdfToJpg(file, onProgress = null) {
  ensureBrowserFile(file);

  if (file.type !== "application/pdf") {
    throw new TypeError("Please select a valid PDF file.");
  }

  if (file.size === 0) {
    throw new Error("The selected PDF is empty.");
  }

  const fileBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(fileBuffer) });
  let pdfDoc = null;

  try {
    pdfDoc = await loadingTask.promise;
  } catch (err) {
    await loadingTask.destroy().catch(() => {});
    if (err instanceof pdfjsLib.PasswordException || err?.name === "PasswordException") {
      throw new Error("This PDF is password-protected. Decryption is not supported.");
    }
    throw new Error("This PDF could not be read. It may be corrupt or unsupported.");
  }

  const totalPages = pdfDoc.numPages;
  const baseName = baseNameFromFileName(file.name);
  const padWidth = getZeroPadWidth(totalPages);
  const extracted = [];

  try {
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      let page = null;
      let canvas = null;

      try {
        page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: CONFIG.RENDER_SCALE });
        const canvasWidth = Math.ceil(viewport.width);
        const canvasHeight = Math.ceil(viewport.height);

        if (canvasWidth > CONFIG.MAX_CANVAS_PX || canvasHeight > CONFIG.MAX_CANVAS_PX) {
          throw new Error(
            `Page ${pageNum} exceeds max canvas size at scale ${CONFIG.RENDER_SCALE}. Reduce RENDER_SCALE.`,
          );
        }

        canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error(`Page ${pageNum} could not be rendered because the canvas context is unavailable.`);
        }

        await page.render({ canvasContext: context, viewport }).promise;
        const dataUrl = canvas.toDataURL("image/jpeg", CONFIG.JPEG_QUALITY);

        extracted.push({
          filename: `page_${String(pageNum).padStart(padWidth, "0")}.jpg`,
          dataUrl,
        });
      } finally {
        if (page) {
          await page.cleanup();
        }
        if (canvas) {
          canvas.width = 0;
          canvas.height = 0;
          canvas = null;
        }
      }

      onProgress?.(pageNum, totalPages);
    }
  } finally {
    await pdfDoc.destroy();
  }

  if (totalPages === 1) {
    const jpgBlob = dataUrlToBlob(extracted[0].dataUrl);
    downloadBlob(jpgBlob, `${baseName}.jpg`);
    return;
  }

  try {
    const zip = new JSZip();
    for (const item of extracted) {
      const payload = item.dataUrl.split(",")[1] || "";
      zip.file(item.filename, payload, { base64: true });
    }

    const zipBlob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    downloadBlob(zipBlob, `${baseName}_pages.zip`);
  } catch (err) {
    throw new Error(`Could not compress JPGs into a ZIP archive: ${err instanceof Error ? err.message : "unknown error"}`);
  }
}
