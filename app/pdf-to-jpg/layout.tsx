import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to JPG Online Free - Extract Pages as Images | LocalPDF",
  description:
    "Convert PDF pages into high-resolution JPG images directly in your browser. One page downloads as a JPG, multiple pages as a ZIP archive.",
  alternates: { canonical: "https://localpdf.dev/pdf-to-jpg" },
};

export default function PdfToJpgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
