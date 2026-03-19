"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { ArtworkItem } from "@/lib/data";
import { useFocusTrap } from "@/lib/accessibility";

interface LightboxProps {
  artwork: ArtworkItem;
  onClose: () => void;
}

export default function Lightbox({ artwork, onClose }: LightboxProps) {
  const containerRef = useFocusTrap(true);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    // Announce to screen readers
    const announcement = `Viewing image: ${artwork.title}. ${artwork.style} style portrait of ${artwork.animal}. Press Escape to close.`;
    const ariaLive = document.createElement('div');
    ariaLive.setAttribute('role', 'status');
    ariaLive.setAttribute('aria-live', 'polite');
    ariaLive.className = 'sr-only';
    ariaLive.textContent = announcement;
    document.body.appendChild(ariaLive);

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
      document.body.removeChild(ariaLive);
    };
  }, [onClose, artwork]);

  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className="lightbox-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      aria-describedby="lightbox-description"
    >
      <button
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-black rounded-sm p-2"
        onClick={onClose}
        aria-label={`Close lightbox showing ${artwork.title}`}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div
        className="relative max-w-3xl max-h-[85vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-2xl overflow-hidden">
          <Image
            src={artwork.imageUrl}
            alt={`${artwork.style} style portrait of ${artwork.animal} titled ${artwork.title}`}
            width={artwork.width}
            height={artwork.height}
            quality={90}
            priority
            className="w-full h-auto max-h-[75vh] object-contain"
            placeholder="blur"
            blurDataURL={artwork.blurDataURL}
          />
        </div>
        <div className="mt-6 text-center">
          <h3 id="lightbox-title" className="text-xl font-semibold tracking-tight text-white">
            {artwork.title}
          </h3>
          <p id="lightbox-description" className="text-white/40 text-sm mt-1">
            {artwork.style} &middot; {artwork.animal}
          </p>
        </div>
      </div>
    </div>
  );
}
