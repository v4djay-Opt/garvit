/**
 * components/layout/Section.tsx
 *
 * Section wrapper with the approved vertical rhythm.
 *
 * Section padding (the biggest differentiator vs templates):
 *   mobile:  py = 7rem  (112px)
 *   desktop: py = 11rem (176px)
 *
 * Background hierarchy (plan §7):
 *   light (default)  → var(--color-ivory)
 *   light-alt        → var(--color-ivory-deep)
 *   dark             → var(--color-charcoal)
 *   dark-alt         → var(--color-charcoal-soft)
 *
 * Pass `noPadding` for sections that control their own vertical space
 * (e.g. full-viewport hero).
 */

import type { CSSProperties, ElementType, ReactNode } from "react";

type SectionVariant = "light" | "light-alt" | "dark" | "dark-alt";

const BG: Record<SectionVariant, string> = {
  "light":     "var(--color-ivory)",
  "light-alt": "var(--color-ivory-deep)",
  "dark":      "var(--color-charcoal)",
  "dark-alt":  "var(--color-charcoal-soft)",
};

const TEXT: Record<SectionVariant, string> = {
  "light":     "var(--color-ink)",
  "light-alt": "var(--color-ink)",
  "dark":      "var(--color-bone)",
  "dark-alt":  "var(--color-bone)",
};

interface SectionProps {
  children: ReactNode;
  as?: ElementType;
  variant?: SectionVariant;
  noPadding?: boolean;
  style?: CSSProperties;
  id?: string;
  "aria-label"?: string;
}

export function Section({
  children,
  as: Tag = "section",
  variant = "light",
  noPadding = false,
  style,
  id,
  "aria-label": ariaLabel,
}: SectionProps) {
  return (
    <Tag
      id={id}
      aria-label={ariaLabel}
      style={{
        background: BG[variant],
        color: TEXT[variant],
        paddingBlock: noPadding
          ? "0"
          : "clamp(7rem, 12vw, 11rem)",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
