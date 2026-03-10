import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Pawcasso Atelier",
  description: "The story behind Pawcasso Atelier — where every pet becomes a masterpiece. Bespoke animal portraits crafted in the tradition of the Old Masters.",
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
          <p className="text-text-secondary text-lg font-light">
            Where every pet becomes a masterpiece.
          </p>
          <div className="w-16 h-px bg-gold mx-auto mt-6" />
        </div>

        {/* Story */}
        <div className="space-y-8 text-text-secondary leading-relaxed">
          <p className="text-lg font-light">
            Pawcasso Atelier was born from a simple belief: every pet deserves to be immortalized
            as the masterpiece they truly are.
          </p>

          <p>
            We create bespoke animal portraits crafted in the tradition of the Old Masters.
            Each commission is a unique work of art, shaped by the personality and spirit
            of your beloved companion. From the curl of a whisker to the glint in their eye,
            every detail is rendered with the care and precision that fine portraiture demands.
          </p>

          <p>
            Our styles draw from centuries of artistic tradition -- the dramatic chiaroscuro
            of the Baroque period, the warm humanism of the Renaissance, the vibrant energy
            of Impressionism, the flowing elegance of Art Nouveau, and the serene beauty of
            Ukiyo-e. We also embrace the whimsical charm of modern illustration, including
            styles inspired by beloved animated worlds. Each portrait is a dialogue between
            timeless technique and the irreplaceable personality of your pet.
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
            It starts with your favorite photo. From there, our artists study your pet&apos;s
            unique features -- their expression, posture, and character -- and interpret them
            through the lens of your chosen artistic style. The result is a high-resolution
            portrait that looks like it belongs in a gallery.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
            {[
              { step: "01", title: "Share", desc: "Upload your favorite photo of your pet." },
              { step: "02", title: "Choose", desc: "Select from eight distinctive artistic styles." },
              { step: "03", title: "Receive", desc: "Your finished portrait, delivered within 48 hours." },
            ].map((item) => (
              <div key={item.step} className="text-center p-6 border border-border">
                <div className="text-gold text-2xl font-light mb-3">{item.step}</div>
                <h3 className="text-sm font-medium tracking-wide text-text-primary mb-2">{item.title}</h3>
                <p className="text-text-secondary text-xs">{item.desc}</p>
              </div>
            ))}
          </div>

          <p>
            Whether you choose our digital delivery or print-ready option, every portrait is delivered
            at museum-quality resolution. Our print-ready files are color-calibrated for professional
            printing, so your portrait looks stunning on canvas, paper, or any medium you choose.
          </p>

          <h2 className="text-2xl font-light text-text-primary tracking-wide pt-4">
            Our <span className="text-gold">Commitment</span>
          </h2>

          <p>
            We are a small, passionate atelier of artists who adore animals. Every portrait
            we create is a labor of love. We believe that the bond between humans and their
            pets is one of the most beautiful things in the world -- and it deserves to be
            celebrated in the finest artistic tradition.
          </p>

          <p>
            Quality is never compromised. If you are not completely delighted with your portrait,
            we will work with you until it is perfect. That is the Pawcasso promise.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center mt-16 pt-12 border-t border-border">
          <h3 className="text-2xl font-light tracking-wide mb-3">
            Commission Your <span className="text-gold">Masterpiece</span>
          </h3>
          <p className="text-text-secondary text-sm mb-6">
            Every portrait is one-of-a-kind, just like your pet.
          </p>
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
