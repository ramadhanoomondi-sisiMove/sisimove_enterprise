/*
  Warnings:

  - The values [AUTHENTICATION_SUCCEEDED,AUTHENTICATION_FAILED] on the enum `IdentityAuditEventType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `resource` on the `identity_audits` table. All the data in the column will be lost.
  - Added the required column `actorType` to the `identity_audits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resourceType` to the `identity_audits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `result` to the `identity_audits` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuditResult" AS ENUM ('SUCCESS', 'FAILURE');

-- CreateEnum
CREATE TYPE "AuditActorType" AS ENUM ('IDENTITY', 'SYSTEM', 'SERVICE', 'API_KEY');

-- CreateEnum
CREATE TYPE "AuditResourceType" AS ENUM ('IDENTITY', 'AUTHENTICATION', 'SESSION', 'DEVICE', 'ROLE', 'PERMISSION', 'VERIFICATION', 'VERIFICATION_REQUEST', 'RECOVERY');

-- AlterEnum
BEGIN;
CREATE TYPE "IdentityAuditEventType_new" AS ENUM ('IDENTITY_REGISTERED', 'IDENTITY_ACTIVATED', 'IDENTITY_SUSPENDED', 'IDENTITY_CLOSED', 'AUTHENTICATION', 'PASSWORD_CHANGED', 'PASSWORD_RESET', 'MFA_ENABLED', 'MFA_DISABLED', 'MFA_VERIFIED', 'SESSION_CREATED', 'SESSION_REVOKED', 'SESSION_EXPIRED', 'DEVICE_REGISTERED', 'DEVICE_TRUSTED', 'DEVICE_REVOKED', 'ROLE_ASSIGNED', 'ROLE_REVOKED', 'PERMISSION_GRANTED', 'PERMISSION_REVOKED', 'VERIFICATION_STARTED', 'VERIFICATION_APPROVED', 'VERIFICATION_REJECTED', 'VERIFICATION_EXPIRED', 'VERIFICATION_REVOKED', 'RECOVERY_STARTED', 'RECOVERY_COMPLETED', 'RECOVERY_CANCELLED', 'SECURITY_POLICY_TRIGGERED');
ALTER TABLE "identity_audits" ALTER COLUMN "eventType" TYPE "IdentityAuditEventType_new" USING ("eventType"::text::"IdentityAuditEventType_new");
ALTER TYPE "IdentityAuditEventType" RENAME TO "IdentityAuditEventType_old";
ALTER TYPE "IdentityAuditEventType_new" RENAME TO "IdentityAuditEventType";
DROP TYPE "public"."IdentityAuditEventType_old";
COMMIT;

-- AlterTable
ALTER TABLE "identity_audits" DROP COLUMN "resource",
ADD COLUMN     "actorType" "AuditActorType" NOT NULL,
ADD COLUMN     "correlationId" TEXT,
ADD COLUMN     "resourceType" "AuditResourceType" NOT NULL,
ADD COLUMN     "result" "AuditResult" NOT NULL;

-- CreateIndex
CREATE INDEX "identity_audits_result_idx" ON "identity_audits"("result");

-- CreateIndex
CREATE INDEX "identity_audits_resourceType_idx" ON "identity_audits"("resourceType");

-- CreateIndex
CREATE INDEX "identity_audits_resourcePublicId_idx" ON "identity_audits"("resourcePublicId");

-- CreateIndex
CREATE INDEX "identity_audits_correlationId_idx" ON "identity_audits"("correlationId");
