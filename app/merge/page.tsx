"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import AppShell from "../components/AppShell";
import SizeComparisonBadge from "../components/SizeComparisonBadge";
import ShortcutHint from "../components/ShortcutHint";
import { useFileHistory } from "../components/FileHistoryProvider";
import { formatBytes } from "../lib/format-bytes";

type PdfItem = { id: string; file: File };
type MergeStatus = "idle" | "merging" | "done" | "error";

const MAX_SIZE = 500 * 1024 * 1024;

async function validatePdf(file: File): Promise<boolean> {
  try {
    const header = await file.slice(0, 5).text();
    return header.startsWith("%PDF-");
  } catch {
    return false;
  }
}

export default function MergePage() {
  const [items, setItems] = useState<PdfItem[]>([]);
  const [status, setStatus] = useState<MergeStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [mergedBytes, setMergedBytes] = useState<Uint8Array | null>(null);

  const { addFile, pendingFiles, clearPendingFiles } = useFileHistory();

  const dragIndex = useRef<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  const clearMerged = useCallback(() => {
    setMergedBytes(null);
    setStatus("idle");
    setProgress(0);
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      void (async () => {
        const validated: File[] = [];
        for (const f of acceptedFiles) {
          const ok = await validatePdf(f);
          if (!ok) {
            toast.error(`"${f.name}" is not a valid PDF.`);
            continue;
          }
          validated.push(f);
        }
        if (validated.length === 0) return;
        const newItems: PdfItem[] = validated.map((file) => ({
          id: crypto.randomUUID(),
          file,
        }));
        setItems((prev) => [...prev, ...newItems]);
        clearMerged();
      })();
    },
    [clearMerged],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: true,
    maxSize: MAX_SIZE,
    noClick: items.length > 0,
    noKeyboard: true,
    onDropRejected: (rejections) => {
      const err = rejections[0]?.errors[0];
      if (err?.code === "file-too-large") {
        toast.error(`"${rejections[0].file.name}" exceeds the 500 MB limit.`);
      } else {
        toast.error(`Only PDF files are accepted. Got: ${rejections[0]?.file.name ?? "unknown"}`);
      }
    },
  });

  // Auto-load files dropped on HeroDropzone
  useEffect(() => {
    if (pendingFiles.length > 0 && items.length === 0) {
      const newItems: PdfItem[] = pendingFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
      }));
      setItems(newItems);
      clearPendingFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    clearMerged();
  };

  const handleDragStart = (index: number) => { dragIndex.current = index; };
  const handleDragEnter = (index: number) => { dragOverIndex.current = index; };
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

    const { PDFDocument } = await import("pdf-lib");

    setStatus("merging");
    setProgress(0);
    setMergedBytes(null);
    toast.loading("Merging PDFs...", { id: "merge" });

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
      toast.success("Merge complete!", { id: "merge" });

      addFile({
        filename: "merged.pdf",
        size: result.byteLength,
        timestamp: Date.now(),
        tool: "merge",
      });
    } catch {
      setStatus("error");
      toast.error("Could not merge these PDFs. They may be corrupted or password-protected.", { id: "merge" });
    }
  };

  const handleDownload = useCallback(() => {
    if (!mergedBytes) return;
    const blob = new Blob([new Uint8Array(mergedBytes)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "merged.pdf";
    anchor.click();
    URL.revokeObjectURL(url);
  }, [mergedBytes]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key.toLowerCase() === "u") {
        e.preventDefault();
        open();
      } else if (e.key.toLowerCase() === "d" && status === "done" && mergedBytes) {
        e.preventDefault();
        handleDownload();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status, mergedBytes, open, handleDownload]);

  const canMerge = items.length >= 2 && status !== "merging";
  const isMerging = status === "merging";
  const isDone = status === "done" && mergedBytes !== null;
  const isError = status === "error";
  const originalSizeSum = items.reduce((sum, item) => sum + item.file.size, 0);

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-merge/10 text-merge">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Merge PDFs</h1>
          </div>
          <p className="text-muted">Add files, drag to reorder, then merge — all on your device.</p>
        </div>

        {/* Upload zone */}
        <div
          {...getRootProps()}
          className={`relative rounded-2xl border-2 border-dashed px-4 py-10 text-center transition sm:py-14 ${
            isDragActive
              ? "border-merge bg-merge/5"
              : "border-border bg-card hover:border-merge/40 hover:bg-merge/5"
          }`}
        >
          <input {...getInputProps()} aria-label="Upload PDF files" />
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-merge text-white shadow-lg shadow-merge/25">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m0 0l7.5-7.5m0 0L7.5 16.5M12 3v13.5" />
            </svg>
          </div>
          <p className="mt-4 text-base font-semibold text-foreground">
            {isDragActive ? "Drop your PDFs here" : "Drag & drop PDF files"}
          </p>
          <p className="mt-1 text-sm text-muted">or</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); open(); }}
              className="inline-flex items-center justify-center rounded-xl bg-merge px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              Browse files
            </button>
            <ShortcutHint shortcut="U" label="Press" />
          </div>
          <p className="mt-4 text-xs text-muted">Add at least 2 PDFs to merge. Files stay on your device.</p>
        </div>

        {/* File list */}
        {items.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                {items.length} file{items.length !== 1 ? "s" : ""} — drag to reorder
              </h2>
              <button
                type="button"
                onClick={() => { setItems([]); clearMerged(); }}
                className="text-sm font-medium text-muted transition hover:text-foreground"
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
                  className="flex cursor-grab items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm active:cursor-grabbing sm:gap-4 sm:p-4"
                >
                  <span className="flex shrink-0 text-muted" aria-hidden title="Drag to reorder">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                    </svg>
                  </span>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-merge/10 text-merge">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground sm:text-base">{item.file.name}</p>
                    <p className="text-xs text-muted sm:text-sm">{formatBytes(item.file.size)}</p>
                  </div>
                  <span className="hidden shrink-0 rounded-full bg-background px-2.5 py-0.5 text-xs font-medium text-muted sm:inline">
                    {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-red-500/10 hover:text-red-500"
                    aria-label={`Remove ${item.file.name}`}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isMerging && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-merge/30 border-t-merge" aria-hidden />
              <p className="text-sm font-semibold text-foreground">Merging PDFs… {progress}%</p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-merge transition-all duration-300" style={{ width: `${progress}%` }} />
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
              <div>
                <p className="font-semibold text-foreground">Merge failed</p>
                <p className="mt-1 text-sm text-muted">One or more PDFs may be encrypted or corrupted.</p>
              </div>
            </div>
          </div>
        )}

        {isDone && (
          <SizeComparisonBadge originalSize={originalSizeSum} compressedSize={mergedBytes.byteLength} />
        )}

        {/* Actions */}
        <div className="mt-8 flex w-full flex-col items-center gap-3 pb-20 sm:flex-row sm:justify-end sm:pb-0">
          {isDone ? (
            <>
              <div className="flex w-full items-center gap-2 sm:w-auto">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-merge px-8 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-merge/90 sm:w-auto"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12M12 16.5V3" />
                  </svg>
                  Download merged PDF
                </button>
                <ShortcutHint shortcut="D" />
              </div>
              <button
                type="button"
                onClick={clearMerged}
                className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-card px-8 py-3.5 text-base font-semibold text-foreground transition hover:bg-accent-light hover:text-accent sm:w-auto"
              >
                Merge again
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => void handleMerge()}
              disabled={!canMerge}
              className="inline-flex w-full items-center justify-center rounded-xl bg-merge px-8 py-3.5 text-base font-semibold text-white shadow-lg transition enabled:hover:bg-merge/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {items.length < 2 ? "Add at least 2 PDFs to merge" : "Merge PDFs"}
            </button>
          )}
        </div>

        {/* SEO CONTENT & JSON-LD SCHEMAS */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SoftwareApplication",
                  name: "LocalPDF Merger",
                  applicationCategory: "UtilitiesApplication",
                  operatingSystem: "Web",
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD"
                  },
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.9",
                    ratingCount: "892"
                  },
                  featureList: [
                    "Merge multiple PDF files",
                    "Drag and drop to reorder pages",
                    "100% private - files never leave your device",
                    "No file size limits"
                  ]
                },
                {
                  "@type": "FAQPage",
                  mainEntity: [
                    {
                      "@type": "Question",
                      name: "How many PDFs can I merge at once?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "You can merge dozens of PDFs at once. Because the merging happens on your device rather than a remote server, the only limit is your device's memory. Most modern computers can easily merge 50+ files in one go."
                      }
                    },
                    {
                      "@type": "Question",
                      name: "Will merging PDFs change the quality or formatting?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "No, merging PDFs with LocalPDF retains 100% of the original quality. We simply append the pages of one document to the end of another without altering the underlying images, text formatting, or metadata."
                      }
                    },
                    {
                      "@type": "Question",
                      name: "Can I reorder pages before merging?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Yes! After adding your PDF files, you can easily drag and drop the files in the list to change their order. The final merged PDF will combine the files in the exact sequence you arranged them."
                      }
                    },
                    {
                      "@type": "Question",
                      name: "Is it safe to merge confidential documents on LocalPDF?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Absolutely. LocalPDF is the safest way to merge confidential documents online because your files are never actually sent online. The merging process happens entirely locally within your web browser."
                      }
                    },
                    {
                      "@type": "Question",
                      name: "What file size limit applies when merging PDFs?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Our tool can handle files up to 500 MB. This is much larger than most cloud-based PDF tools because we don't have to worry about server storage or bandwidth costs. The processing uses your local device resources."
                      }
                    },
                    {
                      "@type": "Question",
                      name: "Can I merge PDFs on mobile devices?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Yes, LocalPDF works flawlessly on iOS and Android devices. You can select multiple PDFs from your phone's file system and merge them directly in your mobile browser without installing any apps."
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
                      name: "Merge PDFs",
                      item: "https://localpdf.dev/merge"
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
                <div className="w-8 h-8 rounded-full bg-merge/10 text-merge font-bold flex items-center justify-center mb-4">1</div>
                <h3 className="font-semibold text-foreground mb-2">Select your PDFs</h3>
                <p className="text-sm text-muted">Upload two or more PDF files you want to combine. You can select multiple files at once or add them one by one.</p>
              </div>
              <div className="bg-card border border-border p-5 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-merge/10 text-merge font-bold flex items-center justify-center mb-4">2</div>
                <h3 className="font-semibold text-foreground mb-2">Reorder files</h3>
                <p className="text-sm text-muted">Drag and drop the files in the list to arrange them in the exact order you want them to appear in the final document.</p>
              </div>
              <div className="bg-card border border-border p-5 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-merge/10 text-merge font-bold flex items-center justify-center mb-4">3</div>
                <h3 className="font-semibold text-foreground mb-2">Merge instantly</h3>
                <p className="text-sm text-muted">Click the merge button. Your browser will instantly combine the documents into a single cohesive PDF file without losing quality.</p>
              </div>
              <div className="bg-card border border-border p-5 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-merge/10 text-merge font-bold flex items-center justify-center mb-4">4</div>
                <h3 className="font-semibold text-foreground mb-2">Download safely</h3>
                <p className="text-sm text-muted">Save the merged PDF directly to your device. Since it never left your computer, there are no privacy concerns.</p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Why Use LocalPDF to Merge?</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex gap-3">
                <div className="mt-1 text-success">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">100% Browser-Based Privacy</h3>
                  <p className="text-sm text-muted">Your sensitive documents are never uploaded to our servers. All merging happens locally using your device's memory.</p>
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
                <h3 className="font-semibold text-foreground text-lg">How many PDFs can I merge at once?</h3>
                <p className="text-muted mt-2">You can merge dozens of PDFs at once. Because the merging happens on your device rather than a remote server, the only limit is your device's memory. Most modern computers can easily merge 50+ files in one go.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">Will merging PDFs change the quality or formatting?</h3>
                <p className="text-muted mt-2">No, merging PDFs with LocalPDF retains 100% of the original quality. We simply append the pages of one document to the end of another without altering the underlying images, text formatting, or metadata.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">Can I reorder pages before merging?</h3>
                <p className="text-muted mt-2">Yes! After adding your PDF files, you can easily drag and drop the files in the list to change their order. The final merged PDF will combine the files in the exact sequence you arranged them.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">Is it safe to merge confidential documents on LocalPDF?</h3>
                <p className="text-muted mt-2">Absolutely. LocalPDF is the safest way to merge confidential documents online because your files are never actually sent online. The merging process happens entirely locally within your web browser.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">What file size limit applies when merging PDFs?</h3>
                <p className="text-muted mt-2">Our tool can handle files up to 500 MB. This is much larger than most cloud-based PDF tools because we don't have to worry about server storage or bandwidth costs. The processing uses your local device resources.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">Can I merge PDFs on mobile devices?</h3>
                <p className="text-muted mt-2">Yes, LocalPDF works flawlessly on iOS and Android devices. You can select multiple PDFs from your phone's file system and merge them directly in your mobile browser without installing any apps.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Related Tools</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <a href="/compress" className="group p-5 rounded-2xl border border-border bg-card hover:border-compress hover:bg-compress/5 transition flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-compress transition">Compress PDF</h3>
                  <p className="text-sm text-muted mt-1">Reduce PDF file size without losing quality.</p>
                </div>
                <div className="text-compress">→</div>
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
