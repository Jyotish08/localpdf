"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import AppShell from "../components/AppShell";
import { useFileHistory } from "../components/FileHistoryProvider";
import { formatBytes } from "../lib/format-bytes";
import { PRESETS, compressPdf, isValidPdfFile } from "../lib/pdfCompressor";

const MAX_SIZE = 100 * 1024 * 1024;

export default function CompressMain() {
  const [file, setFile] = useState(null);
  const [presetKey, setPresetKey] = useState("medium");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState(null);
  const [progress, setProgress] = useState({ stage: "idle", current: 0, total: 0 });
  const [result, setResult] = useState(null);

  const { pendingFiles, clearPendingFiles } = useFileHistory();

  const selectedPreset = PRESETS[presetKey] ?? PRESETS.medium;
  const progressPercent = progress.total ? Math.round((progress.current / progress.total) * 100) : 0;

  const resetAll = useCallback(() => {
    setFile(null);
    setStatus("idle");
    setErrorMessage(null);
    setProgress({ stage: "idle", current: 0, total: 0 });
    setResult(null);
    setPresetKey("medium");
  }, []);

  const handleFile = useCallback((incomingFile) => {
    if (!incomingFile) return;
    if (!isValidPdfFile(incomingFile)) {
      toast.error("Please select a valid PDF.");
      return;
    }
    setFile(incomingFile);
    setErrorMessage(null);
    setResult(null);
    setStatus("idle");
  }, []);

  useEffect(() => {
    if (pendingFiles.length > 0 && !file) {
      const nextFile = pendingFiles[0];
      clearPendingFiles();
      Promise.resolve().then(() => handleFile(nextFile));
    }
  }, [pendingFiles, file, handleFile, clearPendingFiles]);

  const onDrop = useCallback((acceptedFiles) => {
    const uploaded = acceptedFiles[0];
    if (uploaded) handleFile(uploaded);
  }, [handleFile]);

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
        toast.error("File exceeds the 100 MB client-side processing limit.");
      } else {
        toast.error("Please select a valid PDF.");
      }
    },
  });

  const handleCompress = useCallback(async () => {
    if (!file) return;

    setStatus("compressing");
    setErrorMessage(null);
    setResult(null);
    setProgress({ stage: "loading", current: 0, total: 1 });

    toast.loading("Compressing PDF...", { id: "compress" });

    try {
      const compressed = await compressPdf(file, presetKey, (stage, current, total) => {
        setProgress({ stage, current, total });
      });

      setResult(compressed);
      setStatus("done");
      toast.success("Download started.", { id: "compress" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Compression failed.";
      setErrorMessage(message);
      setStatus(err?.name === "AbortError" ? "idle" : "error");
      toast.error(message, { id: "compress" });
    }
  }, [file, presetKey]);

  const fileName = file?.name ?? "No file selected";
  const hasFile = file !== null;
  const isCompressing = status === "compressing";
  const isDone = status === "done" && result !== null;
  const isError = status === "error";

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-compress/10 text-compress">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Compress PDF</h1>
          </div>
          <p className="text-muted">
            Re-encode PDF pages in the browser with preset-based compression, object stream serialization, and worker-backed processing.
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
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                className="block w-full cursor-pointer rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-compress file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-foreground">Compression preset</span>
              <select
                id="compression-level"
                value={presetKey}
                onChange={(e) => setPresetKey(e.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground"
              >
                {Object.entries(PRESETS).map(([key, preset]) => (
                  <option key={key} value={key}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                id="compress-btn"
                type="button"
                onClick={() => void handleCompress()}
                disabled={!hasFile || isCompressing}
                className="inline-flex items-center justify-center rounded-xl bg-compress px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-compress/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCompressing ? "Compressing..." : "Compress PDF"}
              </button>

              <div className="text-sm text-muted">
                {file ? `${fileName} | ${formatBytes(file.size)}` : "Choose a PDF to begin."}
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted">Preset: {selectedPreset.label}</p>
        </div>

        {isCompressing && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-compress/30 border-t-compress" aria-hidden />
              <p className="text-sm font-semibold text-foreground">
                {progress.stage}... {progress.current}/{progress.total || "?"}
              </p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-compress transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {isDone && result && (
          <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 shadow-sm">
            <p className="font-semibold text-foreground">Download started</p>
            <p className="mt-1 text-sm text-muted">
              Saved {result.savingsPercent}% | {formatBytes(result.compressedBytes)}
            </p>
            <div className="mt-4 grid gap-2 text-sm text-muted sm:grid-cols-2">
              <div>Images processed: <span className="font-semibold text-foreground">{result.imagesProcessed}</span></div>
              <div>Had images: <span className="font-semibold text-foreground">{result.hadImages ? "Yes" : "No"}</span></div>
              <div>Unsupported images: <span className="font-semibold text-foreground">{result.unsupportedImages}</span></div>
              <div>Duplicate images: <span className="font-semibold text-foreground">{result.duplicateImages}</span></div>
            </div>
            {result.warnings?.length ? (
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted">
                {result.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            ) : null}
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
                <p className="font-semibold text-foreground">Compression failed</p>
                <p className="mt-1 text-sm text-muted">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={resetAll}
            className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-background"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => open()}
            className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-background"
          >
            Browse again
          </button>
        </div>

        <div
          {...getRootProps()}
          className={`mt-8 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition ${
            isDragActive ? "border-compress bg-compress/5" : "border-border bg-card hover:border-compress/40 hover:bg-compress/5"
          }`}
        >
          <input {...getInputProps()} aria-label="Upload PDF file" />
          <p className="text-base font-semibold text-foreground">
            {isDragActive ? "Drop your PDF here" : "Drag & drop a PDF file"}
          </p>
          <p className="mt-1 text-sm text-muted">PDF only, processed locally in the browser.</p>
        </div>
      </main>
    </AppShell>
  );
}
