/**
 * Stripe webhook configuration and constants
 */

export const TIER_PORTRAIT_COUNT: Record<string, number> = {
  basic: 1,
  premium: 3,
  deluxe: 5,
  bundle: 5,
};

export const TIER_POLL_TIMEOUT: Record<string, number> = {
  basic: 5 * 60 * 1000,    // 5 minutes
  premium: 8 * 60 * 1000,  // 8 minutes
  deluxe: 10 * 60 * 1000,  // 10 minutes
  bundle: 10 * 60 * 1000,  // 10 minutes
};

export const POLL_INTERVALS = [5000, 10000, 15000, 20000, 30000]; // 5s, 10s, 15s, 20s, 30s

export const MAX_RETRIES = 3;
export const RETRY_DELAYS = [10000, 30000, 90000]; // 10s, 30s, 90s

export type DeliveryStep =
  | 'pending'
  | 'downloading_photo'
  | 'generating'
  | 'uploading'
  | 'sending_email'
  | 'completed'
  | 'failed';
