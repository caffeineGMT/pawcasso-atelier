import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Links | Pawcasso Atelier",
  description: "All links from Pawcasso Atelier — order portraits, browse the gallery, and follow us.",
};

const links = [
  {
    title: "Order a Portrait — $9",
    href: "/order",
    icon: "🎨",
    highlight: true,
  },
  {
    title: "Browse the Gallery",
    href: "/gallery",
    icon: "🖼️",
    highlight: false,
  },
  {
    title: "About the Atelier",
    href: "/about",
    icon: "✨",
    highlight: false,
  },
  {
    title: "Frequently Asked Questions",
    href: "/faq",
    icon: "❓",
    highlight: false,
  },
  {
    title: "Follow on TikTok",
    href: "https://tiktok.com/@pawcasso.atelier",
    icon: "🎵",
    highlight: false,
    external: true,
  },
];

export default function LinksPage() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm">
        {/* Profile */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 ring-2 ring-gold/30 ring-offset-2 ring-offset-black">
            <Image
              src="/gallery/lion_portrait.png"
              alt="Pawcasso Atelier"
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          </div>
          <h1 className="text-lg font-semibold tracking-[0.15em] text-gradient">PAWCASSO</h1>
          <p className="text-text-secondary text-xs mt-1">Bespoke animal portraits in 19 art styles</p>
        </div>

        {/* Links */}
        <div className="space-y-3">
          {links.map((link) => {
            const Component = link.external ? "a" : Link;
            const extraProps = link.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {};

            return (
              <Component
                key={link.title}
                href={link.href}
                {...(extraProps as Record<string, string>)}
                className={`block w-full px-6 py-4 rounded-2xl text-center text-sm font-medium transition-all duration-300 ${
                  link.highlight
                    ? "bg-gold text-black hover:bg-gold-light"
                    : "bg-white/[0.06] border border-white/[0.08] text-text-primary hover:bg-white/[0.1] hover:border-white/[0.16]"
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.title}
              </Component>
            );
          })}
        </div>

        {/* Footer */}
        <p className="text-center text-white/20 text-[10px] mt-10">
          pawcasso-atelier.vercel.app
        </p>
      </div>
    </section>
  );
}
