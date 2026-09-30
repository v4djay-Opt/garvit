"use client";

/**
 * lib/motion/use-scroll-header.ts
 *
 * Tracks scroll state for the Header component.
 * Returns { scrolled } — true once the user has scrolled past the threshold.
 *
 * Uses a passive scroll listener (no GSAP — simpler and lighter for a boolean state).
 * The threshold defaults to 80px so it triggers well before the hero headline is gone.
 */

import { useEffect, useState } from "react";

interface ScrollHeaderState {
  scrolled: boolean;
}

export function useScrollHeader(threshold = 80): ScrollHeaderState {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > threshold);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Run once in case the page loads mid-scroll
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return { scrolled };
}
