import { buildMetadata } from "@/lib/seo/metadata";
import { SiteStructuredData } from "@/lib/seo/structured-data";
import type { Metadata } from "next";
import { fraunces, interTight } from "@/lib/fonts";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { Footer } from "@/components/layout/Footer";
import { getSite } from "@/lib/content/repository";
import "@/styles/globals.css";

export async function generateMetadata(): Promise<Metadata> { return buildMetadata(); }

export default async function RootLayout(props: LayoutProps<"/">) {
  const site = await getSite();

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${interTight.variable}`}
    >
      <body>
        <SiteStructuredData site={site} />
        <a href="#main-content" className="skip-link">Skip to main content</a>
          <LayoutShell site={site} footer={<Footer site={site} />}>
            <main id="main-content">{props.children}</main>
          </LayoutShell>
      </body>
    </html>
  );
}
