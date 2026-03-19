import { type TierId } from './stripe';

/**
 * Original prices before discount (for strikethrough display)
 */
export const ORIGINAL_PRICES: Record<TierId, number> = {
  basic: 15,
  premium: 49,
  deluxe: 82,
  bundle: 132,
};

/**
 * Get original price for a tier
 *
 * @param tier - Tier ID
 * @returns Original price before discount
 */
export function getOriginalPrice(tier: TierId): number {
  return ORIGINAL_PRICES[tier];
}

/**
 * Calculate discount amount
 *
 * @param currentPrice - Current price after discount
 * @param originalPrice - Original price before discount
 * @returns Discount amount in dollars
 */
export function calculateDiscount(currentPrice: number, originalPrice: number): number {
  return originalPrice - currentPrice;
}

/**
 * Calculate discount percentage
 *
 * @param currentPrice - Current price after discount
 * @param originalPrice - Original price before discount
 * @returns Discount percentage (0-100)
 */
export function calculateDiscountPercent(currentPrice: number, originalPrice: number): number {
  if (originalPrice === 0) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Format price for display
 *
 * @param price - Price in dollars
 * @param includeCents - Whether to include cents
 * @returns Formatted price string (e.g., "$9.99" or "$9")
 */
export function formatPrice(price: number, includeCents: boolean = true): string {
  return includeCents ? `$${price.toFixed(2)}` : `$${Math.floor(price)}`;
}

/**
 * Calculate final price after gift card application
 *
 * @param price - Original price
 * @param giftCardBalance - Gift card balance to apply
 * @returns Final price and remaining gift card balance
 */
export function applyGiftCard(
  price: number,
  giftCardBalance: number
): { finalPrice: number; remainingBalance: number; appliedAmount: number } {
  const appliedAmount = Math.min(price, giftCardBalance);
  return {
    finalPrice: Math.max(0, price - appliedAmount),
    remainingBalance: Math.max(0, giftCardBalance - appliedAmount),
    appliedAmount,
  };
}
