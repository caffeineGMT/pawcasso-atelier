import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const vitals = await req.json();

    // Log web vitals data
    console.log("[Web Vitals]", {
      name: vitals.name,
      value: vitals.value,
      rating: vitals.rating,
      id: vitals.id,
      navigationType: vitals.navigationType,
      timestamp: new Date().toISOString(),
    });

    // TODO: Store in database or send to analytics service
    // For now, just log to console
    // Future: Store in Vercel Analytics, PostHog, or custom DB

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Web Vitals tracking error:", error);
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}
