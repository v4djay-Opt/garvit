import { z } from "zod";

export const LeadFormTypeSchema = z.enum(["enquiry", "site-visit", "callback", "brochure"]);
export type LeadFormType = z.infer<typeof LeadFormTypeSchema>;
export const TIME_OPTIONS = ["Morning (9am – 12pm)", "Afternoon (12pm – 4pm)", "Evening (4pm – 7pm)"] as const;
export function normalizePhone(input: string): string {
  const cleaned = input.replace(/[\s().-]/g, "");
  if (/^[6-9]\d{9}$/.test(cleaned)) return `+91${cleaned}`;
  if (/^91[6-9]\d{9}$/.test(cleaned)) return `+${cleaned}`;
  return cleaned;
}
const optionalText = (max: number) => z.string().trim().max(max).optional().default("");
export const StoredLeadSchema = z.object({
  formType: LeadFormTypeSchema,
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  phone: z.string().trim().max(25).transform(normalizePhone).refine(value => /^\+[1-9]\d{7,14}$/.test(value), "Enter a valid number including country code"),
  email: z.union([z.literal(""), z.string().trim().toLowerCase().email().max(254)]).optional().default(""),
  project: optionalText(200),
  projectSlug: optionalText(120),
  message: optionalText(1000),
  preferredDate: optionalText(10),
  preferredTime: optionalText(50),
  consent: z.literal(true, { message: "Please accept to continue" }),
  website: optionalText(200),
  startedAt: z.number().finite().positive(),
  utmSource: optionalText(200), utmMedium: optionalText(200), utmCampaign: optionalText(200),
  landingUrl: optionalText(500), referrer: optionalText(500),
});
export const LeadSchema = StoredLeadSchema.superRefine((lead, ctx) => {
  if (lead.formType === "site-visit") {
    const date = lead.preferredDate;
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date || date < today)
      ctx.addIssue({ code: "custom", path: ["preferredDate"], message: "Choose today or a future visit date" });
  }
  if ((lead.formType === "callback" || lead.formType === "site-visit") && !TIME_OPTIONS.some(time => time === lead.preferredTime))
    ctx.addIssue({ code: "custom", path: ["preferredTime"], message: "Choose a preferred time" });
  if (lead.formType === "brochure" && !lead.projectSlug)
    ctx.addIssue({ code: "custom", path: ["projectSlug"], message: "Select a project for the brochure" });
});
export type LeadPayload = z.infer<typeof LeadSchema>;
