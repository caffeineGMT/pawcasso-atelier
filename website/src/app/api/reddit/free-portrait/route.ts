import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const { name, email, redditUsername, style, petName, notes, petPhotoUrl } = body;

    // Validate required fields
    if (!name || !email || !redditUsername || !style || !petName || !petPhotoUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Store the request in the database
    await sql`
      INSERT INTO free_portrait_requests (
        name,
        email,
        reddit_username,
        style,
        pet_name,
        notes,
        pet_photo_url,
        status,
        submitted_at
      ) VALUES (
        ${name},
        ${email},
        ${redditUsername},
        ${style},
        ${petName},
        ${notes || null},
        ${petPhotoUrl},
        'pending',
        NOW()
      )
    `;

    // Send confirmation email to the user
    await resend.emails.send({
      from: "Pawcasso Atelier <noreply@pawcasso-atelier.vercel.app>",
      to: email,
      subject: "Free Portrait Request Received!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #C9A96E; font-size: 28px; margin-bottom: 20px;">Thank You, ${name}!</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            We've received your free portrait request for <strong>${petName}</strong> in the <strong>${style}</strong> style.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            I'll create your portrait and email it to you within <strong>48 hours</strong>.
          </p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #C9A96E;">Request Details:</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="margin-bottom: 8px;"><strong>Pet Name:</strong> ${petName}</li>
              <li style="margin-bottom: 8px;"><strong>Art Style:</strong> ${style}</li>
              <li style="margin-bottom: 8px;"><strong>Reddit Username:</strong> ${redditUsername}</li>
              ${notes ? `<li style="margin-bottom: 8px;"><strong>Special Requests:</strong> ${notes}</li>` : ""}
            </ul>
          </div>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Once you receive your portrait, I'd love your feedback! Just reply to this email or tag me on Reddit.
          </p>
          <p style="font-size: 14px; color: #999; margin-top: 30px;">
            — Pawcasso Atelier<br>
            <a href="https://pawcasso-atelier.vercel.app" style="color: #C9A96E;">pawcasso-atelier.vercel.app</a>
          </p>
        </div>
      `,
    });

    // Send notification to yourself (the creator)
    await resend.emails.send({
      from: "Pawcasso Atelier <noreply@pawcasso-atelier.vercel.app>",
      to: process.env.ADMIN_EMAIL || "michaelguo@meta.com",
      subject: `🎨 New Free Portrait Request from Reddit (${redditUsername})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #C9A96E; font-size: 24px; margin-bottom: 20px;">New Free Portrait Request</h1>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Contact Info:</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="margin-bottom: 8px;"><strong>Name:</strong> ${name}</li>
              <li style="margin-bottom: 8px;"><strong>Email:</strong> ${email}</li>
              <li style="margin-bottom: 8px;"><strong>Reddit:</strong> u/${redditUsername}</li>
            </ul>
          </div>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Portrait Details:</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="margin-bottom: 8px;"><strong>Pet Name:</strong> ${petName}</li>
              <li style="margin-bottom: 8px;"><strong>Style:</strong> ${style}</li>
              ${notes ? `<li style="margin-bottom: 8px;"><strong>Notes:</strong> ${notes}</li>` : ""}
              <li style="margin-bottom: 8px;"><strong>Photo URL:</strong> <a href="${petPhotoUrl}" style="color: #C9A96E;">${petPhotoUrl}</a></li>
            </ul>
          </div>

          <p style="font-size: 14px; color: #999;">
            <strong>Action Required:</strong> Generate portrait and send to ${email} within 48 hours.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Free portrait request error:", error);

    // If table doesn't exist, create it
    if (error instanceof Error && error.message.includes("does not exist")) {
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS free_portrait_requests (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            reddit_username TEXT NOT NULL,
            style TEXT NOT NULL,
            pet_name TEXT NOT NULL,
            notes TEXT,
            pet_photo_url TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            submitted_at TIMESTAMP,
            completed_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT NOW()
          )
        `;

        // Retry the request after creating table
        const body = await req.json();
        const { name, email, redditUsername, style, petName, notes, petPhotoUrl } = body;

        await sql`
          INSERT INTO free_portrait_requests (
            name, email, reddit_username, style, pet_name, notes, pet_photo_url, status, submitted_at
          ) VALUES (
            ${name}, ${email}, ${redditUsername}, ${style}, ${petName}, ${notes || null}, ${petPhotoUrl}, 'pending', NOW()
          )
        `;

        return NextResponse.json({ success: true });
      } catch (createError) {
        console.error("Failed to create table:", createError);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
    }

    return NextResponse.json(
      { error: "Failed to submit request. Please try again." },
      { status: 500 }
    );
  }
}
