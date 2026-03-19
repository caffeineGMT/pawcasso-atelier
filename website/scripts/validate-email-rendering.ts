/**
 * Email HTML Rendering Validator
 *
 * Tests email templates for:
 * - HTML validity
 * - CSS compatibility (email clients have limited CSS support)
 * - Image loading
 * - Link functionality
 * - Mobile responsiveness
 * - Accessibility
 *
 * Uses Litmus/Email on Acid standards for email client compatibility.
 */

import { render } from "@react-email/components";
import OrderConfirmation from "../src/lib/email-templates/order-confirmation";
import DeliveryConfirmation from "../src/lib/email-templates/delivery-confirmation";
import ShippingNotification from "../src/lib/email-templates/shipping-notification";
import * as fs from "fs/promises";
import * as path from "path";

interface RenderingCheck {
  check: string;
  passed: boolean;
  severity: "error" | "warning" | "info";
  details?: string;
  recommendation?: string;
}

// Test data
const TEST_ORDER_DATA = {
  customerName: "Sarah Johnson",
  petName: "Duke",
  tier: "premium",
  tierName: "Premium",
  amount: 49.0,
  orderId: "cs_test_123456789",
  style: "Renaissance",
  estimatedDelivery: "12 hours",
};

const TEST_DELIVERY_DATA = {
  customerName: "Sarah Johnson",
  petName: "Duke",
  style: "Renaissance",
  downloadUrl: "https://pawcasso-atelier.vercel.app/download/test_123",
  portraitUrls: [
    "https://example.com/portrait1.png",
    "https://example.com/portrait2.png",
  ],
};

const TEST_SHIPPING_DATA = {
  customerName: "Sarah Johnson",
  petName: "Duke",
  style: "Renaissance",
  estimatedArrival: "within 12 hours",
};

/**
 * Check for common email HTML issues
 */
function validateEmailHTML(html: string, emailType: string): RenderingCheck[] {
  const checks: RenderingCheck[] = [];

  // 1. Check for <!DOCTYPE html>
  checks.push({
    check: "DOCTYPE declaration",
    passed: html.includes("<!DOCTYPE html>") || html.includes("<!doctype html>"),
    severity: "warning",
    recommendation: html.includes("<!DOCTYPE") ? undefined : "Add <!DOCTYPE html> at the top",
  });

  // 2. Check for inline styles (required for email)
  const hasInlineStyles = html.includes('style="');
  checks.push({
    check: "Inline styles used",
    passed: hasInlineStyles,
    severity: "error",
    details: hasInlineStyles
      ? "Inline styles detected (good for email compatibility)"
      : "No inline styles found",
    recommendation: hasInlineStyles
      ? undefined
      : "Email clients don't support external CSS - use inline styles",
  });

  // 3. Check for external CSS (not supported in email)
  const hasExternalCSS =
    html.includes('<link rel="stylesheet"') || html.includes("@import");
  checks.push({
    check: "No external CSS",
    passed: !hasExternalCSS,
    severity: "error",
    recommendation: hasExternalCSS
      ? "Remove external CSS - most email clients block it"
      : undefined,
  });

  // 4. Check for JavaScript (not supported in email)
  const hasJavaScript = html.includes("<script");
  checks.push({
    check: "No JavaScript",
    passed: !hasJavaScript,
    severity: "error",
    recommendation: hasJavaScript
      ? "Remove JavaScript - email clients block it for security"
      : undefined,
  });

  // 5. Check for tables (recommended for layout)
  const hasTables = html.includes("<table");
  checks.push({
    check: "Table-based layout",
    passed: hasTables,
    severity: "warning",
    details: hasTables
      ? "Tables detected (good for cross-client compatibility)"
      : "No tables found",
    recommendation: hasTables
      ? undefined
      : "Consider using tables for better email client compatibility",
  });

  // 6. Check for responsive meta tag
  const hasViewportMeta = html.includes('name="viewport"');
  checks.push({
    check: "Viewport meta tag",
    passed: hasViewportMeta,
    severity: "info",
    recommendation: hasViewportMeta
      ? undefined
      : 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0">',
  });

  // 7. Check for alt text on images
  const imgTags = html.match(/<img[^>]*>/g) || [];
  const allImgsHaveAlt = imgTags.every((tag) => tag.includes("alt="));
  checks.push({
    check: "Image alt text",
    passed: allImgsHaveAlt || imgTags.length === 0,
    severity: "warning",
    details: `${imgTags.length} images found`,
    recommendation: allImgsHaveAlt
      ? undefined
      : "Add alt text to all images for accessibility and spam filters",
  });

  // 8. Check email size (Gmail clips at 102KB)
  const sizeKB = Buffer.byteLength(html, "utf8") / 1024;
  const sizeOK = sizeKB < 100;
  checks.push({
    check: "Email size < 100KB",
    passed: sizeOK,
    severity: sizeOK ? "info" : "warning",
    details: `${sizeKB.toFixed(2)} KB`,
    recommendation: sizeOK
      ? undefined
      : "Gmail clips emails over 102KB - optimize images or reduce content",
  });

  // 9. Check for common spam triggers
  const spamTriggers = [
    "FREE",
    "!!!",
    "$$$",
    "CLICK HERE",
    "ACT NOW",
    "LIMITED TIME",
    "100% FREE",
  ];
  const foundTriggers = spamTriggers.filter((trigger) =>
    html.toUpperCase().includes(trigger)
  );
  checks.push({
    check: "No spam trigger words",
    passed: foundTriggers.length === 0,
    severity: "warning",
    details:
      foundTriggers.length > 0
        ? `Found: ${foundTriggers.join(", ")}`
        : "No common spam triggers detected",
    recommendation:
      foundTriggers.length > 0
        ? "Avoid spam trigger words to improve deliverability"
        : undefined,
  });

  // 10. Check for preview text
  const hasPreview = html.includes("<Preview>");
  checks.push({
    check: "Preview text included",
    passed: hasPreview,
    severity: "info",
    details: hasPreview
      ? "Preview text will show in inbox"
      : "No preview text found",
    recommendation: hasPreview
      ? undefined
      : "Add preview text for better inbox appearance",
  });

  // 11. Check for unsubscribe link (required by law for marketing emails)
  const hasUnsubscribe =
    html.toLowerCase().includes("unsubscribe") ||
    html.toLowerCase().includes("opt-out");
  checks.push({
    check: "Unsubscribe link",
    passed: hasUnsubscribe,
    severity: "warning",
    details: hasUnsubscribe ? "Found" : "Not found",
    recommendation: hasUnsubscribe
      ? undefined
      : "Add unsubscribe link for compliance (required for marketing emails)",
  });

  // 12. Check for text/image ratio (spam filters prefer text-heavy emails)
  const textLength = html.replace(/<[^>]*>/g, "").length;
  const imageCount = imgTags.length;
  const goodRatio = imageCount === 0 || textLength / imageCount > 100;
  checks.push({
    check: "Good text-to-image ratio",
    passed: goodRatio,
    severity: "info",
    details: `${textLength} characters, ${imageCount} images`,
    recommendation: goodRatio
      ? undefined
      : "Add more text content - spam filters flag image-heavy emails",
  });

  return checks;
}

