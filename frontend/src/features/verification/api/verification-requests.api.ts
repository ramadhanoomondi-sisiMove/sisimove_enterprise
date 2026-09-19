// -----------------------------------------------------------------------------
// sisiMove — Verification Requests API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operations for Verification Requests.
//
// Backend routes:
//
//   GET /verifications/:verificationPublicId/requests
//
//   GET /verifications/:verificationPublicId/requests/:verificationRequestPublicId
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// Verification Requests are children of the Verification aggregate.
//
// REST hierarchy:
//
//   Verification
//       └── Verification Request
//
// Therefore the frontend supplies:
//
//   verificationPublicId
//
// and, for a single request:
//
//   verificationRequestPublicId
//
// The frontend does NOT:
//
// - determine verification ownership;
// - determine authorization;
// - recreate Verification Request lifecycle rules;
// - inspect internal database IDs;
// - determine whether a request belongs to the authenticated identity.
//
// The backend remains the source of truth.
//
// The current backend controller protects both query operations with:
//
//   JwtAuthGuard
//   PermissionsGuard
//
// and the following permissions:
//
//   verification-request:read
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
// Verification Requests
// =============================================================================

/**
 * Retrieve all Verification Requests belonging to a Verification aggregate.
 *
 * Backend route:
 *
 *     GET /verifications/:verificationPublicId/requests
 *
 * Authentication:
 *
 *     Bearer access token
 *
 * Backend authorization:
 *
 *     verification-request:read
 *
 * Empty collection:
 *
 *     []
 *
 * is a successful response and means that the Verification currently has no
 * Verification Requests.
 */
export async function getVerificationRequests(
  verificationPublicId: string,
): Promise<readonly VerificationRequest[]> {
  return authenticatedApiClient.get<readonly VerificationRequest[]>(
    `${VERIFICATIONS_PATH}/${encodeURIComponent(
      verificationPublicId,
    )}/requests`,
  );
}

// =============================================================================
// Verification Request
// =============================================================================

/**
 * Retrieve a single Verification Request.
 *
 * Backend route:
 *
 *     GET /verifications/:verificationPublicId/requests/:verificationRequestPublicId
 *
 * Authentication:
 *
 *     Bearer access token
 *
 * Backend authorization:
 *
 *     verification-request:read
 *
 * A null response means that the backend did not find the requested
 * Verification Request within the specified Verification aggregate.
 */
export async function getVerificationRequest(
  verificationPublicId: string,
  verificationRequestPublicId: string,
): Promise<VerificationRequest | null> {
  return authenticatedApiClient.get<VerificationRequest | null>(
    `${VERIFICATIONS_PATH}/${encodeURIComponent(
      verificationPublicId,
    )}/requests/${encodeURIComponent(verificationRequestPublicId)}`,
  );
}