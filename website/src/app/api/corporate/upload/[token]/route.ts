import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

/**
 * GET - Fetch employee data by upload token
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const employee = await prisma.corporateEmployee.findUnique({
      where: { uploadToken: token },
      include: {
        corporateOrder: true,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Invalid upload token" },
        { status: 404 }
      );
    }

    // Check if already uploaded
    if (employee.status !== "PENDING_PHOTO") {
      return NextResponse.json(
        { error: "Photo has already been uploaded for this link" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      employeeName: employee.employeeName,
      employeeEmail: employee.employeeEmail,
      companyName: employee.corporateOrder.companyName,
      status: employee.status,
    });
  } catch (error) {
    console.error("Fetch employee error:", error);
    return NextResponse.json(
      { error: "Failed to fetch employee data" },
      { status: 500 }
    );
  }
}

/**
 * POST - Update employee record with pet photo URL
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const { petPhotoUrl } = await req.json();

    if (!petPhotoUrl) {
      return NextResponse.json(
        { error: "Pet photo URL is required" },
        { status: 400 }
      );
    }

    const employee = await prisma.corporateEmployee.findUnique({
      where: { uploadToken: token },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Invalid upload token" },
        { status: 404 }
      );
    }

    if (employee.status !== "PENDING_PHOTO") {
      return NextResponse.json(
        { error: "Photo has already been uploaded" },
        { status: 400 }
      );
    }

    // Update employee record
    await prisma.corporateEmployee.update({
      where: { uploadToken: token },
      data: {
        petPhotoUrl,
        status: "PHOTO_UPLOADED",
        photoUploadedAt: new Date(),
      },
    });

    // TODO: Trigger portrait generation workflow here
    // For now, we just mark it as uploaded
    // In production, this would:
    // 1. Call portrait generation API
    // 2. Update status to "GENERATED"
    // 3. Send portrait to employee email
    // 4. Update portraitUrl and portraitDeliveredAt

    return NextResponse.json({
      success: true,
      message: "Photo uploaded successfully",
    });
  } catch (error) {
    console.error("Upload photo error:", error);
    return NextResponse.json(
      { error: "Failed to upload photo" },
      { status: 500 }
    );
  }
}
