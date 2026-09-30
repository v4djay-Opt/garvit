/**
 * components/ui/Rule.tsx
 *
 * Hairline horizontal divider. 1px solid sand on light, muted bone on dark.
 * No rounded corners, no gradients.
 */

import type { CSSProperties } from "react";

interface RuleProps {
  theme?: "light" | "dark";
  style?: CSSProperties;
}

export function Rule({ theme = "light", style }: RuleProps) {
  const borderColor =
    theme === "dark"
      ? "color-mix(in srgb, var(--color-bone-muted) 30%, transparent)"
      : "var(--color-sand)";

  return (
    <hr
      role="presentation"
      style={{
        border: "none",
        borderTop: `1px solid ${borderColor}`,
        width: "100%",
        margin: 0,
        ...style,
      }}
    />
  );
}
