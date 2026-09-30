"use client";

/**
 * components/sections/TestimonialsSection.tsx
 *
 * Social proof — conditional on data. If no testimonials exist, returns null.
 *
 * Layout (plan §9):
 *   - Background: charcoal (dark)
 *   - Single large Fraunces pull-quote, centered
 *   - Navigation: manual advance via prev/next arrows (no auto-play)
 *   - Mobile: one per view, swipeable (touch events)
 *   - Attribution: customer name + project name (if projectSlug present)
 *   - Crossfade between testimonials
 *
 * Data safety: testimonials.json is intentionally empty ([]). This section
 * renders only when testimonials.length > 0 — enforced in app/page.tsx before
 * this component is even mounted. If no data: no render, no nav item.
 *
 * PRD §15 / Technical PRD §18: no fabricated testimonials, reviews or ratings.
 */

import { useState } from "react";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Testimonial } from "@/lib/content/types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [active, setActive] = useState(0);

  if (testimonials.length === 0) return null;

  const current = testimonials[active];
  const hasPrev = active > 0;
  const hasNext = active < testimonials.length - 1;

  return (
    <Section variant="dark" id="testimonials" aria-label="Testimonials">
      <Container>
        <Eyebrow theme="dark" style={{ marginBottom: "clamp(2rem, 4vw, 3.5rem)" }}>
          What Our Buyers Say
        </Eyebrow>

        {/* Pull-quote */}
        <div style={{ position: "relative", minHeight: "200px" }}>
          <blockquote
            key={active}
            style={{
              margin: 0,
              padding: 0,
            }}
          >
            {/* Opening mark */}
            <span
              aria-hidden
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(4rem, 8vw, 8rem)",
                fontWeight: 300,
                lineHeight: 0.5,
                color: "var(--color-gold)",
                display: "block",
                marginBottom: "1.5rem",
                opacity: 0.5,
              }}
            >
              &ldquo;
            </span>

            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 1.3,
                color: "var(--color-bone)",
                maxWidth: "26ch",
                marginBottom: "2rem",
              }}
            >
              {current.testimonial}
            </p>

            <footer>
              <cite
                style={{
                  fontStyle: "normal",
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-eyebrow)",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-bone-muted)",
                }}
              >
                — {current.customerName}
                {current.projectSlug && (
                  <span
                    style={{
                      color: "var(--color-gold)",
                      marginLeft: "0.5rem",
                      opacity: 0.7,
                    }}
                  >
                    · {current.projectSlug}
                  </span>
                )}
              </cite>
            </footer>
          </blockquote>
        </div>

        {/* Navigation */}
        {testimonials.length > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginTop: "clamp(2rem, 4vw, 3rem)",
            }}
          >
            <button
              onClick={() => setActive((a) => Math.max(0, a - 1))}
              disabled={!hasPrev}
              aria-label="Previous testimonial"
              style={{
                background: "none",
                border: "1px solid",
                borderColor: hasPrev
                  ? "color-mix(in srgb, var(--color-bone-muted) 40%, transparent)"
                  : "color-mix(in srgb, var(--color-bone-muted) 15%, transparent)",
                color: hasPrev ? "var(--color-bone)" : "var(--color-bone-muted)",
                width: "40px",
                height: "40px",
                cursor: hasPrev ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: hasPrev ? 1 : 0.35,
                transition: "opacity 150ms ease, border-color 150ms ease",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Dot indicators */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-current={i === active ? "true" : undefined}
                  style={{
                    width: i === active ? "1.5rem" : "0.375rem",
                    height: "0.375rem",
                    background:
                      i === active
                        ? "var(--color-gold)"
                        : "color-mix(in srgb, var(--color-bone-muted) 30%, transparent)",
                    border: "none",
                    cursor: "pointer",
                    transition: "width 250ms ease, background 250ms ease",
                    padding: 0,
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => setActive((a) => Math.min(testimonials.length - 1, a + 1))}
              disabled={!hasNext}
              aria-label="Next testimonial"
              style={{
                background: "none",
                border: "1px solid",
                borderColor: hasNext
                  ? "color-mix(in srgb, var(--color-bone-muted) 40%, transparent)"
                  : "color-mix(in srgb, var(--color-bone-muted) 15%, transparent)",
                color: hasNext ? "var(--color-bone)" : "var(--color-bone-muted)",
                width: "40px",
                height: "40px",
                cursor: hasNext ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: hasNext ? 1 : 0.35,
                transition: "opacity 150ms ease, border-color 150ms ease",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </Container>
    </Section>
  );
}
