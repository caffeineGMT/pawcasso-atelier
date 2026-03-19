'use client';

import { useState, useEffect } from 'react';

interface FunnelData {
  funnelCounts: {
    landing: number;
    gallery: number;
    order_page: number;
    photo_upload: number;
    tier_selection: number;
    checkout_initiate: number;
    purchase: number;
  };
  conversionRates: {
    landing_to_gallery: number;
    gallery_to_order: number;
    order_to_upload: number;
    upload_to_tier: number;
    tier_to_checkout: number;
    checkout_to_purchase: number;
  };
  dropOffRates: {
    landing_to_gallery: number;
    gallery_to_order: number;
    order_to_upload: number;
    upload_to_tier: number;
    tier_to_checkout: number;
    checkout_to_purchase: number;
  };
  overallConversion: number;
  totalSessions: number;
  totalPurchases: number;
}

interface ABTestResults {
  testId: string;
  variantStats: Record<
    string,
    {
      assignments: number;
      conversions: number;
      revenue: number;
      conversionRate: number;
      revenuePerUser: number;
    }
  >;
  winner: string;
  statisticalSignificance: {
    pValue: number | null;
    isSignificant: boolean;
    sampleSize: {
      control: number;
      variant_a: number;
    };
  };
}

export default function CRODashboard() {
  const [funnelData, setFunnelData] = useState<FunnelData | null>(null);
  const [abTestResults, setAbTestResults] = useState<ABTestResults[]>([]);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Calculate date range
      const now = new Date();
      const daysAgo = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
      const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      // Fetch funnel data
      const funnelRes = await fetch(
        `/api/analytics/funnel?startDate=${startDate.toISOString()}&endDate=${now.toISOString()}`
      );
      const funnelJson = await funnelRes.json();
      if (funnelJson.success) {
        setFunnelData(funnelJson.data);
      }

      // Fetch A/B test results for active tests
      const tests = ['pricing_test', 'cta_button_test'];
      const abResults = [];
      for (const testId of tests) {
        const abRes = await fetch(
          `/api/analytics/ab-test?testId=${testId}&startDate=${startDate.toISOString()}&endDate=${now.toISOString()}`
        );
        const abJson = await abRes.json();
        if (abJson.success) {
          abResults.push(abJson.data);
        }
      }
      setAbTestResults(abResults);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CRO Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Conversion Rate Optimization - Funnel Analytics & A/B Testing
            </p>
          </div>

          {/* Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as '7d' | '30d' | '90d')}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>

        {/* Key Metrics */}
        {funnelData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Overall Conversion"
                value={`${funnelData.overallConversion.toFixed(2)}%`}
                subtitle={`${funnelData.totalPurchases} / ${funnelData.totalSessions} sessions`}
                trend={funnelData.overallConversion >= 2 ? 'up' : 'down'}
                target="Target: 4%"
              />
              <MetricCard
                title="Total Sessions"
                value={funnelData.totalSessions.toLocaleString()}
                subtitle="Unique visitors"
              />
              <MetricCard
                title="Total Purchases"
                value={funnelData.totalPurchases.toLocaleString()}
                subtitle="Completed checkouts"
              />
              <MetricCard
                title="Biggest Drop-Off"
                value={`${Math.max(...Object.values(funnelData.dropOffRates)).toFixed(1)}%`}
                subtitle={
                  Object.entries(funnelData.dropOffRates).reduce((max, curr) =>
                    curr[1] > max[1] ? curr : max
                  )[0]
                }
                trend="down"
              />
            </div>

            {/* Funnel Visualization */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Conversion Funnel</h2>
              <FunnelChart funnelData={funnelData} />
            </div>
          </>
        )}

        {/* A/B Test Results */}
        {abTestResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">A/B Test Results</h2>
            <div className="space-y-6">
              {abTestResults.map((test) => (
                <ABTestCard key={test.testId} test={test} />
              ))}
            </div>
          </div>
        )}

        {/* Heatmap Integration */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Microsoft Clarity</h2>
          <p className="text-gray-600 mb-4">
            View heatmaps, session recordings, and user behavior analytics:
          </p>
          <a
            href="https://clarity.microsoft.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Open Microsoft Clarity Dashboard
          </a>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Quick Tips:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Use heatmaps to see where users click and scroll</li>
              <li>• Watch session recordings to identify UX friction points</li>
              <li>• Filter by funnel step using custom tags</li>
              <li>• Look for rage clicks and dead clicks on CTAs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({
  title,
  value,
  subtitle,
  trend,
  target,
}: {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down';
  target?: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <div className="flex items-baseline">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {trend && (
          <span
            className={`ml-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend === 'up' ? '↑' : '↓'}
          </span>
        )}
      </div>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      {target && (
        <p className="text-xs text-blue-600 font-medium mt-2">{target}</p>
      )}
    </div>
  );
}

// Funnel Chart Component
function FunnelChart({ funnelData }: { funnelData: FunnelData }) {
  const steps = [
    { name: 'Landing', count: funnelData.funnelCounts.landing, rate: 100 },
    {
      name: 'Gallery',
      count: funnelData.funnelCounts.gallery,
      rate: funnelData.conversionRates.landing_to_gallery,
    },
    {
      name: 'Order Page',
      count: funnelData.funnelCounts.order_page,
      rate: funnelData.conversionRates.gallery_to_order,
    },
    {
      name: 'Photo Upload',
      count: funnelData.funnelCounts.photo_upload,
      rate: funnelData.conversionRates.order_to_upload,
    },
    {
      name: 'Tier Selection',
      count: funnelData.funnelCounts.tier_selection,
      rate: funnelData.conversionRates.upload_to_tier,
    },
    {
      name: 'Checkout',
      count: funnelData.funnelCounts.checkout_initiate,
      rate: funnelData.conversionRates.tier_to_checkout,
    },
    {
      name: 'Purchase',
      count: funnelData.funnelCounts.purchase,
      rate: funnelData.conversionRates.checkout_to_purchase,
    },
  ];

  const maxCount = steps[0].count;

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const width = (step.count / maxCount) * 100;
        const dropOff = index > 0 ? 100 - step.rate : 0;

        return (
          <div key={step.name}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {index + 1}. {step.name}
              </span>
              <span className="text-sm text-gray-600">
                {step.count.toLocaleString()} users
              </span>
            </div>
            <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center"
                style={{ width: `${width}%` }}
              >
                {width > 20 && (
                  <span className="text-white text-sm font-semibold">
                    {step.rate.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
            {dropOff > 0 && (
              <p className="text-xs text-red-600 mt-1">
                Drop-off: {dropOff.toFixed(1)}% ({steps[index - 1].count - step.count} users)
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// A/B Test Card Component
function ABTestCard({ test }: { test: ABTestResults }) {
  const testNames: Record<string, string> = {
    pricing_test: 'Pricing Tiers Test',
    cta_button_test: 'CTA Button Copy Test',
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {testNames[test.testId] || test.testId}
          </h3>
          {test.statisticalSignificance.isSignificant && (
            <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
              Statistically Significant
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Winner</p>
          <p className="text-lg font-bold text-blue-600">
            {test.winner === 'control' ? 'Control' : 'Variant A'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(test.variantStats)
          .filter(([variant]) => variant === 'control' || variant === 'variant_a')
          .map(([variant, stats]) => (
            <div key={variant} className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-600 mb-3">
                {variant === 'control' ? 'Control' : 'Variant A'}
              </h4>
              <div className="space-y-2">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.conversionRate.toFixed(2)}%
                  </p>
                  <p className="text-xs text-gray-500">Conversion Rate</p>
                </div>
                <div className="text-sm text-gray-700">
                  <p>
                    {stats.conversions} / {stats.assignments} conversions
                  </p>
                  <p>${stats.revenuePerUser.toFixed(2)} revenue/user</p>
                  <p>${stats.revenue.toLocaleString()} total revenue</p>
                </div>
              </div>
            </div>
          ))}
      </div>

      {test.statisticalSignificance.pValue !== null && (
        <div className="mt-4 text-sm text-gray-600">
          <p>
            p-value: {test.statisticalSignificance.pValue.toFixed(4)} (
            {test.statisticalSignificance.isSignificant ? 'p < 0.05' : 'p ≥ 0.05'})
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Sample sizes: Control ({test.statisticalSignificance.sampleSize.control}), Variant A (
            {test.statisticalSignificance.sampleSize.variant_a})
          </p>
        </div>
      )}
    </div>
  );
}
