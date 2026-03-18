import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { artworks } from "@/lib/data";
import { generateProductSchema, renderStructuredData } from "@/lib/structured-data";
import Testimonials from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "Pet Portrait Gifts - Personalized Custom Art for Pet Lovers",
  description:
    "The perfect gift for pet lovers. Custom pet portraits in 17 art styles, delivered in 24 hours. Birthdays, holidays, memorials. From $9. Guaranteed smiles.",
  keywords: [
    "pet portrait gift",
    "gift for dog lover",
    "gift for cat owner",
    "personalized pet gift",
    "custom dog gift",
    "pet memorial gift",
    "birthday gift pet lover",
  ],
  openGraph: {
    title: "Pet Portrait Gifts - The Perfect Gift for Pet Lovers",
    description: "Custom pet portraits that make unforgettable gifts. From $9.",
    images: ["/gallery/golden_retriever_ghibli.png"],
    type: "website",
  },
};

const productSchema = generateProductSchema({
  name: "Custom Pet Portrait Gift",
  price: 9,
  image: "https://pawcasso-atelier.vercel.app/gallery/golden_retriever_ghibli.png",
  description: "The perfect personalized gift for pet lovers. Custom pet portrait in 17 artistic styles. 24-hour delivery, print-ready quality.",
  aggregateRating: {
    ratingValue: 4.9,
    reviewCount: 127,
  },
});

