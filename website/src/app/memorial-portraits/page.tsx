import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { artworks } from "@/lib/data";
import Testimonials from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "Pet Memorial Portraits - Beautiful Tributes to Remember Your Pet",
  description:
    "Honor your beloved pet with a timeless memorial portrait. Beautiful custom art in 17 styles. From $9. 24-hour delivery. The perfect way to celebrate their memory.",
  keywords: [
    "pet memorial gift",
    "pet tribute portrait",
    "remembrance pet art",
    "pet loss gift",
    "dog memorial portrait",
    "cat memorial art",
    "pet bereavement gift",
    "rainbow bridge gift",
  ],
  openGraph: {
    title: "Pet Memorial Portraits - Beautiful Tributes",
    description:
      "Honor your beloved pet with a timeless memorial portrait. From $9.",
    images: ["/gallery/golden_retriever_ghibli.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pet Memorial Portraits - Beautiful Tributes",
    description: "A meaningful way to celebrate and remember your pet.",
    images: ["/gallery/golden_retriever_ghibli.png"],
  },
};

export default function MemorialPortraitsPage() {
  const featured = [artworks[0], artworks[3], artworks[1], artworks[7], artworks[13], artworks[8]];

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_rgba(201,169,110,0.12),_transparent)]" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto py-20">
          <p className="text-text-secondary text-[13px] tracking-[0.4em] uppercase mb-8 animate-slide-up">
            A Timeless Tribute
          </p>
          <h1
            className="text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-semibold tracking-tight leading-[0.95] mb-8 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            Remember Your Pet{" "}
            <span className="text-gradient">Forever.</span>
          </h1>
          <p
            className="text-text-secondary text-lg md:text-xl font-light max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            Transform your favorite photo into a beautiful memorial portrait. A heartfelt way to
            honor their memory and keep them close to your heart.
          </p>
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              href="/order?utm_source=google&utm_medium=cpc&utm_campaign=memorial-gift&utm_content=hero-cta"
              className="btn-glow px-10 py-4 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300"
            >
              Create Memorial Portrait
            </Link>
          </div>

          {/* Gentle stats */}
          <div
            className="flex items-center justify-center gap-8 mt-16 animate-slide-up"
            style={{ animationDelay: "500ms" }}
          >
            <div className="text-center">
              <div className="text-2xl font-semibold text-text-primary">17</div>
              <div className="text-xs text-text-secondary mt-1">Art Styles</div>
            </div>
            <div className="w-[1px] h-8 bg-white/[0.08]" />
            <div className="text-center">
              <div className="text-2xl font-semibold text-text-primary">24h</div>
              <div className="text-xs text-text-secondary mt-1">Delivery</div>
            </div>
            <div className="w-[1px] h-8 bg-white/[0.08]" />
            <div className="text-center">
              <div className="text-2xl font-semibold text-text-primary">Print Quality</div>
              <div className="text-xs text-text-secondary mt-1">4000×5000px</div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Why Memorial Portraits */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            A Beautiful Way to Remember
          </h2>
          <p className="text-center text-text-secondary text-lg mb-20 max-w-2xl mx-auto">
            When words aren't enough, art speaks. A memorial portrait transforms your favorite memory into something you can hold onto forever.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Celebrate Their Life",
                desc: "Not all tributes need to be somber. Choose from vibrant Ghibli scenes, regal Renaissance portraits, or cozy Needle Felt styles that capture their personality.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
              },
              {
                title: "Perfect for Gifting",
                desc: "The most thoughtful bereavement gift. Help a friend or family member honor their beloved companion with a personalized work of art.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                ),
              },
              {
                title: "Frame-Worthy Quality",
                desc: "Every portrait is delivered at 4000×5000px resolution—ready to print at any size. Display it proudly in your home as a lasting tribute.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

      {/* Memorial Styles */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              Choose a Style That Honors Them
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              From classical Renaissance elegance to whimsical Ghibli warmth, find the perfect artistic tribute.
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
            Creating Your Memorial
          </h2>
          <p className="text-center text-text-secondary text-lg mb-20 max-w-lg mx-auto">
            A simple, thoughtful process during a difficult time.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                num: "1",
                title: "Choose a Photo",
                desc: "Any photo works—even older ones with lower quality. We'll bring out the best in every image.",
              },
              {
                num: "2",
                title: "Select an Art Style",
                desc: "Pick a style that feels right. Elegant Renaissance? Warm Ghibli? Peaceful Watercolor? You decide.",
              },
              {
                num: "3",
                title: "Receive Your Portrait",
                desc: "We'll deliver a beautiful, high-resolution portrait within 24 hours. Print it, frame it, treasure it.",
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
            Stories from the Heart
          </h2>
          <p className="text-center text-text-secondary text-lg mb-16">
            How our memorial portraits have helped others honor their pets
          </p>
          <Testimonials />
        </div>
      </section>

      <div className="section-divider" />

      {/* Gift Options */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            The Perfect Sympathy Gift
          </h2>
          <p className="text-center text-text-secondary text-lg mb-16 max-w-2xl mx-auto">
            When a friend or loved one loses a pet, words often fall short. A memorial portrait is a deeply personal,
            meaningful way to show you care.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-bg-card p-8 border border-white/[0.06]">
              <h3 className="text-xl font-semibold mb-4">For Yourself</h3>
              <p className="text-text-secondary text-[15px] leading-relaxed mb-6">
                Create a lasting tribute to your beloved companion. Choose from 17 art styles and receive a
                print-ready portrait within 24 hours. Display it in your home as a beautiful reminder of the
                joy they brought to your life.
              </p>
              <Link
                href="/order?utm_source=google&utm_medium=cpc&utm_campaign=memorial-gift&utm_content=for-yourself"
                className="btn-glow inline-block px-6 py-3 rounded-full bg-gold text-bg text-[15px] font-medium hover:bg-gold-light transition-all duration-300 text-center"
              >
                Create Your Memorial
              </Link>
            </div>
            <div className="rounded-2xl bg-bg-card p-8 border border-white/[0.06]">
              <h3 className="text-xl font-semibold mb-4">As a Gift</h3>
              <p className="text-text-secondary text-[15px] leading-relaxed mb-6">
                The most thoughtful bereavement gift you can give. We'll transform a photo of their pet into
                a beautiful work of art. A gesture that says "I understand" and "They mattered" in a way
                that flowers and cards cannot.
              </p>
              <Link
                href="/order?utm_source=google&utm_medium=cpc&utm_campaign=memorial-gift&utm_content=as-gift"
                className="btn-glow inline-block px-6 py-3 rounded-full bg-gold text-bg text-[15px] font-medium hover:bg-gold-light transition-all duration-300 text-center"
              >
                Gift a Memorial
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Pricing */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Affordable, Meaningful Tributes
          </h2>
          <p className="text-text-secondary text-lg mb-16 max-w-md mx-auto">
            From $9. No subscriptions. No hidden fees. Just beautiful art.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { name: "Single Portrait", price: "$9", features: ["1 memorial portrait", "17 art styles", "4000×5000px resolution", "24-hour delivery", "3 free revisions"] },
              { name: "Memorial Collection", price: "$19", features: ["3 memorial portraits", "Different styles or poses", "4000×5000px resolution", "12-hour delivery", "Unlimited revisions"] },
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
                  href={`/order?tier=${tier.name.toLowerCase().replace(' ', '-')}&utm_source=google&utm_medium=cpc&utm_campaign=memorial-gift&utm_content=pricing-${tier.name.toLowerCase().replace(' ', '-')}`}
                  className="btn-glow inline-block w-full px-6 py-3.5 rounded-full bg-gold text-bg text-[15px] font-medium hover:bg-gold-light transition-all duration-300 text-center"
                >
                  Order Now
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
            A tribute as unique<br />
            <span className="text-gradient">as they were.</span>
          </h2>
          <p className="text-text-secondary text-lg mb-10 max-w-md mx-auto">
            Create a beautiful memorial portrait that celebrates their life and keeps their memory alive.
          </p>
          <Link
            href="/order?utm_source=google&utm_medium=cpc&utm_campaign=memorial-gift&utm_content=bottom-cta"
            className="btn-glow inline-block px-10 py-4 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300"
          >
            Create Memorial Portrait
          </Link>
        </div>
      </section>
    </>
  );
}
