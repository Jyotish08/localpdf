import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress PDF Online Free — Reduce PDF File Size | LocalPDF",
  description: "Reduce your PDF file size online for free. Our browser-based PDF compressor keeps your data private — no uploading to servers, no sign-up required.",
  alternates: { canonical: "https://localpdf.dev/compress" },
};

export default function CompressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
