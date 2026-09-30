import type { Project, Site } from "@/lib/content/types";
import { canonicalBase } from "./metadata";
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json">{JSON.stringify(data).replace(/</g, "\\u003c")}</script>;
}
export function SiteStructuredData({ site }: { site: Site }) {
  if (process.env.SITE_RELEASE !== "true") return null;
  const base = canonicalBase(site.seo.canonicalBase);
  return <JsonLd data={{ "@context": "https://schema.org", "@type": ["Organization", "LocalBusiness"], "@id": `${base}/#organization`, name: site.brand.name, url: base,
    telephone: site.contact.phone, email: site.contact.email, address: site.contact.address,
    sameAs: Object.values(site.social || {}).filter(Boolean) }} />;
}
export function ProjectStructuredData({ project, site }: { project: Project; site: Site }) {
  if (process.env.SITE_RELEASE !== "true") return null;
  const base = canonicalBase(site.seo.canonicalBase);
  return <JsonLd data={{ "@context": "https://schema.org", "@graph": [
    { "@type": "Place", name: project.name, description: project.shortDescription, url: `${base}/projects/${project.slug}`, image: `${base}${project.media.heroImage.src}`,
      address: { "@type": "PostalAddress", addressLocality: project.location.city, addressRegion: project.location.state, addressCountry: "IN" },
      ...(project.locationDetail?.coordinates ? { geo: { "@type": "GeoCoordinates", latitude: project.locationDetail.coordinates.lat, longitude: project.locationDetail.coordinates.lng } } : {}) },
    { "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Home", item: base }, { "@type": "ListItem", position: 2, name: "Projects", item: `${base}/projects` }, { "@type": "ListItem", position: 3, name: project.name, item: `${base}/projects/${project.slug}` } ] }
  ] }} />;
}
