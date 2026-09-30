/**
 * app/page.tsx — Homepage
 *
 * Nine sections composed from the design system and content repository.
 * All sections are statically prerendered at build time.
 *
 * Data hierarchy:
 *   getHome()               → hero, manifesto, categories, haridwarStory,
 *                             philosophy, closingCta
 *   getFeaturedProjects()   → featured project editorial figures
 *   getTestimonials()       → pull-quote carousel (renders only if data exists)
 *
 * PRD §3 / Technical PRD v2.1 §9
 */

export const dynamic = "force-static";

import { buildMetadata } from "@/lib/seo/metadata";
import {
  getHome,
  getVisibleProjects,
  getTestimonials,
} from "@/lib/content/repository";

import { HeroSection }            from "@/components/sections/HeroSection";
import { ManifestoSection }       from "@/components/sections/ManifestoSection";
import { FeaturedProjectsSection } from "@/components/sections/FeaturedProjectsSection";
import { CategoriesSection }      from "@/components/sections/CategoriesSection";
import { HaridwarStorySection }   from "@/components/sections/HaridwarStorySection";
import { PhilosophySection }      from "@/components/sections/PhilosophySection";
import { TestimonialsSection }    from "@/components/sections/TestimonialsSection";
import { ClosingCtaSection }      from "@/components/sections/ClosingCtaSection";

export async function generateMetadata() { return buildMetadata({ title: '', canonicalPath: '/' }); }

export default async function HomePage() {
  const [home, visibleProjects, testimonials] = await Promise.all([
    getHome(),
    getVisibleProjects(),
    getTestimonials(),
  ]);
  const featuredProjects = visibleProjects.filter((p) => p.featured);
  const categoryTypes = new Set(visibleProjects.map((p) => p.type));

  return (
    <>
      {/* 1. Cinematic hero — full viewport */}
      <HeroSection hero={home.hero} />

      {/* 2. Brand manifesto */}
      <ManifestoSection manifesto={home.manifesto} />

      {/* 3. Featured projects — editorial figures */}
      <FeaturedProjectsSection projects={featuredProjects} />

      {/* 4. Property categories — Plots / Farm House */}
      <CategoriesSection categories={home.categories} availableTypes={categoryTypes} />

      {/* 5. Haridwar story — dark section */}
      <HaridwarStorySection story={home.haridwarStory} />

      {/* 6. Developer philosophy — numbered editorial list */}
      <PhilosophySection philosophy={home.philosophy} />

      {/* 7. Testimonials — only if data exists (empty = section absent) */}
      {testimonials.length > 0 && (
        <TestimonialsSection testimonials={testimonials} />
      )}

      {/* 8. Closing CTA */}
      <ClosingCtaSection closingCta={home.closingCta} />

      {/* 9. Footer — rendered by LayoutShell in app/layout.tsx */}
    </>
  );
}
