"use client";

interface SkeletonAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "square";
  className?: string;
}

export default function SkeletonAvatar({
  size = "md",
  shape = "circle",
  className = "",
}: SkeletonAvatarProps) {
  const sizeMap = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  return (
    <div
      className={`bg-white/[0.06] ${sizeMap[size]} ${
        shape === "circle" ? "rounded-full" : "rounded-lg"
      } shimmer-box ${className}`}
    >
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
    </div>
  );
}
