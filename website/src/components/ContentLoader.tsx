"use client";

import { ReactNode } from "react";
import Spinner from "./Spinner";

interface ContentLoaderProps<T> {
  data: T | null | undefined;
  isLoading: boolean;
  error?: Error | null;
  skeleton?: ReactNode;
  emptyState?: ReactNode;
  errorState?: ReactNode;
  children: (data: T) => ReactNode;
  minLoadingTime?: number;
}

export default function ContentLoader<T>({
  data,
  isLoading,
  error,
  skeleton,
  emptyState,
  errorState,
  children,
}: ContentLoaderProps<T>) {
  // Error state
  if (error) {
    return (
      errorState || (
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <div className="text-center max-w-md">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Something went wrong
            </h3>
            <p className="text-text-secondary text-sm mb-4">
              {error.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gold text-background rounded-full hover:bg-gold-light transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )
    );
  }

  // Loading state
  if (isLoading) {
    return (
      skeleton || (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      )
    );
  }

  // Empty state
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      emptyState || (
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <div className="text-center max-w-md">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              No data found
            </h3>
            <p className="text-text-secondary text-sm">
              There's nothing to display at the moment
            </p>
          </div>
        </div>
      )
    );
  }

  // Success state
  return <>{children(data)}</>;
}
