import Link from "next/link";
import { artworks } from "@/lib/data";
import GalleryGrid from "@/components/GalleryGrid";

export default function HomePage() {
  const featured = artworks.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,169,110,0.08)_0%,_transparent_70%)]" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-6 animate-slide-up">
            Pawcasso Atelier
          </p>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
            Where Art Meets
            <span className="block text-gold mt-2">Animal</span>
          </h1>
          <p className="text-text-secondary text-lg md:text-xl font-light max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "200ms" }}>
            Bespoke animal portraits crafted in the style of the masters.
            Renaissance, Baroque, Impressionist, and beyond.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "300ms" }}>
            <Link
              href="/order"
              className="px-8 py-3 bg-gold text-bg font-medium tracking-wider text-sm hover:bg-gold-light transition-colors"
            >
              Order Your Portrait
            </Link>
            <a
              href="https://instagram.com/pawcasso.atelier"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-gold/40 text-gold text-sm tracking-wider hover:bg-gold/10 transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              @pawcasso.atelier
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-3xl font-light tracking-wide mb-16">
            How It <span className="text-gold">Works</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Upload", desc: "Send us your favorite photo of your pet." },
              { step: "02", title: "Choose a Style", desc: "Pick from Renaissance, Baroque, Impressionist, and more." },
              { step: "03", title: "Receive Art", desc: "Get your portrait as a high-res digital file or print-ready." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-gold text-4xl font-light mb-4">{item.step}</div>
                <h3 className="text-lg font-light tracking-wide mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gallery */}
      <section className="py-24 px-6 bg-bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-light tracking-wide">
              Featured <span className="text-gold">Works</span>
            </h2>
            <Link
              href="/gallery"
              className="text-gold text-sm tracking-wider hover:text-gold-light transition-colors"
            >
              View All &rarr;
            </Link>
          </div>
          <GalleryGrid artworks={featured} />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-3xl font-light tracking-wide mb-4">
            From Our <span className="text-gold">Collectors</span>
          </h2>
          <p className="text-center text-text-secondary text-sm mb-16">
            Every portrait tells a story. Here are a few of theirs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote:
                  "I commissioned a Renaissance portrait of our rescue lab, Duke. When the file arrived, my wife cried. It\u2019s now the centerpiece of our living room.",
                name: "Sarah K.",
                detail: "Golden Retriever \u2022 Renaissance",
              },
              {
                quote:
                  "We lost our tabby, Miso, last spring. Having her immortalized in an Impressionist style feels like she\u2019s still sitting in that sunbeam. Absolutely beautiful work.",
                name: "James L.",
                detail: "Tabby Cat \u2022 Impressionist",
              },
              {
                quote:
                  "I ordered a Baroque portrait of my French Bulldog, Baguette, as a joke gift for my partner. It was so stunning we had it printed on canvas the same day.",
                name: "Priya M.",
                detail: "French Bulldog \u2022 Baroque",
              },
              {
                quote:
                  "The Art Nouveau portrait of our cockatiel, Lemon, captured her personality perfectly \u2014 regal and a little ridiculous. The detail in the feathers is extraordinary.",
                name: "Daniel R.",
                detail: "Cockatiel \u2022 Art Nouveau",
              },
              {
                quote:
                  "I\u2019ve ordered three portraits now \u2014 one for each of our cats. The Ukiyo-e style for our black cat, Shadow, is my favorite. It looks like a woodblock print from the Edo period.",
                name: "Mei T.",
                detail: "Black Cat \u2022 Ukiyo-e",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="border border-border p-8 hover:border-gold/30 transition-colors"
              >
                <div className="text-gold text-2xl mb-4">&ldquo;</div>
                <p className="text-text-secondary text-sm leading-relaxed mb-6">
                  {testimonial.quote}
                </p>
                <div>
                  <p className="text-text-primary text-sm font-medium">
                    {testimonial.name}
                  </p>
                  <p className="text-gold/70 text-xs tracking-wider mt-1">
                    {testimonial.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-light tracking-wide mb-4">
            Simple <span className="text-gold">Pricing</span>
          </h2>
          <p className="text-text-secondary mb-12">No hidden fees. No subscriptions. Just art.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="border border-border p-8 hover:border-gold/40 transition-colors">
              <h3 className="text-gold text-sm tracking-widest uppercase mb-4">Digital</h3>
              <div className="text-4xl font-light mb-2">$29</div>
              <p className="text-text-secondary text-sm mb-6">High-resolution digital file (4000x5000px)</p>
              <Link
                href="/order"
                className="inline-block px-6 py-2 border border-gold/40 text-gold text-sm tracking-wider hover:bg-gold/10 transition-colors"
              >
                Get Started
              </Link>
            </div>
            <div className="border border-gold/40 p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-bg text-xs tracking-wider px-3 py-1">
                POPULAR
              </div>
              <h3 className="text-gold text-sm tracking-widest uppercase mb-4">Print-Ready</h3>
              <div className="text-4xl font-light mb-2">$79</div>
              <p className="text-text-secondary text-sm mb-6">Print-ready file, color-calibrated (300 DPI)</p>
              <Link
                href="/order"
                className="inline-block px-6 py-2 bg-gold text-bg text-sm font-medium tracking-wider hover:bg-gold-light transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-24 px-6 bg-bg-card">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center text-3xl font-light tracking-wide mb-4">
            Common <span className="text-gold">Questions</span>
          </h2>
          <p className="text-center text-text-secondary text-sm mb-16">
            Everything you need to know before commissioning your portrait.
          </p>
          <div className="space-y-6">
            {[
              {
                q: "How does the process work?",
                a: "You upload your favorite photo of your pet, select an artistic style, and our atelier takes it from there. Our artists study your pet\u2019s features, expression, and personality, then craft a bespoke portrait in your chosen tradition. You\u2019ll receive the finished work as a high-resolution digital file.",
              },
              {
                q: "What file formats do I receive?",
                a: "Every portrait is delivered as a high-resolution PNG file at 4000\u00D75000 pixels. Our Print-Ready tier includes an additional color-calibrated file at 300 DPI, optimized for professional printing on canvas, fine art paper, or any medium of your choice.",
              },
              {
                q: "How long does it take?",
                a: "Most portraits are completed and delivered within 24\u201348 hours of your order. During peak seasons, delivery may take up to 72 hours. We\u2019ll notify you by email as soon as your portrait is ready.",
              },
              {
                q: "Can you match a specific art style?",
                a: "We offer eight curated styles \u2014 Renaissance, Baroque, Impressionist, Art Nouveau, Ukiyo-e, Pop Art, Ghibli-inspired, and Royal Portrait. Each has been refined to produce stunning results. If you have a particular reference in mind, include it with your order and we\u2019ll do our best to honor the vision.",
              },
              {
                q: "Do you offer refunds?",
                a: "Your satisfaction is our highest priority. If you\u2019re not delighted with your portrait, contact us within 14 days and we\u2019ll either revise the piece or issue a full refund \u2014 no questions asked.",
              },
              {
                q: "Can I get a physical print?",
                a: "We deliver digital files rather than physical prints, which gives you complete control over the size, medium, and framing. Our Print-Ready tier files are calibrated for professional print shops and produce gallery-quality results on canvas, metal, acrylic, or fine art paper.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="border border-border p-6 hover:border-gold/30 transition-colors"
              >
                <h3 className="text-text-primary text-sm font-medium tracking-wide mb-3">
                  {faq.q}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/faq"
              className="text-gold text-sm tracking-wider hover:text-gold-light transition-colors"
            >
              View All Questions &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-bg-card border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-6">
            Ready to immortalize your pet?
          </h2>
          <p className="text-text-secondary mb-8">
            Every portrait is a one-of-a-kind masterpiece. Order yours today.
          </p>
          <Link
            href="/order"
            className="inline-block px-10 py-4 bg-gold text-bg font-medium tracking-wider text-sm hover:bg-gold-light transition-colors"
          >
            Commission a Portrait
          </Link>
        </div>
      </section>
    </>
  );
}
