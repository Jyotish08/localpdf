import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merge PDF Files Online Free — Combine PDFs Instantly | LocalPDF",
  description: "Merge multiple PDF files into one online for free. Combine PDFs directly in your browser with no uploads, no watermarks, and complete privacy guaranteed.",
  alternates: { canonical: "https://localpdf.dev/merge" },
};

export default function MergeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
