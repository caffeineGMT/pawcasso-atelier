import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { utm_source, utm_medium, utm_campaign, subreddit, post_id, timestamp } = body;

    // Get IP address for basic analytics (optional)
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Log to Vercel Postgres for tracking
    await sql`
      INSERT INTO reddit_referrals (
        utm_source,
        utm_medium,
        utm_campaign,
        subreddit,
        post_id,
        ip_address,
        user_agent,
        timestamp
      ) VALUES (
        ${utm_source},
        ${utm_medium || "organic"},
        ${utm_campaign || "community"},
        ${subreddit || null},
        ${post_id || null},
        ${ip},
        ${userAgent},
        ${timestamp}
      )
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reddit referral tracking error:", error);

    // If table doesn't exist, create it
    if (error instanceof Error && error.message.includes("does not exist")) {
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS reddit_referrals (
            id SERIAL PRIMARY KEY,
            utm_source TEXT,
            utm_medium TEXT,
            utm_campaign TEXT,
            subreddit TEXT,
            post_id TEXT,
            ip_address TEXT,
            user_agent TEXT,
            timestamp TIMESTAMP,
            created_at TIMESTAMP DEFAULT NOW()
          )
        `;

        // Retry the insert
        const body = await req.json();
        const { utm_source, utm_medium, utm_campaign, subreddit, post_id, timestamp } = body;
        const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
        const userAgent = req.headers.get("user-agent") || "unknown";

        await sql`
          INSERT INTO reddit_referrals (
            utm_source, utm_medium, utm_campaign, subreddit, post_id, ip_address, user_agent, timestamp
          ) VALUES (
            ${utm_source}, ${utm_medium || "organic"}, ${utm_campaign || "community"},
            ${subreddit || null}, ${post_id || null}, ${ip}, ${userAgent}, ${timestamp}
          )
        `;

        return NextResponse.json({ success: true });
      } catch (createError) {
        console.error("Failed to create table:", createError);
        return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: false, error: "Failed to track referral" }, { status: 500 });
  }
}
