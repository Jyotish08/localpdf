import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "../components/AppShell";

export const metadata: Metadata = {
  title: "Blog — PDFTools",
  description: "PDF tips, guides, and tutorials from the PDFTools team. Learn how to compress, merge, split, and manage PDF files efficiently.",
  alternates: { canonical: "https://localpdf.dev/blog" },
};

const posts = [
  {
    slug: "how-to-compress-pdf-without-losing-quality",
    title: "How to Compress a PDF Without Losing Quality",
    date: "May 20, 2026",
    description: "Large PDFs can be a pain to share over email or WhatsApp. Learn how to shrink your PDF file size while keeping text sharp and images readable — all without uploading to any server.",
    tag: "Compress",
    readTime: "4 min read",
  },
  {
    slug: "merge-multiple-pdfs-into-one-free",
    title: "Merge Multiple PDFs Into One — Free & Instant",
    date: "May 15, 2026",
    description: "Combining multiple PDF documents is a common task for students submitting multi-part assignments and professionals creating comprehensive reports. Here's how to do it instantly for free.",
    tag: "Merge",
    readTime: "3 min read",
  },
  {
    slug: "split-pdf-extract-specific-pages",
    title: "How to Split a PDF and Extract Specific Pages",
    date: "May 10, 2026",
    description: "Sometimes you only need a few pages from a large PDF. Whether it's one chapter from an e-book or a single invoice from a compiled report, splitting PDFs is easier than you think.",
    tag: "Split",
    readTime: "3 min read",
  },
  {
    slug: "pdf-privacy-why-you-should-never-upload-documents-online",
    title: "PDF Privacy: Why You Should Never Upload Sensitive Documents Online",
    date: "May 5, 2026",
    description: "Most online PDF tools upload your files to their servers. For documents containing Aadhaar numbers, bank statements, or medical records, this is a serious privacy risk. Here's what you need to know.",
    tag: "Privacy",
    readTime: "6 min read",
  },
  {
    slug: "best-pdf-tools-for-students-india",
    title: "Best Free PDF Tools for Students in India (2026)",
    date: "April 28, 2026",
    description: "From compressing assignment PDFs for email submission to merging multiple notes into one study guide — here's a complete guide to the best free PDF tools built for Indian students.",
    tag: "Guide",
    readTime: "5 min read",
  },
  {
    slug: "pdf-file-size-reduction-tips",
    title: "10 Tips to Reduce PDF File Size Before Sending",
    date: "April 20, 2026",
    description: "Email attachments have size limits. WhatsApp blocks files over 100MB. Portals reject uploads above 2MB. Master these 10 practical tips to get your PDF under any size limit quickly.",
    tag: "Tips",
    readTime: "5 min read",
  },
];

export default function BlogPage() {
  return (
    <AppShell>
      <main className="flex-1">
        {/* Header */}
        <section className="relative overflow-hidden border-b border-border bg-background px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8">
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
            <div className="absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-b from-accent-light/50 to-transparent blur-3xl" />
          </div>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              PDFTools{" "}
              <span className="text-accent">Blog</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-muted leading-relaxed">
              PDF tips, tutorials, and guides from the PDFTools team. Learn how to work smarter with your documents.
            </p>
          </div>
        </section>

        {/* Posts grid */}
        <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold bg-accent-light text-accent">
                      {post.tag}
                    </span>
                    <span className="text-xs text-muted">{post.readTime}</span>
                  </div>
                  <h2 className="mt-4 text-base font-bold leading-snug text-foreground group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {post.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs text-muted">{post.date}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent transition group-hover:gap-2">
                      Read more
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
