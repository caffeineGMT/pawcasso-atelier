"use client";

interface SkeletonCardProps {
  hasImage?: boolean;
  imageAspectRatio?: string;
  hasTitle?: boolean;
  hasDescription?: boolean;
  descriptionLines?: number;
  hasFooter?: boolean;
  className?: string;
}

export default function SkeletonCard({
  hasImage = true,
  imageAspectRatio = "aspect-[4/3]",
  hasTitle = true,
  hasDescription = true,
  descriptionLines = 2,
  hasFooter = false,
  className = "",
}: SkeletonCardProps) {
  return (
    <div className={`bg-background-card border border-border rounded-lg overflow-hidden ${className}`}>
      {/* Image skeleton */}
      {hasImage && (
        <div className={`${imageAspectRatio} relative bg-white/[0.04]`}>
          <div className="shimmer-effect absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        </div>
      )}

      {/* Content skeleton */}
      <div className="p-6 space-y-3">
        {/* Title skeleton */}
        {hasTitle && (
          <div className="h-6 bg-white/[0.06] rounded w-3/4 shimmer-box" />
        )}

        {/* Description skeleton */}
        {hasDescription && (
          <div className="space-y-2">
            {Array.from({ length: descriptionLines }).map((_, idx) => (
              <div
                key={idx}
                className={`h-4 bg-white/[0.06] rounded shimmer-box ${
                  idx === descriptionLines - 1 ? "w-2/3" : "w-full"
                }`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              />
            ))}
          </div>
        )}

        {/* Footer skeleton */}
        {hasFooter && (
          <div className="flex items-center justify-between pt-2">
            <div className="h-8 bg-white/[0.06] rounded w-24 shimmer-box" />
            <div className="h-9 bg-white/[0.06] rounded-full w-28 shimmer-box" />
          </div>
        )}
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
          0%,
          100% {
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
