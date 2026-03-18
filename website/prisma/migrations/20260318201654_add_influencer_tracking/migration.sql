-- CreateTable
CREATE TABLE "Influencer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "followerCount" INTEGER NOT NULL,
    "email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'identified',
    "discountCode" TEXT,
    "affiliateLink" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "contactedAt" DATETIME,
    "respondedAt" DATETIME,
    "agreedAt" DATETIME,
    "postedAt" DATETIME,
    "portraitSent" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "profileUrl" TEXT,
    "estimatedReach" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OutreachMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "influencerId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responseText" TEXT,
    "respondedAt" DATETIME,
    CONSTRAINT "OutreachMessage_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "Influencer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InfluencerConversion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "influencerId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "revenue" REAL NOT NULL,
    "commission" REAL NOT NULL,
    "conversionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    CONSTRAINT "InfluencerConversion_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "Influencer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Influencer_handle_key" ON "Influencer"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "Influencer_discountCode_key" ON "Influencer"("discountCode");
