# Adding approved project content

All customer/project facts live in `data/`; UI reads them through `lib/content/repository.ts`. An absent optional section stays hidden. No code changes are needed to add a project using the existing fields.

Supply each project's official name, category, status, locality, short description, story, real hero image and the actions you want enabled. Optional assets: hero WebM/MP4 with poster, architecture images, master plan, floor plans with labels/areas/PDFs, amenities, mixed portrait/landscape gallery, specifications, brochure, location query and verified landmarks. Brochure downloads open the lead form first.

Use `data/projects.json` and the definitions in `lib/content/schema.ts`. Duplicate the object for another project, give it a unique kebab-case `slug`, and use `visible`, `featured` and `order` to control placement. Set `cta.brochure=true` only when `brochure.file` exists. Real testimonial records can be added to `data/testimonials.json`; enable `site.featureFlags.showTestimonials` to reveal the section, navigation and standalone page together.

Media goes below `public/images`, `public/projects/<slug>`, `public/videos`, `public/brochures` and `public/floor-plans`. JSON paths start with `/`, without `public`. Every image requires `src`, `alt`, `width` and `height`. Use `node scripts/prepare-image.mjs source.jpg public/projects/<slug>/hero-v1.webp` to create a WebP copy no larger than 2560px. Keep originals elsewhere. Use versioned filenames to avoid stale cached replacements. Desktop hero video should be short and compressed; mobile, reduced-motion and data-saving visitors receive the poster only.

Populate `data/site.json` with official contacts, WhatsApp (international digits), optional `contact.mapEmbedQuery`, social profiles and SEO defaults. Populate `home.json`, `about.json`, `locations.json` with approved copy. Legal copy is now in `data/legal.json`; only mark `approved=true` after review, and replace the draft updated date.

Preview builds allow clearly marked placeholders and stay noindex. `npm run validate:content` checks schemas and asset paths. A real deployment sets `SITE_RELEASE=true`; `npm run validate:release` blocks placeholders, missing media, missing configuration and unapproved legal pages. Read `deploy/DEPLOYMENT.md` before launch.

The `/kitchen-sink` page demonstrates full project components with a clearly labelled schematic. It is removed from release output and must never be used as real project material.
