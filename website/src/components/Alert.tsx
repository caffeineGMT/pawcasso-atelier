"use client";

import { ReactNode } from "react";
import { clsx } from "clsx";

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

/**
 * Alert component for displaying contextual feedback messages
 */
export function Alert({
  variant = 'info',
  title,
  children,
  onClose,
  className,
}: AlertProps) {
  const variants = {
    success: {
      container: 'bg-green-500/10 border-green-500/30',
      icon: 'text-green-400',
      title: 'text-green-300',
      text: 'text-green-200',
      iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    error: {
      container: 'bg-red-500/10 border-red-500/30',
      icon: 'text-red-400',
      title: 'text-red-300',
      text: 'text-red-200',
      iconPath: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    warning: {
      container: 'bg-yellow-500/10 border-yellow-500/30',
      icon: 'text-yellow-400',
      title: 'text-yellow-300',
      text: 'text-yellow-200',
      iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    },
    info: {
      container: 'bg-blue-500/10 border-blue-500/30',
      icon: 'text-blue-400',
      title: 'text-blue-300',
      text: 'text-blue-200',
      iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
  };

  const styles = variants[variant];

  return (
    <div
      className={clsx(
        'rounded-lg border p-4 relative',
        styles.container,
        className
      )}
      role="alert"
    >
      <div className="flex gap-3">
        <svg
          className={clsx('w-5 h-5 flex-shrink-0 mt-0.5', styles.icon)}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={styles.iconPath}
          />
        </svg>

        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={clsx('text-sm font-semibold mb-1', styles.title)}>
              {title}
            </h3>
          )}
          <div className={clsx('text-sm', styles.text)}>{children}</div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className={clsx(
              'flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity',
              styles.icon
            )}
            aria-label="Close alert"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
