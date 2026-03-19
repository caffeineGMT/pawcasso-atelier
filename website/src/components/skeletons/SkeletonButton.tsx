"use client";

interface SkeletonButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
}

export default function SkeletonButton({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
}: SkeletonButtonProps) {
  const sizeMap = {
    sm: "h-8 px-4",
    md: "h-10 px-6",
    lg: "h-12 px-8",
  };

  return (
    <div
      className={`bg-white/[0.06] rounded-full shimmer-box ${sizeMap[size]} ${
        fullWidth ? "w-full" : "w-32"
      } ${className}`}
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
