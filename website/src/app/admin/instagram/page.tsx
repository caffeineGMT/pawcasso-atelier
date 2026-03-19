'use client';

import { useEffect, useState } from 'react';

interface OverviewStats {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalSaves: number;
  totalReach: number;
  avgEngagementRate: number;
}

interface TypePerformance {
  contentType: string;
  count: number;
  avgLikes: number;
  avgComments: number;
  avgSaves: number;
  avgEngagementRate: number;
  totalReach: number;
}

interface TopPost {
  id: string;
  contentId: string;
  title: string;
  contentType: string;
  animal: string;
  breed?: string;
  likes: number;
  comments: number;
  saves: number;
  engagementRate: number;
  postedAt: string;
  instagramPostUrl?: string;
}

interface Insight {
  type: string;
  title: string;
  description: string;
  recommendation: string;
  confidence: number;
}

interface Recommendation {
  type: string;
  message: string;
  action: string;
}

interface AnalyticsData {
  overview: OverviewStats;
  performanceByType: TypePerformance[];
  topPosts: TopPost[];
  insights: Insight[];
  recommendations: Recommendation[];
}

export default function InstagramAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/instagram')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-stone-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-32 bg-stone-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-stone-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-medium">{error || 'Failed to load data'}</p>
          </div>
        </div>
      </div>
    );
  }

  const { overview, performanceByType, topPosts, insights, recommendations } = data;

  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">
            Instagram Analytics Dashboard
          </h1>
          <p className="text-stone-600">
            Track content performance and optimize your Instagram strategy
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard label="Total Posts" value={overview.totalPosts} />
          <StatCard label="Total Likes" value={overview.totalLikes.toLocaleString()} />
          <StatCard label="Total Comments" value={overview.totalComments.toLocaleString()} />
          <StatCard label="Total Saves" value={overview.totalSaves.toLocaleString()} />
          <StatCard label="Total Reach" value={overview.totalReach.toLocaleString()} />
          <StatCard
            label="Avg Engagement"
            value={`${overview.avgEngagementRate}%`}
            highlight
          />
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-bold text-emerald-900 mb-4">
              📊 Key Recommendations
            </h2>
            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold text-lg">•</span>
                  <div>
                    <p className="text-emerald-900 font-medium">{rec.message}</p>
                    <p className="text-emerald-700 text-sm mt-1">→ {rec.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance by Content Type */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-stone-900 mb-6">
            Performance by Content Type
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200 text-left text-sm text-stone-600">
                  <th className="pb-3 font-medium">Content Type</th>
                  <th className="pb-3 font-medium text-right">Posts</th>
                  <th className="pb-3 font-medium text-right">Avg Likes</th>
                  <th className="pb-3 font-medium text-right">Avg Comments</th>
                  <th className="pb-3 font-medium text-right">Avg Saves</th>
                  <th className="pb-3 font-medium text-right">Engagement %</th>
                  <th className="pb-3 font-medium text-right">Total Reach</th>
                </tr>
              </thead>
              <tbody>
                {performanceByType
                  .sort((a, b) => b.avgEngagementRate - a.avgEngagementRate)
                  .map(type => (
                    <tr key={type.contentType} className="border-b border-stone-100">
                      <td className="py-4">
                        <span className="inline-flex items-center gap-2 font-medium text-stone-900">
                          {getContentTypeIcon(type.contentType)}
                          {formatContentType(type.contentType)}
                        </span>
                      </td>
                      <td className="py-4 text-right text-stone-700">{type.count}</td>
                      <td className="py-4 text-right text-stone-700">{type.avgLikes}</td>
                      <td className="py-4 text-right text-stone-700">{type.avgComments}</td>
                      <td className="py-4 text-right text-stone-700">{type.avgSaves}</td>
                      <td className="py-4 text-right">
                        <span className={`font-medium ${type.avgEngagementRate >= overview.avgEngagementRate ? 'text-emerald-600' : 'text-stone-700'}`}>
                          {type.avgEngagementRate}%
                        </span>
                      </td>
                      <td className="py-4 text-right text-stone-700">
                        {type.totalReach.toLocaleString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performing Posts */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
          <h2 className="text-xl font-bold text-stone-900 mb-6">
            Top Performing Posts
          </h2>
          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <div
                key={post.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-stone-100 hover:border-stone-300 transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
                  #{index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-stone-900 truncate">{post.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-stone-600 mt-1">
                    <span>{formatContentType(post.contentType)}</span>
                    <span>•</span>
                    <span>{post.animal} {post.breed && `(${post.breed})`}</span>
                    <span>•</span>
                    <span>{new Date(post.postedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-stone-900">❤️ {post.likes}</div>
                    <div className="text-stone-500 text-xs">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-stone-900">💬 {post.comments}</div>
                    <div className="text-stone-500 text-xs">Comments</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-stone-900">🔖 {post.saves}</div>
                    <div className="text-stone-500 text-xs">Saves</div>
                  </div>
                  <div className="text-center min-w-[80px]">
                    <div className="font-bold text-emerald-600 text-lg">
                      {post.engagementRate}%
                    </div>
                    <div className="text-stone-500 text-xs">Engagement</div>
                  </div>
                </div>
                {post.instagramPostUrl && (
                  <a
                    href={post.instagramPostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-md text-sm font-medium text-stone-700 transition-colors"
                  >
                    View Post →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className={`rounded-lg p-5 ${highlight ? 'bg-emerald-50 border-2 border-emerald-200' : 'bg-white border border-stone-200'}`}>
      <div className="text-sm text-stone-600 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${highlight ? 'text-emerald-700' : 'text-stone-900'}`}>
        {value}
      </div>
    </div>
  );
}

function formatContentType(type: string): string {
  const map: Record<string, string> = {
    portrait: 'Portrait',
    emoji_set: 'Emoji Set',
    zodiac: 'Zodiac',
    reel: 'Reel',
  };
  return map[type] || type;
}

function getContentTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    portrait: '🖼️',
    emoji_set: '😊',
    zodiac: '♈',
    reel: '🎬',
  };
  return icons[type] || '📸';
}
