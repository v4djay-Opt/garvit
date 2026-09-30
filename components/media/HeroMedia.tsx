"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ImageAsset, HeroVideo } from "@/lib/content/types";

export function HeroMedia({ image, video }: { image: ImageAsset; video?: HeroVideo }) {
  const [enabled, setEnabled] = useState(false);
  const autoStartTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!video?.webm && !video?.mp4) return;
    const media = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const update = () => {
      clearTimeout(autoStartTimer.current);
      autoStartTimer.current = setTimeout(() => { setEnabled(media.matches && !connection?.saveData); }, 600);
    };
    media.addEventListener("change", update);
    if (document.readyState === "complete") update();
    else window.addEventListener("load", update, { once: true });
    return () => { clearTimeout(autoStartTimer.current); media.removeEventListener("change", update); window.removeEventListener("load", update); };
  }, [video?.webm, video?.mp4]);

  return (
    <div className="hero-media">
      {!image.src.includes("placeholder") && (
        <Image src={image.src} alt={image.alt} fill
          sizes={`(max-aspect-ratio: ${image.width}/${image.height}) ${Math.ceil(image.width / image.height * 100)}vh, 100vw`}
          loading="eager" fetchPriority="high" style={{ objectFit: "cover" }} />
      )}

      {enabled && video && (
        <video
          aria-hidden="true"
          muted
          autoPlay
          loop
          playsInline
          preload="none"
          poster={video.poster}
          onError={() => setEnabled(false)}
        >
          {video.webm && <source src={video.webm} type="video/webm" />}
          {video.mp4 && <source src={video.mp4} type="video/mp4" />}
        </video>
      )}
    </div>
  );
}
