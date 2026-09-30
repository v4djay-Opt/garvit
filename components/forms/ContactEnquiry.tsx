"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useId } from "react";
import { EnquiryForm } from "./EnquiryForm";
import { Field } from "./Field";

export function ContactEnquiry({ projects }: { projects: { slug: string; name: string }[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const id = useId();
  const intent = params.get("intent");
  const formType = intent === "site-visit" || intent === "callback" ? intent : "enquiry";

  return <>
    <div style={{ marginBottom: "2rem" }}>
      <Field id={`${id}-intent`} type="select" label="How can we help?" value={formType} onChange={value => {
        const next = new URLSearchParams(params.toString());
        if (value === "enquiry") next.delete("intent");
        else next.set("intent", value);
        router.replace(`${pathname}${next.size ? `?${next}` : ""}#enquiry`, { scroll: false });
      }}>
        <option value="enquiry">General enquiry</option>
        <option value="site-visit">Schedule a site visit</option>
        <option value="callback">Request a callback</option>
      </Field>
    </div>
    <EnquiryForm key={formType} formType={formType} projects={projects} />
  </>;
}
