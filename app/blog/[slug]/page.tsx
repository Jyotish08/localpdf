import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "../../components/AppShell";

const posts: Record<
  string,
  {
    title: string;
    date: string;
    tag: string;
    readTime: string;
    content: string;
  }
> = {
  "how-to-compress-pdf-without-losing-quality": {
    title: "How to Compress a PDF Without Losing Quality",
    date: "May 20, 2026",
    tag: "Compress",
    readTime: "4 min read",
    content: `Large PDFs are a daily frustration — email providers reject attachments over 25 MB, WhatsApp blocks files over 100 MB, and government portals often cap uploads at 2 MB. Yet compressing a PDF the wrong way can make text blurry and images unreadable.

Here's the good news: you can significantly reduce PDF file size without visibly losing quality if you understand what makes PDFs large in the first place.

## Why are PDFs large?

PDFs become bloated for a few reasons:
- **High-resolution embedded images** — scanned documents, photos, and screenshots at 300+ DPI are the single biggest contributor to file size.
- **Embedded fonts** — full font subsets can add hundreds of kilobytes.
- **Metadata and revision history** — PDFs that have been edited multiple times retain revision data.
- **Uncompressed page streams** — some generators don't apply stream compression.

## The right way to compress

The most effective approach for most PDFs is to re-render each page as a compressed JPEG image. This is exactly what PDFTools does:

1. Each page is rendered using PDF.js at an appropriate DPI.
2. The rendered image is re-encoded as a JPEG at a quality level you choose (low, medium, high).
3. pdf-lib reassembles the images into a new PDF.

**Pro tip:** Use "Low compression" (85% JPEG quality) for documents where text sharpness is critical, like legal contracts. Use "High compression" (35% quality) for scanned images or photos where file size matters more.

## When to use which setting

| Setting | JPEG Quality | Best for |
|---|---|---|
| Low compression | 85% | Legal docs, forms, certificates |
| Medium | 60% | General use, reports, assignments |
| High compression | 35% | Scanned photos, casual sharing |

Try PDFTools Compress now — your files never leave your device.`,
  },
  "merge-multiple-pdfs-into-one-free": {
    title: "Merge Multiple PDFs Into One — Free & Instant",
    date: "May 15, 2026",
    tag: "Merge",
    readTime: "3 min read",
    content: `Whether you're a student combining chapters, a freelancer assembling a proposal from multiple templates, or an HR professional packaging onboarding documents — merging PDFs is one of the most common document tasks there is.

## Why merging matters

Sending five separate PDFs is unprofessional and inconvenient for the recipient. A single, unified document is easier to read, easier to print, and easier to file. Many submission portals also only accept a single PDF file.

## How PDFTools Merge works

Our merge tool uses pdf-lib to stitch PDFs together entirely in your browser:

1. Upload two or more PDF files by dragging and dropping or clicking to browse.
2. Reorder them by dragging — put your cover page first, appendix last.
3. Click "Merge PDFs" and your browser generates the combined file instantly.
4. Download the result directly to your device.

Because everything runs client-side, there's no upload queue, no file size limit imposed by a server, and no risk of your documents being stored anywhere.

## Common use cases

- **Students:** Combine an assignment PDF, reference sheet, and plagiarism report into one submission.
- **Freelancers:** Merge a cover letter, portfolio pages, and pricing sheet into one proposal PDF.
- **Office workers:** Combine monthly invoices into a quarterly archive, or merge department reports into a single board presentation.

Give it a try — it takes under 10 seconds.`,
  },
  "split-pdf-extract-specific-pages": {
    title: "How to Split a PDF and Extract Specific Pages",
    date: "May 10, 2026",
    tag: "Split",
    readTime: "3 min read",
    content: `You've downloaded a 200-page industry report but only need pages 12–18. Or you have a combined invoice PDF and need to send each client only their own page. Splitting PDFs is the answer.

## What PDF splitting does

PDF splitting extracts a subset of pages from an existing PDF and creates a new document from them. You can:
- Extract a single page
- Extract a page range (e.g. pages 5–20)
- Split a document into individual single-page PDFs

## How PDFTools Split works

1. Upload your PDF.
2. Enter the pages you want — for example, "1-5, 8, 12-15".
3. Click Split and download the resulting PDF.

All processing happens in your browser using pdf-lib. The original file is untouched on your device, and no data is sent to any server.

## Practical examples

**Extracting a chapter from an e-book:** You have a 400-page programming book and want to share only the chapter on databases. Enter the page range (e.g. 87-112), split, and share.

**Separating invoices:** You've scanned 12 invoices into one PDF. Split into individual pages and rename each file for your records.

**Preparing a presentation:** You have a 50-slide PDF presentation and need to share only the executive summary (pages 1-3) with stakeholders.

PDFTools Split is free, instant, and private. Try it now.`,
  },
  "pdf-privacy-why-you-should-never-upload-documents-online": {
    title: "PDF Privacy: Why You Should Never Upload Sensitive Documents Online",
    date: "May 5, 2026",
    tag: "Privacy",
    readTime: "6 min read",
    content: `Every week, millions of people upload their most sensitive documents to random websites to compress, merge, or convert them. Bank statements, Aadhaar cards, salary slips, medical records, legal agreements — all uploaded to servers owned by strangers.

This is a massive, largely unacknowledged privacy risk.

## What happens when you upload a PDF online

When you click "Upload" on a typical online PDF tool:

1. Your file is transmitted over the internet to a server (often in the US or EU).
2. The file is processed on that server.
3. In many cases, the file is **retained** — sometimes for hours, sometimes permanently.
4. The processed output is returned to you.

Most tools claim files are "deleted after processing." But can you verify that? Do you know where the servers are? Do you know if they're properly secured?

## The specific risks

### Identity theft
Aadhaar numbers, PAN numbers, passport scans — these are goldmines for identity thieves. Uploading them to unverified services is an unnecessary risk.

### Data breaches
Even reputable companies suffer data breaches. If your sensitive PDFs are stored on their servers, they're vulnerable.

### Terms of service abuse
Read the fine print. Many free online services claim a broad license to use your uploaded content.

### Government compliance
For businesses, uploading client documents to unapproved third-party servers may violate data protection obligations.

## The client-side alternative

Browser-based tools like PDFTools process your files entirely within your web browser. Your PDF never leaves your device. The JavaScript code runs locally, manipulates the file in memory, and hands the result back to you.

This isn't just a marketing claim — it's technically verifiable. Open your browser's Network tab while using PDFTools. You'll see zero file upload requests.

For any document you'd be uncomfortable emailing to a stranger, use a client-side tool. Your privacy is worth it.`,
  },
  "best-pdf-tools-for-students-india": {
    title: "Best Free PDF Tools for Students in India (2026)",
    date: "April 28, 2026",
    tag: "Guide",
    readTime: "5 min read",
    content: `Indian students deal with PDFs constantly — assignment submissions, university forms, admit cards, marksheets, study materials. Here's a practical guide to free PDF tools that actually work.

## What students need most

Based on common student use cases, the most important PDF operations are:

1. **Compressing PDFs** — University portals often have 2–5 MB upload limits. Scanned documents can easily exceed this.
2. **Merging PDFs** — Combining a cover page, assignment body, and plagiarism report into one submission file.
3. **Splitting PDFs** — Extracting specific pages from a study guide to share with classmates.

## PDFTools — Our recommendation

PDFTools offers all three operations for free, with no account required, and crucially — **your files never leave your device**. This matters because students regularly handle documents containing personal information like roll numbers, Aadhaar details in admission forms, and financial aid documents.

Key advantages for students:
- Works on mobile (Android Chrome, Safari on iPhone)
- No file size limit (server-side tools often cap at 10–20 MB)
- No watermarks on output files
- No account, no subscription, no payment

## Tips for common student scenarios

**Submitting assignments under 2 MB:** Use the High compression setting. Most text-heavy PDFs compress to under half their original size.

**Combining documents for a scholarship application:** Upload all PDFs to the Merge tool, reorder them, and download a single combined file.

**Sharing only relevant pages from a textbook:** Use the Split tool to extract the specific pages you need.

## A note on privacy

Many popular "free" PDF tools store your uploaded files on their servers. For academic documents — which often contain personal details — this is a risk. Always prefer tools that process files client-side, like PDFTools.`,
  },
  "pdf-file-size-reduction-tips": {
    title: "10 Tips to Reduce PDF File Size Before Sending",
    date: "April 20, 2026",
    tag: "Tips",
    readTime: "5 min read",
    content: `Whether you're sending an email attachment, uploading to a government portal, or sharing via WhatsApp, file size matters. Here are 10 practical tips to get your PDF under any size limit.

## 1. Use a browser-based compression tool
The fastest way to reduce file size is a dedicated compression tool. PDFTools Compress re-renders your PDF pages as optimized images and reassembles them — no upload required.

## 2. Choose the right compression level
For text-heavy documents (contracts, reports), use Low or Medium compression to maintain readability. For scanned photos or image-heavy PDFs, High compression works well.

## 3. Reduce image resolution before creating the PDF
If you're creating a PDF from scratch, resize images to 150 DPI for on-screen use or 300 DPI for print, rather than leaving them at the original camera resolution.

## 4. Avoid scanning at unnecessarily high DPI
When scanning physical documents, 150 DPI is sufficient for most purposes. Scanning at 600 DPI creates files 4x larger than 300 DPI with no practical benefit for text documents.

## 5. Remove unnecessary pages
Use a split tool to extract only the pages you need before compressing. Fewer pages means smaller file.

## 6. Don't embed unused fonts
If you're creating PDFs programmatically, ensure font subsetting is enabled — this embeds only the characters actually used rather than the entire font file.

## 7. Convert to grayscale if colour isn't needed
Black-and-white PDFs are significantly smaller than colour ones. If your document has no colour-critical content, consider converting to grayscale.

## 8. Use PDF/A for archives, not for sharing
PDF/A format embeds all resources for long-term archiving, which makes files larger. Use standard PDF for sharing.

## 9. Remove metadata and revision history
PDFs that have been edited multiple times accumulate revision history. Re-exporting from a tool that doesn't preserve this metadata can reduce size.

## 10. Split before sending if needed
If you must share a large PDF and compression isn't enough, split it into parts and send each separately. Most email clients accept multiple attachments.

With these tips and the free tools at PDFTools, you should be able to get any PDF down to a shareable size in under a minute.`,
  },
};

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return {};
  return {
    title: `${post.title} — PDFTools Blog`,
    description: post.title,
  };
}

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="mt-8 mb-3 text-xl font-bold text-foreground">
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="mt-6 mb-2 text-base font-bold text-foreground">
          {line.replace("### ", "")}
        </h3>
      );
    } else if (line.startsWith("| ")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        if (!lines[i].startsWith("|---")) tableLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={`table-${i}`} className="my-4 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="min-w-full text-sm">
            <tbody>
              {tableLines.map((tl, ti) => {
                const cells = tl.split("|").filter(Boolean);
                return (
                  <tr key={ti} className={ti === 0 ? "bg-accent-light/50 font-semibold" : "border-t border-border"}>
                    {cells.map((cell, ci) => (
                      <td key={ci} className="px-4 py-3 text-muted">{cell.trim()}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      continue;
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].replace("- ", ""));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-3 list-disc list-inside space-y-1 text-muted">
          {items.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
          ))}
        </ul>
      );
      continue;
    } else if (line === "") {
      // skip blank lines between paragraphs
    } else {
      const html = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      elements.push(
        <p
          key={i}
          className="my-3 text-muted leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
    i++;
  }
  return elements;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) notFound();

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-accent mb-8"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Blog
        </Link>

        {/* Article */}
        <article className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-10">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold bg-accent-light text-accent">
              {post.tag}
            </span>
            <span className="text-sm text-muted">{post.date}</span>
            <span className="text-sm text-muted">·</span>
            <span className="text-sm text-muted">{post.readTime}</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-4">
            {post.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-3 border-b border-border pb-6 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
              PT
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">PDFTools Team</p>
              <p className="text-xs text-muted">pdftools.app</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose-like text-foreground">
            {renderContent(post.content)}
          </div>
        </article>

        {/* Related tools */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-foreground mb-5">Try our free PDF tools</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { href: "/compress", label: "Compress PDF", desc: "Reduce file size", varName: "--compress" },
              { href: "/merge", label: "Merge PDFs", desc: "Combine into one", varName: "--merge" },
              { href: "/split", label: "Split PDF", desc: "Extract pages", varName: "--split" },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div 
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white shadow-sm"
                  style={{ backgroundColor: `var(${tool.varName})` }}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground transition-colors group-hover:opacity-80">{tool.label}</p>
                  <p className="text-xs text-muted">{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </AppShell>
  );
}
