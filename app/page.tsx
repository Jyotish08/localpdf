import Link from "next/link";

const tools = [
  {
    name: "Compress",
    description: "Shrink file size without uploading to a server.",
    href: "/compress",
    icon: (
      <svg
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12M12 16.5V3"
        />
      </svg>
    ),
    accent: "from-teal-500 to-emerald-600",
    ring: "group-hover:ring-teal-200",
  },
  {
    name: "Merge",
    description: "Combine multiple PDFs into one document.",
    href: "/merge",
    icon: (
      <svg
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
    ),
    accent: "from-violet-500 to-purple-600",
    ring: "group-hover:ring-violet-200",
  },
  {
    name: "Split",
    description: "Extract pages or divide a PDF into parts.",
    href: "/split",
    icon: (
      <svg
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
        />
      </svg>
    ),
    accent: "from-amber-500 to-orange-600",
    ring: "group-hover:ring-amber-200",
  },
] as const;

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      {/* Header */}
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
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 sm:flex">
            <a href="#tools" className="transition-colors hover:text-teal-600">
              Tools
            </a>
            <a href="#privacy" className="transition-colors hover:text-teal-600">
              Privacy
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            aria-hidden
          >
            <div className="absolute left-1/2 top-0 h-[480px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-teal-100/80 via-emerald-50/50 to-transparent blur-3xl" />
            <div className="absolute -right-24 top-32 h-64 w-64 rounded-full bg-violet-100/60 blur-3xl" />
            <div className="absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-amber-100/50 blur-3xl" />
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-800">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
              </span>
              100% client-side · No uploads
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl lg:leading-[1.1]">
              Files never leave{" "}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                your device
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl">
              Compress, merge, and split PDFs right in your browser. Fast,
              free, and private — your documents stay on your machine.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#tools"
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-500/30 transition hover:from-teal-500 hover:to-emerald-500 sm:w-auto"
              >
                Choose a tool
              </a>
              <a
                href="#privacy"
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
              >
                How we protect you
              </a>
            </div>
          </div>
        </section>

        {/* Tools */}
        <section
          id="tools"
          className="border-t border-slate-200/80 bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center sm:mb-14">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Everything you need
              </h2>
              <p className="mt-3 text-slate-600">
                Pick a tool to get started — no account required.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className={`group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:ring-4 ${tool.ring}`}
                >
                  <div
                    className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.accent} text-white shadow-md`}
                  >
                    {tool.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {tool.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {tool.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-teal-600 transition group-hover:gap-2">
                    Open tool
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy highlight */}
        <section
          id="privacy"
          className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        >
          <div className="mx-auto max-w-4xl rounded-2xl border border-teal-200/60 bg-gradient-to-br from-teal-50 to-emerald-50/80 p-8 sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-teal-600 shadow-sm">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  Privacy by design
                </h2>
                <p className="mt-2 text-slate-600 leading-relaxed">
                  PDFTools runs entirely in your browser using Web APIs. We
                  never see, store, or transmit your files. Close the tab and
                  your data is gone.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-slate-900 text-slate-300">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-xs font-bold text-white">
                  PDF
                </span>
                <span className="text-lg font-semibold text-white">
                  PDFTools
                </span>
              </div>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
                Simple PDF utilities that respect your privacy. Built for the
                web, powered by your device.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:gap-16">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Tools
                </h3>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>
                    <Link
                      href="/compress"
                      className="transition hover:text-white"
                    >
                      Compress
                    </Link>
                  </li>
                  <li>
                    <Link href="/merge" className="transition hover:text-white">
                      Merge
                    </Link>
                  </li>
                  <li>
                    <Link href="/split" className="transition hover:text-white">
                      Split
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Legal
                </h3>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>
                    <span className="text-slate-500">Privacy Policy</span>
                  </li>
                  <li>
                    <span className="text-slate-500">Terms of Use</span>
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
    </div>
  );
}
