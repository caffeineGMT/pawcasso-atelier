"use client";

import { useState, useEffect } from "react";

interface GallerySkeletonProps {
  /** Number of skeleton items to display */
  count?: number;
}

export default function GallerySkeleton({ count: initialCount }: GallerySkeletonProps = {}) {
  const [skeletonCount, setSkeletonCount] = useState(initialCount || 24);

  useEffect(() => {
    // If count is provided, use it; otherwise adjust based on viewport
    if (initialCount) {
      setSkeletonCount(initialCount);
      return;
    }

    // Adjust skeleton count based on viewport width
    const updateCount = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setSkeletonCount(12); // Mobile: 1 column, show 12 items
      } else if (width < 1024) {
        setSkeletonCount(18); // Tablet: 2 columns, show 18 items (9 rows)
      } else {
        setSkeletonCount(24); // Desktop: 3 columns, show 24 items (8 rows)
      }
    };

    updateCount();
    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, [initialCount]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-2xl bg-bg-card skeleton-item"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            {/* Aspect ratio container matching gallery */}
            <div className="aspect-[3/4] relative overflow-hidden rounded-2xl bg-white/[0.02]">
              {/* Shimmer effect */}
              <div className="shimmer-effect absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

              {/* Badge skeleton */}
              <div className="absolute top-3 left-3 bg-white/10 rounded-lg px-2.5 py-1.5">
                <div className="h-4 w-12 bg-white/10 rounded" />
              </div>

              {/* Text skeleton lines at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
                {/* Title skeleton */}
                <div className="h-[15px] bg-white/10 rounded w-3/4" />
                {/* Subtitle skeleton */}
                <div className="h-3 bg-white/10 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        :global(.skeleton-item) {
          animation: fadeIn 0.4s ease-out forwards;
          opacity: 0;
        }

        :global(.shimmer-effect) {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </>
  );
}
