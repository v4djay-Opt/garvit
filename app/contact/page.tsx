/**
 * app/contact/page.tsx — Contact page
 *
 * Static page. The EnquiryForm is a client component that fetches POST /api/lead.
 * The page itself never runs server-side code at request time.
 *
 * Layout:
 *   - Page header: Fraunces display heading (like projects page)
 *   - Two-column on desktop: contact info left, form right
 *   - Mobile: stacked (info → form)
 *   - Background: ivory (light)
 */

export const dynamic = "force-static";

import { buildMetadata } from "@/lib/seo/metadata";
import { getSite, getVisibleProjects } from "@/lib/content/repository";
import { WebPageStructuredData } from "@/lib/seo/structured-data";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Rule } from "@/components/ui/Rule";
import { ProjectLocation } from "@/components/project/ProjectLocation";
import { Suspense } from "react";
import { ContactEnquiry } from "@/components/forms/ContactEnquiry";

export async function generateMetadata() { return buildMetadata({ title: "Contact Garvit Buildtech", description: "Get in touch with Garvit Buildtech in Haridwar — enquiries about Palm City, Vantara Farms and upcoming residential projects.", canonicalPath: '/contact' }); }

export default async function ContactPage() {
  const [site, projects] = await Promise.all([getSite(), getVisibleProjects()]);
  const { contact, brand } = site;

  // Suppress any field that still holds placeholder text — the row is omitted entirely
  const isPlaceholder = (v: string | undefined): boolean =>
    !v || v.toUpperCase().includes("PLACEHOLDER");

  return (
    <>
      <WebPageStructuredData name="Contact Garvit Buildtech" description="Get in touch with Garvit Buildtech in Haridwar — enquiries about Palm City, Vantara Farms and upcoming residential projects." path="/contact" site={site} />
      <PageHero eyebrow="Contact" title="Let's start a conversation." description="Tell us what you have in mind. Our team can help with project details, enquiries and site visits." />

      {/* Contact info + form */}
      <Section
        variant="light"
        style={{ paddingTop: "clamp(3rem, 6vw, 5rem)" }}
        aria-label="Contact details and enquiry form"
      >
        <Container>
          <Rule style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "clamp(3rem, 6vw, 5rem)",
              alignItems: "start",
            }}
            className="contact-grid"
          >
            {/* ── Left: contact info ──────────────────────────────────────── */}
            <div>
              <Reveal style={{ marginBottom: "2.5rem" }}>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.25rem, 2vw, 1.625rem)",
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                    color: "var(--color-ink)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {brand.name}
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    color: "var(--color-ink-muted)",
                    fontWeight: 300,
                  }}
                >
                  {brand.tagline}
                </p>
              </Reveal>

              {/* Contact details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Address */}
                {!isPlaceholder(contact.address) && (
                  <Reveal>
                    <ContactItem label="Address">
                      {contact.mapUrl ? <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textUnderlineOffset: ".2em" }}>{contact.address}</a> : contact.address}
                    </ContactItem>
                  </Reveal>
                )}

                {/* Phone */}
                {!isPlaceholder(contact.phone) && (
                  <Reveal delay={0.05}>
                    <ContactItem label="Phone">
                      <a
                        href={`tel:${contact.phone!.replace(/\s/g, "")}`}
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        {contact.phone}
                      </a>
                    </ContactItem>
                  </Reveal>
                )}

                {/* Email */}
                {!isPlaceholder(contact.email) && (
                  <Reveal delay={0.1}>
                    <ContactItem label="Email">
                      <a
                        href={`mailto:${contact.email}`}
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        {contact.email}
                      </a>
                    </ContactItem>
                  </Reveal>
                )}

                {/* Working hours */}
                {contact.workingHours && !isPlaceholder(contact.workingHours) && (
                  <Reveal delay={0.15}>
                    <ContactItem label="Hours">{contact.workingHours}</ContactItem>
                  </Reveal>
                )}
              </div>
            </div>

            {/* ── Right: enquiry form ──────────────────────────────────────── */}
            <Reveal delay={0.1}>
              <div style={{ containerType: "inline-size", containerName: "form-container" }}>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.6875rem",
                    fontWeight: 500,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--color-ink-muted)",
                    marginBottom: "2rem",
                  }}
                >
                  Send an Enquiry
                </p>
                <div id="enquiry" style={{ scrollMarginTop: "96px" }}>
                  <Suspense fallback={<p role="status">Loading enquiry form…</p>}>
                    <ContactEnquiry projects={projects.map(({ slug, name }) => ({ slug, name }))} />
                  </Suspense>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <style>{`
        @media (min-width: 900px) {
          .contact-grid { grid-template-columns: 5fr 7fr !important; }
        }
      `}</style>
      {contact.mapEmbedQuery && <ProjectLocation projectName={brand.name} locationDetail={{ address: contact.address, mapEmbedQuery: contact.mapEmbedQuery, mapUrl: contact.mapUrl }} />}
    </>
  );
}

/* ── Helper component ─────────────────────────────────────────────────────── */

function ContactItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.625rem",
          fontWeight: 500,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--color-gold-ink)",
          marginBottom: "0.375rem",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "1rem",
          fontWeight: 400,
          lineHeight: 1.6,
          color: "var(--color-ink)",
        }}
      >
        {children}
      </p>
    </div>
  );
}
