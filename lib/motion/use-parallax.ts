"use client";

/**
 * lib/motion/use-parallax.ts
 *
 * Subtle scroll parallax via GSAP ScrollTrigger scrub.
 * Only activates on desktop (non-touch) — disabled on mobile and reduced-motion.
 * Animates yPercent only (GPU-composited) to avoid layout thrashing.
 *
 * Usage:
 *   const ref = useParallax<HTMLDivElement>({ speed: 6 });
 *   <div ref={ref} style={{ overflow: 'hidden' }}>...</div>  // parent clips overflow
 */

import { useEffect, useRef, type RefObject } from "react";
import { useMotion } from "./motion-provider";
import { PARALLAX_RANGE } from "./tokens";

interface ParallaxOptions {
  /** Parallax strength as a percentage offset (default: PARALLAX_RANGE = 8) */
  speed?: number;
  /** y direction: "up" = image moves up as you scroll down (default) */
  direction?: "up" | "down";
}

export function useParallax<T extends HTMLElement>(
  options: ParallaxOptions = {}
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const { canAnimate, isTouch } = useMotion();

  const { speed = PARALLAX_RANGE, direction = "up" } = options;
  const yPercent = direction === "up" ? -speed : speed;

  useEffect(() => {
    const el = ref.current;
    // Parallax is desktop-only — skip on touch or if motion disabled
    if (!el || !canAnimate || isTouch || speed === 0) return;

    let st: InstanceType<typeof import("gsap/ScrollTrigger")["ScrollTrigger"]>;

    let cancelled = false;
    let context: ReturnType<typeof import("gsap")["gsap"]["context"]> | undefined;

    void (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      if (cancelled) return;
      context = gsap.context(() => {
      // Scale the image slightly so the parallax doesn't expose background
      gsap.set(el, { scale: 1 + speed / 100 });

      st = ScrollTrigger.create({
        trigger: el.parentElement ?? el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          gsap.set(el, { yPercent: yPercent * self.progress });
        },
      });
      }, el);
    })();

    return () => {
      cancelled = true;
      context?.revert();
      st?.kill();
    };
  }, [canAnimate, isTouch, speed, yPercent]);

  return ref;
}
