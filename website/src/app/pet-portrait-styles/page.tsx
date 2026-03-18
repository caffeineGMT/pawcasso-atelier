import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { artworks } from "@/lib/data";
import { generateProductSchema, renderStructuredData } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "17 Pet Portrait Styles - From Renaissance to Modern AI Art",
  description:
    "Explore 17 unique pet portrait art styles. Renaissance, Baroque, Ghibli, Pixar 3D, Watercolor & more. Find the perfect style for your dog or cat. From $9.",
  keywords: [
    "pet portrait styles",
    "dog portrait art styles",
    "cat portrait styles",
    "renaissance pet portrait",
    "modern pet art",
    "artistic pet portrait",
    "pet painting styles",
  ],
  openGraph: {
    title: "17 Pet Portrait Styles - Renaissance to Modern AI Art",
    description: "Explore all artistic styles for your custom pet portrait. From $9.",
    images: ["/gallery/cat_vermeer.png"],
    type: "website",
  },
};

const productSchema = generateProductSchema({
  name: "Custom Pet Portrait - Multiple Art Styles",
  price: 9,
  image: "https://pawcasso-atelier.vercel.app/gallery/cat_vermeer.png",
  description: "Choose from 17 artistic styles including Renaissance, Baroque, Ghibli, Pixar 3D, and Watercolor. Custom pet portraits starting at $9.",
  aggregateRating: {
    ratingValue: 4.9,
    reviewCount: 127,
  },
});

