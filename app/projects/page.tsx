/**
 * app/projects/page.tsx — Projects listing
 *
 * Static page. All visible projects are fetched at build time and passed
 * to the ProjectListingClient component, which reads the URL filter
 * client-side. The page HTML is identical for all visitors (no per-request
 * rendering) — Cloudflare can cache it indefinitely.
 *
 * useSearchParams() in the client component requires <Suspense>.
 * The Suspense boundary is here so the static build doesn't fail.
 */

export const dynamic = "force-static";

import { buildMetadata } from "@/lib/seo/metadata";
import { Suspense } from "react";
import { getVisibleProjects } from "@/lib/content/repository";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/sections/PageHero";
import { ProjectListingClient } from "@/components/project/ProjectListingClient";

export async function generateMetadata() { return buildMetadata({ title: 'Projects', canonicalPath: '/projects' }); }

/** Loading skeleton — shown until ProjectListingClient hydrates */
function ListingSkeleton() {
  return (
    <Section variant="light" style={{ paddingTop: 0 }}>
      <Container>
        <div style={{ height: "60px", borderBottom: "1px solid var(--color-sand)" }} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 380px), 1fr))",
            gap: "clamp(3rem, 6vw, 5rem) clamp(1.5rem, 3vw, 3rem)",
            paddingTop: "clamp(3rem, 6vw, 5rem)",
          }}
        >
          {[1, 2, 3].map((n) => (
            <div key={n}>
              <div
                style={{
                  paddingBottom: "66.66%",
                  background: "var(--color-sand)",
                  marginBottom: "1.25rem",
                }}
              />
              <div
                style={{ height: "0.75rem", width: "40%", background: "var(--color-sand)", marginBottom: "0.75rem" }}
              />
              <div
                style={{ height: "1.5rem", width: "70%", background: "var(--color-bone)", marginBottom: "0.5rem" }}
              />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default async function ProjectsPage() {
  const projects = await getVisibleProjects();

  return (
    <>
      <PageHero eyebrow="Our Work" title="Every project, a considered decision." description="Explore residential plots and farm houses, each with its own sense of place." />

      {/* Filter + grid (client) */}
      <Suspense fallback={<ListingSkeleton />}>
        <ProjectListingClient projects={projects} />
      </Suspense>
    </>
  );
}
