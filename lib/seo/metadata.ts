import type { Metadata } from "next";
import { getSite } from "@/lib/content/repository";
export function canonicalBase(fallback: string) { return (process.env.NEXT_PUBLIC_CANONICAL_BASE || fallback).replace(/\/$/, ""); }
export async function buildMetadata(page: { title?: string; description?: string; canonicalPath?: string; ogImage?: string; noIndex?: boolean } = {}): Promise<Metadata> {
  const site = await getSite();
  const base = canonicalBase(site.seo.canonicalBase);
  const title = page.title ? (page.title.includes(site.brand.name) ? page.title : site.seo.titleTemplate.replace("%s", page.title)) : site.seo.defaultTitle;
  const description = page.description || site.seo.defaultDescription;
  const url = `${base}${page.canonicalPath || ""}`;
  const image = page.ogImage || "/opengraph-image";
  const noIndex = page.noIndex || process.env.SITE_RELEASE !== "true";
  return { title: { absolute: title }, description, metadataBase: new URL(base), alternates: { canonical: url },
    openGraph: { title, description, url, siteName: site.brand.name, locale: "en_IN", type: "website", images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [image] }, robots: { index: !noIndex, follow: !noIndex } };
}
