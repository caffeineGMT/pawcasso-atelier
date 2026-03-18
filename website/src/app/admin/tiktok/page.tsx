'use client';

import { useEffect, useState } from 'react';

interface ScheduledPost {
  id: string;
  caption: string;
  scheduledFor: string;
  status: 'pending' | 'published' | 'failed';
  tiktokVideoId?: string;
  tiktokShareUrl?: string;
  errorMessage?: string;
}

interface VideoPerformance {
  postId: string;
  videoId: string;
  postedAt: string;
  caption: string;
  breed: string;
  style: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  linkClicks: number;
  websiteVisits: number;
  orders: number;
  revenue: number;
  conversionRate?: number;
  lastUpdated: string;
}

interface PerformanceSummary {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  avgEngagementRate: number;
  totalLinkClicks: number;
  totalWebsiteVisits: number;
  totalOrders: number;
  totalRevenue: number;
  avgConversionRate: number;
  topPerformingPost: VideoPerformance | null;
  lastUpdated: string;
}

export default function TikTokDashboard() {
  const [queue, setQueue] = useState<ScheduledPost[]>([]);
  const [analytics, setAnalytics] = useState<VideoPerformance[]>([]);
  const [summary, setSummary] = useState<PerformanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const response = await fetch('/api/admin/tiktok/stats');
      const data = await response.json();

      setQueue(data.queue || []);
      setAnalytics(data.analytics || []);
      setSummary(data.summary);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load data:', error);
      setLoading(false);
    }
  }

  async function refreshAnalytics() {
    setRefreshing(true);
    try {
      const response = await fetch('/api/admin/tiktok/refresh', { method: 'POST' });
      const data = await response.json();
      setAnalytics(data.analytics || []);
      setSummary(data.summary);
    } catch (error) {
      console.error('Failed to refresh analytics:', error);
    }
    setRefreshing(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const pendingPosts = queue.filter(p => p.status === 'pending');
  const publishedPosts = queue.filter(p => p.status === 'published');
  const failedPosts = queue.filter(p => p.status === 'failed');

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#C9A96E]">TikTok Campaign Dashboard</h1>
          <button
            onClick={refreshAnalytics}
            disabled={refreshing}
            className="px-4 py-2 bg-[#C9A96E] text-black rounded-lg hover:bg-[#B8985D] disabled:opacity-50"
          >
            {refreshing ? 'Refreshing...' : 'Refresh Analytics'}
          </button>
        </div>

        {/* Performance Summary */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#111] p-6 rounded-lg border border-[#222]">
              <p className="text-gray-400 text-sm mb-2">Total Views</p>
              <p className="text-3xl font-bold">{summary.totalViews.toLocaleString()}</p>
            </div>
            <div className="bg-[#111] p-6 rounded-lg border border-[#222]">
              <p className="text-gray-400 text-sm mb-2">Engagement Rate</p>
              <p className="text-3xl font-bold">{summary.avgEngagementRate.toFixed(2)}%</p>
            </div>
            <div className="bg-[#111] p-6 rounded-lg border border-[#222]">
              <p className="text-gray-400 text-sm mb-2">Link Clicks</p>
              <p className="text-3xl font-bold">{summary.totalLinkClicks.toLocaleString()}</p>
            </div>
            <div className="bg-[#111] p-6 rounded-lg border border-[#222]">
              <p className="text-gray-400 text-sm mb-2">Revenue</p>
              <p className="text-3xl font-bold">${summary.totalRevenue.toFixed(2)}</p>
            </div>

            <div className="bg-[#111] p-6 rounded-lg border border-[#222]">
              <p className="text-gray-400 text-sm mb-2">Total Posts</p>
              <p className="text-3xl font-bold">{summary.totalPosts}</p>
            </div>
            <div className="bg-[#111] p-6 rounded-lg border border-[#222]">
              <p className="text-gray-400 text-sm mb-2">Website Visits</p>
              <p className="text-3xl font-bold">{summary.totalWebsiteVisits.toLocaleString()}</p>
            </div>
            <div className="bg-[#111] p-6 rounded-lg border border-[#222]">
              <p className="text-gray-400 text-sm mb-2">Orders</p>
              <p className="text-3xl font-bold">{summary.totalOrders}</p>
            </div>
            <div className="bg-[#111] p-6 rounded-lg border border-[#222]">
              <p className="text-gray-400 text-sm mb-2">Conversion Rate</p>
              <p className="text-3xl font-bold">{summary.avgConversionRate.toFixed(2)}%</p>
            </div>
          </div>
        )}

        {/* Queue Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#111] p-6 rounded-lg border border-[#222]">
            <p className="text-gray-400 text-sm mb-2">Pending</p>
            <p className="text-3xl font-bold text-yellow-500">{pendingPosts.length}</p>
          </div>
          <div className="bg-[#111] p-6 rounded-lg border border-[#222]">
            <p className="text-gray-400 text-sm mb-2">Published</p>
            <p className="text-3xl font-bold text-green-500">{publishedPosts.length}</p>
          </div>
          <div className="bg-[#111] p-6 rounded-lg border border-[#222]">
            <p className="text-gray-400 text-sm mb-2">Failed</p>
            <p className="text-3xl font-bold text-red-500">{failedPosts.length}</p>
          </div>
        </div>

        {/* Top Performing Videos */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Top Performing Videos</h2>
          <div className="bg-[#111] rounded-lg border border-[#222] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#0a0a0a] border-b border-[#222]">
                <tr>
                  <th className="text-left p-4 text-gray-400 font-medium">Breed/Style</th>
                  <th className="text-right p-4 text-gray-400 font-medium">Views</th>
                  <th className="text-right p-4 text-gray-400 font-medium">Engagement</th>
                  <th className="text-right p-4 text-gray-400 font-medium">Clicks</th>
                  <th className="text-right p-4 text-gray-400 font-medium">Orders</th>
                  <th className="text-right p-4 text-gray-400 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analytics.slice(0, 10).map((video) => (
                  <tr key={video.postId} className="border-b border-[#222] hover:bg-[#0a0a0a]">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{video.breed}</p>
                        <p className="text-sm text-gray-400">{video.style}</p>
                      </div>
                    </td>
                    <td className="text-right p-4">{video.views.toLocaleString()}</td>
                    <td className="text-right p-4">{video.engagementRate.toFixed(2)}%</td>
                    <td className="text-right p-4">{video.linkClicks}</td>
                    <td className="text-right p-4">{video.orders}</td>
                    <td className="text-right p-4">${video.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Posts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Upcoming Posts ({pendingPosts.length})</h2>
          <div className="bg-[#111] rounded-lg border border-[#222] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#0a0a0a] border-b border-[#222]">
                <tr>
                  <th className="text-left p-4 text-gray-400 font-medium">Post ID</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Scheduled For</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Caption</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingPosts.slice(0, 15).map((post) => (
                  <tr key={post.id} className="border-b border-[#222] hover:bg-[#0a0a0a]">
                    <td className="p-4 font-mono text-sm">{post.id}</td>
                    <td className="p-4">
                      {new Date(post.scheduledFor).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-4 max-w-xs truncate text-gray-400">
                      {post.caption.substring(0, 80)}...
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-sm bg-yellow-500/10 text-yellow-500">
                        {post.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Failed Posts */}
        {failedPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Failed Posts ({failedPosts.length})</h2>
            <div className="bg-[#111] rounded-lg border border-red-500/20 overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#0a0a0a] border-b border-[#222]">
                  <tr>
                    <th className="text-left p-4 text-gray-400 font-medium">Post ID</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Scheduled For</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {failedPosts.map((post) => (
                    <tr key={post.id} className="border-b border-[#222] hover:bg-[#0a0a0a]">
                      <td className="p-4 font-mono text-sm">{post.id}</td>
                      <td className="p-4">
                        {new Date(post.scheduledFor).toLocaleString()}
                      </td>
                      <td className="p-4 text-red-500">{post.errorMessage || 'Unknown error'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
