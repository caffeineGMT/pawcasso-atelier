import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

// Sanitize filename to remove special characters
function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type (including HEIC)
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Please upload JPG, PNG, HEIC, or WebP.` },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit. Please choose a smaller image." },
        { status: 400 }
      );
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const sanitizedName = sanitizeFilename(file.name);
    const filename = `pet-photos/${timestamp}_${sanitizedName}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false, // We're already adding timestamp
    });

    return NextResponse.json({
      url: blob.url,
      filename: blob.pathname,
      size: file.size,
      type: file.type
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);

    const errorMessage = error instanceof Error ? error.message : "Failed to upload file";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
