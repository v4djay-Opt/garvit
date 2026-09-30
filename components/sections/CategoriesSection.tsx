/**
 * components/sections/CategoriesSection.tsx
 *
 * Property categories — Plots and Farm House.
 *
 * Layout (plan §9):
 *   - Desktop: equal columns, hairline-separated, tall 4:5 imagery
 *   - Mobile: horizontal scroll-snap, one column at a time
 *   - Background: ivory-deep
 *
 * Animations:
 *   - Section heading → SplitHeading on scroll
 *   - Each column     → Reveal with staggered delay (i * 0.1)
 */

import { ContentImage } from "@/components/media/ContentImage";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import type { HomeCategory } from "@/lib/content/types";

interface CategoriesSectionProps {
  categories: HomeCategory[];
  /** Property types that have at least one visible project — others render unlinked */
  availableTypes: ReadonlySet<string>;
}

const TYPE_TO_FILTER: Record<string, string> = {
  plot:        "plot",
  "farm-house": "farm-house",
  commercial:  "commercial",
};

export function CategoriesSection({ categories, availableTypes }: CategoriesSectionProps) {
  if (categories.length === 0) return null;

  return (
    <Section variant="light-alt" id="categories" aria-label="Property categories" style={{ position: "relative", overflow: "hidden" }}>
      <Container>
        <div style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
          <Reveal>
            <Eyebrow style={{ marginBottom: "0.75rem" }}>What We Build</Eyebrow>
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
            Find your space in Haridwar.
          </SplitHeading>
        </div>

        {/* Scroll container (mobile) / equal-width grid (desktop) */}
        <div
          className="categories-scroll"
          style={{
            display: "flex",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            marginInline: "calc(clamp(1.25rem, 4vw, 4rem) * -1)",
            paddingInline: "clamp(1.25rem, 4vw, 4rem)",
            scrollbarWidth: "none",
          }}
        >
          {categories.map((cat, i) => {
            const linked = availableTypes.has(TYPE_TO_FILTER[cat.type] ?? cat.type);
            const cardStyle: React.CSSProperties = {
              display: "block",
              flexShrink: 0,
              width: "min(80vw, 400px)",
              scrollSnapAlign: "start",
              textDecoration: "none",
              borderLeft: i > 0 ? "1px solid var(--color-sand)" : "none",
              paddingLeft: i > 0 ? "clamp(1.5rem, 3vw, 2.5rem)" : "0",
              paddingRight: "clamp(1.5rem, 3vw, 2.5rem)",
            };
            const body = (
              <>
                {/* Image — 4:5 portrait */}
                <div
              className="media-frame"
                  style={{
                    paddingBottom: "125%",
                    position: "relative",
                    overflow: "hidden",
                    marginBottom: "1.5rem",
                  }}
                >
                  <ContentImage image={cat.image} sizes="(max-width: 767px) 80vw, (max-width: 1440px) 45vw, 660px" />
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.15,
                    color: "var(--color-ink)",
                    marginBottom: "0.625rem",
                  }}
                >
                  {cat.label}
                </h3>

                {cat.tagline && (
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9375rem",
                      fontWeight: 300,
                      lineHeight: 1.6,
                      color: "var(--color-ink-muted)",
                      maxWidth: "28ch",
                      marginBottom: linked ? "1.25rem" : 0,
                    }}
                  >
                    {cat.tagline}
                  </p>
                )}

                {linked && (
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-eyebrow)",
                      fontWeight: 500,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--color-ink-muted)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    Browse
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
                )}
              </>
            );
            return (
              <Reveal key={cat.type} delay={i * 0.1} className="category-item">
                {linked ? (
                  <Link
                    href={`/projects?type=${TYPE_TO_FILTER[cat.type] ?? cat.type}`}
                    style={cardStyle}
                    className="category-col"
                  >
                    {body}
                  </Link>
                ) : (
                  <div style={cardStyle} className="category-col">
                    {body}
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      </Container>

      <style>{`
        .categories-scroll::-webkit-scrollbar { display: none; }
        .category-item { flex: 0 0 auto; }

        @media (min-width: 768px) {
          .categories-scroll {
            overflow-x: visible !important;
            scroll-snap-type: none !important;
            margin-inline: 0 !important;
            padding-inline: 0 !important;
            gap: clamp(1.5rem, 3vw, 2.5rem);
          }
          .category-item { flex: 1 1 0; min-width: 0; }
          .category-col {
            width: auto !important;
            padding-inline: 0 !important;
            border-left: none !important;
          }
        }
      `}</style>
    </Section>
  );
}
