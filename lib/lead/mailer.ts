import nodemailer from "nodemailer";
import { mkdir, open } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { LeadPayload } from "./schema";

export type LeadReceipt = { id: string; receivedAt: string; consentAt: string; userAgent: string };
export type DeliveryResult = { accepted: true; delivery: "delivered" | "queued" } | { accepted: false };
export interface LeadSink { send(lead: LeadPayload, receipt: LeadReceipt): Promise<DeliveryResult> }
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
}
export function formatLead(lead: LeadPayload, receipt: LeadReceipt) {
  return Object.entries({ ...lead, website: undefined, ...receipt })
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([label, value]) => `${label}: ${String(value)}`).join("\n");
}
/** fsync before acknowledgement; one private file per failed delivery, no PII in console. */
export async function saveFailedLead(lead: LeadPayload, receipt: LeadReceipt, directory = process.env.LEAD_FAILURE_DIR || path.join(process.cwd(), "var", "lead-outbox")) {
  if (!/^[a-zA-Z0-9-]+$/.test(receipt.id)) throw new Error("Invalid receipt identifier");
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const file = await open(path.join(directory, `${receipt.id}.json`), "wx", 0o600);
  try { await file.writeFile(JSON.stringify({ lead: { ...lead, website: undefined }, receipt })); await file.sync(); }
  finally { await file.close(); }
}
export class EmailSink implements LeadSink {
  async send(lead: LeadPayload, receipt: LeadReceipt): Promise<DeliveryResult> {
    try {
      const { SMTP_HOST, SMTP_USER, SMTP_PASS, LEAD_TO_EMAIL } = process.env;
      if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !LEAD_TO_EMAIL) throw new Error("SMTP unavailable");
      const transport = nodemailer.createTransport({
        host: SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_SECURE === "true",
        requireTLS: process.env.SMTP_SECURE !== "true", auth: { user: SMTP_USER, pass: SMTP_PASS },
        connectionTimeout: 8_000, greetingTimeout: 8_000, socketTimeout: 12_000,
      });
      const text = formatLead(lead, receipt);
      const result = await transport.sendMail({ from: process.env.LEAD_FROM_EMAIL || `Garvit Buildtech <${SMTP_USER}>`, to: LEAD_TO_EMAIL,
        subject: `[Garvit enquiry] ${lead.formType} — ${receipt.id}`, text,
        html: `<pre style="white-space:pre-wrap;font-family:sans-serif">${escapeHtml(text)}</pre>`, replyTo: lead.email || undefined,
      });
      if (!result.accepted?.length) throw new Error("Recipient not accepted");
      return { accepted: true, delivery: "delivered" };
    } catch {
      try {
        await saveFailedLead(lead, receipt);
        console.error("Lead email unavailable; request saved for recovery", receipt.id);
        return { accepted: true, delivery: "queued" };
      } catch {
        console.error("Lead delivery and recovery storage unavailable", receipt.id);
        return { accepted: false };
      }
    }
  }
}
export async function sendLead(lead: LeadPayload, userAgent: string): Promise<DeliveryResult> {
  const now = new Date().toISOString();
  return new EmailSink().send(lead, { id: randomUUID(), receivedAt: now, consentAt: now, userAgent });
}
