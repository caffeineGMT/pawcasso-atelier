import Stripe from "stripe";

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
}: {
  tier: TierId;
  customerEmail: string;
  customerName: string;
  petName: string;
  style: string;
  notes?: string;
  petPhotoUrl?: string;
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

  const session = await stripe.checkout.sessions.create({
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
    },
    success_url: `${baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/order?canceled=true`,
  });

  return session;
}
