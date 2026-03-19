import { NextRequest, NextResponse } from 'next/server';
import { getCartsForRecovery, sendRecoveryEmail } from '@/lib/cart-recovery';

/**
 * Cart Recovery Cron Job
 *
 * This endpoint should be triggered every hour by Vercel Cron or similar service.
 * It finds abandoned carts that are ready for recovery emails and sends them.
 *
 * Email timing:
 * - 1hr after abandonment: 10% discount
 * - 24hr after email 1: 15% discount
 * - 72hr after email 2: 20% discount (final offer)
 *
 * Expected revenue impact: 15-20% cart recovery rate
 */
export async function GET(req: NextRequest) {
  try {
    // Verify authorization (prevent unauthorized access)
    const authHeader = req.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET || 'dev-secret';

    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🚀 Starting cart recovery job...');

    // Get carts ready for recovery
    const { oneHour, twentyFourHour, seventyTwoHour } = await getCartsForRecovery();

    console.log(`Found ${oneHour.length} carts for 1hr email`);
    console.log(`Found ${twentyFourHour.length} carts for 24hr email`);
    console.log(`Found ${seventyTwoHour.length} carts for 72hr email`);

    // Send emails (in parallel for speed)
    const results = {
      oneHour: { sent: 0, failed: 0 },
      twentyFourHour: { sent: 0, failed: 0 },
      seventyTwoHour: { sent: 0, failed: 0 },
    };

    // Process 1hr emails
    for (const cartId of oneHour) {
      const success = await sendRecoveryEmail(cartId, 1);
      if (success) {
        results.oneHour.sent++;
      } else {
        results.oneHour.failed++;
      }
    }

    // Process 24hr emails
    for (const cartId of twentyFourHour) {
      const success = await sendRecoveryEmail(cartId, 2);
      if (success) {
        results.twentyFourHour.sent++;
      } else {
        results.twentyFourHour.failed++;
      }
    }

    // Process 72hr emails
    for (const cartId of seventyTwoHour) {
      const success = await sendRecoveryEmail(cartId, 3);
      if (success) {
        results.seventyTwoHour.sent++;
      } else {
        results.seventyTwoHour.failed++;
      }
    }

    const totalSent =
      results.oneHour.sent + results.twentyFourHour.sent + results.seventyTwoHour.sent;
    const totalFailed =
      results.oneHour.failed + results.twentyFourHour.failed + results.seventyTwoHour.failed;

    console.log(`✅ Cart recovery job complete: ${totalSent} sent, ${totalFailed} failed`);

    return NextResponse.json({
      success: true,
      results,
      summary: {
        totalSent,
        totalFailed,
      },
    });
  } catch (error: unknown) {
    console.error('❌ Cart recovery job failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
