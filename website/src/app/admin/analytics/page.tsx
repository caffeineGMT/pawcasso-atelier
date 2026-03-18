'use client';

import { useState, useEffect } from 'react';

interface AnalyticsData {
  totalRevenue: number;
  monthlyRevenue: number;
  dailyRevenue: number;
  avgOrderValue: number;
  totalOrders: number;
  monthlyOrders: number;
  dailyOrders: number;
  totalRefunds: number;
  refundRate: number;
  refundAmount: number;
  channelBreakdown: {
    channel: string;
    orders: number;
    revenue: number;
    avgOrderValue: number;
    ltv: number;
  }[];
  dailyStats: {
    date: string;
    orders: number;
    revenue: number;
    refunds: number;
  }[];
  totalCustomers: number;
  repeatCustomers: number;
  avgLtv: number;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncStripeData = async () => {
    try {
      setSyncing(true);
      await fetch('/api/admin/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync' }),
      });
      await fetchAnalytics();
    } catch (error) {
      console.error('Failed to sync:', error);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#C9A96E] text-xl">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500">Failed to load analytics</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#F5F5F7] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#C9A96E]">Revenue Analytics</h1>
          <button
            onClick={syncStripeData}
            disabled={syncing}
            className="bg-[#C9A96E] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#B89960] transition disabled:opacity-50"
          >
            {syncing ? 'Syncing...' : 'Sync Stripe Data'}
          </button>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={`$${analytics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtitle={`Monthly: $${analytics.monthlyRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            trend={analytics.monthlyRevenue > 0 ? 'up' : 'neutral'}
          />
          <MetricCard
            title="Daily Revenue"
            value={`$${analytics.dailyRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtitle={`${analytics.dailyOrders} orders today`}
            trend={analytics.dailyOrders > 0 ? 'up' : 'neutral'}
          />
          <MetricCard
            title="Average Order Value"
            value={`$${analytics.avgOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtitle={`${analytics.totalOrders} total orders`}
            trend="neutral"
          />
          <MetricCard
            title="Refund Rate"
            value={`${analytics.refundRate.toFixed(1)}%`}
            subtitle={`${analytics.totalRefunds} refunds ($${analytics.refundAmount.toFixed(2)})`}
            trend={analytics.refundRate < 5 ? 'neutral' : 'down'}
          />
        </div>

        {/* Customer Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Total Customers"
            value={analytics.totalCustomers.toString()}
            subtitle={`${analytics.repeatCustomers} repeat customers`}
            trend="neutral"
          />
          <MetricCard
            title="Average LTV"
            value={`$${analytics.avgLtv.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtitle="Per customer"
            trend="neutral"
          />
          <MetricCard
            title="Monthly Orders"
            value={analytics.monthlyOrders.toString()}
            subtitle={`This month`}
            trend={analytics.monthlyOrders > 0 ? 'up' : 'neutral'}
          />
        </div>

        {/* Acquisition Channel Breakdown */}
        <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-[#C9A96E] mb-6">Acquisition Channels</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[#86868b] border-b border-[#1d1d1f]">
                  <th className="pb-4 font-semibold">Channel</th>
                  <th className="pb-4 font-semibold text-right">Orders</th>
                  <th className="pb-4 font-semibold text-right">Revenue</th>
                  <th className="pb-4 font-semibold text-right">AOV</th>
                  <th className="pb-4 font-semibold text-right">LTV</th>
                </tr>
              </thead>
              <tbody>
                {analytics.channelBreakdown.map((channel, index) => (
                  <tr key={index} className="border-b border-[#1d1d1f] last:border-0">
                    <td className="py-4 font-medium capitalize">{channel.channel}</td>
                    <td className="py-4 text-right">{channel.orders}</td>
                    <td className="py-4 text-right">${channel.revenue.toFixed(2)}</td>
                    <td className="py-4 text-right">${channel.avgOrderValue.toFixed(2)}</td>
                    <td className="py-4 text-right text-[#C9A96E] font-semibold">
                      ${channel.ltv.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {analytics.channelBreakdown.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#86868b]">
                      No channel data yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Daily Revenue Chart (Simple Bar Chart) */}
        <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-[#C9A96E] mb-6">Daily Performance (Last 30 Days)</h2>
          <div className="space-y-4">
            {analytics.dailyStats.slice(-14).reverse().map((day, index) => {
              const maxRevenue = Math.max(...analytics.dailyStats.map(d => d.revenue), 1);
              const widthPercent = (day.revenue / maxRevenue) * 100;

              return (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-[#86868b]">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex-1">
                    <div className="h-8 bg-[#1d1d1f] rounded-lg overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-[#C9A96E] to-[#B89960] transition-all duration-500"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    <div className="font-semibold">${day.revenue.toFixed(0)}</div>
                    <div className="text-xs text-[#86868b]">{day.orders} orders</div>
                  </div>
                  {day.refunds > 0 && (
                    <div className="text-xs text-red-500">{day.refunds} refunds</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  trend = 'neutral',
}: {
  title: string;
  value: string;
  subtitle: string;
  trend?: 'up' | 'down' | 'neutral';
}) {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-[#86868b]',
  };

  return (
    <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6 hover:border-[#C9A96E] transition">
      <div className="text-[#86868b] text-sm font-medium mb-2">{title}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className={`text-sm ${trendColors[trend]}`}>{subtitle}</div>
    </div>
  );
}
