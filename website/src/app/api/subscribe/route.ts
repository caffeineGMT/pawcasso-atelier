import { NextRequest, NextResponse } from 'next/server';
import mailchimp from '@mailchimp/mailchimp_marketing';
import { trackServerLead, extractFacebookCookies } from '@/lib/meta-conversions-api';

// Initialize Mailchimp
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check required environment variables
    if (!process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_SERVER_PREFIX || !process.env.MAILCHIMP_LIST_ID) {
      console.error('Missing Mailchimp environment variables');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    try {
      // Add subscriber to Mailchimp list
      await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
        email_address: email,
        status: 'subscribed',
        tags: ['Website Signup', 'Exit Intent'],
      });

      console.log(`Successfully subscribed: ${email}`);

      // Track Lead event server-side to Meta Conversions API
      const cookies = extractFacebookCookies(request.headers.get('cookie') || undefined);
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined;
      const userAgent = request.headers.get('user-agent') || undefined;

      await trackServerLead({
        email,
        ip,
        userAgent,
        fbp: cookies.fbp,
        fbc: cookies.fbc,
      });

      return NextResponse.json({
        success: true,
        discountCode: 'FIRST15',
      });
    } catch (mailchimpError: any) {
      // Handle "already subscribed" case gracefully
      if (mailchimpError.status === 400 && mailchimpError.response?.body?.title === 'Member Exists') {
        console.log(`Email already subscribed: ${email}`);
        // Return success anyway - they're already in the list
        return NextResponse.json({
          success: true,
          discountCode: 'FIRST15',
        });
      }

      // Log other Mailchimp errors
      console.error('Mailchimp API error:', mailchimpError.response?.body || mailchimpError.message);

      return NextResponse.json(
        { success: false, error: 'Failed to subscribe. Please try again later.' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}
