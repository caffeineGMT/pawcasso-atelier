import { NextRequest, NextResponse } from "next/server";
import { approvePortrait } from "@/lib/quality-db";
import { sql } from "@vercel/postgres";
import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || "placeholder");
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { portrait_id, reviewer_notes, customer_email } = body;

    if (!portrait_id) {
      return NextResponse.json(
        { error: "portrait_id is required" },
        { status: 400 }
      );
    }

    // Get portrait details before approving
    const result = await sql`
      SELECT * FROM quality_scores
      WHERE id = ${portrait_id}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Portrait not found" },
        { status: 404 }
      );
    }

    const portrait = result.rows[0];

    // Approve the portrait
    await approvePortrait(portrait_id, reviewer_notes);

    // Send email with download link if customer email is provided
    if (customer_email) {
      try {
        const resend = getResend();
        await resend.emails.send({
          from: "Pawcasso Atelier <orders@pawcasso.art>",
          to: customer_email,
          subject: "Your Pet Portrait is Ready! 🎨",
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #C9A96E; font-size: 28px; margin-bottom: 20px;">Your Portrait is Ready!</h1>
              <p style="font-size: 16px; line-height: 1.6; color: #333;">
                Great news! Your AI-generated pet portrait has been reviewed and approved by our team.
              </p>
              <div style="margin: 30px 0; text-align: center;">
                <img src="${portrait.portrait_url}" alt="Pet Portrait" style="max-width: 100%; border-radius: 12px; margin-bottom: 20px;" />
                <p>
                  <a href="${portrait.portrait_url}" download style="display: inline-block; background: #C9A96E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                    Download High-Res Portrait
                  </a>
                </p>
              </div>
              ${
                reviewer_notes
                  ? `<p style="font-size: 14px; color: #666; font-style: italic; margin-top: 20px;">Reviewer note: ${reviewer_notes}</p>`
                  : ""
              }
              <p style="font-size: 14px; color: #666; margin-top: 40px;">
                Thank you for choosing Pawcasso Atelier!
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Error sending approval email:", emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error approving portrait:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
