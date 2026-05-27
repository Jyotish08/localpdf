"use client";

import AppShell from "./components/AppShell";
import HeroDropzone from "./components/HeroDropzone";
import ToolCard from "./components/ToolCard";
import FeatureBox from "./components/FeatureBox";
import PrivacyBanner from "./components/PrivacyBanner";
import RecentFilesRail from "./components/RecentFilesRail";

export default function HomePage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* JSON-LD Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://localpdf.dev/#website",
                  url: "https://localpdf.dev",
                  name: "LocalPDF",
                  description: "Free online PDF tools that work entirely in your browser. Compress, merge, and split PDFs instantly.",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate: "https://localpdf.dev/search?q={search_term_string}"
                    },
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "WebApplication",
                  "@id": "https://localpdf.dev/#webapp",
                  name: "LocalPDF",
                  url: "https://localpdf.dev",
                  description: "Free online PDF tools that work entirely in your browser.",
                  applicationCategory: "UtilitiesApplication",
                  operatingSystem: "Web",
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD"
                  },
                  featureList: [
                    "Compress PDF files",
                    "Merge PDF files",
                    "Split PDF files",
                    "100% browser-based processing",
                    "No file uploads"
                  ]
                },
                {
                  "@type": "Organization",
                  "@id": "https://localpdf.dev/#organization",
                  name: "LocalPDF",
                  url: "https://localpdf.dev",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://localpdf.dev/og-image.png"
                  }
                }
              ]
            }),
          }}
        />

        {/* HERO SECTION */}
        <section className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-1.5 text-sm font-semibold text-success">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              100% Local Processing
            </div>
            <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-[56px] lg:leading-[1.1]">
              All-in-one PDF tools. <span className="text-accent">Fast.</span> Private. <span className="text-accent">Local.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted sm:text-xl">
              Your files never leave your device. Process PDFs instantly in your browser without uploading them to any server.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["No Uploads", "No Servers", "No Tracking"].map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-card px-3 py-1.5 text-sm font-semibold text-foreground shadow-sm ring-1 ring-border"
                >
                  <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {pill}
                </span>
              ))}
            </div>
            
            <div className="mt-8 flex items-center gap-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm font-medium text-muted">Loved by thousands</p>
            </div>
          </div>
          
          <HeroDropzone />
        </section>

        {/* RECENT FILES RAIL */}
        <RecentFilesRail />

        {/* THREE TOOL CARDS */}
        <section className="mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Everything you need
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ToolCard
              tool="compress"
              title="Compress PDF"
              description="Reduce PDF file size without losing quality. Perfect for email attachments."
              tag="Fast & Efficient"
              href="/compress"
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              }
            />
            <ToolCard
              tool="merge"
              title="Merge PDFs"
              description="Combine multiple PDFs into a single document. Reorder pages instantly."
              tag="Easy & Secure"
              href="/merge"
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                </svg>
              }
            />
            <ToolCard
              tool="split"
              title="Split PDF"
              description="Extract specific pages or split a PDF into multiple separate documents."
              tag="Precise & Simple"
              href="/split"
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                </svg>
              }
            />
          </div>
        </section>

        {/* STATS STRIP — honest, static, no fake animations */}
        <section className="mt-24">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-8 px-8 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-12">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted">Why PDFTools?</p>
                <h2 className="mt-2 text-2xl font-black text-foreground sm:text-3xl">
                  Compress PDFs by up to{" "}
                  <span className="text-success">85%</span>
                </h2>
                <p className="mt-3 max-w-sm text-muted">
                  No quality loss for text. Works on any device. Zero uploads ever required.
                </p>
              </div>
              <div className="flex items-center gap-6 sm:gap-10">
                <div className="text-center">
                  <p className="text-3xl font-black text-foreground">85%</p>
                  <p className="mt-1 text-xs font-medium text-muted">Max reduction</p>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <p className="text-3xl font-black text-foreground">0 s</p>
                  <p className="mt-1 text-xs font-medium text-muted">Upload time</p>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <p className="text-3xl font-black text-foreground">∞</p>
                  <p className="mt-1 text-xs font-medium text-muted">No file limit</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOUR FEATURE BOXES */}
        <section className="mt-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureBox
              title="No Uploads"
              description="Files are processed locally in your browser. We never see your data."
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              }
            />
            <FeatureBox
              title="No Watermark"
              description="We never add watermarks to your documents. The output is entirely yours."
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
            />
            <FeatureBox
              title="Works Offline"
              description="Once loaded, our tools work perfectly even without an internet connection."
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                </svg>
              }
            />
            <FeatureBox
              title="Fast on Mobile"
              description="Optimized to run smoothly on smartphones, tablets, and older devices."
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              }
            />
          </div>
        </section>

        {/* PRIVACY CTA BANNER */}
        <section className="mt-24 mb-12">
          <PrivacyBanner />
        </section>
      </div>
    </AppShell>
  );
}
