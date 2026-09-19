// -----------------------------------------------------------------------------
// sisiMove — Logout API
// -----------------------------------------------------------------------------
//
// Authentication feature API adapter for authenticated logout.
//
// Responsibilities:
// - Call the backend logout endpoint.
// - Use the authenticated API client so the current access token is attached.
// - Return the backend logout response.
//
// Non-responsibilities:
// - No session storage.
// - No navigation.
// - No sessionPublicId.
// - No access-token parsing.
// - No refresh-token handling.
// - No logout state management.
//
// Backend contract:
//
//     POST /sessions/logout
//
// The backend derives the authenticated session from:
//
//     JWT.sub → identityPublicId
//     JWT.sid → sessionPublicId
//
// Therefore the frontend intentionally sends no session identifier.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '../../http/';
import { AUTHENTICATION_API_PATHS } from '../../constants';

import type { LogoutResponse } from '../models/logout-response';

/**
 * Execute the authenticated user's logout request.
 *
 * The authenticated API client is responsible for attaching the current
 * access token to the HTTP request.
 *
 * The backend revokes the session represented by the authenticated JWT.
 */
export async function logoutUser(): Promise<LogoutResponse> {
  return authenticatedApiClient.post<LogoutResponse>(
    AUTHENTICATION_API_PATHS.LOGOUT,
  );
}
