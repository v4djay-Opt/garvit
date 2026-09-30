/**
 * app/kitchen-sink/page.tsx
 *
 * Phase 2 visual acceptance route.
 * Renders every design-system component at the four test widths:
 * 375 / 768 / 1024 / 1440px.
 *
 * Must be excluded from the production sitemap and noindexed.
 * Not linked from any navigation.
 *
 * Gate: all components render correctly, keyboard nav works,
 * focus states are visible, reduced-motion disables animations.
 */

export const dynamic = "force-static";

import { ProjectPreview } from "@/components/project/ProjectPreview";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Rule } from "@/components/ui/Rule";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Design System — Kitchen Sink",
  robots: { index: false, follow: false },
};

function KSLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{
      fontFamily: "var(--font-body)",
      fontSize: "0.75rem",
      color: "var(--color-ink-muted)",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      marginBottom: "0.75rem",
      ...style,
    }}>
      {children}
    </p>
  );
}

function KSBlock({ title, children, dark = false }: { title: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div style={{
      background: dark ? "var(--color-charcoal)" : "var(--color-ivory-deep)",
      padding: "2rem",
      marginBottom: "0.5rem",
    }}>
      <p style={{
        fontFamily: "var(--font-body)",
        fontSize: "0.6875rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: dark ? "var(--color-bone-muted)" : "var(--color-ink-muted)",
        marginBottom: "1.5rem",
        opacity: 0.6,
      }}>
        {title}
      </p>
      {children}
    </div>
  );
}

