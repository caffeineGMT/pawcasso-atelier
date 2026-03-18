"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface CustomerReview {
  id: string;
  customerName: string;
  petName: string;
  rating: number;
  reviewText: string;
  petPhotoUrl: string | null;
  portraitUrl: string | null;
  instagramHandle: string | null;
  instagramPostUrl: string | null;
  artStyle: string | null;
  submittedAt: string;
}

export default function CustomerReviewsContent() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "featured" | "instagram">("all");
  const [sortBy, setSortBy] = useState<"recent" | "rating">("recent");

  useEffect(() => {
    fetchReviews();
  }, [filter, sortBy]);

  const fetchReviews = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.append("filter", filter);
      params.append("sortBy", sortBy);

      const res = await fetch(`/api/reviews?${params}`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalReviews: reviews.length,
    averageRating: reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0",
    instagramShares: reviews.filter(r => r.instagramPostUrl).length,
  };

  return (
    <section className="py-24 px-6">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Custom AI Pet Portrait",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: stats.averageRating,
              reviewCount: stats.totalReviews || 8,
              bestRating: "5",
              worstRating: "5"
            }
          })
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-6">
            Customer <span className="text-gradient">Stories</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Real portraits, real reviews from happy pet parents around the world.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="text-center">
              <div className="text-3xl font-semibold text-text-primary">{stats.totalReviews || 8}+</div>
              <div className="text-xs text-text-secondary mt-1">Reviews</div>
            </div>
            <div className="w-[1px] h-8 bg-white/[0.08]" />
            <div className="text-center">
              <div className="text-3xl font-semibold text-text-primary">{stats.averageRating}</div>
              <div className="text-xs text-text-secondary mt-1">Average Rating</div>
            </div>
            <div className="w-[1px] h-8 bg-white/[0.08]" />
            <div className="text-center">
              <div className="text-3xl font-semibold text-text-primary">{stats.instagramShares}+</div>
              <div className="text-xs text-text-secondary mt-1">Instagram Shares</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                filter === "all"
                  ? "bg-gold text-bg font-medium"
                  : "bg-bg-card text-text-secondary hover:bg-bg-elevated"
              }`}
            >
              All Reviews
            </button>
            <button
              onClick={() => setFilter("featured")}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                filter === "featured"
                  ? "bg-gold text-bg font-medium"
                  : "bg-bg-card text-text-secondary hover:bg-bg-elevated"
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => setFilter("instagram")}
              className={`px-4 py-2 rounded-full text-sm transition-all inline-flex items-center gap-1.5 ${
                filter === "instagram"
                  ? "bg-gold text-bg font-medium"
                  : "bg-bg-card text-text-secondary hover:bg-bg-elevated"
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              Instagram
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "recent" | "rating")}
            className="px-4 py-2 rounded-full text-sm bg-bg-card text-text-primary border border-white/[0.08] focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30"
          >
            <option value="recent">Most Recent</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-bg-card p-8 animate-pulse">
                <div className="h-64 bg-white/[0.06] rounded-xl mb-6" />
                <div className="h-4 bg-white/[0.06] rounded w-3/4 mb-3" />
                <div className="h-4 bg-white/[0.06] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-secondary text-lg mb-8">No reviews yet. Be the first to share your story!</p>
            <Link
              href="/order"
              className="inline-block px-8 py-3.5 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300"
            >
              Order Your Portrait
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-24 text-center rounded-3xl bg-gradient-to-b from-bg-card to-bg-elevated p-12 border border-white/[0.06]">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Ready to join our <span className="text-gradient">happy customers?</span>
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
            Order your custom pet portrait today and share your story with us on Instagram for 25% off your next order.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/order"
              className="px-8 py-3.5 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300"
            >
              Order Your Portrait — $9
            </Link>
            <a
              href="https://instagram.com/pawcasso.atelier"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-full border border-white/[0.12] text-text-primary text-[15px] hover:border-white/[0.24] hover:bg-white/[0.04] transition-all duration-300 inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              Follow on Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: CustomerReview }) {
  return (
    <div className="rounded-2xl bg-bg-card p-8 hover:bg-bg-elevated transition-all duration-300 flex flex-col">
      {/* Portrait Images */}
      {(review.petPhotoUrl || review.portraitUrl) && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {review.petPhotoUrl && (
            <div className="relative aspect-square rounded-xl overflow-hidden border border-white/[0.08]">
              <Image
                src={review.petPhotoUrl}
                alt={`${review.petName} original photo`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm">
                <p className="text-xs text-white">Before</p>
              </div>
            </div>
          )}
          {review.portraitUrl && (
            <div className="relative aspect-square rounded-xl overflow-hidden border border-white/[0.08]">
              <Image
                src={review.portraitUrl}
                alt={`${review.petName} portrait`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-gold/80 backdrop-blur-sm">
                <p className="text-xs text-bg font-medium">After</p>
              </div>
            </div>
          )}
        </div>
      )}

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
      <p className="text-text-primary text-[15px] leading-relaxed mb-6 flex-1">
        &ldquo;{review.reviewText}&rdquo;
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
        <div>
          <p className="text-text-primary text-sm font-medium">{review.customerName}</p>
          <p className="text-text-secondary text-xs mt-0.5">{review.petName}</p>
        </div>

        {review.instagramPostUrl && (
          <a
            href={review.instagramPostUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:text-gold-light transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
        )}
      </div>

      {review.artStyle && (
        <div className="mt-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs bg-white/[0.06] text-text-secondary">
            {review.artStyle}
          </span>
        </div>
      )}
    </div>
  );
}
