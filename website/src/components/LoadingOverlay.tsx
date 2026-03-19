"use client";

import Spinner from "./Spinner";

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  fullScreen?: boolean;
  backdrop?: boolean;
}

export default function LoadingOverlay({
  isLoading,
  text = "Loading...",
  fullScreen = false,
  backdrop = true,
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div
      className={`${
        fullScreen ? "fixed inset-0" : "absolute inset-0"
      } z-50 flex items-center justify-center ${
        backdrop ? "bg-black/50 backdrop-blur-sm" : ""
      }`}
    >
      <div className="bg-background-card border border-white/[0.08] rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          {text && <p className="text-text-secondary text-sm">{text}</p>}
        </div>
      </div>
    </div>
  );
}
