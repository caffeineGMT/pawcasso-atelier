"use client";

import { useState } from "react";
import { clsx } from "clsx";

interface RetryButtonProps {
  onRetry: () => Promise<void> | void;
  children?: React.ReactNode;
  className?: string;
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * Button component with retry logic and countdown
 */
export function RetryButton({
  onRetry,
  children = "Try Again",
  className,
  maxRetries = 3,
  retryDelay = 5000,
}: RetryButtonProps) {
  const [retrying, setRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [countdown, setCountdown] = useState(0);

  const handleRetry = async () => {
    if (retrying || retryCount >= maxRetries) return;

    setRetrying(true);
    setRetryCount((prev) => prev + 1);

    try {
      await onRetry();
    } catch (error) {
      console.error('Retry failed:', error);

      // Start countdown for next retry
      if (retryCount + 1 < maxRetries) {
        let timeLeft = retryDelay / 1000;
        setCountdown(timeLeft);

        const interval = setInterval(() => {
          timeLeft -= 1;
          setCountdown(timeLeft);

          if (timeLeft <= 0) {
            clearInterval(interval);
            setCountdown(0);
          }
        }, 1000);
      }
    } finally {
      setRetrying(false);
    }
  };

  const isDisabled = retrying || retryCount >= maxRetries || countdown > 0;

  return (
    <button
      onClick={handleRetry}
      disabled={isDisabled}
      className={clsx(
        'px-6 py-3 rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        'bg-gold text-background hover:bg-gold-light',
        className
      )}
    >
      {retrying ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Retrying...
        </span>
      ) : countdown > 0 ? (
        `Retry in ${countdown}s`
      ) : retryCount >= maxRetries ? (
        'Max retries reached'
      ) : retryCount > 0 ? (
        `${children} (${retryCount}/${maxRetries})`
      ) : (
        children
      )}
    </button>
  );
}
