import { LeadSchema, type LeadPayload } from "./schema";
import type { DeliveryResult } from "./mailer";

type Dependencies = {
  limit: (ip: string) => number;
  send: (lead: LeadPayload, userAgent: string) => Promise<DeliveryResult>;
  project: (slug: string) => Promise<{ name: string; brochure?: { file: string }; cta?: { brochure: boolean } } | null>;
};
const json = (body: object, status = 200, headers: Record<string, string> = {}) => Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
export function createLeadHandler(deps: Dependencies) {
  return async (req: Request) => {
    const expectedOrigin = process.env.NEXT_PUBLIC_CANONICAL_BASE ? new URL(process.env.NEXT_PUBLIC_CANONICAL_BASE).origin : new URL(req.url).origin;
    if (req.headers.get("origin") !== expectedOrigin || req.headers.get("sec-fetch-site") === "cross-site") return json({ success: false, error: "Please submit from our website." }, 403);
    if (!req.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return json({ success: false, error: "Unsupported request." }, 415);
    // Only use proxy identity when deployment explicitly enables trusted proxy mode.
    const ip = process.env.TRUST_PROXY === "true" ? req.headers.get("x-real-ip") || "unknown" : "local";
    const retry = deps.limit(ip);
    if (retry) return json({ success: false, error: "Too many requests. Please try again later." }, 429, { "Retry-After": String(retry) });
    let body: unknown;
    try {
      const reader = req.body?.getReader();
      if (!reader) return json({ success: false, error: "Invalid request." }, 400);
      let length = 0; const chunks: Uint8Array[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        length += value.byteLength;
        if (length > 16_384) { await reader.cancel(); return json({ success: false, error: "Request too large." }, 413); }
        chunks.push(value);
      }
      const bytes = new Uint8Array(length); let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
      body = JSON.parse(new TextDecoder().decode(bytes));
    } catch { return json({ success: false, error: "Invalid request." }, 400); }
    if (body && typeof body === "object" && "website" in body && body.website) return json({ success: true });
    const parsed = LeadSchema.safeParse(body);
    if (!parsed.success) return json({ success: false, error: parsed.error.issues[0].message, field: parsed.error.issues[0].path[0] }, 422);
    const lead = parsed.data;
    if (Date.now() - lead.startedAt < 2_000 || Date.now() - lead.startedAt > 86_400_000) return json({ success: false, error: "Please take a moment, then submit again. If this page has been open a long time, refresh it." }, 422);
    let brochureUrl: string | undefined;
    if (lead.projectSlug) {
      const project = await deps.project(lead.projectSlug);
      if (!project) return json({ success: false, error: "This project is no longer available." }, 422);
      lead.project = project.name;
      if (lead.formType === "brochure") {
        if (!project.cta?.brochure || !project.brochure?.file) return json({ success: false, error: "The brochure is not available yet." }, 422);
        brochureUrl = project.brochure.file;
      }
    }
    let result: DeliveryResult;
    try { result = await deps.send(lead, (req.headers.get("user-agent") || "").slice(0, 500)); }
    catch { result = { accepted: false }; }
    if (!result.accepted) return json({ success: false, error: "We could not save your request. Please try again or contact us directly." }, 503);
    return json({ success: true, delivery: result.delivery, brochureUrl }, result.delivery === "queued" ? 202 : 200);
  };
}
