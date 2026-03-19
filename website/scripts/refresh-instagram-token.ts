#!/usr/bin/env tsx
/**
 * Instagram Access Token Refresh Script
 *
 * Long-lived tokens last 60 days. Run this script before expiry
 * to exchange for a new token.
 *
 * Usage: npx tsx scripts/refresh-instagram-token.ts
 *
 * Required env vars:
 *   INSTAGRAM_ACCESS_TOKEN  - Current long-lived token
 *   FACEBOOK_APP_ID         - Facebook App ID
 *   FACEBOOK_APP_SECRET     - Facebook App Secret
 */

const GRAPH_API_BASE = 'https://graph.facebook.com/v18.0';

async function main() {
  const currentToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;

  if (!currentToken || !appId || !appSecret) {
    console.error(
      'Missing required env vars: INSTAGRAM_ACCESS_TOKEN, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET'
    );
    process.exit(1);
  }

  console.log('Refreshing Instagram access token...');

  // Check current token validity
  const debugRes = await fetch(
    `${GRAPH_API_BASE}/debug_token?input_token=${currentToken}&access_token=${appId}|${appSecret}`
  );
  const debugData = await debugRes.json();

  if (debugData.data) {
    const expiresAt = debugData.data.expires_at;
    const daysLeft = expiresAt
      ? Math.ceil((expiresAt * 1000 - Date.now()) / (1000 * 60 * 60 * 24))
      : 'unknown';
    console.log(`Current token expires in: ${daysLeft} days`);
  }

  // Exchange for new long-lived token
  const refreshRes = await fetch(
    `${GRAPH_API_BASE}/oauth/access_token?` +
      `grant_type=fb_exchange_token&` +
      `client_id=${appId}&` +
      `client_secret=${appSecret}&` +
      `fb_exchange_token=${currentToken}`
  );

  if (!refreshRes.ok) {
    const error = await refreshRes.json();
    console.error('Token refresh failed:', JSON.stringify(error, null, 2));
    process.exit(1);
  }

  const data = await refreshRes.json();
  const newToken = data.access_token;
  const expiresIn = data.expires_in;

  console.log('\nNew token obtained successfully!');
  console.log(`Expires in: ${Math.ceil(expiresIn / 86400)} days`);
  console.log('\nUpdate your environment variable:');
  console.log(`INSTAGRAM_ACCESS_TOKEN=${newToken}`);
  console.log(
    '\nUpdate in Vercel: npx vercel env add INSTAGRAM_ACCESS_TOKEN production'
  );
}

main().catch(console.error);
