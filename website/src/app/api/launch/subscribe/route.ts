import { NextRequest, NextResponse } from 'next/server';
import mailchimp from '@mailchimp/mailchimp_marketing';
import { trackLeadServerSide, extractFacebookCookies, generateEventId } from '@/lib/meta-conversions-api';

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
      // Add subscriber to Mailchimp list with ProductHunt Launch segment
      await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
        email_address: email,
        status: 'subscribed',
        tags: ['ProductHunt Launch', 'Early Supporter'],
        merge_fields: {
          SOURCE: 'Launch Page',
          SIGNUP_DATE: new Date().toISOString(),
        },
      });

      console.log(`Successfully subscribed to launch list: ${email}`);

      // Send welcome email with launch details and discount code
      try {
        await mailchimp.messages.send({
          message: {
            from_email: 'hello@pawcasso-atelier.com',
            from_name: 'Pawcasso Atelier',
            to: [{ email, type: 'to' }],
            subject: '🎨 You're on the list! Your exclusive 50% launch discount',
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #F5F5F7; background: #000000; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                    .header { text-align: center; margin-bottom: 40px; }
                    .logo { font-size: 24px; font-weight: 600; color: #C9A96E; margin-bottom: 16px; }
                    .title { font-size: 32px; font-weight: 700; margin-bottom: 16px; background: linear-gradient(135deg, #C9A96E 0%, #E8D5A8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                    .content { background: #111111; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 16px; padding: 32px; margin-bottom: 32px; }
                    .discount-code { background: rgba(201, 169, 110, 0.1); border: 1px solid rgba(201, 169, 110, 0.2); border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
                    .code { font-size: 28px; font-weight: 700; color: #C9A96E; letter-spacing: 0.1em; margin: 8px 0; }
                    .highlight { color: #C9A96E; font-weight: 600; }
                    .cta-button { display: inline-block; background: #C9A96E; color: #000000; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; margin: 24px 0; transition: background 0.3s; }
                    .cta-button:hover { background: #E8D5A8; }
                    .details { background: rgba(255, 255, 255, 0.02); border-radius: 12px; padding: 20px; margin: 20px 0; }
                    .detail-item { margin: 12px 0; color: #86868b; }
                    .footer { text-align: center; color: #86868b; font-size: 14px; margin-top: 32px; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <div class="logo">🎨 Pawcasso Atelier</div>
                      <h1 class="title">Welcome to the Launch!</h1>
                    </div>

                    <div class="content">
                      <p>Thank you for joining our ProductHunt launch! You're now an official early supporter.</p>

                      <div class="discount-code">
                        <div style="font-size: 14px; color: #86868b; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 8px;">Your Exclusive Code</div>
                        <div class="code">LAUNCH50</div>
                        <div style="font-size: 14px; color: #86868b; margin-top: 8px;">50% OFF your first 5 portraits</div>
                      </div>

                      <div class="details">
                        <div style="font-weight: 600; margin-bottom: 12px; color: #F5F5F7;">Launch Details:</div>
                        <div class="detail-item">📅 <strong style="color: #F5F5F7;">Date:</strong> Tuesday, March 25, 2026</div>
                        <div class="detail-item">⏰ <strong style="color: #F5F5F7;">Time:</strong> 12:01 AM Pacific Time</div>
                        <div class="detail-item">💰 <strong style="color: #F5F5F7;">Your Price:</strong> $4.50 per portrait (50% off)</div>
                        <div class="detail-item">🎨 <strong style="color: #F5F5F7;">Styles:</strong> 16 art styles including Renaissance, Pixar 3D, Needle Felt</div>
                        <div class="detail-item">📦 <strong style="color: #F5F5F7;">Delivery:</strong> High-res digital file within 24 hours</div>
                      </div>

                      <p><strong>What happens next?</strong></p>
                      <ul style="color: #86868b;">
                        <li>On launch day (March 25), we'll send you the ProductHunt link</li>
                        <li>Your discount code <span class="highlight">LAUNCH50</span> will be automatically applied</li>
                        <li>Order as many portraits as you want (code valid for first 5)</li>
                      </ul>

                      <div style="text-align: center;">
                        <a href="https://pawcasso-atelier.vercel.app/gallery" class="cta-button">
                          Preview Our Gallery
                        </a>
                      </div>

                      <p><strong>How you can help:</strong></p>
                      <ul style="color: #86868b;">
                        <li>Upvote us on ProductHunt on launch day</li>
                        <li>Leave a comment sharing your experience</li>
                        <li>Share with friends who love their pets</li>
                      </ul>

                      <p style="margin-top: 32px;">We're incredibly grateful for your support. See you on March 25th! 🚀</p>

                      <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.06);">
                        <p style="margin: 0; color: #86868b; font-size: 14px;">Questions? Reply to this email or reach us at hello@pawcasso-atelier.com</p>
                      </div>
                    </div>

                    <div class="footer">
                      <p>Pawcasso Atelier • AI-Generated Animal Portraits</p>
                      <p style="font-size: 12px;">
                        <a href="https://instagram.com/pawcasso.atelier" style="color: #C9A96E; text-decoration: none;">Instagram</a> •
                        <a href="https://pawcasso-atelier.vercel.app" style="color: #C9A96E; text-decoration: none;">Website</a>
                      </p>
                    </div>
                  </div>
                </body>
              </html>
            `,
          },
        });
        console.log(`Launch welcome email sent to: ${email}`);
      } catch (emailError: any) {
        // Log but don't fail the request if email fails
        console.error('Failed to send welcome email:', emailError);
      }

      // Track Lead event server-side to Meta Conversions API
      const cookies = extractFacebookCookies(request.headers.get('cookie') || undefined);
      const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined;
      const userAgent = request.headers.get('user-agent') || undefined;
      const eventId = generateEventId('launch_lead');

      await trackLeadServerSide({
        email,
        ipAddress,
        userAgent,
        eventId,
        fbp: cookies.fbp,
        fbc: cookies.fbc,
      });

      return NextResponse.json({
        success: true,
        discountCode: 'LAUNCH50',
        message: 'Successfully subscribed! Check your email for launch details.',
      });
    } catch (mailchimpError: any) {
      // Handle "already subscribed" case gracefully
      if (mailchimpError.status === 400 && mailchimpError.response?.body?.title === 'Member Exists') {
        console.log(`Email already subscribed to launch list: ${email}`);
        return NextResponse.json({
          success: true,
          discountCode: 'LAUNCH50',
          message: 'You're already on the list! Check your email for launch details.',
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
    console.error('Launch subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}
