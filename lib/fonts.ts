/**
 * lib/fonts.ts
 *
 * Self-hosted variable fonts loaded via next/font/local.
 * Latin/Latin-1 subsets live in /public/fonts/; original variable files are retained.
 * Add glyph ranges before publishing non-Latin project copy.
 *
 * Why local files instead of next/font/google:
 *   - Builds are hermetic — no build-time dependency on Google's CDN
 *   - Exact binary is pinned in Git; Google cannot silently reissue it
 *   - font-src 'self' in CSP needs no third-party exception (PRD §15.1)
 *   - Works on a firewalled VPS with no outbound HTTP during build
 *
 * Both fonts are SIL Open Font License 1.1.
 * Licence files are committed alongside binaries in public/fonts/.
 *
 * PRD §7 / Technical PRD v2.1 §7
 */

import localFont from "next/font/local";

/**
 * Fraunces — display / editorial serif
 * Used for: hero display, H1–H3, brand statements, project titles.
 *
 * Variable axes:
 *   wght 100–900  (we use 300 for display, 400 for sub-headings)
 *   opsz 9–144    (optical sizing — larger at display, crisper at small)
 */
export const fraunces = localFont({
  src: "../public/fonts/fraunces-latin.woff2",
  variable: "--font-fraunces",
  display: "swap",
  weight: "100 900",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});

/**
 * Inter Tight — geometric sans-serif
 * Used for: navigation, body copy, labels, forms, buttons, eyebrows, metadata.
 *
 * Variable axis:
 *   wght 100–900  (we use 300 for lead text, 400 for body, 500 for UI labels)
 */
export const interTight = localFont({
  src: "../public/fonts/inter-tight-latin.woff2",
  variable: "--font-inter-tight",
  display: "swap",
  weight: "100 900",
  preload: true,
  fallback: ["-apple-system", "BlinkMacSystemFont", "Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});
