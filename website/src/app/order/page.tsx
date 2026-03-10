"use client";

import { useState, type FormEvent } from "react";
import { artStyleOptions } from "@/lib/data";

export default function OrderPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [style, setStyle] = useState("");
  const [tier, setTier] = useState<"digital" | "print">("digital");
  const [petName, setPetName] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, style, tier, petName, notes }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again or DM us on Instagram.");
        setLoading(false);
      }
    } catch {
      alert("Something went wrong. Please try again or DM us on Instagram.");
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">
            Commission a <span className="text-gold">Portrait</span>
          </h1>
          <p className="text-text-secondary max-w-lg mx-auto">
            Share a photo of your beloved companion and select your preferred artistic style.
            We will craft a bespoke portrait worthy of any gallery wall.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-bg-elevated border border-border px-4 py-3 text-sm text-text-primary focus:border-gold focus:outline-none transition-colors"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bg-elevated border border-border px-4 py-3 text-sm text-text-primary focus:border-gold focus:outline-none transition-colors"
                placeholder="jane@example.com"
              />
            </div>
          </div>

          {/* Pet Name */}
          <div>
            <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2">
              Pet&apos;s Name *
            </label>
            <input
              type="text"
              required
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="w-full bg-bg-elevated border border-border px-4 py-3 text-sm text-text-primary focus:border-gold focus:outline-none transition-colors"
              placeholder="Sir Woofington III"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2">
              Pet Photo *
            </label>
            <div className="border border-dashed border-border hover:border-gold/40 transition-colors p-8 text-center cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <svg className="w-8 h-8 mx-auto text-text-secondary mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {fileName ? (
                <p className="text-gold text-sm">{fileName}</p>
              ) : (
                <>
                  <p className="text-text-secondary text-sm">Click or drag to upload your pet&apos;s photo</p>
                  <p className="text-text-secondary text-xs mt-1">JPG, PNG, or HEIC (max 10MB)</p>
                </>
              )}
            </div>
          </div>

          {/* Style Selection */}
          <div>
            <label className="block text-xs tracking-wider uppercase text-text-secondary mb-4">
              Art Style *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {artStyleOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStyle(opt.value)}
                  className={`text-left p-4 border transition-colors ${
                    style === opt.value
                      ? "border-gold bg-gold/10"
                      : "border-border hover:border-gold/40"
                  }`}
                >
                  <div className="text-sm font-medium text-text-primary">{opt.label}</div>
                  <div className="text-xs text-text-secondary mt-1">{opt.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Tier Selection */}
          <div>
            <label className="block text-xs tracking-wider uppercase text-text-secondary mb-4">
              Package *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setTier("digital")}
                className={`p-6 border text-left transition-colors ${
                  tier === "digital"
                    ? "border-gold bg-gold/10"
                    : "border-border hover:border-gold/40"
                }`}
              >
                <div className="text-gold text-xs tracking-widest uppercase mb-2">Digital</div>
                <div className="text-3xl font-light mb-2">$29</div>
                <div className="text-text-secondary text-xs">High-res digital file (4000x5000px)</div>
              </button>
              <button
                type="button"
                onClick={() => setTier("print")}
                className={`p-6 border text-left transition-colors relative ${
                  tier === "print"
                    ? "border-gold bg-gold/10"
                    : "border-border hover:border-gold/40"
                }`}
              >
                <div className="absolute -top-2 right-4 bg-gold text-bg text-[10px] tracking-wider px-2 py-0.5">
                  POPULAR
                </div>
                <div className="text-gold text-xs tracking-widest uppercase mb-2">Print-Ready</div>
                <div className="text-3xl font-light mb-2">$79</div>
                <div className="text-text-secondary text-xs">Color-calibrated, 300 DPI print file</div>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2">
              Special Requests (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-bg-elevated border border-border px-4 py-3 text-sm text-text-primary focus:border-gold focus:outline-none transition-colors resize-none"
              placeholder="Any specific requests? E.g., include a crown, specific background color..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !style}
            className="w-full py-4 bg-gold text-bg font-medium tracking-wider text-sm hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Redirecting to checkout..." : `Pay ${tier === "digital" ? "$29" : "$79"} — Proceed to Checkout`}
          </button>

          <p className="text-center text-text-secondary text-xs">
            Secure payment via Stripe. You&apos;ll receive your portrait within 24-48 hours.
          </p>
        </form>
      </div>
    </section>
  );
}
