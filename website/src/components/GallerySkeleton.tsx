"use client";

import { useState, useEffect } from "react";

export default function GallerySkeleton() {
  const [skeletonCount, setSkeletonCount] = useState(12);

  useEffect(() => {
    // Adjust skeleton count based on viewport width
    const updateCount = () => {
      setSkeletonCount(window.innerWidth < 640 ? 6 : 12);
    };

    updateCount();
    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-2xl bg-bg-card skeleton-item"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            {/* Aspect ratio container matching gallery */}
            <div className="aspect-[3/4] relative overflow-hidden rounded-2xl bg-white/[0.02]">
              {/* Shimmer effect */}
              <div className="shimmer-effect absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

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

        :global(.shimmer-effect) {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </>
  );
}
