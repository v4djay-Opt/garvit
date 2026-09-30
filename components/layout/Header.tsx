"use client";

/**
 * components/layout/Header.tsx
 *
 * Transparent over hero (bone text) → on scroll past 80px, slides into
 * a compact ivory bar with ink text and a hairline bottom border.
 *
 * Full-screen navigation pattern:
 *   The header carries NO inline links on any breakpoint.
 *   Brand mark on the left, "Menu" trigger on the right — always visible.
 *   Menu opens the FullNav charcoal takeover.
 *
 * Plan §7: "Navigation: transparent over hero with bone text → on scroll
 * past 80px, slides down as a compact ivory bar with ink text."
 */

import { useState } from "react";
import Link from "next/link";
import { useScrollHeader } from "@/lib/motion/use-scroll-header";
import { FullNav, type NavProject } from "./FullNav";
import type { NavItem, Site } from "@/lib/content/types";

interface HeaderProps {
  nav: NavItem[];
  brand: Site["brand"];
  projects: NavProject[];
  /** Pass true on pages without a hero image so the header always shows solid */
  alwaysSolid?: boolean;
}

export function Header({ nav, brand, projects, alwaysSolid = false }: HeaderProps) {
  const { scrolled } = useScrollHeader(80);
  const [menuOpen, setMenuOpen] = useState(false);

  const solid = alwaysSolid || scrolled;

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
          {/* Brand mark — white logo over hero, inverted to ink when solid */}
          <Link
            href="/"
            aria-label={`${brand.name} — Home`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              lineHeight: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static asset swap needs no optimization */}
            <img
              src="/brand/logo-white.webp"
              alt=""
              width={704}
              height={277}
              style={{
                height: "clamp(34px, 4vw, 46px)",
                width: "auto",
                filter: solid ? "invert(0.93)" : "none",
                transition: "filter 300ms ease",
              }}
            />
          </Link>

          {/* Menu trigger — always visible, all breakpoints */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="full-nav"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem 0",
              color: solid ? "var(--color-ink)" : "var(--color-bone)",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-eyebrow)",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              transition: "color 300ms ease",
            }}
            className="menu-trigger"
          >
            <span>Menu</span>
            {/* Two-line mark — editorial, not a three-line hamburger */}
            <svg
              width="22"
              height="10"
              viewBox="0 0 22 10"
              fill="none"
              aria-hidden
            >
              <line x1="0" y1="1" x2="22" y2="1" stroke="currentColor" strokeWidth="1.5" />
              <line x1="0" y1="9" x2="22" y2="9" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </header>

      {/* Full-screen navigation */}
      <FullNav
        items={nav}
        projects={projects}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}
