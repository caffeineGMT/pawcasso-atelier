/**
 * Utility script to create Stripe coupons for all seasonal promotions
 * Run this once to set up all promotional coupons in your Stripe account
 *
 * Usage:
 * 1. Set STRIPE_SECRET_KEY in your environment
 * 2. Run: npx tsx src/lib/setup-promotion-coupons.ts
 */

import { getStripe } from "./stripe";
import { PROMOTIONS } from "./promotions";

async function setupPromotionCoupons() {
  const stripe = getStripe();

  console.log("🎉 Setting up promotional coupons in Stripe...\n");

  for (const promo of PROMOTIONS) {
    if (!promo.couponCode) {
      console.log(`⏭️  Skipping ${promo.name} (no coupon code defined)`);
      continue;
    }

    try {
      // Try to retrieve existing coupon
      const existingCoupon = await stripe.coupons.retrieve(promo.couponCode);
      console.log(`✅ Coupon ${promo.couponCode} already exists (${existingCoupon.percent_off}% off)`);
    } catch (error: any) {
      if (error.code === 'resource_missing') {
        // Coupon doesn't exist, create it
        try {
          const newCoupon = await stripe.coupons.create({
            id: promo.couponCode,
            percent_off: promo.discountPercent,
            duration: 'once',
            name: promo.name,
            metadata: {
              promotionId: promo.id,
              startDate: promo.startDate,
              endDate: promo.endDate,
            },
          });

          console.log(`✨ Created coupon ${promo.couponCode} (${newCoupon.percent_off}% off) for ${promo.name}`);
        } catch (createError: any) {
          console.error(`❌ Failed to create coupon ${promo.couponCode}:`, createError.message);
        }
      } else {
        console.error(`❌ Error checking coupon ${promo.couponCode}:`, error.message);
      }
    }
  }

  console.log("\n🎊 Promotional coupon setup complete!");
}

// Run if executed directly
if (require.main === module) {
  setupPromotionCoupons()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Fatal error:", error);
      process.exit(1);
    });
}

export { setupPromotionCoupons };
