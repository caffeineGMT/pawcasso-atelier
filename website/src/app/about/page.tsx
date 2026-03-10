import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Pawcasso Atelier",
  description: "The story behind Pawcasso Atelier — where AI meets artistry to create stunning pet portraits.",
};

export default function AboutPage() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">
            About <span className="text-gold">Pawcasso</span>
          </h1>
          <div className="w-16 h-px bg-gold mx-auto" />
        </div>

        {/* Story */}
        <div className="space-y-8 text-text-secondary leading-relaxed">
          <p className="text-lg font-light">
            Pawcasso Atelier was born from a simple belief: every pet deserves to be immortalized
            as the masterpiece they truly are.
          </p>

          <p>
            We combine the power of cutting-edge AI with classical artistic traditions to create
            portraits that feel both timeless and deeply personal. Each portrait goes through a
            careful creative process -- from the initial AI generation to hand-guided refinements
            that ensure every whisker, feather, and fur pattern is captured with artistic precision.
          </p>

          <p>
            Our styles draw from the great masters -- the dramatic chiaroscuro of the Baroque period,
            the warm humanism of the Renaissance, the vibrant energy of Impressionism, and beyond.
            But we are not just copying the past. We are creating something entirely new: a bridge
            between classical art and the beloved companions who share our lives.
          </p>

          <div className="border-l-2 border-gold pl-6 py-2 my-12">
            <p className="text-xl font-light text-text-primary italic">
              &ldquo;Every pet has a personality that deserves to be seen as art.&rdquo;
            </p>
          </div>

          <h2 className="text-2xl font-light text-text-primary tracking-wide pt-4">
            Our <span className="text-gold">Process</span>
          </h2>

          <p>
            It starts with your favorite photo. From there, our AI engine analyzes your pet&apos;s unique
            features -- their expression, posture, and character -- and interprets them through the
            lens of your chosen artistic style. The result is a high-resolution portrait that looks
            like it belongs in a gallery.
          </p>

          <p>
            Whether you choose our digital delivery or print-ready option, every portrait is delivered
            at museum-quality resolution. Our print-ready files are color-calibrated for professional
            printing, so your portrait looks stunning on canvas, paper, or any medium you choose.
          </p>

          <h2 className="text-2xl font-light text-text-primary tracking-wide pt-4">
            Made with <span className="text-gold">Love</span>
          </h2>

          <p>
            We are a small, passionate team of artists and technologists who adore animals.
            Every portrait we create is a labor of love. We believe that the bond between
            humans and their pets is one of the most beautiful things in the world -- and it
            deserves to be celebrated.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center mt-16 pt-12 border-t border-border">
          <h3 className="text-2xl font-light tracking-wide mb-4">
            Ready to get started?
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/order"
              className="px-8 py-3 bg-gold text-bg font-medium tracking-wider text-sm hover:bg-gold-light transition-colors"
            >
              Order a Portrait
            </Link>
            <a
              href="https://instagram.com/pawcasso.atelier"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-gold/40 text-gold text-sm tracking-wider hover:bg-gold/10 transition-colors"
            >
              Follow on Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
