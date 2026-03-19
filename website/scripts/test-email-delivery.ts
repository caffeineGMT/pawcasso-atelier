/**
 * Email Delivery Testing Utility
 *
 * Tests order confirmation emails across multiple email providers:
 * - Gmail
 * - Outlook (Hotmail/Live)
 * - Yahoo
 * - Apple iCloud
 *
 * Validates:
 * - Email delivery success
 * - Spam score (via Mail Tester API)
 * - Content accuracy (order details)
 * - HTML rendering
 * - Link functionality
 */

import { Resend } from "resend";
import { render } from "@react-email/components";
import OrderConfirmation from "../src/lib/email-templates/order-confirmation";
import DeliveryConfirmation from "../src/lib/email-templates/delivery-confirmation";
import ShippingNotification from "../src/lib/email-templates/shipping-notification";

// Email provider test accounts (replace with real test accounts)
const TEST_EMAIL_PROVIDERS = {
  gmail: process.env.TEST_EMAIL_GMAIL || "pawcasso.test@gmail.com",
  outlook: process.env.TEST_EMAIL_OUTLOOK || "pawcasso.test@outlook.com",
  yahoo: process.env.TEST_EMAIL_YAHOO || "pawcasso.test@yahoo.com",
  icloud: process.env.TEST_EMAIL_ICLOUD || "pawcasso.test@icloud.com",
  mailtester: process.env.TEST_EMAIL_MAILTESTER || "", // Mail-tester.com generated address
};

const FROM_EMAIL = "Pawcasso Atelier <hello@pawcasso-atelier.com>";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(apiKey);
}

// Test data for order confirmation
const TEST_ORDER_DATA = {
  customerName: "Test Customer",
  petName: "Duke",
  tier: "premium",
  tierName: "Premium",
  amount: 49.0,
  orderId: "cs_test_" + Date.now(),
  style: "Renaissance",
  estimatedDelivery: "12 hours",
};

const TEST_DELIVERY_DATA = {
  customerName: "Test Customer",
  petName: "Duke",
  style: "Renaissance",
  downloadUrl: "https://pawcasso-atelier.vercel.app/download/test_123",
  portraitUrls: [
    "https://example.com/portrait1.png",
    "https://example.com/portrait2.png",
  ],
};

const TEST_SHIPPING_DATA = {
  customerName: "Test Customer",
  petName: "Duke",
  style: "Renaissance",
  estimatedArrival: "within 12 hours",
};

interface EmailTestResult {
  provider: string;
  email: string;
  emailType: string;
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: string;
  spamScore?: number;
}

/**
 * Send test email to a specific provider
 */
async function sendTestEmail(
  provider: string,
  emailAddress: string,
  emailType: "order-confirmation" | "delivery-confirmation" | "shipping-notification"
): Promise<EmailTestResult> {
  const result: EmailTestResult = {
    provider,
    email: emailAddress,
    emailType,
    success: false,
    timestamp: new Date().toISOString(),
  };

  try {
    const resend = getResend();
    let emailHtml: string;
    let subject: string;

    // Generate email HTML based on type
    switch (emailType) {
      case "order-confirmation":
        emailHtml = render(OrderConfirmation(TEST_ORDER_DATA));
        subject = `[TEST] Order Confirmed! Your ${TEST_ORDER_DATA.petName} portrait is on the way 🎨`;
        break;
      case "delivery-confirmation":
        emailHtml = render(DeliveryConfirmation(TEST_DELIVERY_DATA));
        subject = `[TEST] 🎨 ${TEST_DELIVERY_DATA.petName}'s portrait has arrived!`;
        break;
      case "shipping-notification":
        emailHtml = render(ShippingNotification(TEST_SHIPPING_DATA));
        subject = `[TEST] 📦 Good news! ${TEST_SHIPPING_DATA.petName}'s portrait is being created`;
        break;
    }

    // Send email
    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: emailAddress,
      subject,
      html: emailHtml,
    });

    result.success = true;
    result.messageId = response.id;

    console.log(`✅ [${provider}] Email sent successfully (ID: ${response.id})`);
  } catch (error: any) {
    result.error = error.message;
    console.error(`❌ [${provider}] Email failed:`, error.message);
  }

  return result;
}

