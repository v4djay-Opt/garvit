/**
 * components/ui/Button.tsx
 *
 * Three variants (plan §7):
 *   primary  — solid charcoal fill, bone text
 *   secondary — 1px hairline border, ink text
 *   tertiary  — no border, ink text, animated underline wipe on hover
 *
 * Rules:
 *   - No gradients, no shadows, no border-radius above 2px
 *   - No scale or translate on hover (causes layout shift)
 *   - Uppercase letterspaced label, Inter Tight 500
 *   - Minimum 44px height for touch targets (PRD §5 / accessibility)
 *   - Subtle opacity dim on hover over 220ms
 *   - Works as <button> or <a> (pass `href` to render as link)
 */

import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties } from "react";

type ButtonVariant = "primary" | "secondary" | "tertiary";
type ButtonSize   = "md" | "sm";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  style?: CSSProperties;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const BASE: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  fontSize: "var(--text-eyebrow)",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  textDecoration: "none",
  cursor: "pointer",
  border: "none",
  background: "transparent",
  transition: "opacity 220ms ease, background 220ms ease, color 220ms ease, border-color 220ms ease",
  whiteSpace: "nowrap",
};

const SIZES: Record<ButtonSize, CSSProperties> = {
  md: { minHeight: "44px", padding: "0 2rem" },
  sm: { minHeight: "36px", padding: "0 1.25rem" },
};

const VARIANTS: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: "var(--color-charcoal)",
    color: "var(--color-bone)",
    border: "1px solid var(--color-charcoal)",
  },
  secondary: {
    background: "transparent",
    color: "var(--color-ink)",
    border: "1px solid var(--color-sand)",
  },
  tertiary: {
    background: "transparent",
    color: "var(--color-ink)",
    border: "none",
    padding: "0",
    position: "relative",
  },
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  style,
  className,
  children,
  ...rest
}: ButtonProps) {
  const variantStyle = VARIANTS[variant];
  const combined: CSSProperties = {
    ...BASE,
    ...SIZES[size],
    ...variantStyle,
    ...style,
  };

  const content =
    variant === "tertiary" ? (
      <span
        style={{
          position: "relative",
          paddingBottom: "2px",
        }}
      >
        {children}
        {/* Underline wipe: CSS-only, no JS required */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: "1px",
            width: "100%",
            background: "currentColor",
            transform: "scaleX(0)",
            transformOrigin: "left",
            transition: "transform 220ms var(--ease-out-standard)",
          }}
          className="btn-underline"
        />
      </span>
    ) : (
      children
    );

  const hoverClass = `btn-hover btn-hover--${variant}`;

  if (href !== undefined) {
    const isExternal = href.startsWith("http") || href.startsWith("//");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={combined}
          className={`${className ?? ""} ${hoverClass}`}
          {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }
    return (
      <Link
        href={href}
        style={combined}
        className={`${className ?? ""} ${hoverClass}`}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      style={combined}
      className={`${className ?? ""} ${hoverClass}`}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
