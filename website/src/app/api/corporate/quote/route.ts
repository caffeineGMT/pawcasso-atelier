import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Calculate estimated value based on team size using volume pricing tiers
 */
function calculateEstimatedValue(teamSize: number): number {
  if (teamSize >= 100) {
    return teamSize * 10; // $10 per portrait for 100+
  } else if (teamSize >= 50) {
    return teamSize * 12; // $12 per portrait for 50-99
  } else if (teamSize >= 10) {
    return teamSize * 15; // $15 per portrait for 10-49
  }
  return teamSize * 15; // Default to $15
}

/**
 * Send Slack notification to admin about new corporate quote request
 */
async function sendSlackNotification(inquiry: any) {
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!slackWebhookUrl) {
    console.log("[DEV] Slack webhook not configured - skipping notification");
    return;
  }

  try {
    const message = {
      text: "🏢 New Corporate Quote Request",
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🏢 New Corporate Quote Request",
            emoji: true,
          },
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Company:*\n${inquiry.companyName}`,
            },
            {
              type: "mrkdwn",
              text: `*Contact:*\n${inquiry.contactName}`,
            },
            {
              type: "mrkdwn",
              text: `*Email:*\n${inquiry.email}`,
            },
            {
              type: "mrkdwn",
              text: `*Team Size:*\n${inquiry.teamSize} portraits`,
            },
            {
              type: "mrkdwn",
              text: `*Use Case:*\n${inquiry.useCase.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}`,
            },
            {
              type: "mrkdwn",
              text: `*Estimated Value:*\n$${inquiry.estimatedValue.toFixed(2)}`,
            },
          ],
        },
      ],
    };

    if (inquiry.preferredDeliveryDate) {
      (message.blocks as any[]).push({
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Preferred Delivery:*\n${new Date(inquiry.preferredDeliveryDate).toLocaleDateString()}`,
          },
        ],
      });
    }

    if (inquiry.notes) {
      (message.blocks as any[]).push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Notes:*\n${inquiry.notes}`,
        },
      });
    }

    (message.blocks as any[]).push({
      type: "divider",
    });

    (message.blocks as any[]).push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Action Required:* Review and send custom quote within 24 hours`,
      },
    });

    const response = await fetch(slackWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error("Failed to send Slack notification:", await response.text());
    } else {
      console.log("Slack notification sent successfully");
    }
  } catch (error) {
    console.error("Error sending Slack notification:", error);
  }
}

/**
 * Send auto-reply email to customer confirming quote request
 */
