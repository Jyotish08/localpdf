"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem("localpdf-cookie-consent");
    if (!consent) setHidden(false);
    else if (consent === "accepted") loadAdsense();
  }, []);

  const loadAdsense = () => {
    if (document.querySelector('script[src*="adsbygoogle.js"]')) return;
    const script = document.createElement("script");
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX";
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  };

  const handleAccept = () => {
    localStorage.setItem("localpdf-cookie-consent", "accepted");
    setHidden(true);
    loadAdsense();
  };

  if (hidden) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[2000] flex flex-wrap items-center justify-between gap-4 border-t border-border bg-card px-4 py-4 sm:px-8"
    >
      <p className="max-w-xl text-sm text-body">
        We use cookies for ad serving only. No personal data is collected.
      </p>
      <div className="flex shrink-0 items-center gap-5">
        <button type="button" onClick={handleAccept} className="dropzone-lp__btn px-6 py-2.5 text-sm">
          Accept
        </button>
        <Link href="/privacy-policy" className="text-sm font-medium text-accent hover:underline">
          Learn More
        </Link>
      </div>
    </div>
  );
}
