/**
 * components/layout/Container.tsx
 *
 * Max-width wrapper with responsive gutters.
 * max-width: 1440px; gutters: 20px (mobile) → 64px (desktop).
 *
 * Pass `wide` for editorial layouts that use the full 1440px.
 * Pass `narrow` for article / prose content (max ~68ch).
 */

import type { CSSProperties, ElementType, ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  as?: ElementType;
  wide?: boolean;
  narrow?: boolean;
  style?: CSSProperties;
  className?: string;
}

export function Container({
  children,
  as: Tag = "div",
  wide = false,
  narrow = false,
  style,
  className,
}: ContainerProps) {
  const maxWidth = narrow ? "68ch" : wide ? "100%" : "1440px";
  const padding = "clamp(1.25rem, 4vw, 4rem)";

  return (
    <Tag
      style={{
        width: "100%",
        maxWidth,
        marginInline: "auto",
        paddingInline: padding,
        ...style,
      }}
      className={className}
    >
      {children}
    </Tag>
  );
}
