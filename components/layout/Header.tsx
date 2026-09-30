"use client";

/**
 * components/layout/Header.tsx
 *
 * Transparent over hero (bone text) → on scroll past 80px, slides into
 * a compact ivory bar with ink text and a hairline bottom border.
 *
 * Desktop: inline nav links (Inter Tight 500, uppercase, 0.1em tracking).
 * Mobile: hamburger → fullscreen charcoal overlay (MobileMenu).
 *
 * Plan §7: "Navigation: transparent over hero with bone text → on scroll past
 * 80vh, slides down as a compact ivory bar with ink text."
 */

import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useScrollHeader } from "@/lib/motion/use-scroll-header";
import { MobileMenu } from "./MobileMenu";
import type { NavItem, Site } from "@/lib/content/types";

interface HeaderProps {
  nav: NavItem[];
  brand: Site["brand"];
  /** Pass true on pages without a hero image so the header always shows solid */
  alwaysSolid?: boolean;
}

const NAV_LINK_STYLE_BASE = {
  fontFamily: "var(--font-body)" as string,
  fontSize: "var(--text-eyebrow)" as string,
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  textDecoration: "none",
  transition: "opacity 150ms ease",
};

export function Header({ nav, brand, alwaysSolid = false }: HeaderProps) {
  const pathname = usePathname();
  const { scrolled } = useScrollHeader(80);
  const [menuOpen, setMenuOpen] = useState(false);

  const solid = alwaysSolid || scrolled;
  const visibleItems = nav.filter((i) => i.visible);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: "var(--z-header)" as string,
          height: solid ? "64px" : "80px",
          display: "flex",
          alignItems: "center",
          background: solid ? "var(--color-ivory)" : "transparent",
          borderBottom: solid
            ? "1px solid var(--color-sand)"
            : "none",
          transition: "height 300ms ease, background 300ms ease, border-bottom-color 300ms ease",
          willChange: "height, background",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1440px",
            marginInline: "auto",
            paddingInline: "clamp(1.25rem, 4vw, 4rem)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Brand mark */}
          <Link
            href="/"
            aria-label={`${brand.name} — Home`}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1rem, 1.8vw, 1.3rem)",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              color: solid ? "var(--color-ink)" : "var(--color-bone)",
              textDecoration: "none",
              transition: "color 300ms ease",
              lineHeight: 1,
            }}
          >
            {brand.logoText}
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="Primary navigation"
            style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}
          >
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                alignItems: "center",
                gap: "2.5rem",
              }}
              className="desktop-nav-list"
            >
              {visibleItems.map((item) => (
                <li key={item.href} style={{ display: "flex" }}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    style={{
                      ...NAV_LINK_STYLE_BASE,
                      color: solid ? "var(--color-ink)" : "var(--color-bone)",
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile hamburger */}
            <button
              onClick={(event) => { event.currentTarget.focus(); setMenuOpen(true); }}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              style={{
                display: "none",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.5rem",
                color: solid ? "var(--color-ink)" : "var(--color-bone)",
              }}
              className="mobile-menu-btn"
            >
              {/* Minimal SVG hamburger — three lines */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <line x1="3" y1="6"  x2="21" y2="6"  stroke="currentColor" strokeWidth="1.5" />
                <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.5" />
                <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile overlay */}
      <MobileMenu
        items={nav}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      {/* Responsive: show hamburger on mobile, hide desktop links */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav-list { display: none !important; }
          .mobile-menu-btn  { display: flex !important; }
        }
      `}</style>
    </>
  );
}
