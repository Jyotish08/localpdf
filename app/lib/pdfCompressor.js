export const PRESETS = {
  low: {
    imageQuality: 0.85,
    imageMaxWidthPx: 2400,
    imageMaxSizeMB: 2.0,
    useObjectStreams: true,
    label: "Low Compression - Best Quality",
  },
  medium: {
    imageQuality: 0.7,
    imageMaxWidthPx: 1600,
    imageMaxSizeMB: 1.0,
    useObjectStreams: true,
    label: "Medium - Balanced",
  },
  high: {
    imageQuality: 0.5,
    imageMaxWidthPx: 1024,
    imageMaxSizeMB: 0.5,
    useObjectStreams: true,
    label: "High Compression - Smallest File",
  },
};

const MAX_CLIENT_FILE_BYTES = 100 * 1024 * 1024;
const SMALL_FILE_WARNING_BYTES = 10 * 1024;

function isBrowserFile(file) {
  return typeof File !== "undefined" && file instanceof File;
}

export function isValidPdfFile(file) {
  return isBrowserFile(file) && file.type === "application/pdf" && file.size > 0;
}

function baseNameFromFileName(fileName) {
  return fileName.replace(/\.[^.]+$/, "") || "document";
}

function createAbortError() {
  return new DOMException("Compression cancelled by user.", "AbortError");
}

function normalizePreset(presetKey) {
  return PRESETS[presetKey] ?? PRESETS.medium;
}

function downloadPdfBytes(pdfBytes, originalName) {
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = `${baseNameFromFileName(originalName)}_compressed.pdf`;
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(objectUrl);
}

function transferOrClone(value) {
  if (!value) return value;
  if (value instanceof Uint8Array) return value;
  return new Uint8Array(value);
}

export async function compressPdf(pdfFile, presetKey = "medium", onProgress = null, signal = null) {
  if (!isValidPdfFile(pdfFile)) {
    if (isBrowserFile(pdfFile) && pdfFile.size === 0) {
      throw new Error("The selected PDF file is empty.");
    }
    throw new Error("Please select a valid PDF.");
  }

  if (pdfFile.size > MAX_CLIENT_FILE_BYTES) {
    throw new Error("File exceeds the 100 MB client-side processing limit. Use a desktop tool for files this large.");
  }

  if (pdfFile.size < SMALL_FILE_WARNING_BYTES) {
    console.warn("File is already very small - compression gains may be negligible.");
  }

  if (signal?.aborted) {
    throw createAbortError();
  }

  const preset = normalizePreset(presetKey);
  const worker = new Worker(new URL("./pdfCompression.worker.js", import.meta.url), { type: "module" });

  let settled = false;

  return await new Promise((resolve, reject) => {
    const cleanup = () => {
      if (settled) return;
      settled = true;
      signal?.removeEventListener("abort", handleAbort);
      worker.terminate();
    };

    const handleAbort = () => {
      cleanup();
      reject(createAbortError());
    };

    const handleMessage = (event) => {
      const message = event.data || {};

      if (message.type === "progress") {
        onProgress?.(message.stage, message.current, message.total);
        return;
      }

      if (message.type === "error") {
        cleanup();
        reject(new Error(message.message || "Could not parse this PDF. The file may be corrupt or malformed."));
        return;
      }

      if (message.type === "complete") {
        cleanup();
        const result = message.result;
        const pdfBytes = transferOrClone(message.pdfBytes);
        downloadPdfBytes(pdfBytes, pdfFile.name);
        resolve(result);
      }
    };

    signal?.addEventListener("abort", handleAbort, { once: true });
    worker.addEventListener("message", handleMessage);
    worker.addEventListener("error", (err) => {
      cleanup();
      reject(new Error(err.message || "Could not parse this PDF. The file may be corrupt or malformed."));
    });

    worker.postMessage({
      type: "compress",
      file: pdfFile,
      presetKey,
      preset,
    });
  });
}
