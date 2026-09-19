// -----------------------------------------------------------------------------
// sisiMove — Verification Model
// -----------------------------------------------------------------------------
//
// Frontend representation of the authenticated Identity's verification state.
//
// This model represents the aggregate verification result:
//
//     Verification
//         ├── status
//         ├── level
//         ├── verification results
//         └── verification timestamps
//
// Individual submission/review lifecycles belong to:
//     VerificationRequest
//
// This model intentionally uses publicId rather than the backend's internal
// database `id`.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Verification Status
// =============================================================================

/**
 * Current lifecycle state of the aggregate Verification record.
 */
export type VerificationStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'REVOKED';

// =============================================================================
// Verification Level
// =============================================================================

/**
 * Highest verification level currently granted to the Identity.
 */
export type VerificationLevel =
  | 'NONE'
  | 'MEMBER'
  | 'DRIVER';

// =============================================================================
// Verification
// =============================================================================

/**
 * Aggregate verification state for the authenticated Identity.
 *
 * The Verification aggregate records the resulting verification state,
 * while VerificationRequest records individual verification submissions.
 */
export interface Verification {
  /**
   * Public identifier of the Verification aggregate.
   */
  publicId: string;

  /**
   * Current verification lifecycle state.
   */
  status: VerificationStatus;

  /**
   * Current verification level.
   *
   * NONE:
   *     No verification level has been granted.
   *
   * MEMBER:
   *     Member verification requirements have been satisfied.
   *
   * DRIVER:
   *     Driver verification requirements have been satisfied.
   */
  level: VerificationLevel;

  // ---------------------------------------------------------------------------
  // Verification Results
  // ---------------------------------------------------------------------------

  /**
   * Whether the profile photo requirement has been verified.
   */
  profilePhotoVerified: boolean;

  /**
   * Whether the government identity document requirement has been verified.
   */
  governmentIdVerified: boolean;

  /**
   * Whether the driver licence requirement has been verified.
   */
  driverLicenseVerified: boolean;

  // ---------------------------------------------------------------------------
  // Verification Timestamps
  // ---------------------------------------------------------------------------

  /**
   * Timestamp when the aggregate verification became verified.
   */
  verifiedAt: string | null;

  /**
   * Timestamp when the current verification expires.
   */
  expiresAt: string | null;

  /**
   * Timestamp when member-level verification was granted.
   */
  memberVerifiedAt: string | null;

  /**
   * Timestamp when driver-level verification was granted.
   */
  driverVerifiedAt: string | null;

  /**
   * Timestamp when the profile photo requirement was verified.
   */
  profilePhotoVerifiedAt: string | null;

  /**
   * Timestamp when the government ID requirement was verified.
   */
  governmentIdVerifiedAt: string | null;

  /**
   * Timestamp when the driver licence requirement was verified.
   */
  driverLicenseVerifiedAt: string | null;

  // ---------------------------------------------------------------------------
  // Review
  // ---------------------------------------------------------------------------

  /**
   * Reason supplied when the verification was rejected.
   *
   * Null when there is no rejection reason.
   */
  rejectionReason: string | null;

  /**
   * Timestamp of the most recent verification review.
   */
  lastReviewedAt: string | null;

  // ---------------------------------------------------------------------------
  // Timestamps
  // ---------------------------------------------------------------------------

  /**
   * Timestamp when the Verification aggregate was created.
   */
  createdAt: string;

  /**
   * Timestamp when the Verification aggregate was last updated.
   */
  updatedAt: string;
}