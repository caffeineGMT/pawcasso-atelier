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
            A curated collection of bespoke animal portraits, each crafted
            with care and artistic precision in the tradition of the great masters.
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

        {/* Coming Soon / Follow CTA */}
        <div className="mt-20 text-center border-t border-border pt-16">
          <div className="w-12 h-px bg-gold mx-auto mb-8" />
          <h3 className="text-2xl font-light tracking-wide mb-4">
            More <span className="text-gold">Masterpieces</span> on the Way
          </h3>
          <p className="text-text-secondary max-w-lg mx-auto mb-6 leading-relaxed">
            New works added weekly. Follow{" "}
            <a
              href="https://instagram.com/pawcasso.atelier"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold-light transition-colors"
            >
              @pawcasso.atelier
            </a>{" "}
            on Instagram for the latest portraits and behind-the-scenes glimpses
            of our creative process.
          </p>
          <a
            href="https://instagram.com/pawcasso.atelier"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gold/40 text-gold text-sm tracking-wider hover:bg-gold/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            Follow @pawcasso.atelier
          </a>
        </div>
      </div>
    </section>
  );
}
