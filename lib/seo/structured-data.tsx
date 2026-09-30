import type { Project, Site } from "@/lib/content/types";
import { canonicalBase } from "./metadata";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json">{JSON.stringify(data).replace(/</g, "\\u003c")}</script>;
}

const isPlaceholder = (v?: string) => !v || /placeholder|yourdomain/i.test(v);

/**
 * Site-wide entity graph (rendered in the root layout):
 *   Organization (#organization) — RealEstateAgent subtype; phone/email/address
 *     only emitted when real (non-placeholder) values exist
 *   WebSite (#website) — publisher → organization
 *   WebPage (#webpage) — the current page; overridden per-route where needed
 */
export function SiteStructuredData({ site }: { site: Site }) {
  if (process.env.SITE_RELEASE !== "true") return null;
  const base = canonicalBase(site.seo.canonicalBase);
  const { contact, social, brand } = site;

  const sameAs = Object.values(social || {}).filter((v) => !isPlaceholder(v));
  const hasAddress = !isPlaceholder(contact.address);
  const hasPhone = !isPlaceholder(contact.phone);
  const hasEmail = !isPlaceholder(contact.email);

  const organization: Record<string, unknown> = {
    "@type": ["Organization", "RealEstateAgent", "LocalBusiness"],
    "@id": `${base}/#organization`,
    name: brand.name,
    url: base,
    logo: {
      "@type": "ImageObject",
      url: `${base}/brand/logo-dark.png`,
      width: 704,
      height: 277,
    },
    description: site.seo.defaultDescription,
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Haridwar, Uttarakhand, India",
    },
    ...(hasAddress && {
      address: { "@type": "PostalAddress", streetAddress: contact.address, addressLocality: "Haridwar", addressRegion: "Uttarakhand", addressCountry: "IN" },
    }),
    ...((hasPhone || hasEmail) && {
      contactPoint: {
        "@type": "ContactPoint",
        ...(hasPhone && { telephone: contact.phone!.replace(/\s/g, "") }),
        ...(hasEmail && { email: contact.email }),
        contactType: "sales",
        areaServed: "Haridwar, Uttarakhand",
        availableLanguage: ["en", "hi"],
      },
    }),
    ...(hasEmail && { email: contact.email }),
    ...(sameAs.length > 0 && { sameAs }),
  };

  const website = {
    "@type": "WebSite",
    "@id": `${base}/#website`,
    url: base,
    name: brand.name,
    publisher: { "@id": `${base}/#organization` },
    inLanguage: "en-IN",
  };

  return <JsonLd data={{ "@context": "https://schema.org", "@graph": [organization, website] }} />;
}

/**
 * WebPage node for a single route — emits on project pages and key static
 * pages. `path` must be the canonical path (no trailing slash, no params).
 */
export function WebPageStructuredData({ name, description, path, site }: {
  name: string; description?: string; path: string; site: Site;
}) {
  if (process.env.SITE_RELEASE !== "true") return null;
  const base = canonicalBase(site.seo.canonicalBase);
  const url = `${base}${path}`;
  return <JsonLd data={{ "@context": "https://schema.org", "@type": "WebPage", "@id": `${url}/#webpage`, url, name, ...(description && { description }),
    isPartOf: { "@id": `${base}/#website` }, about: { "@id": `${base}/#organization` }, inLanguage: "en-IN" }} />;
}

/**
 * Project microsite entity graph:
 *   Residence/Place entity (provider → organization)
 *   WebPage (#webpage) with breadcrumb + about → project entity
 *   BreadcrumbList matching the visible breadcrumb trail
 *
 * Schema.org has no RealEstateProject type — Residence is the closest valid
 * parent for housing projects; `provider` links the developer entity.
 */
export function ProjectStructuredData({ project, site }: { project: Project; site: Site }) {
  if (process.env.SITE_RELEASE !== "true") return null;
  const base = canonicalBase(site.seo.canonicalBase);
  const pageUrl = `${base}/projects/${project.slug}`;
  const projectId = `${pageUrl}/#project`;
  const image = project.media.heroImage.src.startsWith("http")
    ? project.media.heroImage.src
    : `${base}${project.media.heroImage.src}`;

  const entity: Record<string, unknown> = {
    "@type": "Residence",
    "@id": projectId,
    name: project.name,
    description: project.shortDescription,
    url: pageUrl,
    image,
    provider: { "@id": `${base}/#organization` },
    address: {
      "@type": "PostalAddress",
      ...(project.location.area && { streetAddress: project.location.area }),
      addressLocality: project.location.city,
      ...(project.location.state && { addressRegion: project.location.state }),
      addressCountry: "IN",
    },
    ...(project.locationDetail?.coordinates && {
      geo: { "@type": "GeoCoordinates", latitude: project.locationDetail.coordinates.lat, longitude: project.locationDetail.coordinates.lng },
    }),
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}/#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: base },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${base}/projects` },
      { "@type": "ListItem", position: 3, name: project.name, item: pageUrl },
    ],
  };

  const webPage = {
    "@type": "WebPage",
    "@id": `${pageUrl}/#webpage`,
    url: pageUrl,
    name: project.seo?.title || project.name,
    description: project.seo?.description || project.shortDescription,
    isPartOf: { "@id": `${base}/#website` },
    about: { "@id": projectId },
    breadcrumb: { "@id": `${pageUrl}/#breadcrumb` },
    primaryImageOfPage: { "@type": "ImageObject", url: image },
    inLanguage: "en-IN",
  };

  return <JsonLd data={{ "@context": "https://schema.org", "@graph": [entity, breadcrumb, webPage] }} />;
}
