import AppShell from "../components/AppShell";

export default function ContactPage() {
  return (
    <AppShell>
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-lg shadow-accent/25">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Contact Us</h1>
          <p className="mt-3 text-muted leading-relaxed">
            Got a question, bug report, or feature idea? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm text-center">
          <p className="text-lg font-medium text-foreground mb-4">
            📧 Email us at: <a href="mailto:localpdf.tool@gmail.com" className="text-accent hover:underline font-semibold">localpdf.tool@gmail.com</a>
          </p>
          <p className="text-sm text-muted">
            We typically respond within 24–48 hours.
          </p>
        </div>

        <div className="mt-8 text-center">
          <div className="mt-4 flex justify-center gap-4">
            <a href="/compress" className="text-sm font-medium text-muted hover:text-accent">FAQ - Compress</a>
            <a href="/merge" className="text-sm font-medium text-muted hover:text-accent">FAQ - Merge</a>
            <a href="/split" className="text-sm font-medium text-muted hover:text-accent">FAQ - Split</a>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
