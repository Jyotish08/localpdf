"use client";

import JSZip from "jszip";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

type SplitMode = "range" | "all";
type SplitStatus = "idle" | "loading" | "splitting" | "done" | "error";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function PdfIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    </svg>
  );
}

export default function SplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<SplitMode>("range");
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [status, setStatus] = useState<SplitStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultFilename, setResultFilename] = useState("split.pdf");

  const resetResult = useCallback(() => {
    setResultBlob(null);
    setStatus("idle");
    setProgress(0);
    setErrorMessage(null);
  }, []);

  const resetAll = useCallback(() => {
    setFile(null);
    setPdfBytes(null);
    setPageCount(0);
    setStartPage(1);
    setEndPage(1);
    setMode("range");
    setResultBlob(null);
    setStatus("idle");
    setProgress(0);
    setErrorMessage(null);
  }, []);

  const loadPdf = useCallback(
    async (uploaded: File) => {
      setStatus("loading");
      setErrorMessage(null);
      resetResult();

      try {
        const bytes = await uploaded.arrayBuffer();
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const count = pdf.getPageCount();

        setFile(uploaded);
        setPdfBytes(bytes);
        setPageCount(count);
        setStartPage(1);
        setEndPage(count);
        setStatus("idle");
      } catch {
        setStatus("error");
        setErrorMessage(
          "Could not read this PDF. It may be corrupted or password-protected.",
        );
      }
    },
    [resetResult],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const uploaded = acceptedFiles[0];
      if (uploaded) void loadPdf(uploaded);
    },
    [loadPdf],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    maxFiles: 1,
    noClick: file !== null,
    noKeyboard: true,
  });

  const removeFile = () => {
    resetAll();
  };

  const validateRange = (): string | null => {
    if (startPage < 1 || endPage < 1) return "Page numbers must be at least 1.";
    if (startPage > pageCount || endPage > pageCount)
      return `Pages must be between 1 and ${pageCount}.`;
    if (startPage > endPage)
      return "Start page must be less than or equal to end page.";
    return null;
  };

  const handleSplitRange = async () => {
    if (!pdfBytes || !file) return;
    const validation = validateRange();
    if (validation) {
      setErrorMessage(validation);
      return;
    }

    setStatus("splitting");
    setProgress(10);
    setErrorMessage(null);
    setResultBlob(null);

    try {
      const source = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      setProgress(40);

      const indices: number[] = [];
      for (let i = startPage - 1; i <= endPage - 1; i++) indices.push(i);

      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(source, indices);
      pages.forEach((page) => newPdf.addPage(page));

      setProgress(80);
      const result = await newPdf.save();
      const blob = new Blob([result as BlobPart], { type: "application/pdf" });
      const baseName = file.name.replace(/\.pdf$/i, "") || "document";
      const filename = `${baseName}-pages-${startPage}-${endPage}.pdf`;

      setResultBlob(blob);
      setResultFilename(filename);
      setProgress(100);
      setStatus("done");
    } catch {
      setStatus("error");
      setErrorMessage("Failed to extract pages. Please try another PDF.");
    }
  };

  const handleSplitAll = async () => {
    if (!pdfBytes || !file) return;

    setStatus("splitting");
    setProgress(0);
    setErrorMessage(null);
    setResultBlob(null);

    try {
      const source = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const total = source.getPageCount();
      const zip = new JSZip();
      const baseName = file.name.replace(/\.pdf$/i, "") || "document";

      for (let i = 0; i < total; i++) {
        const newPdf = await PDFDocument.create();
        const [page] = await newPdf.copyPages(source, [i]);
        newPdf.addPage(page);
        const pageBytes = await newPdf.save();
        zip.file(`${baseName}-page-${i + 1}.pdf`, pageBytes);
        setProgress(Math.round(((i + 1) / total) * 100));
      }

      const zipBlob = await zip.generateAsync(
        { type: "blob" },
        (metadata) => {
          if (metadata.percent) {
            setProgress(Math.round(metadata.percent));
          }
        },
      );

      setResultBlob(zipBlob);
      setResultFilename(`${baseName}-pages.zip`);
      setStatus("done");
    } catch {
      setStatus("error");
      setErrorMessage("Failed to split PDF. Please try another file.");
    }
  };

  const handleSplit = () => {
    if (mode === "range") void handleSplitRange();
    else void handleSplitAll();
  };

  const isLoading = status === "loading";
  const isSplitting = status === "splitting";
  const isDone = status === "done" && resultBlob !== null;
  const hasFile = file !== null && pageCount > 0;
  const rangeError = hasFile && mode === "range" ? validateRange() : null;
  const canSplit =
    hasFile && !isSplitting && !isLoading && (mode === "all" || !rangeError);

  return (
    <div className="flex min-h-full flex-col bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-sm font-bold text-white shadow-md shadow-teal-500/25">
              PDF
            </span>
            <span className="text-lg font-semibold tracking-tight text-slate-900">
              PDFTools
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 transition hover:text-teal-600"
          >
            ← All tools
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Split PDF
          </h1>
          <p className="mt-2 text-slate-600">
            Extract a page range or split every page — all on your device.
          </p>
        </div>

        {!hasFile && (
          <div
            {...getRootProps()}
            className={`relative rounded-2xl border-2 border-dashed px-4 py-10 text-center transition sm:py-14 ${
              isDragActive
                ? "border-teal-500 bg-teal-50/80"
                : "border-slate-300 bg-white hover:border-teal-400 hover:bg-teal-50/30"
            }`}
          >
            <input {...getInputProps()} aria-label="Upload PDF file" />
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/25">
              <svg
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m0 0l7.5-7.5m0 0L7.5 16.5M12 3v13.5"
                />
              </svg>
            </div>
            <p className="mt-4 text-base font-semibold text-slate-900">
              {isDragActive ? "Drop your PDF here" : "Drag & drop a PDF file"}
            </p>
            <p className="mt-1 text-sm text-slate-500">or</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              className="mt-3 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-500/20 transition hover:from-teal-500 hover:to-emerald-500"
            >
              Browse files
            </button>
            <p className="mt-4 text-xs text-slate-400">
              One PDF at a time. Files stay on your device.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-6">
            <div
              className="h-5 w-5 animate-spin rounded-full border-2 border-teal-200 border-t-teal-600"
              aria-hidden
            />
            <p className="text-sm font-medium text-slate-700">Reading PDF…</p>
          </div>
        )}

        {hasFile && file && (
          <>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:gap-4 sm:p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <PdfIcon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500 sm:text-sm">
                  {formatBytes(file.size)} · {pageCount} page
                  {pageCount !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 hover:text-red-600"
                aria-label="Remove PDF"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-teal-200/60 bg-teal-50/80 px-4 py-3 text-center text-sm font-medium text-teal-800">
              This PDF has {pageCount} page{pageCount !== 1 ? "s" : ""}
            </div>

            {/* Tabs */}
            <div
              className="mt-6 flex rounded-xl border border-slate-200 bg-slate-100 p-1"
              role="tablist"
              aria-label="Split mode"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === "range"}
                onClick={() => {
                  setMode("range");
                  resetResult();
                }}
                className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition sm:px-4 ${
                  mode === "range"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Page range
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "all"}
                onClick={() => {
                  setMode("all");
                  resetResult();
                }}
                className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition sm:px-4 ${
                  mode === "all"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Split all pages
              </button>
            </div>

            {/* Mode panels */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              {mode === "range" ? (
                <div role="tabpanel">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Extract page range
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Enter the first and last page to extract into a new PDF.
                  </p>

                  <div className="mt-5 flex items-center justify-center gap-3">
                    <label className="sr-only" htmlFor="start-page">
                      Start page
                    </label>
                    <input
                      id="start-page"
                      type="number"
                      min={1}
                      max={pageCount}
                      value={startPage}
                      onChange={(e) => {
                        setStartPage(Number(e.target.value));
                        resetResult();
                      }}
                      className="w-full max-w-[5.5rem] rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-center text-lg font-semibold text-slate-900 outline-none ring-teal-500/0 transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
                    />
                    <span
                      className="shrink-0 text-lg font-medium text-slate-400"
                      aria-hidden
                    >
                      —
                    </span>
                    <label className="sr-only" htmlFor="end-page">
                      End page
                    </label>
                    <input
                      id="end-page"
                      type="number"
                      min={1}
                      max={pageCount}
                      value={endPage}
                      onChange={(e) => {
                        setEndPage(Number(e.target.value));
                        resetResult();
                      }}
                      className="w-full max-w-[5.5rem] rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-center text-lg font-semibold text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  <p className="mt-3 text-center text-xs text-slate-500">
                    Valid range: 1 – {pageCount}
                  </p>
                  {rangeError && (
                    <p className="mt-3 text-center text-sm text-red-600">
                      {rangeError}
                    </p>
                  )}
                </div>
              ) : (
                <div role="tabpanel">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Split every page
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Creates {pageCount} separate PDF{pageCount !== 1 ? "s" : ""}{" "}
                    — one per page — packaged in a ZIP file.
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    <svg
                      className="h-5 w-5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5a1.125 1.125 0 00-1.125-1.125H3.375a1.125 1.125 0 00-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                      />
                    </svg>
                    Large PDFs may take a moment to process.
                  </div>
                </div>
              )}
            </div>

            {/* Add more files via drop when file exists */}
            <div
              {...getRootProps()}
              className={`mt-4 rounded-xl border border-dashed px-4 py-4 text-center text-sm transition ${
                isDragActive
                  ? "border-teal-500 bg-teal-50"
                  : "border-slate-200 bg-white text-slate-500 hover:border-teal-300"
              }`}
            >
              <input {...getInputProps()} aria-label="Replace PDF file" />
              Drop a different PDF to replace this one
            </div>
          </>
        )}

        {/* Progress */}
        {isSplitting && (
          <div
            className="mt-8 rounded-2xl border border-teal-200/60 bg-white p-5 shadow-sm"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-3">
              <div
                className="h-5 w-5 animate-spin rounded-full border-2 border-teal-200 border-t-teal-600"
                aria-hidden
              />
              <p className="text-sm font-semibold text-slate-900">
                Splitting PDF… {progress}%
              </p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {status === "error" && errorMessage && !hasFile && (
          <p
            className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        {hasFile && errorMessage && status === "error" && (
          <p
            className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        {/* Actions */}
        {hasFile && (
          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
            {isDone ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (resultBlob) downloadBlob(resultBlob, resultFilename);
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-500/30 transition hover:from-teal-500 hover:to-emerald-500 sm:w-auto"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12M12 16.5V3"
                    />
                  </svg>
                  Download {mode === "all" ? "ZIP" : "PDF"}
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                >
                  Split again
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleSplit}
                disabled={!canSplit}
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-500/30 transition enabled:hover:from-teal-500 enabled:hover:to-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {mode === "range" ? "Extract pages" : "Split all pages"}
              </button>
            )}
          </div>
        )}

        {isDone && (
          <p className="mt-4 text-center text-sm text-slate-500">
            Ready: <span className="font-medium text-slate-700">{resultFilename}</span>
          </p>
        )}
      </main>
    </div>
  );
}
