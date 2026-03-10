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
    price: 2900, // $29.00 in cents
    description: "High-resolution digital portrait (4000x5000px)",
  },
  print: {
    name: "Print-Ready Portrait",
    price: 7900, // $79.00 in cents
    description: "Print-ready file with color-calibrated output (300 DPI)",
  },
} as const;
