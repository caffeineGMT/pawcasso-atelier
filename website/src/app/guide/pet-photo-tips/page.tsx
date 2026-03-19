import React from 'react';

export const metadata = {
  title: 'How to Take the Perfect Pet Photo for Portraits (10 Pro Tips) | Pawcasso Atelier',
  description: 'Master smartphone pet photography with our comprehensive guide. Learn lighting, angles, and composition techniques for stunning AI portrait results.',
};

export default function PetPhotoGuide() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-gradient-to-b from-black to-black/95 py-12">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="mb-4 text-center text-4xl font-bold tracking-tight md:text-5xl">
            How to Take the Perfect Pet Photo for Portraits
          </h1>
          <p className="text-center text-xl text-gray-400">
            10 Pro Tips for Smartphone Photography
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Introduction */}
        <section className="mb-12">
          <p className="mb-6 text-lg leading-relaxed text-gray-300">
            Getting a great photo of your pet doesn't require expensive camera gear. With these 10 proven tips,
            you'll capture stunning photos using just your smartphone — perfect for creating AI-generated portraits
            that truly capture your pet's personality.
          </p>
        </section>

        {/* Tips */}
        <div className="space-y-10">
          {/* Tip 1 */}
          <article className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A96E] text-lg font-bold text-black">
                1
              </span>
              <h2 className="text-2xl font-semibold">Natural Light is Your Best Friend</h2>
            </div>
            <p className="mb-4 text-gray-300">
              Avoid flash at all costs. It creates harsh shadows, red-eye, and stressed pets. Instead:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-gray-300">
              <li>Shoot near a window during golden hour (early morning or late afternoon)</li>
              <li>Position your pet so light falls evenly on their face</li>
              <li>Overcast days provide beautifully soft, diffused light</li>
              <li>Never photograph with the sun directly behind your pet (backlighting)</li>
            </ul>
          </article>

          {/* Tip 2 */}
          <article className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A96E] text-lg font-bold text-black">
                2
              </span>
              <h2 className="text-2xl font-semibold">Get Down to Their Eye Level</h2>
            </div>
            <p className="mb-4 text-gray-300">
              The biggest mistake pet photographers make? Shooting from standing height. Instead:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-gray-300">
              <li>Sit, kneel, or lie down to match your pet's eye level</li>
              <li>This creates connection and eliminates the "looking down" angle</li>
              <li>Eye contact makes portraits feel more intimate and engaging</li>
              <li>For small pets (cats, puppies), get even lower</li>
            </ul>
          </article>

          {/* Tip 3 */}
          <article className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A96E] text-lg font-bold text-black">
                3
              </span>
              <h2 className="text-2xl font-semibold">Focus on the Eyes</h2>
            </div>
            <p className="mb-4 text-gray-300">
              Sharp, expressive eyes make or break a pet portrait:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-gray-300">
              <li>Tap your smartphone screen on your pet's eyes to lock focus</li>
              <li>Make sure both eyes are in focus (especially for side profiles)</li>
              <li>Catch light reflections in the eyes (called "catchlights") for sparkle</li>
              <li>Avoid photos where eyes are closed, looking away, or in shadow</li>
            </ul>
          </article>

          {/* Tip 4 */}
          <article className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A96E] text-lg font-bold text-black">
                4
              </span>
              <h2 className="text-2xl font-semibold">Use Portrait Mode (If Available)</h2>
            </div>
            <p className="mb-4 text-gray-300">
              Modern smartphones have powerful portrait modes that create professional-looking depth:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-gray-300">
              <li>Portrait mode blurs the background, making your pet stand out</li>
              <li>Keep your pet 2-8 feet away for best bokeh effect</li>
              <li>Avoid busy backgrounds — simple, neutral backgrounds work best</li>
              <li>If portrait mode fails, shoot in regular mode and crop tightly</li>
            </ul>
          </article>

          {/* Tip 5 */}
          <article className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A96E] text-lg font-bold text-black">
                5
              </span>
              <h2 className="text-2xl font-semibold">Capture Their Personality</h2>
            </div>
            <p className="mb-4 text-gray-300">
              The best portraits reveal your pet's unique character:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-gray-300">
              <li>Playful dog? Capture mid-jump or with tongue out</li>
              <li>Regal cat? Shoot a composed, sitting pose</li>
              <li>Curious pet? Get them looking slightly off-camera</li>
              <li>Action shots work too — running, playing, or in their favorite spot</li>
            </ul>
          </article>

          {/* Tip 6 */}
          <article className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A96E] text-lg font-bold text-black">
                6
              </span>
              <h2 className="text-2xl font-semibold">Timing is Everything</h2>
            </div>
            <p className="mb-4 text-gray-300">
              Patience pays off in pet photography:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-gray-300">
              <li>Shoot when your pet is calm and relaxed (after exercise or meals)</li>
              <li>Never force a photo session — stressed pets show it in their eyes</li>
              <li>Keep sessions short (5-10 minutes) to maintain engagement</li>
              <li>Use treats or toys to get their attention, then hide them quickly</li>
            </ul>
          </article>

          {/* Tip 7 */}
          <article className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A96E] text-lg font-bold text-black">
                7
              </span>
              <h2 className="text-2xl font-semibold">Frame Tightly (But Not Too Tight)</h2>
            </div>
            <p className="mb-4 text-gray-300">
              Composition makes a huge difference:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-gray-300">
              <li>Fill the frame with your pet's face and shoulders (headshot style)</li>
              <li>Leave a little space around ears — don't crop them off</li>
              <li>For full-body shots, include their paws and tail</li>
              <li>Avoid too much empty space — you can always crop out later</li>
            </ul>
          </article>

          {/* Tip 8 */}
          <article className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A96E] text-lg font-bold text-black">
                8
              </span>
              <h2 className="text-2xl font-semibold">Clean Their Face First</h2>
            </div>
            <p className="mb-4 text-gray-300">
              Small details matter:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-gray-300">
              <li>Wipe away eye gunk, drool, or food crumbs</li>
              <li>Brush or groom their coat (especially long-haired breeds)</li>
              <li>Remove collars or harnesses for a timeless portrait look</li>
              <li>Check for matted fur or visible debris</li>
            </ul>
          </article>

          {/* Tip 9 */}
          <article className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A96E] text-lg font-bold text-black">
                9
              </span>
              <h2 className="text-2xl font-semibold">Take LOTS of Photos</h2>
            </div>
            <p className="mb-4 text-gray-300">
              The "spray and pray" method works for pet photography:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-gray-300">
              <li>Use burst mode to capture multiple shots in rapid succession</li>
              <li>Shoot from different angles — straight on, 3/4 profile, full profile</li>
              <li>Try both landscape and portrait orientations</li>
              <li>Out of 50 photos, you'll get 3-5 perfect shots (that's normal!)</li>
            </ul>
          </article>

          {/* Tip 10 */}
          <article className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A96E] text-lg font-bold text-black">
                10
              </span>
              <h2 className="text-2xl font-semibold">Keep Your Lens Clean</h2>
            </div>
            <p className="mb-4 text-gray-300">
              The simplest tip that makes the biggest difference:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-gray-300">
              <li>Smartphone lenses collect fingerprints, dust, and smudges</li>
              <li>Wipe your lens with a microfiber cloth before every session</li>
              <li>Hazy, blurry photos are often caused by dirty lenses (not bad focus)</li>
              <li>Check your lens after each shot — it's easy to smudge while handling your phone</li>
            </ul>
          </article>
        </div>

        {/* Bonus Section */}
        <section className="mt-16 rounded-2xl border border-[#C9A96E]/30 bg-gradient-to-br from-[#C9A96E]/10 to-transparent p-10">
          <h2 className="mb-6 text-3xl font-bold">Ready to Transform Your Pet Photo?</h2>
          <p className="mb-6 text-lg text-gray-300">
            Now that you have the perfect photo, turn it into a stunning AI-generated portrait in 16+ art styles —
            Renaissance, Impressionist, Studio Ghibli, Pop Art, and more.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <strong className="text-white">Museum-Quality Art:</strong>
                <span className="text-gray-300"> 4000×5000px resolution, perfect for printing</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <strong className="text-white">24-Hour Delivery:</strong>
                <span className="text-gray-300"> Get your portrait tomorrow</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <strong className="text-white">Just $9:</strong>
                <span className="text-gray-300"> No subscriptions, no hidden fees</span>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <a
              href="/order"
              className="inline-block rounded-full bg-[#C9A96E] px-10 py-4 text-lg font-semibold text-black transition-all hover:bg-[#B8956D]"
            >
              Order Your Portrait Now →
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-8">
        <div className="mx-auto max-w-4xl px-6 text-center text-sm text-gray-500">
          <p>© 2024 Pawcasso Atelier. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
