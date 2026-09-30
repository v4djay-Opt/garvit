/**
 * components/sections/PhilosophySection.tsx
 *
 * Developer philosophy — a compact editorial band, not a numbered list.
 *
 * Layout (plan §9):
 *   - Background: ivory-deep
 *   - Desktop: four equal columns separated by top hairlines
 *   - Mobile: single column, hairline-separated
 *
 * Animations:
 *   - Section heading → SplitHeading line-mask
 *   - Each pillar     → Reveal, delay = i * 0.1 (staggered)
 */

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import type { Home } from "@/lib/content/types";

interface PhilosophySectionProps {
  philosophy: Home["philosophy"];
}

export function PhilosophySection({ philosophy }: PhilosophySectionProps) {
  return (
    <Section variant="light-alt" id="philosophy" aria-label="Our philosophy" style={{ position: "relative", overflow: "hidden" }}>
      <Container>
        {/* Section header */}
        <div style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}>
          {philosophy.eyebrow && (
            <Reveal>
              <Eyebrow style={{ marginBottom: "1rem" }}>{philosophy.eyebrow}</Eyebrow>
            </Reveal>
          )}
          <SplitHeading
            as="h2"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "var(--color-ink)",
              maxWidth: "22ch",
            }}
          >
            {philosophy.heading}
          </SplitHeading>
        </div>

        {/* Pillars — compact column band */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr" }}
          className="philosophy-grid"
        >
          {philosophy.pillars.map((pillar, i) => (
            <Reveal key={pillar.number} delay={i * 0.1}>
              <div
                style={{
                  borderTop: "1px solid var(--color-sand)",
                  padding: "clamp(1.75rem, 3vw, 2.5rem) 0",
                  height: "100%",
                }}
                className="philosophy-pillar"
              >
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-eyebrow)",
                    fontWeight: 500,
                    letterSpacing: "0.18em",
                    color: "var(--color-gold-ink)",
                    marginBottom: "1.25rem",
                  }}
                >
                  {pillar.number}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.25rem, 1.8vw, 1.625rem)",
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.2,
                    color: "var(--color-ink)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {pillar.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    fontWeight: 400,
                    lineHeight: 1.65,
                    color: "var(--color-ink-muted)",
                  }}
                >
                  {pillar.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>

      <style>{`
        @media (min-width: 640px) {
          .philosophy-grid { grid-template-columns: 1fr 1fr !important; }
          .philosophy-grid > div:nth-child(even) > div {
            margin-left: clamp(1.5rem, 3vw, 2.5rem);
          }
        }
        @media (min-width: 1024px) {
          .philosophy-grid { grid-template-columns: repeat(4, 1fr) !important; }
          .philosophy-grid > div:not(:first-child) > div {
            margin-left: clamp(1.5rem, 3vw, 2.5rem);
          }
        }
      `}</style>
    </Section>
  );
}
