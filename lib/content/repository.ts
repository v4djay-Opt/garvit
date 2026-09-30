/**
 * lib/content/repository.ts
 *
 * The only public content API for the UI layer.
 * Components import from here — never from schema.ts, json-source.ts, or
 * any /data/*.json file directly.
 *
 * To migrate to a CMS/API: replace JsonContentSource with the new source
 * implementation. No component changes required.
 */

import { JsonContentSource } from "./source/json-source";
import type { ContentSource } from "./source/content-source";
import type { About, Home, LocationStory, Project, Site, Testimonial } from "./types";

// ─── Source resolution ────────────────────────────────────────────────────────
// In v1 this is always JsonContentSource. In future, swap based on env var:
//   if (process.env.CONTENT_SOURCE === "sanity") return new SanitySource();
function getSource(): ContentSource {
  return new JsonContentSource();
}

const source = getSource();

// ─── Site settings ────────────────────────────────────────────────────────────

/** Drop values still marked placeholder so they never render or reach client props. */
const strip = (v?: string) => (v && !/placeholder/i.test(v) ? v : undefined);

export async function getSite(): Promise<Site> {
  const site = await source.getSite();
  const testimonials = await source.getAllTestimonials();
  return {
    ...site,
    contact: {
      address: strip(site.contact.address),
      phone: strip(site.contact.phone),
      email: strip(site.contact.email),
      whatsappNumber: strip(site.contact.whatsappNumber),
      workingHours: strip(site.contact.workingHours),
      mapEmbedQuery: strip(site.contact.mapEmbedQuery),
      mapUrl: strip(site.contact.mapUrl),
    },
    social: site.social
      ? {
          instagram: strip(site.social.instagram),
          facebook: strip(site.social.facebook),
          youtube: strip(site.social.youtube),
        }
      : site.social,
    nav: site.nav.map(item => item.href === "/testimonials" ? { ...item, visible: testimonials.length > 0 && site.featureFlags?.showTestimonials === true } : item),
  };
}

// ─── Projects ─────────────────────────────────────────────────────────────────

/** All visible projects, sorted by `order` ascending. */
export async function getVisibleProjects(): Promise<Project[]> {
  const all = await source.getAllProjects();
  return all
    .filter((p) => p.visible)
    .sort((a, b) => a.order - b.order);
}

/** Projects flagged as featured, for the homepage section. */
export async function getFeaturedProjects(): Promise<Project[]> {
  const all = await getVisibleProjects();
  return all.filter((p) => p.featured);
}

/** Single project by slug. Returns null if not found or not visible. */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const all = await source.getAllProjects();
  const project = all.find((p) => p.slug === slug && p.visible);
  return project ?? null;
}

/**
 * All slugs for visible projects — used by generateStaticParams so Next.js
 * knows which project pages to prerender at build time.
 */
export async function getProjectSlugs(): Promise<string[]> {
  const all = await getVisibleProjects();
  return all.map((p) => p.slug);
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

/**
 * Returns all testimonials, or [] if none exist.
 * Callers must check for an empty array and not render the section.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  const site = await source.getSite();
  return site.featureFlags?.showTestimonials ? source.getAllTestimonials() : [];
}

/** True if there is at least one testimonial (controls nav visibility). */
export async function hasTestimonials(): Promise<boolean> {
  const all = await getTestimonials();
  return all.length > 0;
}

// ─── Homepage ─────────────────────────────────────────────────────────────────

export async function getHome(): Promise<Home> {
  return source.getHome();
}

// ─── About page ───────────────────────────────────────────────────────────────

export async function getAbout(): Promise<About> {
  return source.getAbout();
}

// ─── Location stories ─────────────────────────────────────────────────────────

export async function getLocations(): Promise<LocationStory[]> {
  return source.getAllLocations();
}

export async function getLegal() { return source.getLegal(); }
