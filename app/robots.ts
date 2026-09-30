import type { MetadataRoute } from "next";
import { getSite } from "@/lib/content/repository";
import { canonicalBase } from "@/lib/seo/metadata";
export const dynamic = "force-static";
export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = canonicalBase((await getSite()).seo.canonicalBase);
  return { rules: [{ userAgent: "*", ...(process.env.SITE_RELEASE === "true" ? { allow: "/", disallow: ["/api/", "/kitchen-sink"] } : { disallow: "/" }) }], sitemap: `${base}/sitemap.xml` };
}
