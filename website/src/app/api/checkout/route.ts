import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, type TierId, TIER_CONFIG } from "@/lib/stripe";
import { validateReferralCode, trackReferralClick } from "@/lib/referral";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      style,
      petName,
      notes,
      petPhotoUrl,
      tier,
      discountCode,
      referralCode,
      badge,
      utmSource,
      utmMedium,
      utmCampaign,
      giftCardCode
    } = body;

    if (!name || !email || !style) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Default to 'basic' tier if not provided
    const selectedTier: TierId = tier || 'basic';
    const tierConfig = TIER_CONFIG.find((t) => t.id === selectedTier);

    if (!tierConfig) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    // Validate and track referral code if provided
    let validatedReferralCode: string | undefined;
    if (referralCode) {
      const validation = await validateReferralCode(referralCode);
      if (validation.valid) {
        validatedReferralCode = referralCode;
        // Track the referral conversion attempt
        await trackReferralClick(referralCode, email);
      }
    }

    // Handle gift card payment
    if (giftCardCode) {
      const giftCard = await prisma.giftCard.findUnique({
        where: { code: giftCardCode.trim().toUpperCase() },
      });

      if (!giftCard || !giftCard.active || giftCard.currentBalance <= 0) {
        return NextResponse.json({ error: "Invalid or inactive gift card" }, { status: 400 });
      }

      if (giftCard.expiresAt && new Date() > giftCard.expiresAt) {
        return NextResponse.json({ error: "Gift card has expired" }, { status: 400 });
      }

      const orderTotal = tierConfig.price;

      // Full payment via gift card - trigger immediate order processing
      if (giftCard.currentBalance >= orderTotal) {
        // Create order ID for tracking
        const orderId = `gc_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        // Consume gift card balance
        const newBalance = giftCard.currentBalance - orderTotal;
        await prisma.giftCard.update({
          where: { id: giftCard.id },
          data: { currentBalance: newBalance },
        });

        // Record transaction
        await prisma.giftCardTransaction.create({
          data: {
            giftCardId: giftCard.id,
            amount: orderTotal,
            type: 'redemption',
            description: `Portrait order - ${tierConfig.name} package`,
            orderId,
            balanceBefore: giftCard.currentBalance,
            balanceAfter: newBalance,
          },
        });

        // Credit sender if this is first use
        if (!giftCard.senderCredited && giftCard.purchaserEmail) {
          const senderCredit = orderTotal * 0.1; // 10% of order value
          await prisma.giftCard.update({
            where: { id: giftCard.id },
            data: {
              senderCredited: true,
              senderCreditAmount: senderCredit,
              firstUsedAt: new Date(),
            },
          });

          // Add credit to sender's customer account (if exists)
          const senderCustomer = await prisma.customer.findUnique({
            where: { email: giftCard.purchaserEmail },
          });

          if (senderCustomer) {
            await prisma.customer.update({
              where: { email: giftCard.purchaserEmail },
              data: {
                creditBalance: { increment: senderCredit },
              },
            });

            await prisma.creditTransaction.create({
              data: {
                customerEmail: giftCard.purchaserEmail,
                amount: senderCredit,
                type: 'gift_card_referral',
                description: `10% credit from gift card redemption by ${email}`,
                orderId,
              },
            });
          }
        }

        // Create order record
        await prisma.order.create({
          data: {
            stripeSessionId: orderId,
            customerEmail: email,
            customerName: name,
            tier: selectedTier,
            tierName: tierConfig.name,
            amount: orderTotal,
            subtotal: orderTotal,
            discount: 0,
            tax: 0,
            petName,
            style,
            notes: notes || '',
            petPhotoUrl: petPhotoUrl || '',
            portraitUrls: '',
            portraitCount: tierConfig.id === 'basic' ? 1 : tierConfig.id === 'premium' ? 3 : 5,
            giftCardCode: giftCard.code,
            giftCardAmount: orderTotal,
            utmSource: utmSource || null,
            utmMedium: utmMedium || null,
            utmCampaign: utmCampaign || null,
            referralCode: validatedReferralCode || null,
            discountCode: discountCode || null,
            pricingBadge: badge || null,
            status: 'completed',
            deliveryStatus: 'pending',
            paidAt: new Date(),
          },
        });

        // Redirect to gift card processing endpoint which will generate portrait
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        return NextResponse.json({
          url: `${baseUrl}/api/process-gift-card-order?orderId=${orderId}`,
        });
      }
    }

    const session = await createCheckoutSession({
      tier: selectedTier,
      customerEmail: email,
      customerName: name,
      petName,
      style,
      notes,
      petPhotoUrl,
      discountCode,
      referralCode: validatedReferralCode,
      badge,
      utmSource,
      utmMedium,
      utmCampaign,
      giftCardCode,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Stripe checkout error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
