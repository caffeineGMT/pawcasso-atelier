import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

/**
 * Dynamic OG Image Generator for Pawcasso Atelier
 *
 * Usage: /api/og?title=Your+Title&image=/gallery/cat_vermeer.webp
 *
 * This generates unique Open Graph images for each page to improve
 * social sharing click-through rates on Facebook, Twitter, LinkedIn, etc.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get('title') || 'Custom AI Pet Portraits';
  const subtitle = searchParams.get('subtitle') || 'Transform your pet into stunning art';
  const imagePath = searchParams.get('image') || '/gallery/cat_vermeer.webp';

  // Construct full image URL (OG images need absolute URLs)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://pawcasso-atelier.vercel.app';
  const imageUrl = imagePath.startsWith('http') ? imagePath : `${baseUrl}${imagePath}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          position: 'relative',
        }}
      >
        {/* Background Image */}
        <img
          src={imageUrl}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Gradient Overlay for Text Readability */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(10,10,10,0.4), rgba(10,10,10,0.8))',
          }}
        />

        {/* Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
            zIndex: 10,
            textAlign: 'center',
          }}
        >
          {/* Main Title */}
          <h1
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.1,
              marginBottom: 24,
              textShadow: '0 4px 20px rgba(0,0,0,0.8)',
              maxWidth: '900px',
            }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 32,
              color: '#C9A96E',
              marginBottom: 40,
              fontWeight: 500,
              textShadow: '0 2px 10px rgba(0,0,0,0.8)',
            }}
          >
            {subtitle}
          </p>

          {/* Brand Name */}
          <div
            style={{
              fontSize: 28,
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Pawcasso Atelier
          </div>
        </div>

        {/* Bottom Brand Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px 24px',
            backgroundColor: 'rgba(201,169,110,0.15)',
            borderRadius: 12,
            border: '1px solid rgba(201,169,110,0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            style={{
              fontSize: 18,
              color: '#C9A96E',
              fontWeight: 600,
            }}
          >
            From $9
          </div>
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: '#C9A96E',
            }}
          />
          <div
            style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            17 Art Styles
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // OG image standard size (1.91:1 ratio)
    }
  );
}
