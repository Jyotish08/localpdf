import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merge PDFs — PDFTools",
  description:
    "Combine multiple PDF files into one document. Everything runs in your browser.",
};

export default function MergeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
