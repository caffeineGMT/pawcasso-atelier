"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

function GiftSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [giftDetails, setGiftDetails] = useState<any>(null);

  useEffect(() => {
    // In a real implementation, you'd fetch the gift card details from an API
    // For now, we'll just show a success message
    setLoading(false);
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your gift card...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Gift Card Purchased! 🎁
            </h1>
            <p className="text-xl text-gray-600">
              Your gift has been sent successfully
            </p>
          </div>

          {/* What happens next */}
          <div className="bg-amber-50 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              What Happens Next?
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  1
                </div>
                <p className="text-gray-700">
                  <strong>Confirmation emails sent</strong> — You and the recipient
                  both received confirmation emails
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  2
                </div>
                <p className="text-gray-700">
                  <strong>Recipient receives gift card</strong> — They can use it
                  immediately to order a beautiful pet portrait
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  3
                </div>
                <p className="text-gray-700">
                  <strong>You earn 10% credit</strong> — When they make their first
                  purchase, you'll receive 10% of the order value as account credit!
                </p>
              </div>
            </div>
          </div>

          {/* Referral Bonus Highlight */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Earn Referral Rewards!
            </h3>
            <p className="text-green-800">
              When your recipient makes their first purchase, you'll receive{" "}
              <strong>10% of the order value</strong> as account credit. The more
              gifts you give, the more you save!
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Link
              href="/gift"
              className="block w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-8 rounded-xl transition-colors"
            >
              Send Another Gift Card
            </Link>
            <Link
              href="/"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-8 rounded-xl transition-colors"
            >
              Return to Homepage
            </Link>
          </div>

          {/* Support */}
          <p className="mt-8 text-sm text-gray-500">
            Questions? Contact us at{" "}
            <a
              href="mailto:gifts@pawcasso-atelier.com"
              className="text-amber-600 hover:underline"
            >
              gifts@pawcasso-atelier.com
            </a>
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Receipt and gift card details have been sent to your email
          </p>
        </div>
      </div>
    </div>
  );
}

export default function GiftSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <GiftSuccessContent />
    </Suspense>
  );
}
