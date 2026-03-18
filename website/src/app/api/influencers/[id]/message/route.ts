import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const outreachMessage = await prisma.outreachMessage.create({
      data: {
        influencerId: params.id,
        message,
      },
    });

    // Update influencer status to "contacted" if not already
    await prisma.influencer.update({
      where: { id: params.id },
      data: {
        status: "contacted",
        contactedAt: new Date(),
      },
    });

    return NextResponse.json({ outreachMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
