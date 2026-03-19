'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FunnelStep {
  step: string;
  label: string;
  count: number;
  uniqueSessions: number;
  conversionRate: number;
  dropOffRate: number;
  dropOffCount: number;
}

interface FunnelMetrics {
  totalSessions: number;
  totalConversions: number;
  overallConversionRate: number;
  totalRevenue: number;
  avgOrderValue: number;
}

interface DropOffPoint {
  step: string;
  label: string;
  dropOffRate: number;
  dropOffCount: number;
}

interface SourceData {
  source: string;
  sessions: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
}

interface TimeSeriesData {
  date: string;
  [key: string]: number | string;
}

interface FunnelData {
  funnel: FunnelStep[];
  metrics: FunnelMetrics;
  dropOffPoints: DropOffPoint[];
  timeSeries: TimeSeriesData[];
  sourceBreakdown: SourceData[];
  dateRange: {
    start: string;
    end: string;
  };
}

export default function ConversionFunnelPage() {
  const [data, setData] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analytics/conversion-funnel?timeRange=${timeRange}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.error || 'Failed to load data');
      }
    } catch (err) {
      console.error('Error fetching funnel data:', err);
      setError('Failed to fetch funnel data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-[#C9A96E] mb-8">Conversion Funnel Analytics</h1>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-[#111] border border-[#1d1d1f] rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-7xl mx-auto text-center py-20">
          <p className="text-red-400 text-lg">{error || 'No data available'}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-6 py-2 bg-[#C9A96E] text-black rounded-lg hover:bg-[#B89960] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const maxCount = data.funnel[0]?.count || 1;

  return (
    <div className="min-h-screen bg-black text-[#F5F5F7] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[#C9A96E] mb-2">Conversion Funnel Analytics</h1>
            <p className="text-[#86868b]">
              Track customer journey: Homepage → Product Page → Add to Cart → Checkout → Purchase
            </p>
            <p className="text-[#86868b] text-sm mt-1">
              {new Date(data.dateRange.start).toLocaleDateString()} - {new Date(data.dateRange.end).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            {['1d', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-[#C9A96E] text-black'
                    : 'bg-[#1d1d1f] text-[#86868b] hover:bg-[#2d2d2f] hover:text-[#F5F5F7]'
                }`}
              >
                {range === '1d' ? 'Today' : range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <MetricCard
            title="Total Sessions"
            value={data.metrics.totalSessions.toLocaleString()}
            subtitle="Unique visitors"
            icon="👥"
          />
          <MetricCard
            title="Conversions"
            value={data.metrics.totalConversions.toLocaleString()}
            subtitle={`${data.metrics.overallConversionRate.toFixed(2)}% conversion`}
            icon="✅"
            trend={data.metrics.overallConversionRate >= 2 ? 'up' : data.metrics.overallConversionRate >= 1 ? 'neutral' : 'down'}
          />
          <MetricCard
            title="Total Revenue"
            value={`$${data.metrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtitle="Total sales"
            icon="💰"
            trend="up"
          />
          <MetricCard
            title="Avg Order Value"
            value={`$${data.metrics.avgOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtitle="Per purchase"
            icon="🛒"
          />
          <MetricCard
            title="Drop-Off Rate"
            value={`${(100 - data.metrics.overallConversionRate).toFixed(1)}%`}
            subtitle={`${data.metrics.totalSessions - data.metrics.totalConversions} lost`}
            icon="📉"
            trend="down"
          />
        </div>

        {/* Funnel Visualization */}
        <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#C9A96E] mb-6">Conversion Funnel</h2>
          <div className="space-y-6">
            {data.funnel.map((step, index) => {
              const widthPercent = (step.count / maxCount) * 100;
              const isLast = index === data.funnel.length - 1;

              return (
                <div key={step.step}>
                  <div className="flex items-center gap-6 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#C9A96E] text-black font-bold flex items-center justify-center text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-semibold text-lg">{step.label}</div>
                          <div className="text-sm text-[#86868b]">
                            {step.count.toLocaleString()} sessions • {step.conversionRate.toFixed(1)}% of total
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{step.count.toLocaleString()}</div>
                          {!isLast && step.dropOffRate > 0 && (
                            <div className="text-sm text-red-400">
                              -{step.dropOffRate.toFixed(1)}% drop-off ({step.dropOffCount.toLocaleString()})
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="h-12 bg-[#1d1d1f] rounded-lg overflow-hidden relative">
                        <div
                          className="h-full bg-gradient-to-r from-[#C9A96E] to-[#B89960] transition-all duration-500 flex items-center px-4"
                          style={{
                            width: `${widthPercent}%`,
                            opacity: 1 - index * 0.12,
                          }}
                        >
                          <span className="text-sm font-bold text-black">
                            {step.conversionRate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Drop-off indicator */}
                  {!isLast && step.dropOffRate > 0 && (
                    <div className="ml-14 pl-6 border-l-2 border-red-500/30 py-2">
                      <div className="text-sm text-red-400 flex items-center gap-2">
                        <span className="text-lg">⚠️</span>
                        <span>
                          <strong>{step.dropOffCount.toLocaleString()} users</strong> dropped off after this step
                          {step.dropOffRate > 50 && (
                            <span className="ml-2 px-2 py-0.5 bg-red-500/20 text-red-300 rounded text-xs font-bold">
                              CRITICAL
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Drop-off Points */}
        {data.dropOffPoints.length > 0 && (
          <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#C9A96E] mb-4">🚨 Critical Drop-off Points</h2>
            <p className="text-[#86868b] mb-6">Biggest conversion blockers requiring immediate attention</p>
            <div className="space-y-4">
              {data.dropOffPoints.map((point, index) => (
                <div
                  key={point.step}
                  className="flex items-center gap-4 p-4 bg-[#1d1d1f] border border-red-500/20 rounded-xl hover:border-red-500/40 transition"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                    <span className="text-red-400 font-bold text-lg">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white mb-1">{point.label}</div>
                    <div className="text-sm text-[#86868b]">
                      {point.dropOffCount.toLocaleString()} users lost • {point.dropOffRate.toFixed(1)}% drop-off rate
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-400">{point.dropOffRate.toFixed(1)}%</div>
                    <div className="text-xs text-[#86868b]">Drop-off</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actionable Insights */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h3 className="text-sm font-bold text-blue-400 mb-2">💡 Recommended Actions</h3>
              <ul className="text-sm text-[#F5F5F7] space-y-2">
                {data.dropOffPoints[0]?.label.includes('Product Page') && (
                  <li>• Optimize product page UX: clearer CTA, social proof, trust signals</li>
                )}
                {data.dropOffPoints[0]?.label.includes('Add to Cart') && (
                  <li>• Simplify photo upload: reduce friction, add progress indicators, optimize for mobile</li>
                )}
                {data.dropOffPoints[0]?.label.includes('Checkout') && (
                  <li>• Reduce checkout friction: guest checkout, fewer form fields, trust badges</li>
                )}
                {data.dropOffPoints[0]?.label.includes('Payment') && (
                  <li>• Optimize payment flow: multiple payment options, clear pricing, security badges</li>
                )}
                <li>• A/B test improvements on the highest drop-off step first</li>
                <li>• Implement exit-intent popups or discount offers at critical drop-off points</li>
              </ul>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Traffic Source Performance */}
          {data.sourceBreakdown.length > 0 && (
            <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-[#C9A96E] mb-4">Traffic Source Performance</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#1d1d1f] text-[#86868b]">
                      <th className="text-left py-3">Source</th>
                      <th className="text-right py-3">Sessions</th>
                      <th className="text-right py-3">Conv %</th>
                      <th className="text-right py-3">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.sourceBreakdown.slice(0, 8).map((source) => (
                      <tr key={source.source} className="border-b border-[#1d1d1f]/50 hover:bg-[#1d1d1f]/50">
                        <td className="py-3 font-medium capitalize">{source.source}</td>
                        <td className="py-3 text-right">{source.sessions.toLocaleString()}</td>
                        <td className="py-3 text-right">
                          <span className={source.conversionRate >= 2 ? 'text-green-400' : source.conversionRate >= 1 ? 'text-yellow-400' : 'text-red-400'}>
                            {source.conversionRate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 text-right font-semibold text-[#C9A96E]">
                          ${source.revenue.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Daily Trend */}
          <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-[#C9A96E] mb-4">Daily Conversion Trend</h2>
            <div className="space-y-3">
              {data.timeSeries.slice(-7).reverse().map((day) => {
                const conversionRate = Number(day.page_view) > 0
                  ? (Number(day.purchase_complete || 0) / Number(day.page_view)) * 100
                  : 0;

                return (
                  <div key={day.date} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-[#86868b]">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex-1">
                      <div className="h-8 bg-[#1d1d1f] rounded-lg overflow-hidden relative">
                        <div
                          className="h-full bg-gradient-to-r from-[#C9A96E] to-[#B89960] transition-all duration-500"
                          style={{ width: `${Math.min(100, conversionRate * 20)}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-20 text-right">
                      <div className="font-semibold">{conversionRate.toFixed(1)}%</div>
                      <div className="text-xs text-[#86868b]">{day.purchase_complete || 0} sales</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <Link
            href="/admin/analytics"
            className="px-6 py-3 bg-[#1d1d1f] text-[#C9A96E] border border-[#C9A96E] rounded-lg hover:bg-[#2d2d2f] transition"
          >
            ← Back to Analytics
          </Link>
          <Link
            href="/admin/funnel"
            className="px-6 py-3 bg-[#1d1d1f] text-[#C9A96E] border border-[#C9A96E] rounded-lg hover:bg-[#2d2d2f] transition"
          >
            View Mobile Funnel Analysis
          </Link>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend = 'neutral',
}: {
  title: string;
  value: string;
  subtitle: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
}) {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-[#86868b]',
  };

  return (
    <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6 hover:border-[#C9A96E] transition">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[#86868b] text-sm font-medium">{title}</div>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className={`text-sm ${trendColors[trend]}`}>{subtitle}</div>
    </div>
  );
}
