
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Verification Request API Types
 * -----------------------------------------------------------------------------
 *
 * Path:
 * src/features/admin/verifications/types/verification-request.types.ts
 *
 * Purpose:
 * Defines request-specific transport types for verification evidence
 * submission, retrieval, approval, rejection, and cancellation.
 *
 * Domain ownership:
 *
 * VerificationAggregate
 * └── VerificationRequest[]
 *     └── Evidence Asset (referenced by public ID)
 *
 * Important:
 * - VerificationRequest is owned by Verification.
 * - Request approval does not grant aggregate-level verification.
 * - Requests do not have an EXPIRED status.
 * - Evidence assets must be accessed through an authorized backend flow.
 * - These types do not expose persistence IDs or storage keys.
 * -----------------------------------------------------------------------------
 */

import type {
  VerificationApiTimestamp,
  VerificationRequestApiMetadata,
  VerificationRequestApiStatus,
  VerificationRequestApiType,
} from "./verification-api.types";

// =============================================================================
// REQUEST RESPONSE
// =============================================================================

/**
 * REST representation of a verification evidence request.
 *
 * This mirrors the backend VerificationRequestResponse contract.
 */
export interface VerificationRequestResponse {
  /** Public ID of the request. */
  publicId: string;

  /** Public ID of the owning verification aggregate. */
  verificationPublicId: string;

  /** Evidence category submitted for review. */
  type: VerificationRequestApiType;

  /** Current request-level lifecycle status. */
  status: VerificationRequestApiStatus;

  /** Public ID of the evidence Asset. */
  assetPublicId: string;

  /** Time at which the request was submitted. */
  submittedAt: VerificationApiTimestamp;

  /** Time at which the request was reviewed, if available. */
  reviewedAt?: VerificationApiTimestamp;

  /** Public ID of the reviewing identity, if available. */
  reviewedByPublicId?: string;

  /** Rejection reason, if available. */
  rejectionReason?: string;

  /** Optional metadata supplied with the request. */
  metadata?: VerificationRequestApiMetadata;

  /** Creation timestamp. */
  createdAt: VerificationApiTimestamp;

  /** Last update timestamp. */
  updatedAt: VerificationApiTimestamp;
}

// =============================================================================
// REQUEST COLLECTION
// =============================================================================

/**
 * Collection returned when retrieving requests belonging to a verification.
 *
 * Use this only if the backend endpoint returns a raw array. If the backend
 * uses a pagination envelope, define that envelope from its actual DTO.
 */
export type VerificationRequestsResponse =
  readonly VerificationRequestResponse[];

// =============================================================================
// REQUEST REVIEW PAYLOADS
// =============================================================================

/**
 * Payload for approving a submitted evidence request.
 *
 * The backend controller does not establish that approval requires a body,
 * so this type intentionally does not invent additional fields.
 */
export type ApproveVerificationRequestPayload = Record<string, never>;

/**
 * Payload for rejecting a submitted evidence request.
 *
 * Confirm the exact backend DTO field and validation rules before sending
 * this payload from the API client.
 */
export interface RejectVerificationRequestPayload {
  rejectionReason: string;
}

/**
 * Payload for cancelling a pending verification request.
 *
 * No cancellation-reason field is included because the available backend
 * contract does not establish one.
 */
export type CancelVerificationRequestPayload = Record<string, never>;

// =============================================================================
// REQUEST REVIEW ACTION
// =============================================================================

/**
 * Supported request-level review operations.
 *
 * These actions affect the request lifecycle, not automatically the
 * aggregate's verification status or level.
 */
export type VerificationRequestReviewAction =
  | "approve"
  | "reject"
  | "cancel";

// =============================================================================
// REQUEST REVIEW RESULT
// =============================================================================

/**
 * A request review operation returns the updated request representation
 * only if the corresponding backend endpoint actually returns it.
 *
 * This alias is useful for documenting that expected result without
 * inventing a different response shape.
 */
export type VerificationRequestReviewResponse =
  VerificationRequestResponse;
