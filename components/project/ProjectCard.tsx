/**
 * components/project/ProjectCard.tsx
 *
 * Editorial project figure for the listing page.
 * This is NOT a card — no borders, no drop shadows, no price chip.
 * It is an editorial figure: image → eyebrow → title → tagline → link.
 *
 * Used in ProjectListingClient as a grid item.
 */

import { ContentImage } from "@/components/media/ContentImage";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
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

interface ProjectCardProps {
  project: Project;
  delay?: number;
}

export function ProjectCard({ project, delay = 0 }: ProjectCardProps) {
  return (
    <Reveal delay={delay}>
      <article>
        <Link
          href={`/projects/${project.slug}`}
          style={{ display: "block", textDecoration: "none" }}
          className="project-card-link"
        >
          {/* Image — 3:2 cinematic with hover scale */}
          <div
              className="media-frame"
            style={{
              paddingBottom: "66.66%",
              position: "relative",
              overflow: "hidden",
              marginBottom: "1.25rem",
            }}
          >
            <ContentImage image={project.media.heroImage} />

            {/* Status badge */}
            {project.status && <div
              style={{
                position: "absolute",
                top: "1rem",
                left: "1rem",
                background: "var(--color-ivory)",
                padding: "0.25rem 0.625rem",
                zIndex: 1,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.5625rem",
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

          {/* Caption */}
          <Eyebrow style={{ marginBottom: "0.5rem" }}>
            {TYPE_LABEL[project.type]} · {project.location.city}
          </Eyebrow>

          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.25rem, 2vw, 1.875rem)",
              fontWeight: 400,
              letterSpacing: "-0.015em",
              lineHeight: 1.15,
              color: "var(--color-ink)",
              marginBottom: "0.625rem",
            }}
          >
            {project.name}
          </h3>

          {project.shortDescription && (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9375rem",
                fontWeight: 400,
                lineHeight: 1.65,
                color: "var(--color-ink-muted)",
                maxWidth: "34ch",
                marginBottom: "1rem",
              }}
            >
              {project.shortDescription}
            </p>
          )}

          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-eyebrow)",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-ink)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              borderBottom: "1px solid transparent",
              transition: "border-color 200ms ease",
            }}
            className="project-card-cta"
          >
            Explore Project
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M3 7H11M8 4L11 7L8 10"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Link>
      </article>
    </Reveal>
  );
}
