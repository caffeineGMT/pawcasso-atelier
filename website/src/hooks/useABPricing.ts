/**
 * Client-side A/B pricing hook
 * Manages variant assignment and pricing display
 */

import { useState, useEffect } from 'react';
import { TierConfig } from '@/lib/stripe';
import type { PricingVariant } from '@/lib/ab-pricing';

export interface ABPricingState {
  variant: PricingVariant | null;
  sessionId: string | null;
  loading: boolean;
  error: string | null;
}

export function useABPricing() {
  const [state, setState] = useState<ABPricingState>({
    variant: null,
    sessionId: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Fetch variant assignment on mount
    const fetchVariant = async () => {
      try {
        const response = await fetch('/api/ab-test/assign');
        const data = await response.json();

        setState({
          variant: data.variant,
          sessionId: data.sessionId,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Failed to fetch A/B variant:', error);
        setState({
          variant: 'control',
          sessionId: 'error',
          loading: false,
          error: 'Failed to load pricing',
        });
      }
    };

    fetchVariant();
  }, []);

  return state;
}

/**
 * Apply variant pricing to a tier config
 */
export function applyVariantPricingClient(
  tierConfig: TierConfig,
  variant: PricingVariant
): TierConfig {
  // Pricing variants mapping
  const variantPricing: Record<PricingVariant, Record<string, number>> = {
    control: {
      basic: 9,
      premium: 29,
      deluxe: 49,
      bundle: 79,
    },
    variant_a: {
      basic: 39,
      premium: 39,
      deluxe: 39,
      bundle: 129,
    },
    variant_b: {
      basic: 49,
      premium: 49,
      deluxe: 49,
      bundle: 129,
    },
    variant_c: {
      basic: 59,
      premium: 59,
      deluxe: 59,
      bundle: 129,
    },
    variant_d: {
      basic: 39,
      premium: 49,
      deluxe: 59,
      bundle: 129,
    },
  };

  const price = variantPricing[variant][tierConfig.id];

  return {
    ...tierConfig,
    price,
    priceDisplay: `$${price}`,
  };
}

/**
 * Get display name for variant (for debugging/admin)
 */
export function getVariantDisplayName(variant: PricingVariant): string {
  const names: Record<PricingVariant, string> = {
    control: 'Control (Current Pricing)',
    variant_a: 'Variant A ($39 single / $129 bundle)',
    variant_b: 'Variant B ($49 single / $129 bundle)',
    variant_c: 'Variant C ($59 single / $129 bundle)',
    variant_d: 'Variant D ($39/$49/$59 tiered + $129 bundle)',
  };
  return names[variant];
}
