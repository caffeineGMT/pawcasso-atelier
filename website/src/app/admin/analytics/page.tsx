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
    marketingSpend: number;
    cac: number;
    ltvCacRatio: number;
    roas: number;
    newCustomers: number;
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
  cacSummary: {
    totalMarketingSpend: number;
    totalNewCustomers: number;
    blendedCAC: number;
    blendedLTVCACRatio: number;
    totalROAS: number;
  };
  funnel?: {
    eventName: string;
    count: number;
  }[];
  attribution?: {
    utmSource: string;
    totalRevenue: number;
    customers: number;
    purchases: number;
  }[];
  recentEvents?: {
    id: string;
    eventName: string;
    userId: string | null;
    utmSource: string | null;
    utmMedium: string | null;
    utmCampaign: string | null;
    revenue: number;
    metadata: string | null;
    createdAt: string;
  }[];
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
          <div className="flex gap-4">
            <a
              href="/admin/marketing-spend"
              className="bg-[#1d1d1f] text-[#C9A96E] border border-[#C9A96E] px-6 py-3 rounded-lg font-semibold hover:bg-[#2d2d2f] transition"
            >
              📊 Manage Marketing Spend
            </a>
            <button
              onClick={syncStripeData}
              disabled={syncing}
              className="bg-[#C9A96E] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#B89960] transition disabled:opacity-50"
            >
              {syncing ? 'Syncing...' : 'Sync Stripe Data'}
            </button>
          </div>
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

        {/* CAC Summary Cards */}
        {analytics.cacSummary && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#C9A96E] mb-6">Customer Acquisition Cost (CAC) Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <MetricCard
                title="Marketing Spend (30d)"
                value={`$${analytics.cacSummary.totalMarketingSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                subtitle="Total ad spend"
                trend="neutral"
              />
              <MetricCard
                title="New Customers"
                value={analytics.cacSummary.totalNewCustomers.toString()}
                subtitle="First-time buyers"
                trend={analytics.cacSummary.totalNewCustomers > 0 ? 'up' : 'neutral'}
              />
              <MetricCard
                title="Blended CAC"
                value={`$${analytics.cacSummary.blendedCAC.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                subtitle="Cost per customer"
                trend={analytics.cacSummary.blendedCAC < 50 ? 'up' : analytics.cacSummary.blendedCAC > 100 ? 'down' : 'neutral'}
              />
              <MetricCard
                title="LTV:CAC Ratio"
                value={analytics.cacSummary.blendedLTVCACRatio.toFixed(2)}
                subtitle={analytics.cacSummary.blendedLTVCACRatio >= 3 ? "✅ Healthy (≥3:1)" : "⚠️ Below target"}
                trend={analytics.cacSummary.blendedLTVCACRatio >= 3 ? 'up' : analytics.cacSummary.blendedLTVCACRatio >= 2 ? 'neutral' : 'down'}
              />
              <MetricCard
                title="Total ROAS"
                value={analytics.cacSummary.totalROAS.toFixed(2)}
                subtitle={analytics.cacSummary.totalROAS >= 3 ? "✅ Profitable" : "⚠️ Low return"}
                trend={analytics.cacSummary.totalROAS >= 3 ? 'up' : analytics.cacSummary.totalROAS >= 2 ? 'neutral' : 'down'}
              />
            </div>
          </div>
        )}

        {/* Conversion Funnel */}
        {analytics.funnel && analytics.funnel.length > 0 && (
          <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#C9A96E] mb-6">Conversion Funnel</h2>
            <div className="space-y-4">
              {analytics.funnel.map((step, index) => {
                const prevCount = index > 0 ? analytics.funnel![index - 1].count : step.count;
                const dropoffPercent = index > 0 ? (((prevCount - step.count) / prevCount) * 100).toFixed(1) : '0';
                const conversionPercent = ((step.count / (analytics.funnel![0]?.count || 1)) * 100).toFixed(1);
                const maxCount = analytics.funnel![0]?.count || 1;
                const widthPercent = (step.count / maxCount) * 100;

                return (
                  <div key={index}>
                    <div className="flex items-center gap-4 mb-1">
                      <div className="w-32 text-sm font-medium">{step.eventName.replace(/_/g, ' ')}</div>
                      <div className="flex-1">
                        <div className="h-10 bg-[#1d1d1f] rounded-lg overflow-hidden relative">
                          <div
                            className="h-full bg-gradient-to-r from-[#C9A96E] to-[#B89960] transition-all duration-500 flex items-center px-4"
                            style={{ width: `${widthPercent}%`, opacity: 1 - index * 0.15 }}
                          >
                            <span className="text-sm font-bold text-black">
                              {step.count} ({conversionPercent}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index > 0 && parseFloat(dropoffPercent) > 0 && (
                      <div className="text-xs text-red-400 ml-36">
                        -{dropoffPercent}% drop-off from previous step
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Attribution by Source */}
        {analytics.attribution && analytics.attribution.length > 0 && (
          <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#C9A96E] mb-6">Revenue by Source</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-[#86868b] border-b border-[#1d1d1f]">
                    <th className="pb-4 font-semibold">UTM Source</th>
                    <th className="pb-4 font-semibold text-right">Revenue</th>
                    <th className="pb-4 font-semibold text-right">Customers</th>
                    <th className="pb-4 font-semibold text-right">Purchases</th>
                    <th className="pb-4 font-semibold text-right">Avg/Customer</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.attribution.map((source, index) => (
                    <tr key={index} className="border-b border-[#1d1d1f] last:border-0">
                      <td className="py-4 font-medium capitalize">{source.utmSource}</td>
                      <td className="py-4 text-right font-semibold text-[#C9A96E]">
                        ${source.totalRevenue.toFixed(2)}
                      </td>
                      <td className="py-4 text-right">{source.customers}</td>
                      <td className="py-4 text-right">{source.purchases}</td>
                      <td className="py-4 text-right">
                        ${(source.totalRevenue / source.customers).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Acquisition Channel Breakdown with CAC */}
        <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-[#C9A96E] mb-6">Acquisition Channels - CAC Analysis</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[#86868b] border-b border-[#1d1d1f]">
                  <th className="pb-4 font-semibold">Channel</th>
                  <th className="pb-4 font-semibold text-right">Orders</th>
                  <th className="pb-4 font-semibold text-right">New Customers</th>
                  <th className="pb-4 font-semibold text-right">Revenue</th>
                  <th className="pb-4 font-semibold text-right">Ad Spend</th>
                  <th className="pb-4 font-semibold text-right">CAC</th>
                  <th className="pb-4 font-semibold text-right">LTV</th>
                  <th className="pb-4 font-semibold text-right">LTV:CAC</th>
                  <th className="pb-4 font-semibold text-right">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {analytics.channelBreakdown.map((channel, index) => {
                  const ltvCacHealthy = channel.ltvCacRatio >= 3;
                  const roasHealthy = channel.roas >= 3;

                  return (
                    <tr key={index} className="border-b border-[#1d1d1f] last:border-0">
                      <td className="py-4 font-medium capitalize">{channel.channel}</td>
                      <td className="py-4 text-right">{channel.orders}</td>
                      <td className="py-4 text-right">{channel.newCustomers}</td>
                      <td className="py-4 text-right">${channel.revenue.toFixed(2)}</td>
                      <td className="py-4 text-right">
                        {channel.marketingSpend > 0 ? (
                          `$${channel.marketingSpend.toFixed(2)}`
                        ) : (
                          <span className="text-[#86868b] text-sm">No spend data</span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        {channel.cac > 0 ? (
                          <span className={channel.cac < 50 ? 'text-green-400' : channel.cac > 100 ? 'text-red-400' : ''}>
                            ${channel.cac.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-[#86868b]">-</span>
                        )}
                      </td>
                      <td className="py-4 text-right text-[#C9A96E] font-semibold">
                        ${channel.ltv.toFixed(2)}
                      </td>
                      <td className="py-4 text-right">
                        {channel.ltvCacRatio > 0 ? (
                          <span className={ltvCacHealthy ? 'text-green-400 font-bold' : 'text-yellow-400'}>
                            {channel.ltvCacRatio.toFixed(2)}x
                            {ltvCacHealthy && ' ✅'}
                          </span>
                        ) : (
                          <span className="text-[#86868b]">-</span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        {channel.roas > 0 ? (
                          <span className={roasHealthy ? 'text-green-400 font-bold' : 'text-yellow-400'}>
                            {channel.roas.toFixed(2)}x
                          </span>
                        ) : (
                          <span className="text-[#86868b]">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {analytics.channelBreakdown.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-[#86868b]">
                      No channel data yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-6 p-4 bg-[#1d1d1f] rounded-lg">
            <div className="text-sm text-[#86868b]">
              <p className="mb-2"><strong className="text-[#F5F5F7]">📊 Key Metrics:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong className="text-[#C9A96E]">CAC</strong> (Customer Acquisition Cost) = Marketing Spend ÷ New Customers</li>
                <li><strong className="text-[#C9A96E]">LTV</strong> (Lifetime Value) = Total Revenue ÷ Total Customers</li>
                <li><strong className="text-[#C9A96E]">LTV:CAC Ratio</strong> - Target: ≥3:1 (healthy), 2-3:1 (acceptable), &lt;2:1 (unprofitable)</li>
                <li><strong className="text-[#C9A96E]">ROAS</strong> (Return on Ad Spend) = Revenue ÷ Ad Spend - Target: ≥3x</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Daily Revenue Chart (Simple Bar Chart) */}
        <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6 mb-8">
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

        {/* Recent Events Stream */}
        {analytics.recentEvents && analytics.recentEvents.length > 0 && (
          <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-[#C9A96E] mb-6">Recent Events (Last 50)</h2>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm font-mono">
                <thead className="sticky top-0 bg-[#111] border-b border-[#1d1d1f]">
                  <tr className="text-left text-[#86868b]">
                    <th className="pb-3 font-semibold">Time</th>
                    <th className="pb-3 font-semibold">Event</th>
                    <th className="pb-3 font-semibold">User</th>
                    <th className="pb-3 font-semibold">Source</th>
                    <th className="pb-3 font-semibold text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentEvents.map((event) => {
                    const eventColors: Record<string, string> = {
                      page_view: 'text-[#86868b]',
                      gallery_view: 'text-blue-400',
                      order_start: 'text-yellow-400',
                      checkout_start: 'text-orange-400',
                      purchase_complete: 'text-green-400',
                    };

                    return (
                      <tr key={event.id} className="border-b border-[#1d1d1f]/50 hover:bg-[#1d1d1f]/50">
                        <td className="py-2 text-[#86868b]">
                          {new Date(event.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className={`py-2 font-semibold ${eventColors[event.eventName] || 'text-[#F5F5F7]'}`}>
                          {event.eventName}
                        </td>
                        <td className="py-2 text-[#86868b] truncate max-w-xs">
                          {event.userId || 'Anonymous'}
                        </td>
                        <td className="py-2 text-[#86868b]">
                          {event.utmSource || 'Direct'}
                        </td>
                        <td className="py-2 text-right">
                          {event.revenue > 0 ? (
                            <span className="text-green-400 font-semibold">
                              ${event.revenue.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-[#86868b]">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
