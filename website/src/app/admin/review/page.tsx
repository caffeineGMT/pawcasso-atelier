"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface QualityScore {
  id: number;
  portrait_id: string;
  portrait_url: string;
  original_photo_url: string;
  order_id: string;
  score: number;
  status: string;
  auto_approved: boolean;
  created_at: string;
}

export default function AdminReviewPage() {
  const [portraits, setPortraits] = useState<QualityScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchPortraits();
  }, []);

  const fetchPortraits = async () => {
    try {
      const response = await fetch("/api/quality-check/pending");
      if (response.ok) {
        const data = await response.json();
        setPortraits(data.portraits || []);
      }
    } catch (error) {
      console.error("Error fetching portraits:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      const response = await fetch("/api/quality-check/approve", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          portrait_id: id,
          customer_email: "customer@example.com", // TODO: Get from order
        }),
      });

      if (response.ok) {
        // Remove from list with animation
        setPortraits((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Error approving portrait:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRegenerate = async (portrait: QualityScore) => {
    if (!confirm("Are you sure you want to regenerate this portrait?")) {
      return;
    }

    setActionLoading(portrait.id);
    try {
      const response = await fetch("/api/quality-check/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: portrait.order_id,
          portrait_id: portrait.id,
        }),
      });

      if (response.ok) {
        setPortraits((prev) => prev.filter((p) => p.id !== portrait.id));
      }
    } catch (error) {
      console.error("Error regenerating portrait:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefund = async (portrait: QualityScore) => {
    const reason = prompt("Refund reason:");
    if (!reason) return;

    if (!confirm(`Issue refund for order ${portrait.order_id}?`)) {
      return;
    }

    setActionLoading(portrait.id);
    try {
      const response = await fetch("/api/quality-check/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: portrait.order_id,
          portrait_id: portrait.id,
          reason,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Refund successful: ${data.refund_id}`);
        setPortraits((prev) => prev.filter((p) => p.id !== portrait.id));
      } else {
        const error = await response.json();
        alert(`Refund failed: ${error.error}`);
      }
    } catch (error) {
      console.error("Error processing refund:", error);
      alert("Error processing refund");
    } finally {
      setActionLoading(null);
    }
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 7) return "bg-green-500/20 text-green-500 border-green-500/40";
    if (score >= 5) return "bg-yellow-500/20 text-yellow-500 border-yellow-500/40";
    return "bg-red-500/20 text-red-500 border-red-500/40";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-text-primary text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="border-b border-white/[0.08] bg-bg-card">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-semibold text-text-primary">
            Quality Review Dashboard
          </h1>
          <p className="text-text-secondary mt-2">
            {portraits.length} portrait{portraits.length !== 1 ? "s" : ""} pending review
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {portraits.length === 0 ? (
          // Empty State
          <div className="text-center py-20">
            <svg
              className="w-24 h-24 mx-auto text-text-secondary opacity-50 mb-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-text-primary mb-2">
              All caught up!
            </h2>
            <p className="text-text-secondary">No pending reviews at the moment.</p>
          </div>
        ) : (
          // Review Grid
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {portraits.map((portrait) => (
              <div
                key={portrait.id}
                className="rounded-2xl bg-bg-card border border-white/[0.08] p-6 hover:border-white/[0.12] transition-all"
              >
                {/* Score Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div className="text-xs text-text-secondary">
                    Order: {portrait.order_id.slice(0, 12)}...
                  </div>
                  <div
                    className={`rounded-full px-3 py-1 text-xs font-bold border ${getScoreBadgeColor(
                      portrait.score
                    )} ${portrait.score < 7 ? "animate-pulse" : ""}`}
                  >
                    Score: {portrait.score.toFixed(1)}
                  </div>
                </div>

                {/* Image Comparison */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-xs text-text-secondary mb-2 uppercase tracking-wide">
                      Original
                    </div>
                    <div className="relative aspect-square rounded-lg border border-white/[0.08] overflow-hidden">
                      <Image
                        src={portrait.original_photo_url}
                        alt="Original"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-text-secondary mb-2 uppercase tracking-wide">
                      Generated
                    </div>
                    <div className="relative aspect-square rounded-lg border border-white/[0.08] overflow-hidden">
                      <Image
                        src={portrait.portrait_url}
                        alt="Generated"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(portrait.id)}
                    disabled={actionLoading === portrait.id}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading === portrait.id ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Approve"
                    )}
                  </button>
                  <button
                    onClick={() => handleRegenerate(portrait)}
                    disabled={actionLoading === portrait.id}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Regenerate
                  </button>
                  <button
                    onClick={() => handleRefund(portrait)}
                    disabled={actionLoading === portrait.id}
                    className="flex-1 bg-red-600/20 border border-red-600/40 text-red-500 hover:bg-red-600/30 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Refund
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
