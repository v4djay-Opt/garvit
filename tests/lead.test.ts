import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, stat, readdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { LeadSchema } from "../lib/lead/schema";
import { createRateLimiter } from "../lib/lead/rate-limit";
import { createLeadHandler } from "../lib/lead/handler";
import { escapeHtml, saveFailedLead } from "../lib/lead/mailer";
import { validateAssets } from "../lib/content/validation";
const valid = { formType: "enquiry", name: " Test Person ", phone: "98765 43210", consent: true, startedAt: Date.now() - 5000 };
const request = (body: unknown, headers: Record<string, string> = {}) => new Request("https://test.local/api/lead", { method: "POST", headers: { origin: "https://test.local", "content-type": "application/json", ...headers }, body: JSON.stringify(body) });
const defaults = { limit: () => 0, send: async () => ({ accepted: true, delivery: "delivered" } as const), project: async () => ({ name: "Test fixture", cta: { brochure: true }, brochure: { file: "/brochures/test.pdf" } }) };
test("normalizes India phone and trims name", () => { const result = LeadSchema.parse(valid); assert.equal(result.phone, "+919876543210"); assert.equal(result.name, "Test Person"); });
test("rejects malformed phone, whitespace name and absent consent", () => { for (const patch of [{ phone: "-------" }, { name: "  " }, { consent: false }]) assert.equal(LeadSchema.safeParse({ ...valid, ...patch }).success, false); });
for (const formType of ["enquiry", "callback", "site-visit", "brochure"]) test(`accepts validated ${formType} intent`, async () => {
  const response = await createLeadHandler(defaults)(request({ ...valid, formType, preferredDate: "2099-12-10", preferredTime: "Morning (9am – 12pm)", projectSlug: "fixture" }));
  assert.equal(response.status, 200);
  const result = await response.json(); assert.equal(result.success, true); if (formType === "brochure") assert.equal(result.brochureUrl, "/brochures/test.pdf");
});
test("visit rejects invalid/past dates and missing time", () => { for (const preferredDate of ["2000-01-01", "2099-02-31", "", "malformed"]) assert.equal(LeadSchema.safeParse({ ...valid, formType: "site-visit", preferredDate }).success, false); });
test("enforces same-origin before sending", async () => { assert.equal((await createLeadHandler(defaults)(request(valid, { origin: "https://other.local" }))).status, 403); });
test("honeypot never reaches delivery", async () => { let calls = 0; const handler = createLeadHandler({ ...defaults, send: async () => { calls++; return { accepted: false }; } }); assert.equal((await handler(request({ ...valid, website: "spam" }))).status, 200); assert.equal(calls, 0); });
test("timing trap blocks instant submissions", async () => { assert.equal((await createLeadHandler(defaults)(request({ ...valid, startedAt: Date.now() }))).status, 422); });
test("oversized body is rejected", async () => { assert.equal((await createLeadHandler(defaults)(request({ ...valid, message: "x".repeat(17_000) }))).status, 413); });
test("rate limited requests expose retry time", async () => { const response = await createLeadHandler({ ...defaults, limit: () => 60 })(request(valid)); assert.equal(response.status, 429); assert.equal(response.headers.get("retry-after"), "60"); });
test("sliding windows limit bursts and recover", () => { const limit = createRateLimiter(); assert.equal(limit("one", 1), 0); assert.equal(limit("one", 2), 0); assert.equal(limit("one", 3), 0); assert.ok(limit("one", 4) > 0); assert.equal(limit("two", 4), 0); assert.equal(limit("one", 600_004), 0); });
test("hourly window is enforced across short windows", () => { const limit = createRateLimiter(); for (let i = 0; i < 10; i++) assert.equal(limit("ip", 1 + i * 220_000), 0); assert.ok(limit("ip", 2_200_001) > 0); });
test("returns failure when neither email nor recovery is available", async () => { const response = await createLeadHandler({ ...defaults, send: async () => ({ accepted: false }) })(request(valid)); assert.equal(response.status, 503); assert.equal((await response.json()).success, false); });
test("safely queued request is acknowledged", async () => { const response = await createLeadHandler({ ...defaults, send: async () => ({ accepted: true, delivery: "queued" }) })(request(valid)); assert.equal(response.status, 202); });
test("rejects unknown projects and missing brochures", async () => {
  const body = { ...valid, formType: "brochure", projectSlug: "missing" };
  assert.equal((await createLeadHandler({ ...defaults, project: async () => null })(request(body))).status, 422);
  assert.equal((await createLeadHandler({ ...defaults, project: async () => ({ name: "Test" }) })(request(body))).status, 422);
});
test("email HTML escapes submitted markup", () => assert.equal(escapeHtml('<img src="x">&'), "&lt;img src=&quot;x&quot;&gt;&amp;"));
test("recovery files are private and durable", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "garvit-lead-test-"));
  await saveFailedLead(LeadSchema.parse(valid), { id: "test-receipt", receivedAt: "test", consentAt: "test", userAgent: "test" }, dir);
  const files = await readdir(dir); assert.equal(files.length, 1);
  assert.equal((await stat(path.join(dir, files[0]))).mode & 0o777, 0o600);
  assert.equal(JSON.parse(await readFile(path.join(dir, files[0]), "utf8")).lead.name, "Test Person");
});
test("release guard rejects placeholders, missing assets and traversal", () => {
  assert.ok(validateAssets({ name: "PLACEHOLDER", src: "/missing.webp" }, process.cwd(), true).length >= 2);
  assert.ok(validateAssets({ src: "/../secret" }, process.cwd(), false).length);
  assert.equal(validateAssets({ src: "/images/placeholder.jpg" }, process.cwd(), false).length, 0);
});
test("rejects a missing origin and unsupported content type", async () => {
  const noOrigin = new Request("https://test.local/api/lead", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(valid) });
  assert.equal((await createLeadHandler(defaults)(noOrigin)).status, 403);
  assert.equal((await createLeadHandler(defaults)(request(valid, { "content-type": "text/plain" }))).status, 415);
});
test("malformed JSON is rejected without delivery", async () => {
  const req = new Request("https://test.local/api/lead", { method: "POST", headers: { origin: "https://test.local", "content-type": "application/json" }, body: "{" });
  assert.equal((await createLeadHandler(defaults)(req)).status, 400);
});
