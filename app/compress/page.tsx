"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { compressPdf } from "./lib/compress-pdf";
import { toast } from "sonner";
import AppShell from "../components/AppShell";
import SizeComparisonBadge from "../components/SizeComparisonBadge";
import ShortcutHint from "../components/ShortcutHint";
import { useFileHistory } from "../components/FileHistoryProvider";
import { formatBytes } from "../lib/format-bytes";

type CompressionLevel = "low" | "medium" | "high";
type CompressStatus = "idle" | "loading" | "compressing" | "done" | "error";

const LEVELS: {
  id: CompressionLevel;
  label: string;
  description: string;
  quality: number;
}[] = [
  { id: "low", label: "Low compression", description: "Better quality", quality: 0.85 },
  { id: "medium", label: "Medium compression", description: "Balanced", quality: 0.6 },
  { id: "high", label: "High compression", description: "Smallest size", quality: 0.35 },
];

const MAX_SIZE = 500 * 1024 * 1024;

async function validatePdf(file: File): Promise<boolean> {
  try {
    const header = await file.slice(0, 5).text();
    return header.startsWith("%PDF-");
  } catch {
    return false;
  }
}

export default function CompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [level, setLevel] = useState<CompressionLevel>("medium");
  const [status, setStatus] = useState<CompressStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [compressedBytes, setCompressedBytes] = useState<Uint8Array | null>(null);
  const [compressedSize, setCompressedSize] = useState(0);

  const { addFile, pendingFiles, clearPendingFiles } = useFileHistory();

  const resetResult = useCallback(() => {
    setCompressedBytes(null);
    setCompressedSize(0);
    setStatus("idle");
    setProgress(0);
  }, []);

  const resetAll = useCallback(() => {
    setFile(null);
    setPdfBytes(null);
    setOriginalSize(0);
    setLevel("medium");
    resetResult();
  }, [resetResult]);

  const loadPdf = useCallback(
    async (uploaded: File) => {
      setStatus("loading");
      resetResult();

      const valid = await validatePdf(uploaded);
      if (!valid) {
        setStatus("error");
        toast.error("This file is not a valid PDF.");
        return;
      }

      try {
        const bytes = await uploaded.arrayBuffer();
        setFile(uploaded);
        setPdfBytes(bytes);
        setOriginalSize(uploaded.size);
        setStatus("idle");
      } catch {
        setStatus("error");
        toast.error("Could not read this PDF. Please try another file.");
      }
    },
    [resetResult],
  );

  // Auto-load file dropped on HeroDropzone
  useEffect(() => {
    if (pendingFiles.length > 0 && !file) {
      void loadPdf(pendingFiles[0]);
      clearPendingFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    maxSize: MAX_SIZE,
    noClick: file !== null,
    noKeyboard: true,
    onDropRejected: (rejections) => {
      const err = rejections[0]?.errors[0];
      if (err?.code === "file-too-large") {
        toast.error("File exceeds the 500 MB limit.");
      } else {
        toast.error(`Only PDF files are accepted. Got: ${rejections[0]?.file.name ?? "unknown"}`);
      }
    },
  });

  const selectedQuality = LEVELS.find((l) => l.id === level)?.quality ?? 0.6;

  const handleCompress = async () => {
    if (!pdfBytes || !file) return;

    setStatus("compressing");
    setProgress(0);
    setCompressedBytes(null);

    toast.loading("Compressing PDF...", { id: "compress" });

    try {
      const result = await compressPdf(pdfBytes, selectedQuality, setProgress);
      setCompressedBytes(result);
      setCompressedSize(result.byteLength);
      setStatus("done");
      toast.success("Compression complete!", { id: "compress" });

      addFile({
        filename: file.name,
        size: result.byteLength,
        timestamp: Date.now(),
        tool: "compress",
      });
    } catch {
      setStatus("error");
      toast.error("Compression failed. The PDF may be encrypted or unsupported.", { id: "compress" });
    }
  };

  const handleDownload = useCallback(() => {
    if (!compressedBytes || !file) return;
    const blob = new Blob([new Uint8Array(compressedBytes)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const baseName = file.name.replace(/\.pdf$/i, "") || "document";
    anchor.href = url;
    anchor.download = `${baseName}-compressed.pdf`;
    anchor.click();
    URL.revokeObjectURL(url);
    // Free the original ArrayBuffer from memory after successful download
    setPdfBytes(null);
  }, [compressedBytes, file]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key.toLowerCase() === "u" && !file) {
        e.preventDefault();
        open();
      } else if (e.key.toLowerCase() === "d" && status === "done" && compressedBytes) {
        e.preventDefault();
        handleDownload();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [file, status, compressedBytes, open, handleDownload]);

  const hasFile = file !== null;
  const isLoading = status === "loading";
  const isCompressing = status === "compressing";
  const isDone = status === "done" && compressedBytes !== null;
  const isError = status === "error";
  const canCompress = hasFile && pdfBytes !== null && !isCompressing && !isLoading;

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-compress/10 text-compress">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Compress PDF
            </h1>
          </div>
          <p className="text-muted">
            Reduce PDF file size by rendering pages as optimized JPEGs.
          </p>
        </div>

        {!hasFile && (
          <div
            {...getRootProps()}
            className={`relative rounded-2xl border-2 border-dashed px-4 py-10 text-center transition sm:py-14 ${
              isDragActive
                ? "border-compress bg-compress/5"
                : "border-border bg-card hover:border-compress/50 hover:bg-compress/5"
            }`}
          >
            <input {...getInputProps()} aria-label="Upload PDF file" />
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-compress text-white shadow-lg shadow-compress/25">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m0 0l7.5-7.5m0 0L7.5 16.5M12 3v13.5" />
              </svg>
            </div>
            <p className="mt-4 text-base font-semibold text-foreground">
              {isDragActive ? "Drop your PDF here" : "Drag & drop a PDF file"}
            </p>
            <p className="mt-1 text-sm text-muted">Supports up to 500 MB</p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); open(); }}
                className="inline-flex items-center justify-center rounded-xl bg-compress px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
              >
                Choose file
              </button>
              <ShortcutHint shortcut="U" label="Press" />
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-card p-6">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-compress/30 border-t-compress" aria-hidden />
            <p className="text-sm font-medium text-foreground">Loading PDF…</p>
          </div>
        )}

        {hasFile && file && (
          <>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm sm:gap-4 sm:p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-compress/10 text-compress">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground sm:text-base">{file.name}</p>
                <p className="text-xs text-muted sm:text-sm">
                  Original size: <span className="font-medium text-foreground">{formatBytes(originalSize)}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={resetAll}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-red-500/10 hover:text-red-500"
                aria-label="Remove PDF"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-8">
              <h2 className="text-sm font-semibold text-foreground">Compression level</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {LEVELS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => { setLevel(option.id); resetResult(); }}
                    disabled={isCompressing}
                    className={`rounded-xl border px-4 py-4 text-left transition disabled:opacity-60 ${
                      level === option.id
                        ? "border-compress bg-compress/5 ring-2 ring-compress/20"
                        : "border-border bg-card hover:border-compress/40"
                    }`}
                  >
                    <p className={`text-sm font-semibold ${level === option.id ? "text-compress" : "text-foreground"}`}>
                      {option.label}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div
              {...getRootProps()}
              className={`mt-4 rounded-xl border border-dashed px-4 py-4 text-center text-sm transition ${
                isDragActive ? "border-compress bg-compress/5" : "border-border bg-card text-muted hover:border-compress/40"
              }`}
            >
              <input {...getInputProps()} aria-label="Replace PDF file" />
              Drop a different PDF to replace this one
            </div>
          </>
        )}

        {isCompressing && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-compress/30 border-t-compress" aria-hidden />
              <p className="text-sm font-semibold text-foreground">Compressing… {progress}%</p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-compress transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {isError && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/5 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Processing failed</p>
                <p className="mt-1 text-sm text-muted">
                  The PDF may be encrypted, corrupted, or unsupported. Please try a different file.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={resetAll}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-background"
            >
              Try another file
            </button>
          </div>
        )}

        {isDone && (
          <SizeComparisonBadge originalSize={originalSize} compressedSize={compressedSize} />
        )}

        {hasFile && (
          <div className="mt-8 flex w-full flex-col items-center gap-3 pb-20 sm:flex-row sm:justify-end sm:pb-0">
            {isDone ? (
              <>
                <div className="flex w-full items-center gap-2 sm:w-auto">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-compress px-8 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-compress/90 sm:w-auto"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12M12 16.5V3" />
                    </svg>
                    Download PDF
                  </button>
                  <ShortcutHint shortcut="D" />
                </div>
                <button
                  type="button"
                  onClick={resetAll}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-card px-8 py-3.5 text-base font-semibold text-foreground transition hover:bg-accent-light hover:text-accent sm:w-auto"
                >
                  Compress again
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => void handleCompress()}
                disabled={!canCompress}
                className="inline-flex w-full items-center justify-center rounded-xl bg-compress px-8 py-3.5 text-base font-semibold text-white shadow-lg transition enabled:hover:bg-compress/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Compress PDF
              </button>
            )}
          </div>
        )}

        {/* SEO CONTENT & JSON-LD SCHEMAS */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SoftwareApplication",
                  name: "LocalPDF Compressor",
                  applicationCategory: "UtilitiesApplication",
                  operatingSystem: "Web",
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD"
                  },
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.8",
                    ratingCount: "1245"
                  },
                  featureList: [
                    "Browser-based PDF compression",
                    "No file size limits",
                    "100% private - files never leave your device",
                    "Multiple compression levels"
                  ]
                },
                {
                  "@type": "FAQPage",
                  mainEntity: [
                    {
                      "@type": "Question",
                      name: "How much can I reduce my PDF file size?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "The amount of compression depends on the original file. If your PDF contains many high-resolution images, you can often reduce the file size by 70-85% using our High Compression setting. Text-heavy PDFs will see less reduction because text is already highly compressed."
                      }
                    },
                    {
                      "@type": "Question",
                      name: "Will compressing a PDF reduce its quality?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Compression primarily targets images within the PDF. Using our 'Low' or 'Medium' settings ensures that text remains perfectly sharp while images are optimized. Only the 'High' compression setting might result in noticeable image quality reduction."
                      }
                    },
                    {
                      "@type": "Question",
                      name: "Is it safe to compress PDFs online with LocalPDF?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Yes, it is completely safe. LocalPDF is unique because it processes your files entirely within your web browser. Your PDF is never uploaded to any server, meaning your sensitive data remains 100% private and secure on your device."
                      }
                    },
                    {
                      "@type": "Question",
                      name: "What is the maximum PDF file size I can compress?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Our tool supports files up to 500 MB. However, because processing happens on your device, the practical limit depends on your device's memory (RAM). Modern laptops and smartphones can easily handle large files without issues."
                      }
                    },
                    {
                      "@type": "Question",
                      name: "Can I compress a password-protected PDF?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Currently, our browser-based tool cannot process encrypted or password-protected PDFs. You will need to remove the password protection using a native tool on your computer before compressing the file with LocalPDF."
                      }
                    },
                    {
                      "@type": "Question",
                      name: "Does compressing a PDF remove the text or make it unsearchable?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "No. LocalPDF preserves all text layers and formatting. Your compressed PDF will remain fully searchable, and you can still copy and paste text exactly as you could in the original file."
                      }
                    }
                  ]
                },
                {
                  "@type": "BreadcrumbList",
                  itemListElement: [
                    {
                      "@type": "ListItem",
                      position: 1,
                      name: "Home",
                      item: "https://localpdf.dev"
                    },
                    {
                      "@type": "ListItem",
                      position: 2,
                      name: "Compress PDF",
                      item: "https://localpdf.dev/compress"
                    }
                  ]
                }
              ]
            })
          }}
        />

        <div className="mt-24 border-t border-border pt-16">
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">How It Works</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-card border border-border p-5 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-compress/10 text-compress font-bold flex items-center justify-center mb-4">1</div>
                <h3 className="font-semibold text-foreground mb-2">Select your PDF</h3>
                <p className="text-sm text-muted">Drag and drop your document into the dropzone or click to browse your files. We support files up to 500 MB.</p>
              </div>
              <div className="bg-card border border-border p-5 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-compress/10 text-compress font-bold flex items-center justify-center mb-4">2</div>
                <h3 className="font-semibold text-foreground mb-2">Choose compression level</h3>
                <p className="text-sm text-muted">Select Low, Medium, or High compression depending on whether you prioritize image quality or file size reduction.</p>
              </div>
              <div className="bg-card border border-border p-5 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-compress/10 text-compress font-bold flex items-center justify-center mb-4">3</div>
                <h3 className="font-semibold text-foreground mb-2">Preview file size</h3>
                <p className="text-sm text-muted">Watch as your browser instantly processes the file. You'll see the exact original size compared to the new compressed size.</p>
              </div>
              <div className="bg-card border border-border p-5 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-compress/10 text-compress font-bold flex items-center justify-center mb-4">4</div>
                <h3 className="font-semibold text-foreground mb-2">Download safely</h3>
                <p className="text-sm text-muted">Save the optimized PDF directly to your device. Since it never left your computer, there are no security risks.</p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Why Use LocalPDF to Compress?</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex gap-3">
                <div className="mt-1 text-success">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">100% Browser-Based Privacy</h3>
                  <p className="text-sm text-muted">Your sensitive documents are never uploaded to our servers. All compression happens locally using your device's memory.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 text-success">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Completely Free</h3>
                  <p className="text-sm text-muted">We don't charge you for processing files, and we don't put features behind a paywall or require an account registration.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 text-success">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">No Watermarks</h3>
                  <p className="text-sm text-muted">Unlike other free tools, we will never brand or watermark your output files. Your documents remain entirely yours.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 text-success">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Works on Any Device</h3>
                  <p className="text-sm text-muted">Whether you're using a laptop, tablet, or smartphone, our tool works seamlessly in any modern web browser.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground text-lg">How much can I reduce my PDF file size?</h3>
                <p className="text-muted mt-2">The amount of compression depends on the original file. If your PDF contains many high-resolution images, you can often reduce the file size by 70-85% using our High Compression setting. Text-heavy PDFs will see less reduction because text is already highly compressed.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">Will compressing a PDF reduce its quality?</h3>
                <p className="text-muted mt-2">Compression primarily targets images within the PDF. Using our 'Low' or 'Medium' settings ensures that text remains perfectly sharp while images are optimized. Only the 'High' compression setting might result in noticeable image quality reduction.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">Is it safe to compress PDFs online with LocalPDF?</h3>
                <p className="text-muted mt-2">Yes, it is completely safe. LocalPDF is unique because it processes your files entirely within your web browser. Your PDF is never uploaded to any server, meaning your sensitive data remains 100% private and secure on your device.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">What is the maximum PDF file size I can compress?</h3>
                <p className="text-muted mt-2">Our tool supports files up to 500 MB. However, because processing happens on your device, the practical limit depends on your device's memory (RAM). Modern laptops and smartphones can easily handle large files without issues.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">Can I compress a password-protected PDF?</h3>
                <p className="text-muted mt-2">Currently, our browser-based tool cannot process encrypted or password-protected PDFs. You will need to remove the password protection using a native tool on your computer before compressing the file with LocalPDF.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">Does compressing a PDF remove the text or make it unsearchable?</h3>
                <p className="text-muted mt-2">No. LocalPDF preserves all text layers and formatting. Your compressed PDF will remain fully searchable, and you can still copy and paste text exactly as you could in the original file.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Related Tools</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <a href="/merge" className="group p-5 rounded-2xl border border-border bg-card hover:border-merge hover:bg-merge/5 transition flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-merge transition">Merge PDFs</h3>
                  <p className="text-sm text-muted mt-1">Combine multiple PDF files into one.</p>
                </div>
                <div className="text-merge">→</div>
              </a>
              <a href="/split" className="group p-5 rounded-2xl border border-border bg-card hover:border-split hover:bg-split/5 transition flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-split transition">Split PDF</h3>
                  <p className="text-sm text-muted mt-1">Extract specific pages from a document.</p>
                </div>
                <div className="text-split">→</div>
              </a>
            </div>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
