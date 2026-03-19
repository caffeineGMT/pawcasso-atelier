import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization for better LCP
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [],
    minimumCacheTTL: 31536000, // 1 year cache for optimized images
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
};

export default nextConfig;
