import Stripe from "stripe";
import { getActivePromotion } from "./promotions";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    });
  }
  return _stripe;
}

export const PRODUCTS = {
  digital: {
    name: "Digital Portrait",
    price: 900, // $9.00 in cents
    description: "High-resolution digital portrait (4000x5000px)",
  },
} as const;

export type TierId = 'basic' | 'premium' | 'deluxe' | 'bundle';

export interface TierConfig {
  id: TierId;
  name: string;
  price: number;
  priceDisplay: string;
  features: string[];
  stripeId: string;
}

export const TIER_CONFIG: TierConfig[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9,
    priceDisplay: '$9',
    features: [
      '1 portrait',
      '24-hour delivery',
      'High-resolution digital file',
    ],
    stripeId: process.env.STRIPE_PRICE_BASIC || '',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 29,
    priceDisplay: '$29',
    features: [
      '1 portrait + 2 variations',
      '12-hour delivery',
      'High-resolution download',
      'Multiple aspect ratios',
    ],
    stripeId: process.env.STRIPE_PRICE_PREMIUM || '',
  },
  {
    id: 'deluxe',
    name: 'Deluxe',
    price: 49,
    priceDisplay: '$49',
    features: [
      '3 unique portraits',
      '6-hour delivery',
      'Print-ready files (300 DPI)',
      'Custom revisions included',
    ],
    stripeId: process.env.STRIPE_PRICE_DELUXE || '',
  },
  {
    id: 'bundle',
    name: 'Bundle',
    price: 79,
    priceDisplay: '$79',
    features: [
      '5 unique portraits',
      'Instant delivery',
      'Commercial license included',
      'Priority support',
    ],
    stripeId: process.env.STRIPE_PRICE_BUNDLE || '',
  },
];

export async function createCheckoutSession({
  tier,
  customerEmail,
  customerName,
  petName,
  style,
  notes,
  petPhotoUrl,
  discountCode,
  referralCode,
  utmSource,
  utmMedium,
  utmCampaign,
}: {
  tier: TierId;
  customerEmail: string;
  customerName: string;
  petName: string;
  style: string;
  notes?: string;
  petPhotoUrl?: string;
  discountCode?: string;
  referralCode?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}) {
  const stripe = getStripe();
  const tierConfig = TIER_CONFIG.find((t) => t.id === tier);

  if (!tierConfig) {
    throw new Error(`Invalid tier: ${tier}`);
  }

  if (!tierConfig.stripeId) {
    throw new Error(`Stripe Price ID not configured for tier: ${tier}`);
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: customerEmail,
    line_items: [
      {
        price: tierConfig.stripeId,
        quantity: 1,
      },
    ],
    metadata: {
      tier: tier,
      tierName: tierConfig.name,
      features: tierConfig.features.join(', '),
      customerName,
      petName,
      style,
      notes: notes || "",
      petPhotoUrl: petPhotoUrl || "",
      discountCode: discountCode || "",
      referralCode: referralCode || "",
      utmSource: utmSource || "",
      utmMedium: utmMedium || "",
      utmCampaign: utmCampaign || "",
    },
    // Expire session after 24 hours to trigger abandoned cart webhook
    expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
    success_url: `${baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/order?canceled=true`,
  };

  // Priority order for discounts:
  // 1. Explicit discount code from user
  // 2. Active seasonal promotion
  // 3. Referral code discount

  if (discountCode) {
    // User provided explicit discount code
    sessionParams.discounts = [{ coupon: discountCode }];
  } else {
    // Check for active seasonal promotion
    const activePromotion = getActivePromotion();

    if (activePromotion && activePromotion.couponCode) {
      // Apply active promotion discount
      sessionParams.discounts = [{ coupon: activePromotion.couponCode }];
      // Track promotion in metadata
      sessionParams.metadata = {
        ...sessionParams.metadata,
        promotionId: activePromotion.id,
        promotionName: activePromotion.name,
        promotionDiscount: activePromotion.discountPercent.toString(),
      };
    } else if (referralCode) {
      // Apply referral discount (20% off for referred friend)
      const referralCoupon = await getOrCreateReferralCoupon(stripe);
      sessionParams.discounts = [{ coupon: referralCoupon.id }];
    }
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  return session;
}

// Helper function to create/get the standard referral discount coupon
async function getOrCreateReferralCoupon(stripe: Stripe) {
  const couponId = "REFERRAL20";

  try {
    // Try to retrieve existing coupon
    const coupon = await stripe.coupons.retrieve(couponId);
    return coupon;
  } catch (error) {
    // Create new coupon if it doesn't exist
    return await stripe.coupons.create({
      id: couponId,
      percent_off: 20,
      duration: "once",
      name: "Friend Referral 20% Off",
    });
  }
}

export async function getStripeCustomerId(email: string): Promise<string> {
  const stripe = getStripe();
  const customers = await stripe.customers.list({ email, limit: 1 });
  return customers.data[0]?.id || "";
}

export interface ReferralStats {
  clicks: number;
  conversions: number;
  earnings: number;
}

export async function getReferralStats(customerId: string): Promise<ReferralStats> {
  if (!customerId) {
    return { clicks: 0, conversions: 0, earnings: 0 };
  }

  const stripe = getStripe();
  const customer = await stripe.customers.retrieve(customerId);

  if (customer.deleted) {
    return { clicks: 0, conversions: 0, earnings: 0 };
  }

  return {
    clicks: parseInt(customer.metadata.referral_clicks || "0"),
    conversions: parseInt(customer.metadata.referral_conversions || "0"),
    earnings: parseFloat(customer.metadata.referral_earnings || "0"),
  };
}
