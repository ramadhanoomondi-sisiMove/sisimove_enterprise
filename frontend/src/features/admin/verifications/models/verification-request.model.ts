
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Verification Request Model
 * -----------------------------------------------------------------------------
 *
 * Path:
 * src/features/admin/verifications/models/verification-request.model.ts
 *
 * Purpose:
 * Defines frontend display models for verification evidence requests.
 *
 * Domain ownership:
 *
 * VerificationAggregate
 * └── VerificationRequest
 *     └── Evidence Asset (referenced by public ID)
 *
 * Important:
 * - Request approval means submitted evidence was accepted.
 * - Request approval does not grant MEMBER or DRIVER verification.
 * - Verification requests do not have an EXPIRED status.
 * - Dates in this model are normalized for frontend presentation.
 * - The backend remains authoritative for review decisions.
 * -----------------------------------------------------------------------------
 */

import type {
  VerificationRequestApiStatus,
  VerificationRequestApiType,
} from "../types/verification-api.types";

import type {
  VerificationRequestResponse,
} from "../types/verification-request.types";

// =============================================================================
// REQUEST MODEL
// =============================================================================

/**
 * Frontend model for displaying one verification evidence request.
 *
 * This model deliberately uses the API response as its source and does not
 * introduce additional backend fields.
 */
export interface VerificationRequestModel {
  /** Public ID of the verification request. */
  publicId: string;

  /** Public ID of the owning verification aggregate. */
  verificationPublicId: string;

  /** Type of evidence submitted for review. */
  type: VerificationRequestApiType;

  /** Current request-level lifecycle status. */
  status: VerificationRequestApiStatus;

  /** Public ID of the evidence asset. */
  assetPublicId: string;

  /** Submission timestamp in ISO-8601 format. */
  submittedAt: string;

  /** Review timestamp, if the request has been reviewed. */
  reviewedAt?: string;

  /** Public ID of the reviewing identity, if available. */
  reviewedByPublicId?: string;

  /** Rejection reason, if provided. */
  rejectionReason?: string;

  /** Optional request metadata. */
  metadata?: Readonly<Record<string, unknown>>;

  /** Record creation timestamp. */
  createdAt: string;

  /** Last update timestamp. */
  updatedAt: string;
}

// =============================================================================
// REQUEST COLLECTION MODEL
// =============================================================================

/**
 * Collection of request models belonging to a verification aggregate.
 */
export type VerificationRequestListModel =
  readonly VerificationRequestModel[];

// =============================================================================
// REQUEST REVIEW CAPABILITIES
// =============================================================================

/**
 * Describes which request-level actions the UI may present.
 *
 * These flags are presentation hints only. Backend authorization and domain
 * rules must still validate every operation.
 */
export interface VerificationRequestCapabilities {
  canApprove: boolean;
  canReject: boolean;
  canCancel: boolean;
}

/**
 * Request model combined with UI-level action capabilities.
 */
export interface VerificationRequestWithCapabilities
  extends VerificationRequestModel {
  capabilities: VerificationRequestCapabilities;
}

// =============================================================================
// API RESPONSE MAPPING
// =============================================================================

/**
 * Converts the API response into the frontend request model.
 *
 * This mapper performs representation conversion only:
 * - it does not infer aggregate verification;
 * - it does not decide permissions;
 * - it does not change request status;
 * - it does not create evidence URLs.
 */
export function toVerificationRequestModel(
  response: VerificationRequestResponse,
): VerificationRequestModel {
  return {
    publicId: response.publicId,
    verificationPublicId: response.verificationPublicId,
    type: response.type,
    status: response.status,
    assetPublicId: response.assetPublicId,
    submittedAt: response.submittedAt,
    reviewedAt: response.reviewedAt,
    reviewedByPublicId: response.reviewedByPublicId,
    rejectionReason: response.rejectionReason,
    metadata: response.metadata,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}

/**
 * Converts a collection of API responses into frontend request models.
 */
export function toVerificationRequestListModel(
  responses: readonly VerificationRequestResponse[],
): VerificationRequestListModel {
  return responses.map(toVerificationRequestModel);
}
