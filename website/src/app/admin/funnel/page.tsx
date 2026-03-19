'use client';

import { useState, useEffect, useCallback } from 'react';

interface FunnelData {
  funnelCounts: Record<string, number>;
  conversionRates: Record<string, number>;
  dropOffRates: Record<string, number>;
  overallConversion: number;
  deviceComparison: {
    mobile: { counts: Record<string, number>; conversionRates: Record<string, number> };
    tablet: { counts: Record<string, number>; conversionRates: Record<string, number> };
    desktop: { counts: Record<string, number>; conversionRates: Record<string, number> };
  };
  mobileDropoffHotspots: Array<{ step: string; mobile: number; desktop: number; gap: number }>;
  dropoffSignals: Record<string, { count: number; unique_sessions: number }>;
  dateRange: { start: string; end: string };
}

const STEP_LABELS: Record<string, string> = {
  view_product: 'View Product',
  photo_upload: 'Photo Upload',
  style_selection: 'Style Selection',
  tier_selection: 'Tier Selection',
  checkout_form: 'Checkout Form',
  payment_redirect: 'Payment Redirect',
  purchase_complete: 'Purchase Complete',
};

const CONVERSION_LABELS: Record<string, string> = {
  view_to_upload: 'View → Upload',
  upload_to_style: 'Upload → Style',
  style_to_tier: 'Style → Tier',
  tier_to_form: 'Tier → Form',
  form_to_payment: 'Form → Payment',
  payment_to_purchase: 'Payment → Purchase',
  overall: 'Overall',
};

const SIGNAL_LABELS: Record<string, string> = {
  rage_tap: 'Rage Taps',
  orientation_change: 'Orientation Changes',
  viewport_resize: 'Viewport Resizes (Keyboard)',
  form_error: 'Form Errors',
  back_button: 'Back Button Presses',
  scroll_abandon: 'Scroll Abandons',
};

