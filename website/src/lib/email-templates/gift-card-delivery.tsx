import * as React from "react";

interface GiftCardEmailProps {
  recipientName: string;
  senderName: string;
  giftCardCode: string;
  amount: number;
  message?: string;
  expiresAt: string;
}

export const GiftCardEmail = ({
  recipientName,
  senderName,
  giftCardCode,
  amount,
  message,
  expiresAt,
}: GiftCardEmailProps) => {
  const redeemUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://pawcasso-atelier.vercel.app"}/order?gift_card=${giftCardCode}`;
  const formattedExpiry = new Date(expiresAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You've Received a Pawcasso Gift Card!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #FEF3E2 0%, #FFFFFF 50%, #FFF1F3 100%);">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);" cellspacing="0" cellpadding="0" border="0">

          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #C9A96E 0%, #D4B982 100%); padding: 40px 32px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                🎁 You've Got a Gift!
              </h1>
            </td>
          </tr>

          <!-- Main content -->
          <tr>
            <td style="padding: 40px 32px;">
              <p style="margin: 0 0 24px; font-size: 18px; line-height: 1.6; color: #1f2937;">
                Hi <strong>${recipientName}</strong>,
              </p>

              <p style="margin: 0 0 24px; font-size: 18px; line-height: 1.6; color: #1f2937;">
                <strong>${senderName}</strong> has sent you a <span style="color: #C9A96E; font-weight: 600;">$${amount} gift card</span> for a beautiful AI-generated pet portrait!
              </p>

              ${
                message
                  ? `
              <div style="background: #FEF3E2; border-left: 4px solid #C9A96E; padding: 20px; margin: 24px 0; border-radius: 8px;">
                <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #6b7280; font-style: italic;">
                  "${message}"
                </p>
                <p style="margin: 12px 0 0; font-size: 14px; color: #9ca3af;">
                  — ${senderName}
                </p>
              </div>
              `
                  : ""
              }

              <!-- Gift Card Code Display -->
              <div style="background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%); border: 2px dashed #C9A96E; border-radius: 12px; padding: 32px; margin: 32px 0; text-align: center;">
                <p style="margin: 0 0 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; font-weight: 600;">
                  Your Gift Card Code
                </p>
                <p style="margin: 0 0 24px; font-size: 32px; font-weight: 700; color: #C9A96E; letter-spacing: 2px; font-family: 'Courier New', monospace;">
                  ${giftCardCode}
                </p>
                <a href="${redeemUrl}" style="display: inline-block; background: #C9A96E; color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px; transition: background 0.2s;">
                  Create Your Portrait Now →
                </a>
              </div>

              <!-- How it Works -->
              <div style="margin: 32px 0;">
                <h2 style="margin: 0 0 20px; font-size: 20px; font-weight: 600; color: #1f2937;">
                  How to Use Your Gift Card
                </h2>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="padding: 12px 0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="width: 40px; vertical-align: top;">
                            <div style="width: 32px; height: 32px; background: #FEF3E2; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                              1️⃣
                            </div>
                          </td>
                          <td style="vertical-align: top;">
                            <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                              <strong>Visit the order page</strong> using the button above or go to pawcasso-atelier.vercel.app/order
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 12px 0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="width: 40px; vertical-align: top;">
                            <div style="width: 32px; height: 32px; background: #FEF3E2; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                              2️⃣
                            </div>
                          </td>
                          <td style="vertical-align: top;">
                            <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                              <strong>Enter your gift card code</strong> at checkout to apply your credit
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 12px 0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="width: 40px; vertical-align: top;">
                            <div style="width: 32px; height: 32px; background: #FEF3E2; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                              3️⃣
                            </div>
                          </td>
                          <td style="vertical-align: top;">
                            <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                              <strong>Choose your style and upload</strong> your pet's photo
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 12px 0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="width: 40px; vertical-align: top;">
                            <div style="width: 32px; height: 32px; background: #FEF3E2; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                              4️⃣
                            </div>
                          </td>
                          <td style="vertical-align: top;">
                            <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                              <strong>Receive your beautiful portrait</strong> within 24 hours!
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Bonus -->
              <div style="background: #F0FDF4; border: 1px solid #86EFAC; border-radius: 12px; padding: 20px; margin: 32px 0;">
                <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #166534;">
                  <strong>💚 Bonus for ${senderName}:</strong> When you make your first purchase, ${senderName} will receive 10% credit toward their next order as a thank you for sharing Pawcasso!
                </p>
              </div>

              <!-- Expiry Notice -->
              <p style="margin: 32px 0 0; font-size: 14px; color: #9ca3af; text-align: center;">
                This gift card is valid until <strong>${formattedExpiry}</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #F9FAFB; padding: 32px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0 0 12px; font-size: 14px; color: #6b7280;">
                Questions? We're here to help!
              </p>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                Reply to this email or visit our <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://pawcasso-atelier.vercel.app"}" style="color: #C9A96E; text-decoration: none;">website</a>
              </p>
              <p style="margin: 16px 0 0; font-size: 12px; color: #9ca3af;">
                © ${new Date().getFullYear()} Pawcasso Atelier. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

export default GiftCardEmail;
