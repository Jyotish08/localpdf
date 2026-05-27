"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("localpdf-cookie-consent");
    if (!consent) {
      setIsVisible(true);
    } else if (consent === "accepted") {
      loadAdsense();
    }
  }, []);

  const loadAdsense = () => {
    // Only load if not already loaded
    if (document.querySelector('script[src*="adsbygoogle.js"]')) return;

    const script = document.createElement("script");
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX";
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
    console.log("AdSense scripts injected.");
  };

  const handleAccept = () => {
    localStorage.setItem("localpdf-cookie-consent", "accepted");
    setIsVisible(false);
    loadAdsense();
  };

  const handleReject = () => {
    localStorage.setItem("localpdf-cookie-consent", "rejected");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card p-4 shadow-lg sm:p-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex-1 text-sm text-muted-foreground">
          <p>
            We use cookies to ensure you get the best experience on our website. This includes 
            essential cookies for site functionality and third-party cookies for Google AdSense. 
            By clicking &quot;Accept All&quot;, you consent to our use of all cookies.
          </p>
          <Link
            href="/privacy-policy"
            className="mt-2 inline-block font-semibold text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            Learn More
          </Link>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">
          <button
            onClick={handleReject}
            className="rounded-lg border border-border bg-transparent px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            Reject Non-Essential
          </button>
          <button
            onClick={handleAccept}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
