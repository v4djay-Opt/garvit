/**
 * components/ui/InfinityLines.tsx
 *
 * Ambient "moving lines" field for page heroes — hairline rules drifting
 * across the background on an infinite loop.
 *
 * Implementation notes:
 *   - Pure CSS (keyframes in globals.css) — no JS, no GSAP dependency
 *   - Two layers drift on different axes/speeds for depth (parallax feel)
 *   - Lines are generated with repeating-linear-gradient, translated by
 *     exactly one repeat period per loop so the cycle is seamless
 *   - Bone-tinted at ~4–6% opacity: reads as texture, not decoration
 *   - prefers-reduced-motion freezes the drift (lines still render)
 *   - Absolutely positioned inset:0 — drop inside any `position: relative`
 *     hero section
 */

interface InfinityLinesProps {
  /** Extra className for theme overrides */
  className?: string;
}

export function InfinityLines({ className = "" }: InfinityLinesProps) {
  return <div aria-hidden className={`infinity-lines ${className}`} />;
}
