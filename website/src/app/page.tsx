import Link from "next/link";
import { artworks } from "@/lib/data";
import GalleryGrid from "@/components/GalleryGrid";

export default function HomePage() {
  const featured = artworks.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_rgba(201,169,110,0.12),_transparent)]" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <p className="text-text-secondary text-[13px] tracking-[0.4em] uppercase mb-8 animate-slide-up">
            Pawcasso Atelier
          </p>
          <h1
            className="text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-semibold tracking-tight leading-[0.95] mb-8 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            Where Art Meets{" "}
            <span className="text-gradient">Animal.</span>
          </h1>
          <p
            className="text-text-secondary text-lg md:text-xl font-light max-w-xl mx-auto mb-12 leading-relaxed animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            Bespoke animal portraits crafted in the style of the masters.
          </p>
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              href="/order"
              className="btn-glow px-8 py-3.5 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300"
            >
              Order Your Portrait — $9
            </Link>
            <a
              href="https://instagram.com/pawcasso.atelier"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-full border border-white/[0.12] text-text-primary text-[15px] hover:border-white/[0.24] hover:bg-white/[0.04] transition-all duration-300 inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              Follow Us
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: "800ms" }}>
          <div className="w-[1px] h-12 bg-gradient-to-b from-gold/60 to-transparent" />
        </div>
      </section>

      <div className="section-divider" />

      {/* How It Works */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            Three simple steps.
          </h2>
          <p className="text-center text-text-secondary text-lg mb-20 max-w-lg mx-auto">
            Upload a photo, pick a style, get a masterpiece.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                num: "1",
                title: "Upload your photo",
                desc: "Send us your favorite photo of your pet. Any angle, any lighting — we make it work.",
              },
              {
                num: "2",
                title: "Choose a style",
                desc: "Renaissance, Baroque, Impressionist, Ghibli, Pop Art — 14 curated styles to choose from.",
              },
              {
                num: "3",
                title: "Receive your art",
                desc: "Get a stunning high-resolution digital portrait within 24 hours. Ready to print or share.",
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

      {/* Featured Gallery */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              Featured works.
            </h2>
            <p className="text-text-secondary text-lg">
              A selection from our growing collection.
            </p>
          </div>
          <GalleryGrid artworks={featured} />
          <div className="text-center mt-12">
            <Link
              href="/gallery"
              className="text-gold text-[15px] hover:text-gold-light transition-colors duration-300 inline-flex items-center gap-2"
            >
              View full gallery
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Testimonials */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Loved by pet owners.
          </h2>
          <p className="text-center text-text-secondary text-lg mb-20">
            Every portrait tells a story.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                quote:
                  "I commissioned a Renaissance portrait of our rescue lab, Duke. When the file arrived, my wife cried. It\u2019s now the centerpiece of our living room.",
                name: "Sarah K.",
                detail: "Golden Retriever \u2022 Renaissance",
              },
              {
                quote:
                  "We lost our tabby, Miso, last spring. Having her immortalized in an Impressionist style feels like she\u2019s still sitting in that sunbeam.",
                name: "James L.",
                detail: "Tabby Cat \u2022 Impressionist",
              },
              {
                quote:
                  "I ordered a Baroque portrait of my French Bulldog, Baguette, as a joke gift. It was so stunning we had it printed on canvas the same day.",
                name: "Priya M.",
                detail: "French Bulldog \u2022 Baroque",
              },
              {
                quote:
                  "The Ukiyo-e style for our black cat, Shadow, is my favorite. It looks like an authentic woodblock print from the Edo period.",
                name: "Mei T.",
                detail: "Black Cat \u2022 Ukiyo-e",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-2xl bg-bg-card p-8 hover:bg-bg-elevated transition-colors duration-300"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-text-primary text-[15px] leading-relaxed mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div>
                  <p className="text-text-primary text-sm font-medium">
                    {testimonial.name}
                  </p>
                  <p className="text-text-secondary text-xs mt-1">
                    {testimonial.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Pricing */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Just $9.
          </h2>
          <p className="text-text-secondary text-lg mb-16 max-w-md mx-auto">
            No subscriptions. No hidden fees. One portrait, one price.
          </p>
          <div className="max-w-sm mx-auto">
            <div className="rounded-2xl bg-bg-card p-10 text-center relative overflow-hidden">
              {/* Subtle top glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
              <div className="text-6xl font-semibold mb-2 text-gradient">$9</div>
              <p className="text-text-secondary text-sm mb-10">per portrait</p>
              <ul className="text-text-secondary text-[15px] space-y-4 mb-10 text-left">
                <li className="flex items-center gap-3">
                  <span className="text-gold text-sm">&#10003;</span>
                  <span>4000 x 5000px resolution</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-gold text-sm">&#10003;</span>
                  <span>14 art styles to choose from</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-gold text-sm">&#10003;</span>
                  <span>Delivered within 24 hours</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-gold text-sm">&#10003;</span>
                  <span>Unlimited revisions</span>
                </li>
              </ul>
              <Link
                href="/order"
                className="btn-glow inline-block w-full px-6 py-3.5 rounded-full bg-gold text-bg text-[15px] font-medium hover:bg-gold-light transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* FAQ */}
      <section className="py-32 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Questions?
          </h2>
          <p className="text-center text-text-secondary text-lg mb-16">
            Everything you need to know.
          </p>
          <div className="space-y-4">
            {[
              {
                q: "How does the process work?",
                a: "Upload your pet\u2019s photo, choose an art style, and we\u2019ll craft a bespoke portrait. You\u2019ll receive the finished work as a high-resolution digital file within 24 hours.",
              },
              {
                q: "What file do I receive?",
                a: "Every portrait is delivered as a high-resolution PNG at 4000\u00D75000 pixels \u2014 print-quality and ready to frame, share, or use however you like.",
              },
              {
                q: "Can you match a specific style?",
                a: "We offer 14 curated styles including Renaissance, Baroque, Impressionist, Ghibli, Ukiyo-e, Pop Art, and more. You can also send a reference image and we\u2019ll match it.",
              },
              {
                q: "What if I\u2019m not happy?",
                a: "We offer unlimited revisions and a full refund within 14 days \u2014 no questions asked. Your satisfaction is everything.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl bg-bg-card p-6 hover:bg-bg-elevated transition-colors duration-300"
              >
                <h3 className="text-text-primary text-[15px] font-medium mb-2">
                  {faq.q}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/faq"
              className="text-gold text-sm hover:text-gold-light transition-colors duration-300"
            >
              View all questions &rarr;
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 leading-tight">
            Ready to immortalize
            <br />
            <span className="text-gradient">your pet?</span>
          </h2>
          <p className="text-text-secondary text-lg mb-10 max-w-md mx-auto">
            Every portrait is a one-of-a-kind masterpiece.
          </p>
          <Link
            href="/order"
            className="btn-glow inline-block px-10 py-4 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300"
          >
            Commission a Portrait
          </Link>
        </div>
      </section>
    </>
  );
}
