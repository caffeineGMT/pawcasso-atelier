"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const showcaseItems = [
  {
    image: "/gallery/optimized/cat_vermeer-1200w.webp",
    style: "Renaissance",
    title: "Cat with a Pearl Earring",
    blurDataURL: "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADQAQCdASoKAAoABUB8JYwC7ADbZ1kkAAD+7QkpkVuT3lgmTaNWj+2IydCqzydCvrypV9HFE3h8QbgAAAA="
  },
  {
    image: "/gallery/optimized/alfie_portrait_final-1200w.webp",
    style: "Pixar 3D",
    title: "Big Eyes",
    blurDataURL: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADwAQCdASoKAAoABUB8JYwC7AELXa/4NlAA+yLqtt/qE81h/gVP2sZ4qcwWUTEZRLViiIaCSpw30fq8lhMK2AiGKCYGAy29BvMAl6AA"
  },
  {
    image: "/gallery/optimized/alfie_imperial_portrait_2048x2048-1200w.webp",
    style: "Chinese Classical",
    title: "Imperial Portrait",
    blurDataURL: "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADwAQCdASoKAAoABUB8JagCdADdlhAo4QAA/dI+LjzdTboE5IJ8fh7nBsxc1udLhR9K4wmO6ib9qZUAAAA="
  },
  {
    image: "/gallery/optimized/border_collie_portrait_2048x2048-1200w.webp",
    style: "Needle Felt",
    title: "Felt Family Portrait",
    blurDataURL: "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADwAQCdASoKAAkABUB8JYwC7AD8J1QcxCAA9ysGwsVNmj8okquEpfWz4xg81dvfStr1O3XWXj+YiMj6QkAAAA=="
  },
  {
    image: "/gallery/optimized/golden_retriever_portrait_square-1200w.webp",
    style: "Pixar 3D",
    title: "Happy Chonk",
    blurDataURL: "data:image/webp;base64,UklGRnwAAABXRUJQVlA4WAoAAAAQAAAACQAACQAAQUxQSB0AAAABL3D//4iICQbStilTMC9lCu7f2BVE9D+mXoD+AQBWUDggOAAAAPABAJ0BKgoACgAFQHwlkAJ0AQtdr3uQAAD+6JIaI87CxSO1kr4CNHd3CIOdKMwio8gpBgcT1kAA"
  },
  {
    image: "/gallery/optimized/shiba_inu_vinyl_toy_portrait_final-1200w.webp",
    style: "Vinyl Toy",
    title: "Arms Crossed",
    blurDataURL: "data:image/webp;base64,UklGRoIAAABXRUJQVlA4WAoAAAAQAAAACQAACQAAQUxQSB8AAAABF6AQQADE37nRiIgYoaBtG6YXYscfziBE9D9uJfAHAFZQOCA8AAAA8AEAnQEqCgAKAAVAfCWQAnQBDw/9OUAAAP7rhXL5kybxcgsRwse4ZpYtulDOIRn7JaD6a2j//vFPVEQA"
  },
  {
    image: "/gallery/optimized/pomeranian_portrait_final-1200w.webp",
    style: "Needle Felt",
    title: "Cloud Puff",
    blurDataURL: "data:image/webp;base64,UklGRnIAAABXRUJQVlA4WAoAAAAQAAAACQAACQAAQUxQSBgAAAABH9D/iAgoaNuG6YVYjT+bQYjof9wq4A9WUDggNAAAAPABAJ0BKgoACgAFQHwljAJ0ALyEPbVHgAD8+2qRaIqmoy1LboTmtgGpI3faruvXPyAAAAA="
  },
  {
    image: "/gallery/optimized/chihuahua_portrait_16x9-1200w.webp",
    style: "Pixel Art",
    title: "Perler Bead Pup",
    blurDataURL: "data:image/webp;base64,UklGRm4AAABXRUJQVlA4WAoAAAAQAAAACQAABQAAQUxQSBkAAAABH9D/iAgoaNuG6RvEqvzJDENE/2M9Ac96AFZQOCAuAAAAkAEAnQEqCgAGAAVAfCWkAALHpVQAAP7rgQZYhcK0UmSjJ77mO0WEJULupsAAAA=="
  },
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
                quality={85}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                placeholder="blur"
                blurDataURL={item.blurDataURL}
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
