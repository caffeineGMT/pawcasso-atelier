"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SubmitReviewForm() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");

  const [email, setEmail] = useState(emailParam || "");
  const [name, setName] = useState("");
  const [petName, setPetName] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [instagramPostUrl, setInstagramPostUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("name", name);
      formData.append("petName", petName);
      formData.append("rating", rating.toString());
      formData.append("review", review);
      if (instagramHandle) formData.append("instagramHandle", instagramHandle);
      if (instagramPostUrl) formData.append("instagramPostUrl", instagramPostUrl);

      const res = await fetch("/api/reviews/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || "Failed to submit review");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-24 px-6 min-h-screen flex items-center justify-center">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-gold" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            Thank you for your <span className="text-gradient">review!</span>
          </h1>
          <p className="text-text-secondary text-lg mb-8 leading-relaxed">
            Your review will be published after approval. If you shared your portrait
            on Instagram and tagged us, we'll send you a 25% discount code within 24 hours!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="px-8 py-3.5 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300"
            >
              Back to Home
            </Link>
            <Link
              href="/gallery/customer-reviews"
              className="px-8 py-3.5 rounded-full border border-white/[0.12] text-text-primary text-[15px] hover:border-white/[0.24] hover:bg-white/[0.04] transition-all duration-300"
            >
              See Other Reviews
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-6">
            Share Your <span className="text-gradient">Story</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-md mx-auto leading-relaxed">
            We'd love to hear about your experience! Share your portrait on Instagram
            and tag us for a 25% discount on your next order.
          </p>
        </div>

        {/* Incentive Banner */}
        <div className="mb-12 p-6 rounded-2xl bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/30">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-gold font-semibold mb-2">Get 25% Off Your Next Order</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Post your portrait on Instagram, tag @pawcasso.atelier, and include
                your Instagram post URL below to receive a 25% discount code!
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full min-h-[44px] bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-base text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-white/20"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[44px] bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-base text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-white/20"
                placeholder="jane@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
              Pet's Name
            </label>
            <input
              type="text"
              required
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="w-full min-h-[44px] bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-base text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-white/20"
              placeholder="Duke"
            />
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-xs tracking-wider uppercase text-text-secondary mb-3 font-medium">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <svg
                    className={`w-8 h-8 ${star <= rating ? "text-gold" : "text-white/20"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
              Your Review
            </label>
            <textarea
              required
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={5}
              className="w-full min-h-[120px] bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-base text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all resize-none placeholder:text-white/20"
              placeholder="Tell us about your experience with Pawcasso Atelier..."
            />
          </div>

          {/* Instagram Handle (Optional) */}
          <div>
            <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
              Instagram Handle <span className="normal-case text-white/20">(optional)</span>
            </label>
            <input
              type="text"
              value={instagramHandle}
              onChange={(e) => setInstagramHandle(e.target.value)}
              className="w-full min-h-[44px] bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-base text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-white/20"
              placeholder="@yourhandle"
            />
          </div>

          {/* Instagram Post URL (Optional) */}
          <div>
            <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
              Instagram Post URL <span className="normal-case text-white/20">(optional - for 25% discount)</span>
            </label>
            <input
              type="url"
              value={instagramPostUrl}
              onChange={(e) => setInstagramPostUrl(e.target.value)}
              className="w-full min-h-[44px] bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-base text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-white/20"
              placeholder="https://instagram.com/p/..."
            />
            <p className="text-xs text-text-secondary mt-2">
              Paste the link to your Instagram post where you tagged @pawcasso.atelier
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[48px] py-4 bg-white text-black font-medium tracking-wide text-base rounded-full hover:bg-white/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>

          <p className="text-center text-white/30 text-xs">
            Your review will be published after approval.
          </p>
        </form>
      </div>
    </section>
  );
}

export default function SubmitReviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-text-primary">Loading...</div></div>}>
      <SubmitReviewForm />
    </Suspense>
  );
}
