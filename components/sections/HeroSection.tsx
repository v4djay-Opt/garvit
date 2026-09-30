/**
 * components/sections/HeroSection.tsx
 *
 * Cinematic full-viewport hero — first impression.
 *
 * Layout (plan §9):
 *   - Full viewport height (100svh fallback 100vh via CSS variable)
 *   - Background: posterImage as CSS background-image (degrades if file missing)
 *   - Bottom-left anchored content: eyebrow → headline → subline → CTAs
 *   - Top-right: scroll cue
 *   - Gradient overlay (bottom) for text legibility
 *   - Header is fixed/transparent — no top padding needed here
 *
 * Animations:
 *   - Poster image/video stays fixed while the foreground scrolls
 *   - h1 headline    → SplitHeading mountOnLoad (fires immediately, not on scroll)
 *   - Subline + CTAs → Reveal, delay=0.9 (after headline completes)
 *
 * Video attaches after window load unless reduced motion or data saving is enabled.
 */

import { HeroMedia } from "@/components/media/HeroMedia";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Reveal } from "@/components/ui/Reveal";
import type { Home } from "@/lib/content/types";

interface HeroSectionProps {
  hero: Home["hero"];
}

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section
      aria-label="Hero"
      style={{
        position: "relative",
        minHeight: "var(--hero-min-h, 100vh)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        background: "var(--color-charcoal)",
      }}
    >
      {/* The clip confines viewport-fixed media to this section, without JS. */}
      <div className="hero-backdrop-clip">
        <div className="hero-fixed-backdrop">
          <HeroMedia image={hero.posterImage} video={hero.video} />
          <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(to bottom, rgba(20,17,15,0.5), transparent 30%), linear-gradient(to top, rgba(20,17,15,0.92) 0%, rgba(20,17,15,0.4) 40%, rgba(20,17,15,0.08) 70%, transparent 100%)",
          pointerEvents: "none",
        }}
          />
        </div>
      </div>



      {/* ── Hero content ─────────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1440px",
          marginInline: "auto",
          paddingInline: "clamp(1.25rem, 4vw, 4rem)",
          paddingBottom: "clamp(3.5rem, 6vw, 5rem)",
          width: "100%",
        }}
      >
        {hero.eyebrow && (
          <Reveal delay={0.3}>
            <Eyebrow
              theme="dark"
              style={{ marginBottom: "1.5rem", color: "var(--color-bone-muted)" }}
            >
              {hero.eyebrow}
            </Eyebrow>
          </Reveal>
        )}

        {/* SplitText line-mask — fires on mount, not on scroll */}
        <SplitHeading
          as="h1"
          mountOnLoad
          delay={0.1}
          stagger={0.12}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 8vw, 7.5rem)",
            fontWeight: 300,
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
            color: "var(--color-bone)",
            maxWidth: "14ch",
            marginBottom: hero.subline ? "1.5rem" : "2.5rem",
          }}
        >
          {hero.headline}
        </SplitHeading>

        {/* Subline + CTAs fade-up after headline lines finish */}
        <Reveal delay={0.9}>
          <div>
            {hero.subline && (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(1rem, 1.4vw, 1.25rem)",
                  fontWeight: 300,
                  lineHeight: 1.6,
                  color: "var(--color-bone-muted)",
                  maxWidth: "42ch",
                  marginBottom: "2.5rem",
                }}
              >
                {hero.subline}
              </p>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
              <Button
                variant="primary"
                href={hero.primaryCta.href}
                style={{
                  background: "var(--color-bone)",
                  color: "var(--color-charcoal)",
                  borderColor: "var(--color-bone)",
                }}
              >
                {hero.primaryCta.label}
              </Button>
              {hero.secondaryCta && (
                <Button
                  variant="secondary"
                  href={hero.secondaryCta.href}
                  style={{
                    color: "var(--color-bone)",
                    borderColor: "var(--color-bone-muted)",
                  }}
                >
                  {hero.secondaryCta.label}
                </Button>
              )}
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── Scroll cue ───────────────────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "clamp(2rem, 4vw, 3rem)",
          right: "clamp(1.25rem, 4vw, 4rem)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.625rem",
          zIndex: 2,
          animation: "fadeInUp 600ms 1.6s both ease-out",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.6875rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--color-bone-muted)",
            writingMode: "vertical-rl",
          }}
        >
          Scroll
        </span>
        <svg width="1" height="40" aria-hidden>
          <line x1="0.5" y1="0" x2="0.5" y2="40" stroke="var(--color-gold)" strokeWidth="1" />
        </svg>
      </div>

    </section>
  );
}
