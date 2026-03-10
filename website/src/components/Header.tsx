"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-light tracking-widest text-gold">
          PAWCASSO
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8 text-sm tracking-wide">
          <li>
            <Link href="/" className="text-text-secondary hover:text-gold transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link href="/gallery" className="text-text-secondary hover:text-gold transition-colors">
              Gallery
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-text-secondary hover:text-gold transition-colors">
              About
            </Link>
          </li>
          <li>
            <Link
              href="/order"
              className="px-5 py-2 bg-gold text-bg text-sm font-medium tracking-wider hover:bg-gold-light transition-colors"
            >
              Order Portrait
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-text-secondary hover:text-gold transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="md:hidden bg-bg-elevated border-b border-border">
          <ul className="flex flex-col items-center gap-6 py-8 text-sm tracking-wide">
            <li>
              <Link href="/" onClick={() => setMobileOpen(false)} className="text-text-secondary hover:text-gold transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/gallery" onClick={() => setMobileOpen(false)} className="text-text-secondary hover:text-gold transition-colors">
                Gallery
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={() => setMobileOpen(false)} className="text-text-secondary hover:text-gold transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link
                href="/order"
                onClick={() => setMobileOpen(false)}
                className="px-5 py-2 bg-gold text-bg text-sm font-medium tracking-wider hover:bg-gold-light transition-colors"
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
