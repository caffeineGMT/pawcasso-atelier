import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface ReferralStats {
  clicks: number;
  conversions: number;
  earnings: number;
  referralCode: string;
  creditBalance: number;
  totalReferrals: number;
  milestones: {
    milestone: string;
    reward: string;
    claimed: boolean;
    achievedAt: Date;
  }[];
}

// Generate a unique referral code based on email
export function generateReferralCode(email: string): string {
  const prefix = email.split("@")[0].toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${random}`;
}

// Get or create customer record
export async function getOrCreateCustomer(email: string, name?: string) {
  let customer = await prisma.customer.findUnique({
    where: { email },
  });

  if (!customer) {
    const referralCode = generateReferralCode(email);
    customer = await prisma.customer.create({
      data: {
        email,
        name: name || null,
        referralCode,
      },
    });
  }

  return customer;
}

// Track referral click
export async function trackReferralClick(referralCode: string, referredEmail?: string) {
  const referrer = await prisma.customer.findUnique({
    where: { referralCode },
  });

  if (!referrer) {
    return null;
  }

  // If we have the referred email, create a referral record
  if (referredEmail && referredEmail !== referrer.email) {
    const existingReferral = await prisma.referral.findFirst({
      where: {
        referralCode,
        referredEmail,
      },
    });

    if (!existingReferral) {
      await prisma.referral.create({
        data: {
          referrerEmail: referrer.email,
          referredEmail,
          referralCode,
          clickedAt: new Date(),
          status: "clicked",
        },
      });
    }
  }

  return referrer;
}

// Get referral stats for a customer
export async function getReferralStats(email: string): Promise<ReferralStats> {
  const customer = await getOrCreateCustomer(email);

  const referrals = await prisma.referral.findMany({
    where: { referrerEmail: email },
  });

  const milestones = await prisma.milestoneAchievement.findMany({
    where: { customerEmail: email },
    orderBy: { achievedAt: "desc" },
  });

  const clicks = referrals.filter((r) => r.clickedAt !== null).length;
  const conversions = referrals.filter((r) => r.status === "converted").length;
  const earnings = referrals
    .filter((r) => r.status === "converted")
    .reduce((sum, r) => sum + r.referrerCredit, 0);

  return {
    clicks,
    conversions,
    earnings,
    referralCode: customer.referralCode,
    creditBalance: customer.creditBalance,
    totalReferrals: customer.totalReferrals,
    milestones: milestones.map((m) => ({
      milestone: m.milestone,
      reward: m.reward,
      claimed: m.claimed,
      achievedAt: m.achievedAt,
    })),
  };
}

// Process referral conversion (called from Stripe webhook)
export async function processReferralConversion(
  referralCode: string,
  referredEmail: string,
  orderId: string,
  orderValue: number
) {
  const referrer = await prisma.customer.findUnique({
    where: { referralCode },
  });

  if (!referrer || referrer.email === referredEmail) {
    return null;
  }

  // Find or create the referral record
  let referral = await prisma.referral.findFirst({
    where: {
      referralCode,
      referredEmail,
      status: { in: ["pending", "clicked"] },
    },
  });

  if (!referral) {
    // Create new referral if it doesn't exist
    referral = await prisma.referral.create({
      data: {
        referrerEmail: referrer.email,
        referredEmail,
        referralCode,
        clickedAt: new Date(),
        status: "pending",
      },
    });
  }

  // Update referral to converted
  await prisma.referral.update({
    where: { id: referral.id },
    data: {
      status: "converted",
      convertedAt: new Date(),
      orderId,
      orderValue,
    },
  });

  // Credit referrer $5
  const creditAmount = 5.0;
  await prisma.customer.update({
    where: { email: referrer.email },
    data: {
      creditBalance: { increment: creditAmount },
      totalReferrals: { increment: 1 },
    },
  });

  // Record credit transaction
  await prisma.creditTransaction.create({
    data: {
      customerEmail: referrer.email,
      amount: creditAmount,
      type: "referral_bonus",
      description: `Referral bonus from ${referredEmail}`,
      referralId: referral.id,
      orderId,
    },
  });

  // Check for milestone achievements
  await checkAndAwardMilestones(referrer.email);

  return referral;
}

// Check and award milestones
export async function checkAndAwardMilestones(email: string) {
  const customer = await prisma.customer.findUnique({
    where: { email },
    include: { milestones: true },
  });

  if (!customer) return;

  const totalReferrals = customer.totalReferrals;

  // Define milestones
  const milestoneDefinitions = [
    { count: 5, milestone: "5_referrals", reward: "1 free Premium portrait (worth $29)" },
    { count: 10, milestone: "10_referrals", reward: "1 free Deluxe portrait (worth $49)" },
    { count: 25, milestone: "25_referrals", reward: "1 free Bundle package (worth $79)" },
  ];

  for (const def of milestoneDefinitions) {
    if (totalReferrals >= def.count) {
      // Check if milestone already exists
      const exists = customer.milestones.find((m) => m.milestone === def.milestone);
      if (!exists) {
        await prisma.milestoneAchievement.create({
          data: {
            customerEmail: email,
            milestone: def.milestone,
            reward: def.reward,
          },
        });
      }
    }
  }
}

// Apply credit to an order (returns amount applied)
export async function applyCreditToOrder(email: string, orderAmount: number): Promise<number> {
  const customer = await getOrCreateCustomer(email);

  if (customer.creditBalance <= 0) {
    return 0;
  }

  const creditToApply = Math.min(customer.creditBalance, orderAmount);

  if (creditToApply > 0) {
    // Deduct credit from balance
    await prisma.customer.update({
      where: { email },
      data: {
        creditBalance: { decrement: creditToApply },
      },
    });

    // Record transaction
    await prisma.creditTransaction.create({
      data: {
        customerEmail: email,
        amount: -creditToApply,
        type: "credit_applied",
        description: `Credit applied to order`,
      },
    });
  }

  return creditToApply;
}

// Validate referral code and get discount percentage
export async function validateReferralCode(referralCode: string): Promise<{ valid: boolean; discount: number; referrerEmail?: string }> {
  const referrer = await prisma.customer.findUnique({
    where: { referralCode },
  });

  if (!referrer) {
    return { valid: false, discount: 0 };
  }

  return {
    valid: true,
    discount: 0.2, // 20% discount for referred friend
    referrerEmail: referrer.email,
  };
}
