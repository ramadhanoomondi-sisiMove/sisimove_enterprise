/*
  Warnings:

  - The `failureReason` column on the `recoveries` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RecoveryFailureReason" AS ENUM ('USER_CANCELLED', 'ADMIN_CANCELLED', 'SYSTEM_CANCELLED', 'TOKEN_INVALID', 'TOKEN_EXPIRED', 'TOO_MANY_ATTEMPTS', 'PASSWORD_ALREADY_CHANGED', 'ACCOUNT_LOCKED');

-- AlterEnum
ALTER TYPE "VerificationStatus" ADD VALUE 'REVOKED';

-- DropIndex
DROP INDEX "recoveries_status_idx";

-- AlterTable
ALTER TABLE "recoveries" DROP COLUMN "failureReason",
ADD COLUMN     "failureReason" "RecoveryFailureReason";

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "recoveries_identityId_type_idx" ON "recoveries"("identityId", "type");

-- CreateIndex
CREATE INDEX "recoveries_identityId_status_idx" ON "recoveries"("identityId", "status");
