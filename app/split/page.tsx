"use client";

import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import AppShell from "../components/AppShell";
import SizeComparisonBadge from "../components/SizeComparisonBadge";
import ShortcutHint from "../components/ShortcutHint";
import { useFileHistory } from "../components/FileHistoryProvider";

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

export default function SplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<SplitMode>("range");
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [status, setStatus] = useState<SplitStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultFilename, setResultFilename] = useState("split.pdf");

  const { addFile } = useFileHistory();

  const resetResult = useCallback(() => {
    setResultBlob(null);
    setStatus("idle");
    setProgress(0);
  }, []);

  const resetAll = useCallback(() => {
    setFile(null);
    setPdfBytes(null);
    setPageCount(0);
    setStartPage(1);
    setEndPage(1);
    setMode("range");
    resetResult();
  }, [resetResult]);

  const loadPdf = useCallback(
    async (uploaded: File) => {
      setStatus("loading");
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
        toast.error("Could not read this PDF. It may be corrupted or password-protected.", { id: "split-load" });
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
      toast.error(validation, { id: "split" });
      return;
    }

    setStatus("splitting");
    setProgress(10);
    setResultBlob(null);
    toast.loading("Extracting pages...", { id: "split" });

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
      toast.success("Pages extracted successfully!", { id: "split" });
      
      addFile({
        filename,
        size: blob.size,
        timestamp: Date.now(),
        tool: "split"
      });
    } catch {
      setStatus("error");
      toast.error("Failed to extract pages. Please try another PDF.", { id: "split" });
    }
  };

  const handleSplitAll = async () => {
    if (!pdfBytes || !file) return;

    setStatus("splitting");
    setProgress(0);
    setResultBlob(null);
    toast.loading("Splitting all pages...", { id: "split" });

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
      const filename = `${baseName}-pages.zip`;
      setResultFilename(filename);
      setStatus("done");
      toast.success("All pages split successfully!", { id: "split" });
      
      addFile({
        filename,
        size: zipBlob.size,
        timestamp: Date.now(),
        tool: "split"
      });
    } catch {
      setStatus("error");
      toast.error("Failed to split PDF. Please try another file.", { id: "split" });
    }
  };

  const handleSplit = () => {
    if (mode === "range") void handleSplitRange();
    else void handleSplitAll();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.key.toLowerCase() === 'u' && !file) {
        e.preventDefault();
        open();
      } else if (e.key.toLowerCase() === 'd' && status === 'done' && resultBlob) {
        e.preventDefault();
        downloadBlob(resultBlob, resultFilename);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [file, status, resultBlob, resultFilename, open]);

  const isLoading = status === "loading";
  const isSplitting = status === "splitting";
  const isDone = status === "done" && resultBlob !== null;
  const hasFile = file !== null && pageCount > 0;
  const rangeError = hasFile && mode === "range" ? validateRange() : null;
  const canSplit = hasFile && !isSplitting && !isLoading && (mode === "all" || !rangeError);

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-split/10 text-split">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Split PDF
            </h1>
          </div>
          <p className="text-muted">
            Extract a page range or split every page — all on your device.
          </p>
        </div>

        {!hasFile && (
          <div
            {...getRootProps()}
            className={`relative rounded-2xl border-2 border-dashed px-4 py-10 text-center transition sm:py-14 ${
              isDragActive
                ? "border-split bg-split/5"
                : "border-border bg-card hover:border-split/40 hover:bg-split/5"
            }`}
          >
            <input {...getInputProps()} aria-label="Upload PDF file" />
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-split text-white shadow-lg shadow-split/25">
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
                className="inline-flex items-center justify-center rounded-xl bg-split px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
              >
                Browse files
              </button>
              <ShortcutHint shortcut="U" label="Press" />
            </div>
            <p className="mt-4 text-xs text-muted">
              One PDF at a time. Files stay on your device.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl border border-border bg-card p-6">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-split/30 border-t-split" aria-hidden />
            <p className="text-sm font-medium text-foreground">Reading PDF…</p>
          </div>
        )}

        {hasFile && file && (
          <>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm sm:gap-4 sm:p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-split/10 text-split">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground sm:text-base">
                  {file.name}
                </p>
                <p className="text-xs text-muted sm:text-sm">
                  {formatBytes(file.size)} · {pageCount} page{pageCount !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-red-500/10 hover:text-red-500"
                aria-label="Remove PDF"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-border bg-card px-4 py-3 text-center text-sm font-medium text-foreground">
              This PDF has {pageCount} page{pageCount !== 1 ? "s" : ""}
            </div>

            {/* Tabs */}
            <div
              className="mt-6 flex rounded-xl border border-border bg-card p-1 shadow-sm"
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
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted hover:text-foreground"
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
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Split all pages
              </button>
            </div>

            {/* Mode panels */}
            <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
              {mode === "range" ? (
                <div role="tabpanel">
                  <h2 className="text-sm font-semibold text-foreground">Extract page range</h2>
                  <p className="mt-1 text-sm text-muted">
                    Enter the first and last page to extract into a new PDF.
                  </p>

                  <div className="mt-5 flex items-center justify-center gap-3">
                    <label className="sr-only" htmlFor="start-page">Start page</label>
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
                      className="w-full max-w-[5.5rem] rounded-xl border border-border bg-background px-3 py-3 text-center text-lg font-semibold text-foreground outline-none transition focus:border-split focus:ring-2 focus:ring-split/20"
                    />
                    <span className="shrink-0 text-lg font-medium text-muted" aria-hidden>—</span>
                    <label className="sr-only" htmlFor="end-page">End page</label>
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
                      className="w-full max-w-[5.5rem] rounded-xl border border-border bg-background px-3 py-3 text-center text-lg font-semibold text-foreground outline-none transition focus:border-split focus:ring-2 focus:ring-split/20"
                    />
                  </div>
                  <p className="mt-3 text-center text-xs text-muted">
                    Valid range: 1 – {pageCount}
                  </p>
                </div>
              ) : (
                <div role="tabpanel">
                  <h2 className="text-sm font-semibold text-foreground">Split every page</h2>
                  <p className="mt-1 text-sm text-muted">
                    Creates {pageCount} separate PDF{pageCount !== 1 ? "s" : ""} — one per page — packaged in a ZIP file.
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-split/10 px-4 py-3 text-sm text-split">
                    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5a1.125 1.125 0 00-1.125-1.125H3.375a1.125 1.125 0 00-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                    Large PDFs may take a moment to process.
                  </div>
                </div>
              )}
            </div>

            <div
              {...getRootProps()}
              className={`mt-4 rounded-xl border border-dashed px-4 py-4 text-center text-sm transition ${
                isDragActive ? "border-split bg-split/5" : "border-border bg-card text-muted hover:border-split/40"
              }`}
            >
              <input {...getInputProps()} aria-label="Replace PDF file" />
              Drop a different PDF to replace this one
            </div>
          </>
        )}

        {isSplitting && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-split/30 border-t-split" aria-hidden />
              <p className="text-sm font-semibold text-foreground">Splitting PDF… {progress}%</p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-split transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {isDone && resultBlob && file && (
          <SizeComparisonBadge originalSize={file.size} compressedSize={resultBlob.size} />
        )}

        {/* Actions */}
        {hasFile && (
          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
            {isDone ? (
              <>
                <div className="flex w-full items-center gap-2 sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      if (resultBlob) downloadBlob(resultBlob, resultFilename);
                    }}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-split px-8 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-split/90 sm:w-auto"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12M12 16.5V3" />
                    </svg>
                    Download {mode === "all" ? "ZIP" : "PDF"}
                  </button>
                  <ShortcutHint shortcut="D" />
                </div>
                <button
                  type="button"
                  onClick={resetAll}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-card px-8 py-3.5 text-base font-semibold text-foreground transition hover:bg-accent-light hover:text-accent sm:w-auto"
                >
                  Split again
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleSplit}
                disabled={!canSplit}
                className="inline-flex w-full items-center justify-center rounded-xl bg-split px-8 py-3.5 text-base font-semibold text-white shadow-lg transition enabled:hover:bg-split/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {mode === "range" ? "Extract pages" : "Split all pages"}
              </button>
            )}
          </div>
        )}

        {isDone && (
          <p className="mt-4 text-center text-sm text-muted">
            Ready: <span className="font-medium text-foreground">{resultFilename}</span>
          </p>
        )}
      </main>
    </AppShell>
  );
}
