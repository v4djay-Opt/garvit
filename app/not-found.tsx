/**
 * app/not-found.tsx — 404 page
 * Designed (not default). Full design treatment in Phase 2.
 */

export const dynamic = "force-static";

import Link from "next/link";
import type { Metadata } from "next";
import { InfinityLines } from "@/components/ui/InfinityLines";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "4rem 2rem",
        background: "var(--color-charcoal)",
        color: "var(--color-bone)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <InfinityLines />
      <div style={{ position: "relative", zIndex: 1 }}>
      <p
        style={{
          fontSize: "0.75rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--color-gold)",
          marginBottom: "1.5rem",
        }}
      >
        404
      </p>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.5rem, 6vw, 5rem)",
          fontWeight: 300,
          letterSpacing: "-0.025em",
          lineHeight: 1.02,
          marginBottom: "1.5rem",
          maxWidth: "18ch",
        }}
      >
        Page not found
      </h1>
      <p style={{ color: "var(--color-bone-muted)", marginBottom: "2.5rem" }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-block",
          padding: "0.75rem 2rem",
          background: "transparent",
          border: "1px solid var(--color-bone)",
          color: "var(--color-bone)",
          fontFamily: "var(--font-body)",
          fontSize: "0.75rem",
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textDecoration: "none",
          cursor: "pointer",
        }}
      >
        Return Home
      </Link>
      </div>
    </div>
  );
}
