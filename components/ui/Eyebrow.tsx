/**
 * components/ui/Eyebrow.tsx
 *
 * Small uppercase tracking label — used above headings to establish context.
 * Rendered as <p> by default; pass `as` for semantic overrides.
 */

import type { CSSProperties, ElementType, ReactNode } from "react";

const EYEBROW_STYLE: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "var(--text-eyebrow)",
  fontWeight: 500,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  lineHeight: 1,
};

interface EyebrowProps {
  children: ReactNode;
  as?: ElementType;
  /** "light" = ink-muted on ivory (default); "dark" = gold on charcoal */
  theme?: "light" | "dark";
  style?: CSSProperties;
}

export function Eyebrow({
  children,
  as: Tag = "p",
  theme = "light",
  style,
}: EyebrowProps) {
  const colour =
    theme === "dark"
      ? "var(--color-gold)"
      : "var(--color-ink-muted)";

  return (
    <Tag style={{ ...EYEBROW_STYLE, color: colour, ...style }}>
      {children}
    </Tag>
  );
}
