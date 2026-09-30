import { ImageResponse } from "next/og";
import { getSite } from "@/lib/content/repository";
export const dynamic = "force-static";
export const alt = "Garvit Buildtech";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function OpenGraphImage() {
  const site = await getSite();
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 90, background: "#14110f", color: "#f5f1e8" }}>
    <div style={{ width: 90, height: 3, background: "#c8a96a", marginBottom: 40 }} />
    <div style={{ fontSize: 80 }}>{site.brand.name}</div>
    <div style={{ fontSize: 25, marginTop: 35, letterSpacing: 5 }}>HARIDWAR · UTTARAKHAND</div>
  </div>, size);
}
