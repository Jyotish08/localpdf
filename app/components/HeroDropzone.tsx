"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useFileHistory } from "./FileHistoryProvider";
import type { HomeToolId } from "../lib/design-system";
import { homeToolRoutes } from "../lib/design-system";

const MAX_SIZE = 500 * 1024 * 1024;

interface HeroDropzoneProps {
  selectedTool: HomeToolId;
  variant?: "hero" | "bottom";
  id?: string;
  pulseOnView?: boolean;
}

export default function HeroDropzone({
  selectedTool,
  variant = "hero",
  id,
  pulseOnView = false,
}: HeroDropzoneProps) {
  const router = useRouter();
  const { setPendingFiles } = useFileHistory();
  const [title, setTitle] = useState(
    variant === "hero" ? "Drag & Drop your PDF here" : "Ready? Drop your PDF here.",
  );
  const [pulseVisible, setPulseVisible] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      if (!homeToolRoutes[selectedTool] && selectedTool !== "compress") {
        toast.message("Coming soon", {
          description: "This tool isn't available yet. We'll open Compress for now.",
        });
      }

      setPendingFiles(acceptedFiles);
      const names = acceptedFiles.map((f) => f.name);
      setTitle(
        names.length === 1
          ? `Ready: ${names[0]}`
          : `${names.length} PDFs ready — opening tool…`,
      );

      const target =
        homeToolRoutes[selectedTool] ?? (acceptedFiles.length > 1 ? "/merge" : "/compress");
      router.push(target);
    },
    [router, selectedTool, setPendingFiles],
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

  const rootRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || !pulseOnView) return;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setPulseVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.4 },
      );
      observer.observe(node);
    },
    [pulseOnView],
  );

  const isHero = variant === "hero";

  return (
    <div
      {...getRootProps()}
      ref={pulseOnView ? rootRef : undefined}
      id={id}
      className={`dropzone-lp relative ${variant === "bottom" ? "dropzone-lp--bottom" : ""} ${
        isDragActive ? "is-dragover" : ""
      } ${pulseVisible ? "is-visible" : ""} ${isHero ? "mt-8" : ""}`}
    >
      <input {...getInputProps()} aria-label="Upload PDF files" />

      {isHero && (
        <svg className="mb-4 h-12 w-12 text-accent" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <path
            d="M14 6h14l10 10v26a2 2 0 01-2 2H14a2 2 0 01-2-2V8a2 2 0 012-2z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M28 6v10h10M24 28v-8M20 24l4-4 4 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      <p className={`text-foreground ${isHero ? "text-xl font-semibold" : "text-2xl font-bold"}`}>
        {isDragActive ? "Drop your PDFs here" : title}
      </p>

      <p className="my-3 text-sm text-muted">or</p>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          open();
        }}
        className="dropzone-lp__btn"
      >
        Browse Files — Start Now
      </button>

      {!isHero && (
        <p className="mt-3 text-[13px] text-muted">No account. No install. Free.</p>
      )}
    </div>
  );
}
