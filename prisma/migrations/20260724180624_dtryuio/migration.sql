/*
  Warnings:

  - The values [BASIC,STANDARD,ENHANCED] on the enum `VerificationLevel` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "VerificationRequestType" AS ENUM ('PROFILE_PHOTO', 'GOVERNMENT_ID', 'DRIVER_LICENSE');

-- CreateEnum
CREATE TYPE "VerificationRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "VerificationDecisionReason" AS ENUM ('INITIAL_APPROVAL', 'DOCUMENT_UPDATED', 'DOCUMENT_EXPIRED', 'DOCUMENT_REJECTED', 'MANUAL_REVIEW', 'ADMIN_OVERRIDE');

-- AlterEnum
BEGIN;
CREATE TYPE "VerificationLevel_new" AS ENUM ('NONE', 'MEMBER', 'DRIVER');
ALTER TABLE "verifications" ALTER COLUMN "level" TYPE "VerificationLevel_new" USING ("level"::text::"VerificationLevel_new");
ALTER TYPE "VerificationLevel" RENAME TO "VerificationLevel_old";
ALTER TYPE "VerificationLevel_new" RENAME TO "VerificationLevel";
DROP TYPE "public"."VerificationLevel_old";
COMMIT;

-- AlterTable
ALTER TABLE "verifications" ADD COLUMN     "decisionReason" "VerificationDecisionReason",
ADD COLUMN     "driverLicenseVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "driverLicenseVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "driverVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "governmentIdVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "governmentIdVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "memberVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "profilePhotoVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profilePhotoVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedById" TEXT;

-- CreateTable
CREATE TABLE "verification_requests" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "verificationId" TEXT NOT NULL,
    "type" "VerificationRequestType" NOT NULL,
    "status" "VerificationRequestStatus" NOT NULL,
    "assetPublicId" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "rejectionReason" TEXT,
    "expiresAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "verification_requests_publicId_key" ON "verification_requests"("publicId");

-- CreateIndex
CREATE INDEX "verification_requests_verificationId_idx" ON "verification_requests"("verificationId");

-- CreateIndex
CREATE INDEX "verification_requests_type_idx" ON "verification_requests"("type");

-- CreateIndex
CREATE INDEX "verification_requests_status_idx" ON "verification_requests"("status");

-- CreateIndex
CREATE INDEX "verifications_identityId_idx" ON "verifications"("identityId");

-- CreateIndex
CREATE INDEX "verifications_reviewedById_idx" ON "verifications"("reviewedById");

-- AddForeignKey
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "identities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_requests" ADD CONSTRAINT "verification_requests_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES "verifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_requests" ADD CONSTRAINT "verification_requests_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "identities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
