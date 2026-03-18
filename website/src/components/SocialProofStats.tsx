"use client";

import { useEffect, useState } from "react";

interface Stats {
  totalCustomers: number;
  totalPortraits: number;
  averageRating: number;
  totalReviews: number;
}

export default function SocialProofStats() {
  const [stats, setStats] = useState<Stats>({
    totalCustomers: 200,
    totalPortraits: 350,
    averageRating: 4.9,
    totalReviews: 120,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats/social-proof");
      const data = await res.json();
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-8 flex-wrap animate-slide-up" style={{ animationDelay: "500ms" }}>
      <div className="text-center">
        <div className="text-2xl font-semibold text-text-primary">
          {loading ? "—" : `${stats.totalCustomers}+`}
        </div>
        <div className="text-xs text-text-secondary mt-1">Happy Customers</div>
      </div>
      <div className="w-[1px] h-8 bg-white/[0.08]" />
      <div className="text-center">
        <div className="text-2xl font-semibold text-text-primary">
          {loading ? "—" : `${stats.totalPortraits}+`}
        </div>
        <div className="text-xs text-text-secondary mt-1">Portraits Created</div>
      </div>
      <div className="w-[1px] h-8 bg-white/[0.08]" />
      <div className="text-center">
        <div className="text-2xl font-semibold text-text-primary flex items-center gap-1.5">
          {loading ? "—" : stats.averageRating.toFixed(1)}
          <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <div className="text-xs text-text-secondary mt-1">
          {loading ? "—" : `${stats.totalReviews} Reviews`}
        </div>
      </div>
    </div>
  );
}
