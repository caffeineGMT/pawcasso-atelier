"use client";

import { useState } from "react";
import { Referral } from "@prisma/client";

interface ReferralSectionProps {
  referralCode: string;
  totalReferrals: number;
  referrals: Referral[];
}

export default function ReferralSection({
  referralCode,
  totalReferrals,
  referrals,
}: ReferralSectionProps) {
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const referralUrl = `${baseUrl}/order?ref=${referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const totalEarnings = referrals.reduce((sum, r) => sum + r.referrerCredit, 0);

  return (
    <div className="bg-gradient-to-br from-[#E07A5F] to-[#F4A261] rounded-xl p-6 mb-8 text-white">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Refer Friends, Earn Credits
          </h2>
          <p className="text-white/90 text-sm">
            Give your friends 20% off and earn $5 credit for each purchase
          </p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 text-center">
          <div className="text-3xl font-bold">{totalReferrals}</div>
          <div className="text-xs text-white/90">Referrals</div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
        <label className="block text-xs font-medium text-white/90 mb-2">
          Your Referral Link
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralUrl}
            readOnly
            className="flex-1 bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm text-white placeholder-white/60 focus:outline-none focus:border-white/50"
          />
          <button
            onClick={handleCopy}
            className="bg-white text-[#E07A5F] px-6 py-2 rounded-lg font-semibold hover:bg-white/90 transition-colors flex items-center gap-2"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="text-sm text-white/90 mb-1">Total Earned</div>
          <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="text-sm text-white/90 mb-1">Conversion Rate</div>
          <div className="text-2xl font-bold">
            {referrals.length > 0
              ? Math.round((totalReferrals / referrals.length) * 100)
              : 0}%
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <h3 className="font-semibold mb-3 text-sm">How it works:</h3>
        <ol className="space-y-2 text-sm text-white/90">
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">
              1
            </span>
            <span>Share your referral link with friends</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">
              2
            </span>
            <span>They get 20% off their first portrait</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">
              3
            </span>
            <span>You earn $5 credit when they purchase</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
