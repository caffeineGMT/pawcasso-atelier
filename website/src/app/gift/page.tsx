"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

const PRESET_AMOUNTS = [25, 50, 100];

export default function GiftCardPage() {
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"immediate" | "scheduled">(
    "immediate"
  );
  const [scheduledDate, setScheduledDate] = useState<string>("");

  // Form fields
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const finalAmount = isCustom
    ? parseFloat(customAmount) || 0
    : selectedAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (finalAmount < 10) {
      setError("Gift card amount must be at least $10");
      return;
    }

    if (!recipientEmail || !recipientName || !senderName || !senderEmail) {
      setError("Please fill in all required fields");
      return;
    }

    if (deliveryType === "scheduled" && !scheduledDate) {
      setError("Please select a delivery date");
      return;
    }

    setIsLoading(true);

    try {
      // Create checkout session for gift card
      const response = await fetch("/api/gift/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          recipientEmail,
          recipientName,
          senderName,
          senderEmail,
          message: message || null,
          deliveryDate:
            deliveryType === "scheduled"
              ? new Date(scheduledDate).toISOString()
              : new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create gift card checkout");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Gift card purchase error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to process gift card"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Get minimum date for scheduled delivery (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Give the Gift of Pet Art 🎁
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Delight pet lovers with a beautiful AI-generated portrait of their
            furry friend. The perfect gift for any occasion.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Amount Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Select Gift Card Amount
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {PRESET_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amount);
                      setIsCustom(false);
                    }}
                    className={`p-6 rounded-xl border-2 font-semibold text-lg transition-all ${
                      !isCustom && selectedAmount === amount
                        ? "border-amber-600 bg-amber-50 text-amber-900 shadow-md"
                        : "border-gray-200 hover:border-amber-300 text-gray-700"
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsCustom(true)}
                  className={`p-6 rounded-xl border-2 font-semibold text-lg transition-all ${
                    isCustom
                      ? "border-amber-600 bg-amber-50 text-amber-900 shadow-md"
                      : "border-gray-200 hover:border-amber-300 text-gray-700"
                  }`}
                >
                  Custom
                </button>
              </div>

              {isCustom && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Amount ($10 minimum)
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="1"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              )}
            </div>

            {/* Recipient Information */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recipient Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Email *
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Sender Information */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Jane Smith"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="jane@example.com"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Personal Message */}
            <div className="border-t pt-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personal Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a personal note to make this gift extra special..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Delivery Timing */}
            <div className="border-t pt-8">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Delivery Date
              </label>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setDeliveryType("immediate")}
                  className={`p-4 rounded-xl border-2 font-medium transition-all ${
                    deliveryType === "immediate"
                      ? "border-amber-600 bg-amber-50 text-amber-900"
                      : "border-gray-200 hover:border-amber-300 text-gray-700"
                  }`}
                >
                  Send Immediately
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType("scheduled")}
                  className={`p-4 rounded-xl border-2 font-medium transition-all ${
                    deliveryType === "scheduled"
                      ? "border-amber-600 bg-amber-50 text-amber-900"
                      : "border-gray-200 hover:border-amber-300 text-gray-700"
                  }`}
                >
                  Schedule Delivery
                </button>
              </div>

              {deliveryType === "scheduled" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Delivery Date
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="border-t pt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-bold text-lg py-4 px-8 rounded-xl transition-colors shadow-lg disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "Processing..."
                  : `Buy Gift Card - $${finalAmount.toFixed(2)}`}
              </button>
              <p className="text-center text-sm text-gray-500 mt-4">
                Valid for 1 year. Earn 10% credit when your recipient makes their
                first purchase!
              </p>
            </div>
          </form>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Beautiful AI Art
            </h3>
            <p className="text-gray-600 text-sm">
              Professional-quality portraits generated by advanced AI
            </p>
          </div>
          <div className="p-6">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-gray-600 text-sm">
              Instant email delivery or schedule for a special date
            </p>
          </div>
          <div className="p-6">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="font-semibold text-gray-900 mb-2">Earn Rewards</h3>
            <p className="text-gray-600 text-sm">
              Get 10% credit when your recipient makes their first purchase
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
