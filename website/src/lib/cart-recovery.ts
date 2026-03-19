import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';
import Stripe from 'stripe';
import { render } from '@react-email/render';
import { AbandonedCartEmail } from './email-templates/abandoned-cart';
import { AbandonedCart24hrEmail } from './email-templates/abandoned-cart-24hr';
import { AbandonedCart72hrEmail } from './email-templates/abandoned-cart-72hr';

const prisma = new PrismaClient();

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || 'placeholder');
}

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || 'placeholder', {
    apiVersion: '2026-02-25.clover',
  });
}

/**
 * Generate a unique discount code for cart recovery
 */
export function generateRecoveryDiscountCode(emailSequence: 1 | 2 | 3): string {
  const prefix = emailSequence === 1 ? 'CART10' : emailSequence === 2 ? 'CART15' : 'CART20';
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}-${random}`;
}

/**
 * Create Stripe discount code (coupon) for cart recovery
 */
export async function createStripeDiscountCode(code: string, percentOff: number): Promise<void> {
  const stripe = getStripe();

  try {
    // Create coupon
    await stripe.coupons.create({
      id: code,
      percent_off: percentOff,
      duration: 'once',
      max_redemptions: 1,
      metadata: {
        type: 'cart_recovery',
      },
    });

    console.log(`✅ Created Stripe coupon: ${code} (${percentOff}% off)`);
  } catch (error: unknown) {
    // If coupon already exists, that's okay
    if (error instanceof Error && error.message.includes('already exists')) {
      console.log(`⚠️  Coupon ${code} already exists, skipping creation`);
    } else {
      console.error(`❌ Failed to create Stripe coupon ${code}:`, error);
      throw error;
    }
  }
}

/**
 * Track abandoned cart when checkout session is created
 */
export async function trackAbandonedCart(params: {
  stripeSessionId: string;
  customerEmail: string;
  customerName: string;
  tier: string;
  amount: number;
  petName: string;
  style: string;
  notes?: string;
  petPhotoUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referralCode?: string;
  discountCode?: string;
}): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  // Generate discount codes for all 3 emails upfront
  const discountCode1 = generateRecoveryDiscountCode(1);
  const discountCode2 = generateRecoveryDiscountCode(2);
  const discountCode3 = generateRecoveryDiscountCode(3);

  // Create Stripe coupons
  await Promise.all([
    createStripeDiscountCode(discountCode1, 10),
    createStripeDiscountCode(discountCode2, 15),
    createStripeDiscountCode(discountCode3, 20),
  ]);

  await prisma.abandonedCart.create({
    data: {
      stripeSessionId: params.stripeSessionId,
      customerEmail: params.customerEmail,
      customerName: params.customerName,
      tier: params.tier,
      amount: params.amount,
      petName: params.petName,
      style: params.style,
      notes: params.notes || '',
      petPhotoUrl: params.petPhotoUrl || '',
      utmSource: params.utmSource || null,
      utmMedium: params.utmMedium || null,
      utmCampaign: params.utmCampaign || null,
      referralCode: params.referralCode || null,
      discountCode: params.discountCode || null,
      discountCode1,
      discountCode2,
      discountCode3,
      status: 'abandoned',
      expiresAt,
    },
  });

  console.log(`✅ Tracked abandoned cart for ${params.customerEmail} (${params.tier} tier)`);
}

/**
 * Mark cart as recovered when payment succeeds
 */
export async function markCartAsRecovered(
  stripeSessionId: string,
  orderId: string
): Promise<void> {
  const cart = await prisma.abandonedCart.findUnique({
    where: { stripeSessionId },
  });

  if (!cart) {
    console.log(`⚠️  No abandoned cart found for session ${stripeSessionId}`);
    return;
  }

  await prisma.abandonedCart.update({
    where: { id: cart.id },
    data: {
      status: 'recovered',
      recovered: true,
      recoveredAt: new Date(),
      recoveredOrderId: orderId,
    },
  });

  console.log(`✅ Marked cart ${cart.id} as recovered (order: ${orderId})`);
}

/**
 * Send recovery email (1hr, 24hr, or 72hr)
 */
export async function sendRecoveryEmail(
  cartId: string,
  emailSequence: 1 | 2 | 3
): Promise<boolean> {
  const cart = await prisma.abandonedCart.findUnique({
    where: { id: cartId },
  });

  if (!cart) {
    console.error(`❌ Cart not found: ${cartId}`);
    return false;
  }

  if (cart.recovered) {
    console.log(`⚠️  Cart ${cartId} already recovered, skipping email`);
    return false;
  }

  const resend = getResend();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://pawcasso-atelier.vercel.app';

  // Get the appropriate discount code and template
  const discountCode =
    emailSequence === 1
      ? cart.discountCode1
      : emailSequence === 2
      ? cart.discountCode2
      : cart.discountCode3;

  if (!discountCode) {
    console.error(`❌ No discount code found for cart ${cartId} email ${emailSequence}`);
    return false;
  }

  // Build checkout URL with discount code pre-applied
  const checkoutUrl = `${baseUrl}/order?recover=${cart.stripeSessionId}&discount=${discountCode}`;

  // Render the appropriate email template
  let emailHtml: string;
  let subject: string;

  if (emailSequence === 1) {
    emailHtml = await render(
      AbandonedCartEmail({
        tier: cart.tier,
        petName: cart.petName,
        discountCode,
        checkoutUrl,
      })
    );
    subject = `Your ${cart.tier} portrait for ${cart.petName} is waiting — 10% off inside!`;
  } else if (emailSequence === 2) {
    emailHtml = await render(
      AbandonedCart24hrEmail({
        tier: cart.tier,
        petName: cart.petName,
        discountCode,
        checkoutUrl,
      })
    );
    subject = `We increased your discount to 15% — ${cart.petName}'s portrait awaits!`;
  } else {
    emailHtml = await render(
      AbandonedCart72hrEmail({
        tier: cart.tier,
        petName: cart.petName,
        discountCode,
        checkoutUrl,
      })
    );
    subject = `FINAL OFFER: 20% off ${cart.petName}'s portrait — Last chance!`;
  }

  try {
    await resend.emails.send({
      from: 'Pawcasso Atelier <orders@pawcasso-atelier.com>',
      to: cart.customerEmail,
      subject,
      html: emailHtml,
    });

    // Update cart with email sent timestamp
    const updateData: Record<string, unknown> = {
      recoveryAttempts: { increment: 1 },
    };

    if (emailSequence === 1) {
      updateData.email1SentAt = new Date();
      updateData.status = 'email1_sent';
    } else if (emailSequence === 2) {
      updateData.email2SentAt = new Date();
      updateData.status = 'email2_sent';
    } else {
      updateData.email3SentAt = new Date();
      updateData.status = 'email3_sent';
    }

    await prisma.abandonedCart.update({
      where: { id: cart.id },
      data: updateData,
    });

    console.log(
      `✅ Sent recovery email ${emailSequence} to ${cart.customerEmail} (cart: ${cart.id})`
    );
    return true;
  } catch (error: unknown) {
    console.error(`❌ Failed to send recovery email ${emailSequence} for cart ${cartId}:`, error);
    return false;
  }
}

