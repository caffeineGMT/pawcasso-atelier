import { prisma } from "./prisma";

/**
 * Generate a unique gift card code in format: PAWC-XXXX-XXXX-XXXX
 */
export function generateGiftCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const generateSegment = (length: number) =>
    Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

  return `PAWC-${generateSegment(4)}-${generateSegment(4)}-${generateSegment(4)}`;
}

/**
 * Create a new gift card
 */
export async function createGiftCard({
  amount,
  purchaserEmail,
  purchaserName,
  recipientEmail,
  recipientName,
  message,
  deliveryDate,
  stripeSessionId,
  stripePaymentIntentId,
}: {
  amount: number;
  purchaserEmail: string;
  purchaserName: string;
  recipientEmail: string;
  recipientName: string;
  message?: string;
  deliveryDate?: Date;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
}) {
  // Generate unique code
  let code = generateGiftCode();
  let attempts = 0;
  const maxAttempts = 10;

  // Ensure code is unique
  while (attempts < maxAttempts) {
    const existing = await prisma.giftCard.findUnique({ where: { code } });
    if (!existing) break;
    code = generateGiftCode();
    attempts++;
  }

  if (attempts >= maxAttempts) {
    throw new Error("Failed to generate unique gift card code");
  }

  // Calculate expiry date (1 year from now)
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  // Use delivery date or immediate delivery
  const finalDeliveryDate = deliveryDate || new Date();

  const giftCard = await prisma.giftCard.create({
    data: {
      code,
      initialBalance: amount,
      currentBalance: amount,
      purchaserEmail,
      purchaserName,
      recipientEmail,
      recipientName,
      active: true,
      expiresAt,
    },
  });

  // Note: message, deliveryDate, stripeSessionId, and stripePaymentIntentId
  // are not stored in the database schema but are used for email delivery

  return giftCard;
}

/**
 * Get gift card balance by code
 */
export async function getGiftCardBalance(code: string): Promise<number | null> {
  const giftCard = await prisma.giftCard.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!giftCard) return null;
  if (!giftCard.active) return null;
  if (giftCard.expiresAt && giftCard.expiresAt < new Date()) return null;

  return giftCard.currentBalance;
}

/**
 * Get full gift card details
 */
export async function getGiftCard(code: string) {
  const giftCard = await prisma.giftCard.findUnique({
    where: { code: code.toUpperCase() },
    include: {
      transactions: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!giftCard) return null;

  // Check if expired
  const isExpired = giftCard.expiresAt ? giftCard.expiresAt < new Date() : false;

  return {
    ...giftCard,
    isExpired,
    isActive: giftCard.active && !isExpired && giftCard.currentBalance > 0,
  };
}

/**
 * Redeem/use a gift card
 */
export async function redeemGiftCard(
  code: string,
  amountToUse: number,
  orderId?: string
): Promise<{ success: boolean; newBalance: number; error?: string }> {
  const giftCard = await getGiftCard(code);

  if (!giftCard) {
    return { success: false, newBalance: 0, error: "Gift card not found" };
  }

  if (!giftCard.isActive) {
    return {
      success: false,
      newBalance: 0,
      error: giftCard.isExpired ? "Gift card has expired" : "Gift card is inactive",
    };
  }

  if (giftCard.currentBalance < amountToUse) {
    return {
      success: false,
      newBalance: giftCard.currentBalance,
      error: "Insufficient balance",
    };
  }

  // Calculate new balance
  const newBalance = giftCard.currentBalance - amountToUse;

  // Update gift card and create transaction in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // Update gift card balance
    const updated = await tx.giftCard.update({
      where: { id: giftCard.id },
      data: {
        currentBalance: newBalance,
        firstUsedAt: giftCard.firstUsedAt || new Date(),
      },
    });

    // Create transaction record
    await tx.giftCardTransaction.create({
      data: {
        giftCardId: giftCard.id,
        amount: amountToUse,
        type: "redemption",
        description: `Used $${amountToUse.toFixed(2)} on order`,
        orderId: orderId || null,
        balanceBefore: giftCard.currentBalance,
        balanceAfter: newBalance,
      },
    });

    return updated;
  });

  return {
    success: true,
    newBalance: result.currentBalance,
  };
}

/**
 * Mark gift card as sent (email delivered)
 * Note: Schema doesn't have sentAt field, so this is a no-op
 */
export async function markGiftCardAsSent(giftCardId: string) {
  // Return the gift card unchanged
  return await prisma.giftCard.findUnique({
    where: { id: giftCardId },
  });
}

/**
 * Award 10% credit to gift card purchaser when recipient makes first purchase
 */
export async function awardSenderCredit(code: string, recipientOrderValue: number) {
  const giftCard = await prisma.giftCard.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!giftCard) return null;
  if (giftCard.senderCredited) return null; // Already credited
  if (!giftCard.purchaserEmail) return null; // No purchaser to credit

  const creditAmount = recipientOrderValue * 0.1; // 10% of order value

  // Update gift card to mark as credited
  await prisma.giftCard.update({
    where: { id: giftCard.id },
    data: {
      senderCredited: true,
      senderCreditAmount: creditAmount,
    },
  });

  // Find or create customer record for purchaser
  let customer = await prisma.customer.findUnique({
    where: { email: giftCard.purchaserEmail },
  });

  if (!customer) {
    // Generate referral code
    const referralCode = `${giftCard.purchaserName?.toUpperCase().replace(/\s+/g, "") || "PAWCASSO"}${Math.floor(Math.random() * 10000)}`;

    customer = await prisma.customer.create({
      data: {
        email: giftCard.purchaserEmail,
        name: giftCard.purchaserName || null,
        referralCode,
        creditBalance: creditAmount,
      },
    });
  } else {
    // Update existing customer's credit balance
    customer = await prisma.customer.update({
      where: { id: customer.id },
      data: {
        creditBalance: {
          increment: creditAmount,
        },
      },
    });
  }

  // Create credit transaction record
  await prisma.creditTransaction.create({
    data: {
      customerEmail: giftCard.purchaserEmail,
      amount: creditAmount,
      type: "referral_bonus",
      description: `10% credit for gift card recipient's first purchase ($${recipientOrderValue.toFixed(2)})`,
    },
  });

  return {
    creditAmount,
    customerEmail: giftCard.purchaserEmail,
  };
}
