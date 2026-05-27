import Link from "next/link";
import AppShell from "../components/AppShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTML Sitemap | LocalPDF",
  description: "HTML sitemap for LocalPDF. Find links to all our free PDF tools, blog posts, and legal pages.",
  alternates: { canonical: "https://localpdf.dev/sitemap" },
};

export default function SitemapHtmlPage() {
  const tools = [
    { href: "/compress", title: "Compress PDF" },
    { href: "/merge", title: "Merge PDF" },
    { href: "/split", title: "Split PDF" },
  ];

  const legal = [
    { href: "/privacy-policy", title: "Privacy Policy" },
    { href: "/terms", title: "Terms of Service" },
    { href: "/disclaimer", title: "Disclaimer" },
  ];

  const other = [
    { href: "/", title: "Home" },
    { href: "/about", title: "About LocalPDF" },
    { href: "/contact", title: "Contact Us" },
    { href: "/blog", title: "Blog" },
  ];

  const blogSlugs = [
    "how-to-compress-pdf-without-losing-quality",
    "merge-multiple-pdfs-into-one-free",
    "split-pdf-extract-specific-pages",
    "pdf-privacy-why-you-should-never-upload-documents-online",
    "best-pdf-tools-for-students-india",
    "pdf-file-size-reduction-tips",
  ];

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Site Map</h1>
          <p className="mt-3 text-muted text-lg">A complete overview of the LocalPDF website.</p>
        </div>
        
        <div className="grid gap-12 sm:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">Main Pages</h2>
            <ul className="space-y-3">
              {other.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-accent hover:underline font-medium">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="text-xl font-bold text-foreground mb-4 mt-8 border-b border-border pb-2">PDF Tools</h2>
            <ul className="space-y-3">
              {tools.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-accent hover:underline font-medium">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="text-xl font-bold text-foreground mb-4 mt-8 border-b border-border pb-2">Legal</h2>
            <ul className="space-y-3">
              {legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-accent hover:underline font-medium">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">Blog Posts</h2>
            <ul className="space-y-3">
              {blogSlugs.map((slug) => (
                <li key={slug}>
                  <Link href={`/blog/${slug}`} className="text-accent hover:underline font-medium">
                    {slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
