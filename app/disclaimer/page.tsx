import type { Metadata } from "next";
import AppShell from "../components/AppShell";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer | LocalPDF",
  description: "Disclaimer for LocalPDF. Read about our liability limitations, third-party links, and accuracy of information.",
  alternates: { canonical: "https://localpdf.dev/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <AppShell>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Disclaimer</h1>
          <p className="mt-3 text-muted text-lg font-semibold">Last Updated: May 27, 2026</p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10 space-y-10 text-muted leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. General Information</h2>
            <p>The information and tools provided by LocalPDF on localpdf.dev are for general informational and utility purposes only. All information and tools on the Site are provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information or tool on the Site.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. No Liability for File Processing</h2>
            <p>LocalPDF provides entirely browser-based tools for manipulating PDF files (such as compressing, merging, and splitting). While we strive to ensure our tools work as intended, PDF processing can occasionally result in formatting changes, data loss, or file corruption.</p>
            <p className="mt-3"><strong>Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information or tool provided on the site. Your use of the site and your reliance on any information or tool on the site is solely at your own risk.</strong> We strongly recommend that you keep backups of all important documents before processing them with LocalPDF.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. External Links Disclaimer</h2>
            <p>The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. Google AdSense &amp; Advertising Disclaimer</h2>
            <p>LocalPDF uses Google AdSense to display ads. These advertisements help keep our tools free. The presence of an advertisement does not constitute an endorsement or recommendation by LocalPDF of the product or service being advertised. We are not responsible for the claims or representations made by advertisers.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">5. Legal Documents</h2>
            <p>For more information on how we handle your data and the rules governing the use of our website, please review our:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
              <li><Link href="/privacy-policy" className="text-accent underline hover:text-accent/80">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-accent underline hover:text-accent/80">Terms of Service</Link></li>
            </ul>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
