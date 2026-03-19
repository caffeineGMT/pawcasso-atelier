'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface MarketingSpendRecord {
  id: string;
  channel: string;
  amount: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  date: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface MarketingSpendData {
  spendData: MarketingSpendRecord[];
  summary: {
    channel: string;
    totalSpend: number;
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
    totalRevenue: number;
    records: number;
    avgCPC: number;
    ctr: number;
    conversionRate: number;
    roas: number;
  }[];
  total: {
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
}

const CHANNELS = [
  'google_ads',
  'instagram',
  'pinterest',
  'reddit',
  'tiktok',
  'facebook',
  'email',
  'influencer',
  'organic',
];

export default function MarketingSpendPage() {
  const [data, setData] = useState<MarketingSpendData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
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
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/marketing-spend?days=30');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch marketing spend:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/admin/marketing-spend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: formData.channel,
          amount: parseFloat(formData.amount),
          impressions: parseInt(formData.impressions) || 0,
          clicks: parseInt(formData.clicks) || 0,
          conversions: parseInt(formData.conversions) || 0,
          revenue: parseFloat(formData.revenue) || 0,
          date: formData.date,
          notes: formData.notes || null,
        }),
      });

      if (response.ok) {
        // Reset form
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
        setShowForm(false);
        await fetchData();
      } else {
        alert('Failed to save marketing spend record');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save marketing spend record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      const response = await fetch(`/api/admin/marketing-spend?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchData();
      } else {
        alert('Failed to delete record');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete record');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#C9A96E] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#F5F5F7] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/admin/analytics" className="text-[#86868b] hover:text-[#C9A96E] text-sm mb-2 inline-block">
              ← Back to Analytics
            </Link>
            <h1 className="text-4xl font-bold text-[#C9A96E]">Marketing Spend Tracking</h1>
            <p className="text-[#86868b] mt-2">Track ad spend to calculate Customer Acquisition Cost (CAC)</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#C9A96E] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#B89960] transition"
          >
            {showForm ? 'Cancel' : '+ Add Spend Record'}
          </button>
        </div>

        {/* Add Record Form */}
        {showForm && (
          <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#C9A96E] mb-6">Add Marketing Spend Record</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Channel *</label>
                <select
                  value={formData.channel}
                  onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                  className="w-full bg-[#1d1d1f] border border-[#2d2d2f] rounded-lg px-4 py-3 text-[#F5F5F7] focus:outline-none focus:border-[#C9A96E]"
                  required
                >
                  {CHANNELS.map((channel) => (
                    <option key={channel} value={channel}>
                      {channel.replace(/_/g, ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-[#1d1d1f] border border-[#2d2d2f] rounded-lg px-4 py-3 text-[#F5F5F7] focus:outline-none focus:border-[#C9A96E]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Amount Spent ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-[#1d1d1f] border border-[#2d2d2f] rounded-lg px-4 py-3 text-[#F5F5F7] focus:outline-none focus:border-[#C9A96E]"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Impressions</label>
                <input
                  type="number"
                  value={formData.impressions}
                  onChange={(e) => setFormData({ ...formData, impressions: e.target.value })}
                  className="w-full bg-[#1d1d1f] border border-[#2d2d2f] rounded-lg px-4 py-3 text-[#F5F5F7] focus:outline-none focus:border-[#C9A96E]"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Clicks</label>
                <input
                  type="number"
                  value={formData.clicks}
                  onChange={(e) => setFormData({ ...formData, clicks: e.target.value })}
                  className="w-full bg-[#1d1d1f] border border-[#2d2d2f] rounded-lg px-4 py-3 text-[#F5F5F7] focus:outline-none focus:border-[#C9A96E]"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Conversions</label>
                <input
                  type="number"
                  value={formData.conversions}
                  onChange={(e) => setFormData({ ...formData, conversions: e.target.value })}
                  className="w-full bg-[#1d1d1f] border border-[#2d2d2f] rounded-lg px-4 py-3 text-[#F5F5F7] focus:outline-none focus:border-[#C9A96E]"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Revenue from Channel ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.revenue}
                  onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                  className="w-full bg-[#1d1d1f] border border-[#2d2d2f] rounded-lg px-4 py-3 text-[#F5F5F7] focus:outline-none focus:border-[#C9A96E]"
                  placeholder="0.00"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#1d1d1f] border border-[#2d2d2f] rounded-lg px-4 py-3 text-[#F5F5F7] focus:outline-none focus:border-[#C9A96E]"
                  rows={3}
                  placeholder="Campaign details, notes, etc."
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#C9A96E] text-black px-8 py-3 rounded-lg font-semibold hover:bg-[#B89960] transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Summary Cards */}
        {data && data.total && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6">
              <div className="text-[#86868b] text-sm font-medium mb-2">Total Spend (30d)</div>
              <div className="text-3xl font-bold text-[#C9A96E]">${data.total.spend.toFixed(2)}</div>
            </div>
            <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6">
              <div className="text-[#86868b] text-sm font-medium mb-2">Impressions</div>
              <div className="text-3xl font-bold">{data.total.impressions.toLocaleString()}</div>
            </div>
            <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6">
              <div className="text-[#86868b] text-sm font-medium mb-2">Clicks</div>
              <div className="text-3xl font-bold">{data.total.clicks.toLocaleString()}</div>
            </div>
            <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6">
              <div className="text-[#86868b] text-sm font-medium mb-2">Conversions</div>
              <div className="text-3xl font-bold">{data.total.conversions}</div>
            </div>
            <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6">
              <div className="text-[#86868b] text-sm font-medium mb-2">Revenue</div>
              <div className="text-3xl font-bold text-green-400">${data.total.revenue.toFixed(2)}</div>
            </div>
          </div>
        )}

        {/* Channel Summary */}
        {data && data.summary && data.summary.length > 0 && (
          <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#C9A96E] mb-6">Channel Performance Summary</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-[#86868b] border-b border-[#1d1d1f]">
                    <th className="pb-4 font-semibold">Channel</th>
                    <th className="pb-4 font-semibold text-right">Spend</th>
                    <th className="pb-4 font-semibold text-right">Clicks</th>
                    <th className="pb-4 font-semibold text-right">CPC</th>
                    <th className="pb-4 font-semibold text-right">CTR</th>
                    <th className="pb-4 font-semibold text-right">Conversions</th>
                    <th className="pb-4 font-semibold text-right">Conv. Rate</th>
                    <th className="pb-4 font-semibold text-right">Revenue</th>
                    <th className="pb-4 font-semibold text-right">ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  {data.summary.map((channel, index) => (
                    <tr key={index} className="border-b border-[#1d1d1f] last:border-0">
                      <td className="py-4 font-medium capitalize">{channel.channel.replace(/_/g, ' ')}</td>
                      <td className="py-4 text-right">${channel.totalSpend.toFixed(2)}</td>
                      <td className="py-4 text-right">{channel.totalClicks.toLocaleString()}</td>
                      <td className="py-4 text-right">${channel.avgCPC.toFixed(2)}</td>
                      <td className="py-4 text-right">{channel.ctr.toFixed(2)}%</td>
                      <td className="py-4 text-right">{channel.totalConversions}</td>
                      <td className="py-4 text-right">{channel.conversionRate.toFixed(2)}%</td>
                      <td className="py-4 text-right text-green-400">${channel.totalRevenue.toFixed(2)}</td>
                      <td className="py-4 text-right">
                        <span className={channel.roas >= 3 ? 'text-green-400 font-bold' : channel.roas >= 2 ? 'text-yellow-400' : 'text-red-400'}>
                          {channel.roas.toFixed(2)}x
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Records */}
        {data && data.spendData && data.spendData.length > 0 && (
          <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-[#C9A96E] mb-6">Recent Records (Last 30 Days)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#86868b] border-b border-[#1d1d1f]">
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Channel</th>
                    <th className="pb-3 font-semibold text-right">Spend</th>
                    <th className="pb-3 font-semibold text-right">Impressions</th>
                    <th className="pb-3 font-semibold text-right">Clicks</th>
                    <th className="pb-3 font-semibold text-right">Conversions</th>
                    <th className="pb-3 font-semibold text-right">Revenue</th>
                    <th className="pb-3 font-semibold">Notes</th>
                    <th className="pb-3 font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.spendData.map((record) => (
                    <tr key={record.id} className="border-b border-[#1d1d1f]/50 hover:bg-[#1d1d1f]/50">
                      <td className="py-3">
                        {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-3 capitalize">{record.channel.replace(/_/g, ' ')}</td>
                      <td className="py-3 text-right">${record.amount.toFixed(2)}</td>
                      <td className="py-3 text-right">{record.impressions.toLocaleString()}</td>
                      <td className="py-3 text-right">{record.clicks.toLocaleString()}</td>
                      <td className="py-3 text-right">{record.conversions}</td>
                      <td className="py-3 text-right text-green-400">${record.revenue.toFixed(2)}</td>
                      <td className="py-3 text-[#86868b] max-w-xs truncate">{record.notes || '-'}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="text-red-400 hover:text-red-300 text-xs font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {data && data.spendData && data.spendData.length === 0 && (
          <div className="bg-[#111] border border-[#1d1d1f] rounded-2xl p-12 text-center">
            <div className="text-[#86868b] mb-4">No marketing spend records yet</div>
            <p className="text-sm text-[#86868b] mb-6">
              Start tracking your marketing spend to calculate CAC and optimize your ad budget
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#C9A96E] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#B89960] transition"
            >
              Add Your First Record
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
