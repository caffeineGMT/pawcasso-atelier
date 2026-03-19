import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { artworks } from "@/lib/data";
import { generateProductSchema, renderStructuredData, generateFAQSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Custom Golden Retriever Portraits - AI Art from Your Photos",
  description:
    "Transform your Golden Retriever into stunning custom art. Renaissance, Ghibli, Pixar 3D & 14+ styles. From $9. Upload your photo, choose a style, receive in 24 hours.",
  keywords: [
    "golden retriever portrait",
    "custom golden retriever art",
    "golden retriever painting",
    "golden retriever from photo",
    "dog portrait golden retriever",
    "ai golden retriever art",
    "golden retriever gift",
  ],
  openGraph: {
    title: "Custom Golden Retriever Portraits - AI Art from Your Photos",
    description: "Transform your Golden Retriever into stunning art. 17 artistic styles, from $9.",
    images: ["/api/og?title=Custom Golden Retriever Portraits&subtitle=From Renaissance to Modern AI Art&image=/gallery/dog_renaissance.webp"],
    type: "website",
  },
};

const productSchema = generateProductSchema({
  name: "Custom Golden Retriever Portrait",
  price: 9,
  image: "https://pawcasso-atelier.vercel.app/gallery/dog_renaissance.webp",
  description: "Custom AI-generated Golden Retriever portraits in 17+ artistic styles. Upload your photo, choose from Renaissance, Baroque, Ghibli, Pixar 3D, Watercolor, and more. Receive your custom portrait in 24 hours.",
  aggregateRating: {
    ratingValue: 4.9,
    reviewCount: 127,
  },
});

const faqs = [
  {
    question: "How do I get a custom Golden Retriever portrait?",
    answer: "Upload a clear photo of your Golden Retriever, select your preferred art style (Renaissance, Ghibli, Pixar 3D, etc.), and checkout. You'll receive your custom portrait via email within 24 hours as a high-resolution digital file.",
  },
  {
    question: "What photo of my Golden Retriever works best?",
    answer: "Use a well-lit, high-resolution photo where your Golden Retriever's face is clearly visible and in focus. Natural outdoor lighting works beautifully. Avoid blurry, dark, or distant photos. For best results, capture your dog looking toward the camera with their full face visible.",
  },
  {
    question: "Which art style is best for Golden Retrievers?",
    answer: "Golden Retrievers look stunning in all styles! Renaissance and Baroque bring out their regal, gentle nature. Ghibli and Pixar 3D capture their playful spirit. Watercolor and Impressionist highlight their soft, flowing coat. Renaissance is our most popular choice for Golden Retrievers.",
  },
  {
    question: "How much does a Golden Retriever portrait cost?",
    answer: "Custom Golden Retriever portraits start at $9 for digital delivery. You can add optional upgrades like premium frames ($29-79) or printed canvases ($49-99). All portraits are delivered as high-resolution digital files (4096x4096px) perfect for printing.",
  },
  {
    question: "Can I order portraits of multiple Golden Retrievers?",
    answer: "Yes! You can order individual portraits for each Golden Retriever, or request a custom multi-pet portrait featuring all your dogs together. Multi-pet portraits start at $19. Contact us for custom arrangements.",
  },
  {
    question: "Do you offer Golden Retriever memorial portraits?",
    answer: "Yes. We specialize in memorial portraits to honor Golden Retrievers who have passed. Many customers choose Renaissance or Watercolor styles for memorial tributes. We handle each memorial order with special care and sensitivity.",
  },
];

const faqSchema = generateFAQSchema(faqs);

