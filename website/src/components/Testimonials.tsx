"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { testimonials as staticTestimonials, Testimonial } from "@/lib/testimonials";

interface DatabaseReview {
  id: string;
  customerName: string;
  petName: string;
  rating: number;
  reviewText: string;
  petPhotoUrl: string | null;
  portraitUrl: string | null;
  instagramHandle: string | null;
}

// Unified type for display
interface DisplayTestimonial {
  id: string;
  name: string;
  petName: string;
  photo: string;
  rating: number;
  quote: string;
  isReal: boolean;
  instagramHandle?: string | null;
}

function mapStaticToDisplay(t: Testimonial): DisplayTestimonial {
  return {
    id: t.id,
    name: t.name,
    petName: t.petName,
    photo: t.photo,
    rating: t.rating,
    quote: t.quote,
    isReal: false,
  };
}

function mapDatabaseToDisplay(r: DatabaseReview): DisplayTestimonial {
  return {
    id: r.id,
    name: r.customerName,
    petName: r.petName,
    photo: r.petPhotoUrl || r.portraitUrl || "/gallery/placeholder-pet.webp",
    rating: r.rating,
    quote: r.reviewText,
    isReal: true,
    instagramHandle: r.instagramHandle,
  };
}

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [allTestimonials, setAllTestimonials] = useState<DisplayTestimonial[]>(
    staticTestimonials.slice(0, 6).map(mapStaticToDisplay)
  );

  // Fetch real reviews from database
  useEffect(() => {
    async function fetchRealReviews() {
      try {
        const res = await fetch("/api/reviews?filter=featured&sortBy=recent");
        if (!res.ok) return;
        const data = await res.json();
        const dbReviews: DatabaseReview[] = data.reviews || [];

        if (dbReviews.length > 0) {
          const realReviews = dbReviews.map(mapDatabaseToDisplay);
          // Real reviews first, then fill with static to reach 6
          const staticFiller = staticTestimonials
            .map(mapStaticToDisplay)
            .slice(0, Math.max(0, 6 - realReviews.length));
          setAllTestimonials([...realReviews.slice(0, 6), ...staticFiller].slice(0, 9));
        }
      } catch {
        // Silently fall back to static testimonials
      }
    }

    fetchRealReviews();
  }, []);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="w-full">
      {/* Desktop: 3-column grid (no carousel) */}
      <div className="hidden md:grid md:grid-cols-3 gap-6">
        {allTestimonials.slice(0, 6).map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>

      {/* Mobile/Tablet: Carousel */}
      <div className="md:hidden">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {allTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex-[0_0_100%] min-w-0 px-2">
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {allTestimonials.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "bg-gold w-6"
                  : "bg-white/20 hover:bg-white/40"
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* View all reviews link */}
      <div className="text-center mt-10">
        <a
          href="/gallery/customer-reviews"
          className="text-gold text-[15px] hover:text-gold-light transition-colors duration-300 inline-flex items-center gap-2"
        >
          See all customer reviews
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: DisplayTestimonial;
}) {
  return (
    <div className="rounded-2xl bg-bg-card p-8 hover:bg-bg-elevated transition-all duration-300 h-full flex flex-col">
      {/* Pet photo and customer info */}
      <div className="flex items-center gap-4 mb-5">
        <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 aspect-square">
          <Image
            src={testimonial.photo}
            alt={`${testimonial.petName}'s portrait`}
            width={80}
            height={80}
            className="object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-text-primary text-sm font-medium truncate">
              {testimonial.name}
            </p>
            {testimonial.isReal && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                Verified
              </span>
            )}
          </div>
          <p className="text-text-secondary text-xs mt-0.5 truncate">
            {testimonial.petName}
          </p>
          {testimonial.instagramHandle && (
            <p className="text-gold/60 text-xs mt-0.5 truncate">
              {testimonial.instagramHandle}
            </p>
          )}
        </div>
      </div>

      {/* Star rating */}
      <div className="flex gap-1 mb-5">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < testimonial.rating ? "text-gold" : "text-white/10"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <p className="text-text-primary text-[15px] leading-relaxed flex-1">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
    </div>
  );
}