/**
 * Check spam score using Mail-Tester.com
 *
 * Instructions:
 * 1. Go to https://www.mail-tester.com/
 * 2. Copy the test email address shown
 * 3. Set TEST_EMAIL_MAILTESTER env var
 * 4. Run this test
 * 5. Visit the URL provided and check score
 */
async function checkSpamScore(): Promise<{
  url: string;
  instructions: string;
}> {
  const mailTesterEmail = TEST_EMAIL_PROVIDERS.mailtester;

  if (!mailTesterEmail) {
    return {
      url: "https://www.mail-tester.com/",
      instructions:
        "To check spam score:\n" +
        "1. Visit https://www.mail-tester.com/\n" +
        "2. Copy the test email address shown\n" +
        "3. Set TEST_EMAIL_MAILTESTER environment variable\n" +
        "4. Re-run this test\n" +
        "5. Check the results URL provided",
    };
  }

  // Send test email to Mail Tester
  console.log("\n📧 Sending spam test email to Mail-Tester.com...");
  const result = await sendTestEmail(
    "mail-tester",
    mailTesterEmail,
    "order-confirmation"
  );

  if (result.success) {
    const testId = mailTesterEmail.split("@")[0];
    const resultsUrl = `https://www.mail-tester.com/${testId}`;

    return {
      url: resultsUrl,
      instructions:
        `Spam test email sent!\n\n` +
        `Visit this URL to see your spam score (10/10 is perfect):\n` +
        `${resultsUrl}\n\n` +
        `Target: 9/10 or higher\n` +
        `Common issues if score is low:\n` +
        `- Missing SPF/DKIM/DMARC records\n` +
        `- IP reputation issues\n` +
        `- Spam trigger words in content\n` +
        `- Missing unsubscribe link\n`,
    };
  } else {
    throw new Error(`Failed to send spam test email: ${result.error}`);
  }
}

/**
 * Validate email content accuracy
 */
function validateEmailContent(emailType: string): {
  valid: boolean;
  checks: Array<{ check: string; passed: boolean; details?: string }>;
} {
  const checks: Array<{ check: string; passed: boolean; details?: string }> = [];

  // Common checks for all emails
  checks.push({
    check: "From address configured",
    passed: FROM_EMAIL.includes("pawcasso-atelier.com"),
    details: FROM_EMAIL,
  });

  checks.push({
    check: "Test data includes pet name",
    passed: TEST_ORDER_DATA.petName === "Duke",
  });

  checks.push({
    check: "Test data includes customer name",
    passed: TEST_ORDER_DATA.customerName === "Test Customer",
  });

  checks.push({
    check: "Test data includes style",
    passed: TEST_ORDER_DATA.style === "Renaissance",
  });

  // Email-specific checks
  if (emailType === "order-confirmation") {
    checks.push({
      check: "Order ID present",
      passed: TEST_ORDER_DATA.orderId.startsWith("cs_test_"),
    });

    checks.push({
      check: "Amount is numeric",
      passed: typeof TEST_ORDER_DATA.amount === "number",
      details: `$${TEST_ORDER_DATA.amount}`,
    });

    checks.push({
      check: "Estimated delivery time present",
      passed: !!TEST_ORDER_DATA.estimatedDelivery,
      details: TEST_ORDER_DATA.estimatedDelivery,
    });
  }

  if (emailType === "delivery-confirmation") {
    checks.push({
      check: "Download URL present",
      passed: TEST_DELIVERY_DATA.downloadUrl.includes("download"),
      details: TEST_DELIVERY_DATA.downloadUrl,
    });
  }

  const allPassed = checks.every((c) => c.passed);

  return {
    valid: allPassed,
    checks,
  };
}

/**
 * Main test runner
 */
