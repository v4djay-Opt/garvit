import { buildMetadata } from "@/lib/seo/metadata";
import { SiteStructuredData } from "@/lib/seo/structured-data";
import type { Metadata, Viewport } from "next";
import { fraunces, interTight } from "@/lib/fonts";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { Footer } from "@/components/layout/Footer";
import { getSite, getVisibleProjects } from "@/lib/content/repository";
import "@/styles/globals.css";

export async function generateMetadata(): Promise<Metadata> { return buildMetadata(); }

export const viewport: Viewport = {
  themeColor: "#14110F",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout(props: LayoutProps<"/">) {
  const [site, projects] = await Promise.all([getSite(), getVisibleProjects()]);

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${interTight.variable}`}
    >
      <body>
        <SiteStructuredData site={site} />
        <a href="#main-content" className="skip-link">Skip to main content</a>
          <LayoutShell
            site={site}
            projects={projects.map(({ slug, name, type, status }) => ({ slug, name, type, status }))}
            footer={<Footer site={site} />}
          >
            <main id="main-content">{props.children}</main>
          </LayoutShell>
      </body>
    </html>
  );
}
