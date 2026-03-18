'use client';

import Link from 'next/link';

export default function AdminDashboard() {
  const adminTools = [
    {
      name: 'Revenue Analytics',
      description: 'MRR, orders, AOV, refund rate, LTV by channel',
      href: '/admin/analytics',
      icon: '📊',
      color: 'from-[#C9A96E] to-[#B89960]',
    },
    {
      name: 'Customer Reviews',
      description: 'Approve and manage customer testimonials',
      href: '/admin/reviews',
      icon: '⭐',
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'Influencer Tracking',
      description: 'Track influencer campaigns and conversions',
      href: '/admin/influencers',
      icon: '📱',
      color: 'from-purple-500 to-purple-600',
    },
    {
      name: 'A/B Experiments',
      description: 'Manage A/B tests and feature flags',
      href: '/admin/experiments',
      icon: '🧪',
      color: 'from-green-500 to-green-600',
    },
    {
      name: 'Quality Review',
      description: 'Review and approve generated portraits',
      href: '/admin/review',
      icon: '🎨',
      color: 'from-pink-500 to-pink-600',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-[#F5F5F7] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-[#C9A96E] mb-4">Admin Dashboard</h1>
          <p className="text-xl text-[#86868b]">Pawcasso Atelier — Management Console</p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminTools.map((tool, index) => (
            <Link
              key={index}
              href={tool.href}
              className="group bg-[#111] border border-[#1d1d1f] rounded-2xl p-8 hover:border-[#C9A96E] transition-all hover:scale-105"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`text-5xl bg-gradient-to-br ${tool.color} bg-clip-text text-transparent`}>
                  {tool.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2 group-hover:text-[#C9A96E] transition">
                    {tool.name}
                  </h2>
                  <p className="text-[#86868b] leading-relaxed">{tool.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#C9A96E] font-semibold mt-4">
                Open
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-[#111] border border-[#1d1d1f] rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-[#C9A96E] mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#1d1d1f] p-4 rounded-lg hover:bg-[#2d2d2f] transition"
            >
              <span className="text-2xl">💳</span>
              <span className="font-semibold">Stripe Dashboard</span>
            </a>
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#1d1d1f] p-4 rounded-lg hover:bg-[#2d2d2f] transition"
            >
              <span className="text-2xl">▲</span>
              <span className="font-semibold">Vercel Console</span>
            </a>
            <Link
              href="/"
              className="flex items-center gap-3 bg-[#1d1d1f] p-4 rounded-lg hover:bg-[#2d2d2f] transition"
            >
              <span className="text-2xl">🏠</span>
              <span className="font-semibold">View Live Site</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
