"use client";
import { useEffect, useId, useRef, useState } from "react";
import { Field } from "./Field";
import type { LeadFormType } from "@/lib/lead/schema";
import { captureAttribution, track } from "@/lib/analytics/client";
const times = ["Morning (9am – 12pm)", "Afternoon (12pm – 4pm)", "Evening (4pm – 7pm)"];
type Fields = { name: string; phone: string; email: string; message: string; preferredDate: string; preferredTime: string; website: string; consent: boolean };
export function EnquiryForm({ formType = "enquiry", projectName = "", projectSlug = "", projects = [], onSuccess, theme = "light" }: {
  formType?: LeadFormType; projectName?: string; projectSlug?: string; projects?: { slug: string; name: string }[]; onSuccess?: () => void; theme?: "light" | "dark";
}) {
  const id = useId();
  const started = useRef(0); const submitted = useRef(false); const tracked = useRef(false);
  const formRef = useRef<HTMLFormElement>(null); const successRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(projectSlug);
  const [fields, setFields] = useState<Fields>({ name: "", phone: "", email: "", message: "", preferredDate: "", preferredTime: "", website: "", consent: false });
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [download, setDownload] = useState("");
  useEffect(() => { started.current = Date.now(); }, []);
  useEffect(() => { if (status === "success") successRef.current?.focus(); }, [status]);
  const set = (key: keyof Fields) => (value: string | boolean) => setFields(prev => ({ ...prev, [key]: value }));
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (submitted.current) return;
    const next: typeof errors = {};
    if (fields.name.trim().length < 2) next.name = "Please enter your full name";
    if (!/^[+\d\s().-]{7,25}$/.test(fields.phone)) next.phone = "Please enter a valid phone number";
    if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) next.email = "Please enter a valid email";
    if (formType === "site-visit" && !fields.preferredDate) next.preferredDate = "Choose your visit date";
    if ((formType === "site-visit" || formType === "callback") && !fields.preferredTime) next.preferredTime = "Choose a time";
    if (!fields.consent) next.consent = "Please give your consent to continue";
    setErrors(next);
    if (Object.keys(next).length) { setTimeout(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 0); return; }
    submitted.current = true; setStatus("loading"); setError("");
    try {
      const response = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...fields, formType, project: projectName, projectSlug: selected, startedAt: started.current, ...captureAttribution() }) });
      const result = await response.json() as { success: boolean; error?: string; field?: keyof Fields; brochureUrl?: string };
      if (!response.ok || !result.success) {
        setStatus("error"); setError(result.error || "Please try again.");
        if (result.field) setErrors({ [result.field]: result.error });
        return;
      }
      if (result.brochureUrl) setDownload(result.brochureUrl);
      track("lead_submit", { form_type: formType, project_slug: selected });
      setStatus("success"); onSuccess?.();
    } catch { setStatus("error"); setError("We could not confirm your request. Please try again or contact us directly."); }
    finally { submitted.current = false; }
  }
  if (status === "success") return <div ref={successRef} tabIndex={-1} role="status" className="form-success">
    <h3 className="text-h3">Thank you. Your request is saved.</h3>
    <p>Our team will be in touch using the details you provided.</p>
    {download && <a className="action-button" href={download} download onClick={() => track("brochure_download", { project_slug: selected })}>Download brochure</a>}
  </div>;
  return <form ref={formRef} onSubmit={submit} noValidate className="enquiry-form" data-theme={theme} aria-busy={status === "loading"}
    onFocus={() => { if (!tracked.current) { track("form_start", { form_type: formType, project_slug: selected }); tracked.current = true; } }}>
    <div hidden aria-hidden="true"><label htmlFor={`${id}-website`}>Leave empty</label><input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" value={fields.website} onChange={e => set("website")(e.target.value)} /></div>
    <div className="form-fields">
      <Field id={`${id}-name`} label="Full name" value={fields.name} onChange={set("name")} error={errors.name} required autoComplete="name" />
      <Field id={`${id}-phone`} label="Phone number" type="tel" value={fields.phone} onChange={set("phone")} error={errors.phone} hint="For international numbers, include the country code." required autoComplete="tel" />
      <Field id={`${id}-email`} label="Email (optional)" type="email" value={fields.email} onChange={set("email")} error={errors.email} autoComplete="email" />
      {!projectSlug && projects.length > 0 && <Field id={`${id}-project`} label="Project (optional)" type="select" value={selected} onChange={setSelected}><option value="">General enquiry</option>{projects.map(p => <option key={p.slug} value={p.slug}>{p.name}</option>)}</Field>}
      {projectName && <p className="form-project">Regarding: {projectName}</p>}
      {formType === "enquiry" && <Field id={`${id}-message`} label="What are you looking for? (optional)" type="textarea" value={fields.message} onChange={set("message")} error={errors.message} />}
      {formType === "site-visit" && <Field id={`${id}-date`} label="Preferred visit date" type="date" value={fields.preferredDate} onChange={set("preferredDate")} error={errors.preferredDate} required />}
      {(formType === "callback" || formType === "site-visit") && <Field id={`${id}-time`} label="Preferred time" type="select" value={fields.preferredTime} onChange={set("preferredTime")} error={errors.preferredTime} required><option value="">Select a time</option>{times.map(time => <option key={time}>{time}</option>)}</Field>}
    </div>
    <label className="consent-label"><input type="checkbox" required checked={fields.consent} onChange={e => set("consent")(e.target.checked)} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? `${id}-consent-error` : undefined} />
      <span>I agree to be contacted about this request. <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy policy (opens in a new tab)</a></span></label>
    {errors.consent && <p id={`${id}-consent-error`} role="alert" className="field-error">{errors.consent}</p>}
    {error && <p role="alert" className="field-error">{error}</p>}
    <button type="submit" className="action-button" disabled={status === "loading"}>{status === "loading" ? "Sending…" : ({ enquiry: "Send enquiry", "site-visit": "Request site visit", callback: "Request callback", brochure: "Request brochure" })[formType]}</button>
  </form>;
}
