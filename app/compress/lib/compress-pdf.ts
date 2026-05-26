import { PDFDocument } from "pdf-lib";

let pdfjsReady = false;

async function getPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  if (!pdfjsReady && typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    pdfjsReady = true;
  }
  return pdfjs;
}

function canvasToJpegBytes(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          reject(new Error("Failed to encode page as JPEG"));
          return;
        }
        resolve(new Uint8Array(await blob.arrayBuffer()));
      },
      "image/jpeg",
      quality,
    );
  });
}

export async function compressPdf(
  data: ArrayBuffer,
  jpegQuality: number,
  onProgress: (percent: number) => void,
): Promise<Uint8Array> {
  const { getDocument } = await getPdfjs();
  const pdfData = new Uint8Array(data);
  const pdf = await getDocument({ data: pdfData }).promise;
  const numPages = pdf.numPages;
  const outPdf = await PDFDocument.create();

  try {
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const baseViewport = page.getViewport({ scale: 1 });
      const renderScale = 2;
      const viewport = page.getViewport({ scale: renderScale });

      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is not supported in this browser");

      await page.render({ canvasContext: ctx, viewport, canvas }).promise;

      const jpegBytes = await canvasToJpegBytes(canvas, jpegQuality);
      const image = await outPdf.embedJpg(jpegBytes);
      const pdfPage = outPdf.addPage([
        baseViewport.width,
        baseViewport.height,
      ]);

      pdfPage.drawImage(image, {
        x: 0,
        y: 0,
        width: baseViewport.width,
        height: baseViewport.height,
      });

      page.cleanup();
      onProgress(Math.round((i / numPages) * 100));
    }
  } finally {
    await pdf.destroy();
  }

  return await outPdf.save();
}
