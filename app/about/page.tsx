/**
 * app/about/page.tsx — About Garvit Buildtech
 *
 * Static page. Content from data/about.json → AboutSchema → getAbout().
 *
 * Layout:
 *   1. Display statement (hero) — large Fraunces heading, dark section
 *   2. Founding story — editorial text + optional image
 *   3. Approach pillars — same numbered pattern as homepage Philosophy
 *   4. Closing CTA — links to Projects and Contact
 *
 * All content is placeholder until replaced in about.json.
 * No business facts are fabricated.
 */

export const dynamic = "force-static";

import { PageHero } from "@/components/sections/PageHero";
import { ContentImage } from "@/components/media/ContentImage";
import { buildMetadata } from "@/lib/seo/metadata";
import { getAbout, getSite } from "@/lib/content/repository";
import { WebPageStructuredData } from "@/lib/seo/structured-data";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Rule } from "@/components/ui/Rule";
import { Button } from "@/components/ui/Button";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxMedia } from "@/components/media/ParallaxMedia";

export async function generateMetadata() {
  const about = await getAbout();
  return buildMetadata({ title: about.meta?.title || "About", description: about.meta?.description, canonicalPath: "/about" });
}

export default async function AboutPage() {
  const [about, site] = await Promise.all([getAbout(), getSite()]);

  return (
    <>
      <WebPageStructuredData
        name={about.meta?.title || "About Garvit Buildtech"}
        description={about.meta?.description}
        path="/about"
        site={site}
      />
      <PageHero eyebrow={about.hero.eyebrow || "About Us"} title={about.hero.statement}
        description="Residential plots and farm houses, shaped around the way you want to live."
        links={[{ label: "Our story", href: "#story" }, { label: "Mission & vision", href: "#purpose" }, { label: "Our directors", href: "#leadership" }]} />

      {/* ── 2. Founding story ───────────────────────────────────────────── */}
      {about.story && (
        <Section variant="light" id="story" aria-label="Our founding story">
          <Container>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "clamp(3rem, 6vw, 5rem)",
                alignItems: "start",
              }}
              className="about-story-grid"
            >
              {/* Text */}
              <div>
                {about.story.eyebrow && (
                  <Reveal>
                    <Eyebrow style={{ marginBottom: "1.25rem" }}>
                      {about.story.eyebrow}
                    </Eyebrow>
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
                  {about.story.heading}
                </SplitHeading>

                {about.story.body.map((para, i) => (
                  <Reveal key={i} delay={0.15 + i * 0.1}>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "clamp(1.0625rem, 1.3vw, 1.1875rem)",
                        fontWeight: 400,
                        lineHeight: 1.75,
                        color: "var(--color-ink-muted)",
                        maxWidth: "52ch",
                        marginBottom: i < about.story!.body.length - 1 ? "1.25rem" : 0,
                      }}
                    >
                      {para}
                    </p>
                  </Reveal>
                ))}
              </div>

              {/* Optional editorial image */}
              {about.story.image && (
                <div className="media-frame" style={{ position: "relative", overflow: "hidden" }}>
                  <div style={{ paddingBottom: "100%", position: "relative" }}>
                    <ParallaxMedia speed={5} style={{ position: "absolute", inset: 0 }}>
                      <ContentImage image={about.story.image} />
                    </ParallaxMedia>
                  </div>
                </div>
              )}
            </div>
          </Container>

          <style>{`
            @media (min-width: 900px) {
              .about-story-grid { grid-template-columns: 6fr 5fr !important; }
            }
          `}</style>
        </Section>
      )}

      {(about.mission || about.vision) && (
        <Section variant="light-alt" id="purpose" aria-label="Mission and vision">
          <Container>
            <Eyebrow>Our purpose</Eyebrow>
            <div className="about-purpose-grid">
              {([{ label: "Our Mission", content: about.mission }, { label: "Our Vision", content: about.vision }]).map(({ label, content }, index) => content && (
                <Reveal key={label} delay={index * 0.12}>
                  <article className="about-purpose-card">
                    <div className="about-purpose-label"><span>{label}</span><span aria-hidden>0{index + 1}</span></div>
                    <h2>{content.heading}</h2>
                    <p>{content.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {about.leadership && (
        <Section variant="light" id="leadership" aria-label="Our directors">
          <Container>
            <div className="about-leadership-heading">
              <div><Eyebrow>Leadership</Eyebrow><h2 className="text-h2">{about.leadership.heading}</h2></div>
              {about.leadership.introduction && <p>{about.leadership.introduction}</p>}
            </div>
            <div className="about-directors-grid">
              {about.leadership.directors.map((director, index) => (
                <Reveal key={director.id} delay={index * 0.12}>
                  <article className="about-director">
                    <div className="about-director-photo">
                      {director.photo ? <ContentImage image={director.photo} sizes="(max-width: 700px) 90vw, 45vw" style={{ objectPosition: "center top" }} /> : (
                        <div className="about-portrait-placeholder" role="img" aria-label={`Portrait pending for director ${index + 1}`}>
                          <svg viewBox="0 0 160 190" fill="none" aria-hidden="true"><circle cx="80" cy="58" r="28"/><path d="M25 165v-18a55 55 0 0 1 110 0v18"/><path d="M8 26V8h18M134 8h18v18M8 164v18h18M134 182h18v-18"/></svg>
                          <span>Director portrait to be added</span>
                        </div>
                      )}
                    </div>
                    <div className="about-director-caption"><span className="about-director-number" aria-hidden>0{index + 1}</span><div>
                      <h3>{director.name ?? "Name to be added"}</h3><p className="about-director-role">{director.role}</p>
                      {director.bio && <p>{director.bio}</p>}
                    </div></div>
                  </article>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ── 3. Approach pillars ─────────────────────────────────────────── */}
      {about.approach && (
        <Section variant="light-alt" id="approach" aria-label="Our approach">
          <Container>
            <div style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}>
              {about.approach.eyebrow && (
                <Reveal>
                  <Eyebrow style={{ marginBottom: "1rem" }}>
                    {about.approach.eyebrow}
                  </Eyebrow>
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
                {about.approach.heading}
              </SplitHeading>
            </div>

            <Rule style={{ marginBottom: 0 }} />

            <div
              style={{ display: "grid", gridTemplateColumns: "1fr" }}
              className="pillars-grid"
            >
              {about.approach.pillars.map((pillar, i) => (
                <Reveal key={pillar.number} delay={i * 0.1}>
                  <div
                    style={{
                      borderBottom: "1px solid var(--color-sand)",
                      padding: "clamp(2rem, 4vw, 3rem) 0",
                      display: "grid",
                      gridTemplateColumns: "3rem 1fr",
                      gap: "2rem",
                      alignItems: "start",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.125rem",
                        fontWeight: 300,
                        color: "var(--color-gold-ink)",
                        lineHeight: 1.3,
                        paddingTop: "0.2em",
                      }}
                    >
                      {pillar.number}
                    </span>
                    <div>
                      <h3
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "clamp(1.25rem, 2vw, 1.875rem)",
                          fontWeight: 400,
                          letterSpacing: "-0.01em",
                          lineHeight: 1.2,
                          color: "var(--color-ink)",
                          marginBottom: "0.875rem",
                        }}
                      >
                        {pillar.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "1.0625rem",
                          fontWeight: 400,
                          lineHeight: 1.7,
                          color: "var(--color-ink-muted)",
                          maxWidth: "50ch",
                        }}
                      >
                        {pillar.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>

        </Section>
      )}

      {/* ── 4. Closing CTA ──────────────────────────────────────────────── */}
      <Section variant="light" aria-label="Call to action" style={{ background: "var(--color-sand)" }}>
        <Container>
          <Reveal>
            <div
              aria-hidden
              style={{
                width: "3rem",
                height: "1px",
                background: "var(--color-gold-ink)",
                marginBottom: "clamp(2.5rem, 5vw, 4rem)",
                opacity: 0.6,
              }}
            />
          </Reveal>

          <SplitHeading
            as="p"
            stagger={0.1}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 4.5rem)",
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 0.95,
              color: "var(--color-ink)",
              maxWidth: "18ch",
              marginBottom: "clamp(3rem, 6vw, 5rem)",
            }}
          >
            Find a place for your next chapter.
          </SplitHeading>

          <Reveal delay={0.4}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              <Button
                variant="primary"
                href="/projects"
                style={{
                  background: "var(--color-charcoal)",
                  color: "var(--color-bone)",
                  borderColor: "var(--color-charcoal)",
                }}
              >
                View Projects
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
