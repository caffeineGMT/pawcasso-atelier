'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import { captureUTMParams } from '@/lib/utm-tracker';
import { trackTikTokEvent } from '@/lib/tiktok-pixel';

const transformations = [
  {
    id: 'golden-renaissance',
    before: '/gallery/originals/golden_retriever_phone.svg',
    after: '/gallery/golden_retriever_portrait_square.webp',
    breed: 'Golden Retriever',
    style: 'Renaissance',
    caption: '"I literally gasped" — @sarahpetmom',
  },
  {
    id: 'shiba-felt',
    before: '/gallery/originals/shiba_inu_phone.svg',
    after: '/gallery/shiba_inu_felt_portrait_2048x2048.webp',
    breed: 'Shiba Inu',
    style: 'Needle Felt',
    caption: '"My new phone wallpaper forever" — @shibalovers',
  },
  {
    id: 'pomeranian-imperial',
    before: '/gallery/originals/pomeranian_phone.svg',
    after: '/gallery/pomeranian_portrait_final.webp',
    breed: 'Pomeranian',
    style: 'Imperial',
    caption: '"Best $9 I ever spent" — @fluffycloud_pom',
  },
];

const socialProof = [
  { stat: '50K+', label: 'Portraits Created' },
  { stat: '$9', label: 'Starting Price' },
  { stat: '60s', label: 'Delivery Time' },
  { stat: '4.9/5', label: 'Customer Rating' },
];

const styles = [
  { name: 'Renaissance', emoji: '🎨' },
  { name: 'Ghibli', emoji: '🌸' },
  { name: 'Pixar 3D', emoji: '🧸' },
  { name: 'Needle Felt', emoji: '🧵' },
  { name: 'Ink Wash', emoji: '🖤' },
  { name: 'Pixel Art', emoji: '👾' },
  { name: 'Vinyl Toy', emoji: '🎲' },
  { name: 'Baroque', emoji: '👑' },
];

