import type { Metadata } from "next";
import AppShell from "../components/AppShell";

export const metadata: Metadata = {
  title: "Privacy Policy | LocalPDF",
  description: "Read LocalPDF's privacy policy. Learn how we handle your data, our use of Google AdSense cookies, and your rights as a user.",
  alternates: { canonical: "https://localpdf.dev/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <AppShell>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Privacy Policy</h1>
          <p className="mt-3 text-muted text-lg font-semibold">Last Updated: May 27, 2026</p>
          <div className="mt-6 rounded-xl border border-success/30 bg-success/10 px-5 py-4 text-sm text-success font-medium">
            <strong>TL;DR:</strong> We do not collect your files. All PDF processing happens entirely inside your browser. No data is sent to any server. We may serve ads through Google AdSense.
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10 space-y-10 text-muted leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Introduction</h2>
            <p>LocalPDF operates localpdf.dev. This Privacy Policy explains how we handle information when you use our Service. We are committed to protecting your privacy and have designed our tools so that no personal data or file content ever needs to leave your device.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. Data Collection Practices</h2>
            <p className="mb-3"><strong>What LocalPDF collects:</strong> We do not collect personal data. LocalPDF requires no account, no name, no email address, and no personally identifiable information to use any tool.</p>
            <p className="mb-3"><strong>File Processing:</strong> Your PDF files are never uploaded to any server. All processing happens locally inside your web browser. When you close the tab, your files are gone — they existed only in browser memory.</p>
            <p><strong>What AdSense collects:</strong> Google AdSense uses cookies to serve ads based on your prior visits to our website or other websites.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. File Processing</h2>
            <p className="mb-3">All PDF operations — compression, merging, splitting — are performed <strong>100% client-side</strong> using open-source libraries running entirely in your browser: PDF.js for rendering, pdf-lib for PDF manipulation, and the HTML Canvas API for image re-encoding.</p>
            <p>No file bytes, page content, metadata, or document text leaves your device at any point. Your processed output is generated locally and downloaded directly to your device. We never see it.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. Analytics</h2>
            <p>We may use privacy-respecting, aggregated analytics to understand how many people visit our site and which tools are used. This data is anonymous — we cannot identify individual users from it. We do not use session-recording or user-tracking analytics tools.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">5. Google AdSense &amp; Advertising</h2>
            <p className="mb-3">LocalPDF uses <strong>Google AdSense</strong> to display advertisements and keep our tools free. Google AdSense and its third-party vendors use cookies, including the DoubleClick cookie, to serve ads based on a user&apos;s prior visits to our website or other websites on the internet.</p>
            <p className="mb-3">Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.</p>
            <p className="mb-3">Users may opt out of personalized advertising by visiting Google&apos;s <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-accent underline hover:text-accent/80">Ads Settings</a>. Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-accent underline hover:text-accent/80">www.aboutads.info</a>.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">6. Children&apos;s Privacy (COPPA Compliance)</h2>
            <p>Our website and tools are not directed at children under the age of 13. We comply with the requirements of COPPA (Children&apos;s Online Privacy Protection Act) and do not knowingly collect any information from anyone under 13 years of age. If we become aware that we have inadvertently received personal information from a child under 13, we will delete such information from our records.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">7. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">8. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:localpdf.tool@gmail.com" className="font-semibold text-accent hover:underline">localpdf.tool@gmail.com</a></p>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
