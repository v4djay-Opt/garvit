/**
 * components/sections/FeaturedProjectsSection.tsx
 *
 * Portfolio editorial — featured projects, not property listings.
 *
 * Layout (plan §9):
 *   - Desktop: alternating full-bleed editorial figures (7/5 reversed 5/7)
 *   - Mobile: full-width stacked, image → caption
 *   - Image aspect ratio: 3:2 cinematic
 *   - Hairline rule between projects
 *   - Background: ivory
 *
 * "Project 'cards' are not cards. Full-bleed editorial figures." — plan §7
 *
 * Animations:
 *   - Image div    → ParallaxMedia ±6% (desktop only)
 *   - Caption block → Reveal delay=0.25
 */

import { ContentImage } from "@/components/media/ContentImage";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Rule } from "@/components/ui/Rule";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { ParallaxMedia } from "@/components/media/ParallaxMedia";
import type { Project } from "@/lib/content/types";

interface FeaturedProjectsSectionProps {
  projects: Project[];
}

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

function ProjectFigure({ project, reversed }: { project: Project; reversed: boolean }) {
  return (
    <article
      style={{ display: "grid", gridTemplateColumns: "1fr", gap: 0 }}
      className={`project-figure${reversed ? " project-figure--reversed" : ""}`}
    >
      {/* Image block — 3:2 aspect ratio with parallax */}
      <div
        className={`media-frame project-image-col${reversed ? " project-image-col--reversed" : ""}`}
        style={{ position: "relative", overflow: "hidden" }}
      >
        {/* Aspect-ratio wrapper */}
        <div style={{ paddingBottom: "66.66%", position: "relative" }}>
          {/* ParallaxMedia wraps the image; parent overflow:hidden clips it */}
          <ParallaxMedia
            speed={6}
            style={{ position: "absolute", inset: 0 }}
          >
            <ContentImage image={project.media.heroImage} />
          </ParallaxMedia>
        </div>

        {/* Status badge — top right */}
        {project.status && <div
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "var(--color-ivory)",
            padding: "0.375rem 0.75rem",
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.625rem",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-ink-muted)",
            }}
          >
            {STATUS_LABEL[project.status]}
          </span>
        </div>}
      </div>

      {/* Caption block — fade-up on scroll */}
      <Reveal delay={0.25}>
        <div
          className="project-caption-col"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "clamp(2rem, 4vw, 3.5rem)",
          }}
        >
          <Eyebrow style={{ marginBottom: "1.25rem" }}>
            {TYPE_LABEL[project.type]} · {project.location.city}
          </Eyebrow>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 3vw, 3rem)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "var(--color-ink)",
              marginBottom: "1rem",
            }}
          >
            {project.name}
          </h2>

          {project.positioningStatement && (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1.0625rem",
                fontWeight: 300,
                lineHeight: 1.65,
                color: "var(--color-ink-muted)",
                maxWidth: "36ch",
                marginBottom: "2rem",
              }}
            >
              {project.positioningStatement}
            </p>
          )}

          <Link
            href={`/projects/${project.slug}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-eyebrow)",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-ink)",
              textDecoration: "none",
            }}
            className="project-explore-link"
          >
            <span className="project-explore-link__text">Explore Project</span>
            <span className="project-explore-link__line" aria-hidden>
              <svg width="20" height="1" aria-hidden>
                <line x1="0" y1="0.5" x2="20" y2="0.5" stroke="currentColor" strokeWidth="1" />
              </svg>
            </span>
            <span className="project-explore-link__arrow" aria-hidden>
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none" aria-hidden>
                <path
                  d="M1 1L5 5L1 9"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </div>
      </Reveal>
    </article>
  );
}

export function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  if (projects.length === 0) return null;

  return (
    <Section variant="light" id="featured-projects" aria-label="Featured projects">
      <Container>
        <div style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}>
          <Reveal>
            <Eyebrow style={{ marginBottom: "1rem" }}>Selected Projects</Eyebrow>
          </Reveal>
          <SplitHeading
            as="h2"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "var(--color-ink)",
              maxWidth: "24ch",
            }}
          >
            Built for the way people want to live.
          </SplitHeading>
        </div>
      </Container>

      {/* Projects — editorial figures full-width */}
      <div>
        {projects.map((project, i) => (
          <div key={project.slug}>
            <div
              style={{
                maxWidth: "1440px",
                marginInline: "auto",
                paddingInline: "clamp(1.25rem, 4vw, 4rem)",
              }}
            >
              <ProjectFigure project={project} reversed={i % 2 !== 0} />
            </div>
            {i < projects.length - 1 && (
              <div
                style={{
                  maxWidth: "1440px",
                  marginInline: "auto",
                  paddingInline: "clamp(1.25rem, 4vw, 4rem)",
                }}
              >
                <Rule style={{ marginBlock: "clamp(3rem, 6vw, 5rem)" }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* View all link */}
      <Container>
        <div
          style={{ marginTop: "clamp(3rem, 6vw, 5rem)", display: "flex", justifyContent: "center" }}
        >
          <Reveal>
            <Link
              href="/projects"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-eyebrow)",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-ink-muted)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                borderBottom: "1px solid var(--color-sand)",
                paddingBottom: "0.25rem",
              }}
            >
              View all projects
            </Link>
          </Reveal>
        </div>
      </Container>

      <style>{`
        @media (min-width: 900px) {
          .project-figure { grid-template-columns: 7fr 5fr !important; }
          .project-figure--reversed { grid-template-columns: 5fr 7fr !important; }
          .project-figure--reversed .project-image-col { order: 2; }
          .project-figure--reversed .project-caption-col { order: 1; }
        }
      `}</style>
    </Section>
  );
}
