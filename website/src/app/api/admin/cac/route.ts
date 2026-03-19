import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CHANNELS = [
  "google_ads",
  "instagram",
  "pinterest",
  "reddit",
  "tiktok",
  "facebook",
  "email",
  "influencer",
  "organic",
] as const;

// GET: Fetch CAC dashboard data
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "30"; // days
  const days = Math.min(parseInt(period), 365);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  try {
    // Fetch marketing spend data
    const spendData = await prisma.marketingSpend.findMany({
      where: { date: { gte: startDate } },
      orderBy: { date: "asc" },
    });

    // Fetch orders in the same period for revenue/customer data
    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { in: ["completed", "pending"] },
      },
      select: {
        id: true,
        customerEmail: true,
        amount: true,
        utmSource: true,
        utmMedium: true,
        utmCampaign: true,
        createdAt: true,
        referralCode: true,
        discountCode: true,
      },
    });

    // All-time orders for LTV calculation
    const allOrders = await prisma.order.findMany({
      where: { status: { in: ["completed", "pending"] } },
      select: {
        customerEmail: true,
        amount: true,
        createdAt: true,
        utmSource: true,
      },
    });

    // Map UTM sources to channels
    const mapSourceToChannel = (utmSource: string | null): string => {
      if (!utmSource) return "organic";
      const source = utmSource.toLowerCase();
      if (source.includes("google") || source.includes("adwords")) return "google_ads";
      if (source.includes("instagram") || source.includes("ig")) return "instagram";
      if (source.includes("pinterest") || source.includes("pin")) return "pinterest";
      if (source.includes("reddit")) return "reddit";
      if (source.includes("tiktok") || source.includes("tt")) return "tiktok";
      if (source.includes("facebook") || source.includes("fb") || source.includes("meta")) return "facebook";
      if (source.includes("email") || source.includes("newsletter") || source.includes("mailchimp")) return "email";
      if (source.includes("influencer") || source.includes("creator")) return "influencer";
      return "organic";
    };

    // Aggregate spend by channel
    const spendByChannel: Record<string, { totalSpend: number; impressions: number; clicks: number; conversions: number; revenue: number }> = {};
    for (const channel of CHANNELS) {
      spendByChannel[channel] = { totalSpend: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0 };
    }

    for (const entry of spendData) {
      const ch = entry.channel;
      if (spendByChannel[ch]) {
        spendByChannel[ch].totalSpend += entry.amount;
        spendByChannel[ch].impressions += entry.impressions;
        spendByChannel[ch].clicks += entry.clicks;
        spendByChannel[ch].conversions += entry.conversions;
        spendByChannel[ch].revenue += entry.revenue;
      }
    }

    // Aggregate orders by channel
    const ordersByChannel: Record<string, { count: number; revenue: number; customers: Set<string> }> = {};
    for (const channel of CHANNELS) {
      ordersByChannel[channel] = { count: 0, revenue: 0, customers: new Set() };
    }

    for (const order of orders) {
      const channel = mapSourceToChannel(order.utmSource);
      if (ordersByChannel[channel]) {
        ordersByChannel[channel].count += 1;
        ordersByChannel[channel].revenue += order.amount;
        ordersByChannel[channel].customers.add(order.customerEmail);
      }
    }

    // Calculate LTV by channel (all-time)
    const ltvByChannel: Record<string, { totalRevenue: number; customers: Set<string> }> = {};
    for (const channel of CHANNELS) {
      ltvByChannel[channel] = { totalRevenue: 0, customers: new Set() };
    }

    for (const order of allOrders) {
      const channel = mapSourceToChannel(order.utmSource);
      if (ltvByChannel[channel]) {
        ltvByChannel[channel].totalRevenue += order.amount;
        ltvByChannel[channel].customers.add(order.customerEmail);
      }
    }

    // Build channel metrics
    const channelMetrics = CHANNELS.map((channel) => {
      const spend = spendByChannel[channel];
      const channelOrders = ordersByChannel[channel];
      const ltv = ltvByChannel[channel];

      const totalSpend = spend.totalSpend;
      const newCustomers = channelOrders.customers.size;
      const cac = newCustomers > 0 ? totalSpend / newCustomers : 0;
      const avgLtv = ltv.customers.size > 0 ? ltv.totalRevenue / ltv.customers.size : 0;
      const ltvCacRatio = cac > 0 ? avgLtv / cac : avgLtv > 0 ? Infinity : 0;
      const monthlyRevenuePerCustomer = avgLtv / 12; // simplified
      const paybackMonths = monthlyRevenuePerCustomer > 0 ? cac / monthlyRevenuePerCustomer : 0;
      const cpc = spend.clicks > 0 ? totalSpend / spend.clicks : 0;
      const ctr = spend.impressions > 0 ? (spend.clicks / spend.impressions) * 100 : 0;
      const conversionRate = spend.clicks > 0 ? (channelOrders.count / spend.clicks) * 100 : 0;
      const roas = totalSpend > 0 ? channelOrders.revenue / totalSpend : 0;

      return {
        channel,
        totalSpend,
        impressions: spend.impressions,
        clicks: spend.clicks,
        orders: channelOrders.count,
        revenue: channelOrders.revenue,
        newCustomers,
        cac,
        avgLtv,
        ltvCacRatio: ltvCacRatio === Infinity ? 999 : ltvCacRatio,
        paybackMonths,
        cpc,
        ctr,
        conversionRate,
        roas,
      };
    }).filter((ch) => ch.totalSpend > 0 || ch.orders > 0);

    // Daily spend trend
    const dailySpend: Record<string, Record<string, number>> = {};
    for (const entry of spendData) {
      const dateKey = entry.date.toISOString().split("T")[0];
      if (!dailySpend[dateKey]) {
        dailySpend[dateKey] = {};
      }
      dailySpend[dateKey][entry.channel] = (dailySpend[dateKey][entry.channel] || 0) + entry.amount;
    }

    const dailyTrend = Object.entries(dailySpend)
      .map(([date, channels]) => ({
        date,
        ...channels,
        total: Object.values(channels).reduce((sum, v) => sum + v, 0),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Summary metrics
    const totalSpend = channelMetrics.reduce((sum, ch) => sum + ch.totalSpend, 0);
    const totalNewCustomers = new Set(orders.map((o) => o.customerEmail)).size;
    const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
    const blendedCac = totalNewCustomers > 0 ? totalSpend / totalNewCustomers : 0;
    const allTimeCustomers = new Set(allOrders.map((o) => o.customerEmail));
    const allTimeRevenue = allOrders.reduce((sum, o) => sum + o.amount, 0);
    const avgLtv = allTimeCustomers.size > 0 ? allTimeRevenue / allTimeCustomers.size : 0;
    const blendedLtvCacRatio = blendedCac > 0 ? avgLtv / blendedCac : 0;
    const blendedRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

    return NextResponse.json({
      summary: {
        totalSpend,
        totalNewCustomers,
        totalRevenue,
        blendedCac,
        avgLtv,
        blendedLtvCacRatio,
        blendedRoas,
        period: days,
      },
      channelMetrics,
      dailyTrend,
    });
  } catch (error) {
    console.error("CAC API error:", error);
    return NextResponse.json({ error: "Failed to fetch CAC data" }, { status: 500 });
  }
}

// POST: Add or update marketing spend entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { channel, amount, impressions, clicks, conversions, revenue, date, notes } = body;

    if (!channel || amount === undefined || !date) {
      return NextResponse.json({ error: "Missing required fields: channel, amount, date" }, { status: 400 });
    }

    if (!CHANNELS.includes(channel)) {
      return NextResponse.json({ error: `Invalid channel. Must be one of: ${CHANNELS.join(", ")}` }, { status: 400 });
    }

    const spendDate = new Date(date);
    spendDate.setHours(0, 0, 0, 0);

    const entry = await prisma.marketingSpend.upsert({
      where: {
        channel_date: { channel, date: spendDate },
      },
      update: {
        amount: parseFloat(amount),
        impressions: parseInt(impressions) || 0,
        clicks: parseInt(clicks) || 0,
        conversions: parseInt(conversions) || 0,
        revenue: parseFloat(revenue) || 0,
        notes: notes || null,
      },
      create: {
        channel,
        amount: parseFloat(amount),
        impressions: parseInt(impressions) || 0,
        clicks: parseInt(clicks) || 0,
        conversions: parseInt(conversions) || 0,
        revenue: parseFloat(revenue) || 0,
        date: spendDate,
        notes: notes || null,
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("CAC POST error:", error);
    return NextResponse.json({ error: "Failed to save spend data" }, { status: 500 });
  }
}

// DELETE: Remove a marketing spend entry
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    await prisma.marketingSpend.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CAC DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 });
  }
}
