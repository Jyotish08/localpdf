"use client";

import { useState, useRef } from "react";
import AppShell from "../components/AppShell";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const message = data.get("message") as string;
    const subject = encodeURIComponent(`[PDFTools] Message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:hello@pdftools.app?subject=${subject}&body=${body}`;
    setStatus("sent");
    formRef.current?.reset();
  };

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
            Got a question, bug report, or feature idea? We&apos;d love to hear from you. Fill out the form below and your email client will open with the message ready to send.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          {status === "sent" ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-success">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-foreground">Email client opened!</h2>
              <p className="text-muted max-w-sm">Your message has been prepared. Please send it from your email client. We&apos;ll get back to you as soon as possible.</p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-2 rounded-xl border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground transition hover:bg-accent-light hover:text-accent"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-semibold text-foreground mb-1.5">
                  Your Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Priya Sharma"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-semibold text-foreground mb-1.5">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  placeholder="priya@example.com"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-semibold text-foreground mb-1.5">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/30 transition hover:bg-accent/90"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
                Send Message
              </button>
              <p className="text-center text-xs text-muted">
                This opens your email client with the message pre-filled. No data is sent to PDFTools servers.
              </p>
            </form>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted">
            Or email us directly at{" "}
            <a href="mailto:hello@pdftools.app" className="font-semibold text-accent hover:underline">
              hello@pdftools.app
            </a>
          </p>
        </div>
      </main>
    </AppShell>
  );
}
