import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./components/ThemeProvider";
import FileHistoryProvider from "./components/FileHistoryProvider";
import ToastManager from "./components/ToastManager";
import CookieConsent from "./components/CookieConsent";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Localpdf — Your PDFs. Done in Seconds. Right in Your Browser.",
    template: "%s | Localpdf",
  },
  description:
    "Free online PDF tools that work entirely in your browser. Compress, merge, and split PDFs instantly with no uploads, no registration, and no data stored.",
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
  authors: [{ name: "LocalPDF" }],
  creator: "LocalPDF",
  metadataBase: new URL("https://localpdf.dev"),
  alternates: { canonical: "https://localpdf.dev" },
  manifest: "/manifest.json",
  verification: {
    google: "abc123DEF456ghi789JKL012mno345PQR678stu901",
  },
  openGraph: {
    type: "website",
    siteName: "LocalPDF",
    title: "LocalPDF — Free Online PDF Tools | Compress Merge Split",
    description:
      "Free online PDF tools that work entirely in your browser. Compress, merge, and split PDFs instantly with no uploads, no registration, and no data stored.",
    url: "https://localpdf.dev",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "LocalPDF — Free Online PDF Tools" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LocalPDF — Free Online PDF Tools | Compress Merge Split",
    description:
      "Free online PDF tools that work entirely in your browser. Compress, merge, and split PDFs instantly with no uploads, no registration, and no data stored.",
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
      className={`${jakarta.variable} h-full scroll-smooth antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'light') {
                  document.documentElement.classList.add('light')
                } else {
                  document.documentElement.classList.remove('light')
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
        <CookieConsent />
      </body>
    </html>
  );
}
