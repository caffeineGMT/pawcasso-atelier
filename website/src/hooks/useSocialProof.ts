import { useState, useEffect } from 'react';

/**
 * Return type for useSocialProof hook
 */
export interface UseSocialProofReturn {
  /** Current count value */
  count: number;
  /** Set count to specific value */
  setCount: (count: number) => void;
}

/**
 * Custom hook for social proof counter that increments over time
 *
 * @param initialCount - Starting count value
 * @param incrementInterval - How often to increment (in milliseconds)
 * @param maxIncrement - Maximum amount to increment each interval
 *
 * @example
 * ```tsx
 * const { count } = useSocialProof(2847, 5000, 3);
 * // Displays incrementing counter: "2,847+ orders completed"
 * ```
 */
export function useSocialProof(
  initialCount: number = 2847,
  incrementInterval: number = 5000,
  maxIncrement: number = 3
): UseSocialProofReturn {
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * maxIncrement));
    }, incrementInterval);

    return () => clearInterval(interval);
  }, [incrementInterval, maxIncrement]);

  return {
    count,
    setCount,
  };
}
