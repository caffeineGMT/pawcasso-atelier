"use client";

export default function LaunchDashboardSkeleton() {
  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 bg-white/[0.06] rounded-lg w-96 shimmer-box" />
            <div className="h-10 w-32 bg-gold/10 border border-gold/20 rounded-full shimmer-box" />
          </div>
          <div className="h-5 bg-white/[0.06] rounded-lg w-[600px] shimmer-box" />
        </div>

        {/* Key Metrics Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-xl bg-bg-card border border-white/[0.06] p-6"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="h-4 bg-white/[0.06] rounded w-20 mb-2 shimmer-box" />
              <div className="h-8 bg-white/[0.06] rounded w-12 mb-2 shimmer-box" />
              <div className="h-6 bg-white/[0.06] rounded w-full shimmer-box" />
            </div>
          ))}
        </div>

        {/* Launch Day Tasks Skeleton */}
        <div className="rounded-2xl bg-bg-card border border-white/[0.06] p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="h-7 bg-white/[0.06] rounded w-48 shimmer-box" />
            <div className="h-5 bg-white/[0.06] rounded w-32 shimmer-box" />
          </div>

          {/* Progress Bar Skeleton */}
          <div className="w-full h-2 bg-white/[0.06] rounded-full mb-8 overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-gold to-gold-light shimmer-box" />
          </div>

          {/* Task Items Skeleton */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl bg-bg-elevated border border-white/[0.06]"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="h-8 w-24 bg-white/[0.06] rounded-lg shimmer-box" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-white/[0.06] rounded w-3/4 shimmer-box" />
                  <div className="h-4 bg-white/[0.06] rounded w-1/3 shimmer-box" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Response Monitoring Skeleton */}
        <div className="rounded-2xl bg-bg-card border border-white/[0.06] p-8 mb-12">
          <div className="h-7 bg-white/[0.06] rounded w-64 mb-6 shimmer-box" />
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-white/[0.06] rounded-full mx-auto mb-4 shimmer-box" />
            <div className="h-5 bg-white/[0.06] rounded w-48 mx-auto mb-2 shimmer-box" />
            <div className="h-4 bg-white/[0.06] rounded w-64 mx-auto shimmer-box" />
          </div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl bg-bg-card border border-white/[0.06] p-6"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="h-8 w-8 bg-white/[0.06] rounded mb-3 shimmer-box" />
              <div className="h-5 bg-white/[0.06] rounded w-32 mb-2 shimmer-box" />
              <div className="h-4 bg-white/[0.06] rounded w-40 shimmer-box" />
            </div>
          ))}
        </div>
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
    </div>
  );
}
