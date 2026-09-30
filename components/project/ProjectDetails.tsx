import Image from "next/image";
import { Gallery } from "@/components/media/Gallery";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import type { Project } from "@/lib/content/types";
import type { ReactNode } from "react";
function Block({ title, id, children }: { title: string; id: string; children: ReactNode }) {
  return <Section variant="light" id={id}><Container><h2 className="text-h2 section-heading">{title}</h2>{children}</Container></Section>;
}
export function ProjectDetails({ project }: { project: Project }) {
  return <>
    {project.architecture && <Block title={project.architecture.heading} id="architecture">
      <div className="prose-editorial detail-copy">{project.architecture.body.map((text, index) => <p key={index}>{text}</p>)}</div>
      <Gallery images={project.architecture.images} title="Architecture" />
    </Block>}
    {project.masterPlan && <Block title="The master plan" id="master-plan"><Gallery images={[project.masterPlan]} title="Master plan" /></Block>}
    {!!project.floorPlans?.length && <Block title="Spaces to make your own" id="floor-plans"><div className="detail-grid">
      {project.floorPlans.map((plan, index) => <article key={index}><h3 className="text-h3">{plan.label}</h3><p className="detail-copy">{[plan.unitType, plan.area].filter(Boolean).join(" · ")}</p>
        <Gallery images={[plan.image]} title={plan.label} />{plan.pdf && <a className="text-link" href={plan.pdf} download>Download {plan.label} PDF</a>}
      </article>)}
    </div></Block>}
    {!!project.amenities?.length && <Block title="Considered in every detail" id="amenities"><div className="detail-grid">
      {project.amenities.map((amenity, index) => <article key={index} className="amenity-item">
        {amenity.image && <Image src={amenity.image.src} alt={amenity.image.alt} width={amenity.image.width} height={amenity.image.height} sizes="(max-width: 768px) 90vw, 45vw" className="detail-image" />}
        <h3 className="text-h3">{amenity.title}</h3>{amenity.description && <p>{amenity.description}</p>}
      </article>)}
    </div></Block>}
    {!!project.media.gallery?.length && <Block title="A closer look" id="gallery"><Gallery images={project.media.gallery} /></Block>}
  </>;
}
export function ProjectSpecifications({ project }: { project: Project }) {
  if (!project.specifications?.length) return null;
  return <Block title="Specifications" id="specifications"><div className="detail-grid">{project.specifications.map((group, index) => <div key={index}>
    <h3 className="text-h3">{group.group}</h3><dl className="specifications">{group.items.map((item, i) => <div key={i}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
  </div>)}</div></Block>;
}
