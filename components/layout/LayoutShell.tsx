"use client";

/**
 * components/layout/LayoutShell.tsx
 *
 * Thin client wrapper that provides the MotionProvider context and
 * renders the Header (which needs scroll state) and Footer.
 *
 * The root layout (app/layout.tsx) is a Server Component; this shell
 * bridges the server/client boundary cleanly without converting the
 * entire layout to a Client Component.
 *
 * Data is passed down as serialised props (no async calls in Client Components).
 */

import { usePathname } from "next/navigation";
import { Analytics } from "@/components/analytics/Analytics";
import { MotionProvider } from "@/lib/motion/motion-provider";
import { Header } from "./Header";
import type { Site } from "@/lib/content/types";
import type { ReactNode } from "react";

interface LayoutShellProps {
  site: Site;
  children: ReactNode;
  footer: ReactNode;
  /** Pages without a hero image should pass true so the header always shows solid */
  solidHeader?: boolean;
}

export function LayoutShell({ site, children, footer, solidHeader }: LayoutShellProps) {
  const pathname = usePathname();
  const lightPage = ["/kitchen-sink"].includes(pathname);
  return (
    <MotionProvider>
      <Header nav={site.nav} brand={site.brand} alwaysSolid={solidHeader || lightPage} />
      {children}
      {footer}
      <Analytics />
    </MotionProvider>
  );
}
