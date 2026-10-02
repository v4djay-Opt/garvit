"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import type { ImageAsset } from "@/lib/content/types";

const Lightbox = dynamic(() => import("./Lightbox"), { ssr: false });

export function Gallery({ images, title = "Gallery" }: { images: ImageAsset[]; title?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  const step = useCallback(() => {
    const track = trackRef.current;
    const slide = track?.querySelector<HTMLElement>(".gallery-slide");
    if (!track || !slide) return 0;
    return slide.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0");
  }, []);

  if (!images.length) return null;

  const go = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: dir * step(), behavior: reduced ? "auto" : "smooth" });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    const fraction = max > 0 ? track.scrollLeft / max : 1;
    setIndex(Math.min(images.length - 1, Math.round(fraction * (images.length - 1))));
    setAtEnd(track.scrollLeft >= max - 8);
  };

  const atStart = index === 0;

  return (
    <div className="gallery-slider">
      <div className="gallery-track" ref={trackRef} onScroll={onScroll} role="group" aria-label={title} tabIndex={0}>
        {images.map((image, i) => (
          <button
            type="button"
            className="gallery-item gallery-slide"
            key={`${image.src}-${i}`}
            tabIndex={-1}
            onClick={event => {
              event.currentTarget.focus();
              setActive(i);
            }}
            aria-label={`Open ${image.alt || `${title} image ${i + 1}`} fullscreen`}
          >
            <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 768px) 78vw, 34vw" />
            <span className="gallery-expand" aria-hidden>
              View fullscreen ↗
            </span>
          </button>
        ))}
      </div>

      {images.length > 1 && (
        <div className="gallery-controls">
          <span className="gallery-counter" aria-hidden>
            {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </span>
          <div className="gallery-progress" aria-hidden>
            <span style={{ transform: `scaleX(${(index + 1) / images.length})` }} />
          </div>
          <div className="gallery-arrows">
            <button type="button" onClick={() => go(-1)} disabled={atStart} aria-label="Previous image">
              ← Prev
            </button>
            <button type="button" onClick={() => go(1)} disabled={atEnd} aria-label="Next image">
              Next →
            </button>
          </div>
        </div>
      )}

      {active !== null && <Lightbox images={images} initialIndex={active} title={title} onClose={() => setActive(null)} />}
    </div>
  );
}
