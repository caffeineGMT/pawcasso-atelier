"use client";

import Image from "next/image";
import { useState } from "react";
import type { ArtworkItem } from "@/lib/data";
import Lightbox from "./Lightbox";

interface GalleryGridProps {
  artworks: ArtworkItem[];
}

export default function GalleryGrid({ artworks }: GalleryGridProps) {
  const [selected, setSelected] = useState<ArtworkItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((artwork, idx) => (
          <button
            key={artwork.id}
            onClick={() => setSelected(artwork)}
            className="group relative overflow-hidden bg-bg-card border border-border hover:border-gold/40 transition-all duration-300 text-left"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <div className="aspect-[3/4] relative overflow-hidden">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-4">
              <h3 className="text-sm font-light tracking-wide text-text-primary">{artwork.title}</h3>
              <p className="text-xs text-text-secondary mt-1">
                {artwork.style} &middot; {artwork.animal}
              </p>
            </div>
          </button>
        ))}
      </div>

      {selected && <Lightbox artwork={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
