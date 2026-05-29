"use client";

import { useState } from "react";
import AppShell from "./components/AppShell";
import HeroDropzone from "./components/HeroDropzone";
import ToolPills from "./components/ToolPills";
import TrustBar from "./components/TrustBar";
import SocialBar from "./components/SocialBar";
import HomeFeatures from "./components/HomeFeatures";
import Testimonials from "./components/Testimonials";
import Reveal from "./components/Reveal";
import type { HomeToolId } from "./lib/design-system";

export default function HomePage() {
  const [selectedTool, setSelectedTool] = useState<HomeToolId>("compress");

  return (
    <AppShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": "https://localpdf.dev/#website",
                url: "https://localpdf.dev",
                name: "Localpdf",
                description:
                  "Free online PDF tools that work entirely in your browser. Compress, merge, and split PDFs instantly.",
              },
              {
                "@type": "WebApplication",
                "@id": "https://localpdf.dev/#webapp",
                name: "Localpdf",
                url: "https://localpdf.dev",
                applicationCategory: "UtilitiesApplication",
                operatingSystem: "Web",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              },
            ],
          }),
        }}
      />

      <section
        id="top"
        className="flex min-h-[calc(100dvh-64px)] flex-col items-center justify-center px-4 py-8 text-center"
      >
        <h1 className="max-w-[900px] text-[clamp(32px,4.5vw,52px)] font-extrabold leading-[1.15]">
          <span className="text-foreground">Your PDFs.</span>
          <br />
          <span className="text-accent">Done in Seconds.</span>
          <br />
          <span className="text-foreground">Right in Your Browser.</span>
        </h1>
        <p className="mt-4 max-w-[520px] text-lg text-body">
          No install. No account. Nothing leaves your device.
        </p>

        <HeroDropzone selectedTool={selectedTool} id="heroDropzone" />
        <ToolPills selected={selectedTool} onSelect={setSelectedTool} />
        <Reveal delay={560} className="mt-2.5 max-w-[680px] text-center text-[13px] text-muted">
          Click any tool above to get started instantly
        </Reveal>
      </section>

      <section className="px-4 pb-10">
        <TrustBar />
        <SocialBar />
      </section>

      <HomeFeatures onSelectTool={setSelectedTool} />
      <Testimonials />

      <section className="px-4 py-12 sm:py-16 lg:py-20" id="pricing">
        <div className="text-center">
          <Reveal>
            <HeroDropzone selectedTool={selectedTool} variant="bottom" pulseOnView />
          </Reveal>
        </div>
      </section>
    </AppShell>
  );
}
