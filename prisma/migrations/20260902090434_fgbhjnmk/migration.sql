-- CreateEnum
CREATE TYPE "JourneyCompletionConfirmationRole" AS ENUM ('PROVIDER', 'PASSENGER');

-- CreateEnum
CREATE TYPE "JourneyCompletionConfirmationStatus" AS ENUM ('CONFIRMED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "JourneyCompletionDisputeStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "JourneyCompletionDisputeReason" AS ENUM ('JOURNEY_NOT_COMPLETED', 'PASSENGER_DID_NOT_TRAVEL', 'PROVIDER_DID_NOT_TRAVEL', 'WRONG_DESTINATION', 'EARLY_TERMINATION', 'SAFETY_ISSUE', 'OTHER');

-- CreateEnum
CREATE TYPE "JourneySettlementStatus" AS ENUM ('PENDING', 'SUBMITTED', 'PROCESSING', 'COMPLETED', 'FAILED', 'HELD', 'CANCELLED');

-- CreateEnum
CREATE TYPE "JourneyCompletionStatus" AS ENUM ('PENDING', 'CONFIRMATION_REQUIRED', 'CONFIRMED', 'DISPUTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "JourneyBookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "JourneyBookingCancellationReason" AS ENUM ('PASSENGER_REQUEST', 'PROVIDER_REQUEST', 'JOURNEY_CANCELLED', 'NO_SHOW', 'SYSTEM', 'OTHER');

-- CreateEnum
CREATE TYPE "JourneyBookingPaymentStatus" AS ENUM ('PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "JourneyDemandWaypointType" AS ENUM ('ORIGIN', 'DESTINATION', 'PICKUP', 'DROPOFF', 'WAYPOINT');

-- CreateEnum
CREATE TYPE "JourneyDemandParticipantStatus" AS ENUM ('ACTIVE', 'WITHDRAWN', 'REMOVED');

-- CreateEnum
CREATE TYPE "JourneyDemandStatus" AS ENUM ('DRAFT', 'OPEN', 'MATCHED', 'CONVERTED', 'FULFILLED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AssetVariantType" AS ENUM ('ORIGINAL', 'ICON', 'THUMBNAIL', 'TINY', 'SMALL', 'MEDIUM', 'LARGE', 'XLARGE', 'WEB', 'WEBP', 'AVIF', 'PREVIEW', 'COMPRESSED', 'HD', 'FULL_HD', 'QHD', 'UHD_4K');

-- CreateEnum
CREATE TYPE "AssetProcessingOperation" AS ENUM ('THUMBNAIL', 'PREVIEW', 'COMPRESS', 'RESIZE', 'ROTATE', 'WEBP', 'AVIF', 'TRANSCODE', 'OCR', 'BLUR_HASH', 'WATERMARK', 'STRIP_METADATA', 'FACE_DETECTION', 'AI_TAGGING', 'AI_CAPTION');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'ARCHIVE', 'OTHER');

-- CreateEnum
CREATE TYPE "AssetCategory" AS ENUM ('PROFILE_PHOTO', 'COVER_PHOTO', 'AVATAR', 'GOVERNMENT_ID', 'DRIVER_LICENSE', 'PASSPORT', 'SELFIE', 'POST_MEDIA', 'COMMENT_MEDIA', 'STORY_MEDIA', 'REEL_MEDIA', 'CHAT_ATTACHMENT', 'TRIP_MEDIA', 'DESTINATION_MEDIA', 'VEHICLE_PHOTO', 'ORGANIZATION_LOGO', 'ORGANIZATION_BANNER', 'PRODUCT_MEDIA', 'EVENT_BANNER', 'OTHER');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('UPLOADING', 'UPLOADED', 'SCANNING', 'SCAN_FAILED', 'PROCESSING', 'PROCESSING_FAILED', 'READY', 'ARCHIVING', 'ARCHIVED', 'DELETING', 'DELETED');

-- CreateEnum
CREATE TYPE "AssetVisibility" AS ENUM ('PUBLIC', 'COMMUNITY', 'CONNECTIONS', 'PRIVATE');

-- CreateEnum
CREATE TYPE "StorageProvider" AS ENUM ('LOCAL', 'AWS_S3', 'GOOGLE_CLOUD_STORAGE', 'AZURE_BLOB', 'CLOUDINARY', 'OTHER');

-- CreateEnum
CREATE TYPE "AssetVariantStatus" AS ENUM ('PENDING', 'PROCESSING', 'READY', 'FAILED');

-- CreateEnum
CREATE TYPE "ChecksumAlgorithm" AS ENUM ('MD5', 'SHA1', 'SHA256', 'SHA512');

-- CreateEnum
CREATE TYPE "AssetProcessingStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AssetProcessor" AS ENUM ('LIBVIPS', 'IMAGEMAGICK', 'FFMPEG', 'CLOUDINARY', 'CUSTOM', 'GDAL');

-- CreateEnum
CREATE TYPE "AssetScanEngine" AS ENUM ('CLAMAV', 'VIRUS_TOTAL', 'MICROSOFT_DEFENDER', 'CUSTOM');

-- CreateEnum
CREATE TYPE "AssetScanStatus" AS ENUM ('PENDING', 'CLEAN', 'INFECTED', 'FAILED');

-- CreateEnum
CREATE TYPE "AssetModerationType" AS ENUM ('AI', 'MANUAL', 'COMMUNITY', 'COPYRIGHT');

-- CreateEnum
CREATE TYPE "AssetModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AssetReferenceField" AS ENUM ('PRIMARY', 'SECONDARY', 'AVATAR', 'COVER', 'BANNER', 'THUMBNAIL', 'PREVIEW', 'GALLERY', 'ATTACHMENT', 'DOCUMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "AssetResourceType" AS ENUM ('IDENTITY', 'MEMBER', 'ORGANIZATION', 'POST', 'COMMENT', 'MESSAGE', 'STORY', 'REEL', 'TRIP', 'DESTINATION', 'EVENT', 'PRODUCT', 'VEHICLE', 'VERIFICATION', 'OTHER');

-- CreateEnum
CREATE TYPE "TravellerProfileStatus" AS ENUM ('ACTIVE', 'RESTRICTED', 'SUSPENDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "TravellerProfileVisibility" AS ENUM ('PUBLIC', 'LIMITED', 'PRIVATE');

-- CreateEnum
CREATE TYPE "TrustVerificationLevel" AS ENUM ('NONE', 'BASIC', 'VERIFIED', 'HIGHLY_VERIFIED');

-- CreateEnum
CREATE TYPE "TrustProfileStatus" AS ENUM ('ACTIVE', 'RESTRICTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "TrustRatingStatus" AS ENUM ('ACTIVE', 'HIDDEN', 'REMOVED');

-- CreateEnum
CREATE TYPE "TrustRatingRole" AS ENUM ('PROVIDER', 'PASSENGER');

-- CreateEnum
CREATE TYPE "TrustEventType" AS ENUM ('JOURNEY_COMPLETED', 'JOURNEY_CANCELLED', 'RATING_RECEIVED', 'RATING_REMOVED', 'VERIFICATION_GRANTED', 'VERIFICATION_REVOKED', 'BADGE_AWARDED', 'BADGE_REVOKED', 'DISPUTE_OPENED', 'DISPUTE_RESOLVED', 'TRUST_RESTRICTED', 'TRUST_RESTORED', 'MANUAL_ADJUSTMENT');

-- CreateEnum
CREATE TYPE "TrustBadgeType" AS ENUM ('IDENTITY_VERIFIED', 'PHONE_VERIFIED', 'EXPERIENCED_PROVIDER', 'EXPERIENCED_TRAVELLER', 'RELIABLE_PROVIDER', 'RELIABLE_TRAVELLER', 'HIGHLY_RATED');

-- CreateEnum
CREATE TYPE "JourneySmokingPolicy" AS ENUM ('ALLOWED', 'NOT_ALLOWED');

-- CreateEnum
CREATE TYPE "JourneyPetsPolicy" AS ENUM ('ALLOWED', 'NOT_ALLOWED', 'SERVICE_ANIMALS_ONLY');

-- CreateEnum
CREATE TYPE "JourneyLuggagePolicy" AS ENUM ('NONE', 'LIMITED', 'STANDARD', 'LARGE');

-- CreateEnum
CREATE TYPE "JourneyConversationPreference" AS ENUM ('QUIET', 'MODERATE', 'SOCIAL');

-- CreateEnum
CREATE TYPE "JourneyMusicPreference" AS ENUM ('NONE', 'LOW', 'MODERATE', 'ANY');

-- CreateEnum
CREATE TYPE "JourneyAssetType" AS ENUM ('VEHICLE', 'ROUTE', 'OTHER');

-- CreateEnum
CREATE TYPE "JourneyWaypointType" AS ENUM ('ORIGIN', 'DESTINATION', 'PICKUP', 'DROPOFF', 'WAYPOINT');

-- CreateEnum
CREATE TYPE "JourneyStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'FULL', 'BOARDING', 'IN_PROGRESS', 'COMPLETION_PENDING', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "JourneyBoardingStatus" AS ENUM ('NOT_STARTED', 'BOARDING', 'STARTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "JourneyBoardingParticipantRole" AS ENUM ('PROVIDER', 'PASSENGER');

-- CreateEnum
CREATE TYPE "JourneyBoardingParticipantStatus" AS ENUM ('EXPECTED', 'BOARDED', 'WITHDRAWN', 'NO_SHOW', 'REMOVED');

-- CreateEnum
CREATE TYPE "JourneyBoardingEventType" AS ENUM ('BOARDING_OPENED', 'PROVIDER_BOARDED', 'PASSENGER_BOARDED', 'PASSENGER_NO_SHOW', 'BOARDING_WITHDRAWN', 'PARTICIPANT_REMOVED', 'JOURNEY_STARTED', 'BOARDING_CANCELLED');

-- CreateEnum
CREATE TYPE "CommercialCommissionType" AS ENUM ('BOOKING', 'EARNING');

-- CreateEnum
CREATE TYPE "CommercialCommissionRuleStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "CommercialCommissionStatus" AS ENUM ('PENDING', 'ASSESSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FinancialAccountType" AS ENUM ('USER', 'PLATFORM', 'MERCHANT', 'HOLDING', 'SETTLEMENT');

-- CreateEnum
CREATE TYPE "FinancialAccountStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "FinancialTransactionType" AS ENUM ('PAYMENT', 'TRANSFER', 'HOLD', 'RELEASE', 'CAPTURE', 'SETTLEMENT', 'DISBURSEMENT', 'REFUND', 'REVERSAL', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "FinancialTransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REVERSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FinancialTransactionEntryType" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "FinancialBalanceType" AS ENUM ('AVAILABLE', 'PENDING', 'HELD');

-- CreateEnum
CREATE TYPE "FinancialAccountHoldStatus" AS ENUM ('ACTIVE', 'RELEASED', 'CAPTURED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FinancialPaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "FinancialPaymentMethodType" AS ENUM ('MOBILE_MONEY', 'BANK', 'CARD', 'WALLET', 'OTHER');

-- CreateEnum
CREATE TYPE "FinancialPaymentAttemptStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "FinancialSettlementStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FinancialSettlementItemStatus" AS ENUM ('PENDING', 'ALLOCATED', 'SETTLED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FinancialSettlementAllocationType" AS ENUM ('PRINCIPAL', 'COMMISSION', 'FEE', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "FinancialAccountWithdrawalStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FinancialDisbursementStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FinancialDisbursementAttemptStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FinancialDisbursementDestinationType" AS ENUM ('MOBILE_MONEY', 'BANK_ACCOUNT', 'OTHER');

-- CreateEnum
CREATE TYPE "AccountingAccountType" AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE');

-- CreateEnum
CREATE TYPE "AccountingAccountStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "AccountingPeriodStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "AccountingJournalStatus" AS ENUM ('DRAFT', 'POSTED', 'REVERSED');

-- CreateEnum
CREATE TYPE "AccountingJournalLineType" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "SupportResolutionType" AS ENUM ('INFORMATION_PROVIDED', 'ACTION_TAKEN', 'REFUND_ISSUED', 'BOOKING_CANCELLED', 'JOURNEY_CANCELLED', 'ACCOUNT_RESTRICTED', 'TRUST_ACTION', 'VERIFICATION_ACTION', 'NO_ACTION_REQUIRED', 'REFERRED', 'OTHER');

-- CreateEnum
CREATE TYPE "SupportMessageType" AS ENUM ('TEXT', 'IMAGE', 'FILE', 'SYSTEM');

-- CreateEnum
CREATE TYPE "SupportCaseParticipantRole" AS ENUM ('REQUESTER', 'RESPONDENT', 'SUPPORT_AGENT', 'REVIEWER');

-- CreateEnum
CREATE TYPE "SupportCaseStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_FOR_MEMBER', 'WAITING_FOR_INTERNAL_ACTION', 'RESOLVED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SupportCasePriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "SupportCaseCategory" AS ENUM ('JOURNEY', 'BOOKING', 'PAYMENT', 'WALLET', 'REFUND', 'TRUST', 'VERIFICATION', 'MESSAGING', 'ACCOUNT', 'SAFETY', 'OTHER');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'PUSH', 'EMAIL', 'SMS');

-- CreateEnum
CREATE TYPE "NotificationDeliveryStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('JOURNEY', 'BOOKING', 'PAYMENT', 'WALLET', 'TRUST', 'VERIFICATION', 'MESSAGE', 'SUPPORT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'READ', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MessagingParticipantRole" AS ENUM ('PROVIDER', 'PASSENGER');

-- CreateEnum
CREATE TYPE "MessagingParticipantStatus" AS ENUM ('ACTIVE', 'LEFT', 'REMOVED');

-- CreateEnum
CREATE TYPE "MessagingMessageType" AS ENUM ('TEXT', 'IMAGE', 'FILE', 'SYSTEM');

-- CreateEnum
CREATE TYPE "MessagingMessageStatus" AS ENUM ('SENT', 'EDITED', 'DELETED', 'MODERATED');

-- CreateEnum
CREATE TYPE "MessagingConversationStatus" AS ENUM ('ACTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "MessagingConversationType" AS ENUM ('JOURNEY', 'DIRECT');

-- CreateEnum
CREATE TYPE "AuthenticationStatus" AS ENUM ('PENDING', 'ACTIVE', 'LOCKED', 'DISABLED');

-- CreateEnum
CREATE TYPE "AuthenticationFailureReason" AS ENUM ('INVALID_CREDENTIALS', 'ACCOUNT_LOCKED', 'ACCOUNT_DISABLED', 'IDENTITY_NOT_ACTIVE', 'TOO_MANY_ATTEMPTS', 'PASSWORD_CHANGE_REQUIRED', 'PASSWORD_RESET_REQUIRED', 'INVALID_OTP', 'OTP_EXPIRED', 'RATE_LIMITED');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "SessionRevocationReason" AS ENUM ('USER_LOGOUT', 'PASSWORD_CHANGED', 'PASSWORD_RESET', 'ACCOUNT_LOCKED', 'ACCOUNT_DISABLED', 'DEVICE_REVOKED', 'TOKEN_REUSE', 'SESSION_EXPIRED', 'SYSTEM');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ACTIVE', 'REVOKED');

-- CreateEnum
CREATE TYPE "DeviceTrustLevel" AS ENUM ('LOW', 'TRUSTED');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('WEB', 'MOBILE', 'TABLET', 'DESKTOP', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "RecoveryType" AS ENUM ('PASSWORD_RESET', 'ACCOUNT_RECOVERY');

-- CreateEnum
CREATE TYPE "RecoveryStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "OtpPurpose" AS ENUM ('EMAIL_VERIFICATION', 'PHONE_VERIFICATION', 'PASSWORD_RESET', 'ACCOUNT_RECOVERY');

-- CreateEnum
CREATE TYPE "OtpStatus" AS ENUM ('PENDING', 'VERIFIED', 'EXPIRED', 'CANCELLED', 'FAILED');

-- CreateEnum
CREATE TYPE "IdentityStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "VerificationLevel" AS ENUM ('NONE', 'MEMBER', 'DRIVER');

-- CreateEnum
CREATE TYPE "VerificationRequestType" AS ENUM ('PROFILE_PHOTO', 'GOVERNMENT_ID', 'DRIVER_LICENSE');

-- CreateEnum
CREATE TYPE "VerificationRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "identities" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "status" "IdentityStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "activatedAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "status" "VerificationStatus" NOT NULL,
    "level" "VerificationLevel" NOT NULL,
    "profilePhotoVerified" BOOLEAN NOT NULL DEFAULT false,
    "governmentIdVerified" BOOLEAN NOT NULL DEFAULT false,
    "driverLicenseVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "memberVerifiedAt" TIMESTAMP(3),
    "driverVerifiedAt" TIMESTAMP(3),
    "profilePhotoVerifiedAt" TIMESTAMP(3),
    "governmentIdVerifiedAt" TIMESTAMP(3),
    "driverLicenseVerifiedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "rejectionReason" TEXT,
    "lastReviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_requests" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "verificationId" TEXT NOT NULL,
    "type" "VerificationRequestType" NOT NULL,
    "status" "VerificationRequestStatus" NOT NULL,
    "assetId" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "rejectionReason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_roles" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
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
    "publicId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authentications" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "identityPublicId" TEXT NOT NULL,
    "status" "AuthenticationStatus" NOT NULL,
    "passwordHash" TEXT,
    "passwordVersion" INTEGER NOT NULL DEFAULT 1,
    "passwordChangedAt" TIMESTAMP(3),
    "passwordMustChange" BOOLEAN NOT NULL DEFAULT false,
    "failedAuthenticationCount" INTEGER NOT NULL DEFAULT 0,
    "lastFailedAuthenticationAt" TIMESTAMP(3),
    "lockedAt" TIMESTAMP(3),
    "lockedUntil" TIMESTAMP(3),
    "lockReason" "AuthenticationFailureReason",
    "lastAuthenticatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "authentications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "identityPublicId" TEXT NOT NULL,
    "devicePublicId" TEXT,
    "status" "SessionStatus" NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "tokenFamilyPublicId" TEXT NOT NULL,
    "replacedBySessionPublicId" TEXT,
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
    "identityPublicId" TEXT NOT NULL,
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
CREATE TABLE "recoveries" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "identityPublicId" TEXT NOT NULL,
    "type" "RecoveryType" NOT NULL,
    "status" "RecoveryStatus" NOT NULL,
    "recoveryTokenHash" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recoveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_challenges" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "identityPublicId" TEXT NOT NULL,
    "purpose" "OtpPurpose" NOT NULL,
    "status" "OtpStatus" NOT NULL,
    "destination" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 5,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otp_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "ownerIdentityId" TEXT,
    "type" "AssetType" NOT NULL,
    "category" "AssetCategory" NOT NULL,
    "status" "AssetStatus" NOT NULL DEFAULT 'UPLOADING',
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
    "uploadedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_variants" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "variant" "AssetVariantType" NOT NULL,
    "status" "AssetVariantStatus" NOT NULL DEFAULT 'PENDING',
    "isGenerated" BOOLEAN NOT NULL DEFAULT true,
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
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_references" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "resourceType" "AssetResourceType" NOT NULL,
    "resourcePublicId" TEXT NOT NULL,
    "referenceField" "AssetReferenceField" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asset_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_processings" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "operation" "AssetProcessingOperation" NOT NULL,
    "status" "AssetProcessingStatus" NOT NULL DEFAULT 'PENDING',
    "processor" "AssetProcessor",
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_processings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_scans" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "engine" "AssetScanEngine" NOT NULL,
    "status" "AssetScanStatus" NOT NULL DEFAULT 'PENDING',
    "scannedAt" TIMESTAMP(3),
    "threatName" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_scans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_moderations" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "type" "AssetModerationType" NOT NULL,
    "status" "AssetModerationStatus" NOT NULL DEFAULT 'PENDING',
    "moderatorIdentityId" TEXT,
    "confidence" DOUBLE PRECISION,
    "reason" TEXT,
    "metadata" JSONB,
    "moderatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_moderations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "traveller_profiles" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "memberPublicId" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "bio" TEXT,
    "avatarAssetPublicId" TEXT,
    "countryCode" TEXT NOT NULL DEFAULT 'KE',
    "status" "TravellerProfileStatus" NOT NULL DEFAULT 'ACTIVE',
    "visibility" "TravellerProfileVisibility" NOT NULL DEFAULT 'PUBLIC',
    "totalJourneys" INTEGER NOT NULL DEFAULT 0,
    "completedJourneys" INTEGER NOT NULL DEFAULT 0,
    "providerJourneys" INTEGER NOT NULL DEFAULT 0,
    "passengerJourneys" INTEGER NOT NULL DEFAULT 0,
    "completedProviderJourneys" INTEGER NOT NULL DEFAULT 0,
    "completedPassengerJourneys" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "traveller_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "traveller_profile_preferences" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "showJourneyHistory" BOOLEAN NOT NULL DEFAULT true,
    "showJourneyStatistics" BOOLEAN NOT NULL DEFAULT true,
    "allowJourneyInvites" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "traveller_profile_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "traveller_profile_corridors" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "originName" TEXT NOT NULL,
    "destinationName" TEXT NOT NULL,
    "originLatitude" DECIMAL(10,7) NOT NULL,
    "originLongitude" DECIMAL(10,7) NOT NULL,
    "destinationLatitude" DECIMAL(10,7) NOT NULL,
    "destinationLongitude" DECIMAL(10,7) NOT NULL,
    "corridorKey" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "traveller_profile_corridors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_profiles" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "memberPublicId" TEXT NOT NULL,
    "status" "TrustProfileStatus" NOT NULL DEFAULT 'ACTIVE',
    "verificationLevel" "TrustVerificationLevel" NOT NULL DEFAULT 'NONE',
    "ratingAverage" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "completedJourneys" INTEGER NOT NULL DEFAULT 0,
    "providerJourneys" INTEGER NOT NULL DEFAULT 0,
    "passengerJourneys" INTEGER NOT NULL DEFAULT 0,
    "completedProviderJourneys" INTEGER NOT NULL DEFAULT 0,
    "completedPassengerJourneys" INTEGER NOT NULL DEFAULT 0,
    "cancelledJourneys" INTEGER NOT NULL DEFAULT 0,
    "providerCancellations" INTEGER NOT NULL DEFAULT 0,
    "passengerCancellations" INTEGER NOT NULL DEFAULT 0,
    "completionRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "cancellationRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trust_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_ratings" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "reviewerPublicId" TEXT NOT NULL,
    "revieweePublicId" TEXT NOT NULL,
    "journeyPublicId" TEXT NOT NULL,
    "bookingPublicId" TEXT,
    "role" "TrustRatingRole" NOT NULL DEFAULT 'PASSENGER',
    "score" INTEGER NOT NULL,
    "status" "TrustRatingStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trust_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_reviews" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "ratingId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trust_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_badges" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "type" "TrustBadgeType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "assetPublicId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trust_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_profile_badges" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trust_profile_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_events" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "type" "TrustEventType" NOT NULL,
    "journeyPublicId" TEXT,
    "bookingPublicId" TEXT,
    "ratingPublicId" TEXT,
    "badgePublicId" TEXT,
    "disputePublicId" TEXT,
    "actorPublicId" TEXT,
    "reason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trust_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journeys" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "providerPublicId" TEXT NOT NULL,
    "status" "JourneyStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completionRequestedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "vehicleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "journeyBoardingId" TEXT,

    CONSTRAINT "journeys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_corridors" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "originName" TEXT NOT NULL,
    "destinationName" TEXT NOT NULL,
    "originLatitude" DECIMAL(10,7) NOT NULL,
    "originLongitude" DECIMAL(10,7) NOT NULL,
    "destinationLatitude" DECIMAL(10,7) NOT NULL,
    "destinationLongitude" DECIMAL(10,7) NOT NULL,
    "corridorKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_corridors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_waypoints" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "corridorId" TEXT NOT NULL,
    "type" "JourneyWaypointType" NOT NULL,
    "sequence" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "pickupAllowed" BOOLEAN NOT NULL DEFAULT false,
    "dropoffAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_waypoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_schedules" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "departureAt" TIMESTAMP(3) NOT NULL,
    "arrivalAt" TIMESTAMP(3),
    "timezone" TEXT NOT NULL DEFAULT 'Africa/Nairobi',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_vehicles" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER,
    "color" TEXT,
    "registration" TEXT,
    "assetPublicId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_capacities" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "totalSeats" INTEGER NOT NULL,
    "bookedSeats" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_capacities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_pricing" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_preferences" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "smoking" "JourneySmokingPolicy" NOT NULL DEFAULT 'NOT_ALLOWED',
    "pets" "JourneyPetsPolicy" NOT NULL DEFAULT 'NOT_ALLOWED',
    "luggage" "JourneyLuggagePolicy" NOT NULL DEFAULT 'STANDARD',
    "conversation" "JourneyConversationPreference" NOT NULL DEFAULT 'MODERATE',
    "music" "JourneyMusicPreference" NOT NULL DEFAULT 'LOW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_assets" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "assetPublicId" TEXT NOT NULL,
    "type" "JourneyAssetType" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_demands" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "requesterPublicId" TEXT NOT NULL,
    "status" "JourneyDemandStatus" NOT NULL DEFAULT 'DRAFT',
    "matchedJourneyPublicId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "matchedAt" TIMESTAMP(3),
    "convertedAt" TIMESTAMP(3),
    "fulfilledAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_demands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_demand_corridors" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "demandId" TEXT NOT NULL,
    "originName" TEXT NOT NULL,
    "destinationName" TEXT NOT NULL,
    "originLatitude" DECIMAL(10,7) NOT NULL,
    "originLongitude" DECIMAL(10,7) NOT NULL,
    "destinationLatitude" DECIMAL(10,7) NOT NULL,
    "destinationLongitude" DECIMAL(10,7) NOT NULL,
    "corridorKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_demand_corridors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_demand_waypoints" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "corridorId" TEXT NOT NULL,
    "type" "JourneyDemandWaypointType" NOT NULL,
    "sequence" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "pickupRequired" BOOLEAN NOT NULL DEFAULT false,
    "dropoffRequired" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_demand_waypoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_demand_schedules" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "demandId" TEXT NOT NULL,
    "earliestDeparture" TIMESTAMP(3) NOT NULL,
    "latestDeparture" TIMESTAMP(3) NOT NULL,
    "targetArrival" TIMESTAMP(3),
    "maximumArrival" TIMESTAMP(3),
    "timezone" TEXT NOT NULL DEFAULT 'Africa/Nairobi',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_demand_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_demand_capacities" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "demandId" TEXT NOT NULL,
    "requestedSeats" INTEGER NOT NULL,
    "matchedSeats" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_demand_capacities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_demand_pricing" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "demandId" TEXT NOT NULL,
    "maximumPricePerSeat" INTEGER,
    "preferredPricePerSeat" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_demand_pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_demand_participants" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "demandId" TEXT NOT NULL,
    "memberPublicId" TEXT NOT NULL,
    "seats" INTEGER NOT NULL DEFAULT 1,
    "status" "JourneyDemandParticipantStatus" NOT NULL DEFAULT 'ACTIVE',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "withdrawnAt" TIMESTAMP(3),
    "removedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_demand_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_bookings" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "journeyPublicId" TEXT NOT NULL,
    "passengerPublicId" TEXT NOT NULL,
    "status" "JourneyBookingStatus" NOT NULL DEFAULT 'PENDING',
    "seats" INTEGER NOT NULL DEFAULT 1,
    "confirmedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_booking_snapshots" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "originName" TEXT NOT NULL,
    "destinationName" TEXT NOT NULL,
    "originLatitude" DECIMAL(10,7) NOT NULL,
    "originLongitude" DECIMAL(10,7) NOT NULL,
    "destinationLatitude" DECIMAL(10,7) NOT NULL,
    "destinationLongitude" DECIMAL(10,7) NOT NULL,
    "departureAt" TIMESTAMP(3) NOT NULL,
    "arrivalAt" TIMESTAMP(3),
    "timezone" TEXT NOT NULL DEFAULT 'Africa/Nairobi',
    "vehicleMake" TEXT,
    "vehicleModel" TEXT,
    "vehicleYear" INTEGER,
    "vehicleColor" TEXT,
    "vehicleRegistration" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_booking_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_booking_pricing" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "pricePerSeat" INTEGER NOT NULL,
    "seats" INTEGER NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "discountAmount" INTEGER NOT NULL DEFAULT 0,
    "adjustmentAmount" INTEGER NOT NULL DEFAULT 0,
    "totalAmount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_booking_pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_booking_payments" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "status" "JourneyBookingPaymentStatus" NOT NULL DEFAULT 'PENDING',
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "transactionPublicId" TEXT,
    "authorizedAt" TIMESTAMP(3),
    "capturedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_booking_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_booking_cancellations" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "reason" "JourneyBookingCancellationReason" NOT NULL,
    "cancelledByPublicId" TEXT,
    "reasonDescription" TEXT,
    "cancelledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_booking_cancellations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_boardings" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "providerPublicId" TEXT NOT NULL,
    "status" "JourneyBoardingStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "boardingStartedAt" TIMESTAMP(3),
    "journeyStartedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_boardings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_boarding_participants" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "boardingId" TEXT NOT NULL,
    "memberPublicId" TEXT NOT NULL,
    "bookingPublicId" TEXT,
    "role" "JourneyBoardingParticipantRole" NOT NULL,
    "status" "JourneyBoardingParticipantStatus" NOT NULL DEFAULT 'EXPECTED',
    "expectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boardedAt" TIMESTAMP(3),
    "withdrawnAt" TIMESTAMP(3),
    "noShowAt" TIMESTAMP(3),
    "removedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_boarding_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_boarding_events" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "boardingId" TEXT NOT NULL,
    "type" "JourneyBoardingEventType" NOT NULL,
    "memberPublicId" TEXT,
    "bookingPublicId" TEXT,
    "actorPublicId" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "journey_boarding_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_completions" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "journeyPublicId" TEXT NOT NULL,
    "providerPublicId" TEXT NOT NULL,
    "status" "JourneyCompletionStatus" NOT NULL DEFAULT 'PENDING',
    "completionRequestedAt" TIMESTAMP(3),
    "confirmedAt" TIMESTAMP(3),
    "disputedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "requiredConfirmations" INTEGER NOT NULL DEFAULT 2,
    "confirmedCount" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_completions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_completion_confirmations" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "completionId" TEXT NOT NULL,
    "memberPublicId" TEXT NOT NULL,
    "bookingPublicId" TEXT,
    "role" "JourneyCompletionConfirmationRole" NOT NULL,
    "status" "JourneyCompletionConfirmationStatus" NOT NULL DEFAULT 'CONFIRMED',
    "confirmedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "withdrawnAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_completion_confirmations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_completion_disputes" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "completionId" TEXT NOT NULL,
    "raisedByPublicId" TEXT NOT NULL,
    "reason" "JourneyCompletionDisputeReason" NOT NULL,
    "description" TEXT,
    "status" "JourneyCompletionDisputeStatus" NOT NULL DEFAULT 'OPEN',
    "resolvedByPublicId" TEXT,
    "resolutionSummary" TEXT,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "withdrawnAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_completion_disputes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_settlements" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "completionId" TEXT NOT NULL,
    "journeyPublicId" TEXT NOT NULL,
    "providerPublicId" TEXT NOT NULL,
    "status" "JourneySettlementStatus" NOT NULL DEFAULT 'PENDING',
    "financialTransactionPublicId" TEXT,
    "submittedAt" TIMESTAMP(3),
    "processingAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "heldAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_settlements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commercial_commission_rules" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "type" "CommercialCommissionType" NOT NULL,
    "percentage" DECIMAL(5,2) NOT NULL,
    "status" "CommercialCommissionRuleStatus" NOT NULL DEFAULT 'ACTIVE',
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveTo" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commercial_commission_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commercial_booking_commissions" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "bookingPublicId" TEXT NOT NULL,
    "journeyPublicId" TEXT NOT NULL,
    "commissionRuleId" TEXT NOT NULL,
    "percentage" DECIMAL(5,2) NOT NULL,
    "baseAmount" INTEGER NOT NULL,
    "commissionAmount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "status" "CommercialCommissionStatus" NOT NULL DEFAULT 'PENDING',
    "assessedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commercial_booking_commissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commercial_earning_commissions" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "journeyPublicId" TEXT NOT NULL,
    "settlementPublicId" TEXT NOT NULL,
    "providerPublicId" TEXT NOT NULL,
    "commissionRuleId" TEXT NOT NULL,
    "percentage" DECIMAL(5,2) NOT NULL,
    "baseAmount" INTEGER NOT NULL,
    "commissionAmount" INTEGER NOT NULL,
    "netAmount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "status" "CommercialCommissionStatus" NOT NULL DEFAULT 'PENDING',
    "assessedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commercial_earning_commissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_accounts" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "type" "FinancialAccountType" NOT NULL,
    "status" "FinancialAccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "ownerPublicId" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_account_balances" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "availableAmount" INTEGER NOT NULL DEFAULT 0,
    "pendingAmount" INTEGER NOT NULL DEFAULT 0,
    "heldAmount" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_account_balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_transactions" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "type" "FinancialTransactionType" NOT NULL,
    "status" "FinancialTransactionStatus" NOT NULL DEFAULT 'PENDING',
    "sourceAccountId" TEXT,
    "destinationAccountId" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "referenceType" TEXT,
    "referencePublicId" TEXT,
    "accountingJournalPublicId" TEXT,
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "reversedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_transaction_entries" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "type" "FinancialTransactionEntryType" NOT NULL,
    "balanceType" "FinancialBalanceType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financial_transaction_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_payments" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "status" "FinancialPaymentStatus" NOT NULL DEFAULT 'PENDING',
    "methodId" TEXT,
    "transactionPublicId" TEXT,
    "referenceType" TEXT,
    "referencePublicId" TEXT,
    "initiatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_payment_methods" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "type" "FinancialPaymentMethodType" NOT NULL,
    "provider" TEXT NOT NULL,
    "providerReference" TEXT,
    "displayName" TEXT,
    "lastFour" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_payment_attempts" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "status" "FinancialPaymentAttemptStatus" NOT NULL DEFAULT 'PENDING',
    "provider" TEXT NOT NULL,
    "providerReference" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "failureCode" TEXT,
    "failureMessage" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_payment_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_account_holds" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "status" "FinancialAccountHoldStatus" NOT NULL DEFAULT 'ACTIVE',
    "referenceType" TEXT,
    "referencePublicId" TEXT,
    "holdTransactionPublicId" TEXT,
    "releaseTransactionPublicId" TEXT,
    "captureTransactionPublicId" TEXT,
    "expiresAt" TIMESTAMP(3),
    "releasedAt" TIMESTAMP(3),
    "capturedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_account_holds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_account_withdrawals" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "destinationType" "FinancialDisbursementDestinationType" NOT NULL,
    "destinationValue" TEXT NOT NULL,
    "status" "FinancialAccountWithdrawalStatus" NOT NULL DEFAULT 'PENDING',
    "referenceType" TEXT,
    "referencePublicId" TEXT,
    "disbursementPublicId" TEXT,
    "transactionPublicId" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_account_withdrawals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_settlements" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "status" "FinancialSettlementStatus" NOT NULL DEFAULT 'PENDING',
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "totalAmount" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_settlements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_settlement_items" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "settlementId" TEXT NOT NULL,
    "referenceType" TEXT NOT NULL,
    "referencePublicId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "status" "FinancialSettlementItemStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_settlement_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_settlement_allocations" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "settlementItemId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "type" "FinancialSettlementAllocationType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "transactionPublicId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_settlement_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_disbursements" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "sourceAccountId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "status" "FinancialDisbursementStatus" NOT NULL DEFAULT 'PENDING',
    "referenceType" TEXT,
    "referencePublicId" TEXT,
    "transactionPublicId" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_disbursements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_disbursement_destinations" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "type" "FinancialDisbursementDestinationType" NOT NULL,
    "provider" TEXT NOT NULL,
    "providerReference" TEXT NOT NULL,
    "displayName" TEXT,
    "maskedReference" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_disbursement_destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_disbursement_attempts" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "disbursementId" TEXT NOT NULL,
    "status" "FinancialDisbursementAttemptStatus" NOT NULL DEFAULT 'PENDING',
    "provider" TEXT NOT NULL,
    "providerReference" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "failureCode" TEXT,
    "failureMessage" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_disbursement_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting_accounts" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AccountingAccountType" NOT NULL,
    "status" "AccountingAccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "parentAccountId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounting_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting_periods" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "status" "AccountingPeriodStatus" NOT NULL DEFAULT 'OPEN',
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounting_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting_journals" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "status" "AccountingJournalStatus" NOT NULL DEFAULT 'DRAFT',
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "periodId" TEXT,
    "postedAt" TIMESTAMP(3),
    "reversedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounting_journals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting_journal_entries" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,
    "entryDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounting_journal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting_journal_lines" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "type" "AccountingJournalLineType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounting_journal_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounting_posting_references" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourcePublicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounting_posting_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messaging_conversations" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "type" "MessagingConversationType" NOT NULL,
    "status" "MessagingConversationStatus" NOT NULL DEFAULT 'ACTIVE',
    "journeyPublicId" TEXT NOT NULL,
    "bookingPublicId" TEXT,
    "lastMessageAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messaging_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messaging_conversation_participants" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "memberPublicId" TEXT NOT NULL,
    "role" "MessagingParticipantRole" NOT NULL,
    "status" "MessagingParticipantStatus" NOT NULL DEFAULT 'ACTIVE',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "removedAt" TIMESTAMP(3),
    "lastReadAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messaging_conversation_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messaging_messages" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderPublicId" TEXT NOT NULL,
    "type" "MessagingMessageType" NOT NULL,
    "status" "MessagingMessageStatus" NOT NULL DEFAULT 'SENT',
    "content" TEXT,
    "assetId" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "moderatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messaging_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "recipientPublicId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "priority" "NotificationPriority" NOT NULL DEFAULT 'NORMAL',
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "referenceType" TEXT,
    "referencePublicId" TEXT,
    "eventType" TEXT,
    "eventPublicId" TEXT,
    "sentAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "memberPublicId" TEXT NOT NULL,
    "journeyEnabled" BOOLEAN NOT NULL DEFAULT true,
    "bookingEnabled" BOOLEAN NOT NULL DEFAULT true,
    "paymentEnabled" BOOLEAN NOT NULL DEFAULT true,
    "walletEnabled" BOOLEAN NOT NULL DEFAULT true,
    "trustEnabled" BOOLEAN NOT NULL DEFAULT true,
    "verificationEnabled" BOOLEAN NOT NULL DEFAULT true,
    "messageEnabled" BOOLEAN NOT NULL DEFAULT true,
    "supportEnabled" BOOLEAN NOT NULL DEFAULT true,
    "systemEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_deliveries" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "status" "NotificationDeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "providerReference" TEXT,
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_cases" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "requesterPublicId" TEXT NOT NULL,
    "status" "SupportCaseStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "SupportCasePriority" NOT NULL DEFAULT 'NORMAL',
    "category" "SupportCaseCategory" NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT,
    "referenceType" TEXT,
    "referencePublicId" TEXT,
    "assignedToPublicId" TEXT,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_case_participants" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "memberPublicId" TEXT NOT NULL,
    "role" "SupportCaseParticipantRole" NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_case_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_case_messages" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "senderPublicId" TEXT NOT NULL,
    "type" "SupportMessageType" NOT NULL,
    "content" TEXT,
    "assetId" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_case_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_case_notes" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "authorPublicId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_case_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_case_evidence" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "submittedByPublicId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_case_evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_case_resolutions" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "type" "SupportResolutionType" NOT NULL,
    "summary" TEXT NOT NULL,
    "resolvedByPublicId" TEXT NOT NULL,
    "resolvedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_case_resolutions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "identities_publicId_key" ON "identities"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "identities_email_key" ON "identities"("email");

-- CreateIndex
CREATE UNIQUE INDEX "identities_phoneNumber_key" ON "identities"("phoneNumber");

-- CreateIndex
CREATE INDEX "identities_status_idx" ON "identities"("status");

-- CreateIndex
CREATE INDEX "identities_createdAt_idx" ON "identities"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "verifications_publicId_key" ON "verifications"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "verifications_identityId_key" ON "verifications"("identityId");

-- CreateIndex
CREATE INDEX "verifications_reviewedById_idx" ON "verifications"("reviewedById");

-- CreateIndex
CREATE INDEX "verifications_status_idx" ON "verifications"("status");

-- CreateIndex
CREATE INDEX "verifications_level_idx" ON "verifications"("level");

-- CreateIndex
CREATE INDEX "verifications_expiresAt_idx" ON "verifications"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "verification_requests_publicId_key" ON "verification_requests"("publicId");

-- CreateIndex
CREATE INDEX "verification_requests_verificationId_idx" ON "verification_requests"("verificationId");

-- CreateIndex
CREATE INDEX "verification_requests_assetId_idx" ON "verification_requests"("assetId");

-- CreateIndex
CREATE INDEX "verification_requests_type_idx" ON "verification_requests"("type");

-- CreateIndex
CREATE INDEX "verification_requests_status_idx" ON "verification_requests"("status");

-- CreateIndex
CREATE INDEX "verification_requests_reviewedById_idx" ON "verification_requests"("reviewedById");

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
CREATE UNIQUE INDEX "identity_roles_publicId_key" ON "identity_roles"("publicId");

-- CreateIndex
CREATE INDEX "identity_roles_identityId_idx" ON "identity_roles"("identityId");

-- CreateIndex
CREATE INDEX "identity_roles_roleId_idx" ON "identity_roles"("roleId");

-- CreateIndex
CREATE INDEX "identity_roles_expiresAt_idx" ON "identity_roles"("expiresAt");

-- CreateIndex
CREATE INDEX "identity_roles_revokedAt_idx" ON "identity_roles"("revokedAt");

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
CREATE UNIQUE INDEX "role_permissions_publicId_key" ON "role_permissions"("publicId");

-- CreateIndex
CREATE INDEX "role_permissions_roleId_idx" ON "role_permissions"("roleId");

-- CreateIndex
CREATE INDEX "role_permissions_permissionId_idx" ON "role_permissions"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON "role_permissions"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "authentications_publicId_key" ON "authentications"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "authentications_identityPublicId_key" ON "authentications"("identityPublicId");

-- CreateIndex
CREATE INDEX "authentications_status_idx" ON "authentications"("status");

-- CreateIndex
CREATE INDEX "authentications_lockedUntil_idx" ON "authentications"("lockedUntil");

-- CreateIndex
CREATE INDEX "authentications_lastAuthenticatedAt_idx" ON "authentications"("lastAuthenticatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_publicId_key" ON "sessions"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refreshTokenHash_key" ON "sessions"("refreshTokenHash");

-- CreateIndex
CREATE INDEX "sessions_identityPublicId_idx" ON "sessions"("identityPublicId");

-- CreateIndex
CREATE INDEX "sessions_devicePublicId_idx" ON "sessions"("devicePublicId");

-- CreateIndex
CREATE INDEX "sessions_tokenFamilyPublicId_idx" ON "sessions"("tokenFamilyPublicId");

-- CreateIndex
CREATE INDEX "sessions_status_idx" ON "sessions"("status");

-- CreateIndex
CREATE INDEX "sessions_expiresAt_idx" ON "sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "sessions_lastActivityAt_idx" ON "sessions"("lastActivityAt");

-- CreateIndex
CREATE UNIQUE INDEX "devices_publicId_key" ON "devices"("publicId");

-- CreateIndex
CREATE INDEX "devices_identityPublicId_idx" ON "devices"("identityPublicId");

-- CreateIndex
CREATE INDEX "devices_status_idx" ON "devices"("status");

-- CreateIndex
CREATE INDEX "devices_trustLevel_idx" ON "devices"("trustLevel");

-- CreateIndex
CREATE INDEX "devices_lastSeenAt_idx" ON "devices"("lastSeenAt");

-- CreateIndex
CREATE UNIQUE INDEX "devices_identityPublicId_fingerprint_key" ON "devices"("identityPublicId", "fingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "recoveries_publicId_key" ON "recoveries"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "recoveries_recoveryTokenHash_key" ON "recoveries"("recoveryTokenHash");

-- CreateIndex
CREATE INDEX "recoveries_identityPublicId_idx" ON "recoveries"("identityPublicId");

-- CreateIndex
CREATE INDEX "recoveries_expiresAt_idx" ON "recoveries"("expiresAt");

-- CreateIndex
CREATE INDEX "recoveries_requestedAt_idx" ON "recoveries"("requestedAt");

-- CreateIndex
CREATE INDEX "recoveries_identityPublicId_type_idx" ON "recoveries"("identityPublicId", "type");

-- CreateIndex
CREATE INDEX "recoveries_identityPublicId_status_idx" ON "recoveries"("identityPublicId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "otp_challenges_publicId_key" ON "otp_challenges"("publicId");

-- CreateIndex
CREATE INDEX "otp_challenges_identityPublicId_idx" ON "otp_challenges"("identityPublicId");

-- CreateIndex
CREATE INDEX "otp_challenges_identityPublicId_purpose_idx" ON "otp_challenges"("identityPublicId", "purpose");

-- CreateIndex
CREATE INDEX "otp_challenges_status_idx" ON "otp_challenges"("status");

-- CreateIndex
CREATE INDEX "otp_challenges_expiresAt_idx" ON "otp_challenges"("expiresAt");

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
CREATE INDEX "assets_storageProvider_idx" ON "assets"("storageProvider");

-- CreateIndex
CREATE INDEX "assets_uploadedAt_idx" ON "assets"("uploadedAt");

-- CreateIndex
CREATE INDEX "assets_archivedAt_idx" ON "assets"("archivedAt");

-- CreateIndex
CREATE INDEX "assets_deletedAt_idx" ON "assets"("deletedAt");

-- CreateIndex
CREATE INDEX "assets_ownerIdentityId_status_idx" ON "assets"("ownerIdentityId", "status");

-- CreateIndex
CREATE INDEX "assets_ownerIdentityId_category_idx" ON "assets"("ownerIdentityId", "category");

-- CreateIndex
CREATE INDEX "assets_storageProvider_status_idx" ON "assets"("storageProvider", "status");

-- CreateIndex
CREATE INDEX "assets_type_status_idx" ON "assets"("type", "status");

-- CreateIndex
CREATE INDEX "assets_category_status_idx" ON "assets"("category", "status");

-- CreateIndex
CREATE INDEX "assets_visibility_status_idx" ON "assets"("visibility", "status");

-- CreateIndex
CREATE INDEX "assets_createdAt_idx" ON "assets"("createdAt");

-- CreateIndex
CREATE INDEX "assets_updatedAt_idx" ON "assets"("updatedAt");

-- CreateIndex
CREATE INDEX "assets_ownerIdentityId_createdAt_idx" ON "assets"("ownerIdentityId", "createdAt");

-- CreateIndex
CREATE INDEX "assets_ownerIdentityId_visibility_idx" ON "assets"("ownerIdentityId", "visibility");

-- CreateIndex
CREATE UNIQUE INDEX "asset_variants_publicId_key" ON "asset_variants"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "asset_variants_objectKey_key" ON "asset_variants"("objectKey");

-- CreateIndex
CREATE INDEX "asset_variants_assetId_idx" ON "asset_variants"("assetId");

-- CreateIndex
CREATE INDEX "asset_variants_status_idx" ON "asset_variants"("status");

-- CreateIndex
CREATE INDEX "asset_variants_variant_idx" ON "asset_variants"("variant");

-- CreateIndex
CREATE INDEX "asset_variants_assetId_status_idx" ON "asset_variants"("assetId", "status");

-- CreateIndex
CREATE INDEX "asset_variants_storageProvider_idx" ON "asset_variants"("storageProvider");

-- CreateIndex
CREATE INDEX "asset_variants_createdAt_idx" ON "asset_variants"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "asset_variants_assetId_variant_key" ON "asset_variants"("assetId", "variant");

-- CreateIndex
CREATE UNIQUE INDEX "asset_references_publicId_key" ON "asset_references"("publicId");

-- CreateIndex
CREATE INDEX "asset_references_assetId_idx" ON "asset_references"("assetId");

-- CreateIndex
CREATE INDEX "asset_references_resourceType_idx" ON "asset_references"("resourceType");

-- CreateIndex
CREATE INDEX "asset_references_resourcePublicId_idx" ON "asset_references"("resourcePublicId");

-- CreateIndex
CREATE INDEX "asset_references_resourceType_resourcePublicId_idx" ON "asset_references"("resourceType", "resourcePublicId");

-- CreateIndex
CREATE UNIQUE INDEX "asset_references_assetId_resourceType_resourcePublicId_refe_key" ON "asset_references"("assetId", "resourceType", "resourcePublicId", "referenceField");

-- CreateIndex
CREATE UNIQUE INDEX "asset_processings_publicId_key" ON "asset_processings"("publicId");

-- CreateIndex
CREATE INDEX "asset_processings_assetId_idx" ON "asset_processings"("assetId");

-- CreateIndex
CREATE INDEX "asset_processings_status_idx" ON "asset_processings"("status");

-- CreateIndex
CREATE INDEX "asset_processings_operation_idx" ON "asset_processings"("operation");

-- CreateIndex
CREATE INDEX "asset_processings_createdAt_idx" ON "asset_processings"("createdAt");

-- CreateIndex
CREATE INDEX "asset_processings_assetId_operation_idx" ON "asset_processings"("assetId", "operation");

-- CreateIndex
CREATE INDEX "asset_processings_assetId_status_idx" ON "asset_processings"("assetId", "status");

-- CreateIndex
CREATE INDEX "asset_processings_processor_idx" ON "asset_processings"("processor");

-- CreateIndex
CREATE INDEX "asset_processings_startedAt_idx" ON "asset_processings"("startedAt");

-- CreateIndex
CREATE INDEX "asset_processings_completedAt_idx" ON "asset_processings"("completedAt");

-- CreateIndex
CREATE INDEX "asset_processings_failedAt_idx" ON "asset_processings"("failedAt");

-- CreateIndex
CREATE UNIQUE INDEX "asset_scans_publicId_key" ON "asset_scans"("publicId");

-- CreateIndex
CREATE INDEX "asset_scans_assetId_idx" ON "asset_scans"("assetId");

-- CreateIndex
CREATE INDEX "asset_scans_status_idx" ON "asset_scans"("status");

-- CreateIndex
CREATE INDEX "asset_scans_engine_idx" ON "asset_scans"("engine");

-- CreateIndex
CREATE INDEX "asset_scans_scannedAt_idx" ON "asset_scans"("scannedAt");

-- CreateIndex
CREATE INDEX "asset_scans_assetId_engine_idx" ON "asset_scans"("assetId", "engine");

-- CreateIndex
CREATE INDEX "asset_scans_assetId_status_idx" ON "asset_scans"("assetId", "status");

-- CreateIndex
CREATE INDEX "asset_scans_createdAt_idx" ON "asset_scans"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "asset_moderations_publicId_key" ON "asset_moderations"("publicId");

-- CreateIndex
CREATE INDEX "asset_moderations_assetId_idx" ON "asset_moderations"("assetId");

-- CreateIndex
CREATE INDEX "asset_moderations_status_idx" ON "asset_moderations"("status");

-- CreateIndex
CREATE INDEX "asset_moderations_type_idx" ON "asset_moderations"("type");

-- CreateIndex
CREATE INDEX "asset_moderations_moderatorIdentityId_idx" ON "asset_moderations"("moderatorIdentityId");

-- CreateIndex
CREATE INDEX "asset_moderations_assetId_type_idx" ON "asset_moderations"("assetId", "type");

-- CreateIndex
CREATE INDEX "asset_moderations_assetId_status_idx" ON "asset_moderations"("assetId", "status");

-- CreateIndex
CREATE INDEX "asset_moderations_moderatedAt_idx" ON "asset_moderations"("moderatedAt");

-- CreateIndex
CREATE INDEX "asset_moderations_createdAt_idx" ON "asset_moderations"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "traveller_profiles_publicId_key" ON "traveller_profiles"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "traveller_profiles_memberPublicId_key" ON "traveller_profiles"("memberPublicId");

-- CreateIndex
CREATE UNIQUE INDEX "traveller_profiles_handle_key" ON "traveller_profiles"("handle");

-- CreateIndex
CREATE INDEX "traveller_profiles_memberPublicId_idx" ON "traveller_profiles"("memberPublicId");

-- CreateIndex
CREATE INDEX "traveller_profiles_status_idx" ON "traveller_profiles"("status");

-- CreateIndex
CREATE INDEX "traveller_profiles_visibility_idx" ON "traveller_profiles"("visibility");

-- CreateIndex
CREATE INDEX "traveller_profiles_countryCode_idx" ON "traveller_profiles"("countryCode");

-- CreateIndex
CREATE INDEX "traveller_profiles_handle_idx" ON "traveller_profiles"("handle");

-- CreateIndex
CREATE INDEX "traveller_profiles_avatarAssetPublicId_idx" ON "traveller_profiles"("avatarAssetPublicId");

-- CreateIndex
CREATE UNIQUE INDEX "traveller_profile_preferences_publicId_key" ON "traveller_profile_preferences"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "traveller_profile_preferences_profileId_key" ON "traveller_profile_preferences"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "traveller_profile_corridors_publicId_key" ON "traveller_profile_corridors"("publicId");

-- CreateIndex
CREATE INDEX "traveller_profile_corridors_profileId_idx" ON "traveller_profile_corridors"("profileId");

-- CreateIndex
CREATE INDEX "traveller_profile_corridors_profileId_isPrimary_idx" ON "traveller_profile_corridors"("profileId", "isPrimary");

-- CreateIndex
CREATE INDEX "traveller_profile_corridors_corridorKey_idx" ON "traveller_profile_corridors"("corridorKey");

-- CreateIndex
CREATE INDEX "traveller_profile_corridors_originLatitude_originLongitude_idx" ON "traveller_profile_corridors"("originLatitude", "originLongitude");

-- CreateIndex
CREATE INDEX "traveller_profile_corridors_destinationLatitude_destination_idx" ON "traveller_profile_corridors"("destinationLatitude", "destinationLongitude");

-- CreateIndex
CREATE UNIQUE INDEX "trust_profiles_publicId_key" ON "trust_profiles"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "trust_profiles_memberPublicId_key" ON "trust_profiles"("memberPublicId");

-- CreateIndex
CREATE INDEX "trust_profiles_memberPublicId_idx" ON "trust_profiles"("memberPublicId");

-- CreateIndex
CREATE INDEX "trust_profiles_status_idx" ON "trust_profiles"("status");

-- CreateIndex
CREATE INDEX "trust_profiles_verificationLevel_idx" ON "trust_profiles"("verificationLevel");

-- CreateIndex
CREATE INDEX "trust_profiles_ratingAverage_idx" ON "trust_profiles"("ratingAverage");

-- CreateIndex
CREATE INDEX "trust_profiles_completedJourneys_idx" ON "trust_profiles"("completedJourneys");

-- CreateIndex
CREATE INDEX "trust_profiles_completionRate_idx" ON "trust_profiles"("completionRate");

-- CreateIndex
CREATE UNIQUE INDEX "trust_ratings_publicId_key" ON "trust_ratings"("publicId");

-- CreateIndex
CREATE INDEX "trust_ratings_profileId_idx" ON "trust_ratings"("profileId");

-- CreateIndex
CREATE INDEX "trust_ratings_reviewerPublicId_idx" ON "trust_ratings"("reviewerPublicId");

-- CreateIndex
CREATE INDEX "trust_ratings_revieweePublicId_idx" ON "trust_ratings"("revieweePublicId");

-- CreateIndex
CREATE INDEX "trust_ratings_journeyPublicId_idx" ON "trust_ratings"("journeyPublicId");

-- CreateIndex
CREATE INDEX "trust_ratings_bookingPublicId_idx" ON "trust_ratings"("bookingPublicId");

-- CreateIndex
CREATE INDEX "trust_ratings_status_idx" ON "trust_ratings"("status");

-- CreateIndex
CREATE INDEX "trust_ratings_score_idx" ON "trust_ratings"("score");

-- CreateIndex
CREATE INDEX "trust_ratings_revieweePublicId_status_idx" ON "trust_ratings"("revieweePublicId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "trust_ratings_journeyPublicId_reviewerPublicId_revieweePubl_key" ON "trust_ratings"("journeyPublicId", "reviewerPublicId", "revieweePublicId");

-- CreateIndex
CREATE UNIQUE INDEX "trust_reviews_publicId_key" ON "trust_reviews"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "trust_reviews_ratingId_key" ON "trust_reviews"("ratingId");

-- CreateIndex
CREATE UNIQUE INDEX "trust_badges_publicId_key" ON "trust_badges"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "trust_badges_type_key" ON "trust_badges"("type");

-- CreateIndex
CREATE INDEX "trust_badges_active_idx" ON "trust_badges"("active");

-- CreateIndex
CREATE INDEX "trust_badges_assetPublicId_idx" ON "trust_badges"("assetPublicId");

-- CreateIndex
CREATE UNIQUE INDEX "trust_profile_badges_publicId_key" ON "trust_profile_badges"("publicId");

-- CreateIndex
CREATE INDEX "trust_profile_badges_profileId_idx" ON "trust_profile_badges"("profileId");

-- CreateIndex
CREATE INDEX "trust_profile_badges_badgeId_idx" ON "trust_profile_badges"("badgeId");

-- CreateIndex
CREATE INDEX "trust_profile_badges_profileId_active_idx" ON "trust_profile_badges"("profileId", "active");

-- CreateIndex
CREATE INDEX "trust_profile_badges_badgeId_active_idx" ON "trust_profile_badges"("badgeId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "trust_profile_badges_profileId_badgeId_key" ON "trust_profile_badges"("profileId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "trust_events_publicId_key" ON "trust_events"("publicId");

-- CreateIndex
CREATE INDEX "trust_events_profileId_idx" ON "trust_events"("profileId");

-- CreateIndex
CREATE INDEX "trust_events_type_idx" ON "trust_events"("type");

-- CreateIndex
CREATE INDEX "trust_events_profileId_createdAt_idx" ON "trust_events"("profileId", "createdAt");

-- CreateIndex
CREATE INDEX "trust_events_journeyPublicId_idx" ON "trust_events"("journeyPublicId");

-- CreateIndex
CREATE INDEX "trust_events_bookingPublicId_idx" ON "trust_events"("bookingPublicId");

-- CreateIndex
CREATE INDEX "trust_events_ratingPublicId_idx" ON "trust_events"("ratingPublicId");

-- CreateIndex
CREATE INDEX "trust_events_badgePublicId_idx" ON "trust_events"("badgePublicId");

-- CreateIndex
CREATE INDEX "trust_events_disputePublicId_idx" ON "trust_events"("disputePublicId");

-- CreateIndex
CREATE INDEX "trust_events_actorPublicId_idx" ON "trust_events"("actorPublicId");

-- CreateIndex
CREATE UNIQUE INDEX "journeys_publicId_key" ON "journeys"("publicId");

-- CreateIndex
CREATE INDEX "journeys_providerPublicId_idx" ON "journeys"("providerPublicId");

-- CreateIndex
CREATE INDEX "journeys_status_idx" ON "journeys"("status");

-- CreateIndex
CREATE INDEX "journeys_providerPublicId_status_idx" ON "journeys"("providerPublicId", "status");

-- CreateIndex
CREATE INDEX "journeys_status_createdAt_idx" ON "journeys"("status", "createdAt");

-- CreateIndex
CREATE INDEX "journeys_status_publishedAt_idx" ON "journeys"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "journeys_vehicleId_idx" ON "journeys"("vehicleId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_corridors_publicId_key" ON "journey_corridors"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_corridors_journeyId_key" ON "journey_corridors"("journeyId");

-- CreateIndex
CREATE INDEX "journey_corridors_corridorKey_idx" ON "journey_corridors"("corridorKey");

-- CreateIndex
CREATE INDEX "journey_corridors_originLatitude_originLongitude_idx" ON "journey_corridors"("originLatitude", "originLongitude");

-- CreateIndex
CREATE INDEX "journey_corridors_destinationLatitude_destinationLongitude_idx" ON "journey_corridors"("destinationLatitude", "destinationLongitude");

-- CreateIndex
CREATE UNIQUE INDEX "journey_waypoints_publicId_key" ON "journey_waypoints"("publicId");

-- CreateIndex
CREATE INDEX "journey_waypoints_corridorId_idx" ON "journey_waypoints"("corridorId");

-- CreateIndex
CREATE INDEX "journey_waypoints_corridorId_type_idx" ON "journey_waypoints"("corridorId", "type");

-- CreateIndex
CREATE INDEX "journey_waypoints_latitude_longitude_idx" ON "journey_waypoints"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "journey_waypoints_corridorId_sequence_key" ON "journey_waypoints"("corridorId", "sequence");

-- CreateIndex
CREATE UNIQUE INDEX "journey_schedules_publicId_key" ON "journey_schedules"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_schedules_journeyId_key" ON "journey_schedules"("journeyId");

-- CreateIndex
CREATE INDEX "journey_schedules_departureAt_idx" ON "journey_schedules"("departureAt");

-- CreateIndex
CREATE INDEX "journey_schedules_arrivalAt_idx" ON "journey_schedules"("arrivalAt");

-- CreateIndex
CREATE INDEX "journey_schedules_departureAt_arrivalAt_idx" ON "journey_schedules"("departureAt", "arrivalAt");

-- CreateIndex
CREATE UNIQUE INDEX "journey_vehicles_publicId_key" ON "journey_vehicles"("publicId");

-- CreateIndex
CREATE INDEX "journey_vehicles_make_idx" ON "journey_vehicles"("make");

-- CreateIndex
CREATE INDEX "journey_vehicles_model_idx" ON "journey_vehicles"("model");

-- CreateIndex
CREATE INDEX "journey_vehicles_registration_idx" ON "journey_vehicles"("registration");

-- CreateIndex
CREATE INDEX "journey_vehicles_assetPublicId_idx" ON "journey_vehicles"("assetPublicId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_capacities_publicId_key" ON "journey_capacities"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_capacities_journeyId_key" ON "journey_capacities"("journeyId");

-- CreateIndex
CREATE INDEX "journey_capacities_totalSeats_idx" ON "journey_capacities"("totalSeats");

-- CreateIndex
CREATE INDEX "journey_capacities_bookedSeats_idx" ON "journey_capacities"("bookedSeats");

-- CreateIndex
CREATE UNIQUE INDEX "journey_pricing_publicId_key" ON "journey_pricing"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_pricing_journeyId_key" ON "journey_pricing"("journeyId");

-- CreateIndex
CREATE INDEX "journey_pricing_currency_idx" ON "journey_pricing"("currency");

-- CreateIndex
CREATE INDEX "journey_pricing_amount_idx" ON "journey_pricing"("amount");

-- CreateIndex
CREATE UNIQUE INDEX "journey_preferences_publicId_key" ON "journey_preferences"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_preferences_journeyId_key" ON "journey_preferences"("journeyId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_assets_publicId_key" ON "journey_assets"("publicId");

-- CreateIndex
CREATE INDEX "journey_assets_journeyId_idx" ON "journey_assets"("journeyId");

-- CreateIndex
CREATE INDEX "journey_assets_assetPublicId_idx" ON "journey_assets"("assetPublicId");

-- CreateIndex
CREATE INDEX "journey_assets_journeyId_type_idx" ON "journey_assets"("journeyId", "type");

-- CreateIndex
CREATE INDEX "journey_assets_journeyId_sortOrder_idx" ON "journey_assets"("journeyId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "journey_assets_journeyId_assetPublicId_key" ON "journey_assets"("journeyId", "assetPublicId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_demands_publicId_key" ON "journey_demands"("publicId");

-- CreateIndex
CREATE INDEX "journey_demands_requesterPublicId_idx" ON "journey_demands"("requesterPublicId");

-- CreateIndex
CREATE INDEX "journey_demands_status_idx" ON "journey_demands"("status");

-- CreateIndex
CREATE INDEX "journey_demands_requesterPublicId_status_idx" ON "journey_demands"("requesterPublicId", "status");

-- CreateIndex
CREATE INDEX "journey_demands_status_createdAt_idx" ON "journey_demands"("status", "createdAt");

-- CreateIndex
CREATE INDEX "journey_demands_status_publishedAt_idx" ON "journey_demands"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "journey_demands_matchedJourneyPublicId_idx" ON "journey_demands"("matchedJourneyPublicId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_demand_corridors_publicId_key" ON "journey_demand_corridors"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_demand_corridors_demandId_key" ON "journey_demand_corridors"("demandId");

-- CreateIndex
CREATE INDEX "journey_demand_corridors_corridorKey_idx" ON "journey_demand_corridors"("corridorKey");

-- CreateIndex
CREATE INDEX "journey_demand_corridors_originLatitude_originLongitude_idx" ON "journey_demand_corridors"("originLatitude", "originLongitude");

-- CreateIndex
CREATE INDEX "journey_demand_corridors_destinationLatitude_destinationLon_idx" ON "journey_demand_corridors"("destinationLatitude", "destinationLongitude");

-- CreateIndex
CREATE UNIQUE INDEX "journey_demand_waypoints_publicId_key" ON "journey_demand_waypoints"("publicId");

-- CreateIndex
CREATE INDEX "journey_demand_waypoints_corridorId_idx" ON "journey_demand_waypoints"("corridorId");

-- CreateIndex
CREATE INDEX "journey_demand_waypoints_corridorId_type_idx" ON "journey_demand_waypoints"("corridorId", "type");

-- CreateIndex
CREATE INDEX "journey_demand_waypoints_latitude_longitude_idx" ON "journey_demand_waypoints"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "journey_demand_waypoints_corridorId_sequence_key" ON "journey_demand_waypoints"("corridorId", "sequence");

-- CreateIndex
CREATE UNIQUE INDEX "journey_demand_schedules_publicId_key" ON "journey_demand_schedules"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_demand_schedules_demandId_key" ON "journey_demand_schedules"("demandId");

-- CreateIndex
CREATE INDEX "journey_demand_schedules_earliestDeparture_idx" ON "journey_demand_schedules"("earliestDeparture");

-- CreateIndex
CREATE INDEX "journey_demand_schedules_latestDeparture_idx" ON "journey_demand_schedules"("latestDeparture");

-- CreateIndex
CREATE INDEX "journey_demand_schedules_earliestDeparture_latestDeparture_idx" ON "journey_demand_schedules"("earliestDeparture", "latestDeparture");

-- CreateIndex
CREATE INDEX "journey_demand_schedules_targetArrival_idx" ON "journey_demand_schedules"("targetArrival");

-- CreateIndex
CREATE INDEX "journey_demand_schedules_maximumArrival_idx" ON "journey_demand_schedules"("maximumArrival");

-- CreateIndex
CREATE UNIQUE INDEX "journey_demand_capacities_publicId_key" ON "journey_demand_capacities"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_demand_capacities_demandId_key" ON "journey_demand_capacities"("demandId");

-- CreateIndex
CREATE INDEX "journey_demand_capacities_requestedSeats_idx" ON "journey_demand_capacities"("requestedSeats");

-- CreateIndex
CREATE INDEX "journey_demand_capacities_matchedSeats_idx" ON "journey_demand_capacities"("matchedSeats");

-- CreateIndex
CREATE UNIQUE INDEX "journey_demand_pricing_publicId_key" ON "journey_demand_pricing"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_demand_pricing_demandId_key" ON "journey_demand_pricing"("demandId");

-- CreateIndex
CREATE INDEX "journey_demand_pricing_currency_idx" ON "journey_demand_pricing"("currency");

-- CreateIndex
CREATE INDEX "journey_demand_pricing_maximumPricePerSeat_idx" ON "journey_demand_pricing"("maximumPricePerSeat");

-- CreateIndex
CREATE INDEX "journey_demand_pricing_preferredPricePerSeat_idx" ON "journey_demand_pricing"("preferredPricePerSeat");

-- CreateIndex
CREATE UNIQUE INDEX "journey_demand_participants_publicId_key" ON "journey_demand_participants"("publicId");

-- CreateIndex
CREATE INDEX "journey_demand_participants_demandId_idx" ON "journey_demand_participants"("demandId");

-- CreateIndex
CREATE INDEX "journey_demand_participants_memberPublicId_idx" ON "journey_demand_participants"("memberPublicId");

-- CreateIndex
CREATE INDEX "journey_demand_participants_memberPublicId_status_idx" ON "journey_demand_participants"("memberPublicId", "status");

-- CreateIndex
CREATE INDEX "journey_demand_participants_demandId_status_idx" ON "journey_demand_participants"("demandId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "journey_demand_participants_demandId_memberPublicId_key" ON "journey_demand_participants"("demandId", "memberPublicId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_bookings_publicId_key" ON "journey_bookings"("publicId");

-- CreateIndex
CREATE INDEX "journey_bookings_journeyPublicId_idx" ON "journey_bookings"("journeyPublicId");

-- CreateIndex
CREATE INDEX "journey_bookings_passengerPublicId_idx" ON "journey_bookings"("passengerPublicId");

-- CreateIndex
CREATE INDEX "journey_bookings_status_idx" ON "journey_bookings"("status");

-- CreateIndex
CREATE INDEX "journey_bookings_status_createdAt_idx" ON "journey_bookings"("status", "createdAt");

-- CreateIndex
CREATE INDEX "journey_bookings_journeyPublicId_status_idx" ON "journey_bookings"("journeyPublicId", "status");

-- CreateIndex
CREATE INDEX "journey_bookings_passengerPublicId_status_idx" ON "journey_bookings"("passengerPublicId", "status");

-- CreateIndex
CREATE INDEX "journey_bookings_journeyPublicId_passengerPublicId_idx" ON "journey_bookings"("journeyPublicId", "passengerPublicId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_booking_snapshots_publicId_key" ON "journey_booking_snapshots"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_booking_snapshots_bookingId_key" ON "journey_booking_snapshots"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_booking_pricing_publicId_key" ON "journey_booking_pricing"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_booking_pricing_bookingId_key" ON "journey_booking_pricing"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_booking_payments_publicId_key" ON "journey_booking_payments"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_booking_payments_bookingId_key" ON "journey_booking_payments"("bookingId");

-- CreateIndex
CREATE INDEX "journey_booking_payments_status_idx" ON "journey_booking_payments"("status");

-- CreateIndex
CREATE INDEX "journey_booking_payments_transactionPublicId_idx" ON "journey_booking_payments"("transactionPublicId");

-- CreateIndex
CREATE INDEX "journey_booking_payments_capturedAt_idx" ON "journey_booking_payments"("capturedAt");

-- CreateIndex
CREATE UNIQUE INDEX "journey_booking_cancellations_publicId_key" ON "journey_booking_cancellations"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_booking_cancellations_bookingId_key" ON "journey_booking_cancellations"("bookingId");

-- CreateIndex
CREATE INDEX "journey_booking_cancellations_reason_idx" ON "journey_booking_cancellations"("reason");

-- CreateIndex
CREATE INDEX "journey_booking_cancellations_cancelledByPublicId_idx" ON "journey_booking_cancellations"("cancelledByPublicId");

-- CreateIndex
CREATE INDEX "journey_booking_cancellations_cancelledAt_idx" ON "journey_booking_cancellations"("cancelledAt");

-- CreateIndex
CREATE UNIQUE INDEX "journey_boardings_publicId_key" ON "journey_boardings"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_boardings_journeyId_key" ON "journey_boardings"("journeyId");

-- CreateIndex
CREATE INDEX "journey_boardings_providerPublicId_idx" ON "journey_boardings"("providerPublicId");

-- CreateIndex
CREATE INDEX "journey_boardings_status_idx" ON "journey_boardings"("status");

-- CreateIndex
CREATE INDEX "journey_boardings_status_boardingStartedAt_idx" ON "journey_boardings"("status", "boardingStartedAt");

-- CreateIndex
CREATE INDEX "journey_boardings_journeyStartedAt_idx" ON "journey_boardings"("journeyStartedAt");

-- CreateIndex
CREATE UNIQUE INDEX "journey_boarding_participants_publicId_key" ON "journey_boarding_participants"("publicId");

-- CreateIndex
CREATE INDEX "journey_boarding_participants_boardingId_idx" ON "journey_boarding_participants"("boardingId");

-- CreateIndex
CREATE INDEX "journey_boarding_participants_memberPublicId_idx" ON "journey_boarding_participants"("memberPublicId");

-- CreateIndex
CREATE INDEX "journey_boarding_participants_bookingPublicId_idx" ON "journey_boarding_participants"("bookingPublicId");

-- CreateIndex
CREATE INDEX "journey_boarding_participants_role_idx" ON "journey_boarding_participants"("role");

-- CreateIndex
CREATE INDEX "journey_boarding_participants_status_idx" ON "journey_boarding_participants"("status");

-- CreateIndex
CREATE INDEX "journey_boarding_participants_boardingId_role_idx" ON "journey_boarding_participants"("boardingId", "role");

-- CreateIndex
CREATE INDEX "journey_boarding_participants_boardingId_status_idx" ON "journey_boarding_participants"("boardingId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "journey_boarding_participants_boardingId_memberPublicId_key" ON "journey_boarding_participants"("boardingId", "memberPublicId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_boarding_events_publicId_key" ON "journey_boarding_events"("publicId");

-- CreateIndex
CREATE INDEX "journey_boarding_events_boardingId_idx" ON "journey_boarding_events"("boardingId");

-- CreateIndex
CREATE INDEX "journey_boarding_events_type_idx" ON "journey_boarding_events"("type");

-- CreateIndex
CREATE INDEX "journey_boarding_events_memberPublicId_idx" ON "journey_boarding_events"("memberPublicId");

-- CreateIndex
CREATE INDEX "journey_boarding_events_bookingPublicId_idx" ON "journey_boarding_events"("bookingPublicId");

-- CreateIndex
CREATE INDEX "journey_boarding_events_actorPublicId_idx" ON "journey_boarding_events"("actorPublicId");

-- CreateIndex
CREATE INDEX "journey_boarding_events_boardingId_occurredAt_idx" ON "journey_boarding_events"("boardingId", "occurredAt");

-- CreateIndex
CREATE UNIQUE INDEX "journey_completions_publicId_key" ON "journey_completions"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_completions_journeyPublicId_key" ON "journey_completions"("journeyPublicId");

-- CreateIndex
CREATE INDEX "journey_completions_providerPublicId_idx" ON "journey_completions"("providerPublicId");

-- CreateIndex
CREATE INDEX "journey_completions_status_idx" ON "journey_completions"("status");

-- CreateIndex
CREATE INDEX "journey_completions_status_createdAt_idx" ON "journey_completions"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "journey_completion_confirmations_publicId_key" ON "journey_completion_confirmations"("publicId");

-- CreateIndex
CREATE INDEX "journey_completion_confirmations_completionId_idx" ON "journey_completion_confirmations"("completionId");

-- CreateIndex
CREATE INDEX "journey_completion_confirmations_memberPublicId_idx" ON "journey_completion_confirmations"("memberPublicId");

-- CreateIndex
CREATE INDEX "journey_completion_confirmations_bookingPublicId_idx" ON "journey_completion_confirmations"("bookingPublicId");

-- CreateIndex
CREATE INDEX "journey_completion_confirmations_completionId_role_idx" ON "journey_completion_confirmations"("completionId", "role");

-- CreateIndex
CREATE INDEX "journey_completion_confirmations_completionId_status_idx" ON "journey_completion_confirmations"("completionId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "journey_completion_confirmations_completionId_memberPublicI_key" ON "journey_completion_confirmations"("completionId", "memberPublicId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_completion_disputes_publicId_key" ON "journey_completion_disputes"("publicId");

-- CreateIndex
CREATE INDEX "journey_completion_disputes_completionId_idx" ON "journey_completion_disputes"("completionId");

-- CreateIndex
CREATE INDEX "journey_completion_disputes_raisedByPublicId_idx" ON "journey_completion_disputes"("raisedByPublicId");

-- CreateIndex
CREATE INDEX "journey_completion_disputes_status_idx" ON "journey_completion_disputes"("status");

-- CreateIndex
CREATE INDEX "journey_completion_disputes_reason_idx" ON "journey_completion_disputes"("reason");

-- CreateIndex
CREATE INDEX "journey_completion_disputes_completionId_status_idx" ON "journey_completion_disputes"("completionId", "status");

-- CreateIndex
CREATE INDEX "journey_completion_disputes_status_createdAt_idx" ON "journey_completion_disputes"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "journey_settlements_publicId_key" ON "journey_settlements"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "journey_settlements_completionId_key" ON "journey_settlements"("completionId");

-- CreateIndex
CREATE INDEX "journey_settlements_journeyPublicId_idx" ON "journey_settlements"("journeyPublicId");

-- CreateIndex
CREATE INDEX "journey_settlements_providerPublicId_idx" ON "journey_settlements"("providerPublicId");

-- CreateIndex
CREATE INDEX "journey_settlements_status_idx" ON "journey_settlements"("status");

-- CreateIndex
CREATE INDEX "journey_settlements_status_createdAt_idx" ON "journey_settlements"("status", "createdAt");

-- CreateIndex
CREATE INDEX "journey_settlements_financialTransactionPublicId_idx" ON "journey_settlements"("financialTransactionPublicId");

-- CreateIndex
CREATE UNIQUE INDEX "commercial_commission_rules_publicId_key" ON "commercial_commission_rules"("publicId");

-- CreateIndex
CREATE INDEX "commercial_commission_rules_type_idx" ON "commercial_commission_rules"("type");

-- CreateIndex
CREATE INDEX "commercial_commission_rules_type_status_idx" ON "commercial_commission_rules"("type", "status");

-- CreateIndex
CREATE INDEX "commercial_commission_rules_type_status_effectiveFrom_idx" ON "commercial_commission_rules"("type", "status", "effectiveFrom");

-- CreateIndex
CREATE INDEX "commercial_commission_rules_effectiveFrom_effectiveTo_idx" ON "commercial_commission_rules"("effectiveFrom", "effectiveTo");

-- CreateIndex
CREATE UNIQUE INDEX "commercial_commission_rules_type_version_key" ON "commercial_commission_rules"("type", "version");

-- CreateIndex
CREATE UNIQUE INDEX "commercial_booking_commissions_publicId_key" ON "commercial_booking_commissions"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "commercial_booking_commissions_bookingPublicId_key" ON "commercial_booking_commissions"("bookingPublicId");

-- CreateIndex
CREATE INDEX "commercial_booking_commissions_journeyPublicId_idx" ON "commercial_booking_commissions"("journeyPublicId");

-- CreateIndex
CREATE INDEX "commercial_booking_commissions_commissionRuleId_idx" ON "commercial_booking_commissions"("commissionRuleId");

-- CreateIndex
CREATE INDEX "commercial_booking_commissions_status_idx" ON "commercial_booking_commissions"("status");

-- CreateIndex
CREATE INDEX "commercial_booking_commissions_assessedAt_idx" ON "commercial_booking_commissions"("assessedAt");

-- CreateIndex
CREATE UNIQUE INDEX "commercial_earning_commissions_publicId_key" ON "commercial_earning_commissions"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "commercial_earning_commissions_settlementPublicId_key" ON "commercial_earning_commissions"("settlementPublicId");

-- CreateIndex
CREATE INDEX "commercial_earning_commissions_journeyPublicId_idx" ON "commercial_earning_commissions"("journeyPublicId");

-- CreateIndex
CREATE INDEX "commercial_earning_commissions_providerPublicId_idx" ON "commercial_earning_commissions"("providerPublicId");

-- CreateIndex
CREATE INDEX "commercial_earning_commissions_commissionRuleId_idx" ON "commercial_earning_commissions"("commissionRuleId");

-- CreateIndex
CREATE INDEX "commercial_earning_commissions_status_idx" ON "commercial_earning_commissions"("status");

-- CreateIndex
CREATE INDEX "commercial_earning_commissions_assessedAt_idx" ON "commercial_earning_commissions"("assessedAt");

-- CreateIndex
CREATE UNIQUE INDEX "financial_accounts_publicId_key" ON "financial_accounts"("publicId");

-- CreateIndex
CREATE INDEX "financial_accounts_type_idx" ON "financial_accounts"("type");

-- CreateIndex
CREATE INDEX "financial_accounts_status_idx" ON "financial_accounts"("status");

-- CreateIndex
CREATE INDEX "financial_accounts_currency_idx" ON "financial_accounts"("currency");

-- CreateIndex
CREATE UNIQUE INDEX "financial_accounts_ownerPublicId_key" ON "financial_accounts"("ownerPublicId");

-- CreateIndex
CREATE UNIQUE INDEX "financial_account_balances_publicId_key" ON "financial_account_balances"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "financial_account_balances_accountId_key" ON "financial_account_balances"("accountId");

-- CreateIndex
CREATE INDEX "financial_account_balances_currency_idx" ON "financial_account_balances"("currency");

-- CreateIndex
CREATE UNIQUE INDEX "financial_transactions_publicId_key" ON "financial_transactions"("publicId");

-- CreateIndex
CREATE INDEX "financial_transactions_sourceAccountId_idx" ON "financial_transactions"("sourceAccountId");

-- CreateIndex
CREATE INDEX "financial_transactions_destinationAccountId_idx" ON "financial_transactions"("destinationAccountId");

-- CreateIndex
CREATE INDEX "financial_transactions_type_idx" ON "financial_transactions"("type");

-- CreateIndex
CREATE INDEX "financial_transactions_status_idx" ON "financial_transactions"("status");

-- CreateIndex
CREATE INDEX "financial_transactions_referenceType_referencePublicId_idx" ON "financial_transactions"("referenceType", "referencePublicId");

-- CreateIndex
CREATE INDEX "financial_transactions_accountingJournalPublicId_idx" ON "financial_transactions"("accountingJournalPublicId");

-- CreateIndex
CREATE INDEX "financial_transactions_createdAt_idx" ON "financial_transactions"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "financial_transaction_entries_publicId_key" ON "financial_transaction_entries"("publicId");

-- CreateIndex
CREATE INDEX "financial_transaction_entries_transactionId_idx" ON "financial_transaction_entries"("transactionId");

-- CreateIndex
CREATE INDEX "financial_transaction_entries_accountId_idx" ON "financial_transaction_entries"("accountId");

-- CreateIndex
CREATE INDEX "financial_transaction_entries_accountId_balanceType_idx" ON "financial_transaction_entries"("accountId", "balanceType");

-- CreateIndex
CREATE INDEX "financial_transaction_entries_accountId_type_idx" ON "financial_transaction_entries"("accountId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "financial_payments_publicId_key" ON "financial_payments"("publicId");

-- CreateIndex
CREATE INDEX "financial_payments_accountId_idx" ON "financial_payments"("accountId");

-- CreateIndex
CREATE INDEX "financial_payments_methodId_idx" ON "financial_payments"("methodId");

-- CreateIndex
CREATE INDEX "financial_payments_status_idx" ON "financial_payments"("status");

-- CreateIndex
CREATE INDEX "financial_payments_referenceType_referencePublicId_idx" ON "financial_payments"("referenceType", "referencePublicId");

-- CreateIndex
CREATE INDEX "financial_payments_transactionPublicId_idx" ON "financial_payments"("transactionPublicId");

-- CreateIndex
CREATE UNIQUE INDEX "financial_payment_methods_publicId_key" ON "financial_payment_methods"("publicId");

-- CreateIndex
CREATE INDEX "financial_payment_methods_accountId_idx" ON "financial_payment_methods"("accountId");

-- CreateIndex
CREATE INDEX "financial_payment_methods_provider_idx" ON "financial_payment_methods"("provider");

-- CreateIndex
CREATE INDEX "financial_payment_methods_providerReference_idx" ON "financial_payment_methods"("providerReference");

-- CreateIndex
CREATE INDEX "financial_payment_methods_type_idx" ON "financial_payment_methods"("type");

-- CreateIndex
CREATE INDEX "financial_payment_methods_isActive_idx" ON "financial_payment_methods"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "financial_payment_methods_provider_providerReference_key" ON "financial_payment_methods"("provider", "providerReference");

-- CreateIndex
CREATE UNIQUE INDEX "financial_payment_attempts_publicId_key" ON "financial_payment_attempts"("publicId");

-- CreateIndex
CREATE INDEX "financial_payment_attempts_paymentId_idx" ON "financial_payment_attempts"("paymentId");

-- CreateIndex
CREATE INDEX "financial_payment_attempts_status_idx" ON "financial_payment_attempts"("status");

-- CreateIndex
CREATE INDEX "financial_payment_attempts_provider_idx" ON "financial_payment_attempts"("provider");

-- CreateIndex
CREATE INDEX "financial_payment_attempts_providerReference_idx" ON "financial_payment_attempts"("providerReference");

-- CreateIndex
CREATE UNIQUE INDEX "financial_payment_attempts_provider_providerReference_key" ON "financial_payment_attempts"("provider", "providerReference");

-- CreateIndex
CREATE UNIQUE INDEX "financial_account_holds_publicId_key" ON "financial_account_holds"("publicId");

-- CreateIndex
CREATE INDEX "financial_account_holds_accountId_idx" ON "financial_account_holds"("accountId");

-- CreateIndex
CREATE INDEX "financial_account_holds_status_idx" ON "financial_account_holds"("status");

-- CreateIndex
CREATE INDEX "financial_account_holds_referenceType_referencePublicId_idx" ON "financial_account_holds"("referenceType", "referencePublicId");

-- CreateIndex
CREATE INDEX "financial_account_holds_expiresAt_idx" ON "financial_account_holds"("expiresAt");

-- CreateIndex
CREATE INDEX "financial_account_holds_holdTransactionPublicId_idx" ON "financial_account_holds"("holdTransactionPublicId");

-- CreateIndex
CREATE INDEX "financial_account_holds_releaseTransactionPublicId_idx" ON "financial_account_holds"("releaseTransactionPublicId");

-- CreateIndex
CREATE INDEX "financial_account_holds_captureTransactionPublicId_idx" ON "financial_account_holds"("captureTransactionPublicId");

-- CreateIndex
CREATE UNIQUE INDEX "financial_account_withdrawals_publicId_key" ON "financial_account_withdrawals"("publicId");

-- CreateIndex
CREATE INDEX "financial_account_withdrawals_accountId_idx" ON "financial_account_withdrawals"("accountId");

-- CreateIndex
CREATE INDEX "financial_account_withdrawals_status_idx" ON "financial_account_withdrawals"("status");

-- CreateIndex
CREATE INDEX "financial_account_withdrawals_destinationType_idx" ON "financial_account_withdrawals"("destinationType");

-- CreateIndex
CREATE INDEX "financial_account_withdrawals_referenceType_referencePublic_idx" ON "financial_account_withdrawals"("referenceType", "referencePublicId");

-- CreateIndex
CREATE INDEX "financial_account_withdrawals_disbursementPublicId_idx" ON "financial_account_withdrawals"("disbursementPublicId");

-- CreateIndex
CREATE INDEX "financial_account_withdrawals_transactionPublicId_idx" ON "financial_account_withdrawals"("transactionPublicId");

-- CreateIndex
CREATE INDEX "financial_account_withdrawals_requestedAt_idx" ON "financial_account_withdrawals"("requestedAt");

-- CreateIndex
CREATE UNIQUE INDEX "financial_settlements_publicId_key" ON "financial_settlements"("publicId");

-- CreateIndex
CREATE INDEX "financial_settlements_status_idx" ON "financial_settlements"("status");

-- CreateIndex
CREATE INDEX "financial_settlements_createdAt_idx" ON "financial_settlements"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "financial_settlement_items_publicId_key" ON "financial_settlement_items"("publicId");

-- CreateIndex
CREATE INDEX "financial_settlement_items_settlementId_idx" ON "financial_settlement_items"("settlementId");

-- CreateIndex
CREATE INDEX "financial_settlement_items_referenceType_referencePublicId_idx" ON "financial_settlement_items"("referenceType", "referencePublicId");

-- CreateIndex
CREATE INDEX "financial_settlement_items_status_idx" ON "financial_settlement_items"("status");

-- CreateIndex
CREATE UNIQUE INDEX "financial_settlement_allocations_publicId_key" ON "financial_settlement_allocations"("publicId");

-- CreateIndex
CREATE INDEX "financial_settlement_allocations_settlementItemId_idx" ON "financial_settlement_allocations"("settlementItemId");

-- CreateIndex
CREATE INDEX "financial_settlement_allocations_accountId_idx" ON "financial_settlement_allocations"("accountId");

-- CreateIndex
CREATE INDEX "financial_settlement_allocations_type_idx" ON "financial_settlement_allocations"("type");

-- CreateIndex
CREATE INDEX "financial_settlement_allocations_transactionPublicId_idx" ON "financial_settlement_allocations"("transactionPublicId");

-- CreateIndex
CREATE UNIQUE INDEX "financial_disbursements_publicId_key" ON "financial_disbursements"("publicId");

-- CreateIndex
CREATE INDEX "financial_disbursements_sourceAccountId_idx" ON "financial_disbursements"("sourceAccountId");

-- CreateIndex
CREATE INDEX "financial_disbursements_destinationId_idx" ON "financial_disbursements"("destinationId");

-- CreateIndex
CREATE INDEX "financial_disbursements_status_idx" ON "financial_disbursements"("status");

-- CreateIndex
CREATE INDEX "financial_disbursements_referenceType_referencePublicId_idx" ON "financial_disbursements"("referenceType", "referencePublicId");

-- CreateIndex
CREATE INDEX "financial_disbursements_transactionPublicId_idx" ON "financial_disbursements"("transactionPublicId");

-- CreateIndex
CREATE INDEX "financial_disbursements_requestedAt_idx" ON "financial_disbursements"("requestedAt");

-- CreateIndex
CREATE UNIQUE INDEX "financial_disbursement_destinations_publicId_key" ON "financial_disbursement_destinations"("publicId");

-- CreateIndex
CREATE INDEX "financial_disbursement_destinations_accountId_idx" ON "financial_disbursement_destinations"("accountId");

-- CreateIndex
CREATE INDEX "financial_disbursement_destinations_type_idx" ON "financial_disbursement_destinations"("type");

-- CreateIndex
CREATE INDEX "financial_disbursement_destinations_provider_idx" ON "financial_disbursement_destinations"("provider");

-- CreateIndex
CREATE INDEX "financial_disbursement_destinations_isActive_idx" ON "financial_disbursement_destinations"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "financial_disbursement_destinations_provider_providerRefere_key" ON "financial_disbursement_destinations"("provider", "providerReference");

-- CreateIndex
CREATE UNIQUE INDEX "financial_disbursement_attempts_publicId_key" ON "financial_disbursement_attempts"("publicId");

-- CreateIndex
CREATE INDEX "financial_disbursement_attempts_disbursementId_idx" ON "financial_disbursement_attempts"("disbursementId");

-- CreateIndex
CREATE INDEX "financial_disbursement_attempts_status_idx" ON "financial_disbursement_attempts"("status");

-- CreateIndex
CREATE INDEX "financial_disbursement_attempts_provider_idx" ON "financial_disbursement_attempts"("provider");

-- CreateIndex
CREATE INDEX "financial_disbursement_attempts_providerReference_idx" ON "financial_disbursement_attempts"("providerReference");

-- CreateIndex
CREATE UNIQUE INDEX "financial_disbursement_attempts_provider_providerReference_key" ON "financial_disbursement_attempts"("provider", "providerReference");

-- CreateIndex
CREATE UNIQUE INDEX "accounting_accounts_publicId_key" ON "accounting_accounts"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "accounting_accounts_code_key" ON "accounting_accounts"("code");

-- CreateIndex
CREATE INDEX "accounting_accounts_type_idx" ON "accounting_accounts"("type");

-- CreateIndex
CREATE INDEX "accounting_accounts_status_idx" ON "accounting_accounts"("status");

-- CreateIndex
CREATE INDEX "accounting_accounts_parentAccountId_idx" ON "accounting_accounts"("parentAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "accounting_periods_publicId_key" ON "accounting_periods"("publicId");

-- CreateIndex
CREATE INDEX "accounting_periods_startsAt_endsAt_idx" ON "accounting_periods"("startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "accounting_periods_status_idx" ON "accounting_periods"("status");

-- CreateIndex
CREATE UNIQUE INDEX "accounting_journals_publicId_key" ON "accounting_journals"("publicId");

-- CreateIndex
CREATE INDEX "accounting_journals_status_idx" ON "accounting_journals"("status");

-- CreateIndex
CREATE INDEX "accounting_journals_periodId_idx" ON "accounting_journals"("periodId");

-- CreateIndex
CREATE INDEX "accounting_journals_postedAt_idx" ON "accounting_journals"("postedAt");

-- CreateIndex
CREATE UNIQUE INDEX "accounting_journal_entries_publicId_key" ON "accounting_journal_entries"("publicId");

-- CreateIndex
CREATE INDEX "accounting_journal_entries_journalId_idx" ON "accounting_journal_entries"("journalId");

-- CreateIndex
CREATE INDEX "accounting_journal_entries_entryDate_idx" ON "accounting_journal_entries"("entryDate");

-- CreateIndex
CREATE UNIQUE INDEX "accounting_journal_lines_publicId_key" ON "accounting_journal_lines"("publicId");

-- CreateIndex
CREATE INDEX "accounting_journal_lines_entryId_idx" ON "accounting_journal_lines"("entryId");

-- CreateIndex
CREATE INDEX "accounting_journal_lines_accountId_idx" ON "accounting_journal_lines"("accountId");

-- CreateIndex
CREATE INDEX "accounting_journal_lines_accountId_type_idx" ON "accounting_journal_lines"("accountId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "accounting_posting_references_publicId_key" ON "accounting_posting_references"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "accounting_posting_references_journalId_key" ON "accounting_posting_references"("journalId");

-- CreateIndex
CREATE INDEX "accounting_posting_references_sourceType_sourcePublicId_idx" ON "accounting_posting_references"("sourceType", "sourcePublicId");

-- CreateIndex
CREATE INDEX "accounting_posting_references_sourceType_idx" ON "accounting_posting_references"("sourceType");

-- CreateIndex
CREATE INDEX "accounting_posting_references_sourcePublicId_idx" ON "accounting_posting_references"("sourcePublicId");

-- CreateIndex
CREATE UNIQUE INDEX "messaging_conversations_publicId_key" ON "messaging_conversations"("publicId");

-- CreateIndex
CREATE INDEX "messaging_conversations_journeyPublicId_idx" ON "messaging_conversations"("journeyPublicId");

-- CreateIndex
CREATE INDEX "messaging_conversations_bookingPublicId_idx" ON "messaging_conversations"("bookingPublicId");

-- CreateIndex
CREATE INDEX "messaging_conversations_status_idx" ON "messaging_conversations"("status");

-- CreateIndex
CREATE INDEX "messaging_conversations_journeyPublicId_status_idx" ON "messaging_conversations"("journeyPublicId", "status");

-- CreateIndex
CREATE INDEX "messaging_conversations_status_lastMessageAt_idx" ON "messaging_conversations"("status", "lastMessageAt");

-- CreateIndex
CREATE UNIQUE INDEX "messaging_conversation_participants_publicId_key" ON "messaging_conversation_participants"("publicId");

-- CreateIndex
CREATE INDEX "messaging_conversation_participants_conversationId_idx" ON "messaging_conversation_participants"("conversationId");

-- CreateIndex
CREATE INDEX "messaging_conversation_participants_memberPublicId_idx" ON "messaging_conversation_participants"("memberPublicId");

-- CreateIndex
CREATE INDEX "messaging_conversation_participants_memberPublicId_status_idx" ON "messaging_conversation_participants"("memberPublicId", "status");

-- CreateIndex
CREATE INDEX "messaging_conversation_participants_conversationId_status_idx" ON "messaging_conversation_participants"("conversationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "messaging_conversation_participants_conversationId_memberPu_key" ON "messaging_conversation_participants"("conversationId", "memberPublicId");

-- CreateIndex
CREATE UNIQUE INDEX "messaging_messages_publicId_key" ON "messaging_messages"("publicId");

-- CreateIndex
CREATE INDEX "messaging_messages_conversationId_idx" ON "messaging_messages"("conversationId");

-- CreateIndex
CREATE INDEX "messaging_messages_senderPublicId_idx" ON "messaging_messages"("senderPublicId");

-- CreateIndex
CREATE INDEX "messaging_messages_assetId_idx" ON "messaging_messages"("assetId");

-- CreateIndex
CREATE INDEX "messaging_messages_conversationId_sentAt_idx" ON "messaging_messages"("conversationId", "sentAt");

-- CreateIndex
CREATE INDEX "messaging_messages_status_idx" ON "messaging_messages"("status");

-- CreateIndex
CREATE UNIQUE INDEX "notifications_publicId_key" ON "notifications"("publicId");

-- CreateIndex
CREATE INDEX "notifications_recipientPublicId_idx" ON "notifications"("recipientPublicId");

-- CreateIndex
CREATE INDEX "notifications_recipientPublicId_status_idx" ON "notifications"("recipientPublicId", "status");

-- CreateIndex
CREATE INDEX "notifications_recipientPublicId_createdAt_idx" ON "notifications"("recipientPublicId", "createdAt");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_priority_idx" ON "notifications"("priority");

-- CreateIndex
CREATE INDEX "notifications_eventType_eventPublicId_idx" ON "notifications"("eventType", "eventPublicId");

-- CreateIndex
CREATE INDEX "notifications_referenceType_referencePublicId_idx" ON "notifications"("referenceType", "referencePublicId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_publicId_key" ON "notification_preferences"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_memberPublicId_key" ON "notification_preferences"("memberPublicId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_deliveries_publicId_key" ON "notification_deliveries"("publicId");

-- CreateIndex
CREATE INDEX "notification_deliveries_notificationId_idx" ON "notification_deliveries"("notificationId");

-- CreateIndex
CREATE INDEX "notification_deliveries_status_idx" ON "notification_deliveries"("status");

-- CreateIndex
CREATE INDEX "notification_deliveries_channel_status_idx" ON "notification_deliveries"("channel", "status");

-- CreateIndex
CREATE UNIQUE INDEX "notification_deliveries_notificationId_channel_key" ON "notification_deliveries"("notificationId", "channel");

-- CreateIndex
CREATE UNIQUE INDEX "support_cases_publicId_key" ON "support_cases"("publicId");

-- CreateIndex
CREATE INDEX "support_cases_requesterPublicId_idx" ON "support_cases"("requesterPublicId");

-- CreateIndex
CREATE INDEX "support_cases_status_idx" ON "support_cases"("status");

-- CreateIndex
CREATE INDEX "support_cases_priority_idx" ON "support_cases"("priority");

-- CreateIndex
CREATE INDEX "support_cases_category_idx" ON "support_cases"("category");

-- CreateIndex
CREATE INDEX "support_cases_assignedToPublicId_idx" ON "support_cases"("assignedToPublicId");

-- CreateIndex
CREATE INDEX "support_cases_referenceType_referencePublicId_idx" ON "support_cases"("referenceType", "referencePublicId");

-- CreateIndex
CREATE INDEX "support_cases_status_priority_idx" ON "support_cases"("status", "priority");

-- CreateIndex
CREATE INDEX "support_cases_status_createdAt_idx" ON "support_cases"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "support_case_participants_publicId_key" ON "support_case_participants"("publicId");

-- CreateIndex
CREATE INDEX "support_case_participants_caseId_idx" ON "support_case_participants"("caseId");

-- CreateIndex
CREATE INDEX "support_case_participants_memberPublicId_idx" ON "support_case_participants"("memberPublicId");

-- CreateIndex
CREATE INDEX "support_case_participants_caseId_role_idx" ON "support_case_participants"("caseId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "support_case_participants_caseId_memberPublicId_role_key" ON "support_case_participants"("caseId", "memberPublicId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "support_case_messages_publicId_key" ON "support_case_messages"("publicId");

-- CreateIndex
CREATE INDEX "support_case_messages_caseId_idx" ON "support_case_messages"("caseId");

-- CreateIndex
CREATE INDEX "support_case_messages_senderPublicId_idx" ON "support_case_messages"("senderPublicId");

-- CreateIndex
CREATE INDEX "support_case_messages_assetId_idx" ON "support_case_messages"("assetId");

-- CreateIndex
CREATE INDEX "support_case_messages_caseId_sentAt_idx" ON "support_case_messages"("caseId", "sentAt");

-- CreateIndex
CREATE UNIQUE INDEX "support_case_notes_publicId_key" ON "support_case_notes"("publicId");

-- CreateIndex
CREATE INDEX "support_case_notes_caseId_idx" ON "support_case_notes"("caseId");

-- CreateIndex
CREATE INDEX "support_case_notes_authorPublicId_idx" ON "support_case_notes"("authorPublicId");

-- CreateIndex
CREATE INDEX "support_case_notes_caseId_createdAt_idx" ON "support_case_notes"("caseId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "support_case_evidence_publicId_key" ON "support_case_evidence"("publicId");

-- CreateIndex
CREATE INDEX "support_case_evidence_caseId_idx" ON "support_case_evidence"("caseId");

-- CreateIndex
CREATE INDEX "support_case_evidence_submittedByPublicId_idx" ON "support_case_evidence"("submittedByPublicId");

-- CreateIndex
CREATE INDEX "support_case_evidence_assetId_idx" ON "support_case_evidence"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "support_case_resolutions_publicId_key" ON "support_case_resolutions"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "support_case_resolutions_caseId_key" ON "support_case_resolutions"("caseId");

-- CreateIndex
CREATE INDEX "support_case_resolutions_resolvedByPublicId_idx" ON "support_case_resolutions"("resolvedByPublicId");

-- AddForeignKey
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "identities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_requests" ADD CONSTRAINT "verification_requests_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES "verifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_requests" ADD CONSTRAINT "verification_requests_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_requests" ADD CONSTRAINT "verification_requests_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "identities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_roles" ADD CONSTRAINT "identity_roles_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_roles" ADD CONSTRAINT "identity_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_roles" ADD CONSTRAINT "identity_roles_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "identities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_roles" ADD CONSTRAINT "identity_roles_revokedById_fkey" FOREIGN KEY ("revokedById") REFERENCES "identities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_ownerIdentityId_fkey" FOREIGN KEY ("ownerIdentityId") REFERENCES "identities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_variants" ADD CONSTRAINT "asset_variants_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_references" ADD CONSTRAINT "asset_references_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_processings" ADD CONSTRAINT "asset_processings_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_scans" ADD CONSTRAINT "asset_scans_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_moderations" ADD CONSTRAINT "asset_moderations_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_moderations" ADD CONSTRAINT "asset_moderations_moderatorIdentityId_fkey" FOREIGN KEY ("moderatorIdentityId") REFERENCES "identities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "traveller_profile_preferences" ADD CONSTRAINT "traveller_profile_preferences_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "traveller_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "traveller_profile_corridors" ADD CONSTRAINT "traveller_profile_corridors_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "traveller_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_ratings" ADD CONSTRAINT "trust_ratings_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "trust_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_reviews" ADD CONSTRAINT "trust_reviews_ratingId_fkey" FOREIGN KEY ("ratingId") REFERENCES "trust_ratings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_profile_badges" ADD CONSTRAINT "trust_profile_badges_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "trust_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_profile_badges" ADD CONSTRAINT "trust_profile_badges_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "trust_badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_events" ADD CONSTRAINT "trust_events_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "trust_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journeys" ADD CONSTRAINT "journeys_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "journey_vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_corridors" ADD CONSTRAINT "journey_corridors_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "journeys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_waypoints" ADD CONSTRAINT "journey_waypoints_corridorId_fkey" FOREIGN KEY ("corridorId") REFERENCES "journey_corridors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_schedules" ADD CONSTRAINT "journey_schedules_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "journeys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_capacities" ADD CONSTRAINT "journey_capacities_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "journeys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_pricing" ADD CONSTRAINT "journey_pricing_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "journeys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_preferences" ADD CONSTRAINT "journey_preferences_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "journeys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_assets" ADD CONSTRAINT "journey_assets_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "journeys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_demand_corridors" ADD CONSTRAINT "journey_demand_corridors_demandId_fkey" FOREIGN KEY ("demandId") REFERENCES "journey_demands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_demand_waypoints" ADD CONSTRAINT "journey_demand_waypoints_corridorId_fkey" FOREIGN KEY ("corridorId") REFERENCES "journey_demand_corridors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_demand_schedules" ADD CONSTRAINT "journey_demand_schedules_demandId_fkey" FOREIGN KEY ("demandId") REFERENCES "journey_demands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_demand_capacities" ADD CONSTRAINT "journey_demand_capacities_demandId_fkey" FOREIGN KEY ("demandId") REFERENCES "journey_demands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_demand_pricing" ADD CONSTRAINT "journey_demand_pricing_demandId_fkey" FOREIGN KEY ("demandId") REFERENCES "journey_demands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_demand_participants" ADD CONSTRAINT "journey_demand_participants_demandId_fkey" FOREIGN KEY ("demandId") REFERENCES "journey_demands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_booking_snapshots" ADD CONSTRAINT "journey_booking_snapshots_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "journey_bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_booking_pricing" ADD CONSTRAINT "journey_booking_pricing_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "journey_bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_booking_payments" ADD CONSTRAINT "journey_booking_payments_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "journey_bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_booking_cancellations" ADD CONSTRAINT "journey_booking_cancellations_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "journey_bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_boardings" ADD CONSTRAINT "journey_boardings_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "journeys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_boarding_participants" ADD CONSTRAINT "journey_boarding_participants_boardingId_fkey" FOREIGN KEY ("boardingId") REFERENCES "journey_boardings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_boarding_events" ADD CONSTRAINT "journey_boarding_events_boardingId_fkey" FOREIGN KEY ("boardingId") REFERENCES "journey_boardings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_completion_confirmations" ADD CONSTRAINT "journey_completion_confirmations_completionId_fkey" FOREIGN KEY ("completionId") REFERENCES "journey_completions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_completion_disputes" ADD CONSTRAINT "journey_completion_disputes_completionId_fkey" FOREIGN KEY ("completionId") REFERENCES "journey_completions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journey_settlements" ADD CONSTRAINT "journey_settlements_completionId_fkey" FOREIGN KEY ("completionId") REFERENCES "journey_completions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commercial_booking_commissions" ADD CONSTRAINT "commercial_booking_commissions_commissionRuleId_fkey" FOREIGN KEY ("commissionRuleId") REFERENCES "commercial_commission_rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commercial_earning_commissions" ADD CONSTRAINT "commercial_earning_commissions_commissionRuleId_fkey" FOREIGN KEY ("commissionRuleId") REFERENCES "commercial_commission_rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_account_balances" ADD CONSTRAINT "financial_account_balances_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "financial_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_transactions" ADD CONSTRAINT "financial_transactions_sourceAccountId_fkey" FOREIGN KEY ("sourceAccountId") REFERENCES "financial_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_transactions" ADD CONSTRAINT "financial_transactions_destinationAccountId_fkey" FOREIGN KEY ("destinationAccountId") REFERENCES "financial_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_transaction_entries" ADD CONSTRAINT "financial_transaction_entries_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "financial_transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_transaction_entries" ADD CONSTRAINT "financial_transaction_entries_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "financial_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_payments" ADD CONSTRAINT "financial_payments_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "financial_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_payments" ADD CONSTRAINT "financial_payments_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "financial_payment_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_payment_methods" ADD CONSTRAINT "financial_payment_methods_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "financial_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_payment_attempts" ADD CONSTRAINT "financial_payment_attempts_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "financial_payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_account_holds" ADD CONSTRAINT "financial_account_holds_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "financial_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_account_withdrawals" ADD CONSTRAINT "financial_account_withdrawals_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "financial_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_settlement_items" ADD CONSTRAINT "financial_settlement_items_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "financial_settlements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_settlement_allocations" ADD CONSTRAINT "financial_settlement_allocations_settlementItemId_fkey" FOREIGN KEY ("settlementItemId") REFERENCES "financial_settlement_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_settlement_allocations" ADD CONSTRAINT "financial_settlement_allocations_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "financial_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_disbursements" ADD CONSTRAINT "financial_disbursements_sourceAccountId_fkey" FOREIGN KEY ("sourceAccountId") REFERENCES "financial_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_disbursements" ADD CONSTRAINT "financial_disbursements_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "financial_disbursement_destinations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_disbursement_destinations" ADD CONSTRAINT "financial_disbursement_destinations_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "financial_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_disbursement_attempts" ADD CONSTRAINT "financial_disbursement_attempts_disbursementId_fkey" FOREIGN KEY ("disbursementId") REFERENCES "financial_disbursements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting_accounts" ADD CONSTRAINT "accounting_accounts_parentAccountId_fkey" FOREIGN KEY ("parentAccountId") REFERENCES "accounting_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting_journals" ADD CONSTRAINT "accounting_journals_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "accounting_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting_journal_entries" ADD CONSTRAINT "accounting_journal_entries_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "accounting_journals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting_journal_lines" ADD CONSTRAINT "accounting_journal_lines_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "accounting_journal_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting_journal_lines" ADD CONSTRAINT "accounting_journal_lines_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounting_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounting_posting_references" ADD CONSTRAINT "accounting_posting_references_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "accounting_journals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messaging_conversation_participants" ADD CONSTRAINT "messaging_conversation_participants_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "messaging_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messaging_messages" ADD CONSTRAINT "messaging_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "messaging_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_deliveries" ADD CONSTRAINT "notification_deliveries_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_case_participants" ADD CONSTRAINT "support_case_participants_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "support_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_case_messages" ADD CONSTRAINT "support_case_messages_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "support_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_case_notes" ADD CONSTRAINT "support_case_notes_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "support_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_case_evidence" ADD CONSTRAINT "support_case_evidence_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "support_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_case_resolutions" ADD CONSTRAINT "support_case_resolutions_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "support_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
