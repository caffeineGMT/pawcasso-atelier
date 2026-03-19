/**
 * Dynamic Pricing A/B Test Framework
 *
 * Tests different price points to measure elasticity and revenue impact:
 * - Control: Current pricing ($9/$29/$49/$79)
 * - Variant A: $39 single portrait
 * - Variant B: $49 single portrait
 * - Variant C: $59 single portrait
 * - Variant D: $129 bundle (3 portraits)
 */

import { PrismaClient } from "@prisma/client";
import { TierConfig } from "./stripe";

const prisma = new PrismaClient();

export type PricingVariant = 'control' | 'variant_a' | 'variant_b' | 'variant_c' | 'variant_d';

export interface PricingTestConfig {
  id: string;
  name: string;
  active: boolean;
  variants: {
    [key in PricingVariant]: {
      weight: number; // 0-100, allocation percentage
      enabled: boolean;
    };
  };
}

export interface VariantPricing {
  variant: PricingVariant;
  basic: number;
  premium: number;
  deluxe: number;
  bundle: number;
}

// Define pricing for each variant
export const PRICING_VARIANTS: Record<PricingVariant, VariantPricing> = {
  control: {
    variant: 'control',
    basic: 9,
    premium: 29,
    deluxe: 49,
    bundle: 79,
  },
  variant_a: {
    variant: 'variant_a',
    basic: 39,
    premium: 39, // Single price point
    deluxe: 39,  // Single price point
    bundle: 129, // Bundle pricing
  },
  variant_b: {
    variant: 'variant_b',
    basic: 49,
    premium: 49,
    deluxe: 49,
    bundle: 129,
  },
  variant_c: {
    variant: 'variant_c',
    basic: 59,
    premium: 59,
    deluxe: 59,
    bundle: 129,
  },
  variant_d: {
    variant: 'variant_d',
    basic: 39, // Keep basic tier affordable
    premium: 49,
    deluxe: 59,
    bundle: 129, // Focus on bundle upsell
  },
};

// Default test configuration - all variants equally weighted
export const DEFAULT_TEST_CONFIG: PricingTestConfig = {
  id: 'pricing_test_2026_03',
  name: 'Dynamic Pricing Elasticity Test',
  active: true,
  variants: {
    control: { weight: 20, enabled: true },
    variant_a: { weight: 20, enabled: true },
    variant_b: { weight: 20, enabled: true },
    variant_c: { weight: 20, enabled: true },
    variant_d: { weight: 20, enabled: true },
  },
};

/**
 * Assign a user to a pricing variant using weighted random selection
 * Returns the variant ID and stores assignment in database
 */
export async function assignPricingVariant(
  sessionId: string,
  testConfig: PricingTestConfig = DEFAULT_TEST_CONFIG
): Promise<PricingVariant> {
  if (!testConfig.active) {
    return 'control';
  }

  // Calculate cumulative weights for enabled variants
  const enabledVariants = Object.entries(testConfig.variants)
    .filter(([_, config]) => config.enabled)
    .map(([variant, config]) => ({ variant: variant as PricingVariant, weight: config.weight }));

  const totalWeight = enabledVariants.reduce((sum, v) => sum + v.weight, 0);

  if (totalWeight === 0) {
    return 'control';
  }

  // Weighted random selection
  const random = Math.random() * totalWeight;
  let cumulative = 0;

  let selectedVariant: PricingVariant = 'control';
  for (const { variant, weight } of enabledVariants) {
    cumulative += weight;
    if (random <= cumulative) {
      selectedVariant = variant;
      break;
    }
  }

  // Track assignment in database
  await trackABTestEvent({
    testId: testConfig.id,
    variant: selectedVariant,
    sessionId,
    eventType: 'assignment',
    metadata: {
      timestamp: new Date().toISOString(),
      testName: testConfig.name,
    },
  });

  return selectedVariant;
}

/**
 * Get pricing configuration for a specific variant
 */
export function getPricingForVariant(variant: PricingVariant): VariantPricing {
  return PRICING_VARIANTS[variant];
}

/**
 * Apply variant pricing to tier config
 */
export function applyVariantPricing(
  tierConfig: TierConfig,
  variant: PricingVariant
): TierConfig {
  const variantPricing = getPricingForVariant(variant);
  const price = variantPricing[tierConfig.id];

  return {
    ...tierConfig,
    price,
    priceDisplay: `$${price}`,
  };
}

/**
 * Track A/B test event (assignment, conversion, etc.)
 */
export async function trackABTestEvent({
  testId,
  variant,
  sessionId,
  eventType,
  revenue = 0,
  metadata = {},
}: {
  testId: string;
  variant: PricingVariant;
  sessionId: string;
  eventType: 'assignment' | 'conversion';
  revenue?: number;
  metadata?: Record<string, any>;
}) {
  try {
    await prisma.aBTestEvent.create({
      data: {
        testId,
        variant,
        sessionId,
        eventType,
        revenue,
        metadata: JSON.stringify(metadata),
      },
    });
  } catch (error) {
    console.error('Failed to track A/B test event:', error);
    // Don't throw - tracking failures shouldn't break the user flow
  }
}

/**
 * Track conversion for a variant
 */
