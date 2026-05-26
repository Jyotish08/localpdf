import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PDFTools — Free Online PDF Tools",
    template: "%s | PDFTools",
  },
  description:
    "Compress, merge, and split PDFs entirely in your browser. Free, fast, and 100% private — your files never leave your device. No sign-up required.",
  keywords: [
    "PDF tools",
    "compress PDF",
    "merge PDF",
    "split PDF",
    "free PDF tools",
    "online PDF",
    "PDF compressor",
    "PDF merger",
    "PDF splitter",
    "browser PDF tool",
    "PDF tools India",
    "free PDF compress",
  ],
  authors: [{ name: "PDFTools" }],
  creator: "PDFTools",
  metadataBase: new URL("https://pdftools.app"),
  openGraph: {
    type: "website",
    siteName: "PDFTools",
    title: "PDFTools — Free Online PDF Tools",
    description:
      "Compress, merge, and split PDFs entirely in your browser. Free, fast, and 100% private.",
    url: "https://pdftools.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDFTools — Free Online PDF Tools",
    description:
      "Compress, merge, and split PDFs entirely in your browser. Free, fast, and 100% private.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
