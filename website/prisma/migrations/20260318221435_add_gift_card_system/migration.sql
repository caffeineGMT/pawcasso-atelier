-- CreateTable
CREATE TABLE "CorporateInquiry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "teamSize" INTEGER NOT NULL,
    "useCase" TEXT NOT NULL,
    "preferredDeliveryDate" DATETIME,
    "notes" TEXT,
    "estimatedValue" REAL,
    "quoteAmount" REAL,
    "quotedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "wonAt" DATETIME,
    "lostReason" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CorporateOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "employeeCount" INTEGER NOT NULL,
    "totalAmount" REAL NOT NULL,
    "stripeInvoiceId" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "paidAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CorporateEmployee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "corporateOrderId" TEXT NOT NULL,
    "employeeName" TEXT NOT NULL,
    "employeeEmail" TEXT NOT NULL,
    "petPhotoUrl" TEXT,
    "uploadToken" TEXT,
    "portraitUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING_PHOTO',
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "emailSentAt" DATETIME,
    "photoUploadedAt" DATETIME,
    "portraitGeneratedAt" DATETIME,
    "portraitDeliveredAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CorporateEmployee_corporateOrderId_fkey" FOREIGN KEY ("corporateOrderId") REFERENCES "CorporateOrder" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GiftCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "initialBalance" REAL NOT NULL,
    "currentBalance" REAL NOT NULL,
    "purchaserEmail" TEXT,
    "purchaserName" TEXT,
    "recipientEmail" TEXT,
    "recipientName" TEXT,
    "senderCredited" BOOLEAN NOT NULL DEFAULT false,
    "senderCreditAmount" REAL NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "firstUsedAt" DATETIME
);

-- CreateTable
CREATE TABLE "GiftCardTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "giftCardId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "orderId" TEXT,
    "balanceBefore" REAL NOT NULL,
    "balanceAfter" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GiftCardTransaction_giftCardId_fkey" FOREIGN KEY ("giftCardId") REFERENCES "GiftCard" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stripeSessionId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT,
    "customerEmail" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "tierName" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "subtotal" REAL NOT NULL,
    "discount" REAL NOT NULL DEFAULT 0,
    "tax" REAL NOT NULL DEFAULT 0,
    "petName" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "notes" TEXT,
    "petPhotoUrl" TEXT,
    "portraitUrls" TEXT,
    "portraitCount" INTEGER NOT NULL DEFAULT 1,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "referralCode" TEXT,
    "discountCode" TEXT,
    "pricingBadge" TEXT,
    "giftCardCode" TEXT,
    "giftCardAmount" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "deliveryStatus" TEXT NOT NULL DEFAULT 'pending',
    "deliveredAt" DATETIME,
    "refunded" BOOLEAN NOT NULL DEFAULT false,
    "refundedAt" DATETIME,
    "refundAmount" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" DATETIME
);
INSERT INTO "new_Order" ("amount", "createdAt", "customerEmail", "customerName", "deliveredAt", "deliveryStatus", "discount", "discountCode", "id", "notes", "paidAt", "petName", "petPhotoUrl", "portraitCount", "portraitUrls", "pricingBadge", "referralCode", "refundAmount", "refunded", "refundedAt", "status", "stripePaymentIntentId", "stripeSessionId", "style", "subtotal", "tax", "tier", "tierName", "utmCampaign", "utmMedium", "utmSource") SELECT "amount", "createdAt", "customerEmail", "customerName", "deliveredAt", "deliveryStatus", "discount", "discountCode", "id", "notes", "paidAt", "petName", "petPhotoUrl", "portraitCount", "portraitUrls", "pricingBadge", "referralCode", "refundAmount", "refunded", "refundedAt", "status", "stripePaymentIntentId", "stripeSessionId", "style", "subtotal", "tax", "tier", "tierName", "utmCampaign", "utmMedium", "utmSource" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_stripeSessionId_key" ON "Order"("stripeSessionId");
CREATE UNIQUE INDEX "Order_stripePaymentIntentId_key" ON "Order"("stripePaymentIntentId");
CREATE INDEX "Order_customerEmail_idx" ON "Order"("customerEmail");
CREATE INDEX "Order_status_idx" ON "Order"("status");
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");
CREATE INDEX "Order_utmSource_idx" ON "Order"("utmSource");
CREATE INDEX "Order_utmMedium_idx" ON "Order"("utmMedium");
CREATE INDEX "Order_referralCode_idx" ON "Order"("referralCode");
CREATE INDEX "Order_giftCardCode_idx" ON "Order"("giftCardCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "CorporateInquiry_status_idx" ON "CorporateInquiry"("status");

-- CreateIndex
CREATE INDEX "CorporateInquiry_email_idx" ON "CorporateInquiry"("email");

-- CreateIndex
CREATE INDEX "CorporateInquiry_createdAt_idx" ON "CorporateInquiry"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CorporateOrder_stripeInvoiceId_key" ON "CorporateOrder"("stripeInvoiceId");

-- CreateIndex
CREATE INDEX "CorporateOrder_contactEmail_idx" ON "CorporateOrder"("contactEmail");

-- CreateIndex
CREATE INDEX "CorporateOrder_paymentStatus_idx" ON "CorporateOrder"("paymentStatus");

-- CreateIndex
CREATE INDEX "CorporateOrder_createdAt_idx" ON "CorporateOrder"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CorporateEmployee_uploadToken_key" ON "CorporateEmployee"("uploadToken");

-- CreateIndex
CREATE INDEX "CorporateEmployee_employeeEmail_idx" ON "CorporateEmployee"("employeeEmail");

-- CreateIndex
CREATE INDEX "CorporateEmployee_uploadToken_idx" ON "CorporateEmployee"("uploadToken");

-- CreateIndex
CREATE INDEX "CorporateEmployee_status_idx" ON "CorporateEmployee"("status");

-- CreateIndex
CREATE INDEX "CorporateEmployee_corporateOrderId_idx" ON "CorporateEmployee"("corporateOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "GiftCard_code_key" ON "GiftCard"("code");

-- CreateIndex
CREATE INDEX "GiftCard_code_idx" ON "GiftCard"("code");

-- CreateIndex
CREATE INDEX "GiftCard_purchaserEmail_idx" ON "GiftCard"("purchaserEmail");

-- CreateIndex
CREATE INDEX "GiftCard_recipientEmail_idx" ON "GiftCard"("recipientEmail");

-- CreateIndex
CREATE INDEX "GiftCardTransaction_giftCardId_idx" ON "GiftCardTransaction"("giftCardId");

-- CreateIndex
CREATE INDEX "GiftCardTransaction_orderId_idx" ON "GiftCardTransaction"("orderId");
