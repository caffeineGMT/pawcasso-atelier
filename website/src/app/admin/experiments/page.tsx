"use client";

import { useState, useEffect } from "react";

interface VariantMetrics {
  variant: string;
  impressions: number;
  accepts: number;
  declines: number;
  conversionRate: number;
  revenue: number;
  revenuePerImpression: number;
}

interface ExperimentData {
  name: string;
  variants: VariantMetrics[];
  totalImpressions: number;
  totalRevenue: number;
  winner?: string;
}

// Mock analytics data - in production, fetch from Vercel Analytics API
function generateMockData(): ExperimentData {
  const variants: VariantMetrics[] = [
    {
      variant: 'control',
      impressions: 250,
      accepts: 38,
      declines: 212,
      conversionRate: 15.2,
      revenue: 1482,
      revenuePerImpression: 5.93,
    },
    {
      variant: 'fast',
      impressions: 245,
      accepts: 52,
      declines: 193,
      conversionRate: 21.2,
      revenue: 2028,
      revenuePerImpression: 8.28,
    },
    {
      variant: 'delayed',
      impressions: 238,
      accepts: 31,
      declines: 207,
      conversionRate: 13.0,
      revenue: 1209,
      revenuePerImpression: 5.08,
    },
    {
      variant: 'exit-intent',
      impressions: 267,
      accepts: 44,
      declines: 223,
      conversionRate: 16.5,
      revenue: 1716,
      revenuePerImpression: 6.43,
    },
  ];

  return {
    name: 'upsell-modal-timing',
    variants,
    totalImpressions: variants.reduce((sum, v) => sum + v.impressions, 0),
    totalRevenue: variants.reduce((sum, v) => sum + v.revenue, 0),
  };
}

