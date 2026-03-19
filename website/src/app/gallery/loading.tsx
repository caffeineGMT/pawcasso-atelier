"use client";

import GallerySkeleton from "@/components/GallerySkeleton";

export default function Loading() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="text-center mb-16">
          <div className="h-14 bg-white/[0.06] rounded-lg w-96 mx-auto mb-6 shimmer-box" />
          <div className="h-6 bg-white/[0.06] rounded-lg w-[500px] mx-auto shimmer-box" style={{ animationDelay: '0.1s' }} />
        </div>

        {/* Filters Skeleton */}
        <div className="space-y-4 mb-12">
          <div>
            <div className="h-4 bg-white/[0.06] rounded w-12 mb-2 shimmer-box" />
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-7 w-20 bg-white/[0.06] rounded-full shimmer-box" style={{ animationDelay: `${i * 0.05}s` }} />
              ))}
            </div>
          </div>
          <div>
            <div className="h-4 bg-white/[0.06] rounded w-16 mb-2 shimmer-box" />
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-7 w-16 bg-white/[0.06] rounded-full shimmer-box" style={{ animationDelay: `${i * 0.05}s` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Count Skeleton */}
        <div className="h-4 bg-white/[0.06] rounded w-24 mb-8 shimmer-box" />

        {/* Gallery Grid Skeleton */}
        <GallerySkeleton />
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        :global(.shimmer-box) {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </section>
  );
}
