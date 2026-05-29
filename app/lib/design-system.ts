/** Localpdf design tokens */

export const colors = {
  bg: "#080D14",
  surface: "#111827",
  surface2: "#1F2D3D",
  green: "#00E676",
  greenDark: "#00C853",
  greenDim: "#00A854",
  greenTint: "#0F1A0F",
  white: "#FFFFFF",
  body: "#CBD5E1",
  muted: "#64748B",
} as const;

export const toolAccents = {
  compress: { color: colors.green, bg: "#0F2A1A", label: "Compress" },
  merge: { color: "#9B59B6", bg: "#1A0F2A", label: "Merge" },
  split: { color: "#3498DB", bg: "#0F1A2A", label: "Split" },
} as const;

export type ToolName = keyof typeof toolAccents;

export type HomeToolId = ToolName | "jpg2pdf" | "pdf2jpg" | "watermark" | "signature";

export const homeToolRoutes: Partial<Record<HomeToolId, string>> = {
  compress: "/compress",
  merge: "/merge",
  split: "/split",
  jpg2pdf: "/jpg-to-pdf",
  pdf2jpg: "/pdf-to-jpg",
  watermark: "/watermark",
  signature: "/signature",
};
