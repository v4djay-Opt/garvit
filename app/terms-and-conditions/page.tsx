/**
 * app/terms-and-conditions/page.tsx — Terms and Conditions
 *
 * Static page. Legal copy must be verified before the site is made public —
 * while legal.terms.approved is false the page renders a single holding line.
 *
 * This page exists so the footer link and sitemap don't 404.
 * It is not indexed until real legal text is in place (robots: noindex).
 */

export const dynamic = "force-static";

import { getLegal } from "@/lib/content/repository";
import { buildMetadata } from "@/lib/seo/metadata";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/sections/PageHero";

export async function generateMetadata() { return buildMetadata({ title: 'Terms & Conditions', canonicalPath: '/terms-and-conditions' }); }

export default async function TermsAndConditionsPage() {
  const legal = (await getLegal()).terms;
  const isPlaceholder = (v: string) => v.toUpperCase().includes("PLACEHOLDER");
  const showUpdated = !isPlaceholder(legal.lastUpdated);
  const sections = legal.approved
    ? legal.sections
        .map((sec) => ({ ...sec, body: sec.body.filter((para) => !isPlaceholder(para)) }))
        .filter((sec) => sec.body.length > 0)
    : [];

  return (
    <>
      <PageHero eyebrow="Legal" title="Terms and Conditions" />
      <Section variant="light" aria-label="Terms and Conditions content">
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
            These terms will be published before launch.
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
