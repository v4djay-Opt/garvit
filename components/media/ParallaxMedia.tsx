"use client";

/**
 * components/media/ParallaxMedia.tsx
 *
 * Client wrapper that applies useParallax to any block container.
 * Typically wraps an absolutely-positioned image or video div.
 *
 * The PARENT must have `overflow: hidden` — the parallax element
 * is scaled up slightly and moved on scroll, so it needs to be clipped.
 *
 * Parallax is desktop-only (non-touch). On touch or reduced-motion:
 * children render normally, no transform applied.
 *
 * Usage (in a Server Component):
 *   <div style={{ position: 'relative', overflow: 'hidden', paddingBottom: '60%' }}>
 *     <ParallaxMedia speed={6} style={{ position: 'absolute', inset: 0 }}>
 *       <div style={{ backgroundImage: '...', inset: 0, position: 'absolute' }} />
 *     </ParallaxMedia>
 *   </div>
 */

import type { CSSProperties, ReactNode } from "react";
import { useParallax } from "@/lib/motion/use-parallax";

interface ParallaxMediaProps {
  children: ReactNode;
  speed?: number;
  direction?: "up" | "down";
  style?: CSSProperties;
  className?: string;
}

export function ParallaxMedia({
  children,
  speed = 8,
  direction = "up",
  style,
  className,
}: ParallaxMediaProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useParallax<HTMLDivElement>({ speed, direction }) as any;

  return (
    <div ref={ref} style={{ width: "100%", height: "100%", ...style }} className={className}>
      {children}
    </div>
  );
}