export default function PetPortraitStylesPage() {
  const styleExamples = [
    { artwork: artworks[0], style: "Renaissance", desc: "Classical oil painting with rich colors and dramatic lighting" },
    { artwork: artworks[1], style: "Ghibli", desc: "Whimsical Studio Ghibli animation style with soft, dreamy aesthetics" },
    { artwork: artworks[3], style: "Baroque", desc: "Dramatic, ornate style with deep shadows and golden accents" },
    { artwork: artworks[4], style: "Pixar 3D", desc: "Modern 3D animated character style with vibrant, expressive features" },
    { artwork: artworks[6], style: "Watercolor", desc: "Soft, flowing watercolor with delicate brushwork and pastel tones" },
    { artwork: artworks[7], style: "Oil Painting", desc: "Traditional oil painting technique with textured brushstrokes" },
    { artwork: artworks[8], style: "Impressionist", desc: "Light-filled impressionist style inspired by Monet and Renoir" },
    { artwork: artworks[11], style: "Pop Art", desc: "Bold, colorful pop art with high contrast and graphic elements" },
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
            17 Artistic Styles to Choose From
          </p>
          <h1
            className="text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-semibold tracking-tight leading-[0.95] mb-8 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            Every Portrait Style{" "}
            <span className="text-gradient">Imaginable.</span>
          </h1>
          <p
            className="text-text-secondary text-lg md:text-xl font-light max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            From timeless Renaissance masterpieces to modern Pixar 3D animations. Choose the perfect artistic style to capture your pet's unique personality.
          </p>
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              href="/order"
              className="btn-glow px-10 py-4 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300"
            >
              Browse All 17 Styles
            </Link>
            <Link
              href="/gallery"
              className="px-10 py-4 rounded-full border border-white/[0.12] text-text-primary font-medium text-[15px] hover:border-white/[0.24] transition-all duration-300"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Classic Styles */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            Classic & Traditional Styles
          </h2>
          <p className="text-text-secondary text-lg mb-16 max-w-2xl">
            Timeless artistic styles inspired by the Old Masters. Perfect for formal, elegant pet portraits that belong in a museum.
          </p>

          <div className="space-y-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="aspect-square relative overflow-hidden rounded-2xl">
                <Image
                  src={styleExamples[0].artwork.imageUrl}
                  alt={styleExamples[0].style}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div>
                <h3 className="text-3xl font-semibold mb-4">{styleExamples[0].style}</h3>
                <p className="text-text-secondary text-lg leading-relaxed mb-6">
                  The Renaissance style brings museum-quality elegance to your pet portrait. Inspired by masters like Leonardo da Vinci and Raphael, this style features rich, warm colors, masterful use of light and shadow (chiaroscuro), and a regal, timeless quality. Your pet becomes a noble subject worthy of the Uffizi Gallery.
                </p>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Perfect for: Dogs and cats with dignified expressions, formal portraits, classical home decor, gift-giving to art collectors.
                </p>
                <Link
                  href="/order?style=renaissance"
                  className="inline-block px-6 py-3 rounded-full bg-gold/10 text-gold border border-gold/30 font-medium hover:bg-gold/20 transition-all"
                >
                  Order Renaissance Style
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h3 className="text-3xl font-semibold mb-4">{styleExamples[2].style}</h3>
                <p className="text-text-secondary text-lg leading-relaxed mb-6">
                  Baroque portraiture elevates drama to an art form. Think Rembrandt and Caravaggio—deep shadows, golden highlights, ornate details, and theatrical lighting. This style transforms your pet into royalty, complete with dramatic flair and emotional intensity.
                </p>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Perfect for: Pets with striking features, dramatic personalities, luxurious home interiors, statement pieces.
                </p>
                <Link
                  href="/order?style=baroque"
                  className="inline-block px-6 py-3 rounded-full bg-gold/10 text-gold border border-gold/30 font-medium hover:bg-gold/20 transition-all"
                >
                  Order Baroque Style
                </Link>
              </div>
              <div className="aspect-square relative overflow-hidden rounded-2xl order-1 md:order-2">
                <Image
                  src={styleExamples[2].artwork.imageUrl}
                  alt={styleExamples[2].style}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="aspect-square relative overflow-hidden rounded-2xl">
                <Image
                  src={styleExamples[6].artwork.imageUrl}
                  alt={styleExamples[6].style}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div>
                <h3 className="text-3xl font-semibold mb-4">{styleExamples[6].style}</h3>
                <p className="text-text-secondary text-lg leading-relaxed mb-6">
                  Impressionism captures fleeting moments and emotions through visible brushstrokes and vibrant light. Inspired by Monet, Renoir, and Degas, this style emphasizes movement, atmosphere, and natural beauty. Your pet appears as if caught in a perfect moment of sunlit serenity.
                </p>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Perfect for: Outdoor scenes, playful moments, bright and airy spaces, romantic aesthetics.
                </p>
                <Link
                  href="/order?style=impressionist"
                  className="inline-block px-6 py-3 rounded-full bg-gold/10 text-gold border border-gold/30 font-medium hover:bg-gold/20 transition-all"
                >
                  Order Impressionist Style
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Modern & Animated Styles */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            Modern & Animated Styles
          </h2>
          <p className="text-text-secondary text-lg mb-16 max-w-2xl">
            Contemporary artistic styles perfect for playful, vibrant, and expressive pet portraits that pop with personality.
          </p>

          <div className="space-y-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="aspect-square relative overflow-hidden rounded-2xl">
                <Image
                  src={styleExamples[1].artwork.imageUrl}
                  alt={styleExamples[1].style}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div>
                <h3 className="text-3xl font-semibold mb-4">Studio Ghibli</h3>
                <p className="text-text-secondary text-lg leading-relaxed mb-6">
                  Bring the enchanting magic of Hayao Miyazaki's Studio Ghibli films to your pet portrait. This beloved animation style features soft watercolor backgrounds, expressive character design, and a whimsical, heartwarming aesthetic that captures pure joy and innocence.
                </p>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Perfect for: Cats, small dogs, playful personalities, nursery decor, anime fans, cozy aesthetics.
                </p>
                <Link
                  href="/order?style=ghibli"
                  className="inline-block px-6 py-3 rounded-full bg-gold/10 text-gold border border-gold/30 font-medium hover:bg-gold/20 transition-all"
                >
                  Order Ghibli Style
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h3 className="text-3xl font-semibold mb-4">Pixar 3D Animation</h3>
                <p className="text-text-secondary text-lg leading-relaxed mb-6">
                  Transform your pet into a Pixar character straight out of Up, Toy Story, or Inside Out. This modern 3D animation style features vibrant colors, expressive eyes, smooth shading, and that signature Pixar charm that makes every character instantly lovable.
                </p>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Perfect for: All pets, children's rooms, fun personalities, modern homes, social media sharing.
                </p>
                <Link
                  href="/order?style=pixar"
                  className="inline-block px-6 py-3 rounded-full bg-gold/10 text-gold border border-gold/30 font-medium hover:bg-gold/20 transition-all"
                >
                  Order Pixar 3D Style
                </Link>
              </div>
              <div className="aspect-square relative overflow-hidden rounded-2xl order-1 md:order-2">
                <Image
                  src={styleExamples[3].artwork.imageUrl}
                  alt={styleExamples[3].style}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="aspect-square relative overflow-hidden rounded-2xl">
                <Image
                  src={styleExamples[7].artwork.imageUrl}
                  alt={styleExamples[7].style}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div>
                <h3 className="text-3xl font-semibold mb-4">Pop Art</h3>
                <p className="text-text-secondary text-lg leading-relaxed mb-6">
                  Bold, bright, and impossible to ignore. Pop Art style brings Andy Warhol and Roy Lichtenstein energy to your pet portrait. High contrast colors, graphic elements, comic book aesthetics, and contemporary cool factor combine for a statement piece that demands attention.
                </p>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Perfect for: Modern interiors, vibrant personalities, eclectic decor, younger pet parents, Instagram-worthy art.
                </p>
                <Link
                  href="/order?style=pop-art"
                  className="inline-block px-6 py-3 rounded-full bg-gold/10 text-gold border border-gold/30 font-medium hover:bg-gold/20 transition-all"
                >
                  Order Pop Art Style
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* All Styles Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            All 17 Styles at a Glance
          </h2>
          <p className="text-center text-text-secondary text-lg mb-16">
            Can't decide? Order our Premium tier and get 3 styles for just $19.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {styleExamples.map((example, idx) => (
              <div
                key={idx}
                className="group rounded-2xl overflow-hidden bg-bg-card border border-white/[0.06] hover:border-gold/30 transition-all"
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={example.artwork.imageUrl}
                    alt={example.style}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-base font-semibold">{example.style}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/order"
              className="inline-block btn-glow px-10 py-4 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300"
            >
              Order Your Portrait Now
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* How to Choose */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            How to Choose the Perfect Style
          </h2>
          <p className="text-text-secondary text-lg mb-12">
            Not sure which artistic style suits your pet best? Here's our guide to finding the perfect match.
          </p>

          <div className="space-y-8">
            <div className="p-8 rounded-2xl bg-bg-card border border-white/[0.06]">
              <h3 className="text-2xl font-semibold mb-4">Consider Your Pet's Personality</h3>
              <ul className="space-y-3 text-text-secondary leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-gold mt-1">•</span>
                  <span><strong>Dignified & Regal:</strong> Renaissance, Baroque, Oil Painting</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold mt-1">•</span>
                  <span><strong>Playful & Energetic:</strong> Pixar 3D, Ghibli, Pop Art</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold mt-1">•</span>
                  <span><strong>Gentle & Sweet:</strong> Watercolor, Impressionist, Pastel</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold mt-1">•</span>
                  <span><strong>Bold & Confident:</strong> Pop Art, Graphic Novel, Abstract</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-bg-card border border-white/[0.06]">
              <h3 className="text-2xl font-semibold mb-4">Match Your Home Decor</h3>
              <ul className="space-y-3 text-text-secondary leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-gold mt-1">•</span>
                  <span><strong>Traditional/Classic Interiors:</strong> Renaissance, Baroque, Oil Painting, Impressionist</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold mt-1">•</span>
                  <span><strong>Modern/Contemporary:</strong> Pop Art, Abstract, Graphic, Minimalist Line Art</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold mt-1">•</span>
                  <span><strong>Farmhouse/Rustic:</strong> Watercolor, Impressionist, Sketch</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold mt-1">•</span>
                  <span><strong>Eclectic/Playful:</strong> Ghibli, Pixar, Pop Art, Mixed Media</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-bg-card border border-white/[0.06]">
              <h3 className="text-2xl font-semibold mb-4">Think About the Occasion</h3>
              <ul className="space-y-3 text-text-secondary leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-gold mt-1">•</span>
                  <span><strong>Formal Gift:</strong> Renaissance, Baroque, Classical Oil</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold mt-1">•</span>
                  <span><strong>Birthday/Celebration:</strong> Pixar 3D, Ghibli, Pop Art</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold mt-1">•</span>
                  <span><strong>Memorial/Tribute:</strong> Watercolor, Impressionist, Soft Pastel</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold mt-1">•</span>
                  <span><strong>Social Media Sharing:</strong> Pop Art, Pixar, Ghibli, Bold Graphics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 leading-tight">
            17 styles. Infinite<br />
            <span className="text-gradient">possibilities.</span>
          </h2>
          <p className="text-text-secondary text-lg mb-10 max-w-md mx-auto">
            Choose the perfect artistic style for your pet. Can't decide? Order multiple styles starting at just $19.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/order"
              className="btn-glow inline-block px-10 py-4 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300"
            >
              Start Your Portrait
            </Link>
            <Link
              href="/gallery"
              className="inline-block px-10 py-4 rounded-full border border-white/[0.12] text-text-primary font-medium text-[15px] hover:border-white/[0.24] transition-all duration-300"
            >
              Browse Full Gallery
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
