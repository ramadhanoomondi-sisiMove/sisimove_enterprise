
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
 *   an evidence request.
 * - The grant endpoints require the public ID of the verification request
 *   used as the basis for the grant.
 * - The backend remains authoritative for permissions and state transitions.
 * - Internal persistence identifiers must not cross the API boundary.
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

export type VerificationAction =
  | "grant-member"
  | "grant-driver"
  | "reject"
  | "reopen"
  | "expire"
  | "revoke";

// =============================================================================
// AGGREGATE ACTION PAYLOADS
// =============================================================================

/**
 * Shared payload for granting a verification level.
 *
 * The backend grant endpoints require a verification request public ID.
 * This identifies the submitted evidence request supporting the grant.
 */
export interface GrantVerificationPayload {
  verificationRequestPublicId: string;
}

/**
 * Grant MEMBER verification.
 */
export type GrantMemberVerificationPayload = GrantVerificationPayload;

/**
 * Grant DRIVER verification.
 */
export type GrantDriverVerificationPayload = GrantVerificationPayload;

/**
 * Reject an aggregate-level verification.
 */
export interface RejectVerificationPayload {
  rejectionReason: string;
}

/**
 * Reopen a previously rejected or expired verification.
 */
export type ReopenVerificationPayload = Record<string, never>;

/**
 * Expire an aggregate-level verification.
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
 * Aggregate-level grant and lifecycle actions return the updated
 * Verification aggregate when confirmed by their controller contracts.
 */
export type VerificationActionResponse = VerificationApiResponse;

// =============================================================================
// ACTION STATE
// =============================================================================

export interface VerificationActionState {
  status: VerificationApiStatus;
  level: VerificationApiLevel;
}

/**
 * Identifies an aggregate-level action currently being submitted.
 */
export interface VerificationActionExecution {
  verificationPublicId: string;
  action: VerificationAction;
}
