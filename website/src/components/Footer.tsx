import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-light tracking-widest text-gold mb-3">PAWCASSO</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              AI-powered artistic portraits that transform your beloved pets into timeless masterpieces.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm tracking-wider text-text-secondary mb-3 uppercase">Navigate</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-text-secondary hover:text-gold transition-colors">Home</Link></li>
              <li><Link href="/gallery" className="text-text-secondary hover:text-gold transition-colors">Gallery</Link></li>
              <li><Link href="/order" className="text-text-secondary hover:text-gold transition-colors">Order</Link></li>
              <li><Link href="/about" className="text-text-secondary hover:text-gold transition-colors">About</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm tracking-wider text-text-secondary mb-3 uppercase">Follow Us</h4>
            <a
              href="https://instagram.com/pawcasso.atelier"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              @pawcasso.atelier
            </a>
            <p className="text-text-secondary text-sm mt-4">
              DM us for custom requests and rush orders.
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center text-text-secondary text-xs tracking-wide">
          &copy; {new Date().getFullYear()} Pawcasso Atelier. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
