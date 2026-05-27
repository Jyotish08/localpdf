import Link from "next/link";
import AppShell from "./components/AppShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | LocalPDF",
  description: "The page you are looking for does not exist.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-accent-light/30 text-accent">
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 text-lg text-muted max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
        </p>
        
        <div className="mt-10 w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-left shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
            Popular Pages
          </h2>
          <ul className="flex flex-col gap-3">
            <li>
              <Link href="/" className="flex items-center gap-2 text-foreground hover:text-accent font-medium transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                Home
              </Link>
            </li>
            <li>
              <Link href="/compress" className="flex items-center gap-2 text-foreground hover:text-accent font-medium transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                Compress PDF
              </Link>
            </li>
            <li>
              <Link href="/merge" className="flex items-center gap-2 text-foreground hover:text-accent font-medium transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                Merge PDFs
              </Link>
            </li>
            <li>
              <Link href="/split" className="flex items-center gap-2 text-foreground hover:text-accent font-medium transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                Split PDF
              </Link>
            </li>
            <li>
              <Link href="/blog" className="flex items-center gap-2 text-foreground hover:text-accent font-medium transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                PDF Tips &amp; Guides Blog
              </Link>
            </li>
          </ul>
        </div>
      </main>
    </AppShell>
  );
}
