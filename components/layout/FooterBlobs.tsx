"use client";

import { useEffect, useRef, type MouseEvent } from "react";

/** Click/tap moves the outer frame; the inner shape keeps drifting. */
export function FooterBlobs() {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = layer.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      element.querySelectorAll<HTMLElement>(".footer-blob-handle").forEach(blob => {
        blob.style.translate = "0px 0px";
        blob.dataset.x = "0";
        blob.dataset.y = "0";
      });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function shift(event: MouseEvent<HTMLDivElement>) {
    if (!layer.current) return;
    const element = event.currentTarget;
    const container = layer.current;
    // Layout offsets stay stable during an in-progress transition or rapid taps.
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const minX = -width * .15 - element.offsetLeft;
    const maxX = container.clientWidth - width * .85 - element.offsetLeft;
    const minY = -height * .15 - element.offsetTop;
    const maxY = container.clientHeight - height * .85 - element.offsetTop;
    const oldX = Number(element.dataset.x || 0);
    const oldY = Number(element.dataset.y || 0);
    const minimumDistance = Math.min(110, container.clientWidth * .25);
    let x = oldX;
    let y = oldY;
    for (let attempt = 0; attempt < 12; attempt++) {
      x = minX + Math.random() * (maxX - minX);
      y = minY + Math.random() * (maxY - minY);
      if (Math.hypot(x - oldX, y - oldY) >= minimumDistance) break;
    }
    element.style.translate = `${x}px ${y}px`;
    element.dataset.x = String(x);
    element.dataset.y = String(y);
  }

  return <div ref={layer} className="footer-atmosphere" aria-hidden="true">
    {[0, 1, 2].map(index => <div key={index} className="footer-blob-handle" onClick={shift}>
      <span className="footer-blob" />
    </div>)}
  </div>;
}
