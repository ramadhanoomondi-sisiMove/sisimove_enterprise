-- CreateEnum
CREATE TYPE "IdentityAuditEventType" AS ENUM ('IDENTITY_REGISTERED', 'IDENTITY_ACTIVATED', 'IDENTITY_SUSPENDED', 'IDENTITY_CLOSED', 'AUTHENTICATION_SUCCEEDED', 'AUTHENTICATION_FAILED', 'PASSWORD_CHANGED', 'PASSWORD_RESET', 'MFA_ENABLED', 'MFA_DISABLED', 'MFA_VERIFIED', 'SESSION_CREATED', 'SESSION_REVOKED', 'SESSION_EXPIRED', 'DEVICE_REGISTERED', 'DEVICE_TRUSTED', 'DEVICE_REVOKED', 'ROLE_ASSIGNED', 'ROLE_REVOKED', 'PERMISSION_GRANTED', 'PERMISSION_REVOKED', 'VERIFICATION_STARTED', 'VERIFICATION_APPROVED', 'VERIFICATION_REJECTED', 'VERIFICATION_EXPIRED', 'RECOVERY_STARTED', 'RECOVERY_COMPLETED', 'RECOVERY_CANCELLED', 'SECURITY_POLICY_TRIGGERED');

-- CreateEnum
CREATE TYPE "AuditSeverity" AS ENUM ('INFORMATION', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AuthenticationStatus" AS ENUM ('PENDING', 'ACTIVE', 'LOCKED', 'DISABLED');

-- CreateEnum
CREATE TYPE "RecoveryType" AS ENUM ('PASSWORD_RESET', 'ACCOUNT_UNLOCK', 'MFA_RESET', 'ACCOUNT_RECOVERY');

-- CreateEnum
CREATE TYPE "RecoveryStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "VerificationLevel" AS ENUM ('NONE', 'BASIC', 'STANDARD', 'ENHANCED');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('PENDING', 'TRUSTED', 'REVOKED');

-- CreateEnum
CREATE TYPE "DeviceTrustLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('WEB', 'MOBILE', 'TABLET', 'DESKTOP', 'SERVER', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "SessionRevocationReason" AS ENUM ('USER_LOGOUT', 'ADMIN_LOGOUT', 'PASSWORD_CHANGED', 'PASSWORD_RESET', 'MFA_RESET', 'ACCOUNT_LOCKED', 'ACCOUNT_CLOSED', 'TOKEN_REUSE', 'SECURITY_POLICY', 'DEVICE_REMOVED', 'SESSION_EXPIRED', 'SYSTEM');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "AuthenticationMfaMethod" AS ENUM ('TOTP', 'EMAIL', 'SMS', 'PASSKEY');

-- CreateEnum
CREATE TYPE "IdentityType" AS ENUM ('PERSON', 'ORGANIZATION', 'SERVICE', 'SYSTEM');

-- CreateEnum
CREATE TYPE "IdentityStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "MfaStatus" AS ENUM ('DISABLED', 'ENABLED');

-- CreateEnum
CREATE TYPE "AuthenticationFailureReason" AS ENUM ('INVALID_CREDENTIALS', 'INVALID_PASSWORD', 'IDENTITY_NOT_FOUND', 'IDENTITY_NOT_ACTIVE', 'AUTHENTICATION_NOT_ACTIVE', 'ACCOUNT_DISABLED', 'ACCOUNT_LOCKED', 'TOO_MANY_ATTEMPTS', 'RATE_LIMITED', 'PASSWORD_EXPIRED', 'PASSWORD_CHANGE_REQUIRED', 'MFA_REQUIRED', 'MFA_FAILED', 'MFA_EXPIRED', 'INVALID_TOKEN', 'TOKEN_EXPIRED', 'TOKEN_REVOKED', 'SESSION_EXPIRED', 'INVALID_SESSION', 'UNTRUSTED_DEVICE', 'LOCATION_RESTRICTED', 'NETWORK_RESTRICTED', 'HIGH_RISK_AUTHENTICATION', 'INTERNAL_ERROR');

-- CreateTable
CREATE TABLE "identities" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "type" "IdentityType" NOT NULL,
    "status" "IdentityStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "activatedAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authentications" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "status" "AuthenticationStatus" NOT NULL,
    "passwordHash" TEXT,
    "passwordVersion" INTEGER NOT NULL DEFAULT 1,
    "passwordChangedAt" TIMESTAMP(3),
    "passwordExpiresAt" TIMESTAMP(3),
    "passwordMustChange" BOOLEAN NOT NULL DEFAULT false,
    "failedAuthenticationCount" INTEGER NOT NULL DEFAULT 0,
    "lastFailedAuthenticationAt" TIMESTAMP(3),
    "lockedAt" TIMESTAMP(3),
    "lockedUntil" TIMESTAMP(3),
    "lockReason" "AuthenticationFailureReason",
    "lastAuthenticatedAt" TIMESTAMP(3),
    "mfaStatus" "MfaStatus" NOT NULL,
    "mfaMethod" "AuthenticationMfaMethod",
    "mfaSecret" TEXT,
    "mfaEnabledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "authentications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_histories" (
    "id" TEXT NOT NULL,
    "authenticationId" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_roles" (
    "id" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "assignedById" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "revokedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "identity_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "deviceId" TEXT,
    "status" "SessionStatus" NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "countryCode" VARCHAR(2),
    "city" TEXT,
    "authenticatedAt" TIMESTAMP(3) NOT NULL,
    "lastActivityAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "revokedReason" "SessionRevocationReason",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "status" "DeviceStatus" NOT NULL,
    "trustLevel" "DeviceTrustLevel" NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "name" TEXT,
    "platform" TEXT,
    "operatingSystem" TEXT,
    "operatingSystemVersion" TEXT,
    "browser" TEXT,
    "browserVersion" TEXT,
    "deviceType" "DeviceType" NOT NULL,
    "trustedAt" TIMESTAMP(3),
    "lastSeenAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "level" "VerificationLevel" NOT NULL,
    "status" "VerificationStatus" NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "lastReviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recoveries" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "type" "RecoveryType" NOT NULL,
    "status" "RecoveryStatus" NOT NULL,
    "recoveryTokenHash" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recoveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_audits" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "identityId" TEXT,
    "eventType" "IdentityAuditEventType" NOT NULL,
    "severity" "AuditSeverity" NOT NULL,
    "actorIdentityId" TEXT,
    "resource" TEXT NOT NULL,
    "resourcePublicId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_audits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "identities_publicId_key" ON "identities"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "identities_email_key" ON "identities"("email");

-- CreateIndex
CREATE UNIQUE INDEX "identities_phoneNumber_key" ON "identities"("phoneNumber");

-- CreateIndex
CREATE INDEX "identities_email_idx" ON "identities"("email");

-- CreateIndex
CREATE INDEX "identities_phoneNumber_idx" ON "identities"("phoneNumber");

-- CreateIndex
CREATE INDEX "identities_type_idx" ON "identities"("type");

-- CreateIndex
CREATE INDEX "identities_status_idx" ON "identities"("status");

-- CreateIndex
CREATE INDEX "identities_createdAt_idx" ON "identities"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "authentications_publicId_key" ON "authentications"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "authentications_identityId_key" ON "authentications"("identityId");

-- CreateIndex
CREATE INDEX "authentications_identityId_idx" ON "authentications"("identityId");

-- CreateIndex
CREATE INDEX "authentications_status_idx" ON "authentications"("status");

-- CreateIndex
CREATE INDEX "authentications_lockedUntil_idx" ON "authentications"("lockedUntil");

-- CreateIndex
CREATE INDEX "authentications_lastAuthenticatedAt_idx" ON "authentications"("lastAuthenticatedAt");

-- CreateIndex
CREATE INDEX "password_histories_authenticationId_idx" ON "password_histories"("authenticationId");

-- CreateIndex
CREATE INDEX "password_histories_createdAt_idx" ON "password_histories"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "password_histories_authenticationId_version_key" ON "password_histories"("authenticationId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "roles_publicId_key" ON "roles"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_code_key" ON "roles"("code");

-- CreateIndex
CREATE INDEX "roles_code_idx" ON "roles"("code");

-- CreateIndex
CREATE INDEX "roles_isActive_idx" ON "roles"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_publicId_key" ON "permissions"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_code_key" ON "permissions"("code");

-- CreateIndex
CREATE INDEX "permissions_resource_idx" ON "permissions"("resource");

-- CreateIndex
CREATE INDEX "permissions_action_idx" ON "permissions"("action");

-- CreateIndex
CREATE INDEX "permissions_isActive_idx" ON "permissions"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_resource_action_key" ON "permissions"("resource", "action");

-- CreateIndex
CREATE INDEX "role_permissions_roleId_idx" ON "role_permissions"("roleId");

-- CreateIndex
CREATE INDEX "role_permissions_permissionId_idx" ON "role_permissions"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON "role_permissions"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "identity_roles_identityId_idx" ON "identity_roles"("identityId");

-- CreateIndex
CREATE INDEX "identity_roles_roleId_idx" ON "identity_roles"("roleId");

-- CreateIndex
CREATE INDEX "identity_roles_expiresAt_idx" ON "identity_roles"("expiresAt");

-- CreateIndex
CREATE INDEX "identity_roles_revokedAt_idx" ON "identity_roles"("revokedAt");

-- CreateIndex
CREATE UNIQUE INDEX "identity_roles_identityId_roleId_key" ON "identity_roles"("identityId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_publicId_key" ON "sessions"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refreshTokenHash_key" ON "sessions"("refreshTokenHash");

-- CreateIndex
CREATE INDEX "sessions_identityId_idx" ON "sessions"("identityId");

-- CreateIndex
CREATE INDEX "sessions_deviceId_idx" ON "sessions"("deviceId");

-- CreateIndex
CREATE INDEX "sessions_status_idx" ON "sessions"("status");

-- CreateIndex
CREATE INDEX "sessions_expiresAt_idx" ON "sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "sessions_lastActivityAt_idx" ON "sessions"("lastActivityAt");

-- CreateIndex
CREATE UNIQUE INDEX "devices_publicId_key" ON "devices"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "devices_fingerprint_key" ON "devices"("fingerprint");

-- CreateIndex
CREATE INDEX "devices_identityId_idx" ON "devices"("identityId");

-- CreateIndex
CREATE INDEX "devices_status_idx" ON "devices"("status");

-- CreateIndex
CREATE INDEX "devices_trustLevel_idx" ON "devices"("trustLevel");

-- CreateIndex
CREATE INDEX "devices_lastSeenAt_idx" ON "devices"("lastSeenAt");

-- CreateIndex
CREATE UNIQUE INDEX "verifications_publicId_key" ON "verifications"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "verifications_identityId_key" ON "verifications"("identityId");

-- CreateIndex
CREATE INDEX "verifications_status_idx" ON "verifications"("status");

-- CreateIndex
CREATE INDEX "verifications_level_idx" ON "verifications"("level");

-- CreateIndex
CREATE INDEX "verifications_expiresAt_idx" ON "verifications"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "recoveries_publicId_key" ON "recoveries"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "recoveries_recoveryTokenHash_key" ON "recoveries"("recoveryTokenHash");

-- CreateIndex
CREATE INDEX "recoveries_identityId_idx" ON "recoveries"("identityId");

-- CreateIndex
CREATE INDEX "recoveries_status_idx" ON "recoveries"("status");

-- CreateIndex
CREATE INDEX "recoveries_expiresAt_idx" ON "recoveries"("expiresAt");

-- CreateIndex
CREATE INDEX "recoveries_requestedAt_idx" ON "recoveries"("requestedAt");

-- CreateIndex
CREATE UNIQUE INDEX "identity_audits_publicId_key" ON "identity_audits"("publicId");

-- CreateIndex
CREATE INDEX "identity_audits_identityId_idx" ON "identity_audits"("identityId");

-- CreateIndex
CREATE INDEX "identity_audits_actorIdentityId_idx" ON "identity_audits"("actorIdentityId");

-- CreateIndex
CREATE INDEX "identity_audits_eventType_idx" ON "identity_audits"("eventType");

-- CreateIndex
CREATE INDEX "identity_audits_severity_idx" ON "identity_audits"("severity");

-- CreateIndex
CREATE INDEX "identity_audits_occurredAt_idx" ON "identity_audits"("occurredAt");

-- AddForeignKey
ALTER TABLE "authentications" ADD CONSTRAINT "authentications_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_histories" ADD CONSTRAINT "password_histories_authenticationId_fkey" FOREIGN KEY ("authenticationId") REFERENCES "authentications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_roles" ADD CONSTRAINT "identity_roles_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_roles" ADD CONSTRAINT "identity_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_roles" ADD CONSTRAINT "identity_roles_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "identities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_roles" ADD CONSTRAINT "identity_roles_revokedById_fkey" FOREIGN KEY ("revokedById") REFERENCES "identities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recoveries" ADD CONSTRAINT "recoveries_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_audits" ADD CONSTRAINT "identity_audits_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "identities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_audits" ADD CONSTRAINT "identity_audits_actorIdentityId_fkey" FOREIGN KEY ("actorIdentityId") REFERENCES "identities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
