/**
 * Image Optimization Utilities
 *
 * Helper functions for generating responsive srcset attributes and
 * managing optimized images across the application.
 */

import blurDataComplete from '@/../public/blur-data-complete.json';
import galleryBlurData from '@/../blur-data.json';

// Merge blur data sources
const blurDataMap: Record<string, string> = {
  ...blurDataComplete,
  ...galleryBlurData,
};

/**
 * Get blur data URL for an image
 * @param imagePath - Public path to the image (e.g., '/gallery/image.webp')
 */
export function getBlurDataURL(imagePath: string): string | undefined {
  return blurDataMap[imagePath];
}

/**
 * Generate srcset for optimized images
 * @param basePath - Base path without size suffix (e.g., '/pets/optimized/alfie-border-collie')
 * @param format - Image format (default: 'webp')
 * @returns srcset string with all available sizes
 */
export function generateSrcSet(
  basePath: string,
  format: 'webp' | 'jpg' | 'png' = 'webp'
): string {
  const sizes = [400, 800, 1200];
  return sizes.map(width => `${basePath}-${width}w.${format} ${width}w`).join(', ');
}

/**
 * Get optimized image path for a given size
 * @param originalPath - Original image path (e.g., '/pets/alfie.png')
 * @param width - Desired width (400, 800, or 1200)
 * @returns Optimized image path
 */
export function getOptimizedImagePath(
  originalPath: string,
  width: 400 | 800 | 1200 = 800
): string {
  const pathWithoutExt = originalPath.replace(/\.(png|jpg|jpeg|webp)$/i, '');
  const dir = originalPath.includes('/optimized/')
    ? pathWithoutExt
    : `${pathWithoutExt.replace(/\/([^\/]+)$/, '/optimized/$1')}`;

  return `${dir}-${width}w.webp`;
}

/**
 * Image sizes for responsive images
 * Use with Next.js Image component's sizes prop
 */
export const IMAGE_SIZES = {
  // Full width on mobile, 50% on tablet, 33% on desktop
  galleryGrid: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',

  // Full width on mobile, 75% on tablet, 50% on desktop
  featured: '(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw',

  // Full width
  hero: '100vw',

  // Fixed small sizes
  thumbnail: '(max-width: 640px) 25vw, 200px',

  // Profile/avatar
  avatar: '(max-width: 640px) 15vw, 100px',
} as const;

/**
 * Get responsive image props for Next.js Image component
 * @param imagePath - Image path
 * @param options - Image options
 */
export function getResponsiveImageProps(
  imagePath: string,
  options: {
    alt: string;
    priority?: boolean;
    quality?: number;
    sizes?: string;
  }
) {
  const blurDataURL = getBlurDataURL(imagePath);

  return {
    src: imagePath,
    alt: options.alt,
    quality: options.quality ?? 85,
    sizes: options.sizes ?? IMAGE_SIZES.featured,
    priority: options.priority ?? false,
    ...(blurDataURL && {
      placeholder: 'blur' as const,
      blurDataURL,
    }),
  };
}

/**
 * Check if an image has an optimized version
 */
export function hasOptimizedVersion(imagePath: string): boolean {
  return Object.keys(blurDataMap).some(key =>
    key.includes(imagePath.replace(/\.(png|jpg|jpeg)$/i, ''))
  );
}
