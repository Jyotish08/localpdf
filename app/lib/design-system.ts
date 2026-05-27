/** PDFTools Design System Tokens */

export const colors = {
  bg: "#FFFFFF",
  bgDark: "#0A0A0B",
  card: "#F7F7F8",
  cardDark: "#141416",
  text: "#0F0F0F",
  textDark: "#F5F5F5",
  muted: "#6B7280",
  mutedDark: "#9CA3AF",
  border: "#E5E7EB",
  borderDark: "#27272A",
  accent: "#3B3BFF",
  accentLight: "#EBEBFF",
  success: "#22C55E",
  compress: "#FF4D4D",
  merge: "#3B82F6",
  split: "#10B981",
} as const;

export const toolAccents = {
  compress: { color: colors.compress, bg: "#FFF1F1", bgDark: "#2D1616", label: "Compress" },
  merge: { color: colors.merge, bg: "#EFF6FF", bgDark: "#162038", label: "Merge" },
  split: { color: colors.split, bg: "#ECFDF5", bgDark: "#0D2818", label: "Split" },
} as const;

export type ToolName = keyof typeof toolAccents;