export default function KitchenSink() {
  if (process.env.SITE_RELEASE === "true") notFound();
  return (
    <>
      {/* ── Header strip ─────────────────────────────────────────────────── */}
      <div style={{
        paddingTop: "80px",
        background: "var(--color-ivory-deep)",
        paddingBlock: "80px clamp(3rem, 5vw, 5rem)",
        paddingInline: "clamp(1.25rem, 4vw, 4rem)",
      }}>
        <Eyebrow>Phase 2 — Design System</Eyebrow>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.5rem, 5vw, 5rem)",
          fontWeight: 300,
          letterSpacing: "-0.025em",
          lineHeight: 1.02,
          color: "var(--color-ink)",
          marginTop: "1rem",
        }}>
          Kitchen Sink
        </h1>
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(1.125rem, 1.6vw, 1.5rem)",
          fontWeight: 300,
          color: "var(--color-ink-muted)",
          marginTop: "1rem",
          maxWidth: "60ch",
        }}>
          Every design-system component rendered in isolation.
          Review at 375 / 768 / 1024 / 1440px.
        </p>
      </div>

      {/* ── Typography ───────────────────────────────────────────────────── */}
      <Section variant="light">
        <Container>
          <KSLabel>Typography</KSLabel>

          <KSBlock title="Display / Hero">
            <p className="text-display" style={{ color: "var(--color-ink)" }}>
              Where land meets legacy.
            </p>
          </KSBlock>

          <KSBlock title="H1">
            <h1 className="text-h1" style={{ color: "var(--color-ink)" }}>
              Premium properties in Haridwar.
            </h1>
          </KSBlock>

          <KSBlock title="H2">
            <h2 className="text-h2" style={{ color: "var(--color-ink)" }}>
              Our approach to development.
            </h2>
          </KSBlock>

          <KSBlock title="H3">
            <h3 className="text-h3" style={{ color: "var(--color-ink)" }}>
              Thoughtfully crafted spaces.
            </h3>
          </KSBlock>

          <KSBlock title="Lead text">
            <p className="text-lead prose-editorial" style={{ color: "var(--color-ink-muted)" }}>
              PLACEHOLDER — this is an example of lead text, used directly beneath
              headings to expand on the central idea. It is set in Inter Tight at
              a light weight with generous line height. Maximum measure is 68ch.
            </p>
          </KSBlock>

          <KSBlock title="Body text">
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-body)", lineHeight: 1.7, maxWidth: "68ch", color: "var(--color-ink-muted)" }}>
              PLACEHOLDER body paragraph. Set in Inter Tight Regular 400 at 17px with
              a 1.7 line height. Designed for comfortable reading at editorial measure.
              Gold accents at approximately 2% of surface area maintain the luxury
              tone without becoming decorative noise.
            </p>
          </KSBlock>

          <KSBlock title="Eyebrow — light">
            <Eyebrow theme="light">Haridwar, Uttarakhand</Eyebrow>
          </KSBlock>

          <KSBlock title="Eyebrow — dark" dark>
            <Eyebrow theme="dark">Haridwar, Uttarakhand</Eyebrow>
          </KSBlock>
        </Container>
      </Section>

      {/* ── Colour tokens ────────────────────────────────────────────────── */}
      <Section variant="light-alt">
        <Container>
          <KSLabel>Colour tokens</KSLabel>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: "0.5rem",
          }}>
            {[
              { name: "ivory",       bg: "#FBF9F5", text: "#14110F" },
              { name: "ivory-deep",  bg: "#F4F0E8", text: "#14110F" },
              { name: "sand",        bg: "#E3DCD0", text: "#14110F" },
              { name: "charcoal",    bg: "#14110F", text: "#EFEAE1" },
              { name: "charcoal-soft", bg: "#1F1B18", text: "#EFEAE1" },
              { name: "ink-muted",   bg: "#4A423C", text: "#FBF9F5" },
              { name: "bone",        bg: "#EFEAE1", text: "#14110F" },
              { name: "bone-muted",  bg: "#A79E93", text: "#14110F" },
              { name: "gold",        bg: "#C8A96A", text: "#14110F" },
              { name: "gold-ink",    bg: "#9A7C46", text: "#FBF9F5" },
              { name: "error",       bg: "#B91C1C", text: "#FBF9F5" },
              { name: "success",     bg: "#15803D", text: "#FBF9F5" },
            ].map(({ name, bg, text }) => (
              <div key={name} style={{
                background: bg,
                padding: "1rem 0.75rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}>
                <span style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.625rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: text,
                }}>
                  {name}
                </span>
                <span style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.6875rem",
                  color: text,
                  opacity: 0.6,
                }}>
                  {bg}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Rules ────────────────────────────────────────────────────────── */}
      <Section variant="light">
        <Container>
          <KSLabel>Rule — hairline divider</KSLabel>
          <KSBlock title="On light">
            <Rule theme="light" />
          </KSBlock>
          <KSBlock title="On dark" dark>
            <Rule theme="dark" />
          </KSBlock>
        </Container>
      </Section>

      {/* ── Buttons ──────────────────────────────────────────────────────── */}
      <Section variant="light-alt">
        <Container>
          <KSLabel>Button variants</KSLabel>

          <KSBlock title="Primary (as button)">
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Button variant="primary">Explore Projects</Button>
              <Button variant="primary" size="sm">Small</Button>
            </div>
          </KSBlock>

          <KSBlock title="Secondary (as link)">
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Button variant="secondary" href="/projects">View All Projects</Button>
              <Button variant="secondary" size="sm" href="/about">About</Button>
            </div>
          </KSBlock>

          <KSBlock title="Tertiary (text + underline)">
            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
              <Button variant="tertiary" href="/projects">Learn More</Button>
              <Button variant="tertiary" href="/contact">Get in Touch</Button>
            </div>
          </KSBlock>

          <KSBlock title="Primary on dark" dark>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Button variant="secondary" style={{ color: "var(--color-bone)", borderColor: "var(--color-bone-muted)" }} href="/projects">
                Explore Projects
              </Button>
            </div>
          </KSBlock>
        </Container>
      </Section>

      {/* ── Scroll reveals ───────────────────────────────────────────────── */}
      <Section variant="light">
        <Container>
          <KSLabel>Reveal — scroll-triggered fade-up</KSLabel>
          <KSBlock title="Three staggered items">
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <Reveal delay={0}>
                <div style={{ background: "var(--color-sand)", padding: "1.5rem" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 300, color: "var(--color-ink)" }}>
                    First element reveals on scroll.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div style={{ background: "var(--color-sand)", padding: "1.5rem" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 300, color: "var(--color-ink)" }}>
                    Second element reveals with a slight delay.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div style={{ background: "var(--color-sand)", padding: "1.5rem" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 300, color: "var(--color-ink)" }}>
                    Third element completes the stagger.
                  </p>
                </div>
              </Reveal>
            </div>
          </KSBlock>
        </Container>
      </Section>

      {/* ── Section variants ─────────────────────────────────────────────── */}
      <Section variant="dark">
        <Container>
          <KSLabel style={{ color: "var(--color-gold)" }}>Section — dark variant</KSLabel>
          <h2 className="text-h2" style={{ color: "var(--color-bone)", maxWidth: "20ch" }}>
            Dark sections frame key moments in the narrative.
          </h2>
          <p className="text-lead prose-editorial" style={{ color: "var(--color-bone-muted)", marginTop: "1.5rem" }}>
            PLACEHOLDER — The Haridwar story, philosophy pillars, and closing CTA
            sections all use the charcoal background. Gold is used sparingly
            as a decorative accent on dark only.
          </p>
          <div style={{ marginTop: "2.5rem" }}>
            <Rule theme="dark" />
          </div>
          <Eyebrow theme="dark" style={{ marginTop: "1.5rem" }}>
            Haridwar, Uttarakhand
          </Eyebrow>
        </Container>
      </Section>

      <Section variant="dark-alt">
        <Container>
          <KSLabel style={{ color: "var(--color-gold)" }}>Section — dark-alt variant</KSLabel>
          <p className="text-h3" style={{ color: "var(--color-bone)", maxWidth: "30ch" }}>
            Alternating dark tones create depth without introducing new colours.
          </p>
        </Container>
      </Section>

      <Section variant="light-alt">
        <Container>
          <KSLabel>Section — light-alt variant</KSLabel>
          <p className="text-h3" style={{ color: "var(--color-ink)", maxWidth: "30ch" }}>
            Light-alt is used for philosophy pillars and specification tables.
          </p>
        </Container>
      </Section>

      {/* ── Focus states ─────────────────────────────────────────────────── */}
      <Section variant="light">
        <Container>
          <KSLabel>Accessibility — focus states</KSLabel>
          <KSBlock title="Tab through these elements to verify visible gold focus rings">
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              <Button variant="primary">Focusable button</Button>
              <Button variant="secondary" href="/projects">Focusable link</Button>
              <a
                href="#"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  color: "var(--color-ink)",
                }}
              >
                Plain link
              </a>
              {/* Input focus state — see .ks-input in globals.css global focus rules */}
              <input
                type="text"
                placeholder="Focusable input"
                className="ks-input"
              />
            </div>
          </KSBlock>
        </Container>
      </Section>
    <ProjectPreview />
    </>
  );
}
