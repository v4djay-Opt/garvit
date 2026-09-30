/**
 * lib/content/schema.ts
 *
 * Zod schemas — the single source of truth for all content types.
 * TypeScript types are derived from these schemas via z.infer<>.
 * UI components must NOT import from /data/*.json directly; use the
 * repository API in lib/content/repository.ts instead.
 *
 * PRD §6, §7 (Technical PRD v2.1)
 */

import { z } from "zod";

// ─── Primitives ───────────────────────────────────────────────────────────────

export const ImageAssetSchema = z.object({
  /** Path relative to /public, e.g. "/projects/example/hero.webp" */
  src: z.string().min(1),
  /** Descriptive alt text. Use "" for decorative images. Required — empty
   *  string must be explicit, not absent, to satisfy the content validator. */
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  /** Optional blurDataURL (base64 SVG or tiny JPEG) for next/image placeholder. */
  blurDataURL: z.string().optional(),
  /** Visible provenance or context, e.g. an illustrative architectural concept. */
  caption: z.string().optional(),
});

export const HeroVideoSchema = z.object({
  webm: z.string().optional(),
  mp4: z.string().optional(),
  /** Required: a static poster image shown before/instead of video. */
  poster: z.string().min(1),
  /** Optional YouTube watch URL or YouTube embed URL. */
  youtube: z.string().url().optional(),
});

// ─── Enumerations ─────────────────────────────────────────────────────────────

export const PropertyTypeSchema = z.enum([
  "plot",
  "farm-house",
  "commercial",
  "retail",
  "mixed-use",
]);

export const ProjectStatusSchema = z.enum(["ongoing", "upcoming", "delivered"]);

// ─── Project ──────────────────────────────────────────────────────────────────

export const LandmarkSchema = z.object({
  name: z.string().min(1),
  /**
   * `verified` must be true for distance/travelTime to render.
   * Unverified distances are structurally blocked from appearing (PRD §15 /
   * Technical PRD §18 content-safety enforcement).
   */
  verified: z.boolean(),
  distance: z.string().optional(),
  travelTime: z.string().optional(),
});

export const ProjectSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "slug must be lowercase kebab-case",
    }),
  name: z.string().min(1),
  type: PropertyTypeSchema,
  status: ProjectStatusSchema.optional(),
  /** Existing standalone project landing page. */
  websiteUrl: z.string().url().startsWith("https://").optional(),
  /**
   * Controls visibility in the UI. Set to false to hide Commercial projects
   * or any project not yet ready to publish, without removing the data.
   */
  visible: z.boolean().default(true),

  location: z.object({
    label: z.string().min(1),
    area: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1).optional(),
  }),

  shortDescription: z.string().min(1),
  positioningStatement: z.string().optional(),

  featured: z.boolean().default(false),
  order: z.number().int().nonnegative().default(0),

  media: z.object({
    heroImage: ImageAssetSchema,
    heroVideo: HeroVideoSchema.optional(),
    gallery: z.array(ImageAssetSchema).optional(),
  }),

  // ── Optional microsite sections (absent = section not rendered) ──────────
  story: z
    .object({
      eyebrow: z.string().optional(),
      heading: z.string().min(1),
      body: z.array(z.string().min(1)).min(1),
      image: ImageAssetSchema.optional(),
    })
    .optional(),

  highlights: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .optional(),

  architecture: z
    .object({
      heading: z.string().min(1),
      body: z.array(z.string().min(1)).min(1),
      images: z.array(ImageAssetSchema).min(1),
    })
    .optional(),

  masterPlan: ImageAssetSchema.optional(),

  floorPlans: z
    .array(
      z.object({
        label: z.string().min(1),
        area: z.string().optional(),
        unitType: z.string().optional(),
        image: ImageAssetSchema,
        pdf: z.string().optional(),
      })
    )
    .optional(),

  amenities: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        image: ImageAssetSchema.optional(),
      })
    )
    .optional(),

  specifications: z
    .array(
      z.object({
        group: z.string().min(1),
        items: z
          .array(
            z.object({
              label: z.string().min(1),
              value: z.string().min(1),
            })
          )
          .min(1),
      })
    )
    .optional(),

  brochure: z
    .object({
      file: z.string().min(1),
      label: z.string().optional(),
    })
    .optional(),

  locationDetail: z
    .object({
      coordinates: z
        .object({
          lat: z.number(),
          lng: z.number(),
        })
        .optional(),
      address: z.string().optional(),
      mapEmbedQuery: z.string().optional(),
    mapUrl: z.string().url().startsWith("https://").optional(),
      landmarks: z.array(LandmarkSchema).optional(),
      connectivity: z.array(z.string().min(1)).optional(),
    })
    .optional(),

  cta: z
    .object({
      enquire: z.boolean().default(true),
      brochure: z.boolean().default(false),
      siteVisit: z.boolean().default(true),
      callback: z.boolean().default(true),
      whatsapp: z.boolean().default(true),
    })
    .optional(),

  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      ogImage: z.string().optional(),
    })
    .optional(),
});

// ─── Testimonial ──────────────────────────────────────────────────────────────

