import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getPetsWithUpcomingBirthdays, createBirthdayReward } from "@/lib/loyalty";
import { generateBirthdayReminderEmail } from "@/lib/email-templates/birthday-reminder";

const resend = new Resend(process.env.RESEND_API_KEY || "placeholder");

export async function POST(req: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized calls
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pawcasso-atelier.com";

    // Find pets with birthdays in the next 3 days (send reminders a few days early)
    const pets = await getPetsWithUpcomingBirthdays(3);

    let sent = 0;
    const errors: string[] = [];

    for (const pet of pets) {
      try {
        // Create birthday discount for this pet
        const discountCode = await createBirthdayReward(
          pet.loyaltyMember.email,
          pet.name,
        );

        if (!discountCode) continue;

        // Send birthday reminder email
        const html = generateBirthdayReminderEmail({
          customerName: pet.loyaltyMember.name || "Pet Parent",
          petName: pet.name,
          petSpecies: pet.species,
          discountCode,
          baseUrl,
        });

        await resend.emails.send({
          from: "Pawcasso Atelier <hello@pawcasso-atelier.com>",
          to: pet.loyaltyMember.email,
          subject: `🎂 Happy Birthday, ${pet.name}! Here's 25% off a birthday portrait`,
          html,
        });

        sent++;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        errors.push(`${pet.name} (${pet.loyaltyMember.email}): ${message}`);
      }
    }

    return NextResponse.json({
      success: true,
      petsFound: pets.length,
      emailsSent: sent,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Birthday reminder cron error:", error);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}
