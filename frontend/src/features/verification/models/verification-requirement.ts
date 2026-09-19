// -----------------------------------------------------------------------------
// sisiMove — Verification Requirement Model
// -----------------------------------------------------------------------------
//
// Frontend representation of a verification requirement.
//
// A VerificationRequirement describes what the traveller needs to provide
// for a particular verification level. It is a presentation/application
// model derived from the verification domain state.
//
// It is intentionally separate from VerificationRequest:
//
//     Verification
//         │
//         ├── VerificationRequirement
//         │       └── What is required
//         │
//         └── VerificationRequest
//                 └── What has been submitted
//
// The backend remains authoritative for determining which requirements apply.
// -----------------------------------------------------------------------------

// =============================================================================
// Verification Requirement Type
// =============================================================================

/**
 * Verification evidence required from the traveller.
 */
export type VerificationRequirementType =
  | 'PROFILE_PHOTO'
  | 'GOVERNMENT_ID'
  | 'DRIVER_LICENSE';

// =============================================================================
// Verification Requirement Status
// =============================================================================

/**
 * Current state of a verification requirement from the traveller's
 * perspective.
 *
 * NOT_STARTED:
 *     No request has been submitted.
 *
 * PENDING:
 *     Evidence has been submitted and is awaiting review.
 *
 * APPROVED:
 *     The submitted requirement has been approved.
 *
 * REJECTED:
 *     The submitted evidence was rejected and may require resubmission.
 *
 * CANCELLED:
 *     The submitted request was cancelled.
 */
export type VerificationRequirementStatus =
  | 'NOT_STARTED'
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

// =============================================================================
// Verification Requirement
// =============================================================================

/**
 * A verification requirement applicable to the traveller.
 *
 * This model allows the verification UI to render requirements without
 * coupling presentation code directly to VerificationRequest persistence
 * details.
 */
export interface VerificationRequirement {
  /**
   * Type of evidence required.
   */
  type: VerificationRequirementType;

  /**
   * Whether this requirement is currently required for the target
   * verification level.
   */
  required: boolean;

  /**
   * Current state of this requirement.
   */
  status: VerificationRequirementStatus;

  /**
   * Public identifier of the latest VerificationRequest associated with
   * this requirement.
   *
   * Null when no request has been submitted.
   */
  requestPublicId: string | null;

  /**
   * Public identifier of the submitted evidence asset.
   *
   * Null when no evidence has been submitted.
   */
  assetPublicId: string | null;

  /**
   * Timestamp when the current request was submitted.
   *
   * Null when no request has been submitted.
   */
  submittedAt: string | null;

  /**
   * Timestamp when the current request was reviewed.
   *
   * Null when the request has not been reviewed.
   */
  reviewedAt: string | null;

  /**
   * Rejection reason for the current request.
   *
   * Null when there is no rejection reason.
   */
  rejectionReason: string | null;
}