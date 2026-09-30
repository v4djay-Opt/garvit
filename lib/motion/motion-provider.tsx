"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { registerGsap } from "./gsap";
const defaults = { prefersReducedMotion: false, isTouch: false, isHighPerfDevice: true, gsapReady: false, canAnimate: false };
const MotionContext = createContext(defaults);
export function MotionProvider({ children }: { children: ReactNode }) {
  const [caps, setCaps] = useState(defaults);
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const touch = matchMedia("(pointer: coarse)");
    let active = true; let generation = 0;
    async function update() {
      const current = ++generation;
      const prefersReducedMotion = reduce.matches;
      const isTouch = touch.matches;
      const isHighPerfDevice = (navigator.hardwareConcurrency || 4) >= 4;
      let gsapReady = false;
      try { if (!prefersReducedMotion && !isTouch && isHighPerfDevice) { await registerGsap(); gsapReady = true; } } catch { /* Keep the static content usable. */ }
      if (active && current === generation) setCaps({ prefersReducedMotion, isTouch, isHighPerfDevice, gsapReady, canAnimate: gsapReady && !prefersReducedMotion });
    }
    const timer = setTimeout(() => { void update(); }, 0);
    reduce.addEventListener("change", update); touch.addEventListener("change", update);
    return () => { active = false; clearTimeout(timer); reduce.removeEventListener("change", update); touch.removeEventListener("change", update); };
  }, []);
  return <MotionContext.Provider value={caps}>{children}</MotionContext.Provider>;
}
export function useMotion() { return useContext(MotionContext); }