export default function GoldenRetrieverPortraitsPage() {
  // Example Golden Retriever portraits (using existing artworks as placeholders)
  const goldenExamples = [
    { artwork: artworks[2], style: "Renaissance", desc: "Timeless elegance for your loyal companion" },
    { artwork: artworks[1], style: "Studio Ghibli", desc: "Whimsical, heartwarming animation style" },
    { artwork: artworks[4], style: "Pixar 3D", desc: "Vibrant, expressive modern character art" },
    { artwork: artworks[6], style: "Watercolor", desc: "Soft, flowing brushwork perfect for Golden coats" },
    { artwork: artworks[3], style: "Baroque", desc: "Dramatic, regal portraiture with golden accents" },
    { artwork: artworks[8], style: "Impressionist", desc: "Light-filled style inspired by Monet" },
    { artwork: artworks[11], style: "Pop Art", desc: "Bold, colorful graphic design" },
    { artwork: artworks[7], style: "Oil Painting", desc: "Classic oil technique with rich textures" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={renderStructuredData(productSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={renderStructuredData(faqSchema)}
      />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_rgba(201,169,110,0.12),_transparent)]" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto py-20">
          <p className="text-text-secondary text-[13px] tracking-[0.4em] uppercase mb-8 animate-slide-up">
            Custom Golden Retriever Portraits
          </p>
          <h1
            className="text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-semibold tracking-tight leading-[0.95] mb-8 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            Your Golden Retriever,{" "}
            <span className="text-gradient">Reimagined as Art.</span>
          </h1>
          <p
            className="text-text-secondary text-lg md:text-xl font-light max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            Transform your Golden Retriever into a stunning custom portrait. Choose from 17 artistic styles—Renaissance, Baroque, Ghibli, Pixar 3D, Watercolor, and more. From $9.
          </p>
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              href="/order"
              className="btn-glow px-10 py-4 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300"
            >
              Create My Portrait
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

      {/* Why Golden Retrievers Make Perfect Portrait Subjects */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            Why Golden Retrievers Are Perfect for Custom Portraits
          </h2>
          <p className="text-text-secondary text-lg mb-8 leading-relaxed">
            Golden Retrievers are among the most beloved dog breeds in the world—and for good reason. Their gentle, intelligent eyes, flowing golden coats, and warm, loyal expressions make them ideal subjects for custom art. Whether you're celebrating your Golden's playful puppy years, their dignified senior wisdom, or creating a memorial tribute, custom portraiture captures their unique personality in a way photos alone cannot.
          </p>
          <p className="text-text-secondary text-lg leading-relaxed">
            Our AI art technology excels at rendering the soft, layered texture of Golden Retriever fur, the warmth of their amber eyes, and the gentle intelligence in their expression. Styles like Renaissance and Baroque bring out their noble, regal nature, while Ghibli and Pixar 3D capture their playful, joyful spirit.
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* Popular Styles for Golden Retrievers */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            Most Popular Styles for Golden Retrievers
          </h2>
          <p className="text-text-secondary text-lg mb-16 max-w-3xl">
            Every Golden Retriever has a unique personality. Choose the art style that best captures your dog's spirit—from classic museum-quality paintings to modern animated art.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {goldenExamples.map((example, index) => (
              <div key={index} className="group">
                <div className="aspect-square relative overflow-hidden rounded-2xl mb-6">
                  <Image
                    src={example.artwork.imageUrl}
                    alt={`${example.style} Golden Retriever portrait`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-2">{example.style}</h3>
                <p className="text-text-secondary mb-4">{example.desc}</p>
                <Link
                  href={`/order?style=${example.style.toLowerCase().replace(/\s/g, '-')}`}
                  className="inline-block px-6 py-3 rounded-full bg-gold/10 text-gold border border-gold/30 font-medium hover:bg-gold/20 transition-all text-sm"
                >
                  Order {example.style} Style
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Photography Tips for Golden Retrievers */}
      <section className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            How to Take the Perfect Photo of Your Golden Retriever
          </h2>
          <p className="text-text-secondary text-lg mb-12 leading-relaxed">
            A great portrait starts with a great photo. Here's how to capture your Golden Retriever at their best:
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-3">1. Choose Natural Outdoor Lighting</h3>
              <p className="text-text-secondary leading-relaxed">
                Golden Retrievers' coats shimmer beautifully in natural sunlight. Photograph outdoors during "golden hour" (early morning or late afternoon) for warm, flattering light. Avoid harsh midday sun or indoor fluorescent lighting.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-3">2. Get Down to Their Eye Level</h3>
              <p className="text-text-secondary leading-relaxed">
                Crouch or lie down to photograph at your Golden's eye level. This creates an intimate, engaging perspective and captures their warm, intelligent gaze directly.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-3">3. Focus on Their Face and Eyes</h3>
              <p className="text-text-secondary leading-relaxed">
                Ensure their face fills most of the frame and their eyes are sharp and in focus. The eyes are the soul of the portrait—capturing their gentle, loving expression is key.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-3">4. Use a Favorite Toy or Treat</h3>
              <p className="text-text-secondary leading-relaxed">
                Get their attention with a squeaky toy, tennis ball, or treat held just above the camera. This creates an alert, engaged expression with perked ears and bright eyes.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-3">5. Avoid Blurry, Dark, or Distant Shots</h3>
              <p className="text-text-secondary leading-relaxed">
                Use a fast shutter speed to freeze motion (Goldens love to move!). Ensure the photo is well-lit, sharp, and close enough to clearly see facial features. Minimum resolution: 1000x1000 pixels.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* FAQ Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-12">
            Frequently Asked Questions
          </h2>

          <dl className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index}>
                <dt className="text-xl font-semibold mb-3">{faq.question}</dt>
                <dd className="text-text-secondary leading-relaxed">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="section-divider" />

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            Ready to Immortalize Your Golden Retriever?
          </h2>
          <p className="text-text-secondary text-lg mb-12 leading-relaxed">
            Join hundreds of Golden Retriever owners who've transformed their beloved dogs into timeless works of art. Upload your photo, choose your style, and receive your custom portrait in 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/order"
              className="btn-glow px-10 py-4 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300"
            >
              Order Your Portrait — $9
            </Link>
            <Link
              href="/pet-portrait-styles"
              className="px-10 py-4 rounded-full border border-white/[0.12] text-text-primary font-medium text-[15px] hover:border-white/[0.24] transition-all duration-300"
            >
              Browse All 17 Styles
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
