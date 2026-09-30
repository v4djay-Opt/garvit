"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { ImageAsset } from "@/lib/content/types";
const Lightbox = dynamic(() => import("./Lightbox"), { ssr: false });
export function Gallery({ images, title = "Gallery" }: { images: ImageAsset[]; title?: string }) {
  const [active, setActive] = useState<number | null>(null);
  if (!images.length) return null;
  return <>
    <div className={`gallery-grid ${images.length === 1 ? "gallery-single" : ""}`}>
      {images.map((image, index) => <button type="button" className="gallery-item" key={`${image.src}-${index}`} onClick={event => { event.currentTarget.focus(); setActive(index); }} aria-label={`Open ${image.alt || `${title} image ${index + 1}`} fullscreen`}>
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={images.length === 1 ? "90vw" : "(max-width: 768px) 90vw, 45vw"} />
        <span className="gallery-expand" aria-hidden>View fullscreen ↗</span>
      </button>)}
    </div>
    {active !== null && <Lightbox images={images} initialIndex={active} title={title} onClose={() => setActive(null)} />}
  </>;
}
