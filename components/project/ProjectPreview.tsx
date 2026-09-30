import { ProjectDetails, ProjectSpecifications } from "./ProjectDetails";
import { ProjectCtaBar } from "./ProjectCtaBar";
import { ProjectLocation } from "./ProjectLocation";
import type { Project } from "@/lib/content/types";
const image = { src: "/preview/layout.svg", alt: "Component preview diagram, not a project plan", width: 1200, height: 800 };
const preview: Project = {
  slug: "component-preview", name: "Component preview", type: "plot", status: "upcoming", visible: false, featured: false, order: 0,
  shortDescription: "Interface demonstration only. No project facts or offers.", location: { label: "Preview", city: "Preview", state: "Preview" },
  media: { heroImage: image, gallery: [image, { ...image, alt: "Second component preview diagram" }] },
  masterPlan: image, floorPlans: [{ label: "Example layout", area: "Area supplied with project data", image }],
  architecture: { heading: "Architecture section preview", body: ["Approved project narrative will appear here."], images: [image] },
  amenities: [{ title: "Amenity preview", description: "Approved amenity description will appear here." }],
  specifications: [{ group: "Specification preview", items: [{ label: "Detail", value: "Supplied with project data" }] }],
  cta: { enquire: true, siteVisit: true, callback: true, brochure: true, whatsapp: false }, brochure: { file: "/preview/layout.svg" },
};
export function ProjectPreview() {
  return <div aria-label="Project component preview"><div className="content-width"><h2 className="text-h2">Project components</h2><p>Interface examples only. These are not real project plans, facilities or specifications.</p></div>
    <ProjectDetails project={preview} /><ProjectSpecifications project={preview} />
    <ProjectLocation projectName="Map preview" locationDetail={{ address: "Map interaction preview", mapEmbedQuery: "Haridwar" }} />
    <ProjectCtaBar projectName={preview.name} projectSlug={preview.slug} cta={preview.cta!} brochureFile={preview.brochure!.file} />
  </div>;
}
