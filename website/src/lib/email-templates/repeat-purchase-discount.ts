export function generateRepeatPurchaseEmail({
  customerName,
  petName,
  discountCode,
  baseUrl,
}: {
  customerName: string;
  petName: string;
  discountCode: string;
  baseUrl: string;
}): string {
  const orderUrl = `${baseUrl}/order?discount=${discountCode}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #000;
      color: #F5F5F7;
      padding: 40px;
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
    h1 {
      color: #C9A96E;
      margin-bottom: 20px;
      font-size: 28px;
    }
    h2 {
      color: #C9A96E;
      margin: 30px 0 15px;
      font-size: 20px;
    }
    p {
      line-height: 1.6;
      margin: 15px 0;
    }
    .discount-box {
      background: linear-gradient(135deg, rgba(201, 169, 110, 0.15), rgba(201, 169, 110, 0.05));
      border: 2px solid rgba(201, 169, 110, 0.4);
      border-radius: 16px;
      padding: 32px;
      margin: 30px 0;
      text-align: center;
    }
    .discount-amount {
      font-size: 48px;
      font-weight: 800;
      color: #C9A96E;
      margin: 10px 0;
    }
    .discount-code {
      background: rgba(0, 0, 0, 0.4);
      border: 1px dashed rgba(201, 169, 110, 0.5);
      padding: 12px 24px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 18px;
      color: #C9A96E;
      letter-spacing: 2px;
      display: inline-block;
      margin: 15px 0;
    }
    .cta-button {
      display: inline-block;
      background: #C9A96E;
      color: #000;
      padding: 16px 40px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 700;
      font-size: 16px;
      margin: 20px 0;
    }
    .ideas {
      display: grid;
      gap: 12px;
      margin: 20px 0;
    }
    .idea {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 16px;
    }
    .idea-title {
      font-weight: 600;
      color: #C9A96E;
      font-size: 15px;
    }
    .idea-desc {
      color: #86868b;
      font-size: 13px;
      margin-top: 4px;
    }
    .expiry {
      color: #86868b;
      font-size: 13px;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>We Miss ${petName}! Come Back for 20% Off</h1>
    <p>Hi ${customerName},</p>
    <p>We loved creating ${petName}'s portrait, and we'd love to do it again! As a thank you for being a Pawcasso customer, here's an exclusive discount on your next portrait:</p>

    <div class="discount-box">
      <div style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #86868b;">Exclusive Repeat Customer Discount</div>
      <div class="discount-amount">20% OFF</div>
      <div style="color: #86868b; margin-bottom: 10px;">Your next portrait</div>
      <div class="discount-code">${discountCode}</div>
      <div class="expiry">Valid for 90 days</div>
      <div style="margin-top: 20px;">
        <a href="${orderUrl}" class="cta-button">Order Another Portrait</a>
      </div>
    </div>

    <h2>Ideas for Your Next Portrait</h2>
    <div class="ideas">
      <div class="idea">
        <div class="idea-title">Try a Different Art Style</div>
        <div class="idea-desc">Renaissance, Pop Art, Watercolor, Anime... ${petName} in a whole new light!</div>
      </div>
      <div class="idea">
        <div class="idea-title">Gift for a Fellow Pet Parent</div>
        <div class="idea-desc">Know someone who'd love a portrait of their fur baby? The perfect gift.</div>
      </div>
      <div class="idea">
        <div class="idea-title">Create a Gallery Wall</div>
        <div class="idea-desc">Multiple styles of ${petName} make an amazing gallery wall display.</div>
      </div>
      <div class="idea">
        <div class="idea-title">Seasonal Portrait</div>
        <div class="idea-desc">${petName} in a holiday, birthday, or seasonal themed portrait!</div>
      </div>
    </div>

    <p style="margin-top: 30px;">With love,<br/><strong>The Pawcasso Atelier Team</strong></p>
  </div>
</body>
</html>
  `;
}
