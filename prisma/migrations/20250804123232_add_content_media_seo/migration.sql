-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "page" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail" TEXT,
    "duration" TEXT,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SEOSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siteTitle" TEXT,
    "siteDescription" TEXT,
    "keywords" TEXT,
    "ogImage" TEXT,
    "twitterCard" TEXT,
    "googleAnalytics" TEXT,
    "googleTagManager" TEXT,
    "structuredData" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Content_page_key" ON "Content"("page");

-- CreateIndex
CREATE INDEX "Content_page_idx" ON "Content"("page");

-- CreateIndex
CREATE INDEX "Media_category_idx" ON "Media"("category");

-- CreateIndex
CREATE INDEX "Media_type_idx" ON "Media"("type");

-- CreateIndex
CREATE INDEX "Media_createdAt_idx" ON "Media"("createdAt");
