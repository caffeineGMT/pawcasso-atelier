import { PrismaClient } from "@prisma/client";
import { getStripe } from "./stripe";
import crypto from "crypto";

const prisma = new PrismaClient();

// Loyalty tier thresholds
export const LOYALTY_TIERS = {
  bronze: { minOrders: 0, minSpent: 0, pointsMultiplier: 1, discountPercent: 0, label: "Bronze" },
  silver: { minOrders: 2, minSpent: 50, pointsMultiplier: 1.5, discountPercent: 10, label: "Silver" },
  gold: { minOrders: 4, minSpent: 150, pointsMultiplier: 2, discountPercent: 15, label: "Gold" },
  platinum: { minOrders: 7, minSpent: 300, pointsMultiplier: 3, discountPercent: 20, label: "Platinum" },
} as const;

export type LoyaltyTier = keyof typeof LOYALTY_TIERS;

export const TIER_ORDER: LoyaltyTier[] = ["bronze", "silver", "gold", "platinum"];

export interface LoyaltyStatus {
  tier: LoyaltyTier;
  tierLabel: string;
  totalOrders: number;
  totalSpent: number;
  currentPoints: number;
  lifetimePoints: number;
  nextTier: LoyaltyTier | null;
  ordersToNextTier: number;
  spentToNextTier: number;
  tierBenefits: {
    pointsMultiplier: number;
    discountPercent: number;
  };
  repeatDiscountCode: string | null;
  repeatDiscountUsed: boolean;
  rewards: {
    id: string;
    type: string;
    description: string;
    discountCode: string | null;
    discountPercent: number | null;
    used: boolean;
    expiresAt: string | null;
  }[];
}

