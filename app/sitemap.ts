import type { MetadataRoute } from "next";
import { getProjectSlugs, hasTestimonials, getSite } from "@/lib/content/repository";

import { canonicalBase } from "@/lib/seo/metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE = canonicalBase((await getSite()).seo.canonicalBase);
  const slugs = await getProjectSlugs();
  const showTestimonials = await hasTestimonials();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                        priority: 1.0,  changeFrequency: "weekly" },
    { url: `${BASE}/about`,             priority: 0.8,  changeFrequency: "monthly" },
    { url: `${BASE}/projects`,          priority: 0.9,  changeFrequency: "weekly" },
    { url: `${BASE}/contact`,           priority: 0.7,  changeFrequency: "monthly" },
    { url: `${BASE}/privacy-policy`,    priority: 0.3,  changeFrequency: "yearly" },
    { url: `${BASE}/terms-and-conditions`, priority: 0.3, changeFrequency: "yearly" },
  ];

  if (showTestimonials) {
    staticRoutes.push({
      url: `${BASE}/testimonials`,
      priority: 0.6,
      changeFrequency: "monthly",
    });
  }

  const projectRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE}/projects/${slug}`,
    priority: 0.9,
    changeFrequency: "weekly" as const,
  }));

  return [...staticRoutes, ...projectRoutes];
}
