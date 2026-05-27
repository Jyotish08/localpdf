"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useFileHistory } from "./FileHistoryProvider";

const MAX_SIZE = 500 * 1024 * 1024; // 500 MB

export default function HeroDropzone() {
  const router = useRouter();
  const { setPendingFiles } = useFileHistory();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      // Store files in context so the tool page can auto-load them
      setPendingFiles(acceptedFiles);
      if (acceptedFiles.length === 1) {
        router.push("/compress");
      } else {
        router.push("/merge");
      }
    },
    [router, setPendingFiles],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    noClick: true,
    noKeyboard: true,
    maxSize: MAX_SIZE,
    onDropRejected: (rejections) => {
      const err = rejections[0]?.errors[0];
      if (err?.code === "file-too-large") {
        toast.error("File exceeds the 500 MB limit.");
      } else {
        toast.error(`Only PDF files are accepted. Got: ${rejections[0]?.file.name ?? "unknown"}`);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-all ${
        isDragActive
          ? "border-accent bg-accent-light"
          : "border-border bg-card hover:border-accent hover:bg-accent-light/50"
      }`}
    >
      <input {...getInputProps()} aria-label="Upload PDF files" />
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent/80 text-white shadow-lg shadow-accent/25">
        <svg
          className="h-8 w-8"
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
      <h3 className="mt-6 text-xl font-bold text-foreground">
        {isDragActive ? "Drop your PDFs here" : "Drag & drop PDF files"}
      </h3>
      <p className="mt-2 text-sm text-muted">Supports up to 500 MB</p>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          open();
        }}
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-accent px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
      >
        Choose Files
      </button>

      <div className="mt-6 flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
        100% Private & Secure
      </div>
    </div>
  );
}
