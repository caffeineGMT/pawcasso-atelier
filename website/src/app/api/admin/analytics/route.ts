import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AnalyticsMetrics {
  // Revenue metrics
  totalRevenue: number;
  monthlyRevenue: number;
  dailyRevenue: number;
  avgOrderValue: number;

  // Order metrics
  totalOrders: number;
  monthlyOrders: number;
  dailyOrders: number;

  // Refund metrics
  totalRefunds: number;
  refundRate: number;
  refundAmount: number;

  // Acquisition channel metrics
  channelBreakdown: {
    channel: string;
    orders: number;
    revenue: number;
    avgOrderValue: number;
    ltv: number;
  }[];

  // Time series data
  dailyStats: {
    date: string;
    orders: number;
    revenue: number;
    refunds: number;
  }[];

  // Customer metrics
  totalCustomers: number;
  repeatCustomers: number;
  avgLtv: number;
}

// Sync Stripe checkout sessions to database
async function syncStripeOrders() {
  const stripe = getStripe();
  const sessions = await stripe.checkout.sessions.list({
    limit: 100,
    expand: ['data.payment_intent'],
  });

  for (const session of sessions.data) {
    if (session.payment_status !== 'paid') continue;

    const metadata = session.metadata || {};
    const amountTotal = session.amount_total || 0;
    const discount = session.total_details?.amount_discount || 0;

    // Check if order already exists
    const existing = await prisma.order.findUnique({
      where: { stripeSessionId: session.id },
    });

    if (existing) continue;

    // Create order record
    await prisma.order.create({
      data: {
        stripeSessionId: session.id,
        stripePaymentIntentId: typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id || null,
        customerEmail: session.customer_email || session.customer_details?.email || 'unknown@unknown.com',
        customerName: metadata.customerName || session.customer_details?.name || 'Unknown',
        tier: metadata.tier || 'basic',
        tierName: metadata.tierName || 'Basic',
        amount: amountTotal / 100,
        subtotal: (amountTotal + discount) / 100,
        discount: discount / 100,
        tax: (session.total_details?.amount_tax || 0) / 100,
        petName: metadata.petName || '',
        style: metadata.style || '',
        notes: metadata.notes || '',
        petPhotoUrl: metadata.petPhotoUrl || '',
        portraitUrls: metadata.portrait_urls || '',
        portraitCount: parseInt(metadata.features?.split(',').length.toString() || '1'),
        utmSource: metadata.utmSource || null,
        utmMedium: metadata.utmMedium || null,
        utmCampaign: metadata.utmCampaign || null,
        referralCode: metadata.referralCode || null,
        discountCode: metadata.discountCode || null,
        status: 'completed',
        deliveryStatus: metadata.delivery_status || 'pending',
        deliveredAt: metadata.delivered_at ? new Date(metadata.delivered_at) : null,
        paidAt: session.created ? new Date(session.created * 1000) : new Date(),
        createdAt: session.created ? new Date(session.created * 1000) : new Date(),
      },
    });
  }

  // Sync refunds
  const charges = await stripe.charges.list({
    limit: 100,
  });

  for (const charge of charges.data) {
    if (!charge.refunded) continue;

    const order = await prisma.order.findFirst({
      where: { stripePaymentIntentId: charge.payment_intent as string },
    });

    if (!order) continue;

    const refundAmount = charge.amount_refunded / 100;

    await prisma.order.update({
      where: { id: order.id },
      data: {
        refunded: true,
        refundAmount,
        refundedAt: new Date(),
        status: charge.amount_refunded === charge.amount ? 'refunded' : 'completed',
      },
    });
  }
}

