import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Garvit Buildtech",
    short_name: "Garvit Buildtech",
    description: "Garvit Buildtech is a Haridwar-based real estate developer creating residential plot townships and farm house communities in Uttarakhand.",
    start_url: "/",
    scope: "/",
    display: "browser",
    background_color: "#FBF9F5",
    theme_color: "#14110F",
    lang: "en-IN",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
