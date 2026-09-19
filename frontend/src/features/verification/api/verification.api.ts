// -----------------------------------------------------------------------------
// sisiMove — Verification API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operations for the Verification aggregate belonging to
// the currently authenticated identity.
//
// Backend applicant routes:
//
//   POST /verifications
//       Start verification for the authenticated identity.
//
//   GET /verifications/me
//       Retrieve the verification belonging to the authenticated identity.
//
// Backend reviewer/query route:
//
//   GET /verifications/:verificationPublicId
//       Retrieve a verification by its public ID.
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// The authenticated identity is determined by the backend from the access
// token.
//
// The frontend MUST NOT:
//
// - provide an identityPublicId;
// - determine the current identity;
// - determine verification ownership;
// - determine verification authorization;
// - recreate Verification domain rules.
//
// Authentication and authorization remain backend responsibilities.
//
// Applicant operations:
//
//   POST /verifications
//       → authenticatedApiClient
//
//   GET /verifications/me
//       → authenticatedApiClient
//
// Reviewer/query operation:
//
//   GET /verifications/:verificationPublicId
//       → authenticatedApiClient
//
// The backend remains the source of truth for:
//
// - identity;
// - verification ownership;
// - verification existence;
// - verification lifecycle;
// - authorization;
// - domain rules.
//
// -----------------------------------------------------------------------------
//
// Verification query boundaries:
//
//   GET /verifications/me
//       ↓
//   GetVerificationQuery
//       ↓
//   IdentityPublicId
//       ↓
//   current identity's Verification
//
//   GET /verifications/:verificationPublicId
//       ↓
//   GetVerificationByPublicIdQuery
//       ↓
//   VerificationPublicId
//       ↓
//   explicit Verification resource
//
// These are intentionally different HTTP/application boundaries.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication — Authenticated HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// -----------------------------------------------------------------------------
// Verification — Models
// -----------------------------------------------------------------------------

import type { Verification } from '../models';

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
// Start Verification
// =============================================================================

/**
 * Start verification for the currently authenticated identity.
 *
 * Backend route:
 *
 *     POST /verifications
 *
 * Authentication:
 *
 *     Bearer access token
 *
 * The backend derives the IdentityPublicId from the authenticated JWT.
 *
 * The frontend therefore sends no identity identifier.
 *
 * Backend flow:
 *
 *     access token
 *          ↓
 *     JwtAuthGuard
 *          ↓
 *     AuthenticatedIdentity
 *          ↓
 *     CreateVerificationCommand
 *          ↓
 *     VerificationAggregate
 *          ↓
 *     VerificationResponse
 *
 * The backend remains the source of truth for:
 *
 * - identity;
 * - verification existence;
 * - verification lifecycle;
 * - domain rules.
 */
export async function createVerification(): Promise<Verification> {
  return authenticatedApiClient.post<Verification>(VERIFICATIONS_PATH);
}

// =============================================================================
// Get Current Verification
// =============================================================================

/**
 * Retrieve the Verification aggregate belonging to the currently
 * authenticated identity.
 *
 * Backend route:
 *
 *     GET /verifications/me
 *
 * Authentication:
 *
 *     Bearer access token
 *
 * Authorization:
 *
 *     Authenticated applicant operation.
 *
 * The frontend does not provide an identityPublicId or verificationPublicId.
 *
 * The backend resolves the current identity from the authenticated access
 * token and executes the identity-based Verification query.
 *
 * Backend flow:
 *
 *     access token
 *          ↓
 *     JwtAuthGuard
 *          ↓
 *     AuthenticatedIdentity
 *          ↓
 *     GetVerificationQuery
 *          ↓
 *     findByIdentityPublicId()
 *          ↓
 *     VerificationAggregate
 *          ↓
 *     VerificationResponse
 *
 * This is the correct API boundary for the authenticated user's verification
 * page/profile because the client should not need to discover or supply its
 * own VerificationPublicId.
 */
export async function getMyVerification(): Promise<Verification> {
  return authenticatedApiClient.get<Verification>(
    `${VERIFICATIONS_PATH}/me`,
  );
}

// =============================================================================
// Get Verification By Public ID
// =============================================================================

/**
 * Retrieve a Verification aggregate by its public ID.
 *
 * Backend route:
 *
 *     GET /verifications/:verificationPublicId
 *
 * Authentication:
 *
 *     Bearer access token
 *
 * Backend authorization:
 *
 *     verification:read
 *
 * The frontend supplies only the public identifier of the Verification
 * aggregate.
 *
 * The frontend does not determine whether the caller is authorized to read
 * the resource.
 *
 * Backend flow:
 *
 *     verificationPublicId
 *          ↓
 *     GetVerificationByPublicIdQuery
 *          ↓
 *     findByPublicId()
 *          ↓
 *     VerificationAggregate
 *          ↓
 *     VerificationResponse
 *
 * This operation is intentionally separate from getMyVerification().
 */
export async function getVerification(
  verificationPublicId: string,
): Promise<Verification> {
  return authenticatedApiClient.get<Verification>(
    `${VERIFICATIONS_PATH}/${encodeURIComponent(verificationPublicId)}`,
  );
}