"use client";

import { useEffect, useState } from "react";

export function useMotionEnabled() {
  const [motionEnabled, setMotionEnabled] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;
    const enabled = !prefersReduced && !isMobile;
    setMotionEnabled(enabled);
    if (!enabled) {
      document.documentElement.classList.add("no-motion");
    }
  }, []);

  return motionEnabled;
}