export default function TikTokLandingPage() {
  const [activeTransformation, setActiveTransformation] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 47, seconds: 33 });

  useEffect(() => {
    captureUTMParams();
    trackTikTokEvent('ViewContent', {
      content_type: 'product',
      content_id: 'tiktok_landing',
      value: 9,
      currency: 'USD',
    });
  }, []);

  // Countdown timer for urgency
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        if (totalSeconds <= 0) {
          return { hours: 2, minutes: 59, seconds: 59 };
        }
        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOrderClick = () => {
    trackTikTokEvent('InitiateCheckout', {
      content_type: 'product',
      content_id: 'pet_portrait',
      value: 9,
      currency: 'USD',
    });
  };

  const current = transformations[activeTransformation];

  return (
    <div className="min-h-screen bg-black">
      {/* TikTok-style sticky CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-white/10 px-4 py-3 safe-area-bottom">
        <Link
          href="/order?utm_source=tiktok&utm_medium=bio&utm_campaign=viral_loop"
          onClick={handleOrderClick}
          className="block w-full max-w-lg mx-auto bg-gold text-black font-semibold text-center py-4 rounded-full text-[15px] hover:bg-gold-light transition-all duration-300 btn-glow"
        >
          Get Your Portrait — $9
        </Link>
        <p className="text-center text-white/40 text-[10px] mt-1.5">
          Free delivery in 60 seconds
        </p>
      </div>

      {/* Hero section */}
      <section className="pt-8 pb-6 px-4">
        <div className="max-w-lg mx-auto text-center">
          {/* Profile header */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gold/40">
              <Image
                src="/gallery/cat_vermeer.webp"
                alt="Pawcasso Atelier"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="text-left">
              <h1 className="text-sm font-semibold text-white flex items-center gap-1">
                Pawcasso Atelier
                <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </h1>
              <p className="text-xs text-white/50">@pawcasso.atelier</p>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
            Your pet deserves to be{' '}
            <span className="text-gradient">a masterpiece</span>
          </h2>
          <p className="text-white/60 text-sm mb-4">
            Upload a phone photo. Get a museum-quality AI portrait in 60 seconds.
          </p>

          {/* Urgency banner */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-xs font-medium">
              TikTok Special: First portrait FREE — ends in{' '}
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </section>

      {/* Before/After showcase */}
      <section className="px-4 pb-8">
        <div className="max-w-lg mx-auto">
          <BeforeAfterSlider
            beforeSrc={current.before}
            afterSrc={current.after}
            beforeAlt={`${current.breed} phone photo`}
            afterAlt={`${current.breed} ${current.style} portrait`}
          />

          {/* Transformation caption */}
          <p className="text-center text-white/50 text-sm mt-3 italic">
            {current.caption}
          </p>

          {/* Transformation selector */}
          <div className="flex gap-2 mt-4 justify-center">
            {transformations.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActiveTransformation(i)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  i === activeTransformation
                    ? 'bg-gold text-black'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {t.breed}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof stats */}
      <section className="px-4 pb-8">
        <div className="max-w-lg mx-auto grid grid-cols-4 gap-2">
          {socialProof.map((item) => (
            <div key={item.label} className="text-center p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <div className="text-gold font-bold text-lg">{item.stat}</div>
              <div className="text-white/40 text-[10px] mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* The hook — price comparison */}
      <section className="px-4 pb-8">
        <div className="max-w-lg mx-auto">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
            <h3 className="text-center text-white font-semibold mb-4">
              Custom Pet Portrait vs. Pawcasso
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400 line-through">$500</div>
                <div className="text-white/40 text-xs mt-1">Traditional artist</div>
                <div className="text-white/30 text-[10px] mt-2">2-4 weeks wait</div>
                <div className="text-white/30 text-[10px]">Limited revisions</div>
              </div>
              <div className="text-center relative">
                <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-[10px] font-medium">
                  98% OFF
                </div>
                <div className="text-2xl font-bold text-gold">$9</div>
                <div className="text-white/40 text-xs mt-1">Pawcasso AI</div>
                <div className="text-white/30 text-[10px] mt-2">60 second delivery</div>
                <div className="text-white/30 text-[10px]">16+ art styles</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Art styles carousel */}
      <section className="px-4 pb-8">
        <div className="max-w-lg mx-auto">
          <h3 className="text-center text-white/80 text-sm font-medium mb-4">
            Choose from 16+ art styles
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {styles.map((style) => (
              <div
                key={style.name}
                className="flex-shrink-0 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-center"
              >
                <div className="text-lg mb-0.5">{style.emoji}</div>
                <div className="text-white/60 text-[10px] whitespace-nowrap">{style.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 pb-8">
        <div className="max-w-lg mx-auto">
          <h3 className="text-center text-white/80 text-sm font-medium mb-4">
            How it works
          </h3>
          <div className="space-y-3">
            {[
              { step: '1', title: 'Upload your pet photo', desc: 'Any phone photo works' },
              { step: '2', title: 'Choose an art style', desc: 'Renaissance, Ghibli, Pixar 3D...' },
              { step: '3', title: 'Download your masterpiece', desc: 'High-res, print-ready in 60s' },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-sm flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <div className="text-white text-sm font-medium">{item.title}</div>
                  <div className="text-white/40 text-xs">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TikTok testimonials */}
      <section className="px-4 pb-8">
        <div className="max-w-lg mx-auto">
          <h3 className="text-center text-white/80 text-sm font-medium mb-4">
            What TikTok is saying
          </h3>
          <div className="space-y-3">
            {[
              { user: '@goldendoodlemom', text: 'I cannot believe this is $9. My friends think I paid hundreds for a commissioned painting.', likes: '12.4K' },
              { user: '@catladyjen', text: "Made one for my cat who passed last year. I\u0027m not crying, you\u0027re crying.", likes: '45.2K' },
              { user: '@huskyking_', text: 'POV: you discover Pawcasso and suddenly every pet owner in your life is getting one for Christmas', likes: '8.7K' },
            ].map((review) => (
              <div key={review.user} className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-xs font-medium">{review.user}</span>
                  <span className="text-white/30 text-[10px]">{review.likes} likes</span>
                </div>
                <p className="text-white/50 text-sm leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More links */}
      <section className="px-4 pb-32">
        <div className="max-w-lg mx-auto space-y-2">
          <Link
            href="/gallery?utm_source=tiktok&utm_medium=bio"
            className="block w-full px-6 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-center text-white/70 text-sm hover:bg-white/[0.08] transition-all"
          >
            Browse Full Gallery
          </Link>
          <Link
            href="/gift?utm_source=tiktok&utm_medium=bio"
            className="block w-full px-6 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-center text-white/70 text-sm hover:bg-white/[0.08] transition-all"
          >
            Gift a Portrait
          </Link>
          <Link
            href="/memorial-portraits?utm_source=tiktok&utm_medium=bio"
            className="block w-full px-6 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-center text-white/70 text-sm hover:bg-white/[0.08] transition-all"
          >
            Memorial Portraits
          </Link>
          <Link
            href="/bundles?utm_source=tiktok&utm_medium=bio"
            className="block w-full px-6 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-center text-white/70 text-sm hover:bg-white/[0.08] transition-all"
          >
            Bundle & Save
          </Link>
        </div>
      </section>
    </div>
  );
}
