export function generateOrderCompleteEmailWithReferral({
  customerName,
  petName,
  style,
  portraitUrls,
  portraitCount,
  referralCode,
  baseUrl,
}: {
  customerName: string;
  petName: string;
  style: string;
  portraitUrls: string[];
  portraitCount: number;
  referralCode: string;
  baseUrl: string;
}): string {
  const portraitLinksHtml = portraitUrls
    .map(
      (url, index) =>
        `<a href="${url}" style="display: inline-block; background: #C9A96E; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 10px 5px;">Download Portrait ${
          index + 1
        }</a>`
    )
    .join("\n");

  const referralLink = `${baseUrl}/order?ref=${referralCode}`;
  const shareMessage = encodeURIComponent(
    `Just got an amazing AI portrait of ${petName} for $9! Use my link for 20% off: ${referralLink}`
  );

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
    .portrait {
      margin: 30px 0;
      text-align: center;
    }
    .download-btn {
      display: inline-block;
      background: #C9A96E;
      color: #000;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      margin: 10px 5px;
    }
    .download-btn:hover {
      background: #E8D5A8;
    }
    p {
      line-height: 1.6;
      margin: 15px 0;
    }
    .referral-box {
      background: linear-gradient(135deg, rgba(201, 169, 110, 0.1), rgba(201, 169, 110, 0.05));
      border: 1px solid rgba(201, 169, 110, 0.3);
      border-radius: 12px;
      padding: 24px;
      margin: 30px 0;
      text-align: center;
    }
    .referral-link {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 12px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 14px;
      color: #C9A96E;
      margin: 15px 0;
      word-break: break-all;
    }
    .social-buttons {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin: 20px 0;
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
    .twitter { background: #000; }
    .highlight {
      background: rgba(81, 207, 102, 0.1);
      border-left: 3px solid #51cf66;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Your Pawcasso Portrait is Ready! 🎨</h1>
    <p>Hi ${customerName},</p>
    <p>We're thrilled to deliver ${petName}'s stunning AI-generated portrait${
    portraitCount > 1 ? "s" : ""
  } in the <strong>${style}</strong> style!</p>

    <div class="portrait">
      <h3 style="color: #C9A96E; margin-bottom: 20px;">Download Your Portrait${
        portraitCount > 1 ? "s" : ""
      }:</h3>
      ${portraitLinksHtml}
    </div>

    <p>These high-resolution files are ready for printing or sharing on social media.</p>
    <p><strong>Pro tip:</strong> Tag us <a href="https://instagram.com/pawcasso.atelier" style="color: #C9A96E;">@pawcasso.atelier</a> on Instagram and get featured in our gallery!</p>

    <h2>🎁 Share & Earn $5</h2>
    <div class="referral-box">
      <p style="font-size: 18px; font-weight: 600; margin-bottom: 10px;">Give friends 20% off • You get $5 credit</p>
      <p style="color: #86868b; font-size: 14px;">Your unique referral link:</p>
      <div class="referral-link">${referralLink}</div>

      <div class="highlight">
        <strong>✨ Bonus:</strong> Refer 5 friends → Unlock a free Premium portrait (worth $29)!
      </div>

      <p style="margin: 20px 0 10px; font-size: 14px; color: #86868b;">Share now:</p>
      <div class="social-buttons">
        <a href="https://wa.me/?text=${shareMessage}" class="social-btn whatsapp">WhatsApp</a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}" class="social-btn facebook">Facebook</a>
        <a href="https://twitter.com/intent/tweet?text=${shareMessage}" class="social-btn twitter">Twitter</a>
      </div>

      <p style="margin-top: 20px;">
        <a href="${baseUrl}/portal" style="color: #C9A96E; text-decoration: underline;">View your referral dashboard →</a>
      </p>
    </div>

    <p style="margin-top: 30px;">With love,<br/><strong>The Pawcasso Atelier Team</strong></p>
  </div>
</body>
</html>
  `;
}
