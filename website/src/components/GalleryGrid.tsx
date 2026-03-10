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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {artworks.map((artwork, idx) => (
          <button
            key={artwork.id}
            onClick={() => setSelected(artwork)}
            className="group relative overflow-hidden rounded-2xl bg-bg-card text-left transition-all duration-500"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <div className="aspect-[3/4] relative overflow-hidden rounded-2xl">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-cover img-hover group-hover:scale-[1.03] transition-transform duration-700"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <h3 className="text-[15px] font-medium text-white">{artwork.title}</h3>
                <p className="text-xs text-white/70 mt-1">
                  {artwork.style} &middot; {artwork.animal}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selected && <Lightbox artwork={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
