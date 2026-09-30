"use client";

/**
 * app/error.tsx — App-level error boundary
 * Must be a Client Component. Design treatment in Phase 2.
 */

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to an error reporting service in future (Phase 6+)
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "4rem 2rem",
        background: "var(--color-ivory)",
        color: "var(--color-ink)",
      }}
    >
      <p
        style={{
          fontSize: "0.75rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--color-ink-muted)",
          marginBottom: "1.5rem",
        }}
      >
        Something went wrong
      </p>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2rem, 5vw, 4rem)",
          fontWeight: 300,
          letterSpacing: "-0.025em",
          lineHeight: 1.05,
          marginBottom: "1.5rem",
          maxWidth: "20ch",
        }}
      >
        An unexpected error occurred
      </h1>
      <p style={{ color: "var(--color-ink-muted)", marginBottom: "2.5rem" }}>
        Please try again. If the problem persists, contact us directly.
      </p>
      <button
        onClick={reset}
        style={{
          display: "inline-block",
          padding: "0.75rem 2rem",
          background: "var(--color-charcoal)",
          border: "1px solid var(--color-charcoal)",
          color: "var(--color-bone)",
          fontFamily: "var(--font-body)",
          fontSize: "0.75rem",
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}
