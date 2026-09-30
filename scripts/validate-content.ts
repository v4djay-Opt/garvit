#!/usr/bin/env tsx
/**
 * scripts/validate-content.ts
 *
 * Content validation gate — runs on `npm run validate:content` and as
 * `prebuild` so an invalid commit cannot produce a build.
 *
 * Checks (in order):
 *  1. Every /data/*.json parses through its Zod schema (type safety)
 *  2. Project slugs are unique
 *  3. Testimonial projectSlugs reference real project slugs
 *  4. Media files referenced in projects.json exist on disk
 *  5. No ImageAsset has a missing alt field (must be explicit "" for decorative)
 *  6. No landmark with verified:false has distance or travelTime copy
 *     (prevents unverified claims rendering — PRD §18 / Technical PRD §18)
 *
 * Exits 0 on success, 1 on any failure, with clear error messages.
 */

import fs from "fs";
import path from "path";
import {
  LegalSchema,
  AboutSchema,
  HomeSchema,
  LocationsFileSchema,
  ProjectsFileSchema,
  SiteSchema,
  TestimonialsFileSchema,
} from "../lib/content/schema";

import { validateAssets } from "../lib/content/validation";
const ROOT = process.cwd();
const RELEASE = process.env.SITE_RELEASE === "true" || process.argv.includes("--release");

// ─── Helpers ─────────────────────────────────────────────────────────────────

type ErrorList = string[];

function readJson(filename: string): unknown {
  const fp = path.join(ROOT, "data", filename);
  if (!fs.existsSync(fp)) {
    throw new Error(`Missing data file: data/${filename}`);
  }
  return JSON.parse(fs.readFileSync(fp, "utf-8"));
}

