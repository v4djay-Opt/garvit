"use client";

/**
 * components/layout/FullNav.tsx
 *
 * Full-screen navigation overlay — used on every breakpoint.
 * The header carries no inline links; all navigation lives here.
 *
 * Layout:
 *   - Charcoal fullscreen takeover (native <dialog> top layer)
 *   - Top bar mirrors the site header exactly: logo left, Close right —
 *     same padding and vertical centre as the "Menu" trigger so open/close
 *     sit in the same position
 *   - Two columns: primary links (large Fraunces) | All Projects rail
 *   - Footer: brand tagline + location
 *
 * Animation (GSAP, lazy via registerGsap — respects reduced motion/touch):
 *   - Overlay fades in
 *   - Each link label rises through an overflow mask, staggered
 *   - Projects rail fades + slides, staggered
 *   - Close triggers a fade-out before the dialog actually closes
 */

import { useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "@/components/ui/Dialog";
import { useMotion } from "@/lib/motion/motion-provider";
import { registerGsap } from "@/lib/motion/gsap";
import type { NavItem, Project } from "@/lib/content/types";

export interface NavProject {
  slug: Project["slug"];
  name: Project["name"];
  type: Project["type"];
  status: Project["status"];
}

interface FullNavProps {
  items: NavItem[];
  projects: NavProject[];
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_LABEL: Record<string, string> = {
  ongoing:   "Ongoing",
  upcoming:  "Upcoming",
  delivered: "Delivered",
};

export function FullNav({ items, projects, isOpen, onClose }: FullNavProps) {
  const pathname = usePathname();
  const { canAnimate } = useMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);

  // The Projects rail on the right replaces the main "Projects" link.
  const visibleItems = items.filter(
    (item) => item.visible && item.href !== "/projects"
  );

  /** Animated close — fade the surface out, then let the parent unmount. */
  const requestClose = useCallback(() => {
    if (!canAnimate || closingRef.current) {
      onClose();
      return;
    }
    closingRef.current = true;
    void registerGsap().then((gsap) => {
      const surface = rootRef.current;
      if (!surface) { onClose(); return; }
      gsap.to(surface, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => { closingRef.current = false; onClose(); },
      });
    }).catch(() => { closingRef.current = false; onClose(); });
  }, [canAnimate, onClose]);

  /* Entrance timeline — runs once per open, after the dialog mounts. */
  useEffect(() => {
    if (!isOpen || !canAnimate || !rootRef.current) return;
    const root = rootRef.current;

    let cancelled = false;
    void registerGsap().then((gsap) => {
      if (cancelled || !root.isConnected) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.3 })
        .fromTo(
          root.querySelectorAll(".nav-link-mask > .nav-link-inner"),
          { yPercent: 110 },
          { yPercent: 0, duration: 0.7, stagger: 0.07 },
          "-=0.05"
        )
        .fromTo(
          root.querySelectorAll(".nav-projects-col, .nav-project-row"),
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 },
          "-=0.45"
        )
        .fromTo(
          root.querySelectorAll(".nav-footer-row"),
          { opacity: 0 },
          { opacity: 1, duration: 0.4 },
          "-=0.25"
        );
    });
    return () => { cancelled = true; };
  }, [isOpen, canAnimate]);

  return (
    <Dialog
      id="full-nav"
      open={isOpen}
      onClose={requestClose}
      title={
        /* eslint-disable-next-line @next/next/no-img-element -- static brand asset */
        <img
          src="/brand/logo-white.webp"
          alt="Garvit Buildtech"
          width={704}
          height={277}
          className="nav-logo"
        />
      }
      className="navigation-dialog"
    >
      <div ref={rootRef} className="nav-anim-root">
        <div className="nav-body">
          {/* Primary links */}
          <nav aria-label="Primary navigation" className="nav-primary">
            <ul className="nav-links">
              {visibleItems.map((item, i) => {
                const current = pathname === item.href;
                return (
                  <li key={item.href} className="nav-link-mask">
                    <span className="nav-link-inner" style={{ display: "inline-flex" }}>
                      <Link
                        href={item.href}
                        onClick={requestClose}
                        aria-current={current ? "page" : undefined}
                        className="nav-link"
                      >
                        <span className="nav-link-index" aria-hidden>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="nav-link-label">{item.label}</span>
                        {current && <span className="nav-link-current" aria-hidden />}
                      </Link>
                    </span>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* All projects rail */}
          {projects.length > 0 && (
            <nav aria-label="All projects" className="nav-projects-col">
              <p className="nav-projects-heading">Projects</p>
              <ul className="nav-project-list">
                {projects.map((p) => (
                  <li key={p.slug} className="nav-project-row">
                    <Link href={`/projects/${p.slug}`} onClick={requestClose} className="nav-project-link">
                      <span className="nav-project-name">{p.name}</span>
                      <span className="nav-project-meta">{STATUS_LABEL[p.status ?? "ongoing"]}</span>
                    </Link>
                  </li>
                ))}
                <li className="nav-project-row">
                  <Link href="/projects" onClick={requestClose} className="nav-project-link nav-project-all">
                    <span className="nav-project-name">All projects</span>
                    <span className="nav-project-meta" aria-hidden>→</span>
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </div>

        {/* Brand mark — animated text watermark, bottom right */}
        <div className="nav-brand-row nav-footer-row" aria-hidden="true">
          <span className="nav-brand-mark fx-focus">
            <span className="nav-brand-mark-main">
              {"GARVIT".split("").map((ch, i) => (
                <b key={i} style={{ "--i": i } as React.CSSProperties}>{ch}</b>
              ))}
            </span>
            <span className="nav-brand-mark-sub">
              {"BUILDTECH".split("").map((ch, i) => (
                <b key={i} style={{ "--i": i + 6 } as React.CSSProperties}>{ch}</b>
              ))}
            </span>
          </span>
        </div>

        <p className="eyebrow-footer nav-footer-row">Haridwar, Uttarakhand</p>
      </div>
    </Dialog>
  );
}
