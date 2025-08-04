-- AlterTable
ALTER TABLE "WeddingEvent" ADD COLUMN "stripePaymentIntentId" TEXT;

-- AlterTable
ALTER TABLE "WeddingQuote" ADD COLUMN "emailType" TEXT;
ALTER TABLE "WeddingQuote" ADD COLUMN "lastEmailSent" DATETIME;
ALTER TABLE "WeddingQuote" ADD COLUMN "paidAt" DATETIME;
ALTER TABLE "WeddingQuote" ADD COLUMN "paymentStatus" TEXT;
ALTER TABLE "WeddingQuote" ADD COLUMN "stripePaymentIntentId" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "eventId" TEXT,
    "vendorId" TEXT,
    "packageId" TEXT,
    "venueId" TEXT,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "comment" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "WeddingEvent" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Review_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "WeddingPackage" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Review_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Review_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "VendorProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("comment", "createdAt", "eventId", "id", "isApproved", "rating", "title", "updatedAt", "userId", "vendorId") SELECT "comment", "createdAt", "eventId", "id", "isApproved", "rating", "title", "updatedAt", "userId", "vendorId" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
CREATE INDEX "Review_userId_idx" ON "Review"("userId");
CREATE INDEX "Review_status_idx" ON "Review"("status");
CREATE INDEX "Review_rating_idx" ON "Review"("rating");
CREATE INDEX "Review_createdAt_idx" ON "Review"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "WeddingQuote_paymentStatus_idx" ON "WeddingQuote"("paymentStatus");
