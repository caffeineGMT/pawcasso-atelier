import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  // Static export for GitHub Pages staging
  ...(isGitHubPages && {
    output: 'export',
    basePath: '/pawcasso-atelier',
    assetPrefix: '/pawcasso-atelier/',
  }),

  // Skip TypeScript errors during GitHub Pages build (for staging preview only)
  ...(isGitHubPages && {
    typescript: {
      ignoreBuildErrors: true,
    },
  }),

  // Image optimization for better LCP
  images: {
    // GitHub Pages requires unoptimized images for static export
    ...(isGitHubPages ? { unoptimized: true } : {
      formats: ['image/webp', 'image/avif'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      minimumCacheTTL: 31536000, // 1 year cache for optimized images
    }),
    remotePatterns: [],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['@vercel/analytics', 'framer-motion', 'embla-carousel-react'],
    optimizeCss: true,
  },

  // Compression
  compress: true,

  // React strict mode for better debugging
  reactStrictMode: true,

  // Production source maps disabled for smaller bundles
  productionBrowserSourceMaps: false,

  // PoweredBy header removal
  poweredByHeader: false,

  // Security headers (only for Vercel production, not GitHub Pages static export)
  ...(!isGitHubPages && {
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on',
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload',
            },
            {
              key: 'X-Frame-Options',
              value: 'SAMEORIGIN',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block',
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin',
            },
            {
              key: 'Permissions-Policy',
              value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
            },
          ],
        },
      ];
    },
  }),
};

export default nextConfig;
