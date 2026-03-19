/**
 * A/B Testing Framework
 *
 * Supports testing:
 * - Pricing tiers (standard vs. discounted pricing)
 * - CTA button text and colors
 * - Hero copy variations
 * - Trust badge placement
 */

export type Variant = 'control' | 'variant_a' | 'variant_b' | 'variant_c';

export interface ABTest {
  id: string;
  name: string;
  enabled: boolean;
  variants: {
    id: Variant;
    weight: number; // 0-100, should sum to 100
  }[];
}

export interface VariantConfig {
  // Pricing experiments
  pricing?: {
    basicPrice: number;
    standardPrice: number;
    premiumPrice: number;
  };

  // CTA button experiments
  cta?: {
    text: string;
    color: 'blue' | 'green' | 'purple' | 'orange';
    size: 'sm' | 'md' | 'lg';
  };

  // Hero copy experiments
  hero?: {
    headline: string;
    subheadline: string;
  };

  // Trust badge placement
  trustBadges?: {
    position: 'above_fold' | 'below_fold' | 'sticky';
  };
}

/**
 * Default variant configurations
 */
const VARIANT_CONFIGS: Record<string, Record<Variant, Partial<VariantConfig>>> = {
  pricing_test: {
    control: {
      pricing: {
        basicPrice: 9,
        standardPrice: 19,
        premiumPrice: 29,
      },
    },
    variant_a: {
      pricing: {
        basicPrice: 12,
        standardPrice: 22,
        premiumPrice: 32,
      },
    },
    variant_b: {
      pricing: {
        basicPrice: 15,
        standardPrice: 25,
        premiumPrice: 35,
      },
    },
    variant_c: {},
  },
  cta_button_test: {
    control: {
      cta: {
        text: 'Create My Portrait',
        color: 'blue',
        size: 'lg',
      },
    },
    variant_a: {
      cta: {
        text: 'Transform My Pet Now',
        color: 'green',
        size: 'lg',
      },
    },
    variant_b: {
      cta: {
        text: 'Get Started - $9',
        color: 'purple',
        size: 'lg',
      },
    },
    variant_c: {
      cta: {
        text: 'Order Custom Portrait',
        color: 'orange',
        size: 'lg',
      },
    },
  },
};

/**
 * Assign user to A/B test variant using deterministic hashing
 */
export const getVariant = (testId: string, userId?: string): Variant => {
  if (typeof window === 'undefined') return 'control';

  try {
    // Get or create persistent user ID for A/B testing
    let abTestUserId = userId;
    if (!abTestUserId) {
      abTestUserId = localStorage.getItem('ab_test_user_id');
      if (!abTestUserId) {
        abTestUserId = crypto.randomUUID();
        localStorage.setItem('ab_test_user_id', abTestUserId);
      }
    }

    // Check if user already has a variant assigned for this test
    const storedVariant = localStorage.getItem(`ab_test_${testId}`);
    if (storedVariant && ['control', 'variant_a', 'variant_b', 'variant_c'].includes(storedVariant)) {
      return storedVariant as Variant;
    }

    // Simple deterministic hash-based assignment
    const hash = simpleHash(testId + abTestUserId);
    const bucket = hash % 100;

    // Default distribution: 25% each variant
    let variant: Variant;
    if (bucket < 25) variant = 'control';
    else if (bucket < 50) variant = 'variant_a';
    else if (bucket < 75) variant = 'variant_b';
    else variant = 'variant_c';

    // Store variant assignment
    localStorage.setItem(`ab_test_${testId}`, variant);

    // Track assignment in analytics
    trackVariantAssignment(testId, variant);

    return variant;
  } catch {
    return 'control';
  }
};

/**
 * Get variant configuration for a test
 */
export const getVariantConfig = (testId: string, variant?: Variant): Partial<VariantConfig> => {
  const actualVariant = variant || getVariant(testId);
  return VARIANT_CONFIGS[testId]?.[actualVariant] || {};
};

/**
 * Track A/B test variant assignment
 */
const trackVariantAssignment = async (testId: string, variant: Variant): Promise<void> => {
  try {
    // Track to backend
    await fetch('/api/analytics/ab-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        testId,
        variant,
        eventType: 'assignment',
      }),
    });

    // Track in GA4
    if (window.gtag) {
      window.gtag('event', 'ab_test_assignment', {
        test_id: testId,
        variant,
      });
    }

    // Track in Clarity
    if (window.clarity) {
      window.clarity('set', `ab_test_${testId}`, variant);
    }
  } catch (error) {
    console.error('Failed to track A/B test assignment:', error);
  }
};

/**
 * Track A/B test conversion (goal completion)
 */
export const trackABTestConversion = async (
  testId: string,
  revenue?: number,
  metadata?: Record<string, any>
): Promise<void> => {
  if (typeof window === 'undefined') return;

  try {
    const variant = getVariant(testId);

    // Track to backend
    await fetch('/api/analytics/ab-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        testId,
        variant,
        eventType: 'conversion',
        revenue,
        metadata,
      }),
    });

    // Track in GA4
    if (window.gtag) {
      window.gtag('event', 'ab_test_conversion', {
        test_id: testId,
        variant,
        value: revenue,
      });
    }
  } catch (error) {
    console.error('Failed to track A/B test conversion:', error);
  }
};

/**
 * Simple string hash function for deterministic variant assignment
 */
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

/**
 * React hook for A/B testing
 */
export const useABTest = (testId: string) => {
  if (typeof window === 'undefined') {
    return {
      variant: 'control' as Variant,
      config: {} as Partial<VariantConfig>,
      trackConversion: async () => {},
    };
  }

  const variant = getVariant(testId);
  const config = getVariantConfig(testId, variant);

  return {
    variant,
    config,
    trackConversion: (revenue?: number, metadata?: Record<string, any>) =>
      trackABTestConversion(testId, revenue, metadata),
  };
};

/**
 * Extend Window interface
 */
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    clarity?: (command: string, ...args: any[]) => void;
  }
}
