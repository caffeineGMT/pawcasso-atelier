"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.04]">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-medium tracking-[0.2em] text-gradient">
          PAWCASSO
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8 text-[13px]">
          <li>
            <Link href="/gallery" className="text-text-secondary hover:text-text-primary transition-colors duration-300">
              Gallery
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-text-secondary hover:text-text-primary transition-colors duration-300">
              About
            </Link>
          </li>
          <li>
            <Link href="/faq" className="text-text-secondary hover:text-text-primary transition-colors duration-300">
              FAQ
            </Link>
          </li>
          <li>
            <Link
              href="/order"
              className="px-5 py-2 rounded-full bg-gold text-bg text-[13px] font-medium hover:bg-gold-light transition-all duration-300"
            >
              Order
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-text-secondary hover:text-text-primary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="md:hidden glass border-b border-white/[0.04]">
          <ul className="flex flex-col items-center gap-6 py-8 text-sm">
            <li>
              <Link href="/gallery" onClick={() => setMobileOpen(false)} className="text-text-secondary hover:text-text-primary transition-colors">
                Gallery
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={() => setMobileOpen(false)} className="text-text-secondary hover:text-text-primary transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/faq" onClick={() => setMobileOpen(false)} className="text-text-secondary hover:text-text-primary transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href="/order"
                onClick={() => setMobileOpen(false)}
                className="px-6 py-2.5 rounded-full bg-gold text-bg text-sm font-medium hover:bg-gold-light transition-colors"
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
