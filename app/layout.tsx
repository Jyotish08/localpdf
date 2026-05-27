import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./components/ThemeProvider";
import FileHistoryProvider from "./components/FileHistoryProvider";
import ToastManager from "./components/ToastManager";

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
  metadataBase: new URL("https://localpdf.dev"),
  alternates: { canonical: "https://localpdf.dev" },
  openGraph: {
    type: "website",
    siteName: "PDFTools",
    title: "PDFTools — Free Online PDF Tools",
    description:
      "Compress, merge, and split PDFs entirely in your browser. Free, fast, and 100% private.",
    url: "https://localpdf.dev",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "PDFTools — Free Online PDF Tools" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDFTools — Free Online PDF Tools",
    description:
      "Compress, merge, and split PDFs entirely in your browser. Free, fast, and 100% private.",
    images: ["/og-image.png"],
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
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <FileHistoryProvider>
            {children}
            <ToastManager />
          </FileHistoryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
