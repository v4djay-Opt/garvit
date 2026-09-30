/**
 * components/project/ProjectHero.tsx
 *
 * Project microsite hero — full viewport, same cinematic grammar as the
 * homepage hero, but driven by project-specific data.
 *
 * Layout:
 *   - Full viewport height
 *   - Hero image as CSS background (parallax on desktop via ParallaxMedia)
 *   - Content anchored bottom-left: type+location eyebrow → h1 name → tagline
 *   - No CTA inside hero — ProjectCtaBar handles CTAs persistently
 *
 * Animations:
 *   - h1 → SplitHeading mountOnLoad
 *   - Tagline → Reveal delay=0.8
 */

import { HeroMedia } from "@/components/media/HeroMedia";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxMedia } from "@/components/media/ParallaxMedia";
import type { Project } from "@/lib/content/types";

const TYPE_LABEL: Record<string, string> = {
  plot:        "Plot",
  "farm-house": "Farm House",
  commercial:  "Commercial",
  retail:      "Retail",
  "mixed-use": "Mixed Use",
};

const STATUS_LABEL: Record<string, string> = {
  ongoing:   "Ongoing",
  upcoming:  "Upcoming",
  delivered: "Delivered",
};

interface ProjectHeroProps {
  project: Project;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  return (
    <section
      aria-label={`${project.name} hero`}
      style={{
        position: "relative",
        minHeight: "var(--hero-min-h, 100vh)",
        overflow: "hidden",
        borderRadius: "0 0 var(--radius-media) var(--radius-media)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        background: "var(--color-charcoal)",
      }}
    >
      {/* Hero image — parallax on desktop */}
      <ParallaxMedia speed={6} style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <HeroMedia image={project.media.heroImage} video={project.media.heroVideo} />
      </ParallaxMedia>

      {project.media.heroImage.caption && <span className="image-caption image-caption--hero" style={{ zIndex: 3 }}>{project.media.heroImage.caption}</span>}

      {/* Bottom gradient */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(to top, rgba(20,17,15,0.92) 0%, rgba(20,17,15,0.3) 45%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Top gradient under header */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "200px",
          zIndex: 1,
          background:
            "linear-gradient(to bottom, rgba(20,17,15,0.5) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1440px",
          marginInline: "auto",
          paddingInline: "clamp(1.25rem, 4vw, 4rem)",
          paddingBottom: "clamp(5rem, 10vw, 8rem)", // extra bottom to clear the CtaBar
          width: "100%",
        }}
      >
        <Reveal delay={0.1}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <Eyebrow
              theme="dark"
              style={{ color: "var(--color-bone-muted)" }}
            >
              {TYPE_LABEL[project.type]} · {project.location.label}
            </Eyebrow>

            {/* Status pill */}
            {project.status && <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.5625rem",
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--color-charcoal)",
                background: "var(--color-gold)",
                padding: "0.25rem 0.625rem",
              }}
            >
              {STATUS_LABEL[project.status]}
            </span>}
          </div>
        </Reveal>

        <SplitHeading
          as="h1"
          mountOnLoad
          delay={0.1}
          stagger={0.1}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 7vw, 6.5rem)",
            fontWeight: 300,
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
            color: "var(--color-bone)",
            maxWidth: "16ch",
            marginBottom: "1.25rem",
          }}
        >
          {project.name}
        </SplitHeading>

        {project.positioningStatement && (
          <Reveal delay={0.8}>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1rem, 1.4vw, 1.25rem)",
                fontWeight: 300,
                lineHeight: 1.65,
                color: "var(--color-bone-muted)",
                maxWidth: "44ch",
              }}
            >
              {project.positioningStatement}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