function generateDiscountCode(prefix: string): string {
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${random}`;
}

/**
 * Calculate what tier a member should be based on their orders/spending
 */
function calculateTier(totalOrders: number, totalSpent: number): LoyaltyTier {
  let tier: LoyaltyTier = "bronze";
  for (const t of TIER_ORDER) {
    const config = LOYALTY_TIERS[t];
    if (totalOrders >= config.minOrders && totalSpent >= config.minSpent) {
      tier = t;
    }
  }
  return tier;
}

/**
 * Get or create a loyalty member for an email
 */
export async function getOrCreateLoyaltyMember(email: string, name?: string) {
  let member = await prisma.loyaltyMember.findUnique({
    where: { email },
    include: { petProfiles: true, rewards: { orderBy: { createdAt: "desc" } } },
  });

  if (!member) {
    member = await prisma.loyaltyMember.create({
      data: { email, name },
      include: { petProfiles: true, rewards: { orderBy: { createdAt: "desc" } } },
    });
  }

  return member;
}

/**
 * Process a completed order for loyalty tracking.
 * Called from the Stripe webhook after successful payment.
 */
export async function processLoyaltyOrder(
  email: string,
  customerName: string,
  orderAmount: number,
  petName?: string,
) {
  const member = await getOrCreateLoyaltyMember(email, customerName);
  const newTotalOrders = member.totalOrders + 1;
  const newTotalSpent = member.totalSpent + orderAmount;
  const pointsEarned = Math.floor(orderAmount * LOYALTY_TIERS[member.tier as LoyaltyTier].pointsMultiplier);
  const newTier = calculateTier(newTotalOrders, newTotalSpent);
  const tierChanged = newTier !== member.tier;

  const updateData: Record<string, unknown> = {
    totalOrders: newTotalOrders,
    totalSpent: newTotalSpent,
    lifetimePoints: member.lifetimePoints + pointsEarned,
    currentPoints: member.currentPoints + pointsEarned,
    name: customerName,
  };

  if (tierChanged) {
    updateData.tier = newTier;
    updateData.tierUpgradedAt = new Date();
  }

  // Generate repeat purchase discount after first order (20% off 2nd portrait)
  if (newTotalOrders === 1 && !member.repeatDiscountCode) {
    const code = generateDiscountCode("REPEAT20");
    updateData.repeatDiscountCode = code;

    // Create the Stripe coupon
    try {
      const stripe = getStripe();
      await stripe.coupons.create({
        id: code,
        percent_off: 20,
        duration: "once",
        name: "20% Off Your 2nd Portrait",
        max_redemptions: 1,
      });
    } catch (err) {
      // Coupon may already exist if code collision (unlikely)
      console.error("Failed to create repeat purchase coupon:", err);
    }

    // Create a reward record
    await prisma.loyaltyReward.create({
      data: {
        loyaltyMemberId: member.id,
        type: "repeat_discount",
        description: "20% off your next portrait - thanks for being a Pawcasso customer!",
        discountCode: code,
        discountPercent: 20,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      },
    });
  }

  // Create tier upgrade reward if tier changed
  if (tierChanged) {
    const tierConfig = LOYALTY_TIERS[newTier];
    const rewardCode = generateDiscountCode(`${newTier.toUpperCase()}UP`);

    try {
      const stripe = getStripe();
      await stripe.coupons.create({
        id: rewardCode,
        percent_off: tierConfig.discountPercent,
        duration: "once",
        name: `${tierConfig.label} Tier Welcome - ${tierConfig.discountPercent}% Off`,
        max_redemptions: 1,
      });
    } catch (err) {
      console.error("Failed to create tier upgrade coupon:", err);
    }

    await prisma.loyaltyReward.create({
      data: {
        loyaltyMemberId: member.id,
        type: "tier_upgrade",
        description: `Welcome to ${tierConfig.label}! Enjoy ${tierConfig.discountPercent}% off your next order.`,
        discountCode: rewardCode,
        discountPercent: tierConfig.discountPercent,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      },
    });
  }

  // Update the member
  const updatedMember = await prisma.loyaltyMember.update({
    where: { id: member.id },
    data: updateData,
    include: { petProfiles: true, rewards: true },
  });

  // Auto-create pet profile if petName provided and not already tracked
  if (petName) {
    const existingPet = updatedMember.petProfiles.find(
      (p) => p.name.toLowerCase() === petName.toLowerCase(),
    );
    if (existingPet) {
      await prisma.petProfile.update({
        where: { id: existingPet.id },
        data: { portraitCount: existingPet.portraitCount + 1 },
      });
    } else {
      await prisma.petProfile.create({
        data: {
          loyaltyMemberId: updatedMember.id,
          name: petName,
        },
      });
    }
  }

  return {
    member: updatedMember,
    pointsEarned,
    tierChanged,
    previousTier: member.tier,
    newTier,
    isFirstOrder: newTotalOrders === 1,
    repeatDiscountCode: updateData.repeatDiscountCode as string | undefined,
  };
}

/**
 * Get full loyalty status for a customer
 */
export async function getLoyaltyStatus(email: string): Promise<LoyaltyStatus | null> {
  const member = await prisma.loyaltyMember.findUnique({
    where: { email },
    include: {
      rewards: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!member) return null;

  const currentTier = member.tier as LoyaltyTier;
  const currentIndex = TIER_ORDER.indexOf(currentTier);
  const nextTier = currentIndex < TIER_ORDER.length - 1 ? TIER_ORDER[currentIndex + 1] : null;

  let ordersToNextTier = 0;
  let spentToNextTier = 0;
  if (nextTier) {
    const nextConfig = LOYALTY_TIERS[nextTier];
    ordersToNextTier = Math.max(0, nextConfig.minOrders - member.totalOrders);
    spentToNextTier = Math.max(0, nextConfig.minSpent - member.totalSpent);
  }

  return {
    tier: currentTier,
    tierLabel: LOYALTY_TIERS[currentTier].label,
    totalOrders: member.totalOrders,
    totalSpent: member.totalSpent,
    currentPoints: member.currentPoints,
    lifetimePoints: member.lifetimePoints,
    nextTier,
    ordersToNextTier,
    spentToNextTier,
    tierBenefits: {
      pointsMultiplier: LOYALTY_TIERS[currentTier].pointsMultiplier,
      discountPercent: LOYALTY_TIERS[currentTier].discountPercent,
    },
    repeatDiscountCode: member.repeatDiscountCode,
    repeatDiscountUsed: member.repeatDiscountUsed,
    rewards: member.rewards.map((r) => ({
      id: r.id,
      type: r.type,
      description: r.description,
      discountCode: r.discountCode,
      discountPercent: r.discountPercent,
      used: r.used,
      expiresAt: r.expiresAt?.toISOString() ?? null,
    })),
  };
}

/**
 * Validate a loyalty discount code
 */
export async function validateLoyaltyDiscount(code: string): Promise<{
  valid: boolean;
  discountPercent?: number;
  error?: string;
}> {
  const reward = await prisma.loyaltyReward.findUnique({
    where: { discountCode: code },
  });

  if (!reward) {
    // Also check repeat discount codes on members
    const member = await prisma.loyaltyMember.findUnique({
      where: { repeatDiscountCode: code },
    });
    if (!member) return { valid: false, error: "Invalid discount code" };
    if (member.repeatDiscountUsed) return { valid: false, error: "This discount has already been used" };
    return { valid: true, discountPercent: 20 };
  }

  if (reward.used) return { valid: false, error: "This discount has already been used" };
  if (reward.expiresAt && new Date() > reward.expiresAt) return { valid: false, error: "This discount has expired" };

  return { valid: true, discountPercent: reward.discountPercent ?? undefined };
}

/**
 * Mark a loyalty discount as used
 */
export async function markLoyaltyDiscountUsed(code: string): Promise<void> {
  // Check reward table first
  const reward = await prisma.loyaltyReward.findUnique({
    where: { discountCode: code },
  });

  if (reward) {
    await prisma.loyaltyReward.update({
      where: { id: reward.id },
      data: { used: true, usedAt: new Date() },
    });
    return;
  }

  // Check repeat discount on member
  const member = await prisma.loyaltyMember.findUnique({
    where: { repeatDiscountCode: code },
  });

  if (member) {
    await prisma.loyaltyMember.update({
      where: { id: member.id },
      data: { repeatDiscountUsed: true },
    });
  }
}

/**
 * Create a birthday portrait discount for a pet
 */
export async function createBirthdayReward(
  memberEmail: string,
  petName: string,
): Promise<string | null> {
  const member = await prisma.loyaltyMember.findUnique({
    where: { email: memberEmail },
  });

  if (!member) return null;

  const code = generateDiscountCode("BDAY25");

  try {
    const stripe = getStripe();
    await stripe.coupons.create({
      id: code,
      percent_off: 25,
      duration: "once",
      name: `${petName}'s Birthday Portrait - 25% Off`,
      max_redemptions: 1,
    });
  } catch (err) {
    console.error("Failed to create birthday coupon:", err);
    return null;
  }

  await prisma.loyaltyReward.create({
    data: {
      loyaltyMemberId: member.id,
      type: "birthday_portrait",
      description: `Happy Birthday ${petName}! 25% off a birthday portrait.`,
      discountCode: code,
      discountPercent: 25,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });

  return code;
}

/**
 * Get pets with upcoming birthdays (within N days)
 */
export async function getPetsWithUpcomingBirthdays(withinDays: number = 7) {
  const now = new Date();
  const dates: { month: number; day: number }[] = [];

  for (let i = 0; i <= withinDays; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    dates.push({ month: date.getMonth() + 1, day: date.getDate() });
  }

  // Query pets whose birthday month/day matches any of the upcoming dates
  const pets = await prisma.petProfile.findMany({
    where: {
      OR: dates.map((d) => ({
        birthdayMonth: d.month,
        birthdayDay: d.day,
      })),
    },
    include: {
      loyaltyMember: true,
    },
  });

  return pets;
}
