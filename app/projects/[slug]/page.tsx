/**
 * app/projects/[slug]/page.tsx — Project microsite
 *
 * Each project is a premium editorial microsite.
 * Sections render conditionally — absent data means the section is hidden,
 * not an empty box. This keeps the page clean regardless of how much
 * content the client has provided.
 *
 * Static generation: generateStaticParams() returns all visible slugs so
 * Next.js prerenders every project at build time. New projects added to
 * projects.json will be built on the next deploy.
 *
 * Architecture:
 *   getProjectBySlug → Project (all fields) → conditional section components
 *   getSite          → site contact for CTA bar (WhatsApp, email)
 *
 * PRD §6 (project microsite) / Technical PRD v2.1 §9
 */

import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import { ProjectStructuredData } from "@/lib/seo/structured-data";
import {
  getProjectSlugs,
  getProjectBySlug,
  getSite,
  getVisibleProjects,
} from "@/lib/content/repository";

import { ProjectDetails, ProjectSpecifications } from "@/components/project/ProjectDetails";
import { ProjectCard } from "@/components/project/ProjectCard";

export const dynamic = "force-static";
export const dynamicParams = false;

import { ProjectHero }       from "@/components/project/ProjectHero";
import { ProjectStory }      from "@/components/project/ProjectStory";
import { ProjectHighlights } from "@/components/project/ProjectHighlights";
import { ProjectLocation }   from "@/components/project/ProjectLocation";
import { ProjectCtaBar }     from "@/components/project/ProjectCtaBar";

// ─── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ─── Dynamic metadata ──────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return buildMetadata({ title: project.seo?.title || project.name, description: project.seo?.description || project.shortDescription,
    canonicalPath: `/projects/${slug}`, ogImage: project.seo?.ogImage || (project.media.heroImage.src.includes("placeholder") ? undefined : project.media.heroImage.src) });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [project, site, allProjects] = await Promise.all([
    getProjectBySlug(slug),
    getSite(),
    getVisibleProjects(),
  ]);

  if (!project) notFound();

  const contact = site.contact;

  return (
    <>
      <ProjectStructuredData project={project} site={site} />
      {/* 1. Hero — always present (heroImage is required in schema) */}
      <ProjectHero project={project} />

      {/* 2. Project story — only if story data exists */}
      {project.story && <ProjectStory story={project.story} />}

      {/* 3. Key highlights / stats — only if present */}
      {project.highlights && project.highlights.length > 0 && (
        <ProjectHighlights highlights={project.highlights} />
      )}

      <ProjectDetails project={project} />

      {/* 4. Location + map facade — only if locationDetail exists */}
      {project.locationDetail && (
        <ProjectLocation
          locationDetail={project.locationDetail}
          projectName={project.name}
        />
      )}

      <ProjectSpecifications project={project} />

      {/* 5. Sticky CTA bar — always shown; hides until user scrolls past hero */}
      {project.cta && (
        <ProjectCtaBar
          projectName={project.name}
          projectSlug={project.slug}
          cta={project.cta}
          brochureFile={project.brochure?.file}
          whatsappNumber={contact.whatsappNumber}
          email={contact.email}
        />
      )}
      {allProjects.some(p => p.slug !== project.slug) && <section className="content-width related-projects"><h2 className="text-h2 section-heading">Explore more projects</h2><div className="detail-grid">{allProjects.filter(p => p.slug !== project.slug).slice(0, 2).map(p => <ProjectCard key={p.slug} project={p} />)}</div></section>}
    </>
  );
}
