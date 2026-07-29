/*
  Warnings:

  - You are about to drop the column `assetPublicId` on the `verification_requests` table. All the data in the column will be lost.
  - Added the required column `assetId` to the `verification_requests` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "AssetCategory" AS ENUM ('PROFILE_PHOTO', 'COVER_PHOTO', 'AVATAR', 'GOVERNMENT_ID', 'DRIVER_LICENSE', 'PASSPORT', 'SELFIE', 'POST_MEDIA', 'COMMENT_MEDIA', 'STORY_MEDIA', 'REEL_MEDIA', 'CHAT_ATTACHMENT', 'TRIP_MEDIA', 'DESTINATION_MEDIA', 'VEHICLE_PHOTO', 'ORGANIZATION_LOGO', 'ORGANIZATION_BANNER', 'PRODUCT_MEDIA', 'EVENT_BANNER', 'OTHER');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('PENDING', 'SCANNING', 'PROCESSING', 'READY', 'FAILED', 'ARCHIVED', 'DELETED');

-- CreateEnum
CREATE TYPE "AssetVisibility" AS ENUM ('PUBLIC', 'COMMUNITY', 'CONNECTIONS', 'PRIVATE');

-- CreateEnum
CREATE TYPE "StorageProvider" AS ENUM ('LOCAL', 'AWS_S3', 'CLOUDINARY', 'GOOGLE_CLOUD_STORAGE', 'AZURE_BLOB');

-- CreateEnum
CREATE TYPE "AssetVariantType" AS ENUM ('ORIGINAL', 'THUMBNAIL', 'SMALL', 'MEDIUM', 'LARGE', 'WEB', 'WEBP', 'AVIF', 'PREVIEW', 'COMPRESSED');

-- CreateEnum
CREATE TYPE "ChecksumAlgorithm" AS ENUM ('MD5', 'SHA1', 'SHA256', 'SHA512');

-- AlterTable
ALTER TABLE "verification_requests" DROP COLUMN "assetPublicId",
ADD COLUMN     "assetId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "ownerIdentityId" TEXT,
    "type" "AssetType" NOT NULL,
    "category" "AssetCategory" NOT NULL,
    "status" "AssetStatus" NOT NULL DEFAULT 'PENDING',
    "visibility" "AssetVisibility" NOT NULL DEFAULT 'PRIVATE',
    "storageProvider" "StorageProvider" NOT NULL,
    "bucket" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "originalFilename" TEXT,
    "storedFilename" TEXT,
    "mimeType" TEXT NOT NULL,
    "extension" TEXT,
    "sizeBytes" BIGINT NOT NULL,
    "checksumAlgorithm" "ChecksumAlgorithm",
    "checksum" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "colorDepth" INTEGER,
    "durationSeconds" INTEGER,
    "bitrate" INTEGER,
    "frameRate" DOUBLE PRECISION,
    "blurHash" TEXT,
    "metadata" JSONB,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_variants" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "variant" "AssetVariantType" NOT NULL,
    "storageProvider" "StorageProvider" NOT NULL,
    "bucket" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "extension" TEXT,
    "sizeBytes" BIGINT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "durationSeconds" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asset_variants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assets_publicId_key" ON "assets"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "assets_objectKey_key" ON "assets"("objectKey");

-- CreateIndex
CREATE INDEX "assets_ownerIdentityId_idx" ON "assets"("ownerIdentityId");

-- CreateIndex
CREATE INDEX "assets_type_idx" ON "assets"("type");

-- CreateIndex
CREATE INDEX "assets_category_idx" ON "assets"("category");

-- CreateIndex
CREATE INDEX "assets_status_idx" ON "assets"("status");

-- CreateIndex
CREATE INDEX "assets_visibility_idx" ON "assets"("visibility");

-- CreateIndex
CREATE INDEX "assets_uploadedAt_idx" ON "assets"("uploadedAt");

-- CreateIndex
CREATE INDEX "assets_deletedAt_idx" ON "assets"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "asset_variants_objectKey_key" ON "asset_variants"("objectKey");

-- CreateIndex
CREATE INDEX "asset_variants_assetId_idx" ON "asset_variants"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "asset_variants_assetId_variant_key" ON "asset_variants"("assetId", "variant");

-- AddForeignKey
ALTER TABLE "verification_requests" ADD CONSTRAINT "verification_requests_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_ownerIdentityId_fkey" FOREIGN KEY ("ownerIdentityId") REFERENCES "identities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_variants" ADD CONSTRAINT "asset_variants_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
