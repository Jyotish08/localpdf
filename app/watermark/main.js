"use client";

import { useState } from "react";
import AppShell from "../components/AppShell";
import { toast } from "sonner";
import { applyWatermark, CONFIG, isValidImageFile, isValidPdfFile } from "../lib/pdfWatermark";

export default function WatermarkMain() {
  const [pdfFile, setPdfFile] = useState(null);
  const [text, setText] = useState(CONFIG.TEXT);
  const [mode, setMode] = useState(CONFIG.WATERMARK_TYPE);
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [errorMessage, setErrorMessage] = useState(null);

  const progressPercent = progress.total ? Math.round((progress.current / progress.total) * 100) : 0;

  const resetProgress = () => {
    setProgress({ current: 0, total: 0 });
  };

  const handleApply = async () => {
    if (!isValidPdfFile(pdfFile)) {
      toast.error("Please select a valid PDF.");
      return;
    }

    if (mode === "text" && !text.trim()) {
      toast.error("Enter watermark text.");
      return;
    }

    if (mode === "image" && !isValidImageFile(imageFile)) {
      toast.error("Watermark image must be PNG or JPG.");
      return;
    }

    setStatus("processing");
    setErrorMessage(null);
    resetProgress();
    toast.loading("Applying watermark...", { id: "watermark" });

    try {
      await applyWatermark(
        pdfFile,
        {
          WATERMARK_TYPE: mode,
          text,
          imageFile,
        },
        (current, total) => {
          setProgress({ current, total });
        },
      );

      setStatus("done");
      toast.success("Download started.", { id: "watermark" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not apply watermark.";
      setStatus("error");
      setErrorMessage(message);
      toast.error(message, { id: "watermark" });
    }
  };

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3m16.5 5.25L18 21l-3-3m0 0l-3 3m3-3v-6m-6 6l3 3m0 0l3-3m-3 3V9" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Watermark PDF</h1>
          </div>
          <p className="text-muted">
            Stamp every page with text or an image watermark. Processing stays entirely in your browser.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-foreground">PDF file</span>
              <input
                id="pdf-input"
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
                className="block w-full cursor-pointer rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-sky-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-foreground">Watermark type</span>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground"
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
              </select>
            </label>

            {mode === "text" ? (
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-foreground">Watermark text</span>
                <input
                  id="watermark-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="CONFIDENTIAL"
                  className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted"
                />
              </label>
            ) : (
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-foreground">Watermark image</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  className="block w-full cursor-pointer rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-sky-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
                <p className="text-xs text-muted">PNG or JPG only.</p>
              </label>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                id="apply-watermark-btn"
                type="button"
                onClick={() => void handleApply()}
                disabled={status === "processing"}
                className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-sky-500/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "processing" ? "Applying..." : "Apply watermark"}
              </button>

              <div className="text-sm text-muted">
                {pdfFile ? pdfFile.name : "Choose a PDF to begin."}
              </div>
            </div>
          </div>
        </div>

        {status === "processing" && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-sky-500/30 border-t-sky-500" aria-hidden />
              <p className="text-sm font-semibold text-foreground">
                Watermarking pages... {progress.current}/{progress.total || "?"}
              </p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-sky-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {status === "done" && (
          <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 shadow-sm">
            <p className="font-semibold text-foreground">Download started</p>
            <p className="mt-1 text-sm text-muted">Your watermarked PDF should begin downloading automatically.</p>
          </div>
        )}

        {status === "error" && errorMessage && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/5 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground">Watermarking failed</p>
                <p className="mt-1 text-sm text-muted">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </AppShell>
  );
}
