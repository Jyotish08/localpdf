import * as pdfjsLib from "pdfjs-dist";
import imageCompression from "browser-image-compression";
import { PDFDocument } from "pdf-lib";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

const IMAGE_OPS = new Set(
  [
    pdfjsLib.OPS.paintImageXObject,
    pdfjsLib.OPS.paintInlineImageXObject,
    pdfjsLib.OPS.paintImageMaskXObject,
    pdfjsLib.OPS.paintImageXObjectRepeat,
    pdfjsLib.OPS.paintImageMaskXObjectRepeat,
    pdfjsLib.OPS.paintInlineImageXObjectGroup,
    pdfjsLib.OPS.paintImageXObjectGroup,
    pdfjsLib.OPS.paintJpegXObject,
  ].filter((op) => typeof op === "number"),
);

const CHUNK_SIZE = 5;

let aborted = false;

function postProgress(stage, current, total) {
  self.postMessage({ type: "progress", stage, current, total });
}

function assertNotAborted() {
  if (aborted) {
    throw new DOMException("Compression cancelled by user.", "AbortError");
  }
}

async function sha256(bytes) {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function cloneWarnings(warnings) {
  return Array.isArray(warnings) ? warnings.slice() : [];
}

function preserveMetadata(sourceDoc, outDoc) {
  const title = sourceDoc.getTitle?.();
  const author = sourceDoc.getAuthor?.();
  const subject = sourceDoc.getSubject?.();
  const keywords = formatKeywords(sourceDoc.getKeywords?.());
  const creator = sourceDoc.getCreator?.();
  const producer = sourceDoc.getProducer?.();
  const creationDate = sourceDoc.getCreationDate?.();
  const modificationDate = sourceDoc.getModificationDate?.();

  if (title) outDoc.setTitle(title);
  if (author) outDoc.setAuthor(author);
  if (subject) outDoc.setSubject(subject);
  if (keywords?.length) outDoc.setKeywords(keywords);
  if (creator) outDoc.setCreator(creator);
  if (producer) outDoc.setProducer(producer);
  if (creationDate instanceof Date) outDoc.setCreationDate(creationDate);
  if (modificationDate instanceof Date) outDoc.setModificationDate(modificationDate);
}

function formatKeywords(keywords) {
  if (!keywords) return undefined;
  return keywords
    .split(/[;,]/)
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

async function getOperatorPlan(pdfjsDoc, totalPages) {
  const plans = [];
  let unsupportedImages = 0;
  let imagePageCount = 0;

  postProgress("extracting", 0, totalPages);

  for (let i = 0; i < totalPages; i++) {
    assertNotAborted();

    try {
      const page = await pdfjsDoc.getPage(i + 1);
      const opList = await page.getOperatorList();
      const hasImages = opList.fnArray.some((fn) => IMAGE_OPS.has(fn));

      if (hasImages) imagePageCount += 1;
      plans.push({ hasImages });
    } catch {
      unsupportedImages += 1;
      plans.push({ hasImages: false, unsupported: true });
    }

    postProgress("extracting", i + 1, totalPages);
  }

  return { plans, imagePageCount, unsupportedImages };
}

async function renderPageToCompressedJpeg(page, preset) {
  const baseViewport = page.getViewport({ scale: 1 });
  const maxDimension = Math.max(baseViewport.width, baseViewport.height);
  const renderScale = maxDimension > preset.imageMaxWidthPx ? preset.imageMaxWidthPx / maxDimension : 1;
  const viewport = page.getViewport({ scale: renderScale });

  let canvas = null;
  let ctx = null;
  let bitmap = null;
  let renderTask = null;

  try {
    canvas = new OffscreenCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    ctx = canvas.getContext("2d", { alpha: false });

    if (!ctx) {
      throw new Error("Canvas is not supported in this browser.");
    }

    renderTask = page.render({ canvasContext: ctx, viewport });
    await renderTask.promise;

    const renderedBlob = await canvas.convertToBlob({
      type: "image/jpeg",
      quality: preset.imageQuality,
    });

    const renderedFile = new File([renderedBlob], "page.jpg", {
      type: "image/jpeg",
      lastModified: Date.now(),
    });

    const compressed = await imageCompression(renderedFile, {
      maxSizeMB: preset.imageMaxSizeMB,
      maxWidthOrHeight: preset.imageMaxWidthPx,
      useWebWorker: true,
      fileType: "image/jpeg",
      initialQuality: preset.imageQuality,
      alwaysKeepResolution: false,
    });

    const compressedBytes = new Uint8Array(await compressed.arrayBuffer());

    if (bitmap?.close) bitmap.close();
    if (canvas) {
      canvas.width = 0;
      canvas.height = 0;
    }

    return {
      compressedBytes,
      width: viewport.width,
      height: viewport.height,
      sourceBytes: renderedBlob.size,
    };
  } finally {
    if (renderTask?.cancel) {
      renderTask.cancel();
    }
    if (bitmap?.close) {
      bitmap.close();
    }
    if (canvas) {
      canvas.width = 0;
      canvas.height = 0;
      canvas = null;
    }
    ctx = null;
    bitmap = null;
  }
}

self.addEventListener("message", async (event) => {
  const message = event.data || {};
  if (message.type === "abort") {
    aborted = true;
    return;
  }

  if (message.type !== "compress") {
    return;
  }

  aborted = false;

  const { file, preset } = message;
  const originalBytes = file.size;
  const warnings = [];
  const startedAt = performance.now();

  try {
    assertNotAborted();
    postProgress("loading", 0, 1);

    const pdfBytes = await file.arrayBuffer();
    let sourceDoc;

    try {
      sourceDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: false });
    } catch (err) {
      const messageText = err instanceof Error ? err.message : String(err);
      if (messageText.toLowerCase().includes("encrypt")) {
        throw new Error("This PDF is password-protected and cannot be compressed.");
      }
      throw new Error("Could not parse this PDF. The file may be corrupt or malformed.");
    }

    const pdfjsDoc = await pdfjsLib.getDocument({
      data: new Uint8Array(pdfBytes),
      isOffscreenCanvasSupported: true,
      disableFontFace: true,
      useSystemFonts: true,
      isEvalSupported: false,
    }).promise;

    const totalPages = pdfjsDoc.numPages;
    const { plans, imagePageCount, unsupportedImages } = await getOperatorPlan(pdfjsDoc, totalPages);

    if (unsupportedImages > 0) {
      warnings.push(`${unsupportedImages} page${unsupportedImages === 1 ? "" : "s"} contained unsupported image streams and were copied without image recompression.`);
    }

    if (originalBytes > 100 * 1024 * 1024) {
      throw new Error("File exceeds the 100 MB client-side processing limit. Use a desktop tool for files this large.");
    }

    if (originalBytes < 10 * 1024) {
      warnings.push("File is already very small — compression gains may be negligible.");
    }

    if (imagePageCount === 0) {
      const baselineBytes = await sourceDoc.save({ useObjectStreams: true });
      const compressedBytes = baselineBytes.byteLength;
      const savingsPercent = compressedBytes >= originalBytes ? "0" : ((originalBytes - compressedBytes) / originalBytes * 100).toFixed(1);

      if (compressedBytes >= originalBytes) {
        warnings.push("No size reduction achieved at this compression level. Try a higher preset.");
      } else {
        warnings.push("No embedded images were detected; only structural compression was applied.");
      }

      const result = {
        originalBytes,
        compressedBytes,
        savingsPercent,
        imagesProcessed: 0,
        unsupportedImages,
        duplicateImages: 0,
        hadImages: false,
        cancelled: false,
        warnings: cloneWarnings(warnings),
        processingTimeMs: Math.round(performance.now() - startedAt),
      };

      self.postMessage({ type: "complete", result, pdfBytes: baselineBytes }, [baselineBytes.buffer]);
      return;
    }

    const outDoc = await PDFDocument.create();
    preserveMetadata(sourceDoc, outDoc);

    const processedHashes = new Map();
    let imagesProcessed = 0;
    let duplicateImages = 0;

    for (let start = 0; start < totalPages; start += CHUNK_SIZE) {
      assertNotAborted();

      const end = Math.min(start + CHUNK_SIZE, totalPages);
      for (let index = start; index < end; index++) {
        assertNotAborted();
        const pageNumber = index + 1;
        const plan = plans[index];
        const page = await pdfjsDoc.getPage(pageNumber);

        if (!plan?.hasImages) {
          const [copiedPage] = await outDoc.copyPages(sourceDoc, [index]);
          outDoc.addPage(copiedPage);
          try {
            await page.cleanup();
          } catch {}
          continue;
        }

        postProgress("compressing", imagesProcessed, imagePageCount);

        const raster = await renderPageToCompressedJpeg(page, preset);
        const hash = await sha256(raster.compressedBytes);
        const cached = processedHashes.get(hash);

        let pageImageBytes = raster.compressedBytes;
        if (cached) {
          duplicateImages += 1;
          pageImageBytes = cached;
        } else {
          processedHashes.set(hash, raster.compressedBytes);
        }

        const embedded = await outDoc.embedJpg(pageImageBytes);
        const pdfPage = outDoc.addPage([raster.width, raster.height]);
        pdfPage.drawImage(embedded, {
          x: 0,
          y: 0,
          width: raster.width,
          height: raster.height,
        });

        imagesProcessed += 1;
        postProgress("compressing", imagesProcessed, imagePageCount);

        try {
          await page.cleanup();
        } catch {}
      }

      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    postProgress("saving", 0, 1);

    const outBytes = await outDoc.save({ useObjectStreams: true });
    const compressedBytes = outBytes.byteLength;
    const savingsPercent =
      compressedBytes >= originalBytes ? "0" : ((originalBytes - compressedBytes) / originalBytes * 100).toFixed(1);

    if (compressedBytes >= originalBytes) {
      warnings.push("No size reduction achieved at this compression level. Try a higher preset.");
    }

    const result = {
      originalBytes,
      compressedBytes,
      savingsPercent,
      imagesProcessed,
      unsupportedImages,
      duplicateImages,
      hadImages: imagePageCount > 0,
      cancelled: false,
      warnings: cloneWarnings(warnings),
      processingTimeMs: Math.round(performance.now() - startedAt),
    };

    self.postMessage({ type: "complete", result, pdfBytes: outBytes }, [outBytes.buffer]);
  } catch (err) {
    const messageText = err instanceof Error ? err.message : String(err);
    self.postMessage({ type: "error", message: messageText });
  } finally {
    try {
      await pdfjsDoc?.cleanup?.();
    } catch {}
    try {
      await pdfjsDoc?.destroy?.();
    } catch {}
  }
});
