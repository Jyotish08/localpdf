"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Logo from "./Logo";

const homeSections = [
  { href: "/#features", label: "Features", id: "features" },
  { href: "/#blog", label: "Blog", id: "blog" },
  { href: "/#pricing", label: "Pricing", id: "pricing" },
];

const pageLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("features");

  useEffect(() => {
    if (!isHome) return;

    const sections = ["features", "blog", "pricing"];
    const onScroll = () => {
      const scrollY = window.scrollY + 120;
      let current = "features";
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) current = id;
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const navLinks = isHome
    ? homeSections.map((s) => ({ href: s.href, label: s.label, active: activeSection === s.id }))
    : [
        { href: "/compress", label: "Compress", active: pathname === "/compress" },
        { href: "/merge", label: "Merge", active: pathname === "/merge" },
        { href: "/split", label: "Split", active: pathname === "/split" },
        { href: "/signature", label: "Signature", active: pathname === "/signature" },
        ...pageLinks.map((l) => ({ ...l, active: pathname === l.href })),
      ];

  return (
    <header className="sticky top-0 z-[1000] h-16 border-b border-border bg-[rgba(8,13,20,0.88)] backdrop-blur-xl light:bg-background/90">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-4 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[15px] font-medium transition-colors ${
                link.active ? "text-accent" : "text-body hover:text-accent"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-lg text-body transition hover:bg-card hover:text-accent md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div
          className="flex flex-col gap-2 border-b border-border bg-card/98 px-4 py-4 backdrop-blur-xl md:hidden"
          role="navigation"
          aria-label="Mobile"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`rounded-lg px-4 py-3 text-[15px] font-medium transition ${
                link.active ? "bg-accent-tint text-accent" : "text-body hover:bg-accent-tint hover:text-accent"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
