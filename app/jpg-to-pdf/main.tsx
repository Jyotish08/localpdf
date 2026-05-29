"use client";

import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import AppShell from "../components/AppShell";
import { formatBytes } from "../lib/format-bytes";
import { convertImagesToPdf, isAcceptedImageFile } from "../lib/jpgToPdfConverter";

type ConvertStatus = "idle" | "converting" | "done" | "error";

const INPUT_ACCEPT = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

let pdfLibReady: Promise<void> | null = null;

async function ensurePdfLibGlobal() {
  if (typeof window === "undefined") return;

  const globalWindow = window as Window & { PDFLib?: typeof import("pdf-lib") };
  if (globalWindow.PDFLib) return;

  if (!pdfLibReady) {
    pdfLibReady = import("pdf-lib").then((mod) => {
      globalWindow.PDFLib = mod;
    });
  }

  try {
    await pdfLibReady;
  } catch (err) {
    pdfLibReady = null;
    throw err;
  }
}

function buildOutputFileName(files: File[]) {
  if (files.length === 1) {
    const baseName = files[0].name.replace(/\.[^.]+$/, "") || "image";
    return `${baseName}.pdf`;
  }

  return "converted-images.pdf";
}

function describeSelectedFiles(files: File[]) {
  if (files.length === 1) return files[0].name;
  if (files.length === 2) return `${files[0].name} and ${files[1].name}`;
  return `${files[0].name} and ${files.length - 1} more files`;
}

export default function JpgToPdfMain() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<ConvertStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalSize = useMemo(() => files.reduce((sum, file) => sum + file.size, 0), [files]);

  const runConversion = useCallback(async (incoming: File[]) => {
    if (incoming.length === 0) return;

    setStatus("converting");
    setErrorMessage(null);
    toast.loading("Converting images to PDF...", { id: "jpg2pdf" });

    try {
      await ensurePdfLibGlobal();
      await convertImagesToPdf(incoming, buildOutputFileName(incoming));

      setStatus("done");
      toast.success("PDF download started.", { id: "jpg2pdf" });
    } catch (err) {
      const fallback = "Could not convert the selected images.";
      const message = err instanceof Error ? err.message.replace(/^\[jpgToPdfConverter\]\s*/, "") : fallback;

      setStatus("error");
      setErrorMessage(message);
      toast.error(message || fallback, { id: "jpg2pdf" });
    }
  }, []);

  const handleIncomingFiles = useCallback(
    (incoming: File[]) => {
      if (status === "converting") return;

      const accepted = incoming.filter(isAcceptedImageFile);

      if (accepted.length === 0) {
        toast.error("Only JPEG and PNG images are accepted.");
        return;
      }

      if (accepted.length !== incoming.length) {
        toast.error("Some files were skipped because only JPEG and PNG are supported.");
      }

      setFiles(accepted);
      void runConversion(accepted);
    },
    [runConversion, status],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: INPUT_ACCEPT,
    multiple: true,
    noClick: true,
    noKeyboard: true,
    onDrop: handleIncomingFiles,
    onDropRejected: (rejections) => {
      const err = rejections[0]?.errors[0];
      if (err?.code === "file-too-large") {
        toast.error("One of the images exceeds the allowed file size.");
      } else {
        toast.error("Only JPEG and PNG images are accepted.");
      }
    },
  });

  const isConverting = status === "converting";
  const isDone = status === "done";
  const isError = status === "error";
  const hasFiles = files.length > 0;

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.5-4.5 3 3L17 9l3 3m-2 7H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">JPG to PDF</h1>
          </div>
          <p className="text-muted">
            Turn JPEG and PNG images into a single PDF directly in your browser. Nothing is uploaded.
          </p>
        </div>

        <div
          {...getRootProps()}
          className={`relative rounded-2xl border-2 border-dashed px-4 py-10 text-center transition sm:py-14 ${
            isDragActive
              ? "border-orange-500 bg-orange-500/5"
              : "border-border bg-card hover:border-orange-500/40 hover:bg-orange-500/5"
          }`}
        >
          <input {...getInputProps({ id: "file-input", "aria-label": "Upload images" })} />

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/25">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m0 0l7.5-7.5m0 0L7.5 16.5M12 3v13.5" />
            </svg>
          </div>

          <p className="mt-4 text-base font-semibold text-foreground">
            {isDragActive ? "Drop your images here" : "Drag & drop JPG or PNG files"}
          </p>
          <p className="mt-1 text-sm text-muted">or</p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              disabled={isConverting}
              className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Browse files
            </button>
            <p className="text-xs text-muted">JPEG and PNG only</p>
          </div>
        </div>

        {hasFiles && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-foreground">
                  {files.length} file{files.length !== 1 ? "s" : ""} ready
                </h2>
                <p className="mt-1 text-sm text-muted">{describeSelectedFiles(files)}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFiles([]);
                  setStatus("idle");
                  setErrorMessage(null);
                }}
                disabled={isConverting}
                className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted transition hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                Clear
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {files.map((file) => (
                <div key={`${file.name}-${file.size}`} className="flex items-center justify-between gap-3 rounded-xl bg-background px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted">{formatBytes(file.size)}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-500">
                    Image
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-4 text-sm text-muted">
              Total size: <span className="font-medium text-foreground">{formatBytes(totalSize)}</span>
            </p>
          </div>
        )}

        {isConverting && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-orange-500/30 border-t-orange-500" aria-hidden />
              <p className="text-sm font-semibold text-foreground">Converting images to PDF...</p>
            </div>
            <p className="mt-2 text-sm text-muted">Please keep this tab open until the download starts.</p>
          </div>
        )}

        {isDone && !isConverting && (
          <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 shadow-sm">
            <p className="font-semibold text-foreground">Download started</p>
            <p className="mt-1 text-sm text-muted">Your PDF should download automatically. If it does not, check your browser download bar.</p>
          </div>
        )}

        {isError && errorMessage && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/5 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground">Conversion failed</p>
                <p className="mt-1 text-sm text-muted">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </AppShell>
  );
}