export default function ExperimentsPage() {
  const [data, setData] = useState<ExperimentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);

  useEffect(() => {
    // In production, fetch from Vercel Analytics API:
    // const response = await fetch('/api/analytics/experiments');
    // const data = await response.json();

    // For now, use mock data
    setTimeout(() => {
      setData(generateMockData());
      setLoading(false);
    }, 500);
  }, []);

  const handlePromoteWinner = async (variant: string) => {
    if (!confirm(`Promote "${variant}" to 100% traffic? This will update Edge Config.`)) {
      return;
    }

    setSelectedWinner(variant);

    // In production, update Edge Config:
    // await fetch('/api/edge-config/update', {
    //   method: 'POST',
    //   body: JSON.stringify({ experiment: 'upsell-modal-timing', winner: variant }),
    // });

    alert(`"${variant}" promoted to 100% traffic! (Mock - implement Edge Config update in production)`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-64 mb-8"></div>
            <div className="h-64 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const bestVariant = [...data.variants].sort(
    (a, b) => b.revenuePerImpression - a.revenuePerImpression
  )[0];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold">
              A/B Test: <span className="text-[#C9A96E]">Upsell Modal Timing</span>
            </h1>
            <a
              href="/admin"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              ← Back to Admin
            </a>
          </div>
          <p className="text-gray-400">
            Testing different timing strategies for the upsell modal to maximize conversion rate
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="text-sm text-gray-400 mb-2">Total Impressions</div>
            <div className="text-3xl font-bold">{data.totalImpressions.toLocaleString()}</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="text-sm text-gray-400 mb-2">Total Revenue</div>
            <div className="text-3xl font-bold text-green-400">
              ${data.totalRevenue.toLocaleString()}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="text-sm text-gray-400 mb-2">Avg. Conv. Rate</div>
            <div className="text-3xl font-bold">
              {(
                data.variants.reduce((sum, v) => sum + v.conversionRate, 0) / data.variants.length
              ).toFixed(1)}%
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="text-sm text-gray-400 mb-2">Best Variant</div>
            <div className="text-3xl font-bold text-[#C9A96E]">{bestVariant.variant}</div>
            <div className="text-sm text-gray-400 mt-1">
              ${bestVariant.revenuePerImpression.toFixed(2)}/impression
            </div>
          </div>
        </div>

        {/* Variant Comparison */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold">Variant Performance</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-4 font-semibold">Variant</th>
                  <th className="text-left p-4 font-semibold">Config</th>
                  <th className="text-right p-4 font-semibold">Impressions</th>
                  <th className="text-right p-4 font-semibold">Accepts</th>
                  <th className="text-right p-4 font-semibold">Declines</th>
                  <th className="text-right p-4 font-semibold">Conv. Rate</th>
                  <th className="text-right p-4 font-semibold">Revenue</th>
                  <th className="text-right p-4 font-semibold">$/Impression</th>
                  <th className="text-right p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.variants
                  .sort((a, b) => b.revenuePerImpression - a.revenuePerImpression)
                  .map((variant, index) => {
                    const isWinner = variant.variant === bestVariant.variant;
                    return (
                      <tr
                        key={variant.variant}
                        className={`border-t border-white/10 hover:bg-white/5 transition-colors ${
                          isWinner ? 'bg-[#C9A96E]/10' : ''
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold">{variant.variant}</div>
                            {isWinner && (
                              <div className="px-2 py-1 bg-[#C9A96E] text-black text-xs font-semibold rounded">
                                WINNER
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-gray-400">
                          {variant.variant === 'control' && '2000ms'}
                          {variant.variant === 'fast' && '500ms'}
                          {variant.variant === 'delayed' && '5000ms'}
                          {variant.variant === 'exit-intent' && 'mouseleave'}
                        </td>
                        <td className="p-4 text-right">{variant.impressions.toLocaleString()}</td>
                        <td className="p-4 text-right text-green-400">{variant.accepts}</td>
                        <td className="p-4 text-right text-red-400">{variant.declines}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div
                              className="w-24 h-2 bg-white/10 rounded-full overflow-hidden"
                              title={`${variant.conversionRate}%`}
                            >
                              <div
                                className="h-full bg-[#C9A96E]"
                                style={{ width: `${variant.conversionRate}%` }}
                              />
                            </div>
                            <span className="w-12 text-right">{variant.conversionRate.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-right font-semibold">
                          ${variant.revenue.toLocaleString()}
                        </td>
                        <td className="p-4 text-right font-bold text-[#C9A96E]">
                          ${variant.revenuePerImpression.toFixed(2)}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handlePromoteWinner(variant.variant)}
                            className="px-3 py-1 bg-[#C9A96E] text-black text-sm font-semibold rounded hover:bg-[#a07830] transition-colors"
                            disabled={selectedWinner === variant.variant}
                          >
                            {selectedWinner === variant.variant ? 'Active' : 'Promote'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Key Insights</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-[#C9A96E] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                The <strong className="text-white">{bestVariant.variant}</strong> variant performs{' '}
                {(((bestVariant.revenuePerImpression - data.variants.find(v => v.variant === 'control')!.revenuePerImpression) / data.variants.find(v => v.variant === 'control')!.revenuePerImpression) * 100).toFixed(0)}%
                better than control in revenue per impression
              </span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-[#C9A96E] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>
                Fastest modal (500ms) shows {data.variants.find(v => v.variant === 'fast')!.conversionRate.toFixed(1)}% conversion
                vs {data.variants.find(v => v.variant === 'delayed')!.conversionRate.toFixed(1)}% for delayed (5s)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-[#C9A96E] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span>
                Projected annual impact of promoting {bestVariant.variant}:
                <strong className="text-green-400 ml-1">
                  +${(((bestVariant.revenuePerImpression - data.variants.find(v => v.variant === 'control')!.revenuePerImpression) * data.totalImpressions * 12).toLocaleString())}
                </strong> vs control
              </span>
            </li>
          </ul>
        </div>

        {/* Integration Instructions */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 text-blue-400">Production Setup</h3>
          <div className="space-y-4 text-sm text-gray-300">
            <div>
              <strong className="text-white">1. Vercel Edge Config:</strong>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Go to Vercel Dashboard → Edge Config → Create Config</li>
                <li>Add experiment JSON with variant weights and optional winner</li>
                <li>Update <code className="bg-white/10 px-2 py-0.5 rounded">EDGE_CONFIG</code> environment variable</li>
              </ul>
            </div>
            <div>
              <strong className="text-white">2. Vercel Analytics API:</strong>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Install: <code className="bg-white/10 px-2 py-0.5 rounded">npm install @vercel/analytics/server</code></li>
                <li>Create API route to fetch events: <code className="bg-white/10 px-2 py-0.5 rounded">/api/analytics/experiments</code></li>
                <li>Query events: upsell_shown, upsell_accepted, upsell_declined</li>
              </ul>
            </div>
            <div>
              <strong className="text-white">3. Promote Winner:</strong>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Update Edge Config JSON to set <code className="bg-white/10 px-2 py-0.5 rounded">winner</code> field</li>
                <li>All users will receive the winning variant</li>
                <li>Remove experiment code after validation period</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
