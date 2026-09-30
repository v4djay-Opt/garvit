/**
 * app/loading.tsx — Route-level loading UI
 * Ivory skeleton matching final page geometry. No spinners.
 * Full layout-aware skeletons per section in Phase 2.
 */

export default function Loading() {
  return (
    <div
      aria-label="Loading"
      role="status"
      style={{
        minHeight: "100svh",
        background: "var(--color-ivory)",
        padding: "4rem 2rem",
      }}
    >
      {/* Mimic hero skeleton */}
      <div
        style={{
          width: "60%",
          height: "clamp(2.5rem, 5vw, 4rem)",
          background: "var(--color-sand)",
          borderRadius: "2px",
          marginBottom: "1.5rem",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <div
        style={{
          width: "35%",
          height: "1.25rem",
          background: "var(--color-sand)",
          borderRadius: "2px",
          opacity: 0.7,
        }}
      />
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes pulse { 0%, 100% { opacity: 1; } }
        }
      `}</style>
    </div>
  );
}
