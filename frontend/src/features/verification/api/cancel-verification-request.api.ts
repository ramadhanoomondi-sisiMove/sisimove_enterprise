// -----------------------------------------------------------------------------
// sisiMove — Cancel Verification Request API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operation for cancelling a Verification Request.
//
// Backend route:
//
//   PATCH /verifications/:verificationPublicId/requests/
//         :verificationRequestPublicId/cancel
//
// Authentication:
//
//   JwtAuthGuard
//
// Permission:
//
//   None
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// Cancellation is an applicant/service operation.
//
// The authenticated identity is derived by the backend from the access token.
//
// The frontend therefore MUST NOT:
//
// - provide an identityPublicId;
// - determine request ownership;
// - determine whether cancellation is allowed;
// - recreate Verification Request lifecycle rules.
//
// The backend remains the source of truth for all cancellation rules.
//
// The verificationPublicId exists in the HTTP resource hierarchy, but the
// backend CancelVerificationRequestCommand intentionally receives only:
//
//   IdentityPublicId
//   VerificationRequestPublicId
//   correlation ID
//
// Therefore the parent Verification ID is not sent in a request body.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication — Authenticated HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// -----------------------------------------------------------------------------
// Verification — Models
// -----------------------------------------------------------------------------

import type { VerificationRequest } from '../models';

// =============================================================================
// Constants
// =============================================================================

/**
 * Base route for the Verification HTTP controller.
 *
 * NestJS:
 *
 *     @Controller('verifications')
 */
const VERIFICATIONS_PATH = '/verifications';

// =============================================================================
// Cancel Verification Request
// =============================================================================

/**
 * Cancel a pending Verification Request belonging to the authenticated
 * identity.
 *
 * Backend route:
 *
 *     PATCH /verifications/:verificationPublicId/requests/
 *           :verificationRequestPublicId/cancel
 *
 * Authentication:
 *
 *     Bearer access token
 *
 * No request body is required.
 *
 * The backend determines:
 *
 * - the authenticated identity;
 * - ownership of the Verification Request;
 * - whether the request may be cancelled;
 * - the resulting request state.
 *
 * The successful response is the updated Verification Request.
 */
export async function cancelVerificationRequest(
  verificationPublicId: string,
  verificationRequestPublicId: string,
): Promise<VerificationRequest> {
  return authenticatedApiClient.patch<VerificationRequest>(
    `${VERIFICATIONS_PATH}/${encodeURIComponent(
      verificationPublicId,
    )}/requests/${encodeURIComponent(
      verificationRequestPublicId,
    )}/cancel`,
  );
}