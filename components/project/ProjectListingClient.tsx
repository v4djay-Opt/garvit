"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ProjectCard } from "./ProjectCard";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import type { Project } from "@/lib/content/types";
const types: Record<Project["type"], string> = { plot: "Plots", "farm-house": "Farm House", commercial: "Commercial", retail: "Retail", "mixed-use": "Mixed Use" };
const statuses: Record<NonNullable<Project["status"]>, string> = { ongoing: "Ongoing", upcoming: "Upcoming", delivered: "Delivered" };
export function ProjectListingClient({ projects }: { projects: Project[] }) {
  const params = useSearchParams(); const router = useRouter(); const pathname = usePathname();
  const type = params.get("type") || "all"; const status = params.get("status") || "all";
  const filtered = projects.filter(p => (type === "all" || p.type === type) && (status === "all" || p.status === status));
  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value === "all") next.delete(key); else next.set(key, value);
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  };
  if (!projects.length) {
    return <Section variant="light" style={{ paddingTop: "clamp(3rem, 6vw, 5rem)" }}><Container>
      <div className="empty-state">
        <h2 className="text-h2" style={{ maxWidth: "18ch", marginBottom: "1.5rem" }}>The collection is not published yet.</h2>
        <p style={{ color: "var(--color-ink-muted)", maxWidth: "44ch", marginBottom: "2.5rem" }}>Projects will be published here once they are released.</p>
        <Link className="action-button" href="/contact">Get in touch</Link>
      </div>
    </Container></Section>;
  }
  return <Section variant="light" style={{ paddingTop: "clamp(3rem, 6vw, 5rem)" }}><Container>
    <div className="project-filters">
      <fieldset><legend>Property type</legend><div className="filter-options">
        <button aria-pressed={type === "all"} onClick={() => set("type", "all")}>All types</button>
        {Object.entries(types).filter(([value]) => projects.some(p => p.type === value)).map(([value, label]) => <button key={value} aria-pressed={type === value} onClick={() => set("type", value)}>{label}</button>)}
      </div></fieldset>
      {projects.some(p => p.status) && <fieldset><legend>Project status</legend><div className="filter-options">
        <button aria-pressed={status === "all"} onClick={() => set("status", "all")}>All statuses</button>
        {Object.entries(statuses).filter(([value]) => projects.some(p => p.status === value)).map(([value, label]) => <button key={value} aria-pressed={status === value} onClick={() => set("status", value)}>{label}</button>)}
      </div></fieldset>}
    </div>
    <p role="status" className="filter-count">{filtered.length} {filtered.length === 1 ? "project" : "projects"}</p>
    {filtered.length ? <div className="detail-grid">{filtered.map((p, i) => <ProjectCard key={p.slug} project={p} delay={i * 0.08} />)}</div> : <div className="empty-state"><h2 className="text-h3">The collection is not published yet.</h2><button className="text-link" onClick={() => router.replace(pathname, { scroll: false })}>Clear filters</button></div>}
  </Container></Section>;
}
