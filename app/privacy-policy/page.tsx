/**
 * app/privacy-policy/page.tsx — Privacy Policy
 *
 * Static page. Legal copy must be verified (drafted or reviewed by a
 * qualified lawyer) before the site handles real visitor data — while
 * legal.privacy.approved is false the page renders a single holding line.
 *
 * India's Digital Personal Data Protection (DPDP) Act 2023 applies to
 * the personal data collected via enquiry forms on this site.
 */

export const dynamic = "force-static";

import { getLegal } from "@/lib/content/repository";
import { buildMetadata } from "@/lib/seo/metadata";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/sections/PageHero";

export async function generateMetadata() { return buildMetadata({ title: 'Privacy Policy', canonicalPath: '/privacy-policy' }); }

export default async function PrivacyPolicyPage() {
  const legal = (await getLegal()).privacy;
  const isPlaceholder = (v: string) => v.toUpperCase().includes("PLACEHOLDER");
  const showUpdated = !isPlaceholder(legal.lastUpdated);
  const sections = legal.approved
    ? legal.sections
        .map((sec) => ({ ...sec, body: sec.body.filter((para) => !isPlaceholder(para)) }))
        .filter((sec) => sec.body.length > 0)
    : [];

  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <Section variant="light" aria-label="Privacy Policy content">
        <Container>
          {showUpdated && <p style={{ color: "var(--color-ink-muted)", marginBottom: "2rem" }}>Last updated: {legal.lastUpdated}</p>}
        {!legal.approved ? (
          <p
            style={{
              maxWidth: "720px",
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              fontWeight: 400,
              lineHeight: 1.75,
              color: "var(--color-ink-muted)",
            }}
          >
            This policy will be published before launch.
          </p>
        ) : (
          <div style={{ maxWidth: "720px", display: "flex", flexDirection: "column", gap: "3rem" }}>
            {sections.map((sec) => (
              <div key={sec.heading}>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.125rem, 1.8vw, 1.5rem)",
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                    color: "var(--color-ink)",
                    marginBottom: "1rem",
                  }}
                >
                  {sec.heading}
                </h2>
                {sec.body.map((para, i) => (
                  <p
                    key={i}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "1rem",
                      fontWeight: 400,
                      lineHeight: 1.75,
                      color: "var(--color-ink)",
                      marginBottom: i < sec.body.length - 1 ? "0.875rem" : 0,
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}
      </Container>
    </Section>
    </>
  );
}
