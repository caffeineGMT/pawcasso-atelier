/**
 * Meta Conversions API (Server-Side Event Tracking)
 *
 * Purpose: Send events to Meta's Conversions API from the server-side to:
 * 1. Bypass iOS 14+ tracking limitations
 * 2. Improve event match quality
 * 3. Enable accurate attribution and reporting
 * 4. Create more reliable retargeting audiences
 *
 * Docs: https://developers.facebook.com/docs/marketing-api/conversions-api
 */

import crypto from 'crypto';

interface ConversionEvent {
  event_name: string;
  event_time: number;
  event_id?: string;
  user_data: {
    em?: string[]; // Hashed email
    ph?: string[]; // Hashed phone
    fn?: string[]; // Hashed first name
    ln?: string[]; // Hashed last name
    ct?: string[]; // Hashed city
    st?: string[]; // Hashed state
    zp?: string[]; // Hashed zip
    country?: string[]; // Hashed country
    client_ip_address?: string;
    client_user_agent?: string;
    fbc?: string; // Facebook click ID cookie
    fbp?: string; // Facebook browser ID cookie
  };
  custom_data?: {
    value?: number;
    currency?: string;
    content_ids?: string[];
    content_type?: string;
    content_name?: string;
    num_items?: number;
  };
  action_source: 'website' | 'email' | 'app' | 'phone_call' | 'chat' | 'physical_store' | 'system_generated' | 'other';
  event_source_url?: string;
}

/**
 * Hash a value using SHA-256 (required by Meta for PII)
 */
function hashValue(value: string): string {
  if (!value) return '';
  return crypto
    .createHash('sha256')
    .update(value.toLowerCase().trim())
    .digest('hex');
}

/**
 * Send event to Meta Conversions API
 */
export async function sendConversionEvent(event: ConversionEvent): Promise<boolean> {
  const accessToken = process.env.META_CONVERSIONS_API_ACCESS_TOKEN;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  if (!accessToken || !pixelId) {
    console.warn('Meta Conversions API not configured. Skipping server-side event.');
    return false;
  }

  const url = `https://graph.facebook.com/v18.0/${pixelId}/events`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [event],
        access_token: accessToken,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Meta Conversions API error:', result);
      return false;
    }

    console.log('Meta Conversions API success:', result);
    return true;
  } catch (error) {
    console.error('Failed to send Meta Conversions API event:', error);
    return false;
  }
}

/**
 * Track Purchase event server-side (called from Stripe webhook)
 */
export async function trackPurchaseServerSide(params: {
  email: string;
  value: number;
  currency?: string;
  orderId: string;
  contentIds: string[];
  contentType: string;
  userAgent?: string;
  ipAddress?: string;
  eventId?: string; // For deduplication with client-side event
  fbp?: string; // Facebook browser cookie
  fbc?: string; // Facebook click cookie
}): Promise<boolean> {
  const event: ConversionEvent = {
    event_name: 'Purchase',
    event_time: Math.floor(Date.now() / 1000),
    event_id: params.eventId || `purchase_${params.orderId}`,
    user_data: {
      em: [hashValue(params.email)],
      client_ip_address: params.ipAddress,
      client_user_agent: params.userAgent,
      fbp: params.fbp,
      fbc: params.fbc,
    },
    custom_data: {
      value: params.value,
      currency: params.currency || 'USD',
      content_ids: params.contentIds,
      content_type: params.contentType,
      num_items: 1,
    },
    action_source: 'website',
    event_source_url: 'https://pawcasso-atelier.vercel.app/order/success',
  };

  return sendConversionEvent(event);
}

/**
 * Track Lead event server-side (called from email subscription)
 */
export async function trackLeadServerSide(params: {
  email: string;
  ipAddress?: string;
  userAgent?: string;
  eventId?: string;
  fbp?: string;
  fbc?: string;
}): Promise<boolean> {
  const event: ConversionEvent = {
    event_name: 'Lead',
    event_time: Math.floor(Date.now() / 1000),
    event_id: params.eventId || `lead_${Date.now()}`,
    user_data: {
      em: [hashValue(params.email)],
      client_ip_address: params.ipAddress,
      client_user_agent: params.userAgent,
      fbp: params.fbp,
      fbc: params.fbc,
    },
    custom_data: {
      value: 9,
      currency: 'USD',
      content_name: 'Email Signup',
    },
    action_source: 'website',
    event_source_url: 'https://pawcasso-atelier.vercel.app',
  };

  return sendConversionEvent(event);
}

/**
 * Track InitiateCheckout event server-side
 */
export async function trackInitiateCheckoutServerSide(params: {
  email: string;
  value: number;
  contentIds: string[];
  ipAddress?: string;
  userAgent?: string;
  eventId?: string;
  fbp?: string;
  fbc?: string;
}): Promise<boolean> {
  const event: ConversionEvent = {
    event_name: 'InitiateCheckout',
    event_time: Math.floor(Date.now() / 1000),
    event_id: params.eventId || `checkout_${Date.now()}`,
    user_data: {
      em: [hashValue(params.email)],
      client_ip_address: params.ipAddress,
      client_user_agent: params.userAgent,
      fbp: params.fbp,
      fbc: params.fbc,
    },
    custom_data: {
      value: params.value,
      currency: 'USD',
      content_ids: params.contentIds,
      content_type: 'product',
      num_items: 1,
    },
    action_source: 'website',
    event_source_url: 'https://pawcasso-atelier.vercel.app/order',
  };

  return sendConversionEvent(event);
}

/**
 * Get Event Match Quality Score
 * Higher score = better attribution and audience building
 *
 * Factors:
 * - Email: +30 points
 * - Phone: +25 points
 * - First name + Last name: +20 points
 * - City + State + Zip: +15 points
 * - IP Address: +10 points
 * - User Agent: +5 points
 * - fbp/fbc cookies: +10 points
 *
 * Target: 6.0+ (good), 8.0+ (excellent)
 */
export function estimateEventMatchQuality(userData: ConversionEvent['user_data']): number {
  let score = 0;

  if (userData.em && userData.em.length > 0) score += 3.0;
  if (userData.ph && userData.ph.length > 0) score += 2.5;
  if (userData.fn && userData.fn.length > 0 && userData.ln && userData.ln.length > 0) score += 2.0;
  if (userData.ct && userData.st && userData.zp) score += 1.5;
  if (userData.client_ip_address) score += 1.0;
  if (userData.client_user_agent) score += 0.5;
  if (userData.fbp || userData.fbc) score += 1.0;

  return Math.min(score, 10.0);
}

/**
 * Extract Facebook cookies from request headers
 */
export function extractFacebookCookies(cookieHeader?: string): {
  fbp?: string;
  fbc?: string;
} {
  if (!cookieHeader) return {};

  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return {
    fbp: cookies._fbp,
    fbc: cookies._fbc,
  };
}

/**
 * Generate event ID for deduplication between client-side and server-side events
 */
export function generateEventId(prefix: string): string {
  return `${prefix}_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
}
