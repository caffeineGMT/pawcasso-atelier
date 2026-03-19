export function generateTierUpgradeEmail({
  customerName,
  newTier,
  discountCode,
  discountPercent,
  pointsMultiplier,
  totalOrders,
  baseUrl,
}: {
  customerName: string;
  newTier: string;
  discountCode: string;
  discountPercent: number;
  pointsMultiplier: number;
  totalOrders: number;
  baseUrl: string;
}): string {
  const orderUrl = `${baseUrl}/order?discount=${discountCode}`;
  const portalUrl = `${baseUrl}/portal`;

  const tierEmoji: Record<string, string> = {
    silver: "🥈",
    gold: "🥇",
    platinum: "💎",
  };

  const tierColor: Record<string, string> = {
    silver: "#C0C0C0",
    gold: "#FFD700",
    platinum: "#E5E4E2",
  };

  const emoji = tierEmoji[newTier] || "🏆";
  const color = tierColor[newTier] || "#C9A96E";

  const nextTierInfo: Record<string, string> = {
    silver: "Order 2 more portraits to reach Gold (15% ongoing discount + 2x points)!",
    gold: "Order 3 more portraits to reach Platinum (20% ongoing discount + 3x points)!",
    platinum: "You've reached our highest tier! Enjoy maximum benefits on every order.",
  };

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
      color: ${color};
      margin-bottom: 20px;
      font-size: 28px;
    }
    p {
      line-height: 1.6;
      margin: 15px 0;
    }
    .upgrade-box {
      background: linear-gradient(135deg, rgba(${newTier === 'gold' ? '255, 215, 0' : newTier === 'platinum' ? '229, 228, 226' : '192, 192, 192'}, 0.1), rgba(0, 0, 0, 0.2));
      border: 2px solid ${color};
      border-radius: 16px;
      padding: 32px;
      margin: 30px 0;
      text-align: center;
    }
    .tier-badge {
      font-size: 64px;
      margin-bottom: 10px;
    }
    .tier-name {
      font-size: 36px;
      font-weight: 800;
      color: ${color};
      text-transform: uppercase;
      letter-spacing: 4px;
    }
    .benefit {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 16px;
      margin: 8px 0;
      text-align: left;
    }
    .benefit-icon {
      font-size: 20px;
      margin-right: 10px;
    }
    .discount-code {
      background: rgba(0, 0, 0, 0.4);
      border: 1px dashed ${color}80;
      padding: 12px 24px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 18px;
      color: ${color};
      letter-spacing: 2px;
      display: inline-block;
      margin: 15px 0;
    }
    .cta-button {
      display: inline-block;
      background: ${color};
      color: #000;
      padding: 16px 40px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 700;
      font-size: 16px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${emoji} Congratulations, ${customerName}!</h1>
    <p>You've been upgraded to <strong>${newTier.charAt(0).toUpperCase() + newTier.slice(1)}</strong> tier in the Pawcasso Loyalty Program!</p>

    <div class="upgrade-box">
      <div class="tier-badge">${emoji}</div>
      <div class="tier-name">${newTier}</div>
      <div style="color: #86868b; margin-top: 10px; font-size: 14px;">${totalOrders} portraits ordered</div>
    </div>

    <h2 style="color: ${color}; font-size: 20px;">Your ${newTier.charAt(0).toUpperCase() + newTier.slice(1)} Benefits</h2>
    <div class="benefit">
      <span class="benefit-icon">💰</span>
      <strong>${discountPercent}% off</strong> every future order
    </div>
    <div class="benefit">
      <span class="benefit-icon">⭐</span>
      <strong>${pointsMultiplier}x points</strong> on every purchase
    </div>
    <div class="benefit">
      <span class="benefit-icon">🎂</span>
      <strong>Birthday portraits</strong> with special discounts for your pets
    </div>
    <div class="benefit">
      <span class="benefit-icon">🎁</span>
      <strong>Exclusive rewards</strong> and early access to new styles
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <p style="color: #86868b; font-size: 14px;">Here's a welcome gift for your new tier:</p>
      <div class="discount-code">${discountCode}</div>
      <p style="color: #86868b; font-size: 13px;">${discountPercent}% off your next portrait (valid 60 days)</p>
      <a href="${orderUrl}" class="cta-button">Use Your Discount</a>
    </div>

    <p style="color: #86868b; font-size: 14px;">${nextTierInfo[newTier] || ""}</p>

    <p style="margin-top: 10px;">
      <a href="${portalUrl}" style="color: ${color}; text-decoration: underline;">View your loyalty dashboard →</a>
    </p>

    <p style="margin-top: 30px;">With love,<br/><strong>The Pawcasso Atelier Team</strong></p>
  </div>
</body>
</html>
  `;
}
