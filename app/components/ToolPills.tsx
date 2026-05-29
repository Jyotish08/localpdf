"use client";

import type { HomeToolId } from "../lib/design-system";

const pills: { id: HomeToolId; label: string; short: string; icon: React.ReactNode }[] = [
  {
    id: "compress",
    label: "Compress",
    short: "Zip",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 shrink-0">
        <path d="M8 13V3M4 7l4-4 4 4" />
      </svg>
    ),
  },
  {
    id: "merge",
    label: "Merge",
    short: "Merge",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 shrink-0">
        <path d="M3 4h10M3 8h10M3 12h6" />
      </svg>
    ),
  },
  {
    id: "split",
    label: "Split",
    short: "Split",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 shrink-0">
        <path d="M8 2v12M4 6l4-4 4 4M4 10l4 4 4-4" />
      </svg>
    ),
  },
  {
    id: "jpg2pdf",
    label: "JPG→PDF",
    short: "J→P",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 shrink-0">
        <rect x="2" y="3" width="12" height="10" rx="1" />
        <path d="M5 10l2-3 2 2 2-4" />
      </svg>
    ),
  },
  {
    id: "pdf2jpg",
    label: "PDF→JPG",
    short: "P→J",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 shrink-0">
        <rect x="2" y="2" width="12" height="12" rx="1" />
        <circle cx="6" cy="6" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "watermark",
    label: "Watermark",
    short: "Mark",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 shrink-0">
        <path d="M2 14l4-8 3 4 3-6 4 10" />
      </svg>
    ),
  },
  {
    id: "signature",
    label: "Signature",
    short: "Sign",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 shrink-0">
        <path d="M2 12c4-6 8-6 12 0" />
        <path d="M3 12h10" />
      </svg>
    ),
  },
];

interface ToolPillsProps {
  selected: HomeToolId;
  onSelect: (tool: HomeToolId) => void;
}

export default function ToolPills({ selected, onSelect }: ToolPillsProps) {
  return (
    <div className="pills-lp mx-auto mt-6 flex w-full max-w-[680px] flex-wrap justify-center gap-2.5 px-4">
      {pills.map((pill) => (
        <button
          key={pill.id}
          type="button"
          className={`pill-lp ${selected === pill.id ? "is-active" : ""}`}
          data-short={pill.short}
          onClick={() => onSelect(pill.id)}
        >
          {pill.icon}
          <span className="pill-label">{pill.label}</span>
        </button>
      ))}
    </div>
  );
}
