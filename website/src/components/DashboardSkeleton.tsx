"use client";

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <div className="flex">
        {/* Sidebar Skeleton - Desktop */}
        <div className="hidden lg:block fixed left-0 top-0 h-screen w-60 bg-white border-r border-[#E5E5E5]">
          <div className="p-6">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8 shimmer-box" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 bg-gray-200 rounded shimmer-box" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:ml-60">
          {/* Mobile Header */}
          <div className="lg:hidden sticky top-0 z-10 bg-white border-b border-[#E5E5E5] px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="h-6 bg-gray-200 rounded w-24 shimmer-box" />
              <div className="h-6 bg-gray-200 rounded w-16 shimmer-box" />
            </div>
          </div>

          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="h-10 bg-gray-200 rounded w-64 mb-2 shimmer-box" />
              <div className="h-5 bg-gray-200 rounded w-96 shimmer-box" style={{ animationDelay: '0.1s' }} />
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-[#E5E5E5] p-6" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-3 shimmer-box" />
                  <div className="h-8 bg-gray-200 rounded w-16 shimmer-box" />
                </div>
              ))}
            </div>

            {/* Referral Section Skeleton */}
            <div className="bg-gradient-to-br from-[#E07A5F]/10 to-[#E07A5F]/5 border border-[#E07A5F]/20 rounded-2xl p-6 mb-8">
              <div className="h-6 bg-[#E07A5F]/20 rounded w-48 mb-4 shimmer-box" />
              <div className="space-y-3">
                <div className="h-5 bg-[#E07A5F]/20 rounded w-full shimmer-box" />
                <div className="h-5 bg-[#E07A5F]/20 rounded w-3/4 shimmer-box" />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-12 bg-[#E07A5F]/20 rounded-lg shimmer-box" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            </div>

            {/* Orders Section */}
            <div className="mb-8">
              <div className="h-7 bg-gray-200 rounded w-40 mb-6 shimmer-box" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {/* Image skeleton */}
                    <div className="aspect-[4/3] relative bg-gray-100">
                      <div className="shimmer-effect absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                    </div>
                    {/* Content skeleton */}
                    <div className="p-5 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-3/4 shimmer-box" />
                      <div className="h-4 bg-gray-200 rounded w-1/2 shimmer-box" />
                      <div className="flex items-center justify-between pt-2">
                        <div className="h-6 bg-gray-200 rounded w-20 shimmer-box" />
                        <div className="h-9 bg-gray-200 rounded-full w-32 shimmer-box" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
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
