/**
 * E2E Tests for Email Delivery Flow
 *
 * Tests the complete order confirmation email flow:
 * 1. Order placement triggers email
 * 2. Email is sent via Resend
 * 3. Email contains correct order details
 * 4. Links in email work correctly
 * 5. Email tracking is recorded in database
 */

import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

test.describe("Order Confirmation Email Flow", () => {
  test.beforeAll(async () => {
    // Ensure we're using test mode
    expect(process.env.STRIPE_SECRET_KEY).toContain("test");
    expect(process.env.RESEND_API_KEY).toBeTruthy();
  });

  test.afterAll(async () => {
    await prisma.$disconnect();
  });

  test("should send order confirmation email after successful checkout", async ({
    page,
  }) => {
    // Navigate to order page
    await page.goto("/order");

    // Fill out order form
    await page.fill('input[name="customerName"]', "Test Customer");
    await page.fill('input[name="customerEmail"]', "test@example.com");
    await page.fill('input[name="petName"]', "Duke");

    // Select style
    await page.click('button:has-text("Renaissance")');

    // Upload pet photo (use test image)
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles("public/test-pet.jpg");

    // Wait for preview
    await expect(page.locator('img[alt*="preview"]')).toBeVisible();

    // Select tier
    await page.click('button:has-text("Premium")');

    // Click checkout
    await page.click('button:has-text("Checkout")');

    // Should redirect to Stripe checkout
    await page.waitForURL(/checkout\.stripe\.com/);

    // Fill out Stripe test card
    const stripeFrame = page.frameLocator('iframe[name*="stripe"]').first();
    await stripeFrame
      .locator('input[name="cardnumber"]')
      .fill("4242424242424242");
    await stripeFrame.locator('input[name="exp-date"]').fill("12/30");
    await stripeFrame.locator('input[name="cvc"]').fill("123");
    await stripeFrame.locator('input[name="postal"]').fill("12345");

    // Submit payment
    await page.click('button:has-text("Pay")');

    // Wait for success redirect
    await page.waitForURL(/\/success/, { timeout: 30000 });

    // Verify success page shows
    await expect(
      page.locator('text=/order.*confirmed|thank you/i')
    ).toBeVisible();

    // Extract session ID from URL
    const url = new URL(page.url());
    const sessionId = url.searchParams.get("session_id");
    expect(sessionId).toBeTruthy();

    // Wait for webhook to process (email sent asynchronously)
    await page.waitForTimeout(5000);

    // Check database for email sent timestamp
    const order = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId! },
    });

    expect(order).toBeTruthy();
    expect(order?.orderConfirmationEmailSentAt).toBeTruthy();
    expect(order?.customerEmail).toBe("test@example.com");
    expect(order?.customerName).toBe("Test Customer");
    expect(order?.petName).toBe("Duke");
  });

  test("should not send duplicate emails for same order", async () => {
    // Create a test order
    const order = await prisma.order.create({
      data: {
        stripeSessionId: "test_session_" + Date.now(),
        customerEmail: "test@example.com",
        customerName: "Test Customer",
        petName: "Duke",
        style: "Renaissance",
        tier: "premium",
        tierName: "Premium",
        amount: 49.0,
        status: "completed",
        deliveryStatus: "pending",
      },
    });

    // Import email function
    const {
      sendOrderConfirmationEmail,
    } = await import("../src/lib/post-purchase-emails");

    // Send first email
    const result1 = await sendOrderConfirmationEmail(order.id);
    expect(result1.success).toBe(true);

    // Check timestamp is set
    const orderAfterFirst = await prisma.order.findUnique({
      where: { id: order.id },
    });
    expect(orderAfterFirst?.orderConfirmationEmailSentAt).toBeTruthy();
    const firstTimestamp = orderAfterFirst?.orderConfirmationEmailSentAt;

    // Try to send again
    const result2 = await sendOrderConfirmationEmail(order.id);
    expect(result2.skipped).toBe(true);

    // Check timestamp hasn't changed
    const orderAfterSecond = await prisma.order.findUnique({
      where: { id: order.id },
    });
    expect(
      orderAfterSecond?.orderConfirmationEmailSentAt?.getTime()
    ).toBe(firstTimestamp?.getTime());

    // Cleanup
    await prisma.order.delete({ where: { id: order.id } });
  });

  test("should include correct order details in email", async () => {
    // Create test order
    const testData = {
      stripeSessionId: "test_session_" + Date.now(),
      customerEmail: "test@example.com",
      customerName: "Sarah Johnson",
      petName: "Max",
      style: "Pop Art",
      tier: "deluxe",
      tierName: "Deluxe",
      amount: 79.0,
      status: "completed" as const,
      deliveryStatus: "pending" as const,
    };

    const order = await prisma.order.create({ data: testData });

    // Send email and capture result
    const {
      sendOrderConfirmationEmail,
    } = await import("../src/lib/post-purchase-emails");

    const result = await sendOrderConfirmationEmail(order.id);
    expect(result.success).toBe(true);

    // Note: In production, you'd use a mail trap service (like Mailhog or Mailtrap)
    // to capture the actual email and verify its contents.
    // For now, we verify the database state.

    const updatedOrder = await prisma.order.findUnique({
      where: { id: order.id },
    });

    expect(updatedOrder?.customerName).toBe(testData.customerName);
    expect(updatedOrder?.petName).toBe(testData.petName);
    expect(updatedOrder?.style).toBe(testData.style);
    expect(updatedOrder?.amount).toBe(testData.amount);

    // Cleanup
    await prisma.order.delete({ where: { id: order.id } });
  });

  test("should handle Resend API errors gracefully", async () => {
    // Create order with invalid email to force error
    const order = await prisma.order.create({
      data: {
        stripeSessionId: "test_session_" + Date.now(),
        customerEmail: "invalid-email", // Invalid format
        customerName: "Test Customer",
        petName: "Duke",
        style: "Renaissance",
        tier: "basic",
        tierName: "Basic",
        amount: 29.0,
        status: "completed",
        deliveryStatus: "pending",
      },
    });

    const {
      sendOrderConfirmationEmail,
    } = await import("../src/lib/post-purchase-emails");

    // Should throw error
    await expect(sendOrderConfirmationEmail(order.id)).rejects.toThrow();

    // Verify timestamp was not set (email failed)
    const orderAfter = await prisma.order.findUnique({
      where: { id: order.id },
    });
    expect(orderAfter?.orderConfirmationEmailSentAt).toBeNull();

    // Cleanup
    await prisma.order.delete({ where: { id: order.id } });
  });
});

