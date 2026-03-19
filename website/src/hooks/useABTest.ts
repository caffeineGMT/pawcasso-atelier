'use client';

import { useState, useEffect } from 'react';
import { getVariant, getVariantConfig, trackABTestConversion, type Variant, type VariantConfig } from '@/lib/ab-testing';

/**
 * React hook for A/B testing with SSR safety
 */
export function useABTest(testId: string) {
  const [variant, setVariant] = useState<Variant>('control');
  const [config, setConfig] = useState<Partial<VariantConfig>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const assignedVariant = getVariant(testId);
      const variantConfig = getVariantConfig(testId, assignedVariant);

      setVariant(assignedVariant);
      setConfig(variantConfig);
      setIsLoading(false);
    }
  }, [testId]);

  const trackConversion = (revenue?: number, metadata?: Record<string, any>) => {
    return trackABTestConversion(testId, revenue, metadata);
  };

  return {
    variant,
    config,
    isLoading,
    trackConversion,
  };
}

/**
 * Hook for pricing A/B test
 */
export function usePricingTest() {
  const { variant, config, isLoading, trackConversion } = useABTest('pricing_test');

  // Default prices if config not loaded
  const defaultPrices = {
    basicPrice: 9,
    standardPrice: 19,
    premiumPrice: 29,
  };

  const pricing = config.pricing || defaultPrices;

  return {
    variant,
    pricing,
    isLoading,
    trackConversion,
  };
}

/**
 * Hook for CTA button A/B test
 */
export function useCTATest() {
  const { variant, config, isLoading, trackConversion } = useABTest('cta_button_test');

  // Default CTA config
  const defaultCTA = {
    text: 'Create My Portrait',
    color: 'blue' as const,
    size: 'lg' as const,
  };

  const cta = config.cta || defaultCTA;

  return {
    variant,
    cta,
    isLoading,
    trackConversion,
  };
}

/**
 * Get CSS classes for CTA button based on A/B test variant
 */
export function getCTAButtonClasses(color: 'blue' | 'green' | 'purple' | 'orange', size: 'sm' | 'md' | 'lg'): string {
  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700 text-white',
    green: 'bg-green-600 hover:bg-green-700 text-white',
    purple: 'bg-purple-600 hover:bg-purple-700 text-white',
    orange: 'bg-orange-600 hover:bg-orange-700 text-white',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return `${colorClasses[color]} ${sizeClasses[size]} font-semibold rounded-lg transition-colors duration-200`;
}
