"use client";

/**
 * components/ui/SplitHeading.tsx
 *
 * Client wrapper that applies useSplitReveal to any heading or paragraph.
 * Keeps section components as Server Components — only the heading element
 * itself crosses to the client boundary.
 *
 * Usage (in a Server Component):
 *   <SplitHeading as="h1" mountOnLoad style={{ fontSize: '...' }}>
 *     Where land meets legacy.
 *   </SplitHeading>
 *
 *   <SplitHeading as="h2">Section heading</SplitHeading>
 *
 * Accessibility:
 *   - GSAP SplitText preserves original element text for screen readers
 *   - Degrades to plain visible text when canAnimate = false (reduced-motion)
 */

import type { CSSProperties, ElementType, ReactNode } from "react";
import { useSplitReveal } from "@/lib/motion/use-split-reveal";

interface SplitHeadingProps {
  children: ReactNode;
  as?: ElementType;
  /** Fire immediately on mount (for hero — already in viewport) */
  mountOnLoad?: boolean;
  delay?: number;
  stagger?: number;
  type?: "lines" | "words" | "chars";
  style?: CSSProperties;
  className?: string;
  id?: string;
}

export function SplitHeading({
  children,
  as: Tag = "h2",
  mountOnLoad = false,
  delay = 0,
  stagger,
  type = "lines",
  style,
  className,
  id,
}: SplitHeadingProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useSplitReveal<HTMLElement>({ mountOnLoad, delay, stagger, type }) as any;

  return (
    <Tag ref={ref} style={style} className={className} id={id}>
      {children}
    </Tag>
  );
}
