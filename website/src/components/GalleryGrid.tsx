"use client";

import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import type { ArtworkItem } from "@/lib/data";
import Lightbox from "./Lightbox";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useLazyImage } from "@/hooks/useLazyImage";

interface GalleryGridProps {
  artworks: ArtworkItem[];
}

interface GalleryItemProps {
  artwork: ArtworkItem;
  index: number;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  itemRef: (el: HTMLButtonElement | null) => void;
  tabIndex: number;
}

function GalleryItem({ artwork, index, onClick, onKeyDown, itemRef, tabIndex }: GalleryItemProps) {
  // Use lazy loading for images beyond the first screen (first 6 items)
  const { ref, shouldLoad, isLoaded, onLoad: handleImageLoad } = useLazyImage({
    eager: index < 6,
    rootMargin: '400px',
    threshold: 0.01,
  });

  return (
    <button
      ref={itemRef}
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={tabIndex}
      className="group relative overflow-hidden rounded-2xl bg-bg-card text-left transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-bg"
      style={{ animationDelay: `${(index % 24) * 50}ms` }}
      aria-label={`View ${artwork.title}, ${artwork.style} style portrait of ${artwork.animal}`}
      role="listitem"
    >
      <div ref={ref} className="aspect-[3/4] relative overflow-hidden rounded-2xl">
        {shouldLoad ? (
          <Image
            src={artwork.imageUrl}
            alt={`${artwork.title} - ${artwork.style} style custom ${artwork.animal.toLowerCase()} portrait by Pawcasso Atelier`}
            fill
            quality={85}
            className={`object-cover img-hover group-hover:scale-[1.03] group-focus:scale-[1.03] transition-all duration-700 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={artwork.blurDataURL}
            priority={index < 3}
            loading={index < 3 ? "eager" : "lazy"}
            onLoad={handleImageLoad}
          />
        ) : (
          // Placeholder while image is not yet in viewport
          <div className="absolute inset-0 bg-white/[0.02]">
            <div className="shimmer-effect absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-500" />

        {/* Review Badge - Always visible */}
        {artwork.rating && artwork.reviewCount && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-lg transition-all duration-300 group-hover:scale-105">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                <svg className="w-3.5 h-3.5 text-gold fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-[13px] font-semibold text-bg">{artwork.rating}</span>
              </div>
              <span className="text-[11px] text-bg/60">({artwork.reviewCount})</span>
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100 transition-all duration-500">
          <h3 className="text-[15px] font-medium text-white">{artwork.title}</h3>
          <p className="text-xs text-white/70 mt-1">
            {artwork.style} &middot; {artwork.animal}
          </p>
        </div>
      </div>
    </button>
  );
}

export default function GalleryGrid({ artworks }: GalleryGridProps) {
  const [selected, setSelected] = useState<ArtworkItem | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Use infinite scroll hook
  const {
    visibleItems,
    isLoadingMore,
    hasMore,
    loadMoreRef,
    loadedCount,
  } = useInfiniteScroll(artworks, {
    initialLoad: 24,
    itemsPerPage: 12,
    rootMargin: '600px',
    threshold: 0.1,
  });

  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    const columns = {
      sm: 1,
      md: 2,
      lg: 3
    };

    // Detect current breakpoint
    const width = window.innerWidth;
    let cols = columns.sm;
    if (width >= 1024) cols = columns.lg;
    else if (width >= 640) cols = columns.md;

    let newIndex = index;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        newIndex = Math.min(index + 1, visibleItems.length - 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = Math.max(index - 1, 0);
        break;
      case 'ArrowDown':
        e.preventDefault();
        newIndex = Math.min(index + cols, visibleItems.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        newIndex = Math.max(index - cols, 0);
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = visibleItems.length - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        setSelected(visibleItems[index]);
        return;
      default:
        return;
    }

    setFocusedIndex(newIndex);
    itemRefs.current[newIndex]?.focus();
  }, [visibleItems]);

  return (
    <>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        role="list"
        aria-label="Gallery of pet portraits"
      >
        {visibleItems.map((artwork, idx) => (
          <GalleryItem
            key={artwork.id}
            artwork={artwork}
            index={idx}
            onClick={() => setSelected(artwork)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            itemRef={(el) => { itemRefs.current[idx] = el; }}
            tabIndex={idx === focusedIndex ? 0 : -1}
          />
        ))}
      </div>

      {/* Loading indicator and infinite scroll trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="py-12 flex flex-col items-center gap-4">
          {isLoadingMore && (
            <>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <p className="text-text-secondary text-sm">Loading more portraits...</p>
            </>
          )}
          <p className="text-text-secondary/50 text-xs">
            Showing {loadedCount} of {artworks.length} pieces
          </p>
        </div>
      )}

      {/* All items loaded message */}
      {!hasMore && artworks.length > 24 && (
        <div className="py-12 text-center">
          <p className="text-text-secondary text-sm">
            You've viewed all {artworks.length} pieces ✨
          </p>
        </div>
      )}

      {selected && <Lightbox artwork={selected} onClose={() => setSelected(null)} />}

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        :global(.shimmer-effect) {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </>
  );
}
