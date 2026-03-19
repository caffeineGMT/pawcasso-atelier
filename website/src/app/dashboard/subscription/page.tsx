"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SubscriptionDetails {
  id: string;
  status: string;
  plan: string;
  amount: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  portraitsPerMonth: number;
  portraitsUsedThisPeriod: number;
  portraitsRemainingThisPeriod: number;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
}

export default function SubscriptionDashboard() {
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // In a real app, you'd get the email from session/auth
  // For now, we'll have a simple email input
  const [emailInput, setEmailInput] = useState("");
  const [showEmailPrompt, setShowEmailPrompt] = useState(true);

  const loadSubscription = async (customerEmail: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/subscription/status?email=${encodeURIComponent(customerEmail)}`
      );
      const data = await response.json();

      if (data.hasSubscription) {
        setSubscription(data.subscription);
        setEmail(customerEmail);
        setShowEmailPrompt(false);
      } else {
        setError("No active subscription found for this email");
      }
    } catch (err) {
      console.error("Error loading subscription:", err);
      setError("Failed to load subscription");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You'll retain access until the end of your current billing period.")) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch("/api/subscription/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action: "cancel" }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        loadSubscription(email); // Reload subscription
      } else {
        alert(data.error || "Failed to cancel subscription");
      }
    } catch (err) {
      console.error("Error canceling subscription:", err);
      alert("Failed to cancel subscription");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      setActionLoading(true);
      const response = await fetch("/api/subscription/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action: "reactivate" }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        loadSubscription(email); // Reload subscription
      } else {
        alert(data.error || "Failed to reactivate subscription");
      }
    } catch (err) {
      console.error("Error reactivating subscription:", err);
      alert("Failed to reactivate subscription");
    } finally {
      setActionLoading(false);
    }
  };

  if (showEmailPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Subscription Dashboard
            </h1>
            <p className="text-gray-600 mb-6">
              Enter your email to view your subscription details:
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                loadSubscription(emailInput);
              }}
            >
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? "Loading..." : "View Subscription"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center mb-4">
                Don't have a subscription yet?
              </p>
              <Link
                href="/subscribe"
                className="block text-center text-amber-600 font-semibold hover:underline"
              >
                Subscribe Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading subscription...</p>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              No Active Subscription
            </h1>
            <p className="text-gray-600 mb-6">
              You don't have an active subscription yet.
            </p>
            <Link
              href="/subscribe"
              className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 px-8 rounded-lg hover:shadow-xl transition-all"
            >
              Subscribe Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const periodStart = new Date(subscription.currentPeriodStart);
  const periodEnd = new Date(subscription.currentPeriodEnd);
  const daysUntilRenewal = Math.ceil(
    (periodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    trialing: "bg-blue-100 text-blue-800",
    past_due: "bg-red-100 text-red-800",
    canceled: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Subscription Dashboard
          </h1>
          <p className="text-gray-600">{email}</p>
        </div>

        {/* Subscription Status Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Monthly Portrait Plan
              </h2>
              <div
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  statusColors[subscription.status] || statusColors.active
                }`}
              >
                {subscription.status.toUpperCase().replace("_", " ")}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                ${subscription.amount}
              </div>
              <div className="text-sm text-gray-500">per month</div>
            </div>
          </div>

          {/* Portrait Quota */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              This Month's Quota
            </h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-700">Portraits Used</span>
              <span className="font-bold text-gray-900">
                {subscription.portraitsUsedThisPeriod} / {subscription.portraitsPerMonth}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all"
                style={{
                  width: `${
                    (subscription.portraitsUsedThisPeriod /
                      subscription.portraitsPerMonth) *
                    100
                  }%`,
                }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-3">
              {subscription.portraitsRemainingThisPeriod > 0 ? (
                <>
                  You have <strong>{subscription.portraitsRemainingThisPeriod}</strong> portrait
                  {subscription.portraitsRemainingThisPeriod > 1 ? "s" : ""} remaining this period.
                </>
              ) : (
                <>Your portrait quota is used up. Renews on {periodEnd.toLocaleDateString()}.</>
              )}
            </p>
          </div>

          {/* Billing Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Current Period
              </h4>
              <p className="text-gray-900">
                {periodStart.toLocaleDateString()} - {periodEnd.toLocaleDateString()}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Next Billing Date
              </h4>
              <p className="text-gray-900">
                {periodEnd.toLocaleDateString()}{" "}
                <span className="text-sm text-gray-500">
                  ({daysUntilRenewal} day{daysUntilRenewal !== 1 ? "s" : ""})
                </span>
              </p>
            </div>
          </div>

          {/* Cancellation Warning */}
          {subscription.cancelAtPeriodEnd && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-amber-800 font-semibold">
                ⚠️ Subscription Cancellation Scheduled
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Your subscription will end on {periodEnd.toLocaleDateString()}. You can still
                order portraits until then.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {subscription.portraitsRemainingThisPeriod > 0 && (
              <Link
                href="/order"
                className="flex-1 text-center bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:shadow-xl transition-all"
              >
                Order Portrait
              </Link>
            )}

            {subscription.cancelAtPeriodEnd ? (
              <button
                onClick={handleReactivateSubscription}
                disabled={actionLoading}
                className="flex-1 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Reactivate Subscription"}
              </button>
            ) : (
              <button
                onClick={handleCancelSubscription}
                disabled={actionLoading}
                className="flex-1 bg-white text-red-600 font-bold py-3 px-6 rounded-lg border-2 border-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Cancel Subscription"}
              </button>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>Update payment method:</strong> Manage your payment methods in your{" "}
              <a href="#" className="text-amber-600 hover:underline">
                Stripe billing portal
              </a>
              .
            </p>
            <p>
              <strong>Contact support:</strong> Have questions? Reach out to{" "}
              <a href="mailto:support@pawcasso.com" className="text-amber-600 hover:underline">
                support@pawcasso.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
