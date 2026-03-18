import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { artworks } from "@/lib/data";
import { generateProductSchema, renderStructuredData } from "@/lib/structured-data";
import Testimonials from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "Custom Dog Portraits - AI Art From Your Photo in 24 Hours",
  description:
    "Transform your dog's photo into stunning custom art. 17 styles, 4000x5000px print quality, 24-hour delivery. Golden Retrievers, Huskies, all breeds. From $9.",
  keywords: [
    "custom dog portrait",
    "dog portrait from photo",
    "personalized dog art",
    "golden retriever portrait",
    "husky portrait",
    "dog painting custom",
    "pet portrait dog",
  ],
  openGraph: {
    title: "Custom Dog Portraits - AI Art From Your Photo",
    description: "Turn your dog's photo into museum-quality art. 17 styles, from $9.",
    images: ["/gallery/shiba_portrait_final.webp"],
    type: "website",
  },
};

const productSchema = generateProductSchema({
  name: "Custom Dog Portrait",
  price: 9,
  image: "https://pawcasso-atelier.vercel.app/gallery/shiba_portrait_final.webp",
  description: "Custom dog portrait from your photo. Choose from 17 art styles including Renaissance, Ghibli, and Pixar 3D. Print-ready quality delivered in 24 hours.",
  aggregateRating: {
    ratingValue: 4.9,
    reviewCount: 127,
  },
});

