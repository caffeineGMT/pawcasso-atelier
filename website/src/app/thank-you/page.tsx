import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You | Pawcasso Atelier",
  description: "Your portrait is on its way. Thank you for your order.",
};

export default function ThankYouPage() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-gold/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
          Your masterpiece is <span className="text-gradient">on its way</span>.
        </h1>

        <p className="text-text-secondary text-lg leading-relaxed mb-4">
          Thank you for your order. Our artists are already studying your pet&apos;s unique character
          and will craft a portrait worthy of any gallery wall.
        </p>

        <p className="text-text-secondary text-sm mb-10">
          You&apos;ll receive your finished portrait via email within 24 hours.
          Keep an eye on your inbox.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/gallery"
            className="px-8 py-3 bg-white text-black font-medium tracking-wide text-sm rounded-full hover:bg-white/90 transition-all"
          >
            Browse the Gallery
          </Link>
          <a
            href="https://instagram.com/pawcasso.atelier"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-white/[0.06] border border-white/[0.08] text-text-primary text-sm tracking-wide rounded-full hover:bg-white/[0.1] transition-all"
          >
            Follow @pawcasso.atelier
          </a>
        </div>
      </div>
    </section>
  );
}
