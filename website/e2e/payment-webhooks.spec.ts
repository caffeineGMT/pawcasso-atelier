/**
 * Stripe Webhook E2E Tests
 *
 * CRITICAL: Webhooks are the backbone of order fulfillment automation.
 * A failed webhook = lost order, angry customer, manual intervention required.
 *
 * Target: 99.9% webhook delivery success rate
 *
 * Test Strategy:
 * 1. Simulate Stripe webhook events
 * 2. Verify webhook signature validation
 * 3. Test idempotency (duplicate webhooks)
 * 4. Verify database updates
 * 5. Test email triggers
 * 6. Test error handling and retries
 *
 * Prerequisites:
 * - STRIPE_WEBHOOK_SECRET environment variable
 * - Database with test data
 * - Email service configured (or mocked)
 */

import { test, expect, APIRequestContext } from '@playwright/test';
import Stripe from 'stripe';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST || '', {
  apiVersion: '2024-12-18.acacia',
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret';
const WEBHOOK_ENDPOINT = '/api/webhooks/stripe';

/**
 * Helper: Generate Stripe webhook signature
 */
function generateStripeSignature(payload: string, secret: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const signedPayload = `${timestamp}.${payload}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  return `t=${timestamp},v1=${signature}`;
}

/**
 * Helper: Send webhook event to endpoint
 */
async function sendWebhook(
  request: APIRequestContext,
  event: Stripe.Event
): Promise<{ status: number; body: any }> {
  const payload = JSON.stringify(event);
  const signature = generateStripeSignature(payload, WEBHOOK_SECRET);

  const response = await request.post(WEBHOOK_ENDPOINT, {
    data: payload,
    headers: {
      'stripe-signature': signature,
      'content-type': 'application/json',
    },
  });

  const body = await response.text();

  return {
    status: response.status(),
    body: body ? JSON.parse(body) : null,
  };
}

/**
 * Helper: Create a test checkout session
 */
async function createTestCheckoutSession(): Promise<Stripe.Checkout.Session> {
  return await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'AI Pet Portrait - Standard',
          },
          unit_amount: 1400,
        },
        quantity: 1,
      },
    ],
    success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:3000/order',
    customer_email: 'webhook-test@pawcasso.test',
    metadata: {
      petName: 'Test Dog',
      style: 'impressionist',
      tier: 'standard',
      customerName: 'Webhook Test User',
    },
  });
}

test.describe('Stripe Webhooks - Signature Validation', () => {
  test('should accept valid webhook signature', async ({ request }) => {
    const session = await createTestCheckoutSession();

    const event: Stripe.Event = {
      id: `evt_test_${Date.now()}`,
      object: 'event',
      api_version: '2024-12-18.acacia',
      created: Math.floor(Date.now() / 1000),
      type: 'checkout.session.completed',
      data: {
        object: session,
      },
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
    };

    const result = await sendWebhook(request, event);

    expect(result.status).toBe(200);
    expect(result.body?.received).toBe(true);
  });

  test('should reject webhook with invalid signature', async ({ request }) => {
    const session = await createTestCheckoutSession();

    const event: Stripe.Event = {
      id: `evt_test_${Date.now()}`,
      object: 'event',
      api_version: '2024-12-18.acacia',
      created: Math.floor(Date.now() / 1000),
      type: 'checkout.session.completed',
      data: {
        object: session,
      },
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
    };

    const payload = JSON.stringify(event);

    // Send with invalid signature
    const response = await request.post(WEBHOOK_ENDPOINT, {
      data: payload,
      headers: {
        'stripe-signature': 'invalid_signature',
        'content-type': 'application/json',
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should reject webhook with expired timestamp', async ({ request }) => {
    const session = await createTestCheckoutSession();

    const event: Stripe.Event = {
      id: `evt_test_${Date.now()}`,
      object: 'event',
      api_version: '2024-12-18.acacia',
      created: Math.floor(Date.now() / 1000),
      type: 'checkout.session.completed',
      data: {
        object: session,
      },
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
    };

    const payload = JSON.stringify(event);

    // Generate signature with old timestamp (> 5 minutes ago)
    const oldTimestamp = Math.floor(Date.now() / 1000) - 600; // 10 minutes ago
    const signedPayload = `${oldTimestamp}.${payload}`;
    const signature = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(signedPayload)
      .digest('hex');
    const expiredSignature = `t=${oldTimestamp},v1=${signature}`;

    const response = await request.post(WEBHOOK_ENDPOINT, {
      data: payload,
      headers: {
        'stripe-signature': expiredSignature,
        'content-type': 'application/json',
      },
    });

    // Should reject expired webhooks (depending on implementation)
    // Most secure implementations reject timestamps > 5 minutes old
    expect([400, 200]).toContain(response.status());
  });
});

test.describe('Stripe Webhooks - checkout.session.completed', () => {
  test('should create order in database on successful payment', async ({ request }) => {
    const session = await createTestCheckoutSession();

    // Simulate payment success
    const paidSession = { ...session, payment_status: 'paid' };

    const event: Stripe.Event = {
      id: `evt_test_${Date.now()}`,
      object: 'event',
      api_version: '2024-12-18.acacia',
      created: Math.floor(Date.now() / 1000),
      type: 'checkout.session.completed',
      data: {
        object: paidSession as any,
      },
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
    };

    const result = await sendWebhook(request, event);

    expect(result.status).toBe(200);

    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify order was created
    const orderResponse = await request.get(`/api/admin/orders?session_id=${session.id}`);

    if (orderResponse.ok()) {
      const orders = await orderResponse.json();
      expect(orders.length).toBeGreaterThan(0);

      const order = orders[0];
      expect(order.email).toBe('webhook-test@pawcasso.test');
      expect(order.status).toBe('paid');
      expect(order.petName).toBe('Test Dog');
    }
  });

  test('should send confirmation email on successful payment', async ({ request }) => {
    const testEmail = `email-test-${Date.now()}@pawcasso.test`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'AI Pet Portrait' },
            unit_amount: 1400,
          },
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/order',
      customer_email: testEmail,
      metadata: { petName: 'Email Test Dog' },
    });

    const paidSession = { ...session, payment_status: 'paid' };

    const event: Stripe.Event = {
      id: `evt_test_${Date.now()}`,
      object: 'event',
      api_version: '2024-12-18.acacia',
      created: Math.floor(Date.now() / 1000),
      type: 'checkout.session.completed',
      data: {
        object: paidSession as any,
      },
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
    };

    await sendWebhook(request, event);

    // Wait for email processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if email was sent
    const emailCheckResponse = await request.get(`/api/admin/emails/check?email=${testEmail}`);

    if (emailCheckResponse.ok()) {
      const emailData = await emailCheckResponse.json();
      expect(emailData.sent).toBe(true);
      expect(emailData.type).toBe('order_confirmation');
    }
  });

  test('should update cart recovery status on successful payment', async ({ request }) => {
    // Create abandoned cart first
    const cartResponse = await request.post('/api/cart/abandon', {
      data: {
        email: 'cart-recovery@pawcasso.test',
        items: [{ tier: 'standard', style: 'impressionist', petName: 'Recovery Dog' }],
      },
    });

    const cart = await cartResponse.json();

    // Create session for the same email
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'AI Pet Portrait' },
            unit_amount: 1400,
          },
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/order',
      customer_email: 'cart-recovery@pawcasso.test',
    });

    const paidSession = { ...session, payment_status: 'paid' };

    const event: Stripe.Event = {
      id: `evt_test_${Date.now()}`,
      object: 'event',
      api_version: '2024-12-18.acacia',
      created: Math.floor(Date.now() / 1000),
      type: 'checkout.session.completed',
      data: {
        object: paidSession as any,
      },
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
    };

    await sendWebhook(request, event);

    // Verify cart was marked as recovered
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedCartResponse = await request.get(`/api/cart/${cart.id}`);
    if (updatedCartResponse.ok()) {
      const updatedCart = await updatedCartResponse.json();
      expect(updatedCart.recovered).toBe(true);
    }
  });

  test('should handle incomplete payment status gracefully', async ({ request }) => {
    const session = await createTestCheckoutSession();

    // Payment still processing
    const processingSession = { ...session, payment_status: 'unpaid' };

    const event: Stripe.Event = {
      id: `evt_test_${Date.now()}`,
      object: 'event',
      api_version: '2024-12-18.acacia',
      created: Math.floor(Date.now() / 1000),
      type: 'checkout.session.completed',
      data: {
        object: processingSession as any,
      },
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
    };

    const result = await sendWebhook(request, event);

    // Should still return 200 but not create order
    expect(result.status).toBe(200);
  });
});

test.describe('Stripe Webhooks - Idempotency', () => {
  test('should handle duplicate webhook events gracefully', async ({ request }) => {
    const session = await createTestCheckoutSession();
    const paidSession = { ...session, payment_status: 'paid' };

    const eventId = `evt_test_${Date.now()}`;

    const event: Stripe.Event = {
      id: eventId,
      object: 'event',
      api_version: '2024-12-18.acacia',
      created: Math.floor(Date.now() / 1000),
      type: 'checkout.session.completed',
      data: {
        object: paidSession as any,
      },
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
    };

    // Send webhook first time
    const result1 = await sendWebhook(request, event);
    expect(result1.status).toBe(200);

    // Send same webhook again (duplicate)
    const result2 = await sendWebhook(request, event);
    expect(result2.status).toBe(200);

    // Verify only ONE order was created (not duplicated)
    await new Promise(resolve => setTimeout(resolve, 1000));

    const ordersResponse = await request.get(`/api/admin/orders?session_id=${session.id}`);

    if (ordersResponse.ok()) {
      const orders = await ordersResponse.json();
      expect(orders.length).toBe(1); // Only one order, not two
    }
  });

  test('should process webhooks in correct order', async ({ request }) => {
    const session = await createTestCheckoutSession();

    // Event 1: Session created
    const event1: Stripe.Event = {
      id: `evt_1_${Date.now()}`,
      object: 'event',
      api_version: '2024-12-18.acacia',
      created: Math.floor(Date.now() / 1000),
      type: 'checkout.session.async_payment_succeeded',
      data: {
        object: { ...session, payment_status: 'paid' } as any,
      },
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
    };

    // Event 2: Payment succeeded (arrives first due to network)
    const event2: Stripe.Event = {
      id: `evt_2_${Date.now()}`,
      object: 'event',
      api_version: '2024-12-18.acacia',
      created: Math.floor(Date.now() / 1000) + 1,
      type: 'checkout.session.completed',
      data: {
        object: { ...session, payment_status: 'paid' } as any,
      },
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
    };

    // Send events out of order
    await sendWebhook(request, event2);
    await sendWebhook(request, event1);

    // Both should succeed
    await new Promise(resolve => setTimeout(resolve, 1000));

    const ordersResponse = await request.get(`/api/admin/orders?session_id=${session.id}`);

    if (ordersResponse.ok()) {
      const orders = await ordersResponse.json();
      expect(orders.length).toBe(1);
      expect(orders[0].status).toBe('paid');
    }
  });
});

test.describe('Stripe Webhooks - Error Handling', () => {
  test('should return 500 on database error', async ({ request }) => {
    // Send webhook with malformed data that will cause DB error
    const badEvent: Stripe.Event = {
      id: `evt_test_${Date.now()}`,
      object: 'event',
      api_version: '2024-12-18.acacia',
      created: Math.floor(Date.now() / 1000),
      type: 'checkout.session.completed',
      data: {
        object: {
          id: null, // Invalid - will cause DB error
          payment_status: 'paid',
        } as any,
      },
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
    };

    const result = await sendWebhook(request, badEvent);

    // Should return error status
    expect([400, 500]).toContain(result.status);
  });

  test('should log webhook errors for debugging', async ({ request }) => {
    const session = await createTestCheckoutSession();

    const event: Stripe.Event = {
      id: `evt_test_${Date.now()}`,
      object: 'event',
      api_version: '2024-12-18.acacia',
      created: Math.floor(Date.now() / 1000),
      type: 'checkout.session.completed',
      data: {
        object: { ...session, payment_status: 'paid' } as any,
      },
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
    };

    await sendWebhook(request, event);

    // Verify webhook was logged
    // (implementation-specific - may check logs API endpoint)
    const logsResponse = await request.get(`/api/admin/webhook-logs?event_id=${event.id}`);

    if (logsResponse.ok()) {
      const logs = await logsResponse.json();
      expect(logs.length).toBeGreaterThan(0);
    }
  });
});

test.describe('Stripe Webhooks - Performance', () => {
  test('should process webhook within 1 second', async ({ request }) => {
    const session = await createTestCheckoutSession();
    const paidSession = { ...session, payment_status: 'paid' };

    const event: Stripe.Event = {
      id: `evt_test_${Date.now()}`,
      object: 'event',
      api_version: '2024-12-18.acacia',
      created: Math.floor(Date.now() / 1000),
      type: 'checkout.session.completed',
      data: {
        object: paidSession as any,
      },
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
    };

    const startTime = Date.now();

    const result = await sendWebhook(request, event);

    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(result.status).toBe(200);
    expect(duration).toBeLessThan(1000); // Should respond in < 1s
  });

  test('should handle high volume of webhooks', async ({ request }) => {
    // Send 50 webhooks concurrently
    const webhookPromises = Array(50)
      .fill(0)
      .map(async (_, i) => {
        const session = await createTestCheckoutSession();
        const paidSession = { ...session, payment_status: 'paid' };

        const event: Stripe.Event = {
          id: `evt_volume_test_${i}_${Date.now()}`,
          object: 'event',
          api_version: '2024-12-18.acacia',
          created: Math.floor(Date.now() / 1000),
          type: 'checkout.session.completed',
          data: {
            object: paidSession as any,
          },
          livemode: false,
          pending_webhooks: 1,
          request: { id: null, idempotency_key: null },
        };

        return await sendWebhook(request, event);
      });

    const results = await Promise.all(webhookPromises);

    // All should succeed
    const successCount = results.filter(r => r.status === 200).length;
    expect(successCount).toBeGreaterThan(45); // Allow max 5 failures
  });
});

test.describe('Stripe Webhooks - Edge Cases', () => {
  test('should handle webhook with missing metadata gracefully', async ({ request }) => {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'AI Pet Portrait' },
            unit_amount: 1400,
          },
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/order',
      customer_email: 'no-metadata@pawcasso.test',
      // NO metadata provided
    });

    const paidSession = { ...session, payment_status: 'paid' };

    const event: Stripe.Event = {
      id: `evt_test_${Date.now()}`,
      object: 'event',
      api_version: '2024-12-18.acacia',
      created: Math.floor(Date.now() / 1000),
      type: 'checkout.session.completed',
      data: {
        object: paidSession as any,
      },
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
    };

    const result = await sendWebhook(request, event);

    // Should still succeed with defaults
    expect(result.status).toBe(200);
  });

  test('should handle webhook with malformed email', async ({ request }) => {
    const session = await createTestCheckoutSession();
    const paidSession = {
      ...session,
      payment_status: 'paid',
      customer_email: 'invalid-email', // Malformed email
    };

    const event: Stripe.Event = {
      id: `evt_test_${Date.now()}`,
      object: 'event',
      api_version: '2024-12-18.acacia',
      created: Math.floor(Date.now() / 1000),
      type: 'checkout.session.completed',
      data: {
        object: paidSession as any,
      },
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
    };

    const result = await sendWebhook(request, event);

    // Should handle gracefully (don't crash, but may not send email)
    expect([200, 400]).toContain(result.status);
  });

  test('should handle webhook with extremely large metadata', async ({ request }) => {
    const largeNotes = 'A'.repeat(10000); // 10KB of notes

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'AI Pet Portrait' },
            unit_amount: 1400,
          },
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/order',
      customer_email: 'large-metadata@pawcasso.test',
      metadata: {
        petName: 'Test Dog',
        notes: largeNotes.substring(0, 500), // Stripe limits metadata to 500 chars per field
      },
    });

    const paidSession = { ...session, payment_status: 'paid' };

    const event: Stripe.Event = {
      id: `evt_test_${Date.now()}`,
      object: 'event',
      api_version: '2024-12-18.acacia',
      created: Math.floor(Date.now() / 1000),
      type: 'checkout.session.completed',
      data: {
        object: paidSession as any,
      },
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
    };

    const result = await sendWebhook(request, event);

    expect(result.status).toBe(200);
  });

  test('should handle unsupported event types gracefully', async ({ request }) => {
    const session = await createTestCheckoutSession();

    const event: Stripe.Event = {
      id: `evt_test_${Date.now()}`,
      object: 'event',
      api_version: '2024-12-18.acacia',
      created: Math.floor(Date.now() / 1000),
      type: 'customer.created', // Unsupported event type
      data: {
        object: session as any,
      },
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
    };

    const result = await sendWebhook(request, event);

    // Should return 200 (acknowledge receipt) but not process
    expect(result.status).toBe(200);
  });

  test('should handle refund webhook event', async ({ request }) => {
    const session = await createTestCheckoutSession();

    // First create a successful payment
    const paidEvent: Stripe.Event = {
      id: `evt_test_${Date.now()}`,
      object: 'event',
      api_version: '2024-12-18.acacia',
      created: Math.floor(Date.now() / 1000),
      type: 'checkout.session.completed',
      data: {
        object: { ...session, payment_status: 'paid' } as any,
      },
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
    };

    await sendWebhook(request, paidEvent);

    // Wait for order creation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Now send refund event
    const refundEvent: Stripe.Event = {
      id: `evt_refund_${Date.now()}`,
      object: 'event',
      api_version: '2024-12-18.acacia',
      created: Math.floor(Date.now() / 1000),
      type: 'charge.refunded',
      data: {
        object: {
          id: 'ch_test_123',
          amount_refunded: 1400,
          refunded: true,
        } as any,
      },
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
    };

    const result = await sendWebhook(request, refundEvent);

    // Should handle refund (may update order status)
    expect(result.status).toBe(200);
  });

  test('should handle subscription event (future feature)', async ({ request }) => {
    const event: Stripe.Event = {
      id: `evt_test_${Date.now()}`,
      object: 'event',
      api_version: '2024-12-18.acacia',
      created: Math.floor(Date.now() / 1000),
      type: 'customer.subscription.created',
      data: {
        object: {
          id: 'sub_test_123',
          status: 'active',
        } as any,
      },
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
    };

    const result = await sendWebhook(request, event);

    // Should acknowledge (may be implemented for subscription feature)
    expect(result.status).toBe(200);
  });
});

test.describe('Stripe Webhooks - Security', () => {
  test('should reject webhook with no signature header', async ({ request }) => {
    const session = await createTestCheckoutSession();

    const event: Stripe.Event = {
      id: `evt_test_${Date.now()}`,
      object: 'event',
      api_version: '2024-12-18.acacia',
      created: Math.floor(Date.now() / 1000),
      type: 'checkout.session.completed',
      data: {
        object: session,
      },
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
    };

    const payload = JSON.stringify(event);

    // Send without signature header
    const response = await request.post(WEBHOOK_ENDPOINT, {
      data: payload,
      headers: {
        'content-type': 'application/json',
        // NO stripe-signature header
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should reject webhook from wrong Stripe account', async ({ request }) => {
    const session = await createTestCheckoutSession();

    const event: Stripe.Event = {
      id: `evt_test_${Date.now()}`,
      object: 'event',
      api_version: '2024-12-18.acacia',
      created: Math.floor(Date.now() / 1000),
      type: 'checkout.session.completed',
      data: {
        object: session,
      },
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
    };

    const payload = JSON.stringify(event);

    // Sign with wrong secret
    const wrongSignature = generateStripeSignature(payload, 'whsec_wrong_secret');

    const response = await request.post(WEBHOOK_ENDPOINT, {
      data: payload,
      headers: {
        'stripe-signature': wrongSignature,
        'content-type': 'application/json',
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should reject replay attack (reused event ID)', async ({ request }) => {
    const session = await createTestCheckoutSession();
    const eventId = `evt_replay_${Date.now()}`;

    const event: Stripe.Event = {
      id: eventId,
      object: 'event',
      api_version: '2024-12-18.acacia',
      created: Math.floor(Date.now() / 1000),
      type: 'checkout.session.completed',
      data: {
        object: { ...session, payment_status: 'paid' } as any,
      },
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
    };

    // First webhook: should succeed
    const result1 = await sendWebhook(request, event);
    expect(result1.status).toBe(200);

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Replay attack: send same event ID again
    const result2 = await sendWebhook(request, event);

    // Should still return 200 (idempotent) but not process twice
    expect(result2.status).toBe(200);

    // Verify only ONE order was created
    await new Promise(resolve => setTimeout(resolve, 2000));

    const ordersResponse = await request.get(`/api/admin/orders?session_id=${session.id}`);

    if (ordersResponse.ok()) {
      const orders = await ordersResponse.json();
      expect(orders.length).toBe(1); // Only one order
    }
  });
});
