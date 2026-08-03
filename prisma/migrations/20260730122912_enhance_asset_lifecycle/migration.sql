-- CreateEnum
CREATE TYPE "AssetModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "asset_variants" ADD COLUMN     "isGenerated" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "assets" ADD COLUMN     "archiveReason" TEXT,
ADD COLUMN     "deletionReason" TEXT,
ADD COLUMN     "moderatedAt" TIMESTAMP(3),
ADD COLUMN     "moderationStatus" "AssetModerationStatus",
ADD COLUMN     "processedBy" TEXT,
ADD COLUMN     "processingFailedAt" TIMESTAMP(3),
ADD COLUMN     "processingFailureReason" TEXT,
ADD COLUMN     "processingVersion" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "scanEngine" TEXT,
ADD COLUMN     "scannedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "assets_processedAt_idx" ON "assets"("processedAt");

-- CreateIndex
CREATE INDEX "assets_archivedAt_idx" ON "assets"("archivedAt");

-- CreateIndex
CREATE INDEX "assets_moderationStatus_idx" ON "assets"("moderationStatus");
