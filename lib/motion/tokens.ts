/**
 * lib/motion/tokens.ts
 *
 * Motion constants shared across all hooks and GSAP timelines.
 * Use these values — never hardcode durations or eases inside components.
 *
 * PRD §8 / Technical PRD v2.1 §8
 */

export const DURATION = {
  fast:    0.15,
  base:    0.20,
  slow:    0.60,
  slower:  0.90,
  slowest: 1.20,
} as const;

export const EASE = {
  // Snappy entrances — hero, nav transitions
  outExpo:     "expo.out",
  // Standard reveals — section elements, images
  outPower3:   "power3.out",
  // Bidirectional — page transitions, toggles
  inOutPower2: "power2.inOut",
  // Smooth inertia — parallax
  inOutPower1: "power1.inOut",
} as const;

export const STAGGER = {
  words:  0.06,
  lines:  0.08,
  items:  0.10,
  cards:  0.14,
} as const;

/** Parallax range: ±8% (desktop only, via ScrollTrigger scrub) */
export const PARALLAX_RANGE = 8;

/** How far below the fold a reveal starts (ScrollTrigger start position) */
export const REVEAL_START = "top 82%";

/** Distance elements travel upward during a fade-up reveal (px) */
export const REVEAL_DISTANCE = 24;
