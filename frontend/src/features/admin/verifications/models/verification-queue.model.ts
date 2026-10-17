
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Verification Queue Model
 * -----------------------------------------------------------------------------
 *
 * Path:
 * src/features/admin/verifications/models/verification-queue.model.ts
 *
 * Purpose:
 * Defines frontend models for displaying and filtering the admin verification
 * queue.
 *
 * Important:
 * - API response types remain in the types directory.
 * - This model does not invent pagination or aggregate-count API contracts.
 * - VerificationRequest status is distinct from Verification status.
 * - The backend remains authoritative for status transitions and permissions.
 * -----------------------------------------------------------------------------
 */

import type {
  VerificationApiLevel,
  VerificationApiStatus,
} from "../types/verification-api.types";

// =============================================================================
// QUEUE FILTERS
// =============================================================================

/**
 * Filters available to the verification queue UI.
 *
 * These are frontend filter selections, not a claim that the backend supports
 * every filter. Map them to actual query parameters only after verifying the
 * backend endpoint contract.
 */
export interface VerificationQueueFilters {
  status?: VerificationApiStatus;
  level?: VerificationApiLevel;
  identityPublicId?: string;
  search?: string;
}

// =============================================================================
// QUEUE ITEM
// =============================================================================

/**
 * A verification record represented in the queue.
 *
 * Keep this model focused on fields useful for identifying and sorting a
 * verification record. Populate it from VerificationApiResponse through
 * a dedicated mapper.
 */
export interface VerificationQueueItem {
  /** Public ID used to open the verification detail route. */
  verificationPublicId: string;

  /** Public ID of the identity being verified. */
  identityPublicId: string;

  /** Current aggregate-level verification status. */
  status: VerificationApiStatus;

  /** Current aggregate-level verification level. */
  level: VerificationApiLevel;

  /** Whether profile-photo evidence has been accepted. */
  profilePhotoVerified: boolean;

  /** Whether government-ID evidence has been accepted. */
  governmentIdVerified: boolean;

  /** Whether driver-license evidence has been accepted. */
  driverLicenseVerified: boolean;

  /** Number of pending evidence requests belonging to this verification. */
  pendingRequestCount: number;

  /** Timestamp when the verification record was created. */
  createdAt: string;

  /** Timestamp of the most recent aggregate-level review, if available. */
  lastReviewedAt?: string;

  /** Timestamp when the current verification expires, if applicable. */
  expiresAt?: string;
}

// =============================================================================
// QUEUE VIEW MODEL
// =============================================================================

/**
 * Data required by the queue view.
 *
 * This is a frontend view model, not a backend pagination response.
 * Do not populate totalItems or page information unless a real API contract
 * supplies those values.
 */
export interface VerificationQueueModel {
  items: readonly VerificationQueueItem[];
  filters: VerificationQueueFilters;
}

// =============================================================================
// QUEUE SORTING
// =============================================================================

/**
 * Fields the frontend may use to sort queue items.
 *
 * Ensure the corresponding table column supports the selected sort before
 * applying it.
 */
export type VerificationQueueSortField =
  | "createdAt"
  | "lastReviewedAt"
  | "expiresAt"
  | "status"
  | "level";

/**
 * Queue sort direction.
 */
export type VerificationQueueSortDirection = "asc" | "desc";

/**
 * Current queue sorting selection.
 */
export interface VerificationQueueSort {
  field: VerificationQueueSortField;
  direction: VerificationQueueSortDirection;
}
