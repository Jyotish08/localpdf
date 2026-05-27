import Link from "next/link";
import { ToolName, toolAccents } from "../lib/design-system";

interface ToolCardProps {
  tool: ToolName;
  title: string;
  description: string;
  tag: string;
  href: string;
  icon: React.ReactNode;
}

export default function ToolCard({ tool, title, description, tag, href, icon }: ToolCardProps) {
  const accent = toolAccents[tool];

  return (
    <Link
      href={href}
      className="group relative flex flex-col rounded-3xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-black/40"
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: "var(--background)", color: accent.color }}
        >
          {icon}
        </div>
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold"
          style={{ backgroundColor: "var(--background)", color: accent.color }}
        >
          {tag}
        </span>
      </div>
      <h3 className="mt-6 text-xl font-bold text-foreground">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{description}</p>
      
      <div className="mt-6 flex items-center gap-2 text-sm font-semibold transition-colors" style={{ color: accent.color }}>
        Try now
        <svg
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </div>
    </Link>
  );
}
