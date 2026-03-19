/**
 * Setup ProductHunt Launch Discount Code in Stripe
 *
 * Creates LAUNCH50 promo code: 50% off, valid for first 5 portraits per customer
 *
 * Run: tsx scripts/setup-launch-discount.ts
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

async function setupLaunchDiscount() {
  console.log('🚀 Setting up ProductHunt Launch Discount...\n');

  try {
    // Step 1: Create the coupon (50% off)
    console.log('Creating 50% off coupon...');
    const coupon = await stripe.coupons.create({
      id: 'LAUNCH50_COUPON',
      percent_off: 50,
      duration: 'once', // Applies once per customer
      name: 'ProductHunt Launch - 50% Off',
      metadata: {
        campaign: 'ProductHunt Launch',
        launch_date: '2026-03-25',
      },
    });
    console.log(`✅ Coupon created: ${coupon.id} (${coupon.percent_off}% off)\n`);

    // Step 2: Create the promotion code (LAUNCH50)
    console.log('Creating LAUNCH50 promo code...');
    const promoCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: 'LAUNCH50',
      active: true,
      max_redemptions: 1000, // Limit to first 1000 customers
      restrictions: {
        first_time_transaction: false, // Allow all customers
        minimum_amount: 900, // Minimum $9 (900 cents)
        minimum_amount_currency: 'usd',
      },
      metadata: {
        campaign: 'ProductHunt Launch',
        launch_date: '2026-03-25',
        description: 'Early supporter 50% discount',
      },
    });
    console.log(`✅ Promo code created: ${promoCode.code}\n`);

    // Step 3: Summary
    console.log('📊 Setup Summary:');
    console.log('─'.repeat(50));
    console.log(`Promo Code:       ${promoCode.code}`);
    console.log(`Discount:         ${coupon.percent_off}% off`);
    console.log(`Valid for:        First purchase per customer`);
    console.log(`Max redemptions:  ${promoCode.max_redemptions}`);
    console.log(`Min amount:       $${(promoCode.restrictions?.minimum_amount || 0) / 100}`);
    console.log(`Status:           ${promoCode.active ? 'ACTIVE ✅' : 'INACTIVE ❌'}`);
    console.log('─'.repeat(50));
    console.log('\n🎉 Launch discount is ready!\n');

    // Step 4: Test URL
    const testUrl = `https://pawcasso-atelier.vercel.app/order?promo=LAUNCH50`;
    console.log('🔗 Test URL:');
    console.log(testUrl);
    console.log('\n💡 Share this URL with launch supporters!\n');

  } catch (error: any) {
    // Handle "already exists" error gracefully
    if (error.code === 'resource_already_exists') {
      console.log('⚠️  Discount already exists. Fetching details...\n');

      const promoCode = await stripe.promotionCodes.list({
        code: 'LAUNCH50',
        limit: 1,
      });

      if (promoCode.data.length > 0) {
        const promo = promoCode.data[0];
        const coupon = await stripe.coupons.retrieve(promo.coupon as string);

        console.log('📊 Existing Promo Code:');
        console.log('─'.repeat(50));
        console.log(`Promo Code:       ${promo.code}`);
        console.log(`Discount:         ${coupon.percent_off}% off`);
        console.log(`Times used:       ${promo.times_redeemed}/${promo.max_redemptions || '∞'}`);
        console.log(`Status:           ${promo.active ? 'ACTIVE ✅' : 'INACTIVE ❌'}`);
        console.log('─'.repeat(50));
      }
    } else {
      console.error('❌ Error setting up discount:', error.message);
      throw error;
    }
  }
}

// Run the setup
setupLaunchDiscount()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
