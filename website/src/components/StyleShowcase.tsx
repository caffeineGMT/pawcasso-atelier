"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const showcaseItems = [
  { image: "/gallery/lion_portrait.png", style: "Baroque", title: "Sovereign Light" },
  { image: "/gallery/golden_retriever_ghibli.png", style: "Ghibli", title: "Moonlit Garden" },
  { image: "/gallery/the_catrix_poster.png", style: "Cyberpunk", title: "The Catrix" },
  { image: "/gallery/corgi_needle_felt.png", style: "Needle Felt", title: "Woolly Wanderer" },
  { image: "/gallery/starry_night_persian_cat.png", style: "Impressionist", title: "Starry Night Whiskers" },
  { image: "/gallery/the_great_catsby_poster.png", style: "Art Deco", title: "The Great Catsby" },
  { image: "/gallery/hedgehog_bookshop_tree_trunk.png", style: "Watercolor", title: "The Little Bookshop" },
  { image: "/gallery/red_panda_pixar_chef.png", style: "Pixar 3D", title: "Chef\u2019s Kiss" },
];

export default function StyleShowcase() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % showcaseItems.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-bg-card">
          {showcaseItems.map((item, i) => (
            <div
              key={item.title}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {/* Style selector */}
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
            One pet, <span className="text-gradient">endless styles.</span>
          </h2>
          <p className="text-text-secondary text-sm mb-8 leading-relaxed">
            From Renaissance oil paintings to Pixar 3D characters — pick the style that captures your pet&apos;s personality.
          </p>
          <div className="space-y-2">
            {showcaseItems.map((item, i) => (
              <button
                key={item.title}
                onClick={() => setActive(i)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                  i === active
                    ? "bg-white/[0.08] border border-gold/30"
                    : "bg-transparent border border-transparent hover:bg-white/[0.04]"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  i === active ? "bg-gold" : "bg-white/20"
                }`} />
                <div>
                  <span className="text-sm font-medium text-text-primary">{item.style}</span>
                  <span className="text-xs text-text-secondary ml-2">{item.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
