import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createQualityScore } from "@/lib/quality-db";
import { Resend } from "resend";

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "placeholder",
  });
}

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || "placeholder");
}

interface QualityCheckRequest {
  portrait_urls: string[];
  original_photo_url: string;
  order_id: string;
  customer_email?: string;
}

interface QualityResult {
  score: number;
  face_visible: boolean;
  has_artifacts: boolean;
  color_accurate: boolean;
  notes: string;
}

interface QualityCheckResult {
  portrait_url: string;
  score: number;
  status: "approved" | "pending_review";
  needs_review: boolean;
  portrait_id: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: QualityCheckRequest = await request.json();
    const { portrait_urls, original_photo_url, order_id, customer_email } = body;

    if (!portrait_urls || !Array.isArray(portrait_urls) || portrait_urls.length === 0) {
      return NextResponse.json(
        { error: "portrait_urls is required and must be a non-empty array" },
        { status: 400 }
      );
    }

    if (!original_photo_url) {
      return NextResponse.json(
        { error: "original_photo_url is required" },
        { status: 400 }
      );
    }

    if (!order_id) {
      return NextResponse.json(
        { error: "order_id is required" },
        { status: 400 }
      );
    }

    const results: QualityCheckResult[] = [];
    const approvedPortraits: string[] = [];

    for (const portrait_url of portrait_urls) {
      try {
        // Call OpenAI Vision API to rate the portrait
        const openai = getOpenAI();
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Rate this AI-generated pet portrait on a 1-10 scale. Check the following:
- Face visibility (eyes/nose clear and well-defined)
- No distortions or artifacts (weird anatomy, blurry patches, missing features)
- Color accuracy vs original (colors match the reference photo)
- Artistic quality (professional, polished, ready to deliver)

Return JSON with this exact structure:
{
  "score": <number 1-10>,
  "face_visible": <boolean>,
  "has_artifacts": <boolean>,
  "color_accurate": <boolean>,
  "notes": "<brief explanation of the rating>"
}`,
                },
                {
                  type: "image_url",
                  image_url: { url: portrait_url },
                },
                {
                  type: "image_url",
                  image_url: { url: original_photo_url },
                },
              ],
            },
          ],
          response_format: { type: "json_object" },
          max_tokens: 500,
        });

        const responseText = completion.choices[0]?.message?.content;
        if (!responseText) {
          throw new Error("No response from OpenAI");
        }

        const qualityResult: QualityResult = JSON.parse(responseText);
        const score = qualityResult.score;
        const portrait_id = crypto.randomUUID();

        // Auto-approve if score >= 7
        const isApproved = score >= 7;
        const status = isApproved ? "approved" : "pending_review";

        // Save to database
        await createQualityScore({
          portrait_id,
          portrait_url,
          original_photo_url,
          order_id,
          score,
          status,
          auto_approved: isApproved,
        });

        results.push({
          portrait_url,
          score,
          status,
          needs_review: !isApproved,
          portrait_id,
        });

        if (isApproved) {
          approvedPortraits.push(portrait_url);
        }
      } catch (error) {
        console.error(`Error processing portrait ${portrait_url}:`, error);
        results.push({
          portrait_url,
          score: 0,
          status: "pending_review",
          needs_review: true,
          portrait_id: crypto.randomUUID(),
        });
      }
    }

    // Send email for auto-approved portraits
    if (approvedPortraits.length > 0 && customer_email) {
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
                Great news! Your AI-generated pet portrait has passed our quality checks and is ready for download.
              </p>
              <div style="margin: 30px 0;">
                ${approvedPortraits
                  .map(
                    (url) => `
                  <img src="${url}" alt="Pet Portrait" style="max-width: 100%; border-radius: 12px; margin-bottom: 20px;" />
                  <p style="text-align: center;">
                    <a href="${url}" download style="display: inline-block; background: #C9A96E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                      Download High-Res Portrait
                    </a>
                  </p>
                `
                  )
                  .join("")}
              </div>
              <p style="font-size: 14px; color: #666; margin-top: 40px;">
                Thank you for choosing Pawcasso Atelier!
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      results,
      auto_approved_count: approvedPortraits.length,
      needs_review_count: results.filter((r) => r.needs_review).length,
    });
  } catch (error) {
    console.error("Error in quality check:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
