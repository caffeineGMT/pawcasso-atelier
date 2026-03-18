import { NextResponse } from 'next/server';

/**
 * Edge Config API endpoint
 * In production, this would connect to Vercel Edge Config
 * For now, it returns a mock configuration
 */
export async function GET() {
  try {
    // In production, use @vercel/edge-config:
    // import { get } from '@vercel/edge-config';
    // const experiments = await get('experiments');

    // Mock configuration for local development
    const config = {
      experiments: {
        'upsell-modal-timing': {
          // When ready to promote a winner, set it here:
          // winner: 'fast',
          variants: {
            control: { weight: 25 },
            fast: { weight: 25 },
            delayed: { weight: 25 },
            'exit-intent': { weight: 25 },
          },
        },
      },
    };

    return NextResponse.json(config);
  } catch (error) {
    console.error('Edge Config error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiment config' },
      { status: 500 }
    );
  }
}