export default function PetPortraitGiftPage() {
  const giftExamples = [
    artworks[0], artworks[1], artworks[3], artworks[4],
    artworks[6], artworks[7], artworks[11], artworks[13],
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
            The Perfect Gift for Pet Lovers
          </p>
          <h1
            className="text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-semibold tracking-tight leading-[0.95] mb-8 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            Give the Gift of{" "}
            <span className="text-gradient">Art.</span>
          </h1>
          <p
            className="text-text-secondary text-lg md:text-xl font-light max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            A custom pet portrait is the most thoughtful, personal gift you can give. Whether it's a birthday, holiday, or memorial, nothing says "I understand what they mean to you" like transforming their beloved pet into fine art.
          </p>
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              href="/order"
              className="btn-glow px-10 py-4 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300"
            >
              Order Gift Portrait — $9
            </Link>
            <Link
              href="/gallery"
              className="px-10 py-4 rounded-full border border-white/[0.12] text-text-primary font-medium text-[15px] hover:border-white/[0.24] transition-all duration-300"
            >
              View Gift Examples
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Why Pet Portraits Make Great Gifts */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            Why Pet Portraits are the Perfect Gift
          </h2>
          <p className="text-center text-text-secondary text-lg mb-20 max-w-2xl mx-auto">
            Forget generic gifts. A custom pet portrait shows you truly know what matters to them.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Deeply Personal",
                desc: "Their pet is family. A custom portrait shows you understand that bond. It's not just a gift—it's validation of their love.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
              },
              {
                title: "Guaranteed Reaction",
                desc: "We've seen it hundreds of times: tears of joy, gasps of delight, immediate framing. Pet portrait gifts create unforgettable moments.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: "Lasts Forever",
                desc: "Unlike flowers or chocolates, a custom portrait becomes a treasured keepsake. It'll hang in their home for years, reminding them of your thoughtfulness.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
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

      {/* Gift Occasions */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-16">
            Perfect for Every Occasion
          </h2>

          <div className="space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-semibold mb-4">Birthdays</h3>
                <p className="text-text-secondary text-lg leading-relaxed mb-6">
                  Make their birthday unforgettable. A custom portrait of their dog or cat is the gift they didn't know they needed but will treasure forever. Pair it with a frame for extra impact.
                </p>
                <div className="space-y-3 mb-6">
                  <p className="flex items-start gap-3 text-text-secondary">
                    <span className="text-gold mt-1">✓</span>
                    <span>Popular choice: Pixar 3D style for fun, playful birthdays</span>
                  </p>
                  <p className="flex items-start gap-3 text-text-secondary">
                    <span className="text-gold mt-1">✓</span>
                    <span>Add gift message during checkout—we'll include it in delivery</span>
                  </p>
                  <p className="flex items-start gap-3 text-text-secondary">
                    <span className="text-gold mt-1">✓</span>
                    <span>Last-minute gift? 24-hour delivery means you're never late</span>
                  </p>
                </div>
              </div>
              <div className="aspect-square relative overflow-hidden rounded-2xl">
                <Image
                  src={giftExamples[3].imageUrl}
                  alt="Birthday Pet Portrait Gift"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1 aspect-square relative overflow-hidden rounded-2xl">
                <Image
                  src={giftExamples[0].imageUrl}
                  alt="Holiday Pet Portrait Gift"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-3xl font-semibold mb-4">Holidays & Christmas</h3>
                <p className="text-text-secondary text-lg leading-relaxed mb-6">
                  The gift that outshines everything under the tree. Pet parents will appreciate the thought you put into creating custom art of their fur baby. Renaissance or Ghibli styles are holiday favorites.
                </p>
                <div className="space-y-3 mb-6">
                  <p className="flex items-start gap-3 text-text-secondary">
                    <span className="text-gold mt-1">✓</span>
                    <span>Order early or use Premium tier for 12-hour delivery</span>
                  </p>
                  <p className="flex items-start gap-3 text-text-secondary">
                    <span className="text-gold mt-1">✓</span>
                    <span>Recipient can print at any size—perfect for framing and displaying</span>
                  </p>
                  <p className="flex items-start gap-3 text-text-secondary">
                    <span className="text-gold mt-1">✓</span>
                    <span>Digital delivery means no shipping delays during holidays</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-semibold mb-4">Memorial & Sympathy</h3>
                <p className="text-text-secondary text-lg leading-relaxed mb-6">
                  When a friend loses a beloved pet, a memorial portrait is the most meaningful sympathy gift. It honors the pet's memory and shows you truly understand their grief. Watercolor and Impressionist styles are especially gentle and beautiful.
                </p>
                <div className="space-y-3 mb-6">
                  <p className="flex items-start gap-3 text-text-secondary">
                    <span className="text-gold mt-1">✓</span>
                    <span>We handle memorial commissions with extra care and sensitivity</span>
                  </p>
                  <p className="flex items-start gap-3 text-text-secondary">
                    <span className="text-gold mt-1">✓</span>
                    <span>Beautiful tribute that celebrates their pet's life and personality</span>
                  </p>
                  <p className="flex items-start gap-3 text-text-secondary">
                    <span className="text-gold mt-1">✓</span>
                    <span>A lasting keepsake when words aren't enough</span>
                  </p>
                </div>
              </div>
              <div className="aspect-square relative overflow-hidden rounded-2xl">
                <Image
                  src={giftExamples[6].imageUrl}
                  alt="Memorial Pet Portrait Gift"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1 aspect-square relative overflow-hidden rounded-2xl">
                <Image
                  src={giftExamples[1].imageUrl}
                  alt="Just Because Pet Portrait Gift"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-3xl font-semibold mb-4">Just Because</h3>
                <p className="text-text-secondary text-lg leading-relaxed mb-6">
                  Sometimes the best gifts have no occasion. Surprise your pet-loving friend, family member, or significant other with a custom portrait of their furry companion. The unexpected joy is priceless.
                </p>
                <div className="space-y-3 mb-6">
                  <p className="flex items-start gap-3 text-text-secondary">
                    <span className="text-gold mt-1">✓</span>
                    <span>Thoughtful gesture that shows you're thinking of them</span>
                  </p>
                  <p className="flex items-start gap-3 text-text-secondary">
                    <span className="text-gold mt-1">✓</span>
                    <span>Perfect for celebrating pet adoption anniversaries</span>
                  </p>
                  <p className="flex items-start gap-3 text-text-secondary">
                    <span className="text-gold mt-1">✓</span>
                    <span>A random act of kindness they'll never forget</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Gallery */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              Gift-Worthy Pet Portraits
            </h2>
            <p className="text-text-secondary text-lg">
              Every style makes a stunning gift. Can't decide? Order 3 styles for $19.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {giftExamples.map((art, idx) => (
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

      {/* Testimonials */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Gift Recipients Love Them
          </h2>
          <p className="text-center text-text-secondary text-lg mb-16">
            "Best gift I've ever received" is something we hear often
          </p>
          <Testimonials />
        </div>
      </section>

      <div className="section-divider" />

      {/* How Gifting Works */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            How to Gift a Pet Portrait
          </h2>
          <p className="text-center text-text-secondary text-lg mb-20 max-w-lg mx-auto">
            Giving a custom pet portrait is simple—even if you don't have access to their pet's photo.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                num: "1",
                title: "Get the Photo",
                desc: "Ask them to send you a photo (say it's for a project), or sneak one from their social media. Even low-quality photos work perfectly.",
              },
              {
                num: "2",
                title: "Order & Choose Style",
                desc: "Upload the photo, select an art style that matches their taste, and checkout. Add a gift message during ordering if you'd like.",
              },
              {
                num: "3",
                title: "Deliver the Surprise",
                desc: "We'll deliver the high-res portrait to your email in 24 hours. You can print it, frame it, or send the digital file directly to them.",
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

      {/* Gift Packages */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Gift Package Pricing
          </h2>
          <p className="text-text-secondary text-lg mb-16 max-w-md mx-auto">
            Every budget. Every occasion. Every pet lover will be thrilled.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {[
              { name: "Thoughtful", price: "$9", features: ["1 portrait", "Any art style", "24-hour delivery", "4000×5000px quality", "3 revisions"] },
              { name: "Premium Gift", price: "$19", features: ["3 portraits", "3 different styles", "12-hour delivery", "4000×5000px quality", "Unlimited revisions"], badge: "Most Popular" },
              { name: "Ultimate Gift", price: "$79", features: ["10 portraits", "All 17 styles", "Instant delivery", "4000×5000px quality", "White-glove service"], badge: "Best Value" },
            ].map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl p-8 text-left relative overflow-hidden border ${
                  tier.badge ? "border-gold/30 bg-gold/5" : "border-white/[0.06] bg-bg-card"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gold text-bg text-xs font-semibold rounded-full">
                    {tier.badge}
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2 mt-2">{tier.name}</h3>
                <div className="text-4xl font-semibold mb-6 text-gradient">{tier.price}</div>
                <ul className="text-text-secondary text-sm space-y-3 mb-8">
                  {tier.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span className="text-gold text-sm">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/order?tier=${tier.name.toLowerCase().replace(' ', '-')}`}
                  className="btn-glow inline-block w-full px-6 py-3.5 rounded-full bg-gold text-bg text-[15px] font-medium hover:bg-gold-light transition-all duration-300 text-center"
                >
                  Order Gift
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
            Give a gift they'll<br />
            <span className="text-gradient">treasure forever.</span>
          </h2>
          <p className="text-text-secondary text-lg mb-10 max-w-md mx-auto">
            A custom pet portrait shows you truly understand what matters to them. Order now for 24-hour delivery.
          </p>
          <Link
            href="/order"
            className="btn-glow inline-block px-10 py-4 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300"
          >
            Order Perfect Gift — From $9
          </Link>
        </div>
      </section>
    </>
  );
}
