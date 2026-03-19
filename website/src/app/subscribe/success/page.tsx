"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SubscriptionSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-8 inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full">
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Welcome to Pawcasso Subscription! 🎉
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your subscription is now active. You can order your first portrait right away!
        </p>

        {/* What's Next */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            What's Next?
          </h2>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold mr-4">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  Order Your First Portrait
                </h3>
                <p className="text-gray-600">
                  Head to the order page, upload a photo of your pet, choose your art style, and we'll deliver your portrait within 24 hours.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold mr-4">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  Manage Your Subscription
                </h3>
                <p className="text-gray-600">
                  View your subscription details, update payment methods, or cancel anytime from your subscription dashboard.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold mr-4">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  Monthly Renewal
                </h3>
                <p className="text-gray-600">
                  Your subscription renews automatically each month. You'll receive 1 fresh portrait credit with each billing cycle.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/order"
            className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 px-8 rounded-lg hover:shadow-xl transition-all text-lg"
          >
            Order Your First Portrait
          </Link>
          <Link
            href="/dashboard/subscription"
            className="inline-block bg-white text-gray-700 font-bold py-4 px-8 rounded-lg border-2 border-gray-300 hover:border-amber-500 hover:shadow-lg transition-all text-lg"
          >
            Manage Subscription
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 p-6 bg-amber-50 rounded-xl border-2 border-amber-200">
          <p className="text-sm text-gray-700">
            <strong>Need help?</strong> Check your email for your subscription confirmation and receipt. You can also{" "}
            <Link href="/contact" className="text-amber-600 hover:underline">
              contact our support team
            </Link>{" "}
            anytime.
          </p>
        </div>

        {sessionId && (
          <p className="mt-8 text-xs text-gray-400">
            Session ID: {sessionId}
          </p>
        )}
      </div>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SubscriptionSuccessContent />
    </Suspense>
  );
}
