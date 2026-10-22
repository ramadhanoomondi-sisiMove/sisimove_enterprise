
// -----------------------------------------------------------------------------
// sisiMove — Change Password API
// -----------------------------------------------------------------------------
//
// Feature API boundary for:
//
//     PATCH /authentications/:authenticationPublicId/password
//
// The user supplies only the new password.
//
// Authentication identifiers and request authorization come from the
// existing authenticated session and backend authorization flow.
//
// This module does NOT:
// - hash passwords;
// - persist session data;
// - navigate the user;
// - manage form state;
// - perform authorization decisions.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface ChangePasswordRequest {
  readonly password: string;
}

export interface ChangePasswordResponse {
  readonly publicId: string;
  readonly identityPublicId: string;
  readonly status: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const AUTHENTICATIONS_API_PATH = '/authentications';

// -----------------------------------------------------------------------------
// Change Password
// -----------------------------------------------------------------------------

/**
 * Changes the password for the specified Authentication record.
 *
 * The backend hashes the supplied password and generates operational metadata.
 * Authorization and ownership must be enforced by the backend.
 */
export async function changePassword(
  authenticationPublicId: string,
  request: ChangePasswordRequest,
): Promise<ChangePasswordResponse> {
  const normalizedPublicId = authenticationPublicId.trim();

  if (normalizedPublicId.length === 0) {
    throw new Error('An authenticated account is required.');
  }

  return authenticatedApiClient.patch<ChangePasswordResponse>(
    `${AUTHENTICATIONS_API_PATH}/${encodeURIComponent(normalizedPublicId)}/password`,
    request,
  );
}
