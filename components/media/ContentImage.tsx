/**
 * components/media/ContentImage.tsx
 *
 * Image renderer with a charcoal fallback.
 *
 * - Real image files render via next/image
 * - Placeholder paths (or files that fail to load) render a charcoal block
 */

"use client";

import Image from "next/image";
import { useState } from "react";
import type { ImageAsset } from "@/lib/content/types";

interface ContentImageProps {
  image: ImageAsset;
  sizes?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ContentImage({ image, sizes = "(max-width: 768px) 100vw, 50vw", className, style }: ContentImageProps) {
  const [failed, setFailed] = useState(false);

  if (image.src.includes("placeholder") || failed) {
    return (
      <div
        role="img"
        aria-label={image.alt}
        className={className}
        style={{ position: "absolute", inset: 0, background: "var(--color-charcoal)", ...style }}
      />
    );
  }

  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      placeholder={image.blurDataURL ? "blur" : "empty"}
      blurDataURL={image.blurDataURL}
      className={className}
      style={{ objectFit: "cover", ...style }}
      onError={() => setFailed(true)}
    />
  );
}