export const TestimonialSchema = z.object({
  id: z.string().min(1),
  customerName: z.string().min(1),
  /**
   * Must reference a real project slug. Validated in validate-content.ts
   * for referential integrity. Optional — some buyers may not want the
   * project disclosed.
   */
  projectSlug: z.string().optional(),
  testimonial: z.string().min(1),
  photo: ImageAssetSchema.optional(),
});

// ─── Location / Haridwar story ────────────────────────────────────────────────

export const LocationStorySchema = z.object({
  id: z.string().min(1),
  heading: z.string().min(1),
  subheading: z.string().optional(),
  body: z.array(z.string().min(1)).min(1),
  image: ImageAssetSchema,
  highlights: z.array(z.string().min(1)).optional(),
});

// ─── Site settings ────────────────────────────────────────────────────────────

export const NavItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  /** Hidden nav items are part of the schema but not rendered. */
  visible: z.boolean().default(true),
});

export const SiteSchema = z.object({
  brand: z.object({
    name: z.string().min(1),
    tagline: z.string().optional(),
    logoText: z.string().min(1),
  }),
  nav: z.array(NavItemSchema),
  contact: z.object({
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    whatsappNumber: z.string().optional(),
    workingHours: z.string().optional(),
    mapEmbedQuery: z.string().optional(),
    mapUrl: z.string().url().startsWith("https://").optional(),
  }),
  social: z
    .object({
      instagram: z.string().optional(),
      facebook: z.string().optional(),
      youtube: z.string().optional(),
    })
    .optional(),
  seo: z.object({
    defaultTitle: z.string().min(1),
    titleTemplate: z.string().min(1),
    defaultDescription: z.string().min(1),
    canonicalBase: z.string().url(),
    ogImage: z.string().optional(),
  }),
  featureFlags: z
    .object({
      showTestimonials: z.boolean().default(false),
      showScrollSmoother: z.boolean().default(false),
    })
    .optional(),
});

// ─── Home page content ────────────────────────────────────────────────────────

export const HomeSchema = z.object({
  hero: z.object({
    eyebrow: z.string().optional(),
    headline: z.string().min(1),
    subline: z.string().optional(),
    primaryCta: z.object({ label: z.string().min(1), href: z.string().min(1) }),
    secondaryCta: z
      .object({ label: z.string().min(1), href: z.string().min(1) })
      .optional(),
    video: HeroVideoSchema.optional(),
    posterImage: ImageAssetSchema,
  }),
  manifesto: z.object({
    eyebrow: z.string().optional(),
    statement: z.string().min(1),
    body: z.array(z.string().min(1)).optional(),
  }),
  categories: z.array(
    z.object({
      type: PropertyTypeSchema,
      label: z.string().min(1),
      tagline: z.string().optional(),
      image: ImageAssetSchema,
    })
  ),
  haridwarStory: z.object({
    eyebrow: z.string().optional(),
    heading: z.string().min(1),
    body: z.array(z.string().min(1)).min(1),
    image: ImageAssetSchema,
  }),
  philosophy: z.object({
    eyebrow: z.string().optional(),
    heading: z.string().min(1),
    pillars: z.array(
      z.object({
        number: z.string().min(1),
        title: z.string().min(1),
        body: z.string().min(1),
      })
    ),
  }),
  closingCta: z.object({
    statement: z.string().min(1),
    primaryCta: z.object({ label: z.string().min(1), href: z.string().min(1) }),
    secondaryCta: z
      .object({ label: z.string().min(1), href: z.string().min(1) })
      .optional(),
  }),
});

// ─── About page content ───────────────────────────────────────────────────────

const AboutPillarSchema = z.object({
  number: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
});

export const AboutSchema = z.object({
  meta: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),

  hero: z.object({
    eyebrow: z.string().optional(),
    statement: z.string().min(1),
  }),

  story: z
    .object({
      eyebrow: z.string().optional(),
      heading: z.string().min(1),
      body: z.array(z.string().min(1)).min(1),
      image: ImageAssetSchema.optional(),
    })
    .optional(),

  mission: z.object({ heading: z.string().min(1), body: z.string().min(1) }).optional(),
  vision: z.object({ heading: z.string().min(1), body: z.string().min(1) }).optional(),
  leadership: z.object({
    heading: z.string().min(1),
    introduction: z.string().optional(),
    directors: z.array(z.object({
      id: z.string().min(1),
      name: z.string().min(1).optional(),
      role: z.string().min(1),
      photo: ImageAssetSchema.optional(),
      bio: z.string().optional(),
    })).length(2),
  }).optional(),

  approach: z
    .object({
      eyebrow: z.string().optional(),
      heading: z.string().min(1),
      pillars: z.array(AboutPillarSchema).min(1),
    })
    .optional(),
});

// ─── Top-level file schemas ───────────────────────────────────────────────────

export const ProjectsFileSchema = z.array(ProjectSchema);
export const TestimonialsFileSchema = z.array(TestimonialSchema);
export const LocationsFileSchema = z.array(LocationStorySchema);

export const LegalPageSchema = z.object({ approved: z.boolean(), lastUpdated: z.string().min(1), sections: z.array(z.object({ heading: z.string().min(1), body: z.array(z.string().min(1)).min(1) })).min(1) });
export const LegalSchema = z.object({ privacy: LegalPageSchema, terms: LegalPageSchema });
