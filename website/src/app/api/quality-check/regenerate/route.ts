import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, portrait_id } = body;

    if (!order_id) {
      return NextResponse.json(
        { error: "order_id is required" },
        { status: 400 }
      );
    }

    if (!portrait_id) {
      return NextResponse.json(
        { error: "portrait_id is required" },
        { status: 400 }
      );
    }

    // Get portrait details
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

    // TODO: Integrate with Manus API to regenerate portrait
    // For now, we'll just mark it as rejected with a note
    await sql`
      UPDATE quality_scores
      SET
        status = 'rejected',
        reviewed_at = NOW(),
        reviewer_notes = 'Regeneration requested - will be processed by fulfillment system'
      WHERE id = ${portrait_id}
    `;

    // In a real implementation, you would call the Manus API here:
    // const manusResponse = await fetch('https://api.manus.ai/v1/generate', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.MANUS_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     prompt: originalPrompt,
    //     image_url: portrait.original_photo_url,
    //     seed: Math.floor(Math.random() * 1000000), // Random seed for variation
    //   }),
    // });

    return NextResponse.json({
      success: true,
      message: "Regeneration request submitted",
      portrait_id,
      order_id,
    });
  } catch (error) {
    console.error("Error requesting regeneration:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
