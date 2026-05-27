import Link from "next/link";

export default function PrivacyBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent to-accent/90 px-6 py-12 sm:px-12 sm:py-16">
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="2" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
        <div className="flex items-center gap-6">
          <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md md:flex">
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Privacy first. Productivity always.
            </h2>
            <p className="mt-3 max-w-lg text-lg text-white/80">
              No servers. No tracking. No nonsense. All file processing happens entirely in your browser using modern Web APIs.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-center">
          <Link
            href="/compress"
            className="inline-flex h-14 items-center justify-center rounded-xl bg-white px-8 text-base font-bold text-accent shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Start Using PDFTools
          </Link>
          <p className="mt-3 text-sm text-white/60">No sign-up required</p>
        </div>
      </div>
    </div>
  );
}
