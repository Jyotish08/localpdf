import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress PDF — PDFTools",
  description:
    "Reduce PDF file size in your browser. No uploads, no servers.",
};

export default function CompressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
