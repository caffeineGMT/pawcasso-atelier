import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Pawcasso Atelier",
  description: "The story behind Pawcasso Atelier — where every pet becomes a masterpiece.",
};

export default function AboutPage() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-6">
            About <span className="text-gradient">Pawcasso</span>
          </h1>
          <p className="text-text-secondary text-lg">
            Where every pet becomes a masterpiece.
          </p>
        </div>

        {/* Story */}
        <div className="space-y-8 text-text-secondary leading-relaxed">
          <p className="text-xl font-light text-text-primary">
            Pawcasso Atelier was born from a simple belief: every pet deserves to be immortalized
            as the masterpiece they truly are.
          </p>

          <p>
            We create bespoke animal portraits crafted in the tradition of the Old Masters.
            Each commission is a unique work of art, shaped by the personality and spirit
            of your beloved companion. From the curl of a whisker to the glint in their eye,
            every detail is rendered with care and precision.
          </p>

          <p>
            Our styles span centuries of artistic tradition — the dramatic chiaroscuro
            of the Baroque, the warm humanism of the Renaissance, the vibrant energy
            of Impressionism, the flowing elegance of Art Nouveau, and more. We also embrace
            modern aesthetics like Pixar-style 3D characters and cozy needle-felt textures.
          </p>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 my-12">
            <p className="text-2xl font-light text-text-primary text-center italic">
              &ldquo;Every pet has a personality that deserves to be seen as art.&rdquo;
            </p>
          </div>

          <h2 className="text-3xl font-semibold text-text-primary tracking-tight pt-4">
            Our <span className="text-gradient">Process</span>
          </h2>

          <p>
            It starts with your favorite photo. From there, we study your pet&apos;s
            unique features — their expression, posture, and character — and interpret them
            through the lens of your chosen artistic style.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-10">
            {[
              { step: "01", title: "Share", desc: "Upload your favorite photo of your pet." },
              { step: "02", title: "Choose", desc: "Select from 16 distinctive artistic styles." },
              { step: "03", title: "Receive", desc: "Your finished portrait, delivered within 24 hours." },
            ].map((item) => (
              <div key={item.step} className="text-center p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
                <div className="text-gradient text-3xl font-semibold mb-3">{item.step}</div>
                <h3 className="text-sm font-medium tracking-wide text-text-primary mb-2">{item.title}</h3>
                <p className="text-text-secondary text-xs">{item.desc}</p>
              </div>
            ))}
          </div>

          <p>
            Every portrait is delivered at museum-quality resolution (4000x5000px) — large enough
            for professional prints up to 13x17 inches at 300 DPI.
          </p>

          <h2 className="text-3xl font-semibold text-text-primary tracking-tight pt-4">
            Our <span className="text-gradient">Promise</span>
          </h2>

          <p>
            Quality is never compromised. If you are not completely delighted with your portrait,
            we will work with you until it is perfect. That is the Pawcasso promise.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <div className="section-divider mb-16" />
          <h3 className="text-3xl font-semibold tracking-tight mb-4">
            Commission your <span className="text-gradient">masterpiece</span>.
          </h3>
          <p className="text-text-secondary text-sm mb-8">
            Every portrait is one-of-a-kind, just like your pet.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/order"
              className="px-8 py-3 bg-white text-black font-medium tracking-wide text-sm rounded-full hover:bg-white/90 transition-all"
            >
              Order a Portrait — $9
            </Link>
            <a
              href="https://instagram.com/pawcasso.atelier"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white/[0.06] border border-white/[0.08] text-text-primary text-sm tracking-wide rounded-full hover:bg-white/[0.1] transition-all"
            >
              Follow on Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
