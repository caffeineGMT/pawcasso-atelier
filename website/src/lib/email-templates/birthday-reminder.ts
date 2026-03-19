export function generateBirthdayReminderEmail({
  customerName,
  petName,
  petSpecies,
  discountCode,
  baseUrl,
}: {
  customerName: string;
  petName: string;
  petSpecies: string;
  discountCode: string;
  baseUrl: string;
}): string {
  const orderUrl = `${baseUrl}/order?discount=${discountCode}`;
  const speciesEmoji = petSpecies === "cat" ? "🐱" : petSpecies === "bird" ? "🐦" : petSpecies === "rabbit" ? "🐰" : "🐶";

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
    p {
      line-height: 1.6;
      margin: 15px 0;
    }
    .birthday-box {
      background: linear-gradient(135deg, rgba(255, 182, 193, 0.15), rgba(201, 169, 110, 0.1));
      border: 2px solid rgba(201, 169, 110, 0.3);
      border-radius: 16px;
      padding: 32px;
      margin: 30px 0;
      text-align: center;
    }
    .birthday-emoji {
      font-size: 64px;
      margin-bottom: 10px;
    }
    .discount-amount {
      font-size: 42px;
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
    .expiry {
      color: #86868b;
      font-size: 13px;
      margin-top: 10px;
    }
    .suggestion-grid {
      display: grid;
      gap: 12px;
      margin: 20px 0;
    }
    .suggestion {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 16px;
    }
    .suggestion strong {
      color: #C9A96E;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Happy Birthday, ${petName}! ${speciesEmoji}</h1>
    <p>Hi ${customerName},</p>
    <p>It's ${petName}'s special day (or close to it)! We think every birthday deserves a portrait to celebrate.</p>
    <p>To help you celebrate, here's a special birthday discount just for ${petName}:</p>

    <div class="birthday-box">
      <div class="birthday-emoji">🎂🎉${speciesEmoji}</div>
      <div style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #86868b;">${petName}'s Birthday Special</div>
      <div class="discount-amount">25% OFF</div>
      <div style="color: #86868b; margin-bottom: 10px;">A birthday portrait for ${petName}</div>
      <div class="discount-code">${discountCode}</div>
      <div class="expiry">Valid for 30 days</div>
      <div style="margin-top: 20px;">
        <a href="${orderUrl}" class="cta-button">Create Birthday Portrait</a>
      </div>
    </div>

    <div style="margin: 30px 0;">
      <h2 style="color: #C9A96E; font-size: 18px;">Birthday Portrait Ideas</h2>
      <div class="suggestion-grid">
        <div class="suggestion">
          <strong>Party Hat & Cake</strong> - ${petName} celebrating with a festive birthday setup
        </div>
        <div class="suggestion">
          <strong>Royal Portrait</strong> - ${petName} as royalty on their special day
        </div>
        <div class="suggestion">
          <strong>Age Milestone</strong> - Capture this year's personality in a timeless style
        </div>
      </div>
    </div>

    <p>From all of us at Pawcasso, happy birthday to ${petName}!</p>
    <p style="margin-top: 30px;">With love,<br/><strong>The Pawcasso Atelier Team</strong></p>
  </div>
</body>
</html>
  `;
}
