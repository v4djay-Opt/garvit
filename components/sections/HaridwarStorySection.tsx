/**
 * components/sections/HaridwarStorySection.tsx
 *
 * Place and meaning — the Haridwar story.
 *
 * Layout (plan §9):
 *   - Background: charcoal (dark)
 *   - Desktop: large image left (~55%), editorial column right (~45%)
 *   - Mobile: stacked, image first then text
 *
 * Animations:
 *   - Image div   → ParallaxMedia ±6% yPercent (desktop only)
 *   - Heading h2  → SplitHeading line-mask clip-path
 *   - Body paras  → Reveal per-paragraph, delay=0.15 * i
 */

import { ContentImage } from "@/components/media/ContentImage";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { ParallaxMedia } from "@/components/media/ParallaxMedia";
import type { Home } from "@/lib/content/types";

interface HaridwarStorySectionProps {
  story: Home["haridwarStory"];
}

export function HaridwarStorySection({ story }: HaridwarStorySectionProps) {
  return (
    <Section
      variant="dark"
      id="haridwar-story"
      aria-label="About Haridwar"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          minHeight: "clamp(420px, 60vh, 700px)",
        }}
        className="haridwar-grid"
      >
        {/* Image column — ParallaxMedia inside overflow:hidden */}
        <div
          className="media-frame haridwar-image-col"
          style={{ position: "relative", overflow: "hidden", minHeight: "380px" }}
        >
          <ParallaxMedia speed={6} style={{ position: "absolute", inset: 0 }}>
            <ContentImage image={story.image} />
          </ParallaxMedia>
        </div>

        {/* Text column */}
        <div
          className="haridwar-text-col"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "clamp(3rem, 6vw, 5rem) clamp(1.25rem, 4vw, 4rem)",
          }}
        >
          {story.eyebrow && (
            <Reveal>
              <Eyebrow theme="dark" style={{ marginBottom: "1.5rem" }}>
                {story.eyebrow}
              </Eyebrow>
            </Reveal>
          )}

          <SplitHeading
            as="h2"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3.75rem)",
              fontWeight: 300,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              color: "var(--color-bone)",
              maxWidth: "18ch",
              marginBottom: "1.75rem",
            }}
          >
            {story.heading}
          </SplitHeading>

          {story.body.map((para, i) => (
            <Reveal key={i} delay={0.2 + i * 0.12}>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(1rem, 1.3vw, 1.1875rem)",
                  fontWeight: 300,
                  lineHeight: 1.75,
                  color: "var(--color-bone-muted)",
                  maxWidth: "44ch",
                  marginBottom: i < story.body.length - 1 ? "1.25rem" : 0,
                }}
              >
                {para}
              </p>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .haridwar-grid {
            grid-template-columns: 55fr 45fr !important;
            min-height: clamp(500px, 65vh, 780px) !important;
          }
          .haridwar-image-col { min-height: unset !important; }
          .haridwar-text-col { padding-left: clamp(3rem, 5vw, 5rem) !important; }
        }
        @media (max-width: 899px) {
          .haridwar-image-fade { display: none !important; }
        }
      `}</style>
    </Section>
  );
}
