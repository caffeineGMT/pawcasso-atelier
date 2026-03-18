import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { artworks } from "@/lib/data";
import { generateProductSchema, renderStructuredData } from "@/lib/structured-data";
import Testimonials from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "Custom Cat Portraits - Transform Your Cat Photo Into Art",
  description:
    "Custom cat portraits from your photo in 17 artistic styles. Persian, Tabby, Siamese, all breeds. 4000x5000px print quality, 24-hour delivery. From $9.",
  keywords: [
    "custom cat portrait",
    "cat portrait from photo",
    "personalized cat art",
    "tabby cat portrait",
    "persian cat art",
    "cat painting custom",
    "pet portrait cat",
  ],
  openGraph: {
    title: "Custom Cat Portraits - Your Cat as Fine Art",
    description: "Turn your cat's photo into stunning art. 17 styles, from $9.",
    images: ["/gallery/cat_vermeer.png"],
    type: "website",
  },
};

const productSchema = generateProductSchema({
  name: "Custom Cat Portrait",
  price: 9,
  image: "https://pawcasso-atelier.vercel.app/gallery/cat_vermeer.png",
  description: "Custom cat portrait from your photo. Choose from 17 art styles. Print-ready 4000x5000px quality delivered in 24 hours. Perfect for all cat breeds.",
  aggregateRating: {
    ratingValue: 4.9,
    reviewCount: 127,
  },
});

