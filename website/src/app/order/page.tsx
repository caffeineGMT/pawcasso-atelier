"use client";

import { useState, useEffect, type FormEvent, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { artStyleOptions } from "@/lib/data";
import { TIER_CONFIG, type TierId } from "@/lib/stripe";
import { PricingComparison } from "@/components/PricingComparison";
import { trackEvent, trackAddToCart, trackInitiateCheckout, trackEngagement, ContentType } from "@/lib/analytics";
import { trackPinterestAddToCart, trackPinterestCheckout } from "@/lib/pinterest";
import CrispChat from "@/components/CrispChat";
import TrustBadges from "@/components/TrustBadges";
import OrderActivityFeed from "@/components/OrderActivityFeed";

const stylePreviewMap: Record<string, { image: string; title: string }> = {
  renaissance: { image: "/gallery/cat_vermeer.png", title: "Cat with a Pearl Earring" },
  baroque: { image: "/gallery/lion_portrait.png", title: "Sovereign Light" },
  impressionist: { image: "/gallery/starry_night_persian_cat.png", title: "Starry Night Whiskers" },
  ghibli: { image: "/gallery/golden_retriever_ghibli.png", title: "Moonlit Garden" },
  watercolor: { image: "/gallery/hedgehog_bookshop_tree_trunk.png", title: "The Little Bookshop" },
  "art-nouveau": { image: "/gallery/owl_art_nouveau.png", title: "The Keeper of Pages" },
  "ukiyo-e": { image: "/gallery/pisces_zodiac_ukiyoe_portrait.png", title: "Pisces Rising" },
  cyberpunk: { image: "/gallery/the_catrix_poster.png", title: "The Catrix" },
  "pixar-3d": { image: "/gallery/red_panda_pixar_chef.png", title: "Chef's Kiss" },
  "needle-felt": { image: "/gallery/corgi_needle_felt.png", title: "Woolly Wanderer" },
  hyperrealism: { image: "/gallery/penguin_gala.png", title: "Black Tie Affair" },
  "art-deco": { image: "/gallery/the_great_catsby_poster.png", title: "The Great Catsby" },
};

function OrderPageContent() {
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [style, setStyle] = useState("");
  const [petName, setPetName] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<TierId>('basic');
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [guaranteeExpanded, setGuaranteeExpanded] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [socialProofCount, setSocialProofCount] = useState<number>(2847);

  // Track page view and check for URL params (don't track begin_checkout until form interaction)
  useEffect(() => {
    // Check for tier parameter
    const tierParam = searchParams.get('tier');
    if (tierParam) {
      const validTier = TIER_CONFIG.find(t => t.id === tierParam);
      if (validTier) {
        setSelectedTier(validTier.id);
      }
    }

    // Check for discount code parameter
    const codeParam = searchParams.get('code');
    if (codeParam) {
      setDiscountCode(codeParam);
      trackEngagement('discount_view', { discount_code: codeParam });
    }
  }, [searchParams]);

  // Urgency timer - 24 hour countdown
  useEffect(() => {
    // Initialize or get existing expiry time
    const storedExpiry = localStorage.getItem('priceExpiry');
    let expiryTime: number;

    if (storedExpiry) {
      expiryTime = parseInt(storedExpiry);
      // If expired, reset to new 24h window
      if (expiryTime < Date.now()) {
        expiryTime = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem('priceExpiry', expiryTime.toString());
      }
    } else {
      expiryTime = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem('priceExpiry', expiryTime.toString());
    }

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, expiryTime - now);
      setTimeLeft(remaining);

      // Reset if expired
      if (remaining === 0) {
        const newExpiry = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem('priceExpiry', newExpiry.toString());
        setTimeLeft(24 * 60 * 60 * 1000);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Social proof incrementing counter
  useEffect(() => {
    const interval = setInterval(() => {
      setSocialProofCount(prev => prev + Math.floor(Math.random() * 3)); // Increment by 0-2 every 5 seconds
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getOriginalPrice = (tier: TierId): number => {
    const originalPrices: Record<TierId, number> = {
      basic: 15,
      premium: 49,
      deluxe: 82,
      bundle: 132,
    };
    return originalPrices[tier];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // Clear previous errors
    setUploadError(null);

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setUploadError("File size exceeds 10MB limit. Please choose a smaller image.");
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Invalid file type. Please upload a JPEG, PNG, or WebP image.");
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Set the file and generate preview
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Track AddToCart event (critical for "add-to-cart abandoners" retargeting audience)
    // This signals high purchase intent
    const selectedTierConfig = TIER_CONFIG.find(t => t.id === selectedTier);
    trackAddToCart({
      content_ids: [`portrait_${selectedTier}`],
      content_name: `AI Pet Portrait - ${selectedTierConfig?.name || 'Basic'} Package`,
      content_type: 'product',
      value: selectedTierConfig?.price || 9,
      currency: 'USD',
    });

    // Track Pinterest AddToCart
    trackPinterestAddToCart({
      id: `portrait_${selectedTier}`,
      name: `AI Pet Portrait - ${selectedTierConfig?.name || 'Basic'} Package`,
      price: selectedTierConfig?.price || 9,
      quantity: 1,
    });

    // Track engagement
    trackEngagement('photo_upload_start', {
      tier: selectedTier,
      file_size: file.size,
      file_type: file.type,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadError(null);

    try {
      // Upload the photo first if one is selected
      let petPhotoUrl = null;
      if (selectedFile) {
        setUploadProgress(50);
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json();
          throw new Error(errorData.error || "Photo upload failed");
        }

        const uploadData = await uploadRes.json();
        petPhotoUrl = uploadData.url;
        setUploadProgress(100);
      }

      // Track InitiateCheckout event (creates "checkout initiators" audience)
      const selectedTierConfig = TIER_CONFIG.find(t => t.id === selectedTier);
      trackInitiateCheckout({
        content_ids: [`portrait_${selectedTier}`],
        contents: [{ id: `portrait_${selectedTier}`, quantity: 1 }],
        value: selectedTierConfig?.price || 9,
        currency: 'USD',
        num_items: 1,
      });

      // Track Pinterest Checkout
      trackPinterestCheckout({
        id: `order_${Date.now()}`,
        value: selectedTierConfig?.price || 9,
        products: [{
          id: `portrait_${selectedTier}`,
          name: `AI Pet Portrait - ${selectedTierConfig?.name || 'Basic'} Package`,
          price: selectedTierConfig?.price || 9,
          quantity: 1,
        }],
      });

      // Create checkout session with photo URL, tier, and discount code
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          style,
          petName,
          notes,
          petPhotoUrl,
          tier: selectedTier,
          discountCode: discountCode || undefined
        }),
      });

      const data = await res.json();

      if (data.url) {
        // Track add_payment_info event before redirect to Stripe
        trackEvent('add_payment_info', {
          tier: selectedTier,
          currency: 'USD',
          value: selectedTierConfig?.price,
        });
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again or DM us on Instagram.");
        setLoading(false);
        setUploadProgress(0);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";
      setUploadError(errorMessage);
      alert(`${errorMessage}. Please try again or DM us on Instagram.`);
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <section className="py-24 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Custom AI Pet Portrait",
            image: "https://pawcasso-atelier.vercel.app/gallery/cat_vermeer.png",
            description: "Transform your pet into stunning AI-generated artwork. Choose from 17 artistic styles including Renaissance, Pixar 3D, Needle Felt, and more. Multiple packages available with delivery from 24 hours to instant.",
            brand: {
              "@type": "Brand",
              name: "Pawcasso Atelier"
            },
            offers: {
              "@type": "AggregateOffer",
              url: "https://pawcasso-atelier.vercel.app/order",
              priceCurrency: "USD",
              lowPrice: "9.00",
              highPrice: "79.00",
              offerCount: "4",
              availability: "https://schema.org/InStock",
              offers: TIER_CONFIG.map(tier => ({
                "@type": "Offer",
                name: `${tier.name} Package`,
                price: tier.price.toFixed(2),
                priceCurrency: "USD",
                availability: "https://schema.org/InStock"
              }))
            }
          })
        }}
      />
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-6">
            Commission a <span className="text-gradient">Portrait</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-md mx-auto leading-relaxed">
            Upload a photo. Pick a style. Get a masterpiece delivered fast.
          </p>
        </div>

        {/* Discount Code Banner */}
        {discountCode && (
          <div className="mb-8 p-4 rounded-xl bg-gold/10 border border-gold/30">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-gold font-medium">
                Discount code <span className="font-mono font-bold">{discountCode}</span> will be applied at checkout (10% off)
              </p>
            </div>
          </div>
        )}

        {/* Pricing Comparison Table */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold tracking-tight mb-8 text-center">
            Choose Your <span className="text-gradient">Perfect Package</span>
          </h2>
          <PricingComparison />
        </div>

        {/* Trust Badges */}
        <TrustBadges />

        {/* Urgency Timer */}
        <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <div className="text-center sm:text-left">
              <span className="text-red-400 font-medium text-sm">Special pricing ends in: </span>
              <span className="text-red-300 font-mono font-bold text-lg ml-1">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.03] border border-white/[0.08]">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-purple-500 border-2 border-background" />
              ))}
            </div>
            <p className="text-text-secondary text-sm">
              Join <span className="text-gold font-bold">{socialProofCount.toLocaleString()}</span> happy pet parents
            </p>
          </div>
        </div>

        {/* Tier Selection */}
        <div className="mb-10">
          <label className="block text-xs tracking-wider uppercase text-text-secondary mb-4 font-medium text-center">
            Choose Your Package
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIER_CONFIG.map((tier) => (
              <button
                key={tier.id}
                type="button"
                onClick={() => {
                  setSelectedTier(tier.id);
                  trackEngagement('tier_selection', { tier: tier.id, price: tier.price });
                }}
                className={`text-left p-5 rounded-2xl border transition-all min-h-[200px] flex flex-col ${
                  selectedTier === tier.id
                    ? "border-gold bg-gold/10 ring-2 ring-gold/40 shadow-lg shadow-gold/20"
                    : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.16] hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="text-lg font-semibold text-text-primary">{tier.name}</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-text-primary">{tier.priceDisplay}</div>
                  </div>
                </div>
                <ul className="space-y-2 flex-1">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                      <svg className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {selectedTier === tier.id && (
                  <div className="mt-3 pt-3 border-t border-gold/20">
                    <span className="text-xs text-gold font-medium">Selected ✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Info */}
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

          {/* Pet Name */}
          <div>
            <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
              Pet&apos;s Name
            </label>
            <input
              type="text"
              required
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="w-full min-h-[44px] bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-base text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-white/20"
              placeholder="Sir Woofington III"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
              Pet Photo
            </label>
            <div className="border border-dashed border-white/[0.12] hover:border-gold/40 transition-all rounded-2xl p-8 sm:p-10 text-center cursor-pointer relative group min-h-[120px] flex flex-col items-center justify-center">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <svg className="w-10 h-10 mx-auto text-white/20 group-hover:text-gold/60 transition-colors mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {selectedFile ? (
                <p className="text-gold text-base font-medium">{selectedFile.name}</p>
              ) : (
                <>
                  <p className="text-text-secondary text-base">Click or drag to upload</p>
                  <p className="text-white/20 text-xs mt-1">JPG, PNG, or WebP — max 10MB</p>
                </>
              )}
            </div>
            {previewUrl && (
              <div className="mt-4 flex justify-center">
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-white/[0.08]">
                  <Image
                    src={previewUrl}
                    alt="Pet photo preview"
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
              </div>
            )}
            {uploadError && (
              <p className="text-red-400 text-sm mt-2">{uploadError}</p>
            )}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-4">
                <div className="w-full bg-white/[0.08] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gold h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-text-secondary text-center mt-2">Uploading photo...</p>
              </div>
            )}
          </div>

          {/* Style Selection */}
          <div>
            <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
              Art Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {artStyleOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setStyle(opt.value);
                    trackEngagement('style_preview', { style: opt.value, style_name: opt.label });
                  }}
                  className={`text-left p-4 rounded-xl border transition-all min-h-[64px] ${
                    style === opt.value
                      ? "border-gold/60 bg-gold/10 ring-1 ring-gold/20"
                      : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.16] hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="text-base font-medium text-text-primary">{opt.label}</div>
                  <div className="text-xs text-text-secondary mt-1 leading-snug">{opt.description}</div>
                </button>
              ))}
            </div>

            {/* Style Preview */}
            {style && stylePreviewMap[style] && (
              <div className="mt-6 rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.08]">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={stylePreviewMap[style].image}
                    alt={stylePreviewMap[style].title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 640px"
                  />
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs text-text-secondary">
                    Style preview: <span className="text-text-primary font-medium">{stylePreviewMap[style].title}</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
              Special Requests <span className="normal-case text-white/20">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full min-h-[100px] bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-base text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all resize-none placeholder:text-white/20"
              placeholder="Any specific requests? E.g., include a crown, specific background..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !style || (uploadProgress > 0 && uploadProgress < 100)}
            className="w-full min-h-[48px] py-4 bg-white text-black font-medium tracking-wide text-base rounded-full hover:bg-white/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed sm:w-auto sm:px-12"
          >
            {uploadProgress > 0 && uploadProgress < 100
              ? "Uploading photo..."
              : loading
              ? "Redirecting to checkout..."
              : `Pay ${TIER_CONFIG.find(t => t.id === selectedTier)?.priceDisplay} — Get Your Portrait`}
          </button>

          <p className="text-center text-white/30 text-xs">
            Secure payment via Stripe. Portrait delivered within 24 hours.
          </p>

          {/* Guarantee Section */}
          <div className="mt-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="border border-white/[0.08] rounded-2xl overflow-hidden bg-white/[0.03]">
              <button
                type="button"
                onClick={() => setGuaranteeExpanded(!guaranteeExpanded)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/[0.06] transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-text-primary">100% Money-Back Guarantee</h3>
                    <p className="text-sm text-text-secondary">Your satisfaction is our priority</p>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-text-secondary transition-transform duration-300 ${guaranteeExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  guaranteeExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 pt-2 border-t border-white/[0.08]">
                  <p className="text-sm text-text-secondary leading-relaxed mb-4">
                    If you&apos;re not 100% satisfied with your portrait, we&apos;ll revise it for free or provide a full refund. No questions asked.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-text-secondary">Unlimited free revisions until you love it</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-text-secondary">Full refund if we can&apos;t meet your expectations</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-text-secondary">24-hour delivery or your money back</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* As Seen On Section */}
          <div className="mt-10 text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <p className="text-xs uppercase tracking-wider text-text-secondary mb-4 font-medium">As Seen On</p>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <a
                href="https://www.producthunt.com"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-40 hover:opacity-70 transition-opacity"
              >
                <svg className="h-6" viewBox="0 0 40 40" fill="currentColor">
                  <path d="M20 40C8.96 40 0 31.04 0 20S8.96 0 20 0s20 8.96 20 20-8.96 20-20 20zm0-37.5C10.34 2.5 2.5 10.34 2.5 20S10.34 37.5 20 37.5 37.5 29.66 37.5 20 29.66 2.5 20 2.5z"/>
                  <path d="M22 14h-7v12h3v-4h4c2.76 0 5-2.24 5-5s-2.24-3-5-3zm0 5h-4v-3h4c.55 0 1 .45 1 1s-.45 1-1 1z"/>
                </svg>
              </a>
              <a
                href="https://techcrunch.com"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-40 hover:opacity-70 transition-opacity"
              >
                <span className="text-lg font-bold tracking-tight text-text-primary">TechCrunch</span>
              </a>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default function OrderPage() {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-text-primary">Loading...</div></div>}>
        <OrderPageContent />
      </Suspense>

      {/* Live Chat for Conversion Optimization */}
      {process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID && (
        <CrispChat
          websiteId={process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID}
          enableConversionTriggers={true}
        />
      )}
    </>
  );
}
