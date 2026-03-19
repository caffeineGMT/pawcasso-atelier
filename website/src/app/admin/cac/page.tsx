'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface ChannelMetric {
  channel: string;
  totalSpend: number;
  impressions: number;
  clicks: number;
  orders: number;
  revenue: number;
  newCustomers: number;
  cac: number;
  avgLtv: number;
  ltvCacRatio: number;
  paybackMonths: number;
  cpc: number;
  ctr: number;
  conversionRate: number;
  roas: number;
}

interface CACData {
  summary: {
    totalSpend: number;
    totalNewCustomers: number;
    totalRevenue: number;
    blendedCac: number;
    avgLtv: number;
    blendedLtvCacRatio: number;
    blendedRoas: number;
    period: number;
  };
  channelMetrics: ChannelMetric[];
  dailyTrend: {
    date: string;
    total: number;
    [channel: string]: string | number;
  }[];
}

const CHANNEL_LABELS: Record<string, string> = {
  google_ads: 'Google Ads',
  instagram: 'Instagram',
  pinterest: 'Pinterest',
  reddit: 'Reddit',
  tiktok: 'TikTok',
  facebook: 'Facebook',
  email: 'Email',
  influencer: 'Influencer',
  organic: 'Organic',
};

const CHANNEL_COLORS: Record<string, string> = {
  google_ads: '#4285F4',
  instagram: '#E1306C',
  pinterest: '#BD081C',
  reddit: '#FF5700',
  tiktok: '#00F2EA',
  facebook: '#1877F2',
  email: '#C9A96E',
  influencer: '#8B5CF6',
  organic: '#10B981',
};

const CHANNELS = ['google_ads', 'instagram', 'pinterest', 'reddit', 'tiktok', 'facebook', 'email', 'influencer', 'organic'];

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatCompact(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toFixed(0);
}

