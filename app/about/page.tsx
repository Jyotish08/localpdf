import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "About — PDFTools",
  description:
    "Learn about PDFTools — a free, browser-based PDF tool built for students, freelancers, and office workers. Your files never leave your device.",
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
      "No subscriptions, no sign-ups, no paywalls. Every tool on PDFTools is free forever. We're supported by non-intrusive ads.",
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
    <div className="flex min-h-full flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8">
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
            <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-b from-teal-100/80 via-emerald-50/50 to-transparent blur-3xl" />
          </div>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-800">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
              </span>
              Free · Private · No Sign-up
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              About{" "}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                PDFTools
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              PDFTools is a free, browser-based PDF utility suite that gives you
              professional document tools without compromising your privacy. Your
              files never leave your device — period.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="border-t border-slate-200/80 bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-teal-200/60 bg-gradient-to-br from-teal-50 to-emerald-50/80 p-8 sm:p-12">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Our Mission
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-700">
                We believe powerful PDF tools should be accessible to everyone —
                a student in Jaipur submitting their college project, a
                freelancer in Mumbai sending a polished proposal, or an office
                worker anywhere in the world managing large document archives.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-slate-700">
                Most online PDF tools require uploading your sensitive documents
                to unknown servers. We built PDFTools differently: every
                operation — compression, merging, splitting — runs entirely in
                your browser using modern Web APIs. Close the tab, and your data
                is gone. It&apos;s not stored anywhere because it was never sent
                anywhere.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-slate-700">
                Our mission is to be the most trusted, most private, and most
                accessible PDF toolkit on the web — completely free, forever.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Why choose PDFTools?
              </h2>
              <p className="mt-3 text-slate-600">
                Everything you need, nothing you don&apos;t.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/20">
                    {f.icon}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who we serve */}
        <section className="border-t border-slate-200/80 bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Built for India &amp; the world
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600 leading-relaxed">
              With over 500 million internet users, India has a huge need for
              reliable, free productivity tools. PDFTools was built with India in
              mind — fast on low-bandwidth connections, works on mid-range
              Android browsers, and never requires an account or subscription.
              But our tools are equally useful for anyone, anywhere in the world.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6">
              {[
                { label: "Students", emoji: "🎓", desc: "Submit assignments, convert notes, shrink file sizes for email" },
                { label: "Freelancers", emoji: "💼", desc: "Merge invoices, split contracts, compress proposals" },
                { label: "Office Workers", emoji: "🏢", desc: "Manage large PDF archives, split reports, combine documents" },
              ].map((g) => (
                <div key={g.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <div className="text-3xl">{g.emoji}</div>
                  <h3 className="mt-3 font-semibold text-slate-900">{g.label}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Get in touch
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Have a suggestion, found a bug, or want to collaborate? We&apos;d
              love to hear from you.
            </p>
            <div className="mt-6 flex flex-col items-center gap-4">
              <a
                href="mailto:hello@pdftools.app"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-500/30 transition hover:from-teal-500 hover:to-emerald-500"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                hello@pdftools.app
              </a>
              <Link
                href="/contact"
                className="text-sm font-medium text-teal-600 transition hover:text-teal-700 hover:underline"
              >
                Or use our contact form →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
