/**
 * components/sections/ManifestoSection.tsx
 *
 * Brand manifesto — philosophy, not inventory.
 *
 * Layout (plan §9):
 *   - Desktop: asymmetric 5/7 grid — statement left, body right
 *   - Mobile: stacked, generous vertical space
 *   - Background: ivory
 *
 * Animations:
 *   - Gold rule        → Reveal (fade-up)
 *   - Statement <p>    → GSAP line reveal scrubbed by scroll position
 *   - Body text        → Reveal delay=0.2
 */

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Rule } from "@/components/ui/Rule";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollStatement } from "@/components/ui/ScrollStatement";
import type { Home } from "@/lib/content/types";

interface ManifestoSectionProps {
  manifesto: Home["manifesto"];
}

export function ManifestoSection({ manifesto }: ManifestoSectionProps) {
  return (
    <Section variant="light" id="manifesto" aria-label="Brand manifesto" style={{ position: "relative", overflow: "hidden" }}>
      <Container>
        {manifesto.eyebrow && (
          <Reveal>
            <Eyebrow style={{ marginBottom: "2.5rem" }}>
              {manifesto.eyebrow}
            </Eyebrow>
          </Reveal>
        )}

        {/* Gold hairline — 2% gold surface area */}
        <Reveal delay={0.1}>
          <div style={{ width: "3rem", marginBottom: "2rem" }}>
            <div
              style={{ height: "1px", background: "var(--color-gold)", width: "100%" }}
              aria-hidden
            />
          </div>
        </Reveal>

        {/* Asymmetric editorial grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "clamp(2rem, 4vw, 4rem)",
          }}
          className="manifesto-grid"
        >
          {/* Statement — SplitText line-mask */}
          <ScrollStatement
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
            {manifesto.statement}
          </ScrollStatement>

          {/* Body text — fade-up, slightly delayed */}
          {manifesto.body && manifesto.body.length > 0 && (
            <Reveal delay={0.2}>
              <div style={{ alignSelf: "end", maxWidth: "52ch" }}>
                {manifesto.body.map((para, i) => (
                  <p
                    key={i}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "clamp(1.0625rem, 1.3vw, 1.25rem)",
                      fontWeight: 300,
                      lineHeight: 1.7,
                      color: "var(--color-ink-muted)",
                      marginBottom: i < manifesto.body!.length - 1 ? "1.25rem" : 0,
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </Reveal>
          )}
        </div>

        <Rule style={{ marginTop: "clamp(3rem, 6vw, 5rem)" }} />
      </Container>

      <style>{`
        @media (min-width: 900px) {
          .manifesto-grid {
            grid-template-columns: 5fr 7fr !important;
          }
        }
      `}</style>
    </Section>
  );
}
