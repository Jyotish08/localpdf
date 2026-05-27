import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Split PDF Files Online Free — Extract PDF Pages | LocalPDF",
  description: "Split PDF files and extract specific pages online for free. Separate your PDF pages instantly in your browser with no uploads and complete privacy guaranteed.",
  alternates: { canonical: "https://localpdf.dev/split" },
};

export default function SplitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
