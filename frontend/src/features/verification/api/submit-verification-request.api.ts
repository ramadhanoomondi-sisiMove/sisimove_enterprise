// -----------------------------------------------------------------------------
// sisiMove — Submit Verification Request API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operation for submitting verification evidence.
//
// Backend route:
//
//   POST /verifications/requests
//
// Request:
//
//   multipart/form-data
//
// Fields:
//
//   type
//   file
//
// Backend workflow:
//
//   authenticated identity
//          ↓
//   SubmitVerificationRequestCommand
//          ↓
//   upload Asset
//          ↓
//   resolve/create Verification
//          ↓
//   create VerificationRequest
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// The frontend MUST NOT:
//
// - create the Asset;
// - provide an identityPublicId;
// - create the Verification;
// - create the VerificationRequest directly;
// - determine whether the evidence is required;
// - determine whether another request is pending.
//
// The backend orchestrator owns that workflow.
//
// The authenticated API client supplies:
//
//   Authorization: Bearer <accessToken>
//
// The request therefore contains only the verification evidence type and
// browser file.
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

// -----------------------------------------------------------------------------
// Verification — Schemas
// -----------------------------------------------------------------------------

import type { SubmitVerificationRequestInput } from '../schemas';

// =============================================================================
// Constants
// =============================================================================

/**
 * Base route for the Verification HTTP controller.
 */
const VERIFICATIONS_PATH = '/verifications';

// =============================================================================
// Submit Verification Request
// =============================================================================

/**
 * Submit verification evidence for the currently authenticated identity.
 *
 * Backend route:
 *
 *     POST /verifications/requests
 *
 * Authentication:
 *
 *     Bearer access token
 *
 * Content type:
 *
 *     multipart/form-data
 *
 * Form fields:
 *
 *     type
 *     file
 *
 * The backend derives the identity from the authenticated JWT and performs
 * the complete verification submission workflow.
 *
 * The frontend therefore does not send:
 *
 *     identityPublicId
 *     verificationPublicId
 *     assetPublicId
 *     verificationRequestPublicId
 *
 * The backend response is the resulting Verification response.
 */
export async function submitVerificationRequest(
  input: SubmitVerificationRequestInput,
  file: File,
): Promise<Verification> {
  const formData = new FormData();

  formData.append('type', input.type);
  formData.append('file', file);

  return authenticatedApiClient.post<Verification>(
    `${VERIFICATIONS_PATH}/requests`,
    formData,
  );
}