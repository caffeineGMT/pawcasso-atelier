"use client";

import { useState, useMemo } from "react";
import { artworks, styles, animals } from "@/lib/data";
import GalleryGrid from "@/components/GalleryGrid";

export default function GalleryPage() {
  const [styleFilter, setStyleFilter] = useState("All");
  const [animalFilter, setAnimalFilter] = useState("All");

  const filtered = useMemo(() => {
    return artworks.filter((a) => {
      const matchStyle = styleFilter === "All" || a.style === styleFilter;
      const matchAnimal = animalFilter === "All" || a.animal === animalFilter;
      return matchStyle && matchAnimal;
    });
  }, [styleFilter, animalFilter]);

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">
            The <span className="text-gold">Gallery</span>
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Browse our collection of AI-powered artistic pet portraits.
            Each piece is crafted with care and artistic precision.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
          {/* Style filter */}
          <div className="flex items-center gap-2">
            <span className="text-text-secondary text-xs tracking-wider uppercase">Style:</span>
            <div className="flex flex-wrap gap-2">
              {styles.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyleFilter(s)}
                  className={`px-3 py-1 text-xs tracking-wider border transition-colors ${
                    styleFilter === s
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-border text-text-secondary hover:border-gold/40 hover:text-gold"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Animal filter */}
          <div className="flex items-center gap-2">
            <span className="text-text-secondary text-xs tracking-wider uppercase">Animal:</span>
            <div className="flex flex-wrap gap-2">
              {animals.map((a) => (
                <button
                  key={a}
                  onClick={() => setAnimalFilter(a)}
                  className={`px-3 py-1 text-xs tracking-wider border transition-colors ${
                    animalFilter === a
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-border text-text-secondary hover:border-gold/40 hover:text-gold"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-text-secondary text-sm mb-8">
          Showing {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <GalleryGrid artworks={filtered} />
        ) : (
          <div className="text-center py-20">
            <p className="text-text-secondary">No pieces match your filters. Try adjusting them.</p>
          </div>
        )}
      </div>
    </section>
  );
}
