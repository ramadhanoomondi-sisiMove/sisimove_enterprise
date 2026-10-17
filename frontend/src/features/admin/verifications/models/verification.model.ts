
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Verification Model
 * -----------------------------------------------------------------------------
 *
 * Path:
 * src/features/admin/verifications/models/verification.model.ts
 *
 * Purpose:
 * Defines the frontend model for a Verification aggregate and maps its API
 * response into a frontend-friendly representation.
 *
 * Domain ownership:
 *
 * VerificationAggregate
 * └── Verification
 *     └── VerificationRequest[]
 *
 * Important:
 * - The backend is authoritative for verification status and level.
 * - Approved evidence requests do not automatically grant verification.
 * - Public IDs are used instead of persistence IDs.
 * - HTTP timestamps are ISO-8601 strings.
 * - This model does not invent audit history or evidence-access URLs.
 * -----------------------------------------------------------------------------
 */

import type {
  VerificationApiLevel,
  VerificationApiResponse,
  VerificationApiStatus,
} from "../types/verification-api.types";

import {
  toVerificationRequestListModel,
  type VerificationRequestListModel,
} from "./verification-request.model";

// =============================================================================
// VERIFICATION MODEL
// =============================================================================

/**
 * Frontend representation of a Verification aggregate.
 */
export interface VerificationModel {
  /** Public ID of the verification aggregate. */
  publicId: string;

  /** Public ID of the identity being verified. */
  identityPublicId: string;

  /** Current aggregate-level verification status. */
  status: VerificationApiStatus;

  /** Current aggregate-level verification level. */
  level: VerificationApiLevel;

  // ---------------------------------------------------------------------------
  // Accepted evidence
  // ---------------------------------------------------------------------------

  profilePhotoVerified: boolean;

  governmentIdVerified: boolean;

  driverLicenseVerified: boolean;

  // ---------------------------------------------------------------------------
  // Verification timestamps
  // ---------------------------------------------------------------------------

  verifiedAt?: string;

  memberVerifiedAt?: string;

  driverVerifiedAt?: string;

  expiresAt?: string;

  profilePhotoVerifiedAt?: string;

  governmentIdVerifiedAt?: string;

  driverLicenseVerifiedAt?: string;

  // ---------------------------------------------------------------------------
  // Aggregate review
  // ---------------------------------------------------------------------------

  reviewedByPublicId?: string;

  rejectionReason?: string;

  lastReviewedAt?: string;

  // ---------------------------------------------------------------------------
  // Aggregate-owned requests
  // ---------------------------------------------------------------------------

  requests: VerificationRequestListModel;

  // ---------------------------------------------------------------------------
  // Record timestamps
  // ---------------------------------------------------------------------------

  createdAt: string;

  updatedAt: string;
}

// =============================================================================
// API RESPONSE MAPPING
// =============================================================================

/**
 * Maps a Verification API response to the frontend model.
 *
 * This function performs representation conversion only. It does not:
 * - infer verification status from request statuses;
 * - calculate verification level;
 * - determine whether the current administrator has permission to act;
 * - generate asset preview or download URLs;
 * - invent review history.
 */
export function toVerificationModel(
  response: VerificationApiResponse,
): VerificationModel {
  return {
    publicId: response.publicId,
    identityPublicId: response.identityPublicId,

    status: response.status,
    level: response.level,

    profilePhotoVerified: response.profilePhotoVerified,
    governmentIdVerified: response.governmentIdVerified,
    driverLicenseVerified: response.driverLicenseVerified,

    verifiedAt: response.verifiedAt,
    memberVerifiedAt: response.memberVerifiedAt,
    driverVerifiedAt: response.driverVerifiedAt,
    expiresAt: response.expiresAt,

    profilePhotoVerifiedAt: response.profilePhotoVerifiedAt,
    governmentIdVerifiedAt: response.governmentIdVerifiedAt,
    driverLicenseVerifiedAt: response.driverLicenseVerifiedAt,

    reviewedByPublicId: response.reviewedByPublicId,
    rejectionReason: response.rejectionReason,
    lastReviewedAt: response.lastReviewedAt,

    requests: toVerificationRequestListModel(response.requests),

    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}

/**
 * Maps multiple verification API responses to frontend models.
 */
export function toVerificationListModel(
  responses: readonly VerificationApiResponse[],
): readonly VerificationModel[] {
  return responses.map(toVerificationModel);
}
