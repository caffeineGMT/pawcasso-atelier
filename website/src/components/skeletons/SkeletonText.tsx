"use client";

interface SkeletonTextProps {
  lines?: number;
  className?: string;
  width?: string | string[];
  height?: string;
  animated?: boolean;
}

export default function SkeletonText({
  lines = 1,
  className = "",
  width,
  height = "h-4",
  animated = true,
}: SkeletonTextProps) {
  const widths = Array.isArray(width) ? width : Array(lines).fill(width || "w-full");

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, idx) => (
        <div
          key={idx}
          className={`bg-white/[0.06] rounded ${height} ${widths[idx]} ${
            animated ? "shimmer-box" : ""
          }`}
          style={animated ? { animationDelay: `${idx * 0.05}s` } : undefined}
        />
      ))}

      {animated && (
        <style jsx>{`
          @keyframes pulse {
            0%,
            100% {
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
      )}
    </div>
  );
}
