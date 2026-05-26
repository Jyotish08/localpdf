"use client";

import Link from "next/link";
import { PDFDocument } from "pdf-lib";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

type PdfItem = {
  id: string;
  file: File;
};

type MergeStatus = "idle" | "merging" | "done" | "error";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

export default function MergePage() {
  const [items, setItems] = useState<PdfItem[]>([]);
  const [status, setStatus] = useState<MergeStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mergedBytes, setMergedBytes] = useState<Uint8Array | null>(null);

  const dragIndex = useRef<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  const clearMerged = useCallback(() => {
    setMergedBytes(null);
    setStatus("idle");
    setProgress(0);
    setErrorMessage(null);
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const newItems: PdfItem[] = acceptedFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
      }));
      setItems((prev) => [...prev, ...newItems]);
      clearMerged();
    },
    [clearMerged],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: true,
    noClick: items.length > 0,
    noKeyboard: true,
  });

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    clearMerged();
  };

  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverIndex.current = index;
  };

  const handleDragEnd = () => {
    const from = dragIndex.current;
    const to = dragOverIndex.current;
    if (from === null || to === null || from === to) {
      dragIndex.current = null;
      dragOverIndex.current = null;
      return;
    }
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    clearMerged();
    dragIndex.current = null;
    dragOverIndex.current = null;
  };

  const handleMerge = async () => {
    if (items.length < 2) return;

    setStatus("merging");
    setProgress(0);
    setErrorMessage(null);
    setMergedBytes(null);

    try {
      const mergedPdf = await PDFDocument.create();
      const total = items.length;

      for (let i = 0; i < total; i++) {
        const bytes = await items[i].file.arrayBuffer();
        const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pageIndices = source.getPageIndices();
        const copiedPages = await mergedPdf.copyPages(source, pageIndices);
        copiedPages.forEach((page) => mergedPdf.addPage(page));
        setProgress(Math.round(((i + 1) / total) * 100));
      }

      const result = await mergedPdf.save();
      setMergedBytes(result);
      setStatus("done");
    } catch {
      setStatus("error");
      setErrorMessage(
        "Could not merge these PDFs. They may be corrupted or password-protected.",
      );
    }
  };

  const handleDownload = () => {
    if (!mergedBytes) return;
    const blob = new Blob([mergedBytes as BlobPart], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "merged.pdf";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const canMerge = items.length >= 2 && status !== "merging";
  const isMerging = status === "merging";
  const isDone = status === "done" && mergedBytes !== null;

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
            Merge PDFs
          </h1>
          <p className="mt-2 text-slate-600">
            Add files, drag to reorder, then merge — all on your device.
          </p>
        </div>

        {/* Upload zone */}
        <div
          {...getRootProps()}
          className={`relative rounded-2xl border-2 border-dashed px-4 py-10 text-center transition sm:py-14 ${
            isDragActive
              ? "border-teal-500 bg-teal-50/80"
              : "border-slate-300 bg-white hover:border-teal-400 hover:bg-teal-50/30"
          }`}
        >
          <input {...getInputProps()} aria-label="Upload PDF files" />
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
            {isDragActive ? "Drop your PDFs here" : "Drag & drop PDF files"}
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
            Add at least 2 PDFs to merge. Files stay on your device.
          </p>
        </div>

        {/* File list */}
        {items.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700">
                {items.length} file{items.length !== 1 ? "s" : ""} — drag to
                reorder
              </h2>
              <button
                type="button"
                onClick={() => {
                  setItems([]);
                  clearMerged();
                }}
                className="text-sm font-medium text-slate-500 transition hover:text-slate-700"
              >
                Clear all
              </button>
            </div>

            <ul className="space-y-3">
              {items.map((item, index) => (
                <li
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className="flex cursor-grab items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm active:cursor-grabbing sm:gap-4 sm:p-4"
                >
                  <span
                    className="flex shrink-0 text-slate-400"
                    aria-hidden
                    title="Drag to reorder"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 8h16M4 16h16"
                      />
                    </svg>
                  </span>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                    <PdfIcon className="h-6 w-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                      {item.file.name}
                    </p>
                    <p className="text-xs text-slate-500 sm:text-sm">
                      {formatBytes(item.file.size)}
                    </p>
                  </div>

                  <span className="hidden shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 sm:inline">
                    {index + 1}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove ${item.file.name}`}
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
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Progress */}
        {isMerging && (
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
                Merging PDFs… {progress}%
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

        {/* Error */}
        {status === "error" && errorMessage && (
          <p
            className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        {/* Actions */}
        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
          {isDone ? (
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
              Download merged PDF
            </button>
          ) : (
            <button
              type="button"
              onClick={handleMerge}
              disabled={!canMerge}
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-500/30 transition enabled:hover:from-teal-500 enabled:hover:to-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {items.length < 2
                ? "Add at least 2 PDFs to merge"
                : "Merge PDFs"}
            </button>
          )}

          {isDone && (
            <button
              type="button"
              onClick={() => {
                clearMerged();
              }}
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
            >
              Merge again
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
