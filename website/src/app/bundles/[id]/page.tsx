import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPromotionById, PROMOTIONS } from "@/lib/promotions";

interface BundlePageProps {
  params: {
    id: string;
  };
}

// Static generation for all bundle pages
export async function generateStaticParams() {
  return PROMOTIONS.filter(p => p.bundleSlug).map((promo) => ({
    id: promo.bundleSlug!,
  }));
}

export async function generateMetadata({ params }: BundlePageProps): Promise<Metadata> {
  const promotion = PROMOTIONS.find(p => p.bundleSlug === params.id);

  if (!promotion) {
    return {
      title: "Bundle Not Found",
    };
  }

  return {
    title: `${promotion.name} | Pawcasso Atelier`,
    description: `${promotion.bannerText} - Limited time offer on custom AI pet portraits.`,
    openGraph: {
      title: `${promotion.name} - ${promotion.discountPercent}% Off`,
      description: promotion.bannerText,
      images: ["/gallery/cat_vermeer.webp"],
    },
  };
}

// Bundle content configurations
const BUNDLE_CONTENT: Record<string, {
  headline: string;
  subheadline: string;
  features: string[];
  mockupImage: string;
  mockupAlt: string;
  styles: string[];
  tierRecommendation: string;
}> = {
  'valentines': {
    headline: "Couples Portrait Bundle",
    subheadline: "Celebrate your love with matching portraits of you and your partner's pets",
    features: [
      "2 custom portraits in matching styles",
      "Rose border themed frames",
      "Perfect for Valentine's Day gifts",
      "High-resolution downloads",
      "25% OFF with code VALENTINE25",
    ],
    mockupImage: "/gallery/cat_vermeer.webp",
    mockupAlt: "Valentine's Day themed pet portrait with rose border",
    styles: ["renaissance", "baroque", "art-deco"],
    tierRecommendation: "premium",
  },
  'mothers-day': {
    headline: "Family Portrait Bundle",
    subheadline: "Honor Mom with a beautiful family portrait of all her fur babies",
    features: [
      "3+ portraits of all family pets",
      "Elegant floral themed frames",
      "Perfect Mother's Day gift",
      "Print-ready quality (300 DPI)",
      "20% OFF with code MOM20",
    ],
    mockupImage: "/gallery/golden_retriever_portrait_square.webp",
    mockupAlt: "Mother's Day family pet portrait bundle",
    styles: ["watercolor", "impressionist", "art-nouveau"],
    tierRecommendation: "deluxe",
  },
  'halloween': {
    headline: "Spooky Portraits Collection",
    subheadline: "Transform your pet into a creature of the night",
    features: [
      "Dark Fantasy & Gothic style portraits",
      "Spooky themed backgrounds",
      "Perfect for Halloween season",
      "Multiple variations included",
      "20% OFF with code SPOOKY20",
    ],
    mockupImage: "/gallery/cat_vermeer.webp",
    mockupAlt: "Halloween themed dark fantasy pet portrait",
    styles: ["dark-fantasy", "surrealist", "cyberpunk"],
    tierRecommendation: "premium",
  },
  'christmas': {
    headline: "Holiday Gift Bundle",
    subheadline: "The perfect gift for pet lovers this Christmas season",
    features: [
      "Festive holiday themed portraits",
      "Winter wonderland backgrounds",
      "Gift-ready high resolution files",
      "Multiple sizes for printing",
      "30% OFF with code XMAS30",
    ],
    mockupImage: "/gallery/white_pomeranian_portrait_final.webp",
    mockupAlt: "Christmas holiday themed pet portrait",
    styles: ["ghibli", "needle-felt", "pixar-3d"],
    tierRecommendation: "deluxe",
  },
};

export default function BundlePage({ params }: BundlePageProps) {
  const promotion = PROMOTIONS.find(p => p.bundleSlug === params.id);

  if (!promotion) {
    notFound();
  }

  const content = BUNDLE_CONTENT[params.id] || {
    headline: "Special Bundle",
    subheadline: "Limited time offer on custom pet portraits",
    features: [
      "Multiple custom portraits",
      "High-resolution downloads",
      "Fast delivery",
      `${promotion.discountPercent}% OFF`,
    ],
    mockupImage: "/gallery/cat_vermeer.webp",
    mockupAlt: "Custom pet portrait bundle",
    styles: ["renaissance", "pixar-3d", "needle-felt"],
    tierRecommendation: "premium",
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative py-24 px-6 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${promotion.theme.accentColor}20 0%, ${promotion.theme.primaryColor}10 50%, ${promotion.theme.accentColor}20 100%)`,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <span className="text-2xl">{promotion.theme.emoji}</span>
                <span className="text-sm font-medium text-text-primary uppercase tracking-wider">
                  {promotion.name}
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
                {content.headline}
              </h1>

              <p className="text-xl text-text-secondary mb-8 leading-relaxed">
                {content.subheadline}
              </p>

              {/* Features List */}
              <ul className="space-y-4 mb-10">
                {content.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 flex-shrink-0 mt-1"
                      style={{ color: promotion.theme.primaryColor }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-lg text-text-primary">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                href={`/order?code=${promotion.couponCode}&tier=${content.tierRecommendation}`}
                className="inline-block px-8 py-4 text-lg font-semibold rounded-full transition-all transform hover:scale-105 hover:shadow-2xl"
                style={{
                  backgroundColor: promotion.theme.primaryColor,
                  color: '#000000',
                  boxShadow: `0 10px 40px ${promotion.theme.primaryColor}40`,
                }}
              >
                Order Now - {promotion.discountPercent}% OFF
              </Link>

              <p className="text-sm text-text-secondary mt-4">
                Offer valid {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
              </p>
            </div>

            {/* Mockup Image */}
            <div className="relative">
              <div
                className="absolute inset-0 rounded-3xl blur-3xl opacity-30"
                style={{
                  background: `radial-gradient(circle, ${promotion.theme.primaryColor} 0%, transparent 70%)`,
                }}
              />
              <div className="relative rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl transform hover:scale-105 transition-transform">
                <Image
                  src={content.mockupImage}
                  alt={content.mockupAlt}
                  width={800}
                  height={800}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Styles */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Recommended Art Styles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.styles.map((style) => (
              <div
                key={style}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:border-white/20 transition-all"
              >
                <div className="aspect-square relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <div className="absolute bottom-4 left-4 z-20">
                    <p className="text-xl font-semibold capitalize text-white">
                      {style.replace(/-/g, ' ')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href={`/order?code=${promotion.couponCode}&tier=${content.tierRecommendation}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-all"
            >
              <span>Choose Your Style</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join 10,000+ Happy Pet Parents
          </h2>
          <p className="text-xl text-text-secondary mb-8">
            Thousands of customers have immortalized their pets as art
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-5xl font-bold text-gradient mb-2">4.9/5</div>
              <div className="text-text-secondary">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-gradient mb-2">24h</div>
              <div className="text-text-secondary">Delivery Time</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-gradient mb-2">10K+</div>
              <div className="text-text-secondary">Happy Customers</div>
            </div>
          </div>

          <Link
            href={`/order?code=${promotion.couponCode}&tier=${content.tierRecommendation}`}
            className="inline-block px-10 py-5 text-xl font-bold text-white rounded-full transition-all transform hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${promotion.theme.primaryColor} 0%, ${promotion.theme.accentColor} 100%)`,
              boxShadow: `0 20px 60px ${promotion.theme.primaryColor}50`,
            }}
          >
            Claim Your {promotion.discountPercent}% Discount Now
          </Link>
        </div>
      </section>
    </div>
  );
}
