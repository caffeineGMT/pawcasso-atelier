"use client";

import { clsx } from "clsx";

interface SuccessMessageProps {
  message?: string | null;
  className?: string;
}

/**
 * Success message component
 */
export function SuccessMessage({ message, className }: SuccessMessageProps) {
  if (!message) return null;

  return (
    <p
      className={clsx(
        'text-green-400 text-sm mt-2 flex items-start gap-1.5',
        className
      )}
      role="status"
    >
      <svg
        className="w-4 h-4 flex-shrink-0 mt-0.5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      <span>{message}</span>
    </p>
  );
}
