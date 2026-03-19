import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { type TierId, TIER_CONFIG } from '@/lib/stripe';

/**
 * Return type for useOrderParams hook
 */
export interface UseOrderParamsReturn {
  /** Selected tier from URL param or default */
  selectedTier: TierId;
  /** Discount code from URL param */
  discountCode: string | null;
  /** Update selected tier */
  setSelectedTier: (tier: TierId) => void;
}

/**
 * Custom hook for parsing and managing order-related URL parameters
 *
 * Handles:
 * - ?tier=premium (set pricing tier)
 * - ?code=DISCOUNT20 (apply discount code)
 * - UTM parameters (captured via utm-tracker)
 *
 * @param defaultTier - Default tier if no URL param provided
 * @param onTierChange - Callback when tier changes
 * @param onDiscountCode - Callback when discount code is detected
 *
 * @example
 * ```tsx
 * const { selectedTier, discountCode } = useOrderParams('basic', (tier) => {
 *   console.log('Tier changed to:', tier);
 * });
 * ```
 */
export function useOrderParams(
  defaultTier: TierId = 'basic',
  onTierChange?: (tier: TierId) => void,
  onDiscountCode?: (code: string) => void
): UseOrderParamsReturn {
  const searchParams = useSearchParams();
  const [selectedTier, setSelectedTierState] = useState<TierId>(defaultTier);
  const [discountCode, setDiscountCode] = useState<string | null>(null);

  useEffect(() => {
    // Check for tier parameter
    const tierParam = searchParams.get('tier');
    if (tierParam) {
      const validTier = TIER_CONFIG.find(t => t.id === tierParam);
      if (validTier) {
        setSelectedTierState(validTier.id);
        onTierChange?.(validTier.id);
      }
    }

    // Check for discount code parameter
    const codeParam = searchParams.get('code');
    if (codeParam) {
      setDiscountCode(codeParam);
      onDiscountCode?.(codeParam);
    }
  }, [searchParams, onTierChange, onDiscountCode]);

  /**
   * Updates selected tier
   */
  const setSelectedTier = (tier: TierId): void => {
    setSelectedTierState(tier);
    onTierChange?.(tier);
  };

  return {
    selectedTier,
    discountCode,
    setSelectedTier,
  };
}
