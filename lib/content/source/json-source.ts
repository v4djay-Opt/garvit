/**
 * lib/content/source/json-source.ts
 *
 * v1 implementation of ContentSource — reads from /data/*.json.
 * This file is the only place in the codebase that imports JSON directly.
 *
 * Uses Node `fs.readFileSync` so it can run at build time (generateStaticParams,
 * static page generation) without any async bundle complications. All pages
 * using this source are statically prerendered — there is no runtime I/O.
 */

import fs from "fs";
import path from "path";
import type { ContentSource } from "./content-source";
import type { Legal, About, Home, LocationStory, Project, Site, Testimonial } from "../types";
import {
  LegalSchema,
  AboutSchema,
  HomeSchema,
  LocationsFileSchema,
  ProjectsFileSchema,
  SiteSchema,
  TestimonialsFileSchema,
} from "../schema";

function readJson(filename: string): unknown {
  const filePath = path.join(process.cwd(), "data", filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export class JsonContentSource implements ContentSource {
  async getLegal(): Promise<Legal> { return LegalSchema.parse(readJson("legal.json")); }
  async getSite(): Promise<Site> {
    const raw = readJson("site.json");
    return SiteSchema.parse(raw);
  }

  async getHome(): Promise<Home> {
    const raw = readJson("home.json");
    return HomeSchema.parse(raw);
  }

  async getAbout(): Promise<About> {
    const raw = readJson("about.json");
    return AboutSchema.parse(raw);
  }

  async getAllProjects(): Promise<Project[]> {
    const raw = readJson("projects.json");
    return ProjectsFileSchema.parse(raw);
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    const raw = readJson("testimonials.json");
    return TestimonialsFileSchema.parse(raw);
  }

  async getAllLocations(): Promise<LocationStory[]> {
    const raw = readJson("locations.json");
    return LocationsFileSchema.parse(raw);
  }
}
