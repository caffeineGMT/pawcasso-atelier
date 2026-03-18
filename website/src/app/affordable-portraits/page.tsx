import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { artworks } from "@/lib/data";
import Testimonials from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "Affordable Pet Portraits - Custom Art for $9 | Fast 24-Hour Delivery",
  description:
    "Cheap custom pet portraits without sacrificing quality. Professional AI-generated art from just $9. No artist fees. 24-hour delivery. Print-ready 4000x5000px.",
  keywords: [
    "cheap pet portrait",
    "affordable custom dog portrait",
    "budget pet art",
    "cheap custom pet painting",
    "inexpensive pet portrait",
    "$9 pet portrait",
    "low cost pet art",
  ],
  openGraph: {
    title: "Affordable Pet Portraits - Custom Art for $9",
    description:
      "Professional pet portraits at a price that makes sense. From $9 with 24-hour delivery.",
    images: ["/gallery/shiba_portrait_final.webp"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Affordable Pet Portraits - Just $9",
    description: "Professional pet art without the professional price tag.",
    images: ["/gallery/shiba_portrait_final.webp"],
  },
};

export default function AffordablePortraitsPage() {
  const featured = [artworks[1], artworks[8], artworks[9], artworks[12], artworks[13], artworks[7]];

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_rgba(201,169,110,0.12),_transparent)]" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto py-20">
          <p className="text-text-secondary text-[13px] tracking-[0.4em] uppercase mb-8 animate-slide-up">
            Professional Quality, Budget Price
          </p>
          <h1
            className="text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-semibold tracking-tight leading-[0.95] mb-8 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            Custom Portraits for{" "}
            <span className="text-gradient">Just $9.</span>
          </h1>
          <p
            className="text-text-secondary text-lg md:text-xl font-light max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            Forget $200 commissioned paintings. Get museum-quality AI art for a fraction of the cost.
            Fast 24-hour delivery. No compromises on quality.
          </p>
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              href="/order?utm_source=google&utm_medium=cpc&utm_campaign=affordable-fast&utm_content=hero-cta"
              className="btn-glow px-10 py-4 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300"
            >
              Order Now — Only $9
            </Link>
          </div>

          {/* Value props */}
          <div
            className="flex items-center justify-center gap-8 mt-16 animate-slide-up"
            style={{ animationDelay: "500ms" }}
          >
            <div className="text-center">
              <div className="text-2xl font-semibold text-text-primary">$9</div>
              <div className="text-xs text-text-secondary mt-1">No Hidden Fees</div>
            </div>
            <div className="w-[1px] h-8 bg-white/[0.08]" />
            <div className="text-center">
              <div className="text-2xl font-semibold text-text-primary">24h</div>
              <div className="text-xs text-text-secondary mt-1">Fast Delivery</div>
            </div>
            <div className="w-[1px] h-8 bg-white/[0.08]" />
            <div className="text-center">
              <div className="text-2xl font-semibold text-text-primary">4000×5000</div>
              <div className="text-xs text-text-secondary mt-1">Print Quality</div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Price Comparison */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            Why Pay More?
          </h2>
          <p className="text-center text-text-secondary text-lg mb-20 max-w-2xl mx-auto">
            Traditional commissioned art costs hundreds and takes weeks. We deliver faster and cheaper without sacrificing quality.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Traditional Artist",
                price: "$150-300",
                time: "2-4 weeks",
                quality: "Variable",
                revisions: "1-2 included",
                badge: null,
              },
              {
                name: "Print-on-Demand",
                price: "$40-80",
                time: "1-2 weeks",
                quality: "Template-based",
                revisions: "None",
                badge: null,
              },
              {
                name: "Pawcasso Atelier",
                price: "$9-79",
                time: "24 hours",
                quality: "Museum-grade",
                revisions: "Up to unlimited",
                badge: "Best Value",
              },
            ].map((option, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-8 relative ${
                  option.badge
                    ? "bg-gold/10 border-2 border-gold ring-2 ring-gold/20 shadow-lg shadow-gold/10"
                    : "bg-bg-card border border-white/[0.06]"
                }`}
              >
                {option.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gold text-bg text-xs font-semibold rounded-full">
                    {option.badge}
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-6 text-center">{option.name}</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-white/[0.06]">
                    <span className="text-text-secondary">Price</span>
                    <span className="font-semibold text-text-primary">{option.price}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/[0.06]">
                    <span className="text-text-secondary">Delivery</span>
                    <span className="font-medium text-text-primary">{option.time}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/[0.06]">
                    <span className="text-text-secondary">Quality</span>
                    <span className="font-medium text-text-primary">{option.quality}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Revisions</span>
                    <span className="font-medium text-text-primary">{option.revisions}</span>
                  </div>
                </div>
                {option.badge && (
                  <Link
                    href="/order?utm_source=google&utm_medium=cpc&utm_campaign=affordable-fast&utm_content=comparison-table"
                    className="mt-6 btn-glow inline-block w-full px-6 py-3 rounded-full bg-gold text-bg text-[15px] font-medium hover:bg-gold-light transition-all duration-300 text-center"
                  >
                    Order Now
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Gallery */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              $9 Gets You This Quality
            </h2>
            <p className="text-text-secondary text-lg">
              Every portrait is print-ready at 4000×5000px resolution.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((art) => (
              <div
                key={art.id}
                className="group rounded-2xl overflow-hidden bg-bg-card border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={art.imageUrl}
                    alt={art.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-medium text-text-primary mb-1">{art.title}</h3>
                  <p className="text-sm text-text-secondary">{art.style} • {art.animal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* How It Works */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            Three steps. One day.
          </h2>
          <p className="text-center text-text-secondary text-lg mb-20 max-w-lg mx-auto">
            No back-and-forth with artists. No waiting weeks for delivery.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                num: "1",
                title: "Upload Photo",
                desc: "Any photo works. Phone camera, DSLR, even old pictures. We'll make it beautiful.",
              },
              {
                num: "2",
                title: "Pick Your Style",
                desc: "17 art styles from Renaissance to Pixar 3D. Can't decide? Order multiple for just $19.",
              },
              {
                num: "3",
                title: "Get Your Art",
                desc: "High-resolution file delivered to your email within 24 hours. Print it, frame it, share it.",
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

      {/* Testimonials */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Happy Customers
          </h2>
          <p className="text-center text-text-secondary text-lg mb-16">
            Thousands of portraits delivered. All for under $20.
          </p>
          <Testimonials />
        </div>
      </section>

      <div className="section-divider" />

      {/* Pricing Tiers */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Choose Your Package
          </h2>
          <p className="text-text-secondary text-lg mb-16 max-w-md mx-auto">
            All packages include print-ready files and fast delivery.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Basic", price: "$9", portraits: "1", delivery: "24h", styles: "1" },
              { name: "Plus", price: "$19", portraits: "3", delivery: "12h", styles: "3" },
              { name: "Pro", price: "$39", portraits: "5", delivery: "6h", styles: "5" },
              { name: "Ultimate", price: "$79", portraits: "10", delivery: "Instant", styles: "All" },
            ].map((tier) => (
              <div
                key={tier.name}
                className="rounded-2xl bg-bg-card p-6 text-left relative overflow-hidden border border-white/[0.06] hover:border-gold/20 transition-all"
              >
                <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>
                <div className="text-3xl font-semibold mb-4 text-gradient">{tier.price}</div>
                <ul className="text-text-secondary text-sm space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-gold">✓</span>
                    <span>{tier.portraits} portrait{tier.portraits !== "1" && "s"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold">✓</span>
                    <span>{tier.delivery} delivery</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold">✓</span>
                    <span>{tier.styles} style{tier.styles !== "1" && "s"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold">✓</span>
                    <span>4000×5000px</span>
                  </li>
                </ul>
                <Link
                  href={`/order?tier=${tier.name.toLowerCase()}&utm_source=google&utm_medium=cpc&utm_campaign=affordable-fast&utm_content=pricing-${tier.name.toLowerCase()}`}
                  className="btn-glow inline-block w-full px-4 py-2.5 rounded-full bg-gold text-bg text-sm font-medium hover:bg-gold-light transition-all duration-300 text-center"
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 leading-tight">
            Professional art<br />
            <span className="text-gradient">without the price tag.</span>
          </h2>
          <p className="text-text-secondary text-lg mb-10 max-w-md mx-auto">
            Your pet deserves to be immortalized. You deserve to save money.
          </p>
          <Link
            href="/order?utm_source=google&utm_medium=cpc&utm_campaign=affordable-fast&utm_content=bottom-cta"
            className="btn-glow inline-block px-10 py-4 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300"
          >
            Order for $9 Today
          </Link>
        </div>
      </section>
    </>
  );
}