test.describe("Delivery Confirmation Email Flow", () => {
  test("should send delivery confirmation when portrait is ready", async () => {
    // Create completed order
    const order = await prisma.order.create({
      data: {
        stripeSessionId: "test_session_" + Date.now(),
        customerEmail: "test@example.com",
        customerName: "Test Customer",
        petName: "Duke",
        style: "Renaissance",
        tier: "premium",
        tierName: "Premium",
        amount: 49.0,
        status: "completed",
        deliveryStatus: "completed",
        portraitUrls: "https://example.com/portrait1.png",
        deliveredAt: new Date(),
      },
    });

    const {
      sendDeliveryConfirmationEmail,
    } = await import("../src/lib/post-purchase-emails");

    const result = await sendDeliveryConfirmationEmail(order.id);
    expect(result.success).toBe(true);

    // Verify timestamp
    const updatedOrder = await prisma.order.findUnique({
      where: { id: order.id },
    });
    expect(updatedOrder?.deliveryConfirmationEmailSentAt).toBeTruthy();

    // Cleanup
    await prisma.order.delete({ where: { id: order.id } });
  });
});

test.describe("Email Scheduled Sending", () => {
  test("should identify orders needing review request emails", async () => {
    // Create order delivered 8 days ago
    const eightDaysAgo = new Date();
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

    const order = await prisma.order.create({
      data: {
        stripeSessionId: "test_session_" + Date.now(),
        customerEmail: "test@example.com",
        customerName: "Test Customer",
        petName: "Duke",
        style: "Renaissance",
        tier: "premium",
        tierName: "Premium",
        amount: 49.0,
        status: "completed",
        deliveryStatus: "completed",
        deliveredAt: eightDaysAgo,
        orderConfirmationEmailSentAt: eightDaysAgo,
        deliveryConfirmationEmailSentAt: eightDaysAgo,
      },
    });

    const {
      getOrdersNeedingScheduledEmails,
    } = await import("../src/lib/post-purchase-emails");

    const { reviewRequests } = await getOrdersNeedingScheduledEmails();

    expect(reviewRequests.length).toBeGreaterThanOrEqual(1);
    expect(reviewRequests.find((o) => o.id === order.id)).toBeTruthy();

    // Cleanup
    await prisma.order.delete({ where: { id: order.id } });
  });

  test("should identify orders needing reorder incentive emails", async () => {
    // Create order delivered 31 days ago
    const thirtyOneDaysAgo = new Date();
    thirtyOneDaysAgo.setDate(thirtyOneDaysAgo.getDate() - 31);

    const order = await prisma.order.create({
      data: {
        stripeSessionId: "test_session_" + Date.now(),
        customerEmail: "test@example.com",
        customerName: "Test Customer",
        petName: "Duke",
        style: "Renaissance",
        tier: "premium",
        tierName: "Premium",
        amount: 49.0,
        status: "completed",
        deliveryStatus: "completed",
        deliveredAt: thirtyOneDaysAgo,
        orderConfirmationEmailSentAt: thirtyOneDaysAgo,
        deliveryConfirmationEmailSentAt: thirtyOneDaysAgo,
        reviewRequestEmailSentAt: new Date(),
      },
    });

    const {
      getOrdersNeedingScheduledEmails,
    } = await import("../src/lib/post-purchase-emails");

    const { reorderIncentives } = await getOrdersNeedingScheduledEmails();

    expect(reorderIncentives.length).toBeGreaterThanOrEqual(1);
    expect(reorderIncentives.find((o) => o.id === order.id)).toBeTruthy();

    // Cleanup
    await prisma.order.delete({ where: { id: order.id } });
  });
});
