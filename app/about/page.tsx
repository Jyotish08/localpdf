import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "../components/AppShell";

export const metadata: Metadata = {
  title: "About LocalPDF — Free Private PDF Tools | LocalPDF",
  description:
    "Learn about LocalPDF, the free browser-based PDF toolkit built for privacy. No servers, no data collection — your files never leave your device.",
  alternates: { canonical: "https://localpdf.dev/about" },
};

const features = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "100% Private",
    description:
      "Every operation runs entirely inside your browser using Web APIs. Your files are never sent to any server — not even ours.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Lightning Fast",
    description:
      "No uploads, no queues, no waiting. Processing happens instantly on your own device's CPU and GPU.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
    title: "Always Free",
    description:
      "No subscriptions, no sign-ups, no paywalls. Every tool on LocalPDF is free forever. We're supported by non-intrusive ads.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
    title: "Mobile Friendly",
    description:
      "Works seamlessly on phones, tablets, and desktops — no app download required. Just open your browser and go.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    title: "Built for Everyone",
    description:
      "Designed for students submitting assignments, freelancers sending proposals, and office workers managing documents — in India and globally.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
    title: "Open Web Standards",
    description:
      "Built entirely on open web technologies: PDF.js, pdf-lib, and the HTML Canvas API. No proprietary plugins needed.",
  },
];

export default function AboutPage() {
  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-accent-light/50 blur-3xl" />
        </div>
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-1.5 text-sm font-medium text-success">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            Free · Private · No Sign-up
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            About <span className="text-accent">LocalPDF</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            LocalPDF is a free, browser-based PDF utility suite that gives you professional document tools without compromising your privacy. Based in India, our mission is to provide secure tools where your files never leave your device — period.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="border-t border-border bg-card px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-accent/20 bg-accent-light/30 p-8 sm:p-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Our Mission</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              We believe powerful PDF tools should be accessible to everyone — a student in Jaipur submitting their college project, a freelancer in Mumbai sending a polished proposal, or an office worker anywhere in the world managing large document archives.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Most online PDF tools require uploading your sensitive documents to unknown servers. We built LocalPDF differently: every operation — compression, merging, splitting — runs entirely in your browser using modern Web APIs. Close the tab, and your data is gone. It&apos;s not stored anywhere because it was never sent anywhere.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Our mission is to be the most trusted, most private, and most accessible PDF toolkit on the web — completely free, forever.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Why choose LocalPDF?</h2>
            <p className="mt-3 text-muted">Everything you need, nothing you don&apos;t.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-white shadow-md shadow-accent/20">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="border-t border-border bg-card px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Built for India &amp; the world</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted leading-relaxed">
            With over 500 million internet users, India has a huge need for reliable, free productivity tools. LocalPDF was built with India in mind — fast on low-bandwidth connections, works on mid-range Android browsers, and never requires an account or subscription. But our tools are equally useful for anyone, anywhere in the world.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { label: "Students", emoji: "🎓", desc: "Submit assignments, convert notes, shrink file sizes for email" },
              { label: "Freelancers", emoji: "💼", desc: "Merge invoices, split contracts, compress proposals" },
              { label: "Office Workers", emoji: "🏢", desc: "Manage large PDF archives, split reports, combine documents" },
            ].map((g) => (
              <div key={g.label} className="rounded-2xl border border-border bg-background p-6">
                <div className="text-3xl">{g.emoji}</div>
                <h3 className="mt-3 font-semibold text-foreground">{g.label}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Get in touch</h2>
          <p className="mt-4 text-muted leading-relaxed">
            Have a suggestion, found a bug, or want to collaborate? We&apos;d love to hear from you.
          </p>
          <div className="mt-6 flex flex-col items-center gap-4">
            <a
              href="mailto:localpdf.tool@gmail.com"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-accent/90"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              localpdf.tool@gmail.com
            </a>
            <Link href="/contact" className="text-sm font-medium text-accent transition hover:underline">
              Or use our contact form →
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
