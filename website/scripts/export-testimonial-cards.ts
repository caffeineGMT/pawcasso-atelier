/**
 * Export Testimonial Cards Script
 *
 * Generates shareable testimonial card images for use in:
 * - Instagram/Facebook ads
 * - Landing pages
 * - Email campaigns
 * - Social media posts
 *
 * Run: npm run testimonials:export
 */

import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function exportTestimonialCards() {
  console.log("📦 Exporting testimonial cards...\n");

  try {
    // Fetch approved and featured reviews
    const reviews = await prisma.customerReview.findMany({
      where: {
        approved: true,
        featured: true,
      },
      orderBy: {
        submittedAt: "desc",
      },
      take: 20, // Export top 20 featured reviews
    });

    if (reviews.length === 0) {
      console.log("❌ No featured reviews found. Approve and feature some reviews first.");
      return;
    }

    console.log(`✅ Found ${reviews.length} featured reviews\n`);

    // Create output directory
    const outputDir = path.join(process.cwd(), "marketing/testimonial-cards");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate HTML testimonial cards
    const htmlCards = reviews.map((review, index) => {
      return `
<!-- Testimonial Card #${index + 1}: ${review.customerName} -->
<div class="testimonial-card" style="
  background: linear-gradient(135deg, #111111 0%, #1a1a1a 100%);
  border: 1px solid rgba(201, 169, 110, 0.3);
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
">
  <!-- Rating -->
  <div style="display: flex; gap: 4px; margin-bottom: 16px;">
    ${[...Array(5)].map((_, i) => `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="${i < review.rating ? '#C9A96E' : 'rgba(255,255,255,0.2)'}">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
    </svg>
    `).join('')}
  </div>

  <!-- Review Text -->
  <p style="color: #F5F5F7; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
    "${review.reviewText}"
  </p>

  <!-- Customer Info -->
  <div style="display: flex; align-items: center; gap: 12px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px;">
    <div>
      <p style="color: #F5F5F7; font-size: 14px; font-weight: 500; margin: 0;">
        ${review.customerName}
      </p>
      <p style="color: #86868b; font-size: 12px; margin: 4px 0 0 0;">
        ${review.petName}${review.artStyle ? ` · ${review.artStyle}` : ''}
      </p>
    </div>
  </div>
</div>
      `.trim();
    });

    // Save HTML file
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pawcasso Atelier - Testimonial Cards</title>
  <style>
    body {
      background: #000000;
      padding: 40px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 {
      color: #F5F5F7;
      text-align: center;
      margin-bottom: 40px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 24px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Testimonial Cards - Pawcasso Atelier</h1>
    <div class="grid">
      ${htmlCards.join('\n\n')}
    </div>
  </div>
</body>
</html>
    `.trim();

    fs.writeFileSync(path.join(outputDir, "testimonial-cards.html"), htmlContent);
    console.log(`✅ Exported HTML: ${outputDir}/testimonial-cards.html`);

    // Generate JSON for programmatic use
    const jsonData = reviews.map((review) => ({
      id: review.id,
      customerName: review.customerName,
      petName: review.petName,
      rating: review.rating,
      reviewText: review.reviewText,
      artStyle: review.artStyle,
      instagramHandle: review.instagramHandle,
      submittedAt: review.submittedAt,
    }));

    fs.writeFileSync(
      path.join(outputDir, "testimonials.json"),
      JSON.stringify(jsonData, null, 2)
    );
    console.log(`✅ Exported JSON: ${outputDir}/testimonials.json`);

    // Generate React component
    const reactComponent = `
/**
 * Auto-generated testimonial cards component
 * Generated on: ${new Date().toISOString()}
 */

export const featuredTestimonials = ${JSON.stringify(jsonData, null, 2)};

export function TestimonialCard({ testimonial }: { testimonial: typeof featuredTestimonials[0] }) {
  return (
    <div className="rounded-2xl bg-bg-card p-8 hover:bg-bg-elevated transition-all duration-300 border border-gold/30">
      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={\`w-5 h-5 \${i < testimonial.rating ? "text-gold" : "text-white/20"}\`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Review Text */}
      <p className="text-text-primary text-[15px] leading-relaxed mb-6">
        &ldquo;{testimonial.reviewText}&rdquo;
      </p>

      {/* Customer Info */}
      <div className="border-t border-white/[0.06] pt-4">
        <p className="text-text-primary text-sm font-medium">{testimonial.customerName}</p>
        <p className="text-text-secondary text-xs mt-0.5">
          {testimonial.petName}{testimonial.artStyle ? \` · \${testimonial.artStyle}\` : ''}
        </p>
      </div>
    </div>
  );
}
    `.trim();

    fs.writeFileSync(
      path.join(outputDir, "TestimonialCards.tsx"),
      reactComponent
    );
    console.log(`✅ Exported React Component: ${outputDir}/TestimonialCards.tsx`);

    console.log("\n✅ Export complete!");
    console.log(`\n📁 Files saved to: ${outputDir}`);
    console.log("\nUse these files for:");
    console.log("  • Instagram/Facebook ad creatives");
    console.log("  • Landing page testimonials");
    console.log("  • Email campaign social proof");
    console.log("  • Social media posts");

  } catch (error) {
    console.error("❌ Error exporting testimonial cards:", error);
  } finally {
    await prisma.$disconnect();
  }
}

exportTestimonialCards();
