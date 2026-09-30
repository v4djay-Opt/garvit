/**
 * lib/content/source/content-source.ts
 *
 * The migration seam (PRD §25 / Technical PRD §3).
 *
 * UI components only ever call lib/content/repository.ts, which calls this
 * interface. Swapping from JSON files to a CMS, REST API, or database means
 * implementing this interface in a new file — no component changes required.
 */

import type { Legal, About, Home, LocationStory, Project, Site, Testimonial } from "../types";

export interface ContentSource {
  getLegal(): Promise<Legal>;
  /** Site-wide settings, nav, contact, SEO defaults. */
  getSite(): Promise<Site>;

  /** Home page copy — all sections. */
  getHome(): Promise<Home>;

  /** About page copy. */
  getAbout(): Promise<About>;

  /** All projects. The repository filters by visible/featured/etc. */
  getAllProjects(): Promise<Project[]>;

  /** All testimonials. Returns [] if none exist. */
  getAllTestimonials(): Promise<Testimonial[]>;

  /** All location stories for the Haridwar section. */
  getAllLocations(): Promise<LocationStory[]>;
}
