"use client";

import { useEffect, useState } from "react";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function SizeComparisonBadge({
  originalSize,
  compressedSize,
}: {
  originalSize: number;
  compressedSize: number;
}) {
  const [displaySize, setDisplaySize] = useState(originalSize);

  useEffect(() => {
    let start = originalSize;
    const end = compressedSize;
    if (start === end) return;

    const duration = 1000;
    const steps = 60;
    const stepTime = duration / steps;
    const increment = (end - start) / steps;

    const timer = setInterval(() => {
      start += increment;
      if ((increment < 0 && start <= end) || (increment > 0 && start >= end)) {
        setDisplaySize(end);
        clearInterval(timer);
      } else {
        setDisplaySize(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [originalSize, compressedSize]);

  const percentReduced =
    originalSize > 0 && compressedSize > 0
      ? ((originalSize - compressedSize) / originalSize) * 100
      : 0;

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-success/30 bg-success/5 p-6 shadow-inner">
      <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex-1 text-center sm:text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">Original Size</p>
          <p className="mt-1 text-2xl font-bold text-foreground line-through opacity-60">
            {formatBytes(originalSize)}
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success/20 text-success">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>

        <div className="flex-1 text-center sm:text-right">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">New Size</p>
          <div className="mt-1 flex items-baseline justify-center gap-2 sm:justify-end">
            <span className="text-3xl font-black tracking-tight text-success">
              {formatBytes(displaySize)}
            </span>
            <span className="rounded-full bg-success px-2 py-0.5 text-xs font-bold text-white shadow-sm">
              -{percentReduced.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
