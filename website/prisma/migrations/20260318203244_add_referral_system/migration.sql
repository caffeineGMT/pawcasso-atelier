-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "referralCode" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "creditBalance" REAL NOT NULL DEFAULT 0,
    "totalReferrals" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "referrerEmail" TEXT NOT NULL,
    "referredEmail" TEXT NOT NULL,
    "referralCode" TEXT NOT NULL,
    "clickedAt" DATETIME,
    "convertedAt" DATETIME,
    "orderId" TEXT,
    "orderValue" REAL,
    "referrerCredit" REAL NOT NULL DEFAULT 5.0,
    "referredDiscount" REAL NOT NULL DEFAULT 0.2,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Referral_referrerEmail_fkey" FOREIGN KEY ("referrerEmail") REFERENCES "Customer" ("email") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Referral_referredEmail_fkey" FOREIGN KEY ("referredEmail") REFERENCES "Customer" ("email") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CreditTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerEmail" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "referralId" TEXT,
    "orderId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CreditTransaction_customerEmail_fkey" FOREIGN KEY ("customerEmail") REFERENCES "Customer" ("email") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MilestoneAchievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerEmail" TEXT NOT NULL,
    "milestone" TEXT NOT NULL,
    "reward" TEXT NOT NULL,
    "achievedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "MilestoneAchievement_customerEmail_fkey" FOREIGN KEY ("customerEmail") REFERENCES "Customer" ("email") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_referralCode_key" ON "Customer"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_stripeCustomerId_key" ON "Customer"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "Referral_referralCode_idx" ON "Referral"("referralCode");

-- CreateIndex
CREATE INDEX "Referral_referrerEmail_idx" ON "Referral"("referrerEmail");

-- CreateIndex
CREATE INDEX "Referral_referredEmail_idx" ON "Referral"("referredEmail");

-- CreateIndex
CREATE INDEX "CreditTransaction_customerEmail_idx" ON "CreditTransaction"("customerEmail");

-- CreateIndex
CREATE UNIQUE INDEX "MilestoneAchievement_customerEmail_milestone_key" ON "MilestoneAchievement"("customerEmail", "milestone");
