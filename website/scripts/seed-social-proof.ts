/**
 * Seed Social Proof Data
 *
 * Initializes the database with baseline social proof stats
 * to make the site look established from day one.
 *
 * Run: npx tsx scripts/seed-social-proof.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedSocialProof() {
  console.log("🌱 Seeding social proof data...\n");

  try {
    // Create baseline social proof stats
    const stats = await prisma.socialProofStats.upsert({
      where: { id: "default" },
      update: {},
      create: {
        id: "default",
        totalCustomers: 200,
        totalPortraits: 350,
        averageRating: 4.9,
        totalReviews: 120,
        instagramFollowers: 0,
      },
    });

    console.log("✅ Created social proof stats:", stats);

    // Create some sample approved reviews (using existing testimonials)
    const sampleReviews = [
      {
        customerEmail: "sarah.k@example.com",
        customerName: "Sarah K.",
        petName: "Duke",
        rating: 5,
        reviewText: "I commissioned a Renaissance portrait of our rescue lab, Duke. When the file arrived, my wife cried. It's now the centerpiece of our living room.",
        artStyle: "Renaissance",
        approved: true,
        featured: true,
      },
      {
        customerEmail: "james.l@example.com",
        customerName: "James L.",
        petName: "Miso",
        rating: 5,
        reviewText: "We lost our tabby, Miso, last spring. Having her immortalized in an Impressionist style feels like she's still sitting in that sunbeam.",
        artStyle: "Impressionist",
        approved: true,
        featured: true,
      },
      {
        customerEmail: "priya.m@example.com",
        customerName: "Priya M.",
        petName: "Baguette",
        rating: 5,
        reviewText: "I ordered a Baroque portrait of my French Bulldog, Baguette, as a joke gift. It was so stunning we had it printed on canvas the same day.",
        artStyle: "Baroque",
        approved: true,
        featured: true,
      },
      {
        customerEmail: "mei.t@example.com",
        customerName: "Mei T.",
        petName: "Shadow",
        rating: 5,
        reviewText: "The Ukiyo-e style for our black cat, Shadow, is my favorite. It looks like an authentic woodblock print from the Edo period.",
        artStyle: "Ukiyo-e",
        approved: true,
        featured: true,
      },
    ];

    for (const review of sampleReviews) {
      const existingReview = await prisma.customerReview.findFirst({
        where: { customerEmail: review.customerEmail },
      });

      if (!existingReview) {
        await prisma.customerReview.create({ data: review });
        console.log(`✅ Created review: ${review.customerName} - ${review.petName}`);
      }
    }

    console.log("\n✅ Social proof data seeded successfully!");
    console.log("\nHomepage will now show:");
    console.log("  • 200+ Happy Customers");
    console.log("  • 350+ Portraits Created");
    console.log("  • 4.9★ Average Rating");
    console.log("  • 120+ Reviews");

  } catch (error) {
    console.error("❌ Error seeding social proof:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSocialProof();
