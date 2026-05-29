import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watermark PDF Online Free - Stamp Text or Images | LocalPDF",
  description:
    "Add text or image watermarks to every page of a PDF directly in your browser. Your files stay private and never leave your device.",
  alternates: { canonical: "https://localpdf.dev/watermark" },
};

export default function WatermarkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
