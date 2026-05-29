"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import { useMotionEnabled } from "../hooks/use-motion-enabled";

function animateValue(
  el: HTMLElement,
  start: number,
  end: number,
  duration: number,
  formatter: (v: number) => string,
) {
  let startTime: number | null = null;
  function step(timestamp: number) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = start + (end - start) * eased;
    el.textContent = formatter(value);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

export default function SocialBar() {
  const ratingRef = useRef<HTMLSpanElement>(null);
  const pdfRef = useRef<HTMLSpanElement>(null);
  const motionEnabled = useMotionEnabled();
  const [counted, setCounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || counted) return;
          setCounted(true);
          if (ratingRef.current && pdfRef.current) {
            if (motionEnabled) {
              animateValue(ratingRef.current, 0, 4.8, 1200, (v) => (Math.round(v * 10) / 10).toFixed(1));
              animateValue(pdfRef.current, 0, 147000, 1500, (v) =>
                Math.floor(v).toLocaleString("en-US"),
              );
            } else {
              ratingRef.current.textContent = "4.8";
              pdfRef.current.textContent = "147,000";
            }
          }
          observer.disconnect();
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [counted, motionEnabled]);

  return (
    <Reveal delay={100}>
      <div ref={containerRef} className="bar-card social-bar mx-auto mt-4 flex flex-col sm:flex-row">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 border-border px-4 py-2 sm:border-r">
          <div className="text-center">
            <div className="text-2xl tracking-widest text-accent" aria-hidden="true">
              ★★★★★
            </div>
            <div className="text-[28px] font-bold leading-tight text-foreground">
              <span ref={ratingRef}>0</span>/5
            </div>
            <div className="mt-1 text-[13px] text-muted">from 2,500+ users</div>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center gap-4 px-4 py-2">
          <svg className="h-7 w-7 shrink-0 text-accent" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path
              d="M6 4h12l6 6v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path d="M18 4v6h6" stroke="currentColor" strokeWidth="2" />
          </svg>
          <div>
            <div className="text-[28px] font-bold leading-tight text-foreground">
              <span ref={pdfRef}>0</span>+
            </div>
            <div className="mt-1 text-[13px] text-muted">PDFs processed</div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
