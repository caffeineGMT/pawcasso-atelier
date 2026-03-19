export function generatePostDeliveryReferralEmail({
  customerName,
  petName,
  referralCode,
  baseUrl,
}: {
  customerName: string;
  petName: string;
  referralCode: string;
  baseUrl: string;
}): string {
  const referralLink = `${baseUrl}/refer/${referralCode}`;
  const shareMessage = encodeURIComponent(
    `I just got the cutest AI portrait of ${petName} from Pawcasso Atelier! Get 20% off yours: ${referralLink}`
  );

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
    h1 {
      color: #E07A5F;
      margin-bottom: 8px;
      font-size: 26px;
      line-height: 1.2;
    }
    h2 {
      color: #E07A5F;
      margin: 30px 0 15px;
      font-size: 20px;
    }
    p {
      line-height: 1.6;
      margin: 15px 0;
      color: #F5F5F7;
    }
    .subtitle {
      color: #86868b;
      font-size: 15px;
    }
    .reward-box {
      background: linear-gradient(135deg, rgba(224, 122, 95, 0.15), rgba(244, 162, 97, 0.1));
      border: 1px solid rgba(224, 122, 95, 0.3);
      border-radius: 16px;
      padding: 30px;
      margin: 30px 0;
      text-align: center;
    }
    .reward-amount {
      font-size: 48px;
      font-weight: 700;
      color: #E07A5F;
      line-height: 1;
    }
    .reward-label {
      color: #86868b;
      font-size: 14px;
      margin-top: 8px;
    }
    .how-it-works {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      padding: 24px;
      margin: 20px 0;
    }
    .step {
      display: flex;
      align-items: flex-start;
      margin-bottom: 16px;
    }
    .step:last-child {
      margin-bottom: 0;
    }
    .step-number {
      background: rgba(224, 122, 95, 0.15);
      color: #E07A5F;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 600;
      margin-right: 12px;
      flex-shrink: 0;
    }
    .step-text {
      color: #86868b;
      font-size: 14px;
      line-height: 1.5;
      padding-top: 3px;
    }
    .referral-link-box {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(224, 122, 95, 0.2);
      padding: 14px 18px;
      border-radius: 10px;
      font-family: monospace;
      font-size: 14px;
      color: #E07A5F;
      margin: 16px 0;
      word-break: break-all;
      text-align: center;
    }
    .cta-button {
      display: inline-block;
      background: #E07A5F;
      color: #fff;
      padding: 14px 32px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      margin: 10px 5px;
    }
    .social-buttons {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin: 24px 0;
      flex-wrap: wrap;
    }
    .social-btn {
      display: inline-block;
      padding: 10px 20px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      color: white;
    }
    .whatsapp { background: #25D366; }
    .facebook { background: #1877F2; }
    .instagram { background: linear-gradient(135deg, #833AB4, #FD1D1D, #F77737); }
    .divider {
      border: none;
      border-top: 1px solid #1d1d1f;
      margin: 30px 0;
    }
    .footer {
      color: #86868b;
      font-size: 12px;
      text-align: center;
      margin-top: 30px;
    }
    .footer a {
      color: #E07A5F;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Love ${petName}'s portrait?</h1>
    <p class="subtitle">Share the joy with friends and earn rewards.</p>

    <p>Hi ${customerName},</p>
    <p>
      We hope ${petName}'s portrait is getting all the compliments it deserves!
      Now here's the best part - you can earn <strong>$5 credit</strong> every time
      a friend orders their own portrait.
    </p>

    <div class="reward-box">
      <div class="reward-amount">$5</div>
      <div class="reward-label">for every friend who orders</div>
      <p style="margin: 16px 0 0; font-size: 14px; color: #86868b;">
        Your friends get <strong style="color: #F5F5F7;">20% off</strong> their first portrait too!
      </p>
    </div>

    <div class="how-it-works">
      <div class="step">
        <span class="step-number">1</span>
        <span class="step-text">Share your unique referral link with pet-loving friends</span>
      </div>
      <div class="step">
        <span class="step-number">2</span>
        <span class="step-text">They get 20% off their first AI pet portrait</span>
      </div>
      <div class="step">
        <span class="step-number">3</span>
        <span class="step-text">You earn $5 credit for each friend who purchases</span>
      </div>
    </div>

    <h2 style="text-align: center; margin-top: 30px;">Your Referral Link</h2>
    <div class="referral-link-box">${referralLink}</div>

    <div style="text-align: center; margin: 24px 0;">
      <a href="${baseUrl}/dashboard" class="cta-button">View Your Dashboard</a>
    </div>

    <p style="text-align: center; color: #86868b; font-size: 14px; margin: 20px 0 8px;">
      Or share directly:
    </p>
    <div class="social-buttons">
      <a href="https://wa.me/?text=${shareMessage}" class="social-btn whatsapp">WhatsApp</a>
      <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}" class="social-btn facebook">Facebook</a>
    </div>

    <hr class="divider" />

    <p style="color: #86868b; font-size: 13px; text-align: center;">
      <strong style="color: #E07A5F;">Bonus:</strong> Refer 5 friends and unlock a free Premium portrait worth $29!
    </p>

    <hr class="divider" />

    <p style="margin-top: 30px;">
      Thank you for being part of the Pawcasso family!<br/>
      <strong>The Pawcasso Atelier Team</strong>
    </p>

    <div class="footer">
      <p>
        <a href="${baseUrl}">pawcasso-atelier.com</a> |
        <a href="https://instagram.com/pawcasso.atelier">@pawcasso.atelier</a>
      </p>
      <p style="margin-top: 10px;">
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
