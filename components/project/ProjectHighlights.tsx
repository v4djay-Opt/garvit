/**
 * components/project/ProjectHighlights.tsx
 *
 * Key project figures — concise, editorial stat list.
 * Renders only if project.highlights is present and non-empty.
 *
 * Layout:
 *   - Dark section (charcoal)
 *   - Horizontal rule-separated list on desktop
 *   - Stacked on mobile
 *   - Each highlight: label (small eyebrow), value (large Fraunces), description (muted)
 *
 * Animations: staggered Reveal per item.
 */

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import type { Highlight } from "@/lib/content/types";

interface ProjectHighlightsProps {
  highlights: Highlight[];
}

export function ProjectHighlights({ highlights }: ProjectHighlightsProps) {
  if (highlights.length === 0) return null;

  return (
    <Section variant="dark" id="highlights" aria-label="Project highlights">
      <Container>
        <Reveal style={{ marginBottom: "clamp(2rem, 4vw, 3rem)" }}>
          <Eyebrow theme="dark">Project Overview</Eyebrow>
        </Reveal>

        {/* Highlights — horizontal rule separated */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            borderTop: "1px solid color-mix(in srgb, var(--color-bone-muted) 20%, transparent)",
          }}
          className="highlights-grid"
        >
          {highlights.map((h, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div
                style={{
                  borderBottom:
                    "1px solid color-mix(in srgb, var(--color-bone-muted) 20%, transparent)",
                  padding: "clamp(1.5rem, 3vw, 2.5rem) 0",
                  paddingRight: "clamp(1.5rem, 3vw, 3rem)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.625rem",
                    fontWeight: 500,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--color-bone-muted)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {h.label}
                </p>

                {h.value && (
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.5rem, 3vw, 2.75rem)",
                      fontWeight: 300,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1,
                      color: "var(--color-bone)",
                      marginBottom: h.description ? "0.625rem" : 0,
                    }}
                  >
                    {h.value}
                  </p>
                )}

                {h.description && (
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9375rem",
                      fontWeight: 400,
                      lineHeight: 1.6,
                      color: "var(--color-bone-muted)",
                    }}
                  >
                    {h.description}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Container>

      <style>{`
        @media (min-width: 640px) {
          .highlights-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 1024px) {
          .highlights-grid { grid-template-columns: repeat(${Math.min(highlights.length, 4)}, 1fr) !important; }
        }
      `}</style>
    </Section>
  );
}
