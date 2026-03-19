"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { hapticTap } from "@/lib/haptics";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node) &&
        !menuButtonRef.current?.contains(e.target as Node)
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.04]" role="banner">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between" aria-label="Main navigation">
        <Link
          href="/"
          className="text-xl font-medium tracking-[0.2em] text-gradient focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-bg rounded-sm px-2 py-1"
          aria-label="Pawcasso Atelier - Home"
        >
          PAWCASSO
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8 text-[13px]" role="list">
          <li>
            <Link
              href="/gallery"
              className="text-text-secondary hover:text-text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-bg rounded-sm px-2 py-1"
              aria-label="View gallery"
            >
              Gallery
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className="text-text-secondary hover:text-text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-bg rounded-sm px-2 py-1"
              aria-label="Read blog"
            >
              Blog
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="text-text-secondary hover:text-text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-bg rounded-sm px-2 py-1"
              aria-label="About us"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/faq"
              className="text-text-secondary hover:text-text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-bg rounded-sm px-2 py-1"
              aria-label="Frequently asked questions"
            >
              FAQ
            </Link>
          </li>
          <li>
            <Link
              href="/order"
              className="px-6 py-3 rounded-full bg-gold text-bg text-[13px] font-medium hover:bg-gold-light transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-bg"
              aria-label="Order custom portrait"
            >
              Order
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger - 44x44px touch target */}
        <button
          ref={menuButtonRef}
          className="md:hidden text-text-secondary hover:text-text-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-bg rounded-sm"
          onClick={() => {
            hapticTap();
            setMobileOpen(!mobileOpen);
          }}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          className="md:hidden glass border-b border-white/[0.04]"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col items-center gap-6 py-8 text-sm" role="list">
            <li>
              <Link
                href="/gallery"
                onClick={() => setMobileOpen(false)}
                className="text-text-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-bg rounded-sm px-2 py-1"
                aria-label="View gallery"
              >
                Gallery
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                onClick={() => setMobileOpen(false)}
                className="text-text-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-bg rounded-sm px-2 py-1"
                aria-label="Read blog"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="text-text-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-bg rounded-sm px-2 py-1"
                aria-label="About us"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                onClick={() => setMobileOpen(false)}
                className="text-text-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-bg rounded-sm px-2 py-1"
                aria-label="Frequently asked questions"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href="/order"
                onClick={() => setMobileOpen(false)}
                className="px-6 py-2.5 rounded-full bg-gold text-bg text-sm font-medium hover:bg-gold-light transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-bg"
                aria-label="Order custom portrait"
              >
                Order Portrait
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
