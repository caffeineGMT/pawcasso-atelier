export function generatePostDeliveryReviewEmail({
  customerName,
  petName,
  reviewUrl,
  baseUrl,
}: {
  customerName: string;
  petName: string;
  reviewUrl: string;
  baseUrl: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #000;
      color: #F5F5F7;
      padding: 20px;
      margin: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #111;
      border-radius: 16px;
      padding: 40px;
      border: 1px solid #1d1d1f;
    }
    .logo {
      text-align: center;
      margin-bottom: 32px;
    }
    .logo h1 {
      font-size: 28px;
      font-weight: 600;
      margin: 0;
      letter-spacing: -0.02em;
    }
    .logo .gold {
      color: #C9A96E;
    }
    h2 {
      color: #C9A96E;
      margin: 24px 0 12px;
      font-size: 20px;
    }
    p {
      line-height: 1.6;
      margin: 15px 0;
      color: #86868b;
      font-size: 16px;
    }
    .greeting {
      color: #F5F5F7;
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 24px;
    }
    .reward-box {
      background: rgba(201, 169, 110, 0.1);
      border: 1px solid rgba(201, 169, 110, 0.3);
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
    }
    .reward-heading {
      color: #C9A96E;
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 12px 0;
    }
    .reward-list {
      color: #F5F5F7;
      font-size: 15px;
      line-height: 1.8;
      margin: 0;
      padding-left: 20px;
    }
    .reward-list li {
      margin-bottom: 8px;
    }
    .cta-container {
      text-align: center;
      margin: 32px 0;
    }
    .cta-button {
      display: inline-block;
      background: #C9A96E;
      color: #000;
      padding: 14px 32px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
    }
    .secondary-button {
      display: inline-block;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #F5F5F7;
      padding: 14px 32px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 500;
      font-size: 15px;
    }
    .photo-tips {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
    }
    .photo-tips h3 {
      color: #F5F5F7;
      font-size: 15px;
      font-weight: 600;
      margin: 0 0 12px 0;
    }
    .photo-tips p {
      font-size: 14px;
      margin: 8px 0;
    }
    .divider {
      border: none;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      margin: 32px 0;
    }
    .footer {
      color: #86868b;
      font-size: 14px;
      line-height: 1.6;
      margin: 0 0 16px 0;
    }
    .signature {
      color: #C9A96E;
      font-size: 15px;
      font-weight: 500;
      margin: 24px 0 0 0;
    }
    .unsubscribe {
      text-align: center;
      margin-top: 30px;
      font-size: 12px;
      color: #86868b;
    }
    .unsubscribe a {
      color: #C9A96E;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <h1><span class="gold">Pawcasso</span> Atelier</h1>
    </div>

    <p class="greeting">Hi ${customerName},</p>

    <p>
      It's been a week since ${petName}'s portrait arrived, and we hope it's
      getting all the love it deserves! We'd be <strong style="color: #F5F5F7;">thrilled</strong>
      to hear how you're enjoying it.
    </p>

    <p>
      Would you take a moment to share your experience? Your review helps
      other pet parents discover us — and we have a thank-you gift for you.
    </p>

    <div class="reward-box">
      <p class="reward-heading">Share & Get Rewarded</p>
      <ul class="reward-list">
        <li><strong>25% off</strong> your next portrait</li>
        <li>Get <strong>featured</strong> on our homepage & Instagram</li>
        <li>Upload a photo of your portrait displayed at home</li>
        <li>Help other pet parents find us</li>
      </ul>
    </div>

    <div class="cta-container">
      <a href="${reviewUrl}" class="cta-button">
        Leave a Review & Upload Photo
      </a>
    </div>

    <div class="photo-tips">
      <h3>Photo Ideas for Your Review</h3>
      <p>We'd love to see your portrait in action! Here are some ideas:</p>
      <p>• Your portrait hanging on the wall or on a shelf</p>
      <p>• Your pet sitting next to their portrait</p>
      <p>• The portrait as a phone/laptop wallpaper</p>
      <p>• A framed print on display</p>
    </div>

    <div class="cta-container">
      <a href="https://instagram.com/pawcasso.atelier" class="secondary-button">
        Tag Us on Instagram @pawcasso.atelier
      </a>
    </div>

    <hr class="divider" />

    <p class="footer">
      Thank you for being part of the Pawcasso family! If you have any
      questions or need anything at all, just reply to this email.
    </p>

    <p class="signature">
      With gratitude,<br/>
      The Pawcasso Atelier Team
    </p>

    <div class="unsubscribe">
      <p>
        <a href="${baseUrl}">pawcasso-atelier.com</a> |
        <a href="https://instagram.com/pawcasso.atelier">@pawcasso.atelier</a>
      </p>
      <p>
        You're receiving this because you purchased a portrait from Pawcasso Atelier.
        <br/>
        <a href="${baseUrl}/unsubscribe">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
