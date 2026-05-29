/**
 * jpgToPdfConverter.js
 * Production-ready, 100% client-side JPG/PNG -> PDF converter.
 * Uses pdf-lib (https://pdf-lib.js.org/) - zero server uploads.
 *
 * INSTALL (npm/yarn):
 *   npm install pdf-lib
 *   yarn add pdf-lib
 *
 * CDN (no build step):
 *   <script src="https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js"></script>
 *   then import via window.PDFLib globally (see note in convertImagesToPdf).
 *
 * USAGE in your entry file:
 *   import { convertImagesToPdf } from './jpgToPdfConverter.js';
 *
 *   const fileInput = document.getElementById('file-input');
 *   fileInput.addEventListener('change', async (e) => {
 *     try {
 *       await convertImagesToPdf(Array.from(e.target.files), 'output.pdf');
 *     } catch (err) {
 *       console.error('PDF conversion failed:', err.message);
 *     }
 *   });
 */

// --- Constants ---------------------------------------------------------------

/** A4 page dimensions in PDF points (72 DPI) */
const PAGE = {
  WIDTH: 595.28,
  HEIGHT: 841.89,
  MARGIN: 28.35, // 10mm margin on each side
};

/** Accepted MIME types */
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png"]);

// --- Internal Helpers --------------------------------------------------------

/**
 * Resolves the PDFLib global - works with both ESM imports and CDN globals.
 * @returns {{ PDFDocument: *, rgb: * }}
 */
function resolvePdfLib() {
  if (typeof PDFLib !== "undefined") return PDFLib;
  if (typeof window !== "undefined" && window.PDFLib) return window.PDFLib;
  throw new Error(
    "[jpgToPdfConverter] pdf-lib not found. " +
      "Run: npm install pdf-lib  OR add the CDN <script> tag before this module.",
  );
}

/**
 * Reads a File as an ArrayBuffer.
 * @param {File} file
 * @returns {Promise<ArrayBuffer>}
 */
function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(`Failed to read file: "${file.name}"`));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Calculates scaled dimensions that:
 *  - Fit within the printable area (A4 minus margins)
 *  - Maintain original aspect ratio
 *  - Never upscale images smaller than the page
 *
 * @param {number} imgW Original image width (px)
 * @param {number} imgH Original image height (px)
 * @returns {{ width: number, height: number }}
 */
function calcFitDimensions(imgW, imgH) {
  const maxW = PAGE.WIDTH - PAGE.MARGIN * 2;
  const maxH = PAGE.HEIGHT - PAGE.MARGIN * 2;

  // Only downscale - never upscale smaller images
  const scale = Math.min(1, maxW / imgW, maxH / imgH);

  return {
    width: imgW * scale,
    height: imgH * scale,
  };
}

/**
 * Validates a single file and throws descriptive errors.
 * @param {File} file
 * @param {number} index Position in the files array (for error messages)
 */
function validateFile(file, index) {
  if (!(file instanceof File)) {
    throw new TypeError(`[File ${index + 1}] Expected a File object, got ${typeof file}.`);
  }
  if (!ACCEPTED_TYPES.has(file.type.toLowerCase())) {
    throw new TypeError(
      `[File ${index + 1}] "${file.name}" - unsupported type "${file.type}". ` +
        "Only JPEG and PNG are accepted.",
    );
  }
  if (file.size === 0) {
    throw new Error(`[File ${index + 1}] "${file.name}" is empty (0 bytes).`);
  }
  if (file.size > 50 * 1024 * 1024) {
    console.warn(
      `[jpgToPdfConverter] "${file.name}" is ${(file.size / 1024 / 1024).toFixed(1)} MB. ` +
        "Very large files may be slow in the browser.",
    );
  }
}

/**
 * Embeds one image into a pdf-lib PDFDocument as a new page.
 * Handles both JPEG and PNG transparently.
 *
 * @param {import('pdf-lib').PDFDocument} pdfDoc
 * @param {File} file
 * @param {Uint8Array} bytes
 */
async function embedImageAsPage(pdfDoc, file, bytes) {
  const isJpeg = file.type === "image/jpeg" || file.type === "image/jpg";

  let embeddedImage;
  try {
    embeddedImage = isJpeg ? await pdfDoc.embedJpg(bytes) : await pdfDoc.embedPng(bytes);
  } catch {
    throw new Error(
      `[jpgToPdfConverter] "${file.name}" could not be embedded. ` +
        "The file may be corrupt or not a valid JPEG/PNG.",
    );
  }

  const { width: origW, height: origH } = embeddedImage;
  const { width: scaledW, height: scaledH } = calcFitDimensions(origW, origH);

  const page = pdfDoc.addPage([PAGE.WIDTH, PAGE.HEIGHT]);
  const x = (PAGE.WIDTH - scaledW) / 2;
  const y = (PAGE.HEIGHT - scaledH) / 2;

  page.drawImage(embeddedImage, { x, y, width: scaledW, height: scaledH });
}

// --- Public API --------------------------------------------------------------

/**
 * Converts an array of JPG/PNG File objects into a single multi-page PDF
 * and triggers a native browser download.
 *
 * @param {File[]} files Array of image Files (JPEG or PNG)
 * @param {string} [fileName] Download filename (default: "converted.pdf")
 * @returns {Promise<void>}
 *
 * @throws {TypeError} If files is not a non-empty array
 * @throws {TypeError} If any file has an unsupported MIME type
 * @throws {Error} If any file is empty or corrupt
 */
export async function convertImagesToPdf(files, fileName = "converted.pdf") {
  if (!Array.isArray(files) || files.length === 0) {
    throw new TypeError('[jpgToPdfConverter] "files" must be a non-empty array of File objects.');
  }

  files.forEach(validateFile);

  const { PDFDocument } = resolvePdfLib();
  const pdfDoc = await PDFDocument.create();

  pdfDoc.getWriter?.()?.setObjectStreamsEnabled?.(true);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    let arrayBuffer;
    try {
      arrayBuffer = await readFileAsArrayBuffer(file);
    } catch (err) {
      throw new Error(`[jpgToPdfConverter] Could not read "${file.name}": ${err.message}`);
    }

    const bytes = new Uint8Array(arrayBuffer);
    await embedImageAsPage(pdfDoc, file, bytes);
  }

  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });

  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const objectUrl = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  URL.revokeObjectURL(objectUrl);
}

/**
 * Lightweight helper: returns true if a File is an accepted image type.
 * Useful for filtering drag-and-drop payloads before conversion.
 *
 * @param {File} file
 * @returns {boolean}
 */
export function isAcceptedImageFile(file) {
  return file instanceof File && ACCEPTED_TYPES.has(file.type.toLowerCase());
}
