"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create subscription checkout session
      const response = await fetch("/api/checkout/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          utmSource: new URLSearchParams(window.location.search).get("utm_source"),
          utmMedium: new URLSearchParams(window.location.search).get("utm_medium"),
          utmCampaign: new URLSearchParams(window.location.search).get("utm_campaign"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe && data.sessionId) {
        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });
        if (stripeError) {
          throw new Error(stripeError.message);
        }
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
            ✨ NEW: Monthly Subscription
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Never Run Out of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
              Pet Portraits
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
            Get a stunning AI-generated portrait of your pet every month. Perfect for pet parents who can't get enough of their furry friends.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-amber-400 relative overflow-hidden">
            {/* Best Value Badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-br from-orange-500 to-amber-500 text-white px-6 py-2 rounded-bl-3xl font-bold text-sm">
              BEST VALUE
            </div>

            <div className="pt-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Monthly Portrait Plan
              </h2>
              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-bold text-gray-900">$29</span>
                <span className="text-xl text-gray-500 ml-2">/month</span>
              </div>

              {/* What's Included */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5"
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
                  <div>
                    <p className="font-semibold text-gray-900">
                      1 Premium Portrait Per Month
                    </p>
                    <p className="text-sm text-gray-500">
                      Any art style, any pet, high-resolution
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5"
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
                  <div>
                    <p className="font-semibold text-gray-900">
                      $20 Savings vs. One-Time Purchase
                    </p>
                    <p className="text-sm text-gray-500">
                      Save 41% compared to buying individually ($49/portrait)
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5"
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
                  <div>
                    <p className="font-semibold text-gray-900">
                      Priority Support
                    </p>
                    <p className="text-sm text-gray-500">
                      Dedicated subscriber support team
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5"
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
                  <div>
                    <p className="font-semibold text-gray-900">
                      Cancel Anytime
                    </p>
                    <p className="text-sm text-gray-500">
                      No commitment, cancel with one click
                    </p>
                  </div>
                </div>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Jane Smith"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 px-8 rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {loading ? "Processing..." : "Start Subscription"}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By subscribing, you agree to our terms. Cancel anytime from your account dashboard.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                How does the subscription work?
              </h3>
              <p className="text-gray-600">
                You'll be charged $29/month and receive 1 portrait credit each billing cycle. Upload a photo of your pet anytime during the month, choose your art style, and we'll deliver your portrait within 24 hours.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Absolutely! You can cancel your subscription at any time from your account dashboard. You'll retain access until the end of your current billing period.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                What if I don't use my portrait this month?
              </h3>
              <p className="text-gray-600">
                Portrait credits do not roll over. Each month you receive 1 fresh portrait credit. This keeps the subscription simple and affordable.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Can I have multiple pets?
              </h3>
              <p className="text-gray-600">
                Yes! Each month you can choose any pet for your portrait. Switch between your dog, cat, rabbit, or any furry friend.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                How is this different from one-time purchases?
              </h3>
              <p className="text-gray-600">
                Subscriptions save you $20 per portrait ($29/mo vs. $49 one-time). Plus you get priority support and the convenience of a monthly portrait delivered automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="max-w-5xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Subscription vs. One-Time Purchase
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* One-Time Purchase */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                One-Time Purchase
              </h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                $49<span className="text-lg text-gray-500">/portrait</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">✓</span>
                  <span className="text-gray-600">1 portrait</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">✓</span>
                  <span className="text-gray-600">Any art style</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">✓</span>
                  <span className="text-gray-600">Standard support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">✗</span>
                  <span className="text-gray-400">No recurring portraits</span>
                </li>
              </ul>
            </div>

            {/* Subscription */}
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-8 shadow-xl text-white transform scale-105">
              <div className="bg-white text-orange-600 px-3 py-1 rounded-full inline-block text-sm font-bold mb-4">
                BEST VALUE
              </div>
              <h3 className="text-2xl font-bold mb-4">Monthly Subscription</h3>
              <div className="text-4xl font-bold mb-6">
                $29<span className="text-lg opacity-90">/month</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>1 portrait per month</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Any art style</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Priority support</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Save $20/portrait (41% off)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Cancel anytime</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
