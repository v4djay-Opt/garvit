"use client";

/**
 * components/project/ProjectLocation.tsx
 *
 * Location section with Google Maps facade.
 *
 * Pattern (plan §11 / Technical PRD §15):
 *   1. Render a charcoal placeholder with location text + "Load Map" button
 *   2. On click: replace with Google Maps iframe using mapEmbedQuery
 *   3. Google Maps JS/network is NOT loaded until the user explicitly clicks
 *
 * This defers the Maps SDK until needed — zero iframe cost on first paint,
 * no cookie/tracking implications until the user requests the map.
 *
 * Renders only if project.locationDetail is present.
 * Landmarks only render if landmark.verified === true (PRD §15 / §18).
 */

import { track } from "@/lib/analytics/client";
import { useState } from "react";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import type { ProjectLocationDetail } from "@/lib/content/types";

interface ProjectLocationProps {
  locationDetail: ProjectLocationDetail;
  projectName: string;
}

export function ProjectLocation({ locationDetail, projectName }: ProjectLocationProps) {
  const [mapLoaded, setMapLoaded] = useState(false);

  function openMap() { setMapLoaded(true); track("map_open"); }
  const verifiedLandmarks = locationDetail.landmarks?.filter((l) => l.verified) ?? [];
  const connectivity = locationDetail.connectivity ?? [];

  return (
    <Section variant="light-alt" id="location" aria-label="Location">
      <Container>
        <Reveal style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
          <Eyebrow style={{ marginBottom: "1rem" }}>Location</Eyebrow>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.875rem, 3.5vw, 3.25rem)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "var(--color-ink)",
              maxWidth: "22ch",
            }}
          >
            {locationDetail.address ?? "Haridwar, Uttarakhand"}
          </h2>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "clamp(2.5rem, 5vw, 4rem)",
          }}
          className="location-grid"
        >
          {/* Map facade */}
          <div>
            {mapLoaded && locationDetail.mapEmbedQuery ? (
              <iframe
                title={`Map for ${projectName}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(locationDetail.mapEmbedQuery)}&output=embed`}
                style={{
                  width: "100%",
                  height: "420px",
                  border: "none",
                  display: "block",
                }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              /* Placeholder — loads map on click */
              <div
                style={{
                  background: "var(--color-charcoal)",
                  height: "420px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1.25rem",
                  cursor: locationDetail.mapEmbedQuery ? "pointer" : "default",
                  position: "relative",
                  overflow: "hidden",
                }}

              >
                {/* Subtle grid overlay */}
                <svg
                  aria-hidden
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06, pointerEvents: "none" }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#map-grid)" />
                </svg>

                <svg
                  width="32"
                  height="40"
                  viewBox="0 0 32 40"
                  fill="none"
                  aria-hidden
                  style={{ opacity: 0.5 }}
                >
                  <path
                    d="M16 0C7.163 0 0 7.163 0 16c0 10.938 14.25 23.25 15.063 23.906a1.25 1.25 0 001.874 0C17.75 39.25 32 26.937 32 16 32 7.163 24.837 0 16 0zm0 22.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z"
                    fill="var(--color-bone-muted)"
                  />
                </svg>

                {locationDetail.mapEmbedQuery ? (
                  <button
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-eyebrow)",
                      fontWeight: 500,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--color-bone)",
                      background: "none",
                      border: "1px solid color-mix(in srgb, var(--color-bone-muted) 40%, transparent)",
                      padding: "0.75rem 1.5rem",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      openMap();
                    }}
                  >
                    Load Map
                  </button>
                ) : (
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-eyebrow)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--color-bone-muted)",
                    }}
                  >
                    Map coming soon
                  </p>
                )}
              </div>
            )}
            {locationDetail.mapUrl && <a href={locationDetail.mapUrl} target="_blank" rel="noopener noreferrer" className="text-link" style={{ display: "inline-block", marginTop: "1.25rem" }}>Get directions ↗</a>}
          </div>

          {/* Landmarks + connectivity */}
          {(verifiedLandmarks.length > 0 || connectivity.length > 0) && (
            <div>
              {verifiedLandmarks.length > 0 && (
                <div style={{ marginBottom: connectivity.length > 0 ? "2.5rem" : 0 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-eyebrow)",
                      fontWeight: 500,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--color-ink-muted)",
                      marginBottom: "1.25rem",
                    }}
                  >
                    Nearby
                  </p>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    {verifiedLandmarks.map((lm, i) => (
                      <Reveal key={i} as="li" delay={i * 0.08}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            borderBottom: "1px solid var(--color-sand)",
                            paddingBlock: "1rem",
                            gap: "1rem",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "1rem",
                              fontWeight: 400,
                              color: "var(--color-ink)",
                            }}
                          >
                            {lm.name}
                          </span>
                          {lm.distance && (
                            <span
                              style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "0.875rem",
                                color: "var(--color-ink-muted)",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {lm.distance}
                              {lm.travelTime && ` · ${lm.travelTime}`}
                            </span>
                          )}
                        </div>
                      </Reveal>
                    ))}
                  </ul>
                </div>
              )}

              {connectivity.length > 0 && (
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-eyebrow)",
                      fontWeight: 500,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--color-ink-muted)",
                      marginBottom: "1.25rem",
                    }}
                  >
                    Connectivity
                  </p>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    {connectivity.map((item, i) => (
                      <Reveal key={i} as="li" delay={i * 0.06}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            borderBottom: "1px solid var(--color-sand)",
                            paddingBlock: "0.875rem",
                          }}
                        >
                          <div
                            style={{
                              width: "4px",
                              height: "4px",
                              background: "var(--color-gold)",
                              flexShrink: 0,
                            }}
                            aria-hidden
                          />
                          <span
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "1rem",
                              fontWeight: 400,
                              color: "var(--color-ink)",
                            }}
                          >
                            {item}
                          </span>
                        </div>
                      </Reveal>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </Container>

      <style>{`
        @media (min-width: 900px) {
          .location-grid { grid-template-columns: 3fr 2fr !important; }
        }
      `}</style>
    </Section>
  );
}
