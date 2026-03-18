"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ReferralStats } from "@/lib/stripe";

export function ReferralDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<ReferralStats>({ clicks: 0, conversions: 0, earnings: 0 });
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState("");

  useEffect(() => {
    // Generate referral link based on customer ID
    if (session?.user?.email) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
      const referralCode = btoa(session.user.email).replace(/=/g, "");
      setReferralLink(`${baseUrl}?ref=${referralCode}`);
    }

    // Fetch initial stats
    fetchStats();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [session]);

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

  return (
    <div className="space-y-8">
      {/* Hero Card with Referral Link */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-8">
        <h3 className="text-xl font-semibold text-text-primary mb-2">Your Referral Link</h3>
        <p className="text-text-secondary mb-6 text-sm">
          Share this link and earn 10% commission on every sale
        </p>

        <div className="flex gap-2">
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
      </div>

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

      {/* Payout Banner */}
      {stats.earnings >= 25 && (
        <div className="bg-success/10 border border-success/20 rounded-xl p-4 text-sm text-text-primary">
          <strong>Payout Available:</strong> You&apos;ve earned ${stats.earnings.toFixed(2)}! Payouts are sent monthly via Stripe.
        </div>
      )}
    </div>
  );
}
