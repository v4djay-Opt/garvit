export type Consent = "accepted" | "declined";
type AnalyticsWindow = Window & { dataLayer?: unknown[] };
const KEY = "garvit-consent-v1";
const ATTRIBUTION_KEY = "garvit-attribution-v1";
let memoryAttribution: Record<string, string> | undefined;
export function getConsent(): Consent | null {
  try { const value = localStorage.getItem(KEY); return value === "accepted" || value === "declined" ? value : null; } catch { return null; }
}
export function consentCommand(command: "default" | "update", accepted: boolean) {
  const win = window as AnalyticsWindow;
  win.dataLayer ??= [];
  // gtag uses an Arguments object, not an array, for consent commands.
  // eslint-disable-next-line prefer-rest-params -- Google consent protocol requires an Arguments object.
  function gtag(...args: unknown[]) { void args; win.dataLayer!.push(arguments); }
  const value = accepted ? "granted" : "denied";
  gtag("consent", command, { analytics_storage: value, ad_storage: value, ad_user_data: value, ad_personalization: value });
}
export function saveConsent(value: Consent) {
  try { localStorage.setItem(KEY, value); } catch { /* Storage may be blocked. Current-page consent still applies. */ }
  consentCommand("update", value === "accepted");
}
let consentInMemory = false;
export function setTrackingAllowed(value: boolean) { consentInMemory = value; }
export function track(event: "page_view" | "form_start" | "lead_submit" | "brochure_download" | "whatsapp_click" | "phone_click" | "project_view" | "map_open" | "map_view", data: { form_type?: string; project_slug?: string; page_path?: string } = {}) {
  if (!consentInMemory) return;
  const win = window as AnalyticsWindow;
  win.dataLayer ??= [];
  win.dataLayer.push({ event, ...data }); // Never pass names, email, phone, messages or URL query strings.
}
export function captureAttribution() {
  if (memoryAttribution) return memoryAttribution;
  try { const saved = sessionStorage.getItem(ATTRIBUTION_KEY); if (saved) return memoryAttribution = JSON.parse(saved); } catch { /* private browsing */ }
  const params = new URLSearchParams(location.search);
  const safeUrl = (value: string) => { try { const url = new URL(value); return `${url.origin}${url.pathname}`.slice(0, 500); } catch { return ""; } };
  memoryAttribution = { utmSource: (params.get("utm_source") || "").slice(0, 200), utmMedium: (params.get("utm_medium") || "").slice(0, 200), utmCampaign: (params.get("utm_campaign") || "").slice(0, 200), landingUrl: safeUrl(location.href), referrer: safeUrl(document.referrer) };
  try { sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(memoryAttribution)); } catch { /* memory fallback */ }
  return memoryAttribution;
}
