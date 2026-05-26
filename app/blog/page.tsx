import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Blog — PDFTools",
  description: "PDF tips, guides, and tutorials from the PDFTools team. Learn how to compress, merge, split, and manage PDF files efficiently.",
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

const tagColors: Record<string, string> = {
  Compress: "bg-teal-100 text-teal-700",
  Merge: "bg-violet-100 text-violet-700",
  Split: "bg-amber-100 text-amber-700",
  Privacy: "bg-red-100 text-red-700",
  Guide: "bg-blue-100 text-blue-700",
  Tips: "bg-emerald-100 text-emerald-700",
};

export default function BlogPage() {
  return (
    <div className="flex min-h-full flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="relative overflow-hidden border-b border-slate-200/80 bg-white px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8">
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
            <div className="absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-b from-teal-100/60 to-transparent blur-3xl" />
          </div>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              PDFTools{" "}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-slate-600 leading-relaxed">
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
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${tagColors[post.tag] ?? "bg-slate-100 text-slate-700"}`}>
                      {post.tag}
                    </span>
                    <span className="text-xs text-slate-400">{post.readTime}</span>
                  </div>
                  <h2 className="mt-4 text-base font-bold leading-snug text-slate-900 group-hover:text-teal-700 transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {post.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{post.date}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 transition group-hover:gap-2">
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
      <Footer />
    </div>
  );
}
