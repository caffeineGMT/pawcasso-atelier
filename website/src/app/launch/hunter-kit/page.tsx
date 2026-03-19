'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface ChecklistItem {
  id: string;
  label: string;
  time: string;
  completed: boolean;
}

export default function HunterKitPage() {
  // Launch date: Tuesday, March 25, 2026 at 12:01 AM PT
  const launchDate = new Date('2026-03-25T00:01:00-07:00');
  const productHuntUrl = 'https://www.producthunt.com/posts/pawcasso-atelier';

  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });
  const [isLaunched, setIsLaunched] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', label: 'Visit ProductHunt page at 12:01 AM PT', time: '12:01 AM PT', completed: false },
    { id: '2', label: 'Upvote Pawcasso Atelier', time: '12:01 AM PT', completed: false },
    { id: '3', label: 'Leave a thoughtful comment', time: '12:05 AM PT', completed: false },
    { id: '4', label: 'Share on Twitter/X with #ProductHunt', time: '12:10 AM PT', completed: false },
    { id: '5', label: 'Share on LinkedIn with launch story', time: '12:15 AM PT', completed: false },
    { id: '6', label: 'Share in relevant Slack/Discord communities', time: '12:20 AM PT', completed: false },
    { id: '7', label: 'Forward to 5 friends who love pets', time: 'Anytime', completed: false },
  ]);

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
        setIsLaunched(false);
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsLaunched(true);
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load checklist from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('hunter_checklist');
    if (stored) {
      setChecklist(JSON.parse(stored));
    }
  }, []);

  const toggleChecklistItem = (id: string) => {
    const updated = checklist.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updated);
    localStorage.setItem('hunter_checklist', JSON.stringify(updated));
  };

  const completedCount = checklist.filter(item => item.completed).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
            <span className="text-gold text-xs tracking-[0.3em] uppercase font-medium">
              🚀 Hunter Kit
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6">
            You're a Launch Hunter!
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Thank you for supporting Pawcasso Atelier on ProductHunt! This page has everything you need to help us reach #1 Product of the Day.
          </p>
        </div>

        {/* Countdown Timer */}
        {!isLaunched ? (
          <div className="rounded-2xl bg-bg-card border border-white/[0.06] p-8 mb-12">
            <h2 className="text-2xl font-semibold text-center mb-6">Launch Countdown</h2>
            <div className="grid grid-cols-4 gap-4 max-w-xl mx-auto">
              {[
                { label: 'Days', value: timeRemaining.days },
                { label: 'Hours', value: timeRemaining.hours },
                { label: 'Minutes', value: timeRemaining.minutes },
                { label: 'Seconds', value: timeRemaining.seconds },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-semibold text-gradient mb-1">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="text-text-secondary text-xs tracking-[0.2em] uppercase">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-text-secondary text-sm mt-6">
              Set your alarm for <span className="text-gold font-semibold">12:01 AM Pacific Time</span> on Tuesday, March 25th
            </p>
          </div>
        ) : (
          <div className="rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 p-8 mb-12 text-center">
            <h2 className="text-3xl font-semibold text-gold mb-4">🎉 We're Live on ProductHunt!</h2>
            <a
              href={productHuntUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block btn-glow px-10 py-4 rounded-full bg-gold text-bg font-medium text-[15px] hover:bg-gold-light transition-all duration-300"
            >
              Visit ProductHunt Page →
            </a>
          </div>
        )}

        {/* Launch Day Checklist */}
        <div className="rounded-2xl bg-bg-card border border-white/[0.06] p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Launch Day Checklist</h2>
            <div className="text-sm text-text-secondary">
              {completedCount}/{checklist.length} completed ({progressPercent}%)
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-white/[0.06] rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Checklist Items */}
          <div className="space-y-3">
            {checklist.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  item.completed
                    ? 'bg-green-500/10 border-green-500/20'
                    : 'bg-bg-elevated border-white/[0.06] hover:border-white/[0.12]'
                }`}
                onClick={() => toggleChecklistItem(item.id)}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                  item.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-white/[0.2]'
                }`}>
                  {item.completed && (
                    <svg className="w-4 h-4 text-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className={`font-medium mb-1 ${item.completed ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
                    {item.label}
                  </div>
                  <div className="text-sm text-text-secondary">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="rounded-2xl bg-bg-card border border-white/[0.06] p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href={productHuntUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-bg-elevated border border-white/[0.06] hover:border-gold/30 hover:bg-bg-card transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                <span className="text-xl">🚀</span>
              </div>
              <div className="flex-1">
                <div className="font-medium">ProductHunt Page</div>
                <div className="text-sm text-text-secondary">Upvote & comment</div>
              </div>
              <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

            <a
              href="https://instagram.com/pawcasso.atelier"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-bg-elevated border border-white/[0.06] hover:border-gold/30 hover:bg-bg-card transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                <span className="text-xl">📸</span>
              </div>
              <div className="flex-1">
                <div className="font-medium">Instagram</div>
                <div className="text-sm text-text-secondary">Share our story</div>
              </div>
              <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

            <Link
              href="/gallery"
              className="flex items-center gap-3 p-4 rounded-xl bg-bg-elevated border border-white/[0.06] hover:border-gold/30 hover:bg-bg-card transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                <span className="text-xl">🎨</span>
              </div>
              <div className="flex-1">
                <div className="font-medium">Gallery</div>
                <div className="text-sm text-text-secondary">View examples</div>
              </div>
              <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/order"
              className="flex items-center gap-3 p-4 rounded-xl bg-bg-elevated border border-white/[0.06] hover:border-gold/30 hover:bg-bg-card transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                <span className="text-xl">✨</span>
              </div>
              <div className="flex-1">
                <div className="font-medium">Order Page</div>
                <div className="text-sm text-text-secondary">Try it yourself</div>
              </div>
              <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Share Templates */}
        <div className="rounded-2xl bg-bg-card border border-white/[0.06] p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6">Share Templates</h2>
          <p className="text-text-secondary mb-6">Copy and paste these pre-written messages to share on social media:</p>

          <div className="space-y-4">
            {/* Twitter Template */}
            <div className="rounded-xl bg-bg-elevated p-4">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span className="font-medium">Twitter/X Template</span>
              </div>
              <div className="rounded-lg bg-bg p-4 text-sm text-text-secondary font-mono mb-3">
                🎨 Just discovered @pawcasso_atelier on ProductHunt! Turn your pet into a masterpiece for just $9.
                <br/><br/>
                Renaissance, Pixar 3D, Ukiyo-e - 16 art styles to choose from. High-res digital art in 24 hours.
                <br/><br/>
                Check it out: {productHuntUrl}
                <br/><br/>
                #ProductHunt #PetPortrait #AIArt
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`🎨 Just discovered @pawcasso_atelier on ProductHunt! Turn your pet into a masterpiece for just $9.\n\nRenaissance, Pixar 3D, Ukiyo-e - 16 art styles to choose from. High-res digital art in 24 hours.\n\nCheck it out: ${productHuntUrl}\n\n#ProductHunt #PetPortrait #AIArt`);
                }}
                className="text-gold text-sm hover:text-gold-light transition-colors"
              >
                📋 Copy to clipboard
              </button>
            </div>

            {/* LinkedIn Template */}
            <div className="rounded-xl bg-bg-elevated p-4">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="font-medium">LinkedIn Template</span>
              </div>
              <div className="rounded-lg bg-bg p-4 text-sm text-text-secondary font-mono mb-3">
                I'm excited to share Pawcasso Atelier's ProductHunt launch today!
                <br/><br/>
                They're democratizing custom pet portraits with AI - transforming photos into museum-quality art for just $9. No more $500 commissions or 3-week waits.
                <br/><br/>
                What impressed me:
                <br/>
                ✓ 16 curated art styles (Renaissance, Ghibli, Ukiyo-e, Pixar 3D)
                <br/>
                ✓ 4000x5000px print-ready resolution
                <br/>
                ✓ 24-hour delivery
                <br/>
                ✓ Unlimited revisions
                <br/><br/>
                Perfect for pet parents, gift givers, or anyone who wants Instagram-worthy art of their furry friend.
                <br/><br/>
                Check them out: {productHuntUrl}
                <br/><br/>
                #ProductHunt #AIArt #PetLovers #Startups
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`I'm excited to share Pawcasso Atelier's ProductHunt launch today!\n\nThey're democratizing custom pet portraits with AI - transforming photos into museum-quality art for just $9. No more $500 commissions or 3-week waits.\n\nWhat impressed me:\n✓ 16 curated art styles (Renaissance, Ghibli, Ukiyo-e, Pixar 3D)\n✓ 4000x5000px print-ready resolution\n✓ 24-hour delivery\n✓ Unlimited revisions\n\nPerfect for pet parents, gift givers, or anyone who wants Instagram-worthy art of their furry friend.\n\nCheck them out: ${productHuntUrl}\n\n#ProductHunt #AIArt #PetLovers #Startups`);
                }}
                className="text-gold text-sm hover:text-gold-light transition-colors"
              >
                📋 Copy to clipboard
              </button>
            </div>
          </div>
        </div>

        {/* Comment Suggestions */}
        <div className="rounded-2xl bg-bg-card border border-white/[0.06] p-8">
          <h2 className="text-2xl font-semibold mb-6">ProductHunt Comment Ideas</h2>
          <p className="text-text-secondary mb-6">Leave a thoughtful comment on our ProductHunt page. Here are some angles:</p>

          <ul className="space-y-4 text-text-secondary">
            <li className="flex items-start gap-3">
              <span className="text-gold">•</span>
              <span><strong className="text-text-primary">Problem it solves:</strong> "I've been wanting a custom portrait of my dog but professional artists charge $300+. This is a game-changer at $9!"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gold">•</span>
              <span><strong className="text-text-primary">Use case:</strong> "Perfect for pet memorial gifts. Lost my cat last year and this would've been a beautiful way to remember her."</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gold">•</span>
              <span><strong className="text-text-primary">Art quality:</strong> "The Ghibli and Renaissance styles are STUNNING. Never seen AI pet portraits this polished."</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gold">•</span>
              <span><strong className="text-text-primary">Question:</strong> "Can you do multiple pets in one portrait? Would love to see my two dogs together in Ukiyo-e style!"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gold">•</span>
              <span><strong className="text-text-primary">Comparison:</strong> "Way better than the generic AI pet apps on the App Store. These actually look like fine art."</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
