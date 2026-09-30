"use client";

/**
 * components/ui/Reveal.tsx
 *
 * Scroll-triggered fade-up reveal wrapper.
 * Wraps the useReveal hook in a component API for use in server-component trees
 * via composition (server renders child, client handles animation only).
 *
 * Usage:
 *   <Reveal delay={0.1}>
 *     <p>Animates in on scroll</p>
 *   </Reveal>
 */

import type { CSSProperties, ReactNode } from "react";
import { useReveal } from "@/lib/motion/use-reveal";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  distance?: number;
  duration?: number;
  style?: CSSProperties;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "span";
}

export function Reveal({
  children,
  delay,
  distance,
  duration,
  style,
  className,
  as: Tag = "div",
}: RevealProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useReveal<HTMLElement>({ delay, distance, duration }) as any;

  return (
    <Tag ref={ref} style={style} className={className}>
      {children}
    </Tag>
  );
}
