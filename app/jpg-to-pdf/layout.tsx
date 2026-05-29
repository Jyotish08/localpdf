import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JPG to PDF Online Free - Convert Images to PDF | LocalPDF",
  description:
    "Convert JPG and PNG images to PDF in your browser for free. No uploads, no watermark, and nothing leaves your device.",
  alternates: { canonical: "https://localpdf.dev/jpg-to-pdf" },
};

export default function JpgToPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
