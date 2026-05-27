import type { Metadata } from "next";
import AppShell from "../components/AppShell";

export const metadata: Metadata = {
  title: "Terms of Service — PDFTools",
  description: "Terms of Service for PDFTools. Read our acceptable use policy, liability limitations, and intellectual property terms.",
  alternates: { canonical: "https://localpdf.dev/terms" },
};

export default function TermsPage() {
  return (
    <AppShell>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Terms of Service</h1>
          <p className="mt-3 text-muted text-sm">Last updated: May 26, 2026</p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10 space-y-10 text-muted leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using PDFTools (&quot;the Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use the Service. These Terms apply to all visitors and users of the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. Description of Service</h2>
            <p>PDFTools provides browser-based PDF utility tools including compression, merging, and splitting of PDF files. All processing occurs locally within your web browser. The Service is provided free of charge and is supported by advertising.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. Acceptable Use</h2>
            <p className="mb-3">You agree to use PDFTools only for lawful purposes. You must not use the Service to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Process, store, or distribute files containing illegal content, including but not limited to content that violates copyright, contains malware, or is otherwise prohibited by applicable law.</li>
              <li>Attempt to circumvent, disable, or otherwise interfere with security-related features of the Service.</li>
              <li>Use automated tools (bots, scrapers, crawlers) to access the Service in a manner that places unreasonable load on our infrastructure.</li>
              <li>Misrepresent your identity or affiliation with any person or organization.</li>
              <li>Engage in any activity that violates the rights of third parties.</li>
            </ul>
            <p className="mt-3">We reserve the right to block access to the Service for users who violate these Terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. No Liability for File Loss or Corruption</h2>
            <p className="mb-3">PDFTools is provided &quot;as is&quot; without any warranties, express or implied. While we strive to provide reliable tools, we cannot guarantee that the Service will be error-free or that file operations will always produce the expected result.</p>
            <p className="mb-3"><strong>You acknowledge and agree that:</strong></p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>PDFTools is not liable for any loss, corruption, or unintended modification of your files resulting from use of the Service.</li>
              <li>You should always maintain backups of important documents before processing them with any tool, including PDFTools.</li>
              <li>PDFTools is not responsible for any indirect, incidental, special, consequential, or punitive damages arising from your use or inability to use the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">5. Service Availability</h2>
            <p className="mb-3">We aim to make PDFTools available at all times, but we do not guarantee uninterrupted access. The Service may be temporarily unavailable due to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Scheduled or emergency maintenance</li>
              <li>Technical failures or outages</li>
              <li>Events beyond our reasonable control (force majeure)</li>
            </ul>
            <p className="mt-3">We reserve the right to modify, suspend, or discontinue any part of the Service at any time without prior notice. We shall not be liable for any loss resulting from such modification, suspension, or discontinuation.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">6. Intellectual Property</h2>
            <p className="mb-3">The PDFTools website — including its design, branding, logo, source code, and written content — is the intellectual property of PDFTools and is protected by applicable copyright, trademark, and other intellectual property laws.</p>
            <p className="mb-3">The underlying PDF processing is powered by open-source libraries (PDF.js, pdf-lib) which are licensed under their respective open-source licenses. PDFTools does not claim ownership of these libraries.</p>
            <p>Your files remain your intellectual property at all times. PDFTools makes no claim to ownership of any files you process using the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">7. Privacy</h2>
            <p>Your use of the Service is also governed by our <a href="/privacy-policy" className="text-accent underline hover:text-accent/80">Privacy Policy</a>, which is incorporated into these Terms by reference. Because all file processing is done locally in your browser, PDFTools does not have access to your files or their contents.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">8. Third-Party Links</h2>
            <p>The Service may contain links to third-party websites. These links are provided for your convenience only. PDFTools has no control over the content of those sites and accepts no responsibility for them or for any loss or damage that may arise from your use of them.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">9. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of India. Any dispute arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in India.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">10. Changes to These Terms</h2>
            <p>We reserve the right to modify these Terms at any time. We will indicate the date of the most recent update at the top of this page. Your continued use of the Service after any changes constitutes your acceptance of the revised Terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">11. Contact</h2>
            <p>If you have questions about these Terms, please contact us at <a href="mailto:legal@pdftools.app" className="font-semibold text-accent hover:underline">legal@pdftools.app</a></p>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
