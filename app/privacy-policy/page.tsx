import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — PDFTools",
  description: "PDFTools privacy policy. We do not collect your files or personal data. Files are processed entirely in your browser.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-full flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Privacy Policy</h1>
            <p className="mt-3 text-slate-500 text-sm">Last updated: May 26, 2026</p>
            <div className="mt-6 rounded-xl border border-teal-200/60 bg-teal-50/80 px-5 py-4 text-sm text-teal-800">
              <strong>TL;DR:</strong> We do not collect your files. All PDF processing happens entirely inside your browser. No data is sent to any server. We may serve ads through Google AdSense.
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 space-y-10 text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">1. Introduction</h2>
              <p>PDFTools operates pdftools.app. This Privacy Policy explains how we handle information when you use our Service. We are committed to protecting your privacy and have designed our tools so that no personal data or file content ever needs to leave your device.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">2. Data Collection</h2>
              <p className="mb-3"><strong>We do not collect personal data.</strong> PDFTools requires no account, no name, no email address, and no personally identifiable information to use any tool.</p>
              <p className="mb-3"><strong>We do not collect your files.</strong> Your PDF files are never uploaded to any server. All processing happens locally inside your web browser. When you close the tab, your files are gone — they existed only in browser memory.</p>
              <p><strong>We do not use persistent tracking cookies.</strong> No cookies are set for cross-site tracking or advertising profile building by PDFTools itself. Any cookies set are by third-party ad providers as described below.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">3. File Processing</h2>
              <p className="mb-3">All PDF operations — compression, merging, splitting — are performed <strong>100% client-side</strong> using open-source libraries running entirely in your browser: PDF.js for rendering, pdf-lib for PDF manipulation, and the HTML Canvas API for image re-encoding.</p>
              <p>No file bytes, page content, metadata, or document text leaves your device at any point. Your processed output is generated locally and downloaded directly to your device. We never see it.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">4. Analytics</h2>
              <p>We may use privacy-respecting, aggregated analytics to understand how many people visit our site and which tools are used. This data is anonymous — we cannot identify individual users from it. We do not use session-recording or user-tracking analytics tools.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">5. Third-Party Services &amp; Advertising</h2>
              <p className="mb-3">PDFTools is supported by <strong>Google AdSense</strong>. Google AdSense may set cookies or use similar technologies to serve personalised advertisements. This is controlled by Google, not PDFTools.</p>
              <p className="mb-3">You may opt out of personalised advertising at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-teal-600 underline hover:text-teal-700">adssettings.google.com</a>. For more information see <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-teal-600 underline hover:text-teal-700">Google&apos;s Privacy &amp; Terms</a>.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">6. Children&apos;s Privacy</h2>
              <p>PDFTools does not knowingly collect personal information from children under 13. Since we collect no personal information from any user, this applies universally.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">7. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time and will update the date at the top of this page. Continued use of the Service after changes constitutes acceptance of the updated policy.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">8. Contact</h2>
              <p>Questions about this policy? Contact us at <a href="mailto:privacy@pdftools.app" className="font-semibold text-teal-600 hover:underline">privacy@pdftools.app</a></p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