export default function CustomCatPortraitsPage() {
  const catExamples = [
    artworks.find(a => a.animal.toLowerCase().includes("cat")) || artworks[0],
    artworks[2], artworks[5], artworks[8], artworks[9], artworks[10], artworks[12], artworks[14],
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={renderStructuredData(productSchema)}
      />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_rgba(201,169,110,0.12),_transparent)]" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto py-20">
          <p className="text-text-secondary text-[13px] tracking-[0.4em] uppercase mb-8 animate-slide-up">
            Custom Cat Portraits From Your Photo
          </p>
          <h1
            className="text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-semibold tracking-tight leading-[0.95] mb-8 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            Your Cat,{" "}
            <span className="text-gradient">Immortalized.</span>
          </h1>
          <p
            className="text-text-secondary text-lg md:text-xl font-light max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            Transform your cat's photo into a stunning custom portrait in any of 17 artistic styles. Tabbies, Persians, Siamese, Maine Coons—every cat becomes a masterpiece.
          </p>
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              href="/order"
              className="btn-glow px-10 py-4 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300"
            >
              Create Cat Portrait — $9
            </Link>
            <Link
              href="/gallery"
              className="px-10 py-4 rounded-full border border-white/[0.12] text-text-primary font-medium text-[15px] hover:border-white/[0.24] transition-all duration-300"
            >
              View Cat Gallery
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Why Cat Owners Love Us */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            The Purrfect Cat Portrait Service
          </h2>
          <p className="text-center text-text-secondary text-lg mb-20 max-w-2xl mx-auto">
            Over 3,000 custom cat portraits created. Here's why cat parents choose Pawcasso Atelier.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Captures Their Personality",
                desc: "Sassy, elegant, playful, or regal—our AI captures your cat's unique character. Every whisker, every expression, perfectly rendered in your chosen art style.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: "Perfect for All Cat Breeds",
                desc: "Persians, Maine Coons, Siamese, Ragdolls, British Shorthairs, Tabbies, black cats, orange cats, calicos—every cat looks stunning.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                ),
              },
              {
                title: "Fast 24-Hour Delivery",
                desc: "Upload your cat's photo, choose a style, receive your custom portrait within 24 hours. No long waits like commissioned art.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
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

      {/* Gallery Examples */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              Real Cat Portraits We've Created
            </h2>
            <p className="text-text-secondary text-lg">
              From elegant Persians to playful Tabbies—every cat transformed into art.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {catExamples.map((art, idx) => (
              <div
                key={idx}
                className="group rounded-2xl overflow-hidden bg-bg-card border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={art.imageUrl}
                    alt={art.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-medium text-text-primary mb-1">{art.title}</h3>
                  <p className="text-sm text-text-secondary">{art.style}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Popular Styles for Cats */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            Best Art Styles for Cats
          </h2>
          <p className="text-text-secondary text-lg mb-16 max-w-2xl">
            Based on thousands of cat portraits, these are the most popular artistic styles that perfectly capture feline grace and personality.
          </p>

          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-2xl bg-bg-card border border-white/[0.06]">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Renaissance Style</h3>
                <p className="text-text-secondary leading-relaxed mb-4">
                  The perfect style for elegant, regal cats. Persians, British Shorthairs, and Ragdolls look absolutely majestic in this classical oil painting style with rich colors and dramatic lighting.
                </p>
                <p className="text-sm text-text-secondary mb-4">
                  <strong>Best for:</strong> Persian, British Shorthair, Ragdoll, Maine Coon, Norwegian Forest Cat
                </p>
                <Link
                  href="/order?style=renaissance"
                  className="inline-block px-6 py-3 rounded-full bg-gold/10 text-gold border border-gold/30 font-medium hover:bg-gold/20 transition-all"
                >
                  Order Renaissance Style
                </Link>
              </div>
              <div className="aspect-square relative overflow-hidden rounded-xl">
                <Image
                  src={catExamples[0].imageUrl}
                  alt="Renaissance Cat Portrait"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-2xl bg-bg-card border border-white/[0.06]">
              <div className="order-2 md:order-1 aspect-square relative overflow-hidden rounded-xl">
                <Image
                  src={catExamples[1].imageUrl}
                  alt="Ghibli Cat Portrait"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-2xl font-semibold mb-4">Studio Ghibli Style</h3>
                <p className="text-text-secondary leading-relaxed mb-4">
                  Whimsical and enchanting, perfect for playful cats. This beloved animation style makes your cat look like they walked out of a Hayao Miyazaki film. Absolutely magical for kittens and young cats.
                </p>
                <p className="text-sm text-text-secondary mb-4">
                  <strong>Best for:</strong> Kittens, Siamese, Tabbies, Calicos, playful personalities
                </p>
                <Link
                  href="/order?style=ghibli"
                  className="inline-block px-6 py-3 rounded-full bg-gold/10 text-gold border border-gold/30 font-medium hover:bg-gold/20 transition-all"
                >
                  Order Ghibli Style
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-2xl bg-bg-card border border-white/[0.06]">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Watercolor Style</h3>
                <p className="text-text-secondary leading-relaxed mb-4">
                  Soft, delicate, and utterly elegant. Watercolor portraits capture the gentle grace of cats with flowing brushstrokes and pastel tones. Perfect for creating a serene, artistic atmosphere.
                </p>
                <p className="text-sm text-text-secondary mb-4">
                  <strong>Best for:</strong> White cats, long-haired breeds, gentle personalities, memorial portraits
                </p>
                <Link
                  href="/order?style=watercolor"
                  className="inline-block px-6 py-3 rounded-full bg-gold/10 text-gold border border-gold/30 font-medium hover:bg-gold/20 transition-all"
                >
                  Order Watercolor Style
                </Link>
              </div>
              <div className="aspect-square relative overflow-hidden rounded-xl">
                <Image
                  src={catExamples[4].imageUrl}
                  alt="Watercolor Cat Portrait"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/pet-portrait-styles"
              className="inline-block px-8 py-3 rounded-full border border-white/[0.12] text-text-primary font-medium hover:border-white/[0.24] transition-all"
            >
              Explore All 17 Styles
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Testimonials */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Cat Parents Love Their Portraits
          </h2>
          <p className="text-center text-text-secondary text-lg mb-16">
            Thousands of happy cat owners have transformed their feline friends into art
          </p>
          <Testimonials />
        </div>
      </section>

      <div className="section-divider" />

      {/* Cat Photography Tips */}
      <section className="py-32 px-6 bg-bg-card/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            Tips for Taking Great Cat Photos
          </h2>
          <p className="text-text-secondary text-lg mb-12">
            While we can work with any photo, these tips help you capture your cat's best side for an even more stunning portrait.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Eye Level Shots Work Best",
                tip: "Get down to your cat's eye level for the most engaging portraits. Eye contact with the camera creates connection.",
              },
              {
                title: "Natural Light is Your Friend",
                tip: "Position your cat near a window for soft, flattering natural light. Avoid harsh overhead lights or direct flash.",
              },
              {
                title: "Capture Their Personality",
                tip: "Is your cat playful? Regal? Sleepy? Capture them in their natural state. Personality shines through in portraits.",
              },
              {
                title: "Don't Worry About Perfection",
                tip: "Slightly blurry? Old photo? Phone camera? We'll make it beautiful. The only requirement: visible face and eyes.",
              },
              {
                title: "Action Shots Can Work",
                tip: "Mid-play or mid-yawn photos can create dynamic, personality-filled portraits. Don't be afraid to use them!",
              },
              {
                title: "Multiple Angles Welcome",
                tip: "Upload 2-3 photos when ordering. We'll choose the best one or combine elements from multiple shots.",
              },
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-bg border border-white/[0.06]">
                <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{item.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* FAQ */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-12">
            Cat Portrait Questions Answered
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "Will my cat's coloring be accurate?",
                a: "Yes! Our AI preserves your cat's unique coloring—tabby stripes, calico patterns, tortoiseshell markings, solid blacks, orange tabbies, white Persians—all colors and patterns are accurately captured in your chosen art style.",
              },
              {
                q: "What if my cat won't sit still for photos?",
                a: "No problem! We work with action shots, sleeping cats, even blurry photos. As long as we can see your cat's face, we'll create a beautiful portrait. Most customers use existing photos rather than staged shots.",
              },
              {
                q: "Can I order portraits of multiple cats?",
                a: "Absolutely! You can order individual portraits of each cat, or request a custom multi-cat portrait featuring all your feline friends together in one artistic piece. Contact us for multi-cat options.",
              },
              {
                q: "Which style is best for black cats?",
                a: "Black cats look stunning in all styles, but Renaissance and Baroque are particularly gorgeous—dramatic lighting brings out their features beautifully. Ghibli and Pixar styles also work wonderfully for expressive black cats.",
              },
              {
                q: "Do you offer memorial cat portraits?",
                a: "Yes. Many customers create memorial portraits to honor beloved cats who've crossed the rainbow bridge. Watercolor and Renaissance styles are especially popular for memorial art. We handle these commissions with extra care.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-bg-card border border-white/[0.06]">
                <h3 className="text-lg font-semibold mb-3">{faq.q}</h3>
                <p className="text-text-secondary leading-relaxed">{faq.a}</p>
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
            Your cat deserves<br />
            <span className="text-gradient">to be immortalized.</span>
          </h2>
          <p className="text-text-secondary text-lg mb-10 max-w-md mx-auto">
            Upload a photo and transform your feline friend into a stunning work of art. 17 styles to choose from.
          </p>
          <Link
            href="/order"
            className="btn-glow inline-block px-10 py-4 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300"
          >
            Create Cat Portrait Now — $9
          </Link>
        </div>
      </section>
    </>
  );
}
