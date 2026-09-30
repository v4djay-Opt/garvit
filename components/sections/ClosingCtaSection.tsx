/**
 * components/sections/ClosingCtaSection.tsx
 *
 * Single decisive closing action — the last persuasion moment before footer.
 *
 * Layout (plan §9):
 *   - Background: warm taupe, separated from the charcoal footer
 *   - Full-bleed statement (Fraunces 300, very large)
 *   - Two restrained CTAs below
 *
 * "Brand experience comes first." — PRD §4
 *
 * Animations:
 *   - Gold rule + statement → SplitHeading line-mask
 *   - CTA row              → Reveal delay=0.5
 */

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import type { Home } from "@/lib/content/types";

interface ClosingCtaSectionProps {
  closingCta: Home["closingCta"];
}

export function ClosingCtaSection({ closingCta }: ClosingCtaSectionProps) {
  return (
    <Section variant="dark" id="closing-cta" aria-label="Get in touch" style={{ position: "relative", overflow: "hidden", background: "var(--color-warm-taupe)" }}>
      <Container>
        {/* Decorative gold line */}
        <Reveal>
          <div
            aria-hidden
            style={{
              height: "1px",
              background: "var(--color-gold)",
              width: "3rem",
              marginBottom: "clamp(2.5rem, 5vw, 4rem)",
              opacity: 0.6,
            }}
          />
        </Reveal>

        {/* Large statement — SplitText line-mask on scroll */}
        <SplitHeading
          as="p"
          delay={0.05}
          stagger={0.12}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 6vw, 6rem)",
            fontWeight: 300,
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
            color: "var(--color-bone)",
            maxWidth: "16ch",
            marginBottom: "clamp(3rem, 6vw, 5rem)",
          }}
        >
          {closingCta.statement}
        </SplitHeading>

        {/* CTAs — fade-up after statement */}
        <Reveal delay={0.5}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <Button
              variant="primary"
              href={closingCta.primaryCta.href}
              style={{
                background: "var(--color-bone)",
                color: "var(--color-charcoal)",
                borderColor: "var(--color-bone)",
              }}
            >
              {closingCta.primaryCta.label}
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
