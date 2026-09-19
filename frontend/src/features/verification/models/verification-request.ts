// -----------------------------------------------------------------------------
// sisiMove — Verification Request Model
// -----------------------------------------------------------------------------
//
// Frontend representation of an individual VerificationRequest.
//
// VerificationRequest represents one submitted verification item and its
// review lifecycle.
//
//     Verification
//         │
//         └── VerificationRequest
//                 ├── type
//                 ├── status
//                 ├── asset
//                 └── review state
//
// The aggregate verification result belongs to:
//     verification.ts
//
// This model intentionally uses public identifiers and excludes internal
// Prisma IDs and reviewer Identity records.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Verification Request Type
// =============================================================================

/**
 * Verification requirement being submitted for review.
 */
export type VerificationRequestType =
  | 'PROFILE_PHOTO'
  | 'GOVERNMENT_ID'
  | 'DRIVER_LICENSE';

// =============================================================================
// Verification Request Status
// =============================================================================

/**
 * Lifecycle state of an individual verification submission.
 */
export type VerificationRequestStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

// =============================================================================
// Verification Request
// =============================================================================

/**
 * Individual verification submission and review state.
 */
export interface VerificationRequest {
  /**
   * Public identifier of the verification request.
   */
  publicId: string;

  /**
   * Public identifier of the parent Verification aggregate.
   */
  verificationPublicId: string;

  /**
   * Verification requirement being submitted.
   */
  type: VerificationRequestType;

  /**
   * Current lifecycle state of this submission.
   */
  status: VerificationRequestStatus;

  /**
   * Public identifier of the Asset containing the submitted verification
   * evidence.
   */
  assetPublicId: string;

  /**
   * Timestamp when the verification request was submitted.
   */
  submittedAt: string;

  /**
   * Timestamp when the request was reviewed.
   *
   * Null while the request has not been reviewed.
   */
  reviewedAt: string | null;

  /**
   * Reason supplied when the verification request was rejected.
   *
   * Null when there is no rejection reason.
   */
  rejectionReason: string | null;

  /**
   * Additional backend-provided metadata associated with the request.
   *
   * The metadata shape is intentionally left open because the Prisma field
   * is Json and its structure is determined by the verification workflow.
   */
  metadata: Record<string, unknown> | null;

  /**
   * Timestamp when the request record was created.
   */
  createdAt: string;

  /**
   * Timestamp when the request record was last updated.
   */
  updatedAt: string;
}