/**
 * Get carts ready for recovery emails
 */
export async function getCartsForRecovery(): Promise<{
  oneHour: string[];
  twentyFourHour: string[];
  seventyTwoHour: string[];
}> {
  const now = new Date();

  // 1 hour ago (with 5 min buffer)
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneHourBuffer = new Date(now.getTime() - 55 * 60 * 1000);

  // 24 hours ago (with 1 hour buffer)
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twentyFourHourBuffer = new Date(now.getTime() - 23 * 60 * 60 * 1000);

  // 72 hours ago (with 1 hour buffer)
  const seventyTwoHoursAgo = new Date(now.getTime() - 72 * 60 * 60 * 1000);
  const seventyTwoHourBuffer = new Date(now.getTime() - 71 * 60 * 60 * 1000);

  // Get carts for 1hr email (abandoned status, created ~1hr ago, no email sent)
  const oneHourCarts = await prisma.abandonedCart.findMany({
    where: {
      status: 'abandoned',
      recovered: false,
      email1SentAt: null,
      createdAt: {
        gte: oneHourBuffer,
        lte: oneHourAgo,
      },
    },
    select: { id: true },
  });

  // Get carts for 24hr email (email1 sent, ~24hrs since email1, no email2 sent)
  const twentyFourHourCarts = await prisma.abandonedCart.findMany({
    where: {
      status: 'email1_sent',
      recovered: false,
      email2SentAt: null,
      email1SentAt: {
        gte: twentyFourHourBuffer,
        lte: twentyFourHoursAgo,
      },
    },
    select: { id: true },
  });

  // Get carts for 72hr email (email2 sent, ~72hrs since email2, no email3 sent)
  const seventyTwoHourCarts = await prisma.abandonedCart.findMany({
    where: {
      status: 'email2_sent',
      recovered: false,
      email3SentAt: null,
      email2SentAt: {
        gte: seventyTwoHourBuffer,
        lte: seventyTwoHoursAgo,
      },
    },
    select: { id: true },
  });

  return {
    oneHour: oneHourCarts.map((c) => c.id),
    twentyFourHour: twentyFourHourCarts.map((c) => c.id),
    seventyTwoHour: seventyTwoHourCarts.map((c) => c.id),
  };
}
