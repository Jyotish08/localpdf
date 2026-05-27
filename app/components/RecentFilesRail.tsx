"use client";

import { useFileHistory } from "./FileHistoryProvider";
import { toolAccents } from "../lib/design-system";
import Link from "next/link";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function RecentFilesRail() {
  const { files } = useFileHistory();

  if (files.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted">Recent Activity</h3>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar">
        {files.map((f, i) => {
          const accent = toolAccents[f.tool];
          return (
            <Link
              key={i}
              href={`/${f.tool}`}
              className="flex min-w-[280px] shrink-0 snap-start flex-col rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "var(--background)", color: accent.color }}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{f.filename}</p>
                  <p className="text-xs text-muted">{formatBytes(f.size)}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] font-medium text-muted">
                  {new Date(f.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span
                  className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{ backgroundColor: "var(--background)", color: accent.color }}
                >
                  {accent.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