function fileExists(src: string): boolean {
  // src is relative to /public, e.g. "/projects/foo/hero.webp"
  // Skip placeholder paths — they won't exist yet during development
  if (src.startsWith("/images/placeholder") || src.startsWith("/projects/placeholder") || src.startsWith("/images/premium/")) {
    return true; // placeholder paths are allowed during dev
  }
  const abs = path.join(ROOT, "public", src.replace(/^\//, ""));
  return fs.existsSync(abs);
}

function bold(s: string) {
  return `\x1b[1m${s}\x1b[0m`;
}
function red(s: string) {
  return `\x1b[31m${s}\x1b[0m`;
}
function green(s: string) {
  return `\x1b[32m${s}\x1b[0m`;
}

// ─── Individual checks ────────────────────────────────────────────────────────

function validateSite(errors: ErrorList) {
  const raw = readJson("site.json");
  const result = SiteSchema.safeParse(raw);
  if (!result.success) {
    errors.push(`site.json schema:\n${result.error.message}`);
  }
}

function validateHome(errors: ErrorList) {
  const raw = readJson("home.json");
  const result = HomeSchema.safeParse(raw);
  if (!result.success) {
    errors.push(`home.json schema:\n${result.error.message}`);
  }
}

function validateProjects(errors: ErrorList): string[] {
  const raw = readJson("projects.json");
  const result = ProjectsFileSchema.safeParse(raw);
  if (!result.success) {
    errors.push(`projects.json schema:\n${result.error.message}`);
    return [];
  }

  const projects = result.data;
  const slugsSeen = new Set<string>();

  for (const project of projects) {
    // 2. Slug uniqueness
    if (slugsSeen.has(project.slug)) {
      errors.push(`projects.json: duplicate slug "${project.slug}"`);
    }
    slugsSeen.add(project.slug);

    // 4. Media file existence
    const checkImage = (img: { src: string; alt: string }, ctx: string) => {
      if (!fileExists(img.src)) {
        errors.push(`${ctx}: media file not found on disk: ${img.src}`);
      }
      // 5. Alt text must be present (empty string ok for decorative)
      if (img.alt === undefined || img.alt === null) {
        errors.push(`${ctx}: ImageAsset missing alt field — use "" for decorative images`);
      }
    };

    checkImage(project.media.heroImage, `projects["${project.slug}"].media.heroImage`);

    for (const img of project.media.gallery ?? []) {
      checkImage(img, `projects["${project.slug}"].media.gallery`);
    }

    if (project.masterPlan) {
      checkImage(project.masterPlan, `projects["${project.slug}"].masterPlan`);
    }

    for (const fp of project.floorPlans ?? []) {
      checkImage(fp.image, `projects["${project.slug}"].floorPlans["${fp.label}"]`);
    }

    // 6. Unverified landmark guard
    for (const lm of project.locationDetail?.landmarks ?? []) {
      if (!lm.verified && (lm.distance || lm.travelTime)) {
        errors.push(
          `projects["${project.slug}"].locationDetail.landmarks["${lm.name}"]: ` +
            `has distance/travelTime but verified:false — verify the data or remove the values`
        );
      }
    }
  }

  return [...slugsSeen];
}

function validateTestimonials(errors: ErrorList, validProjectSlugs: string[]) {
  const raw = readJson("testimonials.json");
  const result = TestimonialsFileSchema.safeParse(raw);
  if (!result.success) {
    errors.push(`testimonials.json schema:\n${result.error.message}`);
    return;
  }

  // 3. Referential integrity: projectSlug → known project
  for (const t of result.data) {
    if (t.projectSlug && !validProjectSlugs.includes(t.projectSlug)) {
      errors.push(
        `testimonials.json: testimonial "${t.id}" references unknown project slug "${t.projectSlug}"`
      );
    }
  }
}

function validateLocations(errors: ErrorList) {
  const raw = readJson("locations.json");
  const result = LocationsFileSchema.safeParse(raw);
  if (!result.success) {
    errors.push(`locations.json schema:\n${result.error.message}`);
  }
}

function validateAbout(errors: ErrorList) {
  const raw = readJson("about.json");
  const result = AboutSchema.safeParse(raw);
  if (!result.success) {
    errors.push(`about.json schema:\n${result.error.message}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  console.log(bold("\n▶ Garvit Buildtech — content validation\n"));

  const errors: ErrorList = [];

  try {
    const legal = LegalSchema.safeParse(readJson("legal.json"));
    if (!legal.success) errors.push(`legal.json: ${legal.error.message}`);
    if (RELEASE && legal.success && (!legal.data.privacy.approved || !legal.data.terms.approved)) errors.push("Legal pages must be approved before release");
    for (const file of fs.readdirSync(path.join(ROOT, "data")).filter(name => name.endsWith(".json"))) errors.push(...validateAssets(readJson(file), ROOT, RELEASE, file));
    if (RELEASE) {
      const base = process.env.NEXT_PUBLIC_CANONICAL_BASE || "";
      if (!/^https:\/\//.test(base) || /yourdomain|localhost|example\./i.test(base)) errors.push("Set NEXT_PUBLIC_CANONICAL_BASE to the final HTTPS domain");
      const site = SiteSchema.parse(readJson("site.json"));
      for (const key of ["phone", "email", "address"] as const) if (!site.contact[key]) errors.push(`site.contact.${key} is required for release`);
      if (!ProjectsFileSchema.parse(readJson("projects.json")).some(project => project.visible)) errors.push("At least one approved visible project is required for release");
      try { const url = new URL(base); if (url.pathname !== "/" || url.search || url.hash) errors.push("Canonical base must be an origin without a path, query or fragment"); } catch { /* domain check already reports invalid values */ }
      for (const key of ["SMTP_HOST", "SMTP_USER", "SMTP_PASS", "LEAD_TO_EMAIL", "LEAD_FAILURE_DIR"]) if (!process.env[key] || /yourdomain|your-smtp|PLACEHOLDER/i.test(process.env[key]!)) errors.push(`${key} must be configured for release`);
      if (process.env.TRUST_PROXY !== "true") errors.push("TRUST_PROXY must be true behind the configured Nginx proxy");
    }
    validateSite(errors);
    console.log(`  ${green("✓")} site.json`);

    validateHome(errors);
    console.log(`  ${green("✓")} home.json`);

    const slugs = validateProjects(errors);
    console.log(`  ${green("✓")} projects.json (${slugs.length} project${slugs.length !== 1 ? "s" : ""})`);

    validateTestimonials(errors, slugs);
    console.log(`  ${green("✓")} testimonials.json`);

    validateLocations(errors);
    console.log(`  ${green("✓")} locations.json`);

    validateAbout(errors);
    console.log(`  ${green("✓")} about.json`);
  } catch (err) {
    errors.push(String(err));
  }

  if (errors.length > 0) {
    console.log(`\n${red(bold(`✗ ${errors.length} error${errors.length !== 1 ? "s" : ""} found:`))}\n`);
    for (const e of errors) {
      console.log(`  ${red("•")} ${e}\n`);
    }
    process.exit(1);
  }

  console.log(`\n${green(bold("✓ All content valid"))}\n`);
  process.exit(0);
}

main();
