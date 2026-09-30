/**
 * components/layout/Footer.tsx
 *
 * A designed closing statement — not a link dump.
 * Structure (plan §7):
 *   - Large Fraunces brand mark / tagline
 *   - Hairline rule
 *   - Three-column grid: Nav links | Contact | Social
 *   - Hairline rule
 *   - Legal / copyright row
 *
 * Server component with a small client island for decorative interactive blobs.
 */

import Link from "next/link";
import { FooterBlobs } from "./FooterBlobs";
import type { Site } from "@/lib/content/types";

interface FooterProps {
  site: Site;
}

const year = new Date().getFullYear();

export function Footer({ site }: FooterProps) {
  const { brand, nav, contact, social } = site;
  const valid = (value?: string) => !!value && !/placeholder|yourdomain/i.test(value);
  const visibleNav = nav.filter((i) => i.visible);
  const hasContact = [contact.phone, contact.email, contact.address].some(valid);
  const hasSocial = [social?.instagram, social?.facebook, social?.youtube].some(valid);

  return (
    <footer
      className="site-footer"
      style={{
        background: "var(--color-charcoal)",
        color: "var(--color-bone)",
        paddingBlock: "clamp(5rem, 10vw, 8rem)",
      }}
    >
      <FooterBlobs />
      <div
        className="footer-content"
        style={{
          maxWidth: "1440px",
          marginInline: "auto",
          paddingInline: "clamp(1.25rem, 4vw, 4rem)",
        }}
      >
        {/* Brand statement */}
        <div style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 6vw, 6rem)",
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 0.92,
              color: "var(--color-bone)",
              maxWidth: "14ch",
            }}
          >
            {brand.tagline ?? brand.name}
          </p>
        </div>

        {/* Hairline */}
        <hr
          role="presentation"
          style={{
            border: "none",
            borderTop: "1px solid color-mix(in srgb, var(--color-bone-muted) 25%, transparent)",
            marginBottom: "clamp(2.5rem, 5vw, 4rem)",
          }}
        />

        {/* Three-column grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "clamp(2rem, 4vw, 3rem)",
            marginBottom: "clamp(2.5rem, 5vw, 4rem)",
          }}
        >
          {/* Navigation column */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-eyebrow)",
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--color-gold)",
                marginBottom: "1.25rem",
              }}
            >
              Navigate
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {visibleNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9375rem",
                      fontWeight: 400,
                      color: "var(--color-bone-muted)",
                      textDecoration: "none",
                      transition: "color 150ms ease",
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-eyebrow)",
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--color-gold)",
                marginBottom: "1.25rem",
              }}
            >
              Contact
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {!hasContact && <p className="footer-contact-intro">Speak with our team about your next address.</p>}
              <Link href="/contact#enquiry" className="footer-contact-link">Send an enquiry ↗</Link>
              {valid(contact.phone) && (
                <a
                  href={`tel:${contact.phone}`}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    color: "var(--color-bone-muted)",
                    textDecoration: "none",
                  }}
                >
                  {contact.phone}
                </a>
              )}
              {valid(contact.email) && (
                <a
                  href={`mailto:${contact.email}`}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    color: "var(--color-bone-muted)",
                    textDecoration: "none",
                    wordBreak: "break-all",
                  }}
                >
                  {contact.email}
                </a>
              )}
              {valid(contact.address) && (
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    color: "var(--color-bone-muted)",
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {contact.mapUrl ? <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textUnderlineOffset: ".2em" }}>{contact.address}</a> : contact.address}
                </p>
              )}
            </div>
          </div>

          <nav aria-label="Footer policies" className="footer-policies">
            <p className="footer-column-heading">Policies</p>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
          </nav>

          {/* Social column — omitted while no profiles exist */}
          {hasSocial && (
          <div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-eyebrow)",
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--color-gold)",
                marginBottom: "1.25rem",
              }}
            >
              Follow
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {social?.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    color: "var(--color-bone-muted)",
                    textDecoration: "none",
                  }}
                >
                  Instagram
                </a>
              )}
              {social?.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    color: "var(--color-bone-muted)",
                    textDecoration: "none",
                  }}
                >
                  Facebook
                </a>
              )}
              {social?.youtube && (
                <a
                  href={social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    color: "var(--color-bone-muted)",
                    textDecoration: "none",
                  }}
                >
                  YouTube
                </a>
              )}
            </div>
          </div>
          )}
        </div>

        {/* Bottom hairline + legal */}
        <hr
          role="presentation"
          style={{
            border: "none",
            borderTop: "1px solid color-mix(in srgb, var(--color-bone-muted) 25%, transparent)",
            marginBottom: "1.5rem",
          }}
        />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              color: "var(--color-bone-muted)",
              
              margin: 0,
            }}
          >
            © {year} {brand.name}. All rights reserved.
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              color: "var(--color-bone-muted)",
              margin: 0,
            }}
          >
            Design &amp; ❤️ by{" "}
            <a
              href="https://optimaxstudio.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--color-bone)", textUnderlineOffset: ".2em" }}
            >
              <strong>Optimax Studio</strong>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
