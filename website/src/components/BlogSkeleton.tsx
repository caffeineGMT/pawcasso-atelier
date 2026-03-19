"use client";

export default function BlogSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Skeleton */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-12 bg-white/[0.06] rounded-lg w-3/4 mx-auto mb-6 shimmer-box" />
          <div className="h-6 bg-white/[0.06] rounded-lg w-2/3 mx-auto shimmer-box" style={{ animationDelay: '0.1s' }} />
        </div>
      </section>

      {/* Featured Posts Skeleton */}
      <section className="pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 bg-white/[0.06] rounded-lg w-48 mb-8 shimmer-box" />
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((idx) => (
              <div
                key={idx}
                className="block bg-background-card border border-border rounded-lg overflow-hidden"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Image skeleton */}
                <div className="aspect-[16/9] relative overflow-hidden bg-white/[0.04]">
                  <div className="shimmer-effect absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                </div>
                {/* Content skeleton */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-20 bg-white/[0.06] rounded shimmer-box" />
                    <div className="h-4 w-16 bg-white/[0.06] rounded shimmer-box" />
                    <div className="h-4 w-24 bg-white/[0.06] rounded shimmer-box" />
                  </div>
                  <div className="h-6 bg-white/[0.06] rounded w-4/5 shimmer-box" />
                  <div className="space-y-2">
                    <div className="h-4 bg-white/[0.06] rounded w-full shimmer-box" />
                    <div className="h-4 bg-white/[0.06] rounded w-3/4 shimmer-box" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts Skeleton */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 bg-white/[0.06] rounded-lg w-40 mb-8 shimmer-box" />
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="block bg-background-card border border-border rounded-lg overflow-hidden"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                {/* Image skeleton */}
                <div className="aspect-[4/3] relative overflow-hidden bg-white/[0.04]">
                  <div className="shimmer-effect absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                </div>
                {/* Content skeleton */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-16 bg-white/[0.06] rounded shimmer-box" />
                    <div className="h-3 w-12 bg-white/[0.06] rounded shimmer-box" />
                  </div>
                  <div className="h-5 bg-white/[0.06] rounded w-full shimmer-box" />
                  <div className="h-5 bg-white/[0.06] rounded w-4/5 shimmer-box" />
                  <div className="space-y-1">
                    <div className="h-3 bg-white/[0.06] rounded w-full shimmer-box" />
                    <div className="h-3 bg-white/[0.06] rounded w-2/3 shimmer-box" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        :global(.shimmer-effect) {
          animation: shimmer 2s infinite linear;
        }

        :global(.shimmer-box) {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
