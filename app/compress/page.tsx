"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { compressPdf } from "./lib/compress-pdf";

type CompressionLevel = "low" | "medium" | "high";
type CompressStatus = "idle" | "loading" | "compressing" | "done" | "error";

const LEVELS: {
  id: CompressionLevel;
  label: string;
  description: string;
  quality: number;
}[] = [
  {
    id: "low",
    label: "Low compression",
    description: "Better quality",
    quality: 0.85,
  },
  {
    id: "medium",
    label: "Medium compression",
    description: "Balanced",
    quality: 0.6,
  },
  {
    id: "high",
    label: "High compression",
    description: "Smallest size",
    quality: 0.35,
  },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
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

export default function CompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [level, setLevel] = useState<CompressionLevel>("medium");
  const [status, setStatus] = useState<CompressStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [compressedBytes, setCompressedBytes] = useState<Uint8Array | null>(
    null,
  );
  const [compressedSize, setCompressedSize] = useState(0);

  const resetResult = useCallback(() => {
    setCompressedBytes(null);
    setCompressedSize(0);
    setStatus("idle");
    setProgress(0);
    setErrorMessage(null);
  }, []);

  const resetAll = useCallback(() => {
    setFile(null);
    setPdfBytes(null);
    setOriginalSize(0);
    setLevel("medium");
    setCompressedBytes(null);
    setCompressedSize(0);
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
        setFile(uploaded);
        setPdfBytes(bytes);
        setOriginalSize(uploaded.size);
        setStatus("idle");
      } catch {
        setStatus("error");
        setErrorMessage("Could not read this PDF. Please try another file.");
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

  const selectedQuality =
    LEVELS.find((l) => l.id === level)?.quality ?? 0.6;

  const handleCompress = async () => {
    if (!pdfBytes || !file) return;

    setStatus("compressing");
    setProgress(0);
    setErrorMessage(null);
    setCompressedBytes(null);

    try {
      const result = await compressPdf(
        pdfBytes,
        selectedQuality,
        setProgress,
      );
      setCompressedBytes(result);
      setCompressedSize(result.byteLength);
      setStatus("done");
    } catch {
      setStatus("error");
      setErrorMessage(
        "Compression failed. The PDF may be encrypted or unsupported.",
      );
    }
  };

  const handleDownload = () => {
    if (!compressedBytes || !file) return;
    const blob = new Blob([compressedBytes as BlobPart], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const baseName = file.name.replace(/\.pdf$/i, "") || "document";
    anchor.href = url;
    anchor.download = `${baseName}-compressed.pdf`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const hasFile = file !== null && pdfBytes !== null;
  const isLoading = status === "loading";
  const isCompressing = status === "compressing";
  const isDone = status === "done" && compressedBytes !== null;
  const canCompress = hasFile && !isCompressing && !isLoading;

  const percentReduced =
    originalSize > 0 && compressedSize > 0
      ? ((originalSize - compressedSize) / originalSize) * 100
      : 0;

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
            Compress PDF
          </h1>
          <p className="mt-2 text-slate-600">
            Re-render pages as optimized JPEGs to shrink file size — no server
            required.
          </p>
        </div>

        <p className="mb-6 flex items-start gap-2 rounded-xl border border-teal-200/60 bg-teal-50/80 px-4 py-3 text-sm text-teal-800">
          <svg
            className="mt-0.5 h-4 w-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>
          Files never leave your device — processed entirely in your browser.
        </p>

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
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-6">
            <div
              className="h-5 w-5 animate-spin rounded-full border-2 border-teal-200 border-t-teal-600"
              aria-hidden
            />
            <p className="text-sm font-medium text-slate-700">Loading PDF…</p>
          </div>
        )}

        {hasFile && file && (
          <>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:gap-4 sm:p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                <PdfIcon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500 sm:text-sm">
                  Original size:{" "}
                  <span className="font-medium text-slate-700">
                    {formatBytes(originalSize)}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={resetAll}
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

            <div className="mt-8">
              <h2 className="text-sm font-semibold text-slate-900">
                Compression level
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {LEVELS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setLevel(option.id);
                      resetResult();
                    }}
                    disabled={isCompressing}
                    className={`rounded-xl border px-4 py-4 text-left transition disabled:opacity-60 ${
                      level === option.id
                        ? "border-teal-500 bg-teal-50 ring-2 ring-teal-500/30"
                        : "border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/40"
                    }`}
                  >
                    <p
                      className={`text-sm font-semibold ${
                        level === option.id
                          ? "text-teal-800"
                          : "text-slate-900"
                      }`}
                    >
                      {option.label}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {option.description}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      JPEG {Math.round(option.quality * 100)}%
                    </p>
                  </button>
                ))}
              </div>
            </div>

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

        {isCompressing && (
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
                Compressing… {progress}%
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

        {status === "error" && errorMessage && (
          <p
            className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        {isDone && (
          <div className="mt-8 rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-teal-50 to-emerald-50/80 p-6">
            <h2 className="text-sm font-semibold text-slate-900">
              Compression complete
            </h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Original
                </dt>
                <dd className="mt-1 text-lg font-semibold text-slate-900">
                  {formatBytes(originalSize)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Compressed
                </dt>
                <dd className="mt-1 text-lg font-semibold text-teal-700">
                  {formatBytes(compressedSize)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Reduced
                </dt>
                <dd className="mt-1 text-lg font-semibold text-emerald-700">
                  {percentReduced > 0
                    ? `${percentReduced.toFixed(1)}%`
                    : percentReduced < 0
                      ? `+${Math.abs(percentReduced).toFixed(1)}% larger`
                      : "0%"}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {hasFile && (
          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
            {isDone ? (
              <>
                <button
                  type="button"
                  onClick={handleDownload}
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
                  Download compressed PDF
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                >
                  Compress again
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => void handleCompress()}
                disabled={!canCompress}
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-500/30 transition enabled:hover:from-teal-500 enabled:hover:to-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Compress PDF
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
