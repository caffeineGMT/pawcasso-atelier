"use client";

import { useState, useTransition } from "react";
import { Referral } from "@prisma/client";

interface ReferralSectionProps {
  referralCode: string;
  totalReferrals: number;
  referrals: Referral[];
  creditBalance: number;
}

export default function ReferralSection({
  referralCode,
  totalReferrals,
  referrals,
  creditBalance,
}: ReferralSectionProps) {
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const referralUrl = `${baseUrl}/refer/${referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = referralUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const totalEarnings = referrals.reduce((sum, r) => sum + r.referrerCredit, 0);

  const shareMessage = `I just got an amazing AI portrait of my pet from Pawcasso Atelier! Use my link for 20% off your first portrait:`;
  const encodedMessage = encodeURIComponent(`${shareMessage} ${referralUrl}`);
  const encodedUrl = encodeURIComponent(referralUrl);

  // Milestone progress
  const nextMilestone = totalReferrals < 5 ? 5 : totalReferrals < 10 ? 10 : totalReferrals < 25 ? 25 : null;
  const milestoneReward = nextMilestone === 5
    ? "Free Premium Portrait ($29)"
    : nextMilestone === 10
    ? "Free Deluxe Portrait ($49)"
    : nextMilestone === 25
    ? "Free Bundle Package ($79)"
    : null;
  const milestoneProgress = nextMilestone ? (totalReferrals / nextMilestone) * 100 : 100;

  return (
    <div className="mb-8">
      {/* Main Referral Card */}
      <div className="bg-gradient-to-br from-[#E07A5F] to-[#F4A261] rounded-xl p-6 lg:p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
          <div>
            <h2 className="text-2xl lg:text-3xl font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Give $5, Get $5
            </h2>
            <p className="text-white/90 text-sm lg:text-base max-w-md">
              Share your unique link with friends. They get 20% off their first portrait, and you earn $5 credit for every purchase.
            </p>
          </div>

          {/* Earnings Summary */}
          <div className="flex gap-3 flex-shrink-0">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 text-center min-w-[80px]">
              <div className="text-2xl lg:text-3xl font-bold">{totalReferrals}</div>
              <div className="text-xs text-white/90">Friends Referred</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 text-center min-w-[80px]">
              <div className="text-2xl lg:text-3xl font-bold">${totalEarnings.toFixed(0)}</div>
              <div className="text-xs text-white/90">Total Earned</div>
            </div>
          </div>
        </div>

        {/* Personalized Message */}
        {totalReferrals > 0 && (
          <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 mb-4 border border-white/20">
            <p className="text-sm lg:text-base font-medium">
              You&apos;ve referred {totalReferrals} friend{totalReferrals !== 1 ? "s" : ""} and earned ${totalEarnings.toFixed(2)} in credits!
              {creditBalance > 0 && (
                <span className="block mt-1 text-white/90">
                  You have <strong>${creditBalance.toFixed(2)}</strong> in credits ready to use on your next order.
                </span>
              )}
            </p>
          </div>
        )}

        {/* Referral Link */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-5">
          <label className="block text-xs font-medium text-white/90 mb-2">
            Your Referral Link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={referralUrl}
              readOnly
              className="flex-1 bg-white/20 border border-white/30 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/60 focus:outline-none focus:border-white/50"
            />
            <button
              onClick={handleCopy}
              className="bg-white text-[#E07A5F] px-6 py-2.5 rounded-lg font-semibold hover:bg-white/90 transition-colors flex items-center gap-2 whitespace-nowrap"
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

        {/* Social Sharing Buttons */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-white/90 mb-3">
            Share with friends
          </label>
          <div className="flex flex-wrap gap-2">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/?text=${encodedMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodeURIComponent(shareMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </a>

            {/* Instagram Story (deep link) */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(referralUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                // Open Instagram - users can paste the link into their story
                window.open("https://www.instagram.com/create/story/", "_blank");
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-opacity"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              Instagram Story
            </button>

            {/* Email */}
            <a
              href={`mailto:?subject=${encodeURIComponent("Get 20% off an amazing AI pet portrait!")}&body=${encodedMessage}`}
              className="flex items-center gap-2 bg-[#4A4A4A] hover:bg-[#333] text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </a>

            {/* SMS/iMessage */}
            <a
              href={`sms:?&body=${encodedMessage}`}
              className="flex items-center gap-2 bg-[#34C759] hover:bg-[#2DB84D] text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Text
            </a>
          </div>
        </div>

        {/* Milestone Progress */}
        {nextMilestone && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Next Milestone: {nextMilestone} referrals</span>
              <span className="text-xs text-white/80">{totalReferrals}/{nextMilestone}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2.5 mb-2">
              <div
                className="bg-white rounded-full h-2.5 transition-all duration-500"
                style={{ width: `${Math.min(milestoneProgress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-white/80">
              {nextMilestone - totalReferrals} more referral{nextMilestone - totalReferrals !== 1 ? "s" : ""} to unlock: <strong>{milestoneReward}</strong>
            </p>
          </div>
        )}

        {/* How it works */}
        <div className="pt-5 border-t border-white/20">
          <h3 className="font-semibold mb-3 text-sm">How it works:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">
                1
              </span>
              <div>
                <span className="text-sm font-medium block">Share your link</span>
                <span className="text-xs text-white/80">Send to friends who love pets</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">
                2
              </span>
              <div>
                <span className="text-sm font-medium block">They get 20% off</span>
                <span className="text-xs text-white/80">On their first portrait order</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">
                3
              </span>
              <div>
                <span className="text-sm font-medium block">You earn $5</span>
                <span className="text-xs text-white/80">Credit for your next order</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Referrals */}
      {referrals.length > 0 && (
        <div className="mt-4 bg-white rounded-xl border border-[#E5E5E5] p-6">
          <h3 className="text-lg font-semibold text-[#2B2D42] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Recent Referrals
          </h3>
          <div className="space-y-3">
            {referrals.slice(0, 5).map((referral) => (
              <div key={referral.id} className="flex items-center justify-between py-2 border-b border-[#F0F0F0] last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#06D6A0]/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#06D6A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm text-[#2B2D42] font-medium">
                      {referral.referredEmail.replace(/(.{2})(.*)(@.*)/, "$1***$3")}
                    </span>
                    <span className="text-xs text-[#4A4A4A] block">
                      {referral.convertedAt
                        ? new Date(referral.convertedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Pending"}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-[#06D6A0]">
                  +${referral.referrerCredit.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
