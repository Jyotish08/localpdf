import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-sm font-bold text-white shadow-md shadow-teal-500/25">
            PDF
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            PDFTools
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 sm:flex">
          <Link href="/compress" className="transition-colors hover:text-teal-600">Compress</Link>
          <Link href="/merge" className="transition-colors hover:text-teal-600">Merge</Link>
          <Link href="/split" className="transition-colors hover:text-teal-600">Split</Link>
          <Link href="/blog" className="transition-colors hover:text-teal-600">Blog</Link>
          <Link href="/about" className="transition-colors hover:text-teal-600">About</Link>
        </nav>
        <Link
          href="/"
          className="sm:hidden text-sm font-medium text-slate-600 transition hover:text-teal-600"
        >
          ← Home
        </Link>
      </div>
    </header>
  );
}
