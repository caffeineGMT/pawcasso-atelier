-- CreateTable
CREATE TABLE "CustomerReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerEmail" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "petName" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "reviewText" TEXT NOT NULL,
    "petPhotoUrl" TEXT,
    "portraitUrl" TEXT,
    "instagramHandle" TEXT,
    "instagramPostUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" DATETIME,
    "artStyle" TEXT,
    "orderValue" REAL
);

-- CreateTable
CREATE TABLE "SocialProofStats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "totalCustomers" INTEGER NOT NULL DEFAULT 0,
    "totalPortraits" INTEGER NOT NULL DEFAULT 0,
    "averageRating" REAL NOT NULL DEFAULT 4.9,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "instagramFollowers" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "InstagramPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "instagramPostId" TEXT NOT NULL,
    "customerEmail" TEXT,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "postedAt" DATETIME NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "CustomerReview_approved_idx" ON "CustomerReview"("approved");

-- CreateIndex
CREATE INDEX "CustomerReview_featured_idx" ON "CustomerReview"("featured");

-- CreateIndex
CREATE INDEX "CustomerReview_customerEmail_idx" ON "CustomerReview"("customerEmail");

-- CreateIndex
CREATE UNIQUE INDEX "InstagramPost_instagramPostId_key" ON "InstagramPost"("instagramPostId");

-- CreateIndex
CREATE INDEX "InstagramPost_featured_idx" ON "InstagramPost"("featured");
