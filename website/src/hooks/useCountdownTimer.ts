import { useState, useEffect } from 'react';

/**
 * Return type for useCountdownTimer hook
 */
export interface UseCountdownTimerReturn {
  /** Time remaining in milliseconds */
  timeLeft: number;
  /** Formatted time string (HH:MM:SS) */
  formattedTime: string;
  /** Reset timer to initial duration */
  resetTimer: () => void;
}

/**
 * Formats milliseconds to HH:MM:SS string
 */
function formatTime(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Custom hook for countdown timer with localStorage persistence
 *
 * @param durationMs - Countdown duration in milliseconds
 * @param storageKey - localStorage key for persisting expiry time
 * @param autoReset - Whether to automatically reset when timer expires
 *
 * @example
 * ```tsx
 * const { timeLeft, formattedTime } = useCountdownTimer(
 *   24 * 60 * 60 * 1000, // 24 hours
 *   'priceExpiry'
 * );
 * ```
 */
export function useCountdownTimer(
  durationMs: number,
  storageKey: string = 'countdown_expiry',
  autoReset: boolean = true
): UseCountdownTimerReturn {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    // Initialize or get existing expiry time
    const storedExpiry = localStorage.getItem(storageKey);
    let expiryTime: number;

    if (storedExpiry) {
      expiryTime = parseInt(storedExpiry);
      // If expired, reset to new window
      if (expiryTime < Date.now()) {
        expiryTime = Date.now() + durationMs;
        localStorage.setItem(storageKey, expiryTime.toString());
      }
    } else {
      expiryTime = Date.now() + durationMs;
      localStorage.setItem(storageKey, expiryTime.toString());
    }

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, expiryTime - now);
      setTimeLeft(remaining);

      // Auto-reset if expired and autoReset is enabled
      if (remaining === 0 && autoReset) {
        const newExpiry = Date.now() + durationMs;
        localStorage.setItem(storageKey, newExpiry.toString());
        expiryTime = newExpiry;
        setTimeLeft(durationMs);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [durationMs, storageKey, autoReset]);

  /**
   * Manually reset the timer to initial duration
   */
  const resetTimer = (): void => {
    const newExpiry = Date.now() + durationMs;
    localStorage.setItem(storageKey, newExpiry.toString());
    setTimeLeft(durationMs);
  };

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    resetTimer,
  };
}
