import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface PromoCodeValidation {
  valid: boolean;
  error?: string;
  discountAmount?: number;
  discountPercent?: number;
  promoCode?: {
    id: string;
    code: string;
    name: string;
    discountType: string;
    discountPercent: number | null;
    discountAmount: number | null;
    minOrderAmount: number | null;
  };
}

/**
 * Validate a promo code and check if it can be applied to an order
 * @param code - The promo code string (e.g., "BLACKFRIDAY50")
 * @param customerEmail - Customer email for per-customer usage limits
 * @param orderAmount - Order amount in dollars
 * @param tier - Tier ID (basic, premium, deluxe, bundle)
 * @returns Validation result with discount details
 */
export async function validatePromoCode(
  code: string,
  customerEmail: string,
  orderAmount: number,
  tier: string
): Promise<PromoCodeValidation> {
  const upperCode = code.trim().toUpperCase();

  // Find the promo code in database
  const promoCode = await prisma.promoCode.findUnique({
    where: { code: upperCode },
    include: { usages: true },
  });

  // Code doesn't exist
  if (!promoCode) {
    return { valid: false, error: "Invalid promo code" };
  }

  // Code is not active
  if (!promoCode.active) {
    return { valid: false, error: "This promo code is no longer active" };
  }

  // Check if code has started
  if (promoCode.startsAt && new Date() < promoCode.startsAt) {
    return { valid: false, error: "This promo code is not yet active" };
  }

  // Check if code has expired
  if (promoCode.expiresAt && new Date() > promoCode.expiresAt) {
    return { valid: false, error: "This promo code has expired" };
  }

  // Check maximum total uses
  if (promoCode.maxUses && promoCode.currentUses >= promoCode.maxUses) {
    return { valid: false, error: "This promo code has reached its usage limit" };
  }

  // Check per-customer usage limit
  const customerUsageCount = promoCode.usages.filter(
    (usage) => usage.customerEmail === customerEmail
  ).length;

  if (customerUsageCount >= promoCode.maxUsesPerCustomer) {
    return { valid: false, error: "You have already used this promo code" };
  }

  // Check minimum order amount
  if (promoCode.minOrderAmount && orderAmount < promoCode.minOrderAmount) {
    return {
      valid: false,
      error: `Minimum order amount of $${promoCode.minOrderAmount.toFixed(2)} required`,
    };
  }

  // Check if code applies to this tier
  if (promoCode.applicableTiers) {
    try {
      const applicableTiers = JSON.parse(promoCode.applicableTiers) as string[];
      if (!applicableTiers.includes(tier)) {
        return {
          valid: false,
          error: "This promo code does not apply to the selected package",
        };
      }
    } catch (error) {
      console.error("Failed to parse applicableTiers:", error);
    }
  }

  // Calculate discount amount
  let discountAmount = 0;
  let discountPercent = 0;

  if (promoCode.discountType === "percent" && promoCode.discountPercent) {
    discountPercent = promoCode.discountPercent;
    discountAmount = (orderAmount * discountPercent) / 100;
  } else if (promoCode.discountType === "fixed_amount" && promoCode.discountAmount) {
    discountAmount = Math.min(promoCode.discountAmount, orderAmount); // Can't discount more than order amount
    discountPercent = (discountAmount / orderAmount) * 100;
  }

  return {
    valid: true,
    discountAmount,
    discountPercent,
    promoCode: {
      id: promoCode.id,
      code: promoCode.code,
      name: promoCode.name,
      discountType: promoCode.discountType,
      discountPercent: promoCode.discountPercent,
      discountAmount: promoCode.discountAmount,
      minOrderAmount: promoCode.minOrderAmount,
    },
  };
}

/**
 * Record promo code usage when an order is completed
 * @param promoCodeId - Database ID of the promo code
 * @param customerEmail - Customer email
 * @param customerName - Customer name
 * @param orderId - Stripe session ID or order ID
 * @param discountApplied - Actual discount amount in dollars
 * @param orderAmount - Original order amount before discount
 * @param finalAmount - Final amount after discount
 */
export async function recordPromoCodeUsage(
  promoCodeId: string,
  customerEmail: string,
  customerName: string,
  orderId: string,
  discountApplied: number,
  orderAmount: number,
  finalAmount: number
): Promise<void> {
  await prisma.$transaction([
    // Create usage record
    prisma.promoCodeUsage.create({
      data: {
        promoCodeId,
        customerEmail,
        customerName,
        orderId,
        discountApplied,
        orderAmount,
        finalAmount,
      },
    }),
    // Increment usage counter
    prisma.promoCode.update({
      where: { id: promoCodeId },
      data: { currentUses: { increment: 1 } },
    }),
  ]);
}

/**
 * Get promo code analytics/stats
 * @param promoCodeId - Database ID of the promo code
 */
export async function getPromoCodeStats(promoCodeId: string) {
  const usages = await prisma.promoCodeUsage.findMany({
    where: { promoCodeId },
  });

  const totalRevenue = usages.reduce((sum, usage) => sum + usage.finalAmount, 0);
  const totalDiscount = usages.reduce((sum, usage) => sum + usage.discountApplied, 0);

  return {
    totalUses: usages.length,
    uniqueCustomers: new Set(usages.map((u) => u.customerEmail)).size,
    totalRevenue,
    totalDiscount,
    averageOrderValue: usages.length > 0 ? totalRevenue / usages.length : 0,
  };
}

/**
 * Create or get existing Stripe coupon for a promo code
 * @param promoCode - PromoCode object from database
 * @param stripe - Stripe instance
 * @returns Stripe coupon ID
 */
export async function getOrCreateStripeCoupon(
  promoCode: {
    id: string;
    code: string;
    name: string;
    discountType: string;
    discountPercent: number | null;
    discountAmount: number | null;
    stripeCouponId: string | null;
  },
  stripe: any
): Promise<string> {
  // If Stripe coupon already exists, return it
  if (promoCode.stripeCouponId) {
    try {
      await stripe.coupons.retrieve(promoCode.stripeCouponId);
      return promoCode.stripeCouponId;
    } catch (error) {
      // Coupon was deleted in Stripe, create new one
      console.log("Stripe coupon not found, creating new one");
    }
  }

  // Create new Stripe coupon
  const couponParams: any = {
    id: promoCode.code, // Use promo code as Stripe coupon ID for easy lookup
    name: promoCode.name,
    duration: "once", // One-time use per transaction
  };

  if (promoCode.discountType === "percent" && promoCode.discountPercent) {
    couponParams.percent_off = promoCode.discountPercent;
  } else if (promoCode.discountType === "fixed_amount" && promoCode.discountAmount) {
    couponParams.amount_off = Math.round(promoCode.discountAmount * 100); // Convert to cents
    couponParams.currency = "usd";
  }

  try {
    const stripeCoupon = await stripe.coupons.create(couponParams);

    // Update database with Stripe coupon ID
    await prisma.promoCode.update({
      where: { id: promoCode.id },
      data: { stripeCouponId: stripeCoupon.id },
    });

    return stripeCoupon.id;
  } catch (error) {
    console.error("Failed to create Stripe coupon:", error);
    throw new Error("Failed to create discount coupon");
  }
}
