import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch marketing spend data
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30');
    const channel = searchParams.get('channel');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const where: any = {
      date: { gte: startDate },
    };

    if (channel) {
      where.channel = channel;
    }

    const spendData = await prisma.marketingSpend.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    // Aggregate by channel
    const byChannel = new Map<string, {
      totalSpend: number;
      totalImpressions: number;
      totalClicks: number;
      totalConversions: number;
      totalRevenue: number;
      records: number;
    }>();

    for (const spend of spendData) {
      const existing = byChannel.get(spend.channel) || {
        totalSpend: 0,
        totalImpressions: 0,
        totalClicks: 0,
        totalConversions: 0,
        totalRevenue: 0,
        records: 0,
      };

      existing.totalSpend += spend.amount;
      existing.totalImpressions += spend.impressions;
      existing.totalClicks += spend.clicks;
      existing.totalConversions += spend.conversions;
      existing.totalRevenue += spend.revenue;
      existing.records += 1;

      byChannel.set(spend.channel, existing);
    }

    const summary = Array.from(byChannel.entries()).map(([channel, data]) => ({
      channel,
      ...data,
      avgCPC: data.totalClicks > 0 ? data.totalSpend / data.totalClicks : 0,
      ctr: data.totalImpressions > 0 ? (data.totalClicks / data.totalImpressions) * 100 : 0,
      conversionRate: data.totalClicks > 0 ? (data.totalConversions / data.totalClicks) * 100 : 0,
      roas: data.totalSpend > 0 ? data.totalRevenue / data.totalSpend : 0,
    }));

    return NextResponse.json({
      spendData,
      summary,
      total: {
        spend: Array.from(byChannel.values()).reduce((sum, d) => sum + d.totalSpend, 0),
        impressions: Array.from(byChannel.values()).reduce((sum, d) => sum + d.totalImpressions, 0),
        clicks: Array.from(byChannel.values()).reduce((sum, d) => sum + d.totalClicks, 0),
        conversions: Array.from(byChannel.values()).reduce((sum, d) => sum + d.totalConversions, 0),
        revenue: Array.from(byChannel.values()).reduce((sum, d) => sum + d.totalRevenue, 0),
      },
    });
  } catch (error) {
    console.error('Marketing spend fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch marketing spend data' },
      { status: 500 }
    );
  }
}

// POST - Create or update marketing spend record
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      channel,
      amount,
      impressions = 0,
      clicks = 0,
      conversions = 0,
      revenue = 0,
      date,
      notes,
    } = body;

    // Validate required fields
    if (!channel || amount === undefined || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: channel, amount, date' },
        { status: 400 }
      );
    }

    const spendDate = new Date(date);
    spendDate.setHours(0, 0, 0, 0); // Normalize to start of day

    // Upsert (create or update if exists)
    const spend = await prisma.marketingSpend.upsert({
      where: {
        channel_date: {
          channel,
          date: spendDate,
        },
      },
      update: {
        amount,
        impressions,
        clicks,
        conversions,
        revenue,
        notes,
      },
      create: {
        channel,
        amount,
        impressions,
        clicks,
        conversions,
        revenue,
        date: spendDate,
        notes,
      },
    });

    return NextResponse.json(spend);
  } catch (error) {
    console.error('Marketing spend create error:', error);
    return NextResponse.json(
      { error: 'Failed to create marketing spend record' },
      { status: 500 }
    );
  }
}

// DELETE - Delete marketing spend record
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing id parameter' },
        { status: 400 }
      );
    }

    await prisma.marketingSpend.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Marketing spend delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete marketing spend record' },
      { status: 500 }
    );
  }
}
