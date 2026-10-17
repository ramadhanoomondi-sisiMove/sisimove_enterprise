
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Verification Action Types
 * -----------------------------------------------------------------------------
 *
 * Path:
 * src/features/admin/verifications/types/verification-action.types.ts
 *
 * Purpose:
 * Defines frontend transport types for aggregate-level verification actions.
 *
 * Important:
 * - Aggregate-level actions are different from request-level review actions.
 * - Granting MEMBER or DRIVER verification is not the same as approving
 *   a submitted evidence request.
 * - The backend remains authoritative for permissions and state transitions.
 * - These types do not expose internal persistence identifiers.
 * -----------------------------------------------------------------------------
 */

import type {
  VerificationApiResponse,
  VerificationApiStatus,
  VerificationApiLevel,
} from "./verification-api.types";

// =============================================================================
// AGGREGATE ACTIONS
// =============================================================================

/**
 * Aggregate-level operations supported by the verification controller.
 *
 * These names correspond to the backend action endpoints.
 */
export type VerificationAction =
  | "grant-member"
  | "grant-driver"
  | "reject"
  | "reopen"
  | "expire"
  | "revoke";

/**
 * Grant MEMBER verification.
 *
 * Keep the payload empty unless the actual backend DTO defines additional
 * required fields.
 */
export type GrantMemberVerificationPayload = Record<string, never>;

/**
 * Grant DRIVER verification.
 *
 * Keep the payload empty unless the actual backend DTO defines additional
 * required fields.
 */
export type GrantDriverVerificationPayload = Record<string, never>;

/**
 * Reject an aggregate-level verification.
 */
export interface RejectVerificationPayload {
  rejectionReason: string;
}

/**
 * Reopen a previously rejected or expired verification.
 *
 * Confirm the backend request DTO before adding payload fields.
 */
export type ReopenVerificationPayload = Record<string, never>;

/**
 * Expire an aggregate-level verification.
 *
 * Confirm the backend request DTO before adding payload fields.
 */
export type ExpireVerificationPayload = Record<string, never>;

/**
 * Revoke an aggregate-level verification.
 */
export interface RevokeVerificationPayload {
  rejectionReason: string;
}

// =============================================================================
// ACTION PAYLOAD UNION
// =============================================================================

/**
 * Union of payloads that can accompany aggregate-level actions.
 *
 * Prefer the specific payload type for each API method rather than relying
 * on this union to validate action/payload combinations.
 */
export type VerificationActionPayload =
  | GrantMemberVerificationPayload
  | GrantDriverVerificationPayload
  | RejectVerificationPayload
  | ReopenVerificationPayload
  | ExpireVerificationPayload
  | RevokeVerificationPayload;

// =============================================================================
// ACTION RESULT
// =============================================================================

/**
 * Expected result when an aggregate action endpoint returns the updated
 * VerificationResponse.
 *
 * Verify each controller endpoint's actual return contract before using
 * this alias as its declared HTTP response type.
 */
export type VerificationActionResponse = VerificationApiResponse;

// =============================================================================
// ACTION STATE
// =============================================================================

/**
 * Aggregate states used when presenting verification actions.
 *
 * This type describes available state values; it does not replace backend
 * authorization or lifecycle validation.
 */
export interface VerificationActionState {
  status: VerificationApiStatus;
  level: VerificationApiLevel;
}

/**
 * Identifies an aggregate-level action that is currently being submitted.
 */
export interface VerificationActionExecution {
  verificationPublicId: string;
  action: VerificationAction;
}
