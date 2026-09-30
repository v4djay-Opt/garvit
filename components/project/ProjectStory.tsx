/**
 * components/project/ProjectStory.tsx
 *
 * Narrative section — the project's architecture and development story.
 * Renders only if project.story is present.
 *
 * Layout:
 *   - Asymmetric grid: text left (~6/12), image right (~6/12) on desktop
 *   - Mobile: text → image stacked
 *   - Background: ivory
 *   - Optional side image (story.image)
 *
 * Animations:
 *   - Heading → SplitHeading
 *   - Body    → Reveal per paragraph, staggered
 */

import { ContentImage } from "@/components/media/ContentImage";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Rule } from "@/components/ui/Rule";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { ParallaxMedia } from "@/components/media/ParallaxMedia";
import type { Project } from "@/lib/content/types";

interface ProjectStoryProps {
  story: NonNullable<Project["story"]>;
}

export function ProjectStory({ story }: ProjectStoryProps) {
  return (
    <Section variant="light" id="story" aria-label="Project story">
      <Container>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "clamp(3rem, 6vw, 5rem)",
            alignItems: "start",
          }}
          className="story-grid"
        >
          {/* Text column */}
          <div>
            {story.eyebrow && (
              <Reveal>
                <Eyebrow style={{ marginBottom: "1.25rem" }}>{story.eyebrow}</Eyebrow>
              </Reveal>
            )}

            <SplitHeading
              as="h2"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.875rem, 3.5vw, 3.25rem)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color: "var(--color-ink)",
                maxWidth: "22ch",
                marginBottom: "2rem",
              }}
            >
              {story.heading}
            </SplitHeading>

            {story.body.map((para, i) => (
              <Reveal key={i} delay={0.15 + i * 0.1}>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(1.0625rem, 1.3vw, 1.1875rem)",
                    fontWeight: 400,
                    lineHeight: 1.75,
                    color: "var(--color-ink-muted)",
                    maxWidth: "52ch",
                    marginBottom: i < story.body.length - 1 ? "1.25rem" : 0,
                  }}
                >
                  {para}
                </p>
              </Reveal>
            ))}
          </div>

          {/* Optional image column */}
          {story.image && (
            <div
              className="media-frame"
              style={{
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ paddingBottom: "120%", position: "relative" }}>
                <ParallaxMedia speed={5} style={{ position: "absolute", inset: 0 }}>
                  <ContentImage image={story.image} />
                </ParallaxMedia>
              </div>
            </div>
          )}
        </div>

        <Rule style={{ marginTop: "clamp(3rem, 6vw, 5rem)" }} />
      </Container>

      <style>{`
        @media (min-width: 900px) {
          .story-grid {
            grid-template-columns: 6fr 6fr !important;
          }
        }
      `}</style>
    </Section>
  );
}