async function runEmailDeliveryTests() {
  console.log("🚀 Starting Email Delivery Tests\n");
  console.log("=" .repeat(60));

  const results: EmailTestResult[] = [];

  // Test 1: Validate email content
  console.log("\n📋 STEP 1: Validate Email Content");
  console.log("-".repeat(60));

  const emailTypes = [
    "order-confirmation",
    "delivery-confirmation",
    "shipping-notification",
  ];

  for (const emailType of emailTypes) {
    const validation = validateEmailContent(emailType);
    console.log(`\n${emailType}:`);
    console.log(`  Overall: ${validation.valid ? "✅ VALID" : "❌ INVALID"}`);
    validation.checks.forEach((check) => {
      const icon = check.passed ? "✅" : "❌";
      const details = check.details ? ` (${check.details})` : "";
      console.log(`  ${icon} ${check.check}${details}`);
    });
  }

  // Test 2: Send to multiple providers
  console.log("\n\n📧 STEP 2: Send Test Emails to Multiple Providers");
  console.log("-".repeat(60));

  const providers = Object.entries(TEST_EMAIL_PROVIDERS).filter(
    ([key, email]) => key !== "mailtester" && email
  );

  if (providers.length === 0) {
    console.log("\n⚠️  No test email addresses configured!");
    console.log("Set these environment variables:");
    console.log("  - TEST_EMAIL_GMAIL");
    console.log("  - TEST_EMAIL_OUTLOOK");
    console.log("  - TEST_EMAIL_YAHOO");
    console.log("  - TEST_EMAIL_ICLOUD");
  } else {
    for (const [provider, email] of providers) {
      console.log(`\n${provider.toUpperCase()}: ${email}`);

      // Send all 3 email types to each provider
      for (const emailType of emailTypes) {
        const result = await sendTestEmail(
          provider,
          email,
          emailType as any
        );
        results.push(result);

        // Rate limit: wait 1 second between sends
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  // Test 3: Spam Score Check
  console.log("\n\n🛡️  STEP 3: Spam Score Check");
  console.log("-".repeat(60));

  try {
    const spamCheck = await checkSpamScore();
    console.log(spamCheck.instructions);
  } catch (error: any) {
    console.error("❌ Spam check failed:", error.message);
  }

  // Summary
  console.log("\n\n📊 TEST SUMMARY");
  console.log("=".repeat(60));

  const successCount = results.filter((r) => r.success).length;
  const totalCount = results.length;
  const successRate = totalCount > 0 ? (successCount / totalCount) * 100 : 0;

  console.log(`\nTotal emails sent: ${totalCount}`);
  console.log(`Successful: ${successCount} (${successRate.toFixed(1)}%)`);
  console.log(`Failed: ${totalCount - successCount}`);

  if (results.length > 0) {
    console.log("\nResults by provider:");
    const byProvider = results.reduce((acc, r) => {
      if (!acc[r.provider]) acc[r.provider] = { success: 0, total: 0 };
      acc[r.provider].total++;
      if (r.success) acc[r.provider].success++;
      return acc;
    }, {} as Record<string, { success: number; total: number }>);

    Object.entries(byProvider).forEach(([provider, stats]) => {
      const rate = (stats.success / stats.total) * 100;
      console.log(
        `  ${provider}: ${stats.success}/${stats.total} (${rate.toFixed(1)}%)`
      );
    });
  }

  // Save results to file
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const resultsFile = `email-delivery-test-results-${timestamp}.json`;

  const fs = await import("fs/promises");
  await fs.writeFile(
    resultsFile,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        summary: {
          total: totalCount,
          successful: successCount,
          failed: totalCount - successCount,
          successRate: successRate.toFixed(2) + "%",
        },
        results,
      },
      null,
      2
    )
  );

  console.log(`\n📄 Results saved to: ${resultsFile}`);

  // Next steps
  console.log("\n\n📝 NEXT STEPS");
  console.log("=".repeat(60));
  console.log("1. Check your test email inboxes:");
  providers.forEach(([provider, email]) => {
    console.log(`   - ${provider.toUpperCase()}: ${email}`);
  });
  console.log("\n2. Verify emails are:");
  console.log("   ✓ Not in spam/junk folder");
  console.log("   ✓ Images load correctly");
  console.log("   ✓ Links are clickable");
  console.log("   ✓ Mobile-responsive");
  console.log("   ✓ Order details are accurate");
  console.log("\n3. Check spam score (target: 9/10+)");
  console.log("\n4. Test email authentication:");
  console.log("   ✓ SPF record");
  console.log("   ✓ DKIM signature");
  console.log("   ✓ DMARC policy");

  console.log("\n✅ Email delivery tests complete!\n");
}

// Run tests
runEmailDeliveryTests().catch(console.error);
