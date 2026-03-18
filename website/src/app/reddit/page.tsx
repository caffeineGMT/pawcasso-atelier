"use client";

import Link from "next/link";
import { artworks } from "@/lib/data";
import GalleryGrid from "@/components/GalleryGrid";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function RedditLandingContent() {
  const searchParams = useSearchParams();
  const featured = artworks.slice(0, 8);

  // Track Reddit referral
  useEffect(() => {
    const utmSource = searchParams.get("utm_source");
    const utmMedium = searchParams.get("utm_medium");
    const utmCampaign = searchParams.get("utm_campaign");
    const subreddit = searchParams.get("sub");
    const postId = searchParams.get("post");

    if (utmSource === "reddit") {
      // Log the referral server-side for analytics
      fetch("/api/analytics/reddit-referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          subreddit: subreddit,
          post_id: postId,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {
        // Silent fail - don't block the user experience
      });

      // Track in GA4
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "reddit_landing", {
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          subreddit: subreddit,
          post_id: postId,
        });
      }
    }
  }, [searchParams]);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_rgba(201,169,110,0.12),_transparent)]" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-8 animate-slide-up">
            <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-gold text-sm font-medium">Made by a Reddit user for Reddit users</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[0.95] mb-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
            Turn Your Pet Into{" "}
            <span className="text-gradient">Art</span>
          </h1>
          <p className="text-text-secondary text-lg md:text-xl font-light max-w-xl mx-auto mb-12 leading-relaxed animate-slide-up" style={{ animationDelay: "200ms" }}>
            I built an AI tool that transforms any pet photo into stunning artistic portraits. No expensive commissions, no waiting weeks—just $9 and 24 hours.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "300ms" }}>
            <Link
              href="/order"
              className="btn-glow px-8 py-3.5 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300"
            >
              Try It — $9
            </Link>
            <Link
              href="/reddit/free"
              className="px-8 py-3.5 rounded-full border border-white/[0.12] text-text-primary text-[15px] hover:border-white/[0.24] hover:bg-white/[0.04] transition-all duration-300"
            >
              Get a Free Portrait (Limited Time)
            </Link>
          </div>

          {/* Social proof stats */}
          <div className="flex items-center justify-center gap-8 mt-16 animate-slide-up" style={{ animationDelay: "500ms" }}>
            <div className="text-center">
              <div className="text-2xl font-semibold text-text-primary">34+</div>
              <div className="text-xs text-text-secondary mt-1">Artworks</div>
            </div>
            <div className="w-[1px] h-8 bg-white/[0.08]" />
            <div className="text-center">
              <div className="text-2xl font-semibold text-text-primary">17</div>
              <div className="text-xs text-text-secondary mt-1">Art Styles</div>
            </div>
            <div className="w-[1px] h-8 bg-white/[0.08]" />
            <div className="text-center">
              <div className="text-2xl font-semibold text-text-primary">24h</div>
              <div className="text-xs text-text-secondary mt-1">Delivery</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: "800ms" }}>
          <div className="w-[1px] h-12 bg-gradient-to-b from-gold/60 to-transparent" />
        </div>
      </section>

      <div className="section-divider" />

      {/* Why I Built This */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6 text-center">
            Why I Built This
          </h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-text-secondary text-lg leading-relaxed mb-6">
              I have two dogs—a Border Collie named Alfie and a Mini Aussie. I was spending hundreds of dollars commissioning artists on Fiverr to create portraits of them in different styles. Renaissance. Ghibli. Pixar. Each one took weeks and cost $50-$200.
            </p>
            <p className="text-text-secondary text-lg leading-relaxed mb-6">
              So I thought: what if AI could do this for $9 in 24 hours?
            </p>
            <p className="text-text-secondary text-lg leading-relaxed">
              I built this tool for myself, and now I'm sharing it with you. No markup, no BS—just a simple service that turns your pet photo into art you'll actually want to print and hang on your wall.
            </p>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Gallery Examples */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              Examples From the Gallery
            </h2>
            <p className="text-text-secondary text-lg">
              Real portraits generated by the tool—no cherry-picking.
            </p>
          </div>
          <GalleryGrid artworks={featured} />
          <div className="text-center mt-12">
            <Link
              href="/gallery"
              className="text-gold text-[15px] hover:text-gold-light transition-colors duration-300 inline-flex items-center gap-2"
            >
              View full gallery
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* How It Works */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            How It Works
          </h2>
          <p className="text-center text-text-secondary text-lg mb-20 max-w-lg mx-auto">
            Three simple steps. No accounts, no subscriptions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                num: "1",
                title: "Upload a photo",
                desc: "Any photo of your pet. Doesn't need to be perfect—the AI adapts to lighting, angles, backgrounds.",
              },
              {
                num: "2",
                title: "Pick a style",
                desc: "Renaissance, Ghibli, Pixar 3D, Needle Felt, Ukiyo-e—17 styles to choose from.",
              },
              {
                num: "3",
                title: "Get your art",
                desc: "High-resolution digital file (4000×5000px) delivered to your email within 24 hours. Print it, share it, use it however you want.",
              },
            ].map((item) => (
              <div key={item.num} className="text-center">
                <div className="w-14 h-14 rounded-full bg-bg-card border border-white/[0.06] flex items-center justify-center mx-auto mb-6">
                  <span className="text-gradient text-xl font-semibold">{item.num}</span>
                </div>
                <h3 className="text-lg font-medium tracking-tight mb-3">{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Pricing */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Just $9.
          </h2>
          <p className="text-text-secondary text-lg mb-16 max-w-md mx-auto">
            No subscriptions. No hidden fees. One portrait, one price.
          </p>
          <div className="max-w-sm mx-auto">
            <div className="rounded-2xl bg-bg-card p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
              <div className="text-6xl font-semibold mb-2 text-gradient">$9</div>
              <p className="text-text-secondary text-sm mb-10">per portrait</p>
              <ul className="text-text-secondary text-[15px] space-y-4 mb-10 text-left">
                <li className="flex items-center gap-3">
                  <span className="text-gold text-sm">&#10003;</span>
                  <span>4000 x 5000px resolution</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-gold text-sm">&#10003;</span>
                  <span>17 art styles</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-gold text-sm">&#10003;</span>
                  <span>24-hour delivery</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-gold text-sm">&#10003;</span>
                  <span>Up to 3 free revisions</span>
                </li>
              </ul>
              <Link
                href="/order"
                className="btn-glow inline-block w-full px-6 py-3.5 rounded-full bg-gold text-bg text-[15px] font-medium hover:bg-gold-light transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 leading-tight">
            Ready to turn your pet into art?
          </h2>
          <p className="text-text-secondary text-lg mb-10 max-w-md mx-auto">
            Takes 2 minutes to order. Delivered in 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/order"
              className="btn-glow inline-block px-10 py-4 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300"
            >
              Order Now — $9
            </Link>
            <Link
              href="/reddit/free"
              className="inline-block px-10 py-4 rounded-full border border-white/[0.12] text-text-primary text-[15px] hover:border-white/[0.24] hover:bg-white/[0.04] transition-all duration-300"
            >
              Get a Free Portrait
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function RedditLandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RedditLandingContent />
    </Suspense>
  );
}
