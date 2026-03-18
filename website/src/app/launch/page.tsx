'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { trackEngagement } from '@/lib/analytics';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface Supporter {
  id: string;
  name: string;
  email: string;
  timestamp: number;
}

export default function LaunchPage() {
  // Launch date: Tuesday, March 25, 2026 at 12:01 AM PT
  const launchDate = new Date('2026-03-25T00:01:00-07:00');

  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [showAllSupporters, setShowAllSupporters] = useState(false);

  // Countdown timer
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const target = launchDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeRemaining({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load supporters from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('launch_supporters');
    if (stored) {
      setSupporters(JSON.parse(stored));
    }
  }, []);

  // Handle email signup
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/launch/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        setEmail('');

        // Add to local supporters list
        const newSupporter: Supporter = {
          id: Math.random().toString(36).substring(7),
          name: email.split('@')[0],
          email,
          timestamp: Date.now(),
        };

        const updatedSupporters = [newSupporter, ...supporters];
        setSupporters(updatedSupporters);
        localStorage.setItem('launch_supporters', JSON.stringify(updatedSupporters));

        // Track engagement
        // Note: trackEngagement doesn't support 'launch_signup' event type yet
        // trackEngagement?.('launch_signup', { email });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedSupporters = showAllSupporters ? supporters : supporters.slice(0, 12);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Countdown */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_rgba(201,169,110,0.15),_transparent)]" />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Launch badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-8">
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-gold text-xs tracking-[0.3em] uppercase font-medium">
              ProductHunt Launch
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[0.95] mb-6">
            Launching in
          </h1>

          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-4 md:gap-8 mb-12 max-w-2xl mx-auto">
            {[
              { label: 'Days', value: timeRemaining.days },
              { label: 'Hours', value: timeRemaining.hours },
              { label: 'Minutes', value: timeRemaining.minutes },
              { label: 'Seconds', value: timeRemaining.seconds },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-bg-card border border-white/[0.06] p-6">
                <div className="text-4xl md:text-5xl font-semibold text-gradient mb-2">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="text-text-secondary text-xs tracking-[0.2em] uppercase">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            AI-generated animal portraits in the style of the masters.
            <br />
            Just <span className="text-gold font-semibold">$9</span> per portrait.
          </p>

          {/* Email Capture Form */}
          <div className="max-w-md mx-auto mb-8">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isSubmitting}
                className="flex-1 px-6 py-4 rounded-full bg-bg-card border border-white/[0.08] text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-gold/40 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-glow px-8 py-4 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isSubmitting ? 'Joining...' : 'Get 50% Off'}
              </button>
            </form>

            {/* Success/Error Messages */}
            {submitStatus === 'success' && (
              <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <p className="text-green-400 text-sm">
                  🎉 You're on the list! Check your email for your exclusive 50% launch discount code.
                </p>
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-sm">
                  Something went wrong. Please try again.
                </p>
              </div>
            )}
          </div>

          <p className="text-text-secondary text-sm mb-16">
            Be the first to know when we launch + get an exclusive 50% discount code
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* Demo Video Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            See it in action.
          </h2>
          <p className="text-center text-text-secondary text-lg mb-12 max-w-2xl mx-auto">
            Watch how we transform your pet photo into a masterpiece in seconds.
          </p>

          {/* YouTube Video Embed */}
          <div className="relative rounded-2xl overflow-hidden bg-bg-card border border-white/[0.06]" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Pawcasso Atelier Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Process highlights below video */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { time: '0:00', step: 'Upload photo', desc: 'Any pet, any angle' },
              { time: '0:05', step: 'Select style', desc: '16 art styles available' },
              { time: '0:10', step: 'Get portrait', desc: 'High-res in 24 hours' },
            ].map((item) => (
              <div key={item.time} className="text-center">
                <div className="text-gold text-sm font-medium mb-2">{item.time}</div>
                <div className="text-text-primary font-medium mb-1">{item.step}</div>
                <div className="text-text-secondary text-sm">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* FAQ Section */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Launch Day FAQ
          </h2>
          <p className="text-center text-text-secondary text-lg mb-16">
            Everything you need to know about our ProductHunt launch.
          </p>

          <div className="space-y-4">
            {[
              {
                q: 'When exactly does the launch happen?',
                a: 'We launch on ProductHunt Tuesday, March 25th at 12:01 AM Pacific Time. Be sure to sign up above to get your exclusive 50% discount code sent to your inbox!',
              },
              {
                q: "What's the launch discount?",
                a: "Early supporters who sign up before launch get an exclusive 50% OFF code. That's just $4.50 per portrait instead of $9 — valid for your first 5 portraits.",
              },
              {
                q: 'How does the process work?',
                a: "Upload your pet's photo, choose from 16 art styles (Renaissance, Pixar 3D, Needle Felt, Ukiyo-e, and more), and receive a stunning 4000×5000px digital portrait within 24 hours.",
              },
              {
                q: 'What makes Pawcasso different?',
                a: "We combine cutting-edge AI with curated art direction. Every portrait is quality-checked by our team and you get unlimited revisions until it's perfect. Plus, we're the most affordable option at just $9.",
              },
              {
                q: 'Can I share my portrait on social media?',
                a: 'Absolutely! We encourage it. Tag us @pawcasso.atelier on Instagram and use #PawcassoPortrait to be featured on our gallery.',
              },
              {
                q: 'How can I support the launch?',
                a: 'On launch day (March 25), visit our ProductHunt page, upvote us, leave a comment about your experience, and share with friends who love their pets!',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl bg-bg-card p-6 hover:bg-bg-elevated transition-colors duration-300"
              >
                <h3 className="text-text-primary text-[15px] font-medium mb-2">{faq.q}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/faq"
              className="text-gold text-sm hover:text-gold-light transition-colors duration-300"
            >
              View all questions →
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Early Supporters List */}
      {supporters.length > 0 && (
        <>
          <section className="py-32 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-center text-4xl md:text-5xl font-semibold tracking-tight mb-6">
                Early Supporters
              </h2>
              <p className="text-center text-text-secondary text-lg mb-12">
                {supporters.length} {supporters.length === 1 ? 'person has' : 'people have'} joined the launch list
              </p>

              {/* Supporters Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {displayedSupporters.map((supporter) => (
                  <div
                    key={supporter.id}
                    className="rounded-xl bg-bg-card border border-white/[0.06] p-4 flex items-center gap-3 hover:bg-bg-elevated transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-gold text-sm font-medium">
                        {supporter.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <div className="text-text-primary text-sm font-medium truncate">
                        {supporter.name}
                      </div>
                      <div className="text-text-secondary text-xs">
                        {new Date(supporter.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show More Button */}
              {supporters.length > 12 && !showAllSupporters && (
                <div className="text-center">
                  <button
                    onClick={() => setShowAllSupporters(true)}
                    className="text-gold text-sm hover:text-gold-light transition-colors"
                  >
                    Show all {supporters.length} supporters →
                  </button>
                </div>
              )}
            </div>
          </section>

          <div className="section-divider" />
        </>
      )}

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 leading-tight">
            Join the launch.
            <br />
            <span className="text-gradient">Get 50% off.</span>
          </h2>
          <p className="text-text-secondary text-lg mb-10 max-w-md mx-auto">
            Be among the first to transform your pet into a masterpiece.
          </p>

          {/* Repeat email form */}
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isSubmitting}
                className="flex-1 px-6 py-4 rounded-full bg-bg-card border border-white/[0.08] text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-gold/40 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-glow px-8 py-4 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isSubmitting ? 'Joining...' : 'Get 50% Off'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
