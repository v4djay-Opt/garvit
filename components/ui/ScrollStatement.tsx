"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { registerGsap } from "@/lib/motion/gsap";
import { DURATION, STAGGER } from "@/lib/motion/tokens";

/** Line-by-line reveal whose progress follows scrolling, including on touch. */
export function ScrollStatement({ children, style }: { children: string; style?: CSSProperties }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let generation = 0;
    let disposed = false;
    let cleanup = () => {};

    const setup = async () => {
      const current = ++generation;
      cleanup();
      cleanup = () => {};
      if (reducedMotion.matches) return;

      let split: InstanceType<typeof import("gsap/SplitText")["SplitText"]> | undefined;
      try {
        const gsap = await registerGsap();
        const { SplitText } = await import("gsap/SplitText");
        await document.fonts.ready;
        if (disposed || current !== generation) return;

        const context = gsap.context(() => {
          split = SplitText.create(element, {
            type: "lines",
            mask: "lines",
            linesClass: "manifesto-line",
            autoSplit: true,
            aria: "auto",
            onSplit(self) {
              gsap.set(self.lines, { yPercent: 105, opacity: 0 });
              return gsap.to(self.lines, {
                  yPercent: 0,
                  opacity: 1,
                  duration: DURATION.slowest,
                  stagger: STAGGER.lines,
                  ease: "none",
                  scrollTrigger: {
                    trigger: element,
                    start: "top 88%",
                    end: "bottom 48%",
                    scrub: DURATION.slow,
                    invalidateOnRefresh: true,
                  },
                });
            },
          });
        }, element);
        cleanup = () => { context.revert(); split?.revert(); };
      } catch (error) {
        if (process.env.NODE_ENV === "development") console.warn("Scroll statement animation could not initialize", error);
        // Preserve the original readable statement if animation cannot load.
        split?.revert();
      }
    };

    void setup();
    reducedMotion.addEventListener("change", setup);
    return () => {
      disposed = true;
      generation++;
      reducedMotion.removeEventListener("change", setup);
      cleanup();
    };
  }, [children]);

  return <p ref={ref} className="manifesto-statement" style={style}>{children}</p>;
}
