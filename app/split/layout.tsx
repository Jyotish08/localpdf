import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Split PDF — PDFTools",
  description:
    "Extract page ranges or split every page into separate PDFs. Runs entirely in your browser.",
  alternates: { canonical: "https://localpdf.dev/split" },
};

export default function SplitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
