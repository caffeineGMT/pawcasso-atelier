import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/instagram/posts - Fetch featured Instagram posts
export async function GET() {
  try {
    const posts = await prisma.instagramPost.findMany({
      where: { featured: true },
      orderBy: { postedAt: "desc" },
      take: 12,
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching Instagram posts:", error);
    return NextResponse.json({ posts: [] });
  }
}
