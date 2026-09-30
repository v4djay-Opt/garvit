"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import type { ImageAsset } from "@/lib/content/types";

export default function Lightbox({ images, initialIndex, title, onClose }: {
  images: ImageAsset[]; initialIndex: number; title: string; onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const viewport = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = viewport.current;
    const wheel = (event: WheelEvent) => { event.preventDefault(); setZoom(value => Math.max(1, Math.min(4, value - event.deltaY * 0.005))); };
    el?.addEventListener("wheel", wheel, { passive: false });
    return () => el?.removeEventListener("wheel", wheel);
  }, []);
  const touch = useRef({ x: 0, y: 0, distance: 0, zoom: 1 });
  const image = images[index];
  const change = (delta: number) => { setIndex((index + delta + images.length) % images.length); setZoom(1); };
  const scale = (value: number) => setZoom(Math.max(1, Math.min(4, value)));
  return <Dialog open onClose={onClose} title={title} className="lightbox-dialog" onKeyDown={(e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); change(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); change(-1); }
      if (e.key === "+" || e.key === "=") scale(zoom + 0.5);
      if (e.key === "-") scale(zoom - 0.5);
    }}>
    <div>
      <div className="lightbox-tools">
        <button className="plain-button" onClick={() => change(-1)} disabled={images.length < 2}>Previous</button>
        <span aria-live="polite">{index + 1} / {images.length}</span>
        <button className="plain-button" onClick={() => change(1)} disabled={images.length < 2}>Next</button>
        <button className="plain-button" onClick={() => scale(zoom - 0.5)} disabled={zoom === 1} aria-label="Zoom out">−</button>
        <button className="plain-button" onClick={() => scale(zoom + 0.5)} disabled={zoom === 4} aria-label="Zoom in">+</button>
        <button className="plain-button" onClick={() => setZoom(1)}>Reset zoom</button>
      </div>
      <div ref={viewport} className="lightbox-viewport" tabIndex={0} aria-label="Image viewer. Use arrow keys to browse and plus or minus to zoom."
        onTouchStart={e => {
          const a = e.touches[0]; const b = e.touches[1];
          touch.current = { x: a.clientX, y: a.clientY, distance: b ? Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) : 0, zoom };
        }}
        onTouchMove={e => {
          const a = e.touches[0]; const b = e.touches[1];
          if (b && touch.current.distance) scale(touch.current.zoom * Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) / touch.current.distance);
        }}
        onTouchEnd={e => {
          if (touch.current.distance || zoom !== 1) return;
          const dx = e.changedTouches[0].clientX - touch.current.x;
          const dy = e.changedTouches[0].clientY - touch.current.y;
          if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) change(dx < 0 ? 1 : -1);
        }}>
        <div style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%`, position: "relative", minHeight: "100%" }}>
          <Image key={image.src} src={image.src} alt={image.alt} fill sizes="100vw" style={{ objectFit: "contain" }} />
        </div>
      </div>
      <p className="lightbox-caption" aria-live="polite">{image.alt}</p>
    </div>
  </Dialog>;
}
