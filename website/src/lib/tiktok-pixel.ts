/**
 * TikTok Pixel event tracking
 * Fires standard TikTok events for conversion optimization
 */

declare global {
  interface Window {
    ttq?: {
      track: (event: string, params?: Record<string, unknown>) => void;
      page: () => void;
      identify: (params: Record<string, unknown>) => void;
    };
  }
}

export type TikTokEventName =
  | 'ViewContent'
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'CompletePayment'
  | 'PlaceAnOrder'
  | 'Contact'
  | 'SubmitForm'
  | 'Subscribe';

export function trackTikTokEvent(
  event: TikTokEventName,
  params?: Record<string, unknown>
): void {
  if (typeof window === 'undefined' || !window.ttq) return;

  try {
    window.ttq.track(event, params);
  } catch {
    // Silently fail if pixel not loaded
  }
}

export function trackTikTokPageView(): void {
  if (typeof window === 'undefined' || !window.ttq) return;

  try {
    window.ttq.page();
  } catch {
    // Silently fail
  }
}
