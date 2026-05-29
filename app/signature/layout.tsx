import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign PDF Online Free - Draw, Type, or Upload Signature | LocalPDF",
  description:
    "Add a transparent signature to a PDF in your browser. Draw, type, or upload a signature and place it on a selected page without leaving your device.",
  alternates: { canonical: "https://localpdf.dev/signature" },
};

export default function SignatureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
