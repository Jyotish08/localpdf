"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import AppShell from "../components/AppShell";
import { formatBytes } from "../lib/format-bytes";
import { convertPdfToJpg, isValidPdfFile } from "../lib/pdfToJpgConverter";

const MAX_SIZE = 500 * 1024 * 1024;

export default function PdfToJpgMain() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const resetState = useCallback(() => {
    setFile(null);
    setStatus("idle");
    setErrorMessage(null);
    setProgress({ current: 0, total: 0 });
  }, []);

  const progressPercent = progress.total ? Math.round((progress.current / progress.total) * 100) : 0;

  const handleConvert = useCallback(async (incomingFile) => {
    if (!incomingFile || status === "converting") return;

    if (!isValidPdfFile(incomingFile)) {
      toast.error("Please select a valid PDF file.");
      return;
    }

    setFile(incomingFile);
    setStatus("converting");
    setErrorMessage(null);
    setProgress({ current: 0, total: 0 });

    toast.loading("Converting PDF to JPG...", { id: "pdf2jpg" });

    try {
      await convertPdfToJpg(incomingFile, (current, total) => {
        setProgress({ current, total });
      });
      setStatus("done");
      toast.success("Download started.", { id: "pdf2jpg" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not convert this PDF.";
      setStatus("error");
      setErrorMessage(message);
      toast.error(message, { id: "pdf2jpg" });
    }
  }, [status]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    void handleConvert(acceptedFiles[0]);
  }, [handleConvert]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    maxFiles: 1,
    maxSize: MAX_SIZE,
    noClick: true,
    noKeyboard: true,
    onDropRejected: (rejections) => {
      const err = rejections[0]?.errors[0];
      if (err?.code === "file-too-large") {
        toast.error("File exceeds the 500 MB limit.");
      } else {
        toast.error("Please select a valid PDF file.");
      }
    },
  });

  const fileName = file?.name ?? "No file selected";
  const isConverting = status === "converting";
  const isDone = status === "done";
  const isError = status === "error";

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m-7-6h6l5 5v10a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">PDF to JPG</h1>
          </div>
          <p className="text-muted">
            Extract every page from a PDF as high-resolution JPG images. One page becomes a JPG, multiple pages become a ZIP file.
          </p>
        </div>

        {!isConverting && (
          <div
            {...getRootProps()}
            className={`relative rounded-2xl border-2 border-dashed px-4 py-10 text-center transition sm:py-14 ${
              isDragActive
                ? "border-sky-500 bg-sky-500/5"
                : "border-border bg-card hover:border-sky-500/40 hover:bg-sky-500/5"
            }`}
          >
            <input {...getInputProps({ id: "file-input", "aria-label": "Upload PDF file" })} />

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/25">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m0 0l7.5-7.5m0 0L7.5 16.5M12 3v13.5" />
              </svg>
            </div>

            <p className="mt-4 text-base font-semibold text-foreground">
              {isDragActive ? "Drop your PDF here" : "Drag & drop a PDF file"}
            </p>
            <p className="mt-1 text-sm text-muted">or</p>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  open();
                }}
                className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
              >
                Browse file
              </button>
              <p className="text-xs text-muted">PDF only, processed locally</p>
            </div>
          </div>
        )}

        {file && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-foreground">{fileName}</h2>
                <p className="mt-1 text-sm text-muted">{formatBytes(file.size)}</p>
              </div>

              {!isConverting && (
                <button
                  type="button"
                  onClick={resetState}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted transition hover:bg-background hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {isConverting && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-sky-500/30 border-t-sky-500" aria-hidden />
              <p className="text-sm font-semibold text-foreground">
                Converting pages... {progress.current}/{progress.total || "?"}
              </p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-sky-500 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="mt-2 text-sm text-muted">Please keep this tab open until the download starts.</p>
          </div>
        )}

        {isDone && !isConverting && (
          <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 shadow-sm">
            <p className="font-semibold text-foreground">Download started</p>
            <p className="mt-1 text-sm text-muted">Your JPG or ZIP file should begin downloading automatically.</p>
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
