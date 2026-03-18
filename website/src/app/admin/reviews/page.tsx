"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Review {
  id: string;
  customerName: string;
  customerEmail: string;
  petName: string;
  rating: number;
  reviewText: string;
  petPhotoUrl: string | null;
  portraitUrl: string | null;
  instagramHandle: string | null;
  instagramPostUrl: string | null;
  artStyle: string | null;
  approved: boolean;
  featured: boolean;
  submittedAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "approved" | "all">("pending");
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (authenticated) {
      fetchReviews();
    }
  }, [filter, authenticated]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check (in production, use proper auth)
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === "admin123") {
      setAuthenticated(true);
    } else {
      alert("Invalid password");
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/admin/reviews?filter=${filter}`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch("/api/admin/reviews/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error("Failed to approve review:", error);
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      const res = await fetch("/api/admin/reviews/feature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error("Failed to feature review:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  if (!authenticated) {
    return (
      <section className="py-24 px-6 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full">
          <h1 className="text-4xl font-semibold tracking-tight mb-8 text-center">
            Admin <span className="text-gradient">Login</span>
          </h1>
          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full min-h-[44px] bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-base text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all"
                placeholder="Enter admin password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-gold text-bg font-medium rounded-full hover:bg-gold-light transition-all"
            >
              Login
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-12 text-center">
          Review <span className="text-gradient">Management</span>
        </h1>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <button
            onClick={() => setFilter("pending")}
            className={`px-6 py-2.5 rounded-full text-sm transition-all ${
              filter === "pending"
                ? "bg-gold text-bg font-medium"
                : "bg-bg-card text-text-secondary hover:bg-bg-elevated"
            }`}
          >
            Pending ({reviews.filter(r => !r.approved).length})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-6 py-2.5 rounded-full text-sm transition-all ${
              filter === "approved"
                ? "bg-gold text-bg font-medium"
                : "bg-bg-card text-text-secondary hover:bg-bg-elevated"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2.5 rounded-full text-sm transition-all ${
              filter === "all"
                ? "bg-gold text-bg font-medium"
                : "bg-bg-card text-text-secondary hover:bg-bg-elevated"
            }`}
          >
            All Reviews
          </button>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="text-center py-20 text-text-secondary">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 text-text-secondary">No reviews found.</div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl bg-bg-card p-8 border border-white/[0.08]"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Images */}
                  {(review.petPhotoUrl || review.portraitUrl) && (
                    <div className="flex gap-4 md:w-1/3">
                      {review.petPhotoUrl && (
                        <div className="relative aspect-square flex-1 rounded-xl overflow-hidden border border-white/[0.08]">
                          <Image
                            src={review.petPhotoUrl}
                            alt="Pet photo"
                            fill
                            className="object-cover"
                            sizes="200px"
                          />
                        </div>
                      )}
                      {review.portraitUrl && (
                        <div className="relative aspect-square flex-1 rounded-xl overflow-hidden border border-white/[0.08]">
                          <Image
                            src={review.portraitUrl}
                            alt="Portrait"
                            fill
                            className="object-cover"
                            sizes="200px"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-text-primary mb-1">
                          {review.customerName} - {review.petName}
                        </h3>
                        <p className="text-sm text-text-secondary">{review.customerEmail}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {review.approved && (
                          <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                            Approved
                          </span>
                        )}
                        {review.featured && (
                          <span className="px-3 py-1 rounded-full text-xs bg-gold/20 text-gold border border-gold/30">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < review.rating ? "text-gold" : "text-white/20"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-text-primary text-[15px] leading-relaxed mb-4">
                      "{review.reviewText}"
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 text-xs text-text-secondary mb-6">
                      {review.artStyle && <span>Style: {review.artStyle}</span>}
                      {review.instagramHandle && (
                        <span>Instagram: {review.instagramHandle}</span>
                      )}
                      <span>Submitted: {new Date(review.submittedAt).toLocaleDateString()}</span>
                    </div>

                    {review.instagramPostUrl && (
                      <a
                        href={review.instagramPostUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-gold text-sm hover:text-gold-light transition-colors mb-6"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                        View Instagram Post
                      </a>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      {!review.approved && (
                        <button
                          onClick={() => handleApprove(review.id)}
                          className="px-6 py-2.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-all text-sm font-medium"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleFeatured(review.id)}
                        className="px-6 py-2.5 rounded-full bg-gold/20 text-gold border border-gold/30 hover:bg-gold/30 transition-all text-sm font-medium"
                      >
                        {review.featured ? "Unfeature" : "Feature"}
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="px-6 py-2.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
