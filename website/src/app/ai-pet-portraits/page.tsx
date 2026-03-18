import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { artworks } from "@/lib/data";
import Testimonials from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "AI Pet Portraits - Custom AI-Generated Art in 24 Hours",
  description:
    "Advanced AI transforms your pet photo into stunning custom artwork. 17 art styles, 4000x5000px resolution, delivered in 24 hours. From $9.",
  keywords: [
    "ai pet portrait",
    "ai dog portrait",
    "ai cat portrait",
    "custom ai art",
    "ai generated pet art",
    "machine learning pet portrait",
    "neural network art",
  ],
  openGraph: {
    title: "AI Pet Portraits - Custom AI-Generated Art in 24 Hours",
    description:
      "Advanced AI transforms your pet photo into stunning custom artwork. 17 art styles, delivered in 24 hours. From $9.",
    images: ["/gallery/cat_vermeer.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Pet Portraits - Custom AI-Generated Art",
    description: "Advanced AI transforms your pet into stunning art. From $9.",
    images: ["/gallery/cat_vermeer.png"],
  },
};

export default function AIPortraitsPage() {
  const featured = [artworks[0], artworks[4], artworks[6], artworks[7], artworks[11], artworks[13]];

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_rgba(201,169,110,0.12),_transparent)]" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto py-20">
          <p className="text-text-secondary text-[13px] tracking-[0.4em] uppercase mb-8 animate-slide-up">
            Advanced AI Technology
          </p>
          <h1
            className="text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-semibold tracking-tight leading-[0.95] mb-8 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            AI-Powered Pet{" "}
            <span className="text-gradient">Portraits.</span>
          </h1>
          <p
            className="text-text-secondary text-lg md:text-xl font-light max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            Cutting-edge neural networks transform your pet photo into museum-quality art.
            No human artist needed. 17 styles. 4000x5000px resolution. Delivered in 24 hours.
          </p>
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              href="/order?utm_source=google&utm_medium=cpc&utm_campaign=ai-tech&utm_content=hero-cta"
              className="btn-glow px-10 py-4 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300"
            >
              Create AI Portrait — From $9
            </Link>
          </div>

          {/* Tech stats */}
          <div
            className="flex items-center justify-center gap-8 mt-16 animate-slide-up"
            style={{ animationDelay: "500ms" }}
          >
            <div className="text-center">
              <div className="text-2xl font-semibold text-text-primary">17</div>
              <div className="text-xs text-text-secondary mt-1">AI Models</div>
            </div>
            <div className="w-[1px] h-8 bg-white/[0.08]" />
            <div className="text-center">
              <div className="text-2xl font-semibold text-text-primary">4000×5000</div>
              <div className="text-xs text-text-secondary mt-1">Resolution</div>
            </div>
            <div className="w-[1px] h-8 bg-white/[0.08]" />
            <div className="text-center">
              <div className="text-2xl font-semibold text-text-primary">24h</div>
              <div className="text-xs text-text-secondary mt-1">Delivery</div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Why AI */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            Why AI Art?
          </h2>
          <p className="text-center text-text-secondary text-lg mb-20 max-w-2xl mx-auto">
            Machine learning delivers consistency, speed, and creative possibilities that traditional art cannot match.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Instant Style Transfer",
                desc: "Our neural networks have been trained on thousands of masterworks. Apply any artistic style to your pet instantly.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
              },
              {
                title: "Perfect Consistency",
                desc: "No off days, no artistic interpretation. Every portrait is pixel-perfect, every time. Unlimited revisions guaranteed.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: "24-Hour Delivery",
                desc: "Traditional commissions take weeks. Our AI processes your order immediately. Get your portrait within 24 hours.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-bg-card border border-white/[0.06] flex items-center justify-center mx-auto mb-6 text-gold">
                  {item.icon}
                </div>
                <h3 className="text-xl font-medium tracking-tight mb-3">{item.title}</h3>
                <p className="text-text-secondary text-[15px] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* AI Gallery */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              AI-Generated Gallery
            </h2>
            <p className="text-text-secondary text-lg">
              Every piece created by neural networks trained on the masters.
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
            The AI Process
          </h2>
          <p className="text-center text-text-secondary text-lg mb-20 max-w-lg mx-auto">
            Three simple steps. All powered by advanced machine learning.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                num: "1",
                title: "Upload Your Photo",
                desc: "Our computer vision system analyzes your pet's features, lighting, and composition automatically.",
              },
              {
                num: "2",
                title: "Choose AI Style",
                desc: "Select from 17 neural networks trained on Renaissance, Baroque, Ghibli, Pixar 3D, and more.",
              },
              {
                num: "3",
                title: "AI Renders Portrait",
                desc: "Our GPU cluster processes your order. 4000x5000px print-ready file delivered within 24 hours.",
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
            Tech-Savvy Pet Parents
          </h2>
          <p className="text-center text-text-secondary text-lg mb-16">
            Join hundreds of satisfied AI art collectors
          </p>
          <Testimonials />
        </div>
      </section>

      <div className="section-divider" />

      {/* Pricing */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            From $9 per portrait.
          </h2>
          <p className="text-text-secondary text-lg mb-16 max-w-md mx-auto">
            Access to cutting-edge AI technology at an unbeatable price.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
            {[
              { name: "Basic", price: "$9", features: ["1 AI portrait", "24-hour delivery", "4000×5000px", "1 art style", "3 revisions"] },
              { name: "Premium", price: "$19", features: ["3 AI portraits", "12-hour delivery", "4000×5000px", "3 art styles", "Unlimited revisions"] },
            ].map((tier) => (
              <div
                key={tier.name}
                className="rounded-2xl bg-bg-card p-8 text-left relative overflow-hidden border border-white/[0.06] hover:border-gold/20 transition-all"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                <div className="text-4xl font-semibold mb-6 text-gradient">{tier.price}</div>
                <ul className="text-text-secondary text-[15px] space-y-3 mb-8">
                  {tier.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span className="text-gold text-sm">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/order?tier=${tier.name.toLowerCase()}&utm_source=google&utm_medium=cpc&utm_campaign=ai-tech&utm_content=pricing-${tier.name.toLowerCase()}`}
                  className="btn-glow inline-block w-full px-6 py-3.5 rounded-full bg-gold text-bg text-[15px] font-medium hover:bg-gold-light transition-all duration-300 text-center"
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
            Ready to see your pet<br />
            <span className="text-gradient">transformed by AI?</span>
          </h2>
          <p className="text-text-secondary text-lg mb-10 max-w-md mx-auto">
            Upload a photo and let our neural networks do the rest.
          </p>
          <Link
            href="/order?utm_source=google&utm_medium=cpc&utm_campaign=ai-tech&utm_content=bottom-cta"
            className="btn-glow inline-block px-10 py-4 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300"
          >
            Create AI Portrait Now
          </Link>
        </div>
      </section>
    </>
  );
}
