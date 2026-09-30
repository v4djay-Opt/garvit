"use client";

/**
 * lib/motion/use-reveal.ts
 *
 * Fade-up reveal on scroll. Attaches a ScrollTrigger to the target element.
 * Content renders in its final state if GSAP is not yet ready (no flash of invisible content).
 *
 * Usage:
 *   const ref = useReveal<HTMLDivElement>();
 *   <div ref={ref}>...</div>
 */

import { useEffect, useRef, type RefObject } from "react";
import { useMotion } from "./motion-provider";
import { DURATION, EASE, REVEAL_DISTANCE, REVEAL_START } from "./tokens";

interface RevealOptions {
  delay?: number;
  distance?: number;
  duration?: number;
  start?: string;
  once?: boolean;
}

export function useReveal<T extends HTMLElement>(
  options: RevealOptions = {}
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const { canAnimate } = useMotion();

  const {
    delay = 0,
    distance = REVEAL_DISTANCE,
    duration = DURATION.slower,
    start = REVEAL_START,
    once = true,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || !canAnimate) return;

    let gsap: typeof import("gsap")["gsap"];
    let ScrollTrigger: typeof import("gsap/ScrollTrigger")["ScrollTrigger"];
    let st: InstanceType<typeof import("gsap/ScrollTrigger")["ScrollTrigger"]>;

    let cancelled = false;
    let context: ReturnType<typeof import("gsap")["gsap"]["context"]> | undefined;

    void (async () => {
      const g = await import("gsap");
      const s = await import("gsap/ScrollTrigger");
      gsap = g.gsap;
      ScrollTrigger = s.ScrollTrigger;

      if (cancelled) return;
      context = gsap.context(() => {
      gsap.set(el, { opacity: 0, y: distance });

      const tween = gsap.to(el, {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: EASE.outPower3,
        paused: true,
      });

      st = ScrollTrigger.create({
        trigger: el,
        start,
        once,
        onEnter: () => tween.play(),
      });
      }, el);
    })();

    return () => {
      cancelled = true;
      context?.revert();
      st?.kill();
    };
  }, [canAnimate, delay, distance, duration, once, start]);

  return ref;
}
