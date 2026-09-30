"use client";

/**
 * lib/motion/use-split-reveal.ts
 *
 * Line-mask text reveal using GSAP SplitText.
 * Each line is revealed by animating clip-path from 100%→0% bottom inset.
 * Screen readers see the original element text; only the visual split
 * is affected (SplitText v3 handles aria automatically).
 *
 * Degrades gracefully: if GSAP is not ready or reduced-motion is set,
 * the element renders in its final visible state — no FOUC, no hidden text.
 *
 * Options:
 *   mountOnLoad — fire immediately when GSAP registers, not on ScrollTrigger.
 *                 Use for hero headlines that are already in the viewport.
 *
 * Usage:
 *   const ref = useSplitReveal<HTMLHeadingElement>({ stagger: 0.08 });
 *   <h1 ref={ref}>Your headline</h1>
 */

import { useEffect, useRef, type RefObject } from "react";
import { useMotion } from "./motion-provider";
import { DURATION, EASE, REVEAL_START, STAGGER } from "./tokens";

interface SplitRevealOptions {
  stagger?: number;
  duration?: number;
  delay?: number;
  start?: string;
  type?: "lines" | "words" | "chars";
  /**
   * Fire on mount (when GSAP becomes ready) rather than on ScrollTrigger.
   * Use for elements that are already visible in the initial viewport — hero h1.
   */
  mountOnLoad?: boolean;
}

export function useSplitReveal<T extends HTMLElement>(
  options: SplitRevealOptions = {}
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const { canAnimate, isTouch } = useMotion();

  const {
    stagger = isTouch ? 0 : STAGGER.lines,
    duration = DURATION.slowest,
    delay = 0,
    start = REVEAL_START,
    type = "lines",
    mountOnLoad = false,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || !canAnimate) return;

    let st: InstanceType<typeof import("gsap/ScrollTrigger")["ScrollTrigger"]> | undefined;
    let split: InstanceType<typeof import("gsap/SplitText")["SplitText"]> | null = null;

    let cancelled = false;
    let context: ReturnType<typeof import("gsap")["gsap"]["context"]> | undefined;

    void (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const { SplitText } = await import("gsap/SplitText");

      if (cancelled) return;
      context = gsap.context(() => {
      if (mountOnLoad) {
        gsap.from(el, { y: 16, duration: DURATION.slow, ease: EASE.outPower3 });
        return;
      }
      if (isTouch) {
        // Touch: simple opacity reveal — skip SplitText for performance
        gsap.set(el, { opacity: 0 });

        if (mountOnLoad) {
          void gsap.to(el, { opacity: 1, duration: DURATION.slow, delay, ease: EASE.outPower3 });
        } else {
          st = ScrollTrigger.create({
            trigger: el,
            start,
            once: true,
            onEnter: () =>
              gsap.to(el, { opacity: 1, duration: DURATION.slow, delay, ease: EASE.outPower3 }),
          });
        }
        return;
      }

      // Desktop: full SplitText line-mask reveal
      split = new SplitText(el, { type, linesClass: "split-line" });
      const targets =
        type === "lines" ? split.lines : type === "words" ? split.words : split.chars;

      gsap.set(targets, { clipPath: "inset(0 0 100% 0)" });

      const animate = () =>
        gsap.to(targets, {
          clipPath: "inset(0 0 0% 0)",
          duration,
          delay,
          stagger,
          ease: EASE.outPower3,
        });

      if (mountOnLoad) {
        // Fire immediately — element is already in the viewport
        void animate();
      } else {
        st = ScrollTrigger.create({
          trigger: el,
          start,
          once: true,
          onEnter: animate,
        });
      }
      }, el);
    })();

    return () => {
      cancelled = true;
      context?.revert();
      st?.kill();
      split?.revert();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAnimate, isTouch]);

  return ref;
}
