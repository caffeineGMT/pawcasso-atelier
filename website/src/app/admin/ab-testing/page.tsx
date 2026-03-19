"use client";

import { useState, useEffect } from "react";
import { getVariantDisplayName } from "@/hooks/useABPricing";
import type { PricingVariant } from "@/lib/ab-pricing";

interface VariantStats {
  variant: PricingVariant;
  impressions: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
  averageOrderValue: number;
  revenuePerImpression: number;
}

interface PricingTestStats {
  testId: string;
  testName: string;
  startDate: Date;
  endDate: Date;
  totalImpressions: number;
  totalConversions: number;
  totalRevenue: number;
  variants: VariantStats[];
  winner: PricingVariant | null;
  confidence: number;
}

export default function ABTestingDashboard() {
  const [stats, setStats] = useState<PricingTestStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const now = new Date();
      let startDate: Date;

      switch (dateRange) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0); // All time
      }

      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
      });

      const response = await fetch(`/api/ab-test/stats?${params}`);
      if (!response.ok) throw new Error('Failed to fetch stats');

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-primary to-bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading A/B test results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-primary to-bg-secondary flex items-center justify-center">
        <div className="text-center bg-red-900/20 border border-red-500 rounded-lg p-8 max-w-md">
          <p className="text-red-400 mb-4">Error loading stats</p>
          <p className="text-sm text-text-secondary">{error}</p>
          <button
            onClick={fetchStats}
            className="mt-4 px-4 py-2 bg-accent-gold text-bg-primary rounded-lg hover:bg-accent-gold/80 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-primary to-bg-secondary py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            Dynamic Pricing A/B Test
          </h1>
          <p className="text-text-secondary">
            Measuring price elasticity and revenue impact across variants
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="mb-6 flex gap-2">
          {(['7d', '30d', '90d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                dateRange === range
                  ? 'bg-accent-gold text-bg-primary'
                  : 'bg-bg-secondary text-text-secondary hover:bg-bg-secondary/80'
              }`}
            >
              {range === 'all' ? 'All Time' : `Last ${range.slice(0, -1)} days`}
            </button>
          ))}
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Impressions"
            value={stats.totalImpressions.toLocaleString()}
            icon="👁️"
          />
          <StatCard
            label="Total Conversions"
            value={stats.totalConversions.toLocaleString()}
            icon="🎯"
          />
          <StatCard
            label="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon="💰"
          />
          <StatCard
            label="Overall Conversion Rate"
            value={`${((stats.totalConversions / stats.totalImpressions) * 100).toFixed(2)}%`}
            icon="📊"
          />
        </div>

        {/* Winner Announcement */}
        {stats.winner && stats.confidence > 0 && (
          <div className="bg-gradient-to-r from-green-900/30 to-green-800/30 border border-green-500 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🏆</div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-green-400 mb-1">
                  {getVariantDisplayName(stats.winner)}
                </h2>
                <p className="text-green-300">
                  Leading variant with {stats.confidence}% statistical confidence
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Variant Comparison Table */}
        <div className="bg-bg-secondary/30 border border-border-light rounded-xl overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-bg-secondary/50 border-b border-border-light">
                  <th className="text-left p-4 text-sm font-semibold text-text-secondary uppercase tracking-wider">
                    Variant
                  </th>
                  <th className="text-center p-4 text-sm font-semibold text-text-secondary uppercase tracking-wider">
                    Impressions
                  </th>
                  <th className="text-center p-4 text-sm font-semibold text-text-secondary uppercase tracking-wider">
                    Conversions
                  </th>
                  <th className="text-center p-4 text-sm font-semibold text-text-secondary uppercase tracking-wider">
                    Conv. Rate
                  </th>
                  <th className="text-center p-4 text-sm font-semibold text-text-secondary uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="text-center p-4 text-sm font-semibold text-text-secondary uppercase tracking-wider">
                    AOV
                  </th>
                  <th className="text-center p-4 text-sm font-semibold text-text-secondary uppercase tracking-wider">
                    Rev/Impression
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.variants.map((variant, idx) => {
                  const isWinner = variant.variant === stats.winner;
                  return (
                    <tr
                      key={variant.variant}
                      className={`border-b border-border-light/30 ${
                        isWinner ? 'bg-green-900/10' : ''
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {isWinner && <span className="text-xl">🏆</span>}
                          <span className="font-medium text-text-primary">
                            {getVariantDisplayName(variant.variant)}
                          </span>
                        </div>
                      </td>
                      <td className="text-center p-4 text-text-secondary">
                        {variant.impressions.toLocaleString()}
                      </td>
                      <td className="text-center p-4 text-text-secondary">
                        {variant.conversions.toLocaleString()}
                      </td>
                      <td className="text-center p-4">
                        <span className="font-semibold text-text-primary">
                          {variant.conversionRate.toFixed(2)}%
                        </span>
                      </td>
                      <td className="text-center p-4 text-accent-gold font-semibold">
                        ${variant.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="text-center p-4 text-text-secondary">
                        ${variant.averageOrderValue.toFixed(2)}
                      </td>
                      <td className="text-center p-4">
                        <span className="font-semibold text-green-400">
                          ${variant.revenuePerImpression.toFixed(4)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.variants.map((variant) => (
            <PricingVariantCard key={variant.variant} variant={variant} />
          ))}
        </div>

        {/* Insights */}
        <div className="mt-8 bg-bg-secondary/30 border border-border-light rounded-xl p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">📈 Key Insights</h2>
          <div className="space-y-3 text-text-secondary">
            <InsightItem
              text={`${stats.totalImpressions} users have been assigned to pricing variants`}
            />
            <InsightItem
              text={`${stats.totalConversions} total conversions generating $${stats.totalRevenue.toFixed(2)}`}
            />
            {stats.winner && (
              <InsightItem
                text={`${getVariantDisplayName(stats.winner)} is the current leader with ${stats.confidence}% confidence`}
                highlight
              />
            )}
            {stats.confidence < 95 && stats.totalImpressions > 0 && (
              <InsightItem
                text="⚠️ More data needed for 95% statistical confidence"
                warning
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-bg-secondary/30 border border-border-light rounded-xl p-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{icon}</span>
        <span className="text-sm text-text-secondary uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="text-2xl font-bold text-text-primary">{value}</div>
    </div>
  );
}

function PricingVariantCard({ variant }: { variant: VariantStats }) {
  const variantPricing: Record<PricingVariant, { single: string; bundle: string }> = {
    control: { single: '$9-$49', bundle: '$79' },
    variant_a: { single: '$39', bundle: '$129' },
    variant_b: { single: '$49', bundle: '$129' },
    variant_c: { single: '$59', bundle: '$129' },
    variant_d: { single: '$39-$59 tiered', bundle: '$129' },
  };

  const pricing = variantPricing[variant.variant];

  return (
    <div className="bg-bg-secondary/30 border border-border-light rounded-xl p-6">
      <h3 className="font-bold text-text-primary mb-2">
        {getVariantDisplayName(variant.variant)}
      </h3>
      <div className="mb-4 text-sm text-text-secondary">
        <div>Single: {pricing.single}</div>
        <div>Bundle: {pricing.bundle}</div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-text-secondary">Impressions:</span>
          <span className="font-semibold text-text-primary">{variant.impressions}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Conversions:</span>
          <span className="font-semibold text-text-primary">{variant.conversions}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Conv. Rate:</span>
          <span className="font-semibold text-green-400">{variant.conversionRate.toFixed(2)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Revenue:</span>
          <span className="font-semibold text-accent-gold">${variant.revenue.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

function InsightItem({
  text,
  highlight = false,
  warning = false,
}: {
  text: string;
  highlight?: boolean;
  warning?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-2 ${
        highlight ? 'text-green-400' : warning ? 'text-yellow-400' : ''
      }`}
    >
      <span className="mt-1">•</span>
      <span>{text}</span>
    </div>
  );
}
