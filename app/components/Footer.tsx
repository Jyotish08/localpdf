import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-xs font-bold text-white">
                PDF
              </span>
              <span className="text-lg font-semibold text-white">PDFTools</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
              Simple PDF utilities that respect your privacy. Built for the web,
              powered by your device.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Tools
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="/compress" className="transition hover:text-white">Compress</Link>
                </li>
                <li>
                  <Link href="/merge" className="transition hover:text-white">Merge</Link>
                </li>
                <li>
                  <Link href="/split" className="transition hover:text-white">Split</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Company
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="/about" className="transition hover:text-white">About</Link>
                </li>
                <li>
                  <Link href="/blog" className="transition hover:text-white">Blog</Link>
                </li>
                <li>
                  <Link href="/contact" className="transition hover:text-white">Contact</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Legal
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="/privacy-policy" className="transition hover:text-white">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms" className="transition hover:text-white">Terms of Use</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} PDFTools. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4 text-teal-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
            Your files stay on your device
          </p>
        </div>
      </div>
    </footer>
  );
}
