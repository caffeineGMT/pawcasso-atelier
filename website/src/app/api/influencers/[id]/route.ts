import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const influencer = await prisma.influencer.findUnique({
      where: { id },
      include: {
        outreachMessages: {
          orderBy: { sentAt: "desc" },
        },
        conversions: {
          orderBy: { conversionDate: "desc" },
        },
      },
    });

    if (!influencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    return NextResponse.json({ influencer });
  } catch (error) {
    console.error("Error fetching influencer:", error);
    return NextResponse.json({ error: "Failed to fetch influencer" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, notes, email, portraitSent } = body;

    const updateData: any = {};
    if (status) {
      updateData.status = status;
      // Auto-set timestamps based on status
      if (status === "contacted" && !updateData.contactedAt) {
        updateData.contactedAt = new Date();
      }
      if (status === "responded" && !updateData.respondedAt) {
        updateData.respondedAt = new Date();
      }
      if (status === "agreed" && !updateData.agreedAt) {
        updateData.agreedAt = new Date();
      }
      if (status === "posted" && !updateData.postedAt) {
        updateData.postedAt = new Date();
      }
    }
    if (notes !== undefined) updateData.notes = notes;
    if (email !== undefined) updateData.email = email;
    if (portraitSent !== undefined) updateData.portraitSent = portraitSent;

    const influencer = await prisma.influencer.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ influencer });
  } catch (error) {
    console.error("Error updating influencer:", error);
    return NextResponse.json({ error: "Failed to update influencer" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.influencer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting influencer:", error);
    return NextResponse.json({ error: "Failed to delete influencer" }, { status: 500 });
  }
}
