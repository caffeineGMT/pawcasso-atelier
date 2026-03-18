/**
 * Pinterest Tag tracking utilities
 *
 * Integrates with Pinterest Tag for conversion tracking and audience building.
 * Complements Google Analytics and Meta Pixel tracking.
 */

// Pinterest Tag event types
export type PinterestEventType =
  | 'pagevisit'
  | 'viewcategory'
  | 'search'
  | 'addtocart'
  | 'checkout'
  | 'watchvideo'
  | 'signup'
  | 'lead'
  | 'custom';

interface PinterestEventData {
  event_id?: string;
  product_name?: string;
  product_id?: string;
  product_price?: number;
  product_quantity?: number;
  product_category?: string;
  currency?: string;
  value?: number;
  order_id?: string;
  search_query?: string;
  video_title?: string;
  lead_type?: string;
  [key: string]: string | number | undefined;
}

/**
 * Track Pinterest Tag event
 */
export function trackPinterestEvent(
  eventType: PinterestEventType,
  data?: PinterestEventData
): void {
  if (typeof window === 'undefined') return;

  // Check if Pinterest Tag is loaded
  if (typeof window.pintrk !== 'function') {
    console.warn('Pinterest Tag not loaded');
    return;
  }

  try {
    window.pintrk('track', eventType, data);
  } catch (error) {
    console.error('Pinterest tracking error:', error);
  }
}

/**
 * Track product page view
 */
export function trackPinterestProductView(product: {
  id: string;
  name: string;
  price: number;
  category?: string;
}): void {
  trackPinterestEvent('pagevisit', {
    product_id: product.id,
    product_name: product.name,
    product_price: product.price,
    product_category: product.category || 'Pet Portrait',
    currency: 'USD',
  });
}

/**
 * Track add to cart (when user uploads photo)
 */
export function trackPinterestAddToCart(product: {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}): void {
  trackPinterestEvent('addtocart', {
    product_id: product.id,
    product_name: product.name,
    product_price: product.price,
    product_quantity: product.quantity || 1,
    currency: 'USD',
    value: product.price * (product.quantity || 1),
  });
}

/**
 * Track checkout initiation
 */
export function trackPinterestCheckout(order: {
  id: string;
  value: number;
  products: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}): void {
  trackPinterestEvent('checkout', {
    order_id: order.id,
    value: order.value,
    currency: 'USD',
  });
}

/**
 * Track search (when user filters gallery)
 */
export function trackPinterestSearch(query: string, category?: string): void {
  trackPinterestEvent('search', {
    search_query: query,
    product_category: category,
  });
}

/**
 * Track email signup
 */
export function trackPinterestSignup(leadType: string = 'newsletter'): void {
  trackPinterestEvent('signup', {
    lead_type: leadType,
  });
}

/**
 * Track custom event
 */
export function trackPinterestCustomEvent(
  eventName: string,
  data?: Record<string, string | number>
): void {
  trackPinterestEvent('custom', {
    event_id: eventName,
    ...data,
  });
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    pintrk?: (
      command: string,
      event: string,
      data?: Record<string, string | number | undefined>
    ) => void;
  }
}
