/**
 * Meta Conversions API (Server-Side Tracking)
 *
 * Implements server-side event tracking to Meta for:
 * - Better attribution (bypasses iOS 14.5+ tracking limitations)
 * - Improved data accuracy
 * - Better retargeting audience quality
 *
 * Requires: META_PIXEL_ACCESS_TOKEN in .env
 */

import crypto from 'crypto';

interface ServerEvent {
  event_name: string;
  event_time: number;
  user_data: {
    em?: string;  // Email (hashed SHA-256)
    ph?: string;  // Phone (hashed SHA-256)
    client_ip_address?: string;
    client_user_agent?: string;
    fbc?: string; // Facebook click ID
    fbp?: string; // Facebook browser ID
  };
  custom_data?: {
    content_ids?: string[];
    content_name?: string;
    content_type?: string;
    value?: number;
    currency?: string;
    num_items?: number;
  };
  event_source_url?: string;
  action_source: 'website';
}

/**
 * Hash data for user_data fields (PII protection)
 */
function hashData(data: string): string {
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
}

/**
 * Send event to Meta Conversions API
 */
export async function sendMetaServerEvent(params: {
  event_name: string;
  email?: string;
  phone?: string;
  ip?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  value?: number;
  currency?: string;
  num_items?: number;
  event_source_url?: string;
}): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_PIXEL_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.warn('[Meta CAPI] Missing credentials - skipping server-side tracking');
    return;
  }

  // Build user_data with hashed PII
  const user_data: ServerEvent['user_data'] = {
    client_ip_address: params.ip,
    client_user_agent: params.userAgent,
    fbc: params.fbc,
    fbp: params.fbp,
  };

  if (params.email) {
    user_data.em = hashData(params.email);
  }

  if (params.phone) {
    user_data.ph = hashData(params.phone);
  }

  // Build custom_data
  const custom_data: ServerEvent['custom_data'] = {};
  if (params.content_ids) custom_data.content_ids = params.content_ids;
  if (params.content_name) custom_data.content_name = params.content_name;
  if (params.content_type) custom_data.content_type = params.content_type;
  if (params.value) custom_data.value = params.value;
  if (params.currency) custom_data.currency = params.currency;
  if (params.num_items) custom_data.num_items = params.num_items;

  // Build server event
  const serverEvent: ServerEvent = {
    event_name: params.event_name,
    event_time: Math.floor(Date.now() / 1000),
    user_data,
    custom_data: Object.keys(custom_data).length > 0 ? custom_data : undefined,
    event_source_url: params.event_source_url,
    action_source: 'website',
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [serverEvent],
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('[Meta CAPI] Error:', result);
    } else {
      console.log('[Meta CAPI] Event sent:', params.event_name);
    }
  } catch (error) {
    console.error('[Meta CAPI] Failed to send event:', error);
  }
}

/**
 * Track PageView server-side
 */
export async function trackServerPageView(params: {
  email?: string;
  ip?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
  url?: string;
}) {
  return sendMetaServerEvent({
    event_name: 'PageView',
    ...params,
    event_source_url: params.url,
  });
}

/**
 * Track ViewContent server-side
 */
export async function trackServerViewContent(params: {
  email?: string;
  ip?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  value?: number;
  currency?: string;
  url?: string;
}) {
  return sendMetaServerEvent({
    event_name: 'ViewContent',
    ...params,
    event_source_url: params.url,
  });
}

/**
 * Track InitiateCheckout server-side
 */
export async function trackServerInitiateCheckout(params: {
  email?: string;
  ip?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
  content_ids: string[];
  content_name?: string;
  content_type?: string;
  value: number;
  currency?: string;
  num_items?: number;
  url?: string;
}) {
  return sendMetaServerEvent({
    event_name: 'InitiateCheckout',
    ...params,
    currency: params.currency || 'USD',
    event_source_url: params.url,
  });
}

/**
 * Track Purchase server-side
 */
export async function trackServerPurchase(params: {
  email: string;
  ip?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
  content_ids: string[];
  content_name?: string;
  content_type?: string;
  value: number;
  currency?: string;
  num_items?: number;
  url?: string;
}) {
  return sendMetaServerEvent({
    event_name: 'Purchase',
    ...params,
    currency: params.currency || 'USD',
    event_source_url: params.url,
  });
}

/**
 * Track AddToCart server-side
 */
export async function trackServerAddToCart(params: {
  email?: string;
  ip?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
  content_ids: string[];
  content_name?: string;
  content_type?: string;
  value: number;
  currency?: string;
  url?: string;
}) {
  return sendMetaServerEvent({
    event_name: 'AddToCart',
    ...params,
    currency: params.currency || 'USD',
    event_source_url: params.url,
  });
}

/**
 * Track Lead server-side (email capture)
 */
export async function trackServerLead(params: {
  email: string;
  ip?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
  value?: number;
  currency?: string;
  url?: string;
}) {
  return sendMetaServerEvent({
    event_name: 'Lead',
    ...params,
    currency: params.currency || 'USD',
    content_name: 'Email Signup',
    event_source_url: params.url,
  });
}
