import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration - Cute Paw Print */}
        <div className="mb-8">
          <svg
            className="mx-auto h-32 w-32 text-coral opacity-50"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            {/* Paw pad */}
            <ellipse cx="12" cy="16" rx="4" ry="3.5" />
            {/* Toe pads */}
            <circle cx="8" cy="10" r="2" />
            <circle cx="12" cy="8" r="2" />
            <circle cx="16" cy="10" r="2" />
            <circle cx="10" cy="12.5" r="1.5" />
            <circle cx="14" cy="12.5" r="1.5" />
          </svg>
        </div>

        {/* 404 Message */}
        <h1 className="text-6xl font-serif font-bold text-navy mb-4">404</h1>

        <h2 className="text-2xl font-semibold text-navy mb-4">
          Page Not Found
        </h2>

        <p className="text-lg text-gray-600 mb-8">
          Looks like this paw print leads nowhere! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-coral text-white rounded-full font-semibold hover:bg-coral-dark transition-colors"
          >
            Return Home
          </Link>

          <Link
            href="/gallery"
            className="px-6 py-3 bg-white text-navy border-2 border-navy rounded-full font-semibold hover:bg-gray-50 transition-colors"
          >
            View Gallery
          </Link>
        </div>

        {/* Popular Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Popular pages:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/order" className="text-coral hover:underline">
              Order Portrait
            </Link>
            <Link href="/gallery" className="text-coral hover:underline">
              Gallery
            </Link>
            <Link href="/faq" className="text-coral hover:underline">
              FAQ
            </Link>
            <Link href="/about" className="text-coral hover:underline">
              About Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
