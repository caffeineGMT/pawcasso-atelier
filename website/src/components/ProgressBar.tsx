"use client";

import { useEffect, useState } from "react";

interface ProgressBarProps {
  progress: number; // 0-100
  showPercentage?: boolean;
  height?: "sm" | "md" | "lg";
  color?: string;
  animated?: boolean;
  className?: string;
}

export default function ProgressBar({
  progress,
  showPercentage = false,
  height = "md",
  color = "bg-gradient-to-r from-gold to-gold-light",
  animated = true,
  className = "",
}: ProgressBarProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, animated]);

  const heightMap = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className={className}>
      <div className={`w-full bg-white/[0.06] rounded-full overflow-hidden ${heightMap[height]}`}>
        <div
          className={`${color} h-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, displayProgress))}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-xs text-text-secondary mt-1 text-right">
          {Math.round(displayProgress)}%
        </div>
      )}
    </div>
  );
}
