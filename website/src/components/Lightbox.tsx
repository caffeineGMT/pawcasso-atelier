"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { ArtworkItem } from "@/lib/data";

interface LightboxProps {
  artwork: ArtworkItem;
  onClose: () => void;
}

export default function Lightbox({ artwork, onClose }: LightboxProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="lightbox-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
        onClick={onClose}
        aria-label="Close"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div
        className="relative max-w-3xl max-h-[85vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={artwork.imageUrl}
          alt={artwork.title}
          width={artwork.width}
          height={artwork.height}
          className="w-full h-auto max-h-[75vh] object-contain"
        />
        <div className="mt-4 text-center">
          <h3 className="text-xl font-light tracking-wide text-white">{artwork.title}</h3>
          <p className="text-text-secondary text-sm mt-1">
            {artwork.style} &middot; {artwork.animal}
          </p>
        </div>
      </div>
    </div>
  );
}
