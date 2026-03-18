"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ReferralStats } from "@/lib/referral";
import { SocialShareButtons } from "./SocialShareButtons";

export function ReferralDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<ReferralStats>({
    clicks: 0,
    conversions: 0,
    earnings: 0,
    referralCode: "",
    creditBalance: 0,
    totalReferrals: 0,
    milestones: [],
  });
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState("");

  useEffect(() => {
    // Fetch initial stats
    fetchStats();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [session]);

  useEffect(() => {
    // Generate referral link when stats are loaded
    if (stats.referralCode) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
      setReferralLink(`${baseUrl}/order?ref=${stats.referralCode}`);
    }
  }, [stats.referralCode]);

  async function fetchStats() {
    try {
      const response = await fetch("/api/referral/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch referral stats:", error);
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }

  // Calculate progress to next milestone
  const getNextMilestone = () => {
    if (stats.totalReferrals < 5) {
      return { count: 5, reward: "Premium portrait", progress: (stats.totalReferrals / 5) * 100 };
    } else if (stats.totalReferrals < 10) {
      return { count: 10, reward: "Deluxe portrait", progress: (stats.totalReferrals / 10) * 100 };
    } else if (stats.totalReferrals < 25) {
      return { count: 25, reward: "Bundle package", progress: (stats.totalReferrals / 25) * 100 };
    }
    return null;
  };

  const nextMilestone = getNextMilestone();

  return (
    <div className="space-y-8">
      {/* Hero Card with Referral Link */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-semibold text-text-primary mb-2">
              Share the Love, Earn Rewards
            </h3>
            <p className="text-text-secondary text-sm max-w-md">
              Give your friends 20% off their first portrait. You get $5 credit for every purchase!
            </p>
          </div>
          {stats.creditBalance > 0 && (
            <div className="bg-success/10 border border-success/20 rounded-lg px-4 py-2">
              <div className="text-xs text-text-secondary">Available Credit</div>
              <div className="text-2xl font-bold text-success">${stats.creditBalance.toFixed(2)}</div>
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={referralLink}
            readOnly
            onClick={copyToClipboard}
            className="flex-1 bg-background/50 border border-white/[0.08] rounded-lg px-4 py-3 text-text-primary font-mono text-sm cursor-pointer hover:border-primary/40 transition-colors"
          />
          <button
            onClick={copyToClipboard}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              copied
                ? "bg-success text-white"
                : "bg-primary text-white hover:bg-primary-dark"
            }`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Social Share Buttons */}
        <div className="mb-6">
          <p className="text-xs text-text-secondary uppercase tracking-wider mb-3">Share Your Link</p>
          <SocialShareButtons
            referralLink={referralLink}
            referralCode={stats.referralCode}
          />
        </div>

        {/* Referral Code Display */}
        <div className="bg-background/30 border border-white/[0.08] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary">Your Referral Code</p>
              <p className="text-lg font-bold text-primary font-mono">{stats.referralCode}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-secondary">Friends can use this at checkout</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gamification - Milestone Progress */}
      {nextMilestone && (
        <div className="rounded-2xl bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 p-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-text-primary">
              🎯 Next Milestone: {nextMilestone.count} Referrals
            </h4>
            <span className="text-sm text-gold font-semibold">
              {stats.totalReferrals}/{nextMilestone.count}
            </span>
          </div>
          <div className="mb-3">
            <div className="w-full bg-background/50 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-gold h-full transition-all duration-500"
                style={{ width: `${Math.min(nextMilestone.progress, 100)}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-text-secondary">
            Unlock a free <span className="text-gold font-semibold">{nextMilestone.reward}</span> when you refer{" "}
            {nextMilestone.count - stats.totalReferrals} more friend{nextMilestone.count - stats.totalReferrals !== 1 ? "s" : ""}!
          </p>
        </div>
      )}

      {/* Achieved Milestones */}
      {stats.milestones.length > 0 && (
        <div className="rounded-xl bg-bg-card p-6 border border-white/[0.08]">
          <h4 className="text-lg font-semibold text-text-primary mb-4">🏆 Achievements Unlocked</h4>
          <div className="space-y-3">
            {stats.milestones.map((milestone, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-success/5 border border-success/10 rounded-lg"
              >
                <div>
                  <p className="text-text-primary font-medium">{milestone.reward}</p>
                  <p className="text-xs text-text-secondary mt-1">
                    Achieved {new Date(milestone.achievedAt).toLocaleDateString()}
                  </p>
                </div>
                {!milestone.claimed && (
                  <span className="px-3 py-1 bg-gold text-black text-xs font-semibold rounded-full">
                    Available
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl bg-bg-card p-6 text-center border border-white/[0.08]">
          <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            {stats.clicks}
          </div>
          <div className="text-sm text-text-secondary mt-2">Total Clicks</div>
        </div>

        <div className="rounded-xl bg-bg-card p-6 text-center border border-white/[0.08]">
          <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            {stats.conversions}
          </div>
          <div className="text-sm text-text-secondary mt-2">Conversions</div>
        </div>

        <div className="rounded-xl bg-bg-card p-6 text-center border border-white/[0.08]">
          <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            ${stats.earnings.toFixed(2)}
          </div>
          <div className="text-sm text-text-secondary mt-2">Total Earnings</div>
        </div>
      </div>

      {/* How It Works */}
      <div className="rounded-xl bg-bg-card p-6 border border-white/[0.08]">
        <h4 className="text-lg font-semibold text-text-primary mb-4">How It Works</h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm">
              1
            </div>
            <div>
              <p className="text-text-primary font-medium">Share your unique link</p>
              <p className="text-sm text-text-secondary">Send it to friends via social media, email, or text</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm">
              2
            </div>
            <div>
              <p className="text-text-primary font-medium">They get 20% off</p>
              <p className="text-sm text-text-secondary">Your friends save on their first AI pet portrait</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm">
              3
            </div>
            <div>
              <p className="text-text-primary font-medium">You earn $5 credit</p>
              <p className="text-sm text-text-secondary">Use it on your next portrait or save up for free ones</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-semibold text-sm">
              ★
            </div>
            <div>
              <p className="text-text-primary font-medium">Unlock milestone rewards</p>
              <p className="text-sm text-text-secondary">Refer 5, 10, or 25 friends to unlock free premium portraits</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