function getRatioHealth(ratio: number): { label: string; color: string; bg: string } {
  if (ratio >= 5) return { label: 'Excellent', color: 'text-green-400', bg: 'bg-green-500/20' };
  if (ratio >= 3) return { label: 'Healthy', color: 'text-green-400', bg: 'bg-green-500/20' };
  if (ratio >= 2) return { label: 'Acceptable', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
  if (ratio >= 1) return { label: 'Warning', color: 'text-orange-400', bg: 'bg-orange-500/20' };
  return { label: 'Unprofitable', color: 'text-red-400', bg: 'bg-red-500/20' };
}

function getPaybackHealth(months: number): { color: string } {
  if (months === 0) return { color: 'text-[#86868b]' };
  if (months <= 3) return { color: 'text-green-400' };
  if (months <= 6) return { color: 'text-yellow-400' };
  if (months <= 12) return { color: 'text-orange-400' };
  return { color: 'text-red-400' };
}

export default function CACDashboardPage() {
  const [data, setData] = useState<CACData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');
  const [showSpendForm, setShowSpendForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    channel: 'google_ads',
    amount: '',
    impressions: '',
    clicks: '',
    conversions: '',
    revenue: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/cac?period=${period}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to fetch CAC data:', err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmitSpend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/admin/cac', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setShowSpendForm(false);
      setFormData({
        channel: 'google_ads',
        amount: '',
        impressions: '',
        clicks: '',
        conversions: '',
        revenue: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      await fetchData();
    } catch (err) {
      console.error('Failed to save spend:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#C9A96E] text-xl">Loading CAC Dashboard...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500">Failed to load CAC data</div>
      </div>
    );
  }

  const { summary, channelMetrics, dailyTrend } = data;
  const ratioHealth = getRatioHealth(summary.blendedLtvCacRatio);

  return (
    <div className="min-h-screen bg-black text-[#F5F5F7] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/admin" className="text-[#86868b] hover:text-[#C9A96E] transition">
                &larr; Admin
              </Link>
              <span className="text-[#86868b]">/</span>
              <h1 className="text-4xl font-bold text-[#C9A96E]">Customer Acquisition Cost</h1>
            </div>
            <p className="text-[#86868b]">Track spend efficiency across channels. Target LTV:CAC ratio of 3:1+.</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-[#1d1d1f] border border-[#333] text-[#F5F5F7] rounded-lg px-4 py-2 focus:border-[#C9A96E] focus:outline-none"
            >
              <option value="7">Last 7 days</option>
              <option value="14">Last 14 days</option>
              <option value="30">Last 30 days</option>
              <option value="60">Last 60 days</option>
              <option value="90">Last 90 days</option>
              <option value="180">Last 6 months</option>
              <option value="365">Last year</option>
            </select>
            <button
              onClick={() => setShowSpendForm(true)}
              className="bg-[#C9A96E] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#B89960] transition whitespace-nowrap"
            >
              + Log Spend
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Blended CAC"
            value={formatCurrency(summary.blendedCac)}
            subtitle={`${summary.totalNewCustomers} new customers`}
            highlight={summary.blendedCac > 0}
          />
          <SummaryCard
            title="Average LTV"
            value={formatCurrency(summary.avgLtv)}
            subtitle="All-time per customer"
          />
          <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6 hover:border-[#C9A96E] transition">
            <div className="text-[#86868b] text-sm font-medium mb-2">LTV:CAC Ratio</div>
            <div className="text-3xl font-bold mb-2">
              {summary.blendedLtvCacRatio > 0 ? `${summary.blendedLtvCacRatio.toFixed(1)}x` : 'N/A'}
            </div>
            <div className={`text-sm inline-block px-2 py-0.5 rounded ${ratioHealth.bg} ${ratioHealth.color}`}>
              {ratioHealth.label}
            </div>
          </div>
          <SummaryCard
            title="Blended ROAS"
            value={summary.blendedRoas > 0 ? `${summary.blendedRoas.toFixed(1)}x` : 'N/A'}
            subtitle={`${formatCurrency(summary.totalSpend)} total spend`}
          />
        </div>

        {/* Total Spend vs Revenue */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6">
            <div className="text-[#86868b] text-sm font-medium mb-2">Total Marketing Spend</div>
            <div className="text-4xl font-bold text-red-400 mb-1">{formatCurrency(summary.totalSpend)}</div>
            <div className="text-sm text-[#86868b]">Last {summary.period} days</div>
          </div>
          <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6">
            <div className="text-[#86868b] text-sm font-medium mb-2">Attributed Revenue</div>
            <div className="text-4xl font-bold text-green-400 mb-1">{formatCurrency(summary.totalRevenue)}</div>
            <div className="text-sm text-[#86868b]">Last {summary.period} days</div>
          </div>
        </div>

        {/* Channel Performance Table */}
        {channelMetrics.length > 0 ? (
          <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#C9A96E] mb-6">CAC by Channel</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#86868b] border-b border-[#1d1d1f]">
                    <th className="pb-4 font-semibold">Channel</th>
                    <th className="pb-4 font-semibold text-right">Spend</th>
                    <th className="pb-4 font-semibold text-right">Impr.</th>
                    <th className="pb-4 font-semibold text-right">Clicks</th>
                    <th className="pb-4 font-semibold text-right">CTR</th>
                    <th className="pb-4 font-semibold text-right">CPC</th>
                    <th className="pb-4 font-semibold text-right">Orders</th>
                    <th className="pb-4 font-semibold text-right">Revenue</th>
                    <th className="pb-4 font-semibold text-right">CAC</th>
                    <th className="pb-4 font-semibold text-right">LTV</th>
                    <th className="pb-4 font-semibold text-right">LTV:CAC</th>
                    <th className="pb-4 font-semibold text-right">Payback</th>
                    <th className="pb-4 font-semibold text-right">ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  {channelMetrics
                    .sort((a, b) => b.totalSpend - a.totalSpend)
                    .map((ch) => {
                      const ratio = getRatioHealth(ch.ltvCacRatio);
                      const payback = getPaybackHealth(ch.paybackMonths);
                      return (
                        <tr key={ch.channel} className="border-b border-[#1d1d1f] last:border-0 hover:bg-[#1d1d1f]/50">
                          <td className="py-4 font-medium">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: CHANNEL_COLORS[ch.channel] }}
                              />
                              {CHANNEL_LABELS[ch.channel] || ch.channel}
                            </div>
                          </td>
                          <td className="py-4 text-right font-semibold">{formatCurrency(ch.totalSpend)}</td>
                          <td className="py-4 text-right text-[#86868b]">{formatCompact(ch.impressions)}</td>
                          <td className="py-4 text-right text-[#86868b]">{formatCompact(ch.clicks)}</td>
                          <td className="py-4 text-right text-[#86868b]">{ch.ctr.toFixed(2)}%</td>
                          <td className="py-4 text-right text-[#86868b]">{formatCurrency(ch.cpc)}</td>
                          <td className="py-4 text-right">{ch.orders}</td>
                          <td className="py-4 text-right text-green-400">{formatCurrency(ch.revenue)}</td>
                          <td className="py-4 text-right font-bold text-[#C9A96E]">
                            {ch.cac > 0 ? formatCurrency(ch.cac) : 'N/A'}
                          </td>
                          <td className="py-4 text-right">{formatCurrency(ch.avgLtv)}</td>
                          <td className={`py-4 text-right font-bold ${ratio.color}`}>
                            {ch.ltvCacRatio > 0 ? `${ch.ltvCacRatio.toFixed(1)}x` : 'N/A'}
                          </td>
                          <td className={`py-4 text-right ${payback.color}`}>
                            {ch.paybackMonths > 0 ? `${ch.paybackMonths.toFixed(1)}mo` : 'N/A'}
                          </td>
                          <td className="py-4 text-right">
                            {ch.roas > 0 ? `${ch.roas.toFixed(1)}x` : 'N/A'}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-12 mb-8 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-[#C9A96E] mb-2">No Spend Data Yet</h2>
            <p className="text-[#86868b] mb-6">
              Start logging your marketing spend to see CAC metrics, LTV:CAC ratios, and payback periods.
            </p>
            <button
              onClick={() => setShowSpendForm(true)}
              className="bg-[#C9A96E] text-black px-8 py-3 rounded-lg font-semibold hover:bg-[#B89960] transition"
            >
              Log Your First Spend
            </button>
          </div>
        )}

        {/* Spend Allocation Visual */}
        {channelMetrics.length > 0 && (
          <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#C9A96E] mb-6">Spend Allocation</h2>
            <div className="flex rounded-xl overflow-hidden h-12 mb-6">
              {channelMetrics
                .filter((ch) => ch.totalSpend > 0)
                .sort((a, b) => b.totalSpend - a.totalSpend)
                .map((ch) => {
                  const pct = (ch.totalSpend / summary.totalSpend) * 100;
                  return (
                    <div
                      key={ch.channel}
                      className="relative group"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: CHANNEL_COLORS[ch.channel],
                        minWidth: pct > 3 ? undefined : '4px',
                      }}
                    >
                      {pct > 8 && (
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                          {pct.toFixed(0)}%
                        </div>
                      )}
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#333] text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                        {CHANNEL_LABELS[ch.channel]}: {formatCurrency(ch.totalSpend)} ({pct.toFixed(1)}%)
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="flex flex-wrap gap-4">
              {channelMetrics
                .filter((ch) => ch.totalSpend > 0)
                .sort((a, b) => b.totalSpend - a.totalSpend)
                .map((ch) => (
                  <div key={ch.channel} className="flex items-center gap-2 text-sm">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: CHANNEL_COLORS[ch.channel] }}
                    />
                    <span className="text-[#86868b]">{CHANNEL_LABELS[ch.channel]}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Channel Efficiency Comparison */}
        {channelMetrics.length > 0 && (
          <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#C9A96E] mb-6">Channel Efficiency</h2>
            <div className="space-y-4">
              {channelMetrics
                .filter((ch) => ch.cac > 0)
                .sort((a, b) => a.cac - b.cac)
                .map((ch) => {
                  const maxCac = Math.max(...channelMetrics.filter((c) => c.cac > 0).map((c) => c.cac), 1);
                  const barWidth = (ch.cac / maxCac) * 100;
                  const ratio = getRatioHealth(ch.ltvCacRatio);

                  return (
                    <div key={ch.channel} className="flex items-center gap-4">
                      <div className="w-28 text-sm font-medium flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: CHANNEL_COLORS[ch.channel] }}
                        />
                        {CHANNEL_LABELS[ch.channel]}
                      </div>
                      <div className="flex-1">
                        <div className="h-8 bg-[#1d1d1f] rounded-lg overflow-hidden relative">
                          <div
                            className="h-full rounded-lg transition-all duration-500 flex items-center px-3"
                            style={{
                              width: `${barWidth}%`,
                              backgroundColor: CHANNEL_COLORS[ch.channel],
                              opacity: 0.8,
                            }}
                          >
                            {barWidth > 20 && (
                              <span className="text-xs font-bold text-white">
                                CAC: {formatCurrency(ch.cac)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="w-20 text-right text-sm">
                        {barWidth <= 20 && (
                          <span className="font-semibold">{formatCurrency(ch.cac)}</span>
                        )}
                      </div>
                      <div className={`w-16 text-right text-sm font-bold ${ratio.color}`}>
                        {ch.ltvCacRatio.toFixed(1)}x
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="mt-4 text-xs text-[#86868b]">
              Sorted by lowest CAC (most efficient first). Right column shows LTV:CAC ratio.
            </div>
          </div>
        )}

        {/* Daily Spend Trend */}
        {dailyTrend.length > 0 && (
          <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#C9A96E] mb-6">Daily Spend</h2>
            <div className="space-y-3">
              {dailyTrend.slice(-14).map((day) => {
                const maxTotal = Math.max(...dailyTrend.map((d) => d.total as number), 1);
                const barWidth = ((day.total as number) / maxTotal) * 100;

                return (
                  <div key={day.date} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-[#86868b]">
                      {new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="flex-1">
                      <div className="h-7 bg-[#1d1d1f] rounded-lg overflow-hidden flex">
                        {CHANNELS.map((channel) => {
                          const val = (day[channel] as number) || 0;
                          if (val === 0) return null;
                          const w = (val / (day.total as number)) * barWidth;
                          return (
                            <div
                              key={channel}
                              className="h-full"
                              style={{
                                width: `${w}%`,
                                backgroundColor: CHANNEL_COLORS[channel],
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                    <div className="w-20 text-right font-semibold text-sm">
                      {formatCurrency(day.total as number)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Decision Guide */}
        <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-[#C9A96E] mb-4">Spend Decision Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <div className="font-bold text-green-400 mb-1">Scale Up</div>
              <div className="text-[#86868b]">LTV:CAC &gt; 3x and ROAS &gt; 3x. Increase budget aggressively.</div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <div className="font-bold text-yellow-400 mb-1">Optimize</div>
              <div className="text-[#86868b]">LTV:CAC 2-3x. Improve targeting, creatives, or landing pages.</div>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
              <div className="font-bold text-orange-400 mb-1">Watch</div>
              <div className="text-[#86868b]">LTV:CAC 1-2x. Review within 2 weeks or reduce spend.</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <div className="font-bold text-red-400 mb-1">Pause</div>
              <div className="text-[#86868b]">LTV:CAC &lt; 1x. Losing money. Pause and reassess strategy.</div>
            </div>
          </div>
        </div>

        {/* Spend Entry Form Modal */}
        {showSpendForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#C9A96E]">Log Marketing Spend</h2>
                <button
                  onClick={() => setShowSpendForm(false)}
                  className="text-[#86868b] hover:text-white transition text-2xl"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleSubmitSpend} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#86868b] mb-1">Channel</label>
                  <select
                    value={formData.channel}
                    onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                    className="w-full bg-[#1d1d1f] border border-[#333] rounded-lg px-4 py-3 text-[#F5F5F7] focus:border-[#C9A96E] focus:outline-none"
                  >
                    {CHANNELS.map((ch) => (
                      <option key={ch} value={ch}>
                        {CHANNEL_LABELS[ch]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#86868b] mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#1d1d1f] border border-[#333] rounded-lg px-4 py-3 text-[#F5F5F7] focus:border-[#C9A96E] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#86868b] mb-1">Amount Spent ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="e.g. 150.00"
                    className="w-full bg-[#1d1d1f] border border-[#333] rounded-lg px-4 py-3 text-[#F5F5F7] focus:border-[#C9A96E] focus:outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#86868b] mb-1">Impressions</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.impressions}
                      onChange={(e) => setFormData({ ...formData, impressions: e.target.value })}
                      placeholder="0"
                      className="w-full bg-[#1d1d1f] border border-[#333] rounded-lg px-4 py-3 text-[#F5F5F7] focus:border-[#C9A96E] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#86868b] mb-1">Clicks</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.clicks}
                      onChange={(e) => setFormData({ ...formData, clicks: e.target.value })}
                      placeholder="0"
                      className="w-full bg-[#1d1d1f] border border-[#333] rounded-lg px-4 py-3 text-[#F5F5F7] focus:border-[#C9A96E] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#86868b] mb-1">Conversions</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.conversions}
                      onChange={(e) => setFormData({ ...formData, conversions: e.target.value })}
                      placeholder="0"
                      className="w-full bg-[#1d1d1f] border border-[#333] rounded-lg px-4 py-3 text-[#F5F5F7] focus:border-[#C9A96E] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#86868b] mb-1">Revenue ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.revenue}
                      onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                      placeholder="0.00"
                      className="w-full bg-[#1d1d1f] border border-[#333] rounded-lg px-4 py-3 text-[#F5F5F7] focus:border-[#C9A96E] focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#86868b] mb-1">Notes (optional)</label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. New creative test, Black Friday promo"
                    className="w-full bg-[#1d1d1f] border border-[#333] rounded-lg px-4 py-3 text-[#F5F5F7] focus:border-[#C9A96E] focus:outline-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-[#C9A96E] text-black py-3 rounded-lg font-semibold hover:bg-[#B89960] transition disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Spend Entry'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSpendForm(false)}
                    className="px-6 py-3 border border-[#333] rounded-lg text-[#86868b] hover:text-white hover:border-[#555] transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
              <div className="mt-4 text-xs text-[#86868b]">
                Entries are deduplicated by channel + date. Submitting for an existing date updates the record.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  highlight = false,
}: {
  title: string;
  value: string;
  subtitle: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6 hover:border-[#C9A96E] transition">
      <div className="text-[#86868b] text-sm font-medium mb-2">{title}</div>
      <div className={`text-3xl font-bold mb-1 ${highlight ? 'text-[#C9A96E]' : ''}`}>{value}</div>
      <div className="text-sm text-[#86868b]">{subtitle}</div>
    </div>
  );
}
