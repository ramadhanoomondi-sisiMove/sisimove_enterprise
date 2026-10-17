//src/features/admin/verifications/types/verification-api.types.ts
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Admin Verification API Types
 * -----------------------------------------------------------------------------
 *
 * Path:
 * src/features/admin/verifications/types/verification-api.types.ts
 *
 * Purpose:
 * Defines the frontend's transport-layer contracts for the Verification API.
 *
 * Domain ownership:
 *
 * VerificationAggregate
 * └── Verification
 *     └── VerificationRequest[]
 *
 * Important:
 * - These types represent HTTP response data, not Prisma entities.
 * - Persistence IDs are not exposed.
 * - Public IDs are used across the API boundary.
 * - Dates are represented as ISO strings after JSON serialization.
 * - Request approval does not automatically grant member or driver
 *   verification.
 * - Verification requests remain part of their owning aggregate.
 * -----------------------------------------------------------------------------
 */

// =============================================================================
// ENUM-LIKE API VALUES
// =============================================================================

/**
 * Aggregate-level verification lifecycle.
 *
 * Aligned with the backend VerificationStatus enum.
 */
export type VerificationApiStatus =
  | "PENDING"
  | "VERIFIED"
  | "REJECTED"
  | "EXPIRED"
  | "REVOKED";

/**
 * Aggregate-level verification level.
 *
 * Aligned with the backend VerificationLevel enum.
 */
export type VerificationApiLevel = "NONE" | "MEMBER" | "DRIVER";

/**
 * Type of evidence submitted for verification.
 *
 * Aligned with the backend VerificationRequestType enum.
 */
export type VerificationRequestApiType =
  | "PROFILE_PHOTO"
  | "GOVERNMENT_ID"
  | "DRIVER_LICENSE";

/**
 * Request-level evidence review lifecycle.
 *
 * Aligned with the backend VerificationRequestStatus enum.
 *
 * Verification requests do not have an EXPIRED status.
 */
export type VerificationRequestApiStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

// =============================================================================
// SHARED TRANSPORT TYPES
// =============================================================================

/**
 * ISO-8601 timestamp serialized by the HTTP transport.
 *
 * Example:
 * 2026-10-17T08:30:00.000Z
 */
export type VerificationApiTimestamp = string;

/**
 * Optional timestamp fields may be omitted from JSON when the backend
 * response mapper returns undefined.
 */
export type OptionalVerificationApiTimestamp =
  | VerificationApiTimestamp
  | undefined;

/**
 * Metadata submitted with a verification request.
 *
 * Metadata is intentionally not assigned an invented domain-specific shape.
 */
export type VerificationRequestApiMetadata =
  Readonly<Record<string, unknown>>;

// =============================================================================
// VERIFICATION REQUEST RESPONSE
// =============================================================================

/**
 * REST representation of a VerificationRequest owned by a
 * Verification aggregate.
 *
 * Corresponds to the backend VerificationRequestResponse contract.
 */
export interface VerificationRequestApiResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /** Public ID of the verification request. */
  publicId: string;

  /** Public ID of the owning Verification aggregate. */
  verificationPublicId: string;

  // ---------------------------------------------------------------------------
  // Request
  // ---------------------------------------------------------------------------

  /** Evidence category submitted for review. */
  type: VerificationRequestApiType;

  /** Current request-level lifecycle status. */
  status: VerificationRequestApiStatus;

  // ---------------------------------------------------------------------------
  // Evidence
  // ---------------------------------------------------------------------------

  /** Public ID of the submitted evidence Asset. */
  assetPublicId: string;

  // ---------------------------------------------------------------------------
  // Submission
  // ---------------------------------------------------------------------------

  /** Time at which the request was submitted. */
  submittedAt: VerificationApiTimestamp;

  // ---------------------------------------------------------------------------
  // Review
  // ---------------------------------------------------------------------------

  /** Time at which the request was reviewed, when available. */
  reviewedAt?: VerificationApiTimestamp;

  /** Public ID of the reviewing Identity, when available. */
  reviewedByPublicId?: string;

  /** Reason supplied when the request was rejected, when available. */
  rejectionReason?: string;

  // ---------------------------------------------------------------------------
  // Metadata
  // ---------------------------------------------------------------------------

  /** Optional metadata supplied with the request. */
  metadata?: VerificationRequestApiMetadata;

  // ---------------------------------------------------------------------------
  // Audit timestamps
  // ---------------------------------------------------------------------------

  createdAt: VerificationApiTimestamp;

  updatedAt: VerificationApiTimestamp;
}

// =============================================================================
// VERIFICATION AGGREGATE RESPONSE
// =============================================================================

/**
 * REST representation of the Verification aggregate.
 *
 * Corresponds to the backend VerificationResponse contract.
 *
 * The aggregate owns its requests, so requests are returned as part of
 * this representation.
 */
export interface VerificationApiResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /** Public ID of the Verification aggregate. */
  publicId: string;

  /** Public ID of the Identity being verified. */
  identityPublicId: string;

  // ---------------------------------------------------------------------------
  // Aggregate state
  // ---------------------------------------------------------------------------

  /** Current aggregate-level verification status. */
  status: VerificationApiStatus;

  /** Current aggregate-level verification level. */
  level: VerificationApiLevel;

  // ---------------------------------------------------------------------------
  // Accepted verification evidence
  // ---------------------------------------------------------------------------

  /** Whether profile-photo evidence has been accepted. */
  profilePhotoVerified: boolean;

  /** Whether government-ID evidence has been accepted. */
  governmentIdVerified: boolean;

  /** Whether driver-license evidence has been accepted. */
  driverLicenseVerified: boolean;

  // ---------------------------------------------------------------------------
  // Verification timestamps
  // ---------------------------------------------------------------------------

  /** Time at which the current aggregate verification was granted. */
  verifiedAt?: VerificationApiTimestamp;

  /** Time at which member verification was granted. */
  memberVerifiedAt?: VerificationApiTimestamp;

  /** Time at which driver verification was granted. */
  driverVerifiedAt?: VerificationApiTimestamp;

  /** Expiration time of the current verification, when applicable. */
  expiresAt?: VerificationApiTimestamp;

  /** Time at which profile-photo evidence was accepted. */
  profilePhotoVerifiedAt?: VerificationApiTimestamp;

  /** Time at which government-ID evidence was accepted. */
  governmentIdVerifiedAt?: VerificationApiTimestamp;

  /** Time at which driver-license evidence was accepted. */
  driverLicenseVerifiedAt?: VerificationApiTimestamp;

  // ---------------------------------------------------------------------------
  // Aggregate review
  // ---------------------------------------------------------------------------

  /** Public ID of the Identity that made the aggregate-level decision. */
  reviewedByPublicId?: string;

  /**
   * Aggregate-level rejection or revocation reason, when available.
   */
  rejectionReason?: string;

  /**
   * Timestamp of the last aggregate-level review or decision.
   *
   * For REVOKED, this represents the revocation decision timestamp.
   */
  lastReviewedAt?: VerificationApiTimestamp;

  // ---------------------------------------------------------------------------
  // Aggregate-owned requests
  // ---------------------------------------------------------------------------

  /** Verification requests belonging to this aggregate. */
  requests: VerificationRequestApiResponse[];

  // ---------------------------------------------------------------------------
  // Audit timestamps
  // ---------------------------------------------------------------------------

  createdAt: VerificationApiTimestamp;

  updatedAt: VerificationApiTimestamp;
}