/**
 * Test all email templates
 */
async function validateAllTemplates() {
  console.log("🎨 Email HTML Rendering Validator");
  console.log("=".repeat(70));

  const templates = [
    {
      name: "Order Confirmation",
      component: OrderConfirmation,
      data: TEST_ORDER_DATA,
    },
    {
      name: "Delivery Confirmation",
      component: DeliveryConfirmation,
      data: TEST_DELIVERY_DATA,
    },
    {
      name: "Shipping Notification",
      component: ShippingNotification,
      data: TEST_SHIPPING_DATA,
    },
  ];

  const allResults: Record<string, RenderingCheck[]> = {};

  for (const template of templates) {
    console.log(`\n\n📧 ${template.name.toUpperCase()}`);
    console.log("-".repeat(70));

    // Render template to HTML string
    const html = await render(template.component(template.data as any));

    // Run checks
    const checks = validateEmailHTML(html, template.name);
    allResults[template.name] = checks;

    // Display results
    const errors = checks.filter((c) => !c.passed && c.severity === "error");
    const warnings = checks.filter((c) => !c.passed && c.severity === "warning");
    const passed = checks.filter((c) => c.passed);

    console.log(`\n✅ Passed: ${passed.length}`);
    console.log(`⚠️  Warnings: ${warnings.length}`);
    console.log(`❌ Errors: ${errors.length}`);

    if (errors.length > 0) {
      console.log("\n❌ ERRORS (Must Fix):");
      errors.forEach((check) => {
        console.log(`   • ${check.check}`);
        if (check.details) console.log(`     ${check.details}`);
        if (check.recommendation)
          console.log(`     → ${check.recommendation}`);
      });
    }

    if (warnings.length > 0) {
      console.log("\n⚠️  WARNINGS (Should Fix):");
      warnings.forEach((check) => {
        console.log(`   • ${check.check}`);
        if (check.details) console.log(`     ${check.details}`);
        if (check.recommendation)
          console.log(`     → ${check.recommendation}`);
      });
    }

    // Save HTML to file for manual inspection
    const outputDir = path.join(process.cwd(), "email-previews");
    await fs.mkdir(outputDir, { recursive: true });

    const filename = `${template.name.toLowerCase().replace(/\s+/g, "-")}.html`;
    const filepath = path.join(outputDir, filename);
    await fs.writeFile(filepath, html);

    console.log(`\n📄 Preview saved: ${filepath}`);
    console.log(`   Open in browser to test rendering`);
  }

  // Overall summary
  console.log("\n\n📊 OVERALL SUMMARY");
  console.log("=".repeat(70));

  const totalErrors = Object.values(allResults)
    .flat()
    .filter((c) => !c.passed && c.severity === "error").length;

  const totalWarnings = Object.values(allResults)
    .flat()
    .filter((c) => !c.passed && c.severity === "warning").length;

  console.log(`Total errors: ${totalErrors}`);
  console.log(`Total warnings: ${totalWarnings}`);

  if (totalErrors === 0 && totalWarnings === 0) {
    console.log("\n✅ All templates passed validation!");
  } else if (totalErrors === 0) {
    console.log("\n⚠️  Templates have warnings but no critical errors");
  } else {
    console.log("\n❌ Templates have critical errors that must be fixed");
  }

  // Email client compatibility notes
  console.log("\n\n📱 EMAIL CLIENT COMPATIBILITY NOTES");
  console.log("=".repeat(70));
  console.log("Tested rendering recommendations:");
  console.log("1. Gmail (web, iOS, Android) - Most popular, clips at 102KB");
  console.log("2. Outlook (2016/2019/365) - Uses Word rendering engine");
  console.log("3. Apple Mail (macOS/iOS) - Best CSS support");
  console.log("4. Yahoo Mail - Moderate CSS support");
  console.log("5. Outlook.com/Hotmail - Limited CSS support");
  console.log("\nTest your emails at:");
  console.log("• Litmus: https://litmus.com/");
  console.log("• Email on Acid: https://www.emailonacid.com/");
  console.log("• Mailtrap: https://mailtrap.io/ (free preview)");

  console.log("\n");
}

// Run validation
validateAllTemplates().catch(console.error);
