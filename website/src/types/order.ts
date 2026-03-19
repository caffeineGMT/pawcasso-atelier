import { type TierId } from '@/lib/stripe';

/**
 * Art style identifier matching the stylePreviewMap keys
 */
export type ArtStyleId =
  | 'renaissance'
  | 'baroque'
  | 'impressionist'
  | 'ghibli'
  | 'watercolor'
  | 'art-nouveau'
  | 'ukiyo-e'
  | 'cyberpunk'
  | 'pixar-3d'
  | 'needle-felt'
  | 'hyperrealism'
  | 'art-deco';

/**
 * Style preview data for gallery display
 */
export interface StylePreview {
  /** Image path for preview */
  image: string;
  /** Display title for the preview */
  title: string;
}

/**
 * Complete order data for checkout
 */
export interface OrderData {
  /** Customer name */
  name: string;
  /** Customer email */
  email: string;
  /** Pet's name */
  petName: string;
  /** Selected art style */
  style: ArtStyleId | string;
  /** Additional notes/instructions */
  notes: string;
  /** Selected pricing tier */
  tier: TierId;
  /** URL of uploaded pet photo */
  photoUrl: string;
  /** Optional discount code */
  discountCode?: string;
  /** Optional gift card code */
  giftCardCode?: string;
  /** Optional gift card balance to apply */
  giftCardBalance?: number;
  /** UTM parameters for attribution */
  utmParams?: Record<string, string>;
}

/**
 * Tier badge configuration for A/B testing
 */
export interface TierBadgeConfig {
  [key: string]: string | null;
}

/**
 * Analytics event data for order tracking
 */
export interface OrderAnalyticsData {
  /** Event name */
  event: string;
  /** Product/content IDs */
  content_ids?: string[];
  /** Product/content name */
  content_name?: string;
  /** Content type (usually 'product') */
  content_type?: string;
  /** Transaction value */
  value?: number;
  /** Currency code */
  currency?: string;
  /** Current wizard step */
  step?: number;
  /** Selected tier */
  tier?: TierId;
  /** Applied discount code */
  discount_code?: string;
  /** Additional custom properties */
  [key: string]: unknown;
}

/**
 * Price configuration for original vs discounted prices
 */
export interface PriceConfig {
  /** Original price before discount */
  original: number;
  /** Current discounted price */
  current: number;
  /** Savings amount */
  savings: number;
  /** Savings percentage */
  savingsPercent: number;
}
