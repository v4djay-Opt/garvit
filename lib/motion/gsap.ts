let pending: Promise<typeof import("gsap")["gsap"]> | undefined;
export function registerGsap() {
  pending ??= (async () => {
    const [{ gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("gsap/SplitText")]);
    gsap.registerPlugin(ScrollTrigger, SplitText);
    return gsap;
  })();
  return pending;
}
