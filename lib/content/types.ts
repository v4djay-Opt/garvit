/**
 * lib/content/types.ts
 *
 * All TypeScript types are inferred from Zod schemas — never hand-written.
 * Import types from here throughout the app. Never import from schema.ts
 * just to get the type.
 */

import type { z } from "zod";
import type {
  LegalSchema,
  ImageAssetSchema,
  HeroVideoSchema,
  PropertyTypeSchema,
  ProjectStatusSchema,
  LandmarkSchema,
  ProjectSchema,
  TestimonialSchema,
  LocationStorySchema,
  NavItemSchema,
  SiteSchema,
  HomeSchema,
  AboutSchema,
  ProjectsFileSchema,
  TestimonialsFileSchema,
  LocationsFileSchema,
} from "./schema";

export type ImageAsset = z.infer<typeof ImageAssetSchema>;
export type HeroVideo = z.infer<typeof HeroVideoSchema>;
export type PropertyType = z.infer<typeof PropertyTypeSchema>;
export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;
export type Landmark = z.infer<typeof LandmarkSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Testimonial = z.infer<typeof TestimonialSchema>;
export type LocationStory = z.infer<typeof LocationStorySchema>;
export type NavItem = z.infer<typeof NavItemSchema>;
export type Site = z.infer<typeof SiteSchema>;
export type Home = z.infer<typeof HomeSchema>;
export type About = z.infer<typeof AboutSchema>;
export type ProjectsFile = z.infer<typeof ProjectsFileSchema>;
export type TestimonialsFile = z.infer<typeof TestimonialsFileSchema>;
export type LocationsFile = z.infer<typeof LocationsFileSchema>;

// Convenience sub-types
export type ProjectMedia = Project["media"];
export type ProjectStory = NonNullable<Project["story"]>;
export type ProjectLocationDetail = NonNullable<Project["locationDetail"]>;
export type ProjectCta = NonNullable<Project["cta"]>;
export type Highlight = NonNullable<Project["highlights"]>[number];
export type FloorPlan = NonNullable<Project["floorPlans"]>[number];
export type Amenity = NonNullable<Project["amenities"]>[number];
export type Specification = NonNullable<Project["specifications"]>[number];
export type HomePillar = Home["philosophy"]["pillars"][number];
export type HomeCategory = Home["categories"][number];

export type Legal = z.infer<typeof LegalSchema>;