export default function FunnelDashboard() {
  const [data, setData] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const days = dateRange === '1d' ? 1 : dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 7;
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      const res = await fetch(`/api/analytics/funnel?startDate=${startDate}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.error || 'Failed to load data');
      }
    } catch (err) {
      setError('Failed to fetch funnel data');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Checkout Funnel Analysis</h1>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-white/5 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-950 p-8">
        <div className="max-w-7xl mx-auto text-center py-20">
          <p className="text-red-400 text-lg">{error || 'No data available'}</p>
          <button onClick={fetchData} className="mt-4 px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { deviceComparison, mobileDropoffHotspots, dropoffSignals } = data;

  return (
    <div className="min-h-screen bg-gray-950 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Mobile Checkout Funnel</h1>
            <p className="text-gray-400 mt-1">
              Device-segmented conversion analysis &bull; {data.dateRange.start.split('T')[0]} to {data.dateRange.end.split('T')[0]}
            </p>
          </div>
          <div className="flex gap-2">
            {['1d', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  dateRange === range
                    ? 'bg-gold text-black'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {range === '1d' ? 'Today' : range === '7d' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Overall Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Overall Conversion', value: `${data.overallConversion.toFixed(1)}%`, color: 'text-green-400' },
            { label: 'Mobile Conv.', value: `${(deviceComparison.mobile.conversionRates.overall || 0).toFixed(1)}%`, color: 'text-blue-400' },
            { label: 'Desktop Conv.', value: `${(deviceComparison.desktop.conversionRates.overall || 0).toFixed(1)}%`, color: 'text-purple-400' },
            {
              label: 'Mobile Gap',
              value: `${Math.abs((deviceComparison.desktop.conversionRates.overall || 0) - (deviceComparison.mobile.conversionRates.overall || 0)).toFixed(1)}pp`,
              color: (deviceComparison.desktop.conversionRates.overall || 0) > (deviceComparison.mobile.conversionRates.overall || 0) ? 'text-red-400' : 'text-green-400',
            },
          ].map((metric) => (
            <div key={metric.label} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">{metric.label}</p>
              <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Funnel Comparison: Mobile vs Desktop */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-6">Step-by-Step Conversion: Mobile vs Desktop</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Step</th>
                  <th className="text-right py-3 px-4 text-blue-400 font-medium">Mobile</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Tablet</th>
                  <th className="text-right py-3 px-4 text-purple-400 font-medium">Desktop</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Gap</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(CONVERSION_LABELS).map(([key, label]) => {
                  const mobile = deviceComparison.mobile.conversionRates[key] || 0;
                  const tablet = deviceComparison.tablet.conversionRates[key] || 0;
                  const desktop = deviceComparison.desktop.conversionRates[key] || 0;
                  const gap = desktop - mobile;
                  return (
                    <tr key={key} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="py-3 px-4 text-white font-medium">{label}</td>
                      <td className="py-3 px-4 text-right font-mono text-blue-400">{mobile.toFixed(1)}%</td>
                      <td className="py-3 px-4 text-right font-mono text-gray-400">{tablet.toFixed(1)}%</td>
                      <td className="py-3 px-4 text-right font-mono text-purple-400">{desktop.toFixed(1)}%</td>
                      <td className={`py-3 px-4 text-right font-mono font-bold ${gap > 5 ? 'text-red-400' : gap > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {gap > 0 ? `-${gap.toFixed(1)}pp` : `+${Math.abs(gap).toFixed(1)}pp`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Mobile Drop-off Hotspots */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Mobile Drop-off Hotspots</h2>
            <p className="text-xs text-gray-500 mb-4">Steps where mobile users convert significantly less than desktop</p>
            {mobileDropoffHotspots.length === 0 ? (
              <p className="text-gray-500 text-sm">No significant drop-off gaps detected</p>
            ) : (
              <div className="space-y-4">
                {mobileDropoffHotspots.map((hotspot, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <span className="text-red-400 text-sm font-bold">{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">
                        {CONVERSION_LABELS[hotspot.step] || hotspot.step}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-blue-400">Mobile: {hotspot.mobile.toFixed(1)}%</span>
                        <span className="text-xs text-purple-400">Desktop: {hotspot.desktop.toFixed(1)}%</span>
                        <span className="text-xs text-red-400 font-bold">-{hotspot.gap.toFixed(1)}pp</span>
                      </div>
                    </div>
                    {/* Visual bar */}
                    <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full"
                        style={{ width: `${Math.min(100, hotspot.gap * 2)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drop-off Signals */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">UX Friction Signals</h2>
            <p className="text-xs text-gray-500 mb-4">Behavioral indicators of user frustration during checkout</p>
            {Object.keys(dropoffSignals).length === 0 ? (
              <p className="text-gray-500 text-sm">No friction signals recorded yet</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(dropoffSignals)
                  .sort(([, a], [, b]) => b.count - a.count)
                  .map(([type, signal]) => (
                    <div key={type} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">
                          {type === 'rage_tap' ? '😤' : type === 'form_error' ? '❌' : type === 'back_button' ? '⬅️' : type === 'orientation_change' ? '🔄' : '📱'}
                        </span>
                        <div>
                          <p className="text-white text-sm font-medium">{SIGNAL_LABELS[type] || type}</p>
                          <p className="text-xs text-gray-500">{signal.unique_sessions} unique sessions</p>
                        </div>
                      </div>
                      <span className="text-white font-mono font-bold text-lg">{signal.count}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Step Volume by Device */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-6">Step Volume by Device</h2>
          <div className="space-y-4">
            {Object.entries(STEP_LABELS).map(([step, label]) => {
              const mobile = deviceComparison.mobile.counts[step] || 0;
              const tablet = deviceComparison.tablet.counts[step] || 0;
              const desktop = deviceComparison.desktop.counts[step] || 0;
              const total = mobile + tablet + desktop;
              if (total === 0) return null;

              const mobilePercent = total > 0 ? (mobile / total) * 100 : 0;
              const tabletPercent = total > 0 ? (tablet / total) * 100 : 0;
              const desktopPercent = total > 0 ? (desktop / total) * 100 : 0;

              return (
                <div key={step}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white font-medium">{label}</span>
                    <span className="text-xs text-gray-500 font-mono">{total} total</span>
                  </div>
                  <div className="flex h-6 rounded-full overflow-hidden bg-white/5">
                    {mobile > 0 && (
                      <div
                        className="bg-blue-500 flex items-center justify-center"
                        style={{ width: `${mobilePercent}%` }}
                      >
                        {mobilePercent > 15 && <span className="text-[10px] text-white font-bold">{mobile}</span>}
                      </div>
                    )}
                    {tablet > 0 && (
                      <div
                        className="bg-gray-500 flex items-center justify-center"
                        style={{ width: `${tabletPercent}%` }}
                      >
                        {tabletPercent > 15 && <span className="text-[10px] text-white font-bold">{tablet}</span>}
                      </div>
                    )}
                    {desktop > 0 && (
                      <div
                        className="bg-purple-500 flex items-center justify-center"
                        style={{ width: `${desktopPercent}%` }}
                      >
                        {desktopPercent > 15 && <span className="text-[10px] text-white font-bold">{desktop}</span>}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-6 mt-4 pt-4 border-t border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs text-gray-400">Mobile</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <span className="text-xs text-gray-400">Tablet</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-xs text-gray-400">Desktop</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
