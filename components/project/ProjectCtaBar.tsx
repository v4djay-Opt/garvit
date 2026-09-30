"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import type { ProjectCta } from "@/lib/content/types";
import type { LeadFormType } from "@/lib/lead/schema";
const EnquiryForm = dynamic(() => import("@/components/forms/EnquiryForm").then(module => module.EnquiryForm), { ssr: false, loading: () => <p role="status">Loading form…</p> });
const labels: Record<LeadFormType, string> = { enquiry: "Enquire now", "site-visit": "Schedule a site visit", callback: "Request a callback", brochure: "Download brochure" };
export function ProjectCtaBar({ projectName, projectSlug, cta, brochureFile, whatsappNumber }: {
  projectName: string; projectSlug: string; cta: ProjectCta; brochureFile?: string; whatsappNumber?: string; email?: string;
}) {
  const [active, setActive] = useState<LeadFormType | null>(null);
  const number = whatsappNumber?.replace(/\D/g, "") || "";
  const whatsapp = /^\d{8,15}$/.test(number) ? `https://wa.me/${number}?text=${encodeURIComponent(`Hi, I'm interested in ${projectName}.`)}` : null;
  const available: LeadFormType[] = [];
  if (cta.enquire) available.push("enquiry");
  if (cta.siteVisit) available.push("site-visit");
  if (cta.callback) available.push("callback");
  if (cta.brochure && brochureFile) available.push("brochure");
  const actions = available;
  if (!actions.length && !(cta.whatsapp && whatsapp)) return null;
  return <>
    <section id="enquire" className="project-enquiry" aria-label="Project enquiries">
      <div className="content-width"><p className="text-eyebrow">Your next step</p><h2 className="text-h2">Let’s talk about {projectName}.</h2>
        <div className="action-row">{actions.map(type => <button className="action-button" key={type} onClick={event => { event.currentTarget.focus(); setActive(type); }} aria-haspopup="dialog">{labels[type]}</button>)}
          {cta.whatsapp && whatsapp && <a className="action-button" href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
        </div>
      </div>
    </section>
    <div className="mobile-project-actions" aria-label="Quick project enquiry">
      <a href="#enquire" className="action-button">Enquire</a>
      {cta.whatsapp && whatsapp && <a className="action-button" href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
    </div>
    <Dialog open={active !== null} onClose={() => setActive(null)} title={active ? labels[active] : "Enquiry"}>
      {active && <EnquiryForm key={active} formType={active} projectName={projectName} projectSlug={projectSlug} />}
    </Dialog>
  </>;
}