// Calculate analytics metrics
async function calculateAnalytics(): Promise<AnalyticsMetrics> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Get all orders
  const allOrders = await prisma.order.findMany({
    where: { status: { in: ['completed', 'refunded'] } },
  });

  const monthlyOrders = allOrders.filter(o => o.createdAt >= startOfMonth);
  const dailyOrders = allOrders.filter(o => o.createdAt >= startOfDay);

  // Revenue calculations
  const totalRevenue = allOrders.reduce((sum, o) => sum + o.amount, 0);
  const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + o.amount, 0);
  const dailyRevenue = dailyOrders.reduce((sum, o) => sum + o.amount, 0);

  // Order metrics
  const totalOrders = allOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Refund metrics
  const refundedOrders = allOrders.filter(o => o.refunded);
  const totalRefunds = refundedOrders.length;
  const refundRate = totalOrders > 0 ? (totalRefunds / totalOrders) * 100 : 0;
  const refundAmount = refundedOrders.reduce((sum, o) => sum + o.refundAmount, 0);

  // Channel breakdown
  const channelMap = new Map<string, {
    orders: number;
    revenue: number;
    customers: Set<string>;
  }>();

  for (const order of allOrders) {
    const channel = order.utmSource || order.utmMedium || 'direct';
    const existing = channelMap.get(channel) || {
      orders: 0,
      revenue: 0,
      customers: new Set<string>(),
    };

    existing.orders += 1;
    existing.revenue += order.amount;
    existing.customers.add(order.customerEmail);

    channelMap.set(channel, existing);
  }

  const channelBreakdown = Array.from(channelMap.entries()).map(([channel, data]) => ({
    channel,
    orders: data.orders,
    revenue: data.revenue,
    avgOrderValue: data.revenue / data.orders,
    ltv: data.revenue / data.customers.size,
  })).sort((a, b) => b.revenue - a.revenue);

  // Daily stats for last 30 days
  const dailyStatsMap = new Map<string, { orders: number; revenue: number; refunds: number }>();

  for (let i = 0; i < 30; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    dailyStatsMap.set(dateStr, { orders: 0, revenue: 0, refunds: 0 });
  }

  for (const order of allOrders) {
    const dateStr = order.createdAt.toISOString().split('T')[0];
    const stats = dailyStatsMap.get(dateStr);
    if (stats) {
      stats.orders += 1;
      stats.revenue += order.amount;
      if (order.refunded) {
        stats.refunds += 1;
      }
    }
  }

  const dailyStats = Array.from(dailyStatsMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Customer metrics
  const customerMap = new Map<string, number>();
  for (const order of allOrders) {
    customerMap.set(order.customerEmail, (customerMap.get(order.customerEmail) || 0) + order.amount);
  }

  const totalCustomers = customerMap.size;
  const repeatCustomers = allOrders.filter((order, index, arr) =>
    arr.findIndex(o => o.customerEmail === order.customerEmail) !== index
  ).length;
  const avgLtv = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

  return {
    totalRevenue,
    monthlyRevenue,
    dailyRevenue,
    avgOrderValue,
    totalOrders,
    monthlyOrders: monthlyOrders.length,
    dailyOrders: dailyOrders.length,
    totalRefunds,
    refundRate,
    refundAmount,
    channelBreakdown,
    dailyStats,
    totalCustomers,
    repeatCustomers,
    avgLtv,
  };
}

export async function GET(req: NextRequest) {
  try {
    // Check for admin authentication (simplified - add proper auth)
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.includes('admin')) {
      // For now, allow access - add proper auth later
      // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Sync orders from Stripe
    await syncStripeOrders();

    // Calculate analytics
    const analytics = await calculateAnalytics();

    // Conversion Funnel - Count unique sessions at each step
    const funnelEvents = await prisma.$queryRaw<Array<{ eventName: string; count: bigint }>>`
      SELECT eventName, COUNT(DISTINCT sessionId) as count
      FROM AnalyticsEvent
      WHERE createdAt >= ${startDate}
      GROUP BY eventName
      ORDER BY
        CASE eventName
          WHEN 'page_view' THEN 1
          WHEN 'gallery_view' THEN 2
          WHEN 'order_start' THEN 3
          WHEN 'checkout_start' THEN 4
          WHEN 'purchase_complete' THEN 5
          ELSE 6
        END
    `;

    const funnel = funnelEvents.map(event => ({
      eventName: event.eventName,
      count: Number(event.count),
    }));

    // Attribution by UTM Source with conversion rates
    const attributionData = await prisma.$queryRaw<Array<{
      utmSource: string | null;
      totalRevenue: number;
      customers: bigint;
      purchases: bigint;
    }>>`
      SELECT
        utmSource,
        SUM(revenue) as totalRevenue,
        COUNT(DISTINCT userId) as customers,
        COUNT(*) as purchases
      FROM AnalyticsEvent
      WHERE eventName = 'purchase_complete'
        AND createdAt >= ${startDate}
      GROUP BY utmSource
      ORDER BY totalRevenue DESC
    `;

    const attribution = attributionData.map(item => ({
      utmSource: item.utmSource || 'Direct',
      totalRevenue: Number(item.totalRevenue),
      customers: Number(item.customers),
      purchases: Number(item.purchases),
    }));

    // Recent Events (last 50)
    const recentEvents = await prisma.analyticsEvent.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        eventName: true,
        userId: true,
        utmSource: true,
        utmMedium: true,
        utmCampaign: true,
        revenue: true,
        metadata: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      ...analytics,
      funnel,
      attribution,
      recentEvents,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate analytics' },
      { status: 500 }
    );
  }
}

// Webhook handler to update orders in real-time
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, action } = body;

    if (action === 'sync') {
      await syncStripeOrders();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Analytics update error:', error);
    return NextResponse.json(
      { error: 'Failed to update analytics' },
      { status: 500 }
    );
  }
}