export async function trackPricingConversion({
  testId,
  variant,
  sessionId,
  revenue,
  tier,
  orderId,
}: {
  testId: string;
  variant: PricingVariant;
  sessionId: string;
  revenue: number;
  tier: string;
  orderId: string;
}) {
  await trackABTestEvent({
    testId,
    variant,
    sessionId,
    eventType: 'conversion',
    revenue,
    metadata: {
      tier,
      orderId,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Get A/B test statistics for analysis
 */
export interface VariantStats {
  variant: PricingVariant;
  impressions: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
  averageOrderValue: number;
  revenuePerImpression: number;
}

export interface PricingTestStats {
  testId: string;
  testName: string;
  startDate: Date;
  endDate: Date;
  totalImpressions: number;
  totalConversions: number;
  totalRevenue: number;
  variants: VariantStats[];
  winner: PricingVariant | null;
  confidence: number;
}

export async function getPricingTestStats(
  testId: string,
  startDate?: Date,
  endDate?: Date
): Promise<PricingTestStats> {
  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default: last 30 days
  const end = endDate || new Date();

  // Get all events for this test in the date range
  const events = await prisma.aBTestEvent.findMany({
    where: {
      testId,
      timestamp: {
        gte: start,
        lte: end,
      },
    },
  });

  // Group by variant
  const variantGroups = events.reduce((acc, event) => {
    const variant = event.variant as PricingVariant;
    if (!acc[variant]) {
      acc[variant] = { assignments: [], conversions: [] };
    }
    if (event.eventType === 'assignment') {
      acc[variant].assignments.push(event);
    } else if (event.eventType === 'conversion') {
      acc[variant].conversions.push(event);
    }
    return acc;
  }, {} as Record<PricingVariant, { assignments: any[]; conversions: any[] }>);

  // Calculate stats per variant
  const variantStats: VariantStats[] = Object.entries(variantGroups).map(([variant, data]) => {
    const impressions = data.assignments.length;
    const conversions = data.conversions.length;
    const revenue = data.conversions.reduce((sum, c) => sum + c.revenue, 0);
    const conversionRate = impressions > 0 ? (conversions / impressions) * 100 : 0;
    const averageOrderValue = conversions > 0 ? revenue / conversions : 0;
    const revenuePerImpression = impressions > 0 ? revenue / impressions : 0;

    return {
      variant: variant as PricingVariant,
      impressions,
      conversions,
      revenue,
      conversionRate,
      averageOrderValue,
      revenuePerImpression,
    };
  });

  // Calculate totals
  const totalImpressions = variantStats.reduce((sum, v) => sum + v.impressions, 0);
  const totalConversions = variantStats.reduce((sum, v) => sum + v.conversions, 0);
  const totalRevenue = variantStats.reduce((sum, v) => sum + v.revenue, 0);

  // Determine winner (highest revenue per impression)
  const winner = variantStats.length > 0
    ? variantStats.reduce((best, current) =>
        current.revenuePerImpression > best.revenuePerImpression ? current : best
      ).variant
    : null;

  // Calculate statistical confidence (simplified chi-square test)
  const confidence = calculateStatisticalConfidence(variantStats);

  return {
    testId,
    testName: DEFAULT_TEST_CONFIG.name,
    startDate: start,
    endDate: end,
    totalImpressions,
    totalConversions,
    totalRevenue,
    variants: variantStats.sort((a, b) => b.revenuePerImpression - a.revenuePerImpression),
    winner,
    confidence,
  };
}

/**
 * Calculate statistical confidence using chi-square approximation
 * Returns percentage (0-100)
 */
function calculateStatisticalConfidence(variants: VariantStats[]): number {
  if (variants.length < 2) return 0;

  // Find variant with highest conversion rate
  const best = variants.reduce((prev, curr) =>
    curr.conversionRate > prev.conversionRate ? curr : prev
  );

  // Find variant with second-highest conversion rate
  const second = variants
    .filter(v => v.variant !== best.variant)
    .reduce((prev, curr) =>
      curr.conversionRate > prev.conversionRate ? curr : prev
    );

  // Need minimum sample size
  if (best.impressions < 100 || second.impressions < 100) {
    return 0;
  }

  // Calculate z-score for proportion difference
  const p1 = best.conversions / best.impressions;
  const p2 = second.conversions / second.impressions;
  const pooledP = (best.conversions + second.conversions) / (best.impressions + second.impressions);

  const se = Math.sqrt(pooledP * (1 - pooledP) * (1 / best.impressions + 1 / second.impressions));
  const z = Math.abs((p1 - p2) / se);

  // Convert z-score to confidence percentage (simplified)
  // z > 1.96 = 95% confidence
  // z > 2.58 = 99% confidence
  if (z > 2.58) return 99;
  if (z > 1.96) return 95;
  if (z > 1.64) return 90;
  if (z > 1.28) return 80;
  return Math.min(Math.round(z * 40), 75);
}

/**
 * Get variant assignment from session
 * This is called on the client side to determine which pricing to show
 */
export function getVariantFromCookie(cookieValue: string | undefined): PricingVariant {
  if (!cookieValue) return 'control';

  const validVariants: PricingVariant[] = ['control', 'variant_a', 'variant_b', 'variant_c', 'variant_d'];
  return validVariants.includes(cookieValue as PricingVariant)
    ? (cookieValue as PricingVariant)
    : 'control';
}

/**
 * Generate a unique session ID for A/B testing
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}