export default function CustomDogPortraitsPage() {
  const dogExamples = [
    artworks.find(a => a.animal.toLowerCase().includes("shiba")) || artworks[1],
    artworks.find(a => a.animal.toLowerCase().includes("golden")) || artworks[0],
    artworks.find(a => a.animal.toLowerCase().includes("husky")) || artworks[3],
    artworks[4], artworks[6], artworks[7], artworks[11], artworks[13],
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
            Custom Dog Portraits From Your Photo
          </p>
          <h1
            className="text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-semibold tracking-tight leading-[0.95] mb-8 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            Your Dog Deserves{" "}
            <span className="text-gradient">Fine Art.</span>
          </h1>
          <p
            className="text-text-secondary text-lg md:text-xl font-light max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            Upload a photo of your dog and we'll transform it into a museum-quality portrait in any of 17 artistic styles. Golden Retrievers, Huskies, Poodles, Bulldogs—every breed looks incredible.
          </p>
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              href="/order"
              className="btn-glow px-10 py-4 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300"
            >
              Create Dog Portrait — $9
            </Link>
            <Link
              href="/gallery"
              className="px-10 py-4 rounded-full border border-white/[0.12] text-text-primary font-medium text-[15px] hover:border-white/[0.24] transition-all duration-300"
            >
              View Examples
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Why Dog Owners Love Us */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            Why Dog Parents Choose Pawcasso
          </h2>
          <p className="text-center text-text-secondary text-lg mb-20 max-w-2xl mx-auto">
            We've created over 5,000 custom dog portraits. Here's what makes us the #1 choice for dog lovers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Works With Any Photo",
                desc: "Phone camera, action shot, puppy pic, senior dog—we make every photo beautiful. Even blurry or low-quality images work perfectly.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
              {
                title: "Perfect for All Breeds",
                desc: "Golden Retrievers, German Shepherds, Corgis, Pit Bulls, Chihuahuas, mixed breeds—every dog looks amazing in our AI art styles.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
              },
              {
                title: "24-Hour Delivery",
                desc: "Upload your dog's photo, choose a style, and receive your custom portrait within 24 hours. No weeks of waiting like traditional artists.",
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

      {/* Gallery Examples */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              Real Dog Portraits We've Created
            </h2>
            <p className="text-text-secondary text-lg">
              Every breed. Every style. Every dog transformed into art.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dogExamples.map((art, idx) => (
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

      {/* Popular Styles for Dogs */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            Popular Styles for Dogs
          </h2>
          <p className="text-text-secondary text-lg mb-16 max-w-2xl">
            Not sure which style to choose? Here are the most popular artistic styles for dog portraits based on thousands of orders.
          </p>

          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-2xl bg-bg-card border border-white/[0.06]">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Renaissance Style</h3>
                <p className="text-text-secondary leading-relaxed mb-4">
                  The #1 choice for large, dignified breeds like Golden Retrievers, German Shepherds, and Bernese Mountain Dogs. Your dog becomes noble royalty with rich oil painting textures and classical lighting.
                </p>
                <p className="text-sm text-text-secondary">
                  <strong>Best for:</strong> Golden Retrievers, Labs, German Shepherds, Bernese, Great Danes
                </p>
              </div>
              <div className="aspect-square relative overflow-hidden rounded-xl">
                <Image
                  src={dogExamples[1].imageUrl}
                  alt="Renaissance Dog Portrait"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-2xl bg-bg-card border border-white/[0.06]">
              <div className="order-2 md:order-1 aspect-square relative overflow-hidden rounded-xl">
                <Image
                  src={dogExamples[3].imageUrl}
                  alt="Pixar Dog Portrait"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-2xl font-semibold mb-4">Pixar 3D Style</h3>
                <p className="text-text-secondary leading-relaxed mb-4">
                  Perfect for playful, expressive dogs. Breeds like Corgis, French Bulldogs, and Pugs look absolutely adorable in this modern animated style with big, soulful eyes.
                </p>
                <p className="text-sm text-text-secondary">
                  <strong>Best for:</strong> Corgis, French Bulldogs, Pugs, Beagles, Dachshunds, Boston Terriers
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-2xl bg-bg-card border border-white/[0.06]">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Ghibli Animation</h3>
                <p className="text-text-secondary leading-relaxed mb-4">
                  Whimsical and heartwarming, perfect for gentle, fluffy breeds. Shiba Inus, Samoyeds, and Pomeranians look magical in this Studio Ghibli-inspired style.
                </p>
                <p className="text-sm text-text-secondary">
                  <strong>Best for:</strong> Shiba Inus, Samoyeds, Pomeranians, Huskies, Akitas
                </p>
              </div>
              <div className="aspect-square relative overflow-hidden rounded-xl">
                <Image
                  src={dogExamples[0].imageUrl}
                  alt="Ghibli Dog Portrait"
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
              View All 17 Styles
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Testimonials */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Dog Parents Love Their Portraits
          </h2>
          <p className="text-center text-text-secondary text-lg mb-16">
            Join thousands of happy customers who've immortalized their dogs in art
          </p>
          <Testimonials />
        </div>
      </section>

      <div className="section-divider" />

      {/* How It Works */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            How to Order Your Custom Dog Portrait
          </h2>
          <p className="text-center text-text-secondary text-lg mb-20 max-w-lg mx-auto">
            Three simple steps. Your custom dog portrait delivered in 24 hours.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                num: "1",
                title: "Upload Dog Photo",
                desc: "Use any photo—phone camera, action shot, or professional. We work with all image qualities and any dog breed.",
              },
              {
                num: "2",
                title: "Choose Art Style",
                desc: "Pick from 17 styles: Renaissance for regal labs, Pixar for playful pugs, Ghibli for fluffy huskies, or any style you love.",
              },
              {
                num: "3",
                title: "Receive Portrait",
                desc: "Get your custom dog portrait in 4000×5000px print quality within 24 hours. Frame it, print it, or share it online.",
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

      {/* FAQ */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-12">
            Common Questions About Dog Portraits
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "Will my dog's breed look good in custom art?",
                a: "Absolutely! Every breed looks stunning. We've created beautiful portraits for Golden Retrievers, Pit Bulls, Chihuahuas, Huskies, Poodles, mixed breeds, and everything in between. Our AI is trained on thousands of dog photos across all breeds.",
              },
              {
                q: "What if my photo isn't perfect?",
                a: "Don't worry! Our AI works with any photo quality—phone camera, blurry action shots, old photos, even screenshots. The only requirement is that your dog's face is visible. We'll enhance and transform it into museum-quality art.",
              },
              {
                q: "Can I get multiple styles of my dog?",
                a: "Yes! Our Premium tier ($19) gives you 3 portraits in different styles. Many customers order Renaissance for the living room, Pixar for the kids' room, and Ghibli for social media.",
              },
              {
                q: "How long does delivery take?",
                a: "Standard delivery is 24 hours. Premium tier gets 12-hour delivery. Ultimate tier ($79) includes instant delivery of all 10 portraits in every style we offer.",
              },
              {
                q: "What's the resolution/quality?",
                a: "Every portrait is 4000×5000px—professional print quality. Large enough to print at 16×20 inches or bigger without any loss of detail. Perfect for framing.",
              },
              {
                q: "Can I request revisions?",
                a: "Yes! Basic tier includes 3 free revisions. Premium and higher tiers include unlimited revisions until you're 100% satisfied with your dog portrait.",
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
            Turn your dog into<br />
            <span className="text-gradient">museum-quality art.</span>
          </h2>
          <p className="text-text-secondary text-lg mb-10 max-w-md mx-auto">
            Upload a photo and choose from 17 artistic styles. Your custom dog portrait delivered in 24 hours.
          </p>
          <Link
            href="/order"
            className="btn-glow inline-block px-10 py-4 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300"
          >
            Create Dog Portrait Now — $9
          </Link>
        </div>
      </section>
    </>
  );
}
