"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { trackEvent } from "@/lib/analytics";
import { trackQuoteRequestConversion } from "@/lib/google-ads-config";

const USE_CASE_OPTIONS = [
  { value: "holiday_gifts", label: "Holiday Gifts for Team" },
  { value: "employee_appreciation", label: "Employee Appreciation" },
  { value: "team_building", label: "Remote Team Building" },
  { value: "pet_adoption_benefit", label: "Pet Adoption Reimbursement Benefit" },
  { value: "other", label: "Other (please specify in notes)" },
];

const PRICING_TIERS = [
  {
    range: "10-49 portraits",
    price: "$15",
    perUnit: "per portrait",
    features: [
      "Custom AI portraits in any style",
      "24-hour delivery",
      "High-resolution files",
      "Dedicated account manager",
    ],
    highlighted: false,
  },
  {
    range: "50-99 portraits",
    price: "$12",
    perUnit: "per portrait",
    features: [
      "Everything in 10-49, plus:",
      "12-hour expedited delivery",
      "2 style variations per pet",
      "Bulk upload portal",
      "Custom branding options",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    range: "100+ portraits",
    price: "$10",
    perUnit: "per portrait",
    features: [
      "Everything in 50-99, plus:",
      "6-hour rush delivery",
      "Unlimited revisions",
      "Print-ready files + physical prints",
      "White-glove concierge service",
      "Quarterly team refresh discounts",
    ],
    highlighted: false,
    badge: "Best Value",
  },
];

export default function CorporatePage() {
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [useCase, setUseCase] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Track corporate form submission
      trackEvent("corporate_quote_request", {
        company_name: companyName,
        team_size: parseInt(teamSize) || 0,
        use_case: useCase,
      });

      const response = await fetch("/api/corporate/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          contactName,
          email,
          teamSize: parseInt(teamSize) || 0,
          useCase,
          preferredDeliveryDate: preferredDate || null,
          notes,
          // Add UTM parameters if present
          utmSource: new URLSearchParams(window.location.search).get("utm_source"),
          utmMedium: new URLSearchParams(window.location.search).get("utm_medium"),
          utmCampaign: new URLSearchParams(window.location.search).get("utm_campaign"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit quote request");
      }

      setSubmitted(true);

      // Track successful submission
      trackEvent("corporate_quote_submitted", {
        inquiry_id: data.inquiry.id,
        team_size: parseInt(teamSize) || 0,
        estimated_value: data.inquiry.estimatedValue,
      });

      // Track Google Ads quote request conversion
      trackQuoteRequestConversion(data.inquiry.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      console.error("Corporate quote submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="min-h-screen flex items-center justify-center py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Quote Request Received!
          </h1>
          <p className="text-lg text-text-secondary mb-8">
            Thanks for your interest! We'll send your custom quote within 24 hours to{" "}
            <span className="text-gold font-medium">{email}</span>.
          </p>
          <div className="space-y-3 text-text-secondary">
            <p>What happens next:</p>
            <ul className="text-left max-w-md mx-auto space-y-2">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Your dedicated account manager will review your request</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>You'll receive a custom quote tailored to your needs</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>We'll schedule a call to discuss timeline and customization options</span>
              </li>
            </ul>
          </div>
          <a
            href="/"
            className="inline-block mt-8 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-all"
          >
            Return to Home
          </a>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Corporate Bulk Pet Portrait Orders",
            provider: {
              "@type": "Organization",
              name: "Pawcasso Atelier",
            },
            description: "Delight your team with custom AI-generated pet portraits. Perfect for employee appreciation, holiday gifts, and team building.",
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "USD",
              lowPrice: "10.00",
              highPrice: "15.00",
            },
          }),
        }}
      />

      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Delight your team with <span className="text-gradient">custom pet portraits</span>
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Boost morale and strengthen culture with personalized AI art for every team member's furry friend
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-secondary mb-12">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>As low as $10/portrait</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>6-24 hour delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Dedicated account manager</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Trusted By */}
      <section className="py-12 px-6 border-y border-white/[0.08] bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-text-secondary text-sm uppercase tracking-wider mb-8">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
            <div className="text-2xl md:text-3xl font-bold text-white/60">Google</div>
            <div className="text-2xl md:text-3xl font-bold text-white/60">Stripe</div>
            <div className="text-2xl md:text-3xl font-bold text-white/60">Airbnb</div>
            <div className="text-2xl md:text-3xl font-bold text-white/60">Meta</div>
            <div className="text-2xl md:text-3xl font-bold text-white/60">Netflix</div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-center">
            Perfect for every occasion
          </h2>
          <p className="text-lg text-text-secondary mb-12 text-center max-w-2xl mx-auto">
            Teams across the world use Pawcasso to strengthen culture and show appreciation
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Holiday Gifts",
                description: "Give your team something they'll actually treasure. Personalized pet portraits beat generic swag every time.",
                icon: "🎁",
              },
              {
                title: "Employee Appreciation",
                description: "Recognize achievements with a gift that shows you know them beyond their work ID badge.",
                icon: "⭐",
              },
              {
                title: "Remote Team Building",
                description: "Bring distributed teams closer together by celebrating their four-legged coworkers.",
                icon: "🌍",
              },
              {
                title: "Pet Adoption Benefit",
                description: "Enhance your pet-friendly culture with a memorable welcome gift for new furry family members.",
                icon: "🐾",
              },
            ].map((useCase, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:border-gold/40 transition-all"
              >
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-center">
            Volume pricing that scales with your team
          </h2>
          <p className="text-lg text-text-secondary mb-12 text-center max-w-2xl mx-auto">
            The more portraits you order, the more you save
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING_TIERS.map((tier, idx) => (
              <div
                key={idx}
                className={`relative p-8 rounded-2xl border transition-all ${
                  tier.highlighted
                    ? "border-gold bg-gold/10 ring-2 ring-gold/40 shadow-lg shadow-gold/20 scale-105"
                    : "border-white/[0.08] bg-white/[0.03]"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow-lg">
                    {tier.badge}
                  </div>
                )}
                <div className="text-center mb-6">
                  <div className="text-text-secondary text-sm font-medium uppercase tracking-wider mb-2">
                    {tier.range}
                  </div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold">{tier.price}</span>
                    <span className="text-text-secondary text-sm">{tier.perUnit}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-start gap-3 text-sm">
                      <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className={feature.endsWith(":") ? "font-semibold" : "text-text-secondary"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-center text-text-secondary text-sm mt-8">
            All prices in USD. Custom quotes available for 200+ portraits.
          </p>
        </div>
      </section>

      {/* Quote Request Form */}
      <section className="py-20 px-6" id="quote-form">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Get your custom quote
            </h2>
            <p className="text-lg text-text-secondary">
              Fill out the form below and we'll get back to you within 24 hours
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full min-h-[48px] bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-white/20"
                  placeholder="Acme Corp"
                />
              </div>

              <div>
                <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
                  Contact Name *
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full min-h-[48px] bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-white/20"
                  placeholder="Jane Smith"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[48px] bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-white/20"
                placeholder="jane@acmecorp.com"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
                  Team Size (# of portraits) *
                </label>
                <input
                  type="number"
                  required
                  min="10"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="w-full min-h-[48px] bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-white/20"
                  placeholder="50"
                />
              </div>

              <div>
                <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
                  Use Case *
                </label>
                <select
                  required
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  className="w-full min-h-[48px] bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all"
                >
                  <option value="">Select one...</option>
                  {USE_CASE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
                Preferred Delivery Date <span className="normal-case text-white/30">(optional)</span>
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full min-h-[48px] bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
                Additional Notes <span className="normal-case text-white/30">(optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full min-h-[120px] bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all resize-none placeholder:text-white/20"
                placeholder="Any specific requirements, timeline constraints, or questions..."
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[56px] py-4 bg-gold text-black font-bold tracking-wide text-lg rounded-full hover:bg-gold/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Get Custom Quote"}
            </button>

            <p className="text-center text-white/30 text-xs">
              We'll respond within 24 hours • No commitment required
            </p>
          </form>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12 text-center">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "What's the minimum order size?",
                a: "We require a minimum of 10 portraits for corporate orders to ensure dedicated account management and volume pricing.",
              },
              {
                q: "How do we submit pet photos for the team?",
                a: "Once your quote is approved, we'll provide a secure bulk upload portal where team members can submit their pet photos directly. Alternatively, HR can collect and submit photos on behalf of the team.",
              },
              {
                q: "Can we customize the art style for our brand?",
                a: "Absolutely! We offer 12+ art styles including Renaissance, Pixar 3D, Watercolor, and more. For 100+ portrait orders, we can create custom branded frames or incorporate company colors.",
              },
              {
                q: "What's the turnaround time?",
                a: "Standard delivery is 24 hours. For 50+ portraits, we offer 12-hour expedited delivery. Orders of 100+ qualify for 6-hour rush delivery with our white-glove service.",
              },
              {
                q: "Do you offer physical prints?",
                a: "Yes! For orders of 100+ portraits, we include print-ready files. Physical prints can be added to any order for $15/print with bulk discounts available.",
              },
              {
                q: "What if someone isn't satisfied with their portrait?",
                a: "We offer unlimited revisions until everyone on your team is thrilled. Our satisfaction rate is 99.2% for corporate orders.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="border-b border-white/[0.08] pb-6 last:border-0">
                <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                <p className="text-text-secondary leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Ready to delight your team?
          </h2>
          <p className="text-lg text-text-secondary mb-8">
            Get a custom quote in 24 hours. No commitment required.
          </p>
          <a
            href="#quote-form"
            className="inline-block px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
          >
            Request a Quote
          </a>
        </div>
      </section>
    </>
  );
}
