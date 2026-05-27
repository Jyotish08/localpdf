"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";

const tools = [
  { href: "/compress", label: "Compress", color: "text-compress" },
  { href: "/merge", label: "Merge", color: "text-merge" },
  { href: "/split", label: "Split", color: "text-split" },
];

const navLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setToolsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-150 ${
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-xl shadow-sm"
          : "border-b border-transparent bg-background"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="LocalPDF Logo" width={40} height={40} priority />
          <span className="text-lg font-semibold tracking-tight text-foreground">
            LocalPDF
          </span>
        </Link>

        {/* Center: Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {/* Tools dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setToolsOpen(!toolsOpen)}
              className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                ["/compress", "/merge", "/split"].includes(pathname)
                  ? "text-accent"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Tools
              <svg className={`h-4 w-4 transition-transform ${toolsOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {toolsOpen && (
              <div className="absolute left-0 top-full mt-1 w-48 rounded-xl border border-border bg-background p-1.5 shadow-lg">
                {tools.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-card ${
                      pathname === t.href ? "text-accent bg-accent-light" : "text-foreground"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full bg-current ${t.color}`} />
                    {t.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                pathname === link.href ? "text-accent" : "text-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: badge + toggle + mobile hamburger */}
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success sm:flex">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            100% Private
          </span>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition hover:text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 pt-2 md:hidden">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Tools</p>
          {tools.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium ${
                pathname === t.href ? "text-accent bg-accent-light" : "text-foreground hover:bg-card"
              }`}
            >
              <span className={`h-2 w-2 rounded-full bg-current ${t.color}`} />
              {t.label}
            </Link>
          ))}
          <div className="my-2 border-t border-border" />
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                pathname === link.href ? "text-accent" : "text-foreground hover:bg-card"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-card">
            Contact
          </Link>
        </div>
      )}
    </header>
  );
}