async function sendCustomerEmail(inquiry: any) {
  if (!resend) {
    console.log(`[DEV] Would send confirmation email to ${inquiry.email}`);
    return;
  }

  try {
    await resend.emails.send({
      from: "Pawcasso Atelier <noreply@pawcasso-atelier.com>",
      to: inquiry.email,
      subject: "Quote Request Received - Pawcasso Corporate Gifting",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Quote Request Received</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Pawcasso Atelier</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Corporate Gifting</p>
          </div>

          <div style="background: white; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">

            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Thanks for your interest!</h2>

            <p style="color: #4b5563; margin: 0 0 20px 0; font-size: 16px;">
              Hi ${inquiry.contactName},
            </p>

            <p style="color: #4b5563; margin: 0 0 20px 0; font-size: 16px;">
              We've received your corporate quote request for <strong>${inquiry.companyName}</strong>. Our team is excited to help you delight your team with custom pet portraits!
            </p>

            <div style="background: #f9fafb; border-left: 4px solid #D4AF37; padding: 20px; margin: 30px 0; border-radius: 4px;">
              <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">Your Request Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Team Size:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: 600; font-size: 14px; text-align: right;">${inquiry.teamSize} portraits</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Use Case:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: 600; font-size: 14px; text-align: right;">${inquiry.useCase.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Estimated Value:</td>
                  <td style="padding: 8px 0; color: #10b981; font-weight: 700; font-size: 16px; text-align: right;">$${inquiry.estimatedValue.toFixed(2)}</td>
                </tr>
              </table>
            </div>

            <h3 style="color: #1f2937; margin: 30px 0 15px 0; font-size: 20px;">What happens next?</h3>

            <div style="margin: 0 0 15px 0;">
              <div style="display: flex; align-items: start; margin-bottom: 15px;">
                <div style="background: #D4AF37; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-right: 12px; font-weight: bold; font-size: 12px;">1</div>
                <p style="color: #4b5563; margin: 0; font-size: 15px;">Your dedicated account manager will review your requirements</p>
              </div>
              <div style="display: flex; align-items: start; margin-bottom: 15px;">
                <div style="background: #D4AF37; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-right: 12px; font-weight: bold; font-size: 12px;">2</div>
                <p style="color: #4b5563; margin: 0; font-size: 15px;">We'll send your custom quote within 24 hours to <strong>${inquiry.email}</strong></p>
              </div>
              <div style="display: flex; align-items: start;">
                <div style="background: #D4AF37; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-right: 12px; font-weight: bold; font-size: 12px;">3</div>
                <p style="color: #4b5563; margin: 0; font-size: 15px;">We'll schedule a call to discuss timeline and customization options</p>
              </div>
            </div>

            <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 15px; margin: 30px 0; border-radius: 4px;">
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                <strong>📧 Keep an eye on your inbox!</strong> Our team will reach out within 24 hours with your personalized quote.
              </p>
            </div>

            <p style="color: #4b5563; margin: 30px 0 20px 0; font-size: 16px;">
              In the meantime, feel free to explore our <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://pawcasso-atelier.vercel.app'}/gallery" style="color: #667eea; text-decoration: none; font-weight: 600;">gallery</a> to see the stunning portraits we've created.
            </p>

            <div style="border-top: 1px solid #e5e7eb; margin-top: 40px; padding-top: 30px;">
              <p style="color: #4b5563; margin: 0 0 10px 0; font-size: 16px;">
                Questions? We're here to help!
              </p>
              <p style="color: #6b7280; margin: 0; font-size: 14px;">
                Reply to this email or DM us on Instagram <a href="https://instagram.com/pawcasso.atelier" style="color: #667eea; text-decoration: none;">@pawcasso.atelier</a>
              </p>
            </div>

            <div style="margin-top: 40px;">
              <p style="color: #4b5563; margin: 0 0 5px 0; font-size: 16px;">Best regards,</p>
              <p style="color: #1f2937; margin: 0; font-size: 16px; font-weight: 600;">The Pawcasso Atelier Team</p>
            </div>

          </div>

          <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p style="margin: 0 0 5px 0;">© ${new Date().getFullYear()} Pawcasso Atelier. All rights reserved.</p>
            <p style="margin: 0;">Delight your team with custom pet portraits</p>
          </div>

        </body>
        </html>
      `,
    });

    console.log(`Confirmation email sent to ${inquiry.email}`);
  } catch (error) {
    console.error("Error sending customer email:", error);
    // Don't throw - email failure shouldn't block the quote request
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      companyName,
      contactName,
      email,
      teamSize,
      useCase,
      preferredDeliveryDate,
      notes,
      utmSource,
      utmMedium,
      utmCampaign,
    } = body;

    // Validation
    if (!companyName || !contactName || !email || !teamSize || !useCase) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Validate team size (minimum 10 for corporate orders)
    if (teamSize < 10) {
      return NextResponse.json(
        { error: "Corporate orders require a minimum of 10 portraits" },
        { status: 400 }
      );
    }

    // Calculate estimated value based on volume pricing
    const estimatedValue = calculateEstimatedValue(teamSize);

    // Create corporate inquiry in database
    const inquiry = await prisma.corporateInquiry.create({
      data: {
        companyName,
        contactName,
        email,
        teamSize,
        useCase,
        preferredDeliveryDate: preferredDeliveryDate ? new Date(preferredDeliveryDate) : null,
        notes: notes || null,
        estimatedValue,
        status: "PENDING",
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
      },
    });

    // Send Slack notification to admin (non-blocking)
    sendSlackNotification(inquiry).catch((err) => {
      console.error("Failed to send Slack notification:", err);
    });

    // Send auto-reply email to customer (non-blocking)
    sendCustomerEmail(inquiry).catch((err) => {
      console.error("Failed to send customer email:", err);
    });

    // Return success response
    return NextResponse.json({
      success: true,
      inquiry: {
        id: inquiry.id,
        estimatedValue: inquiry.estimatedValue,
        status: inquiry.status,
      },
      message: "Quote request received successfully. We'll send your custom quote within 24 hours.",
    });
  } catch (error) {
    console.error("Corporate quote request error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit quote request" },
      { status: 500 }
    );
  }
}
