import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { getOrCreateLoyaltyMember } from "@/lib/loyalty";

const prisma = new PrismaClient();

// GET - List pet profiles for authenticated user
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const member = await getOrCreateLoyaltyMember(session.user.email);
    const pets = await prisma.petProfile.findMany({
      where: { loyaltyMemberId: member.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ pets });
  } catch (error) {
    console.error("Pet profiles error:", error);
    return NextResponse.json({ error: "Failed to get pet profiles" }, { status: 500 });
  }
}

// POST - Add or update a pet profile
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, species, breed, birthday, photoUrl } = body;

    if (!name) {
      return NextResponse.json({ error: "Pet name is required" }, { status: 400 });
    }

    const member = await getOrCreateLoyaltyMember(session.user.email);

    let birthdayDate: Date | null = null;
    let birthdayMonth: number | null = null;
    let birthdayDay: number | null = null;

    if (birthday) {
      birthdayDate = new Date(birthday);
      birthdayMonth = birthdayDate.getMonth() + 1;
      birthdayDay = birthdayDate.getDate();
    }

    const data = {
      name,
      species: species || "dog",
      breed: breed || null,
      birthday: birthdayDate,
      birthdayMonth,
      birthdayDay,
      photoUrl: photoUrl || null,
    };

    let pet;
    if (id) {
      // Update existing pet
      pet = await prisma.petProfile.update({
        where: { id, loyaltyMemberId: member.id },
        data,
      });
    } else {
      // Create new pet
      pet = await prisma.petProfile.create({
        data: {
          ...data,
          loyaltyMemberId: member.id,
        },
      });
    }

    return NextResponse.json({ pet });
  } catch (error) {
    console.error("Pet profile save error:", error);
    return NextResponse.json({ error: "Failed to save pet profile" }, { status: 500 });
  }
}

// DELETE - Remove a pet profile
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Pet ID required" }, { status: 400 });
    }

    const member = await getOrCreateLoyaltyMember(session.user.email);

    await prisma.petProfile.delete({
      where: { id, loyaltyMemberId: member.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Pet profile delete error:", error);
    return NextResponse.json({ error: "Failed to delete pet profile" }, { status: 500 });
  }
}
