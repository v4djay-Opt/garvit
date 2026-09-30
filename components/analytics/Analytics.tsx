"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution, consentCommand, getConsent, saveConsent, setTrackingAllowed, track, type Consent } from "@/lib/analytics/client";

export function Analytics() {
  const pathname = usePathname();
  const [choice, setChoice] = useState<Consent | null>(null);
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState(false);
  const id = process.env.NEXT_PUBLIC_GTM_ID;
  const configured = !!id && /^GTM-[A-Z0-9]+$/.test(id) && !id.includes("XXXX");
  useEffect(() => {
    captureAttribution();
    consentCommand("default", false);
    const saved = getConsent();
    setTrackingAllowed(saved === "accepted");
    if (saved === "accepted") consentCommand("update", true);
    const timer = setTimeout(() => { setChoice(saved); setReady(true); }, 0);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!ready || choice !== "accepted" || !configured || !id) return;
    const win = window as Window & { dataLayer?: unknown[] };
    if (!document.getElementById("garvit-gtm")) {
      win.dataLayer ??= [];
      win.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      const script = document.createElement("script");
      script.id = "garvit-gtm"; script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
      document.head.appendChild(script);
    }
    track("page_view", { page_path: pathname });
    if (/^\/projects\/[^/]+$/.test(pathname)) track("project_view", { project_slug: pathname.split("/")[2] });
  }, [choice, ready, pathname, configured, id]);
  useEffect(() => {
    const click = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (!link) return;
      if (link.href.startsWith("https://wa.me/")) track("whatsapp_click", { page_path: pathname });
      if (link.href.startsWith("tel:")) track("phone_click", { page_path: pathname });
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, [pathname]);
  const choose = (value: Consent) => {
    saveConsent(value); setTrackingAllowed(value === "accepted"); setChoice(value); setSettings(false);
    // Reload after withdrawal so previously loaded vendor scripts stop running.
    if (value === "declined" && document.getElementById("garvit-gtm")) location.reload();
  };
  if (!configured || !ready) return null;
  return <>
    <button className="privacy-settings plain-button" onClick={() => setSettings(true)}>Cookie preferences</button>
    {(choice === null || settings) && <section className="consent-panel" aria-label="Cookie preferences">
      <h2 className="text-h3">Your privacy, your choice.</h2>
      <p>With your permission, we use analytics and advertising cookies to understand visits and measure enquiries. Essential website features work without them. <a href="/privacy-policy">Privacy policy</a></p>
      <div className="action-row">
        <button className="action-button" onClick={() => choose("declined")}>Essential only</button>
        <button className="action-button" onClick={() => choose("accepted")}>Allow analytics & marketing</button>
        {settings && <button className="plain-button" onClick={() => setSettings(false)}>Close</button>}
      </div>
    </section>}
  </>;
}
