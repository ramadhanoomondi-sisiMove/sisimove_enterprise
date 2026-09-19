// -----------------------------------------------------------------------------
// sisiMove — Use Logout
// -----------------------------------------------------------------------------
//
// React hook for the authenticated user's logout action.
//
// Responsibilities:
// - Execute the backend logout request.
// - Remove the locally persisted authentication session after successful
//   server-side logout.
// - Expose logout loading and error state to presentation components.
// - Keep logout orchestration out of UI components.
//
// Non-responsibilities:
// - No direct HTTP implementation.
// - No access-token parsing.
// - No refresh-token manipulation.
// - No session ID construction.
// - No localStorage access.
// - No navigation implementation.
// - No authentication business rules.
//
// Logout flow:
//
//     UI
//      │
//      ▼
// useLogout()
//      │
//      ├── logoutUser()
//      │       │
//      │       └── POST /sessions/logout
//      │
//      └── authSessionStorage.remove()
//
// Backend derives the current session from the authenticated JWT.
// The frontend therefore does NOT send a sessionPublicId.
//
// -----------------------------------------------------------------------------

'use client';

import { useCallback, useState } from 'react';

import { logoutUser } from '../api';
import { authSessionStorage } from '../../session/storage';
import type { LogoutResponse } from '../models/logout-response';

/**
 * Public state and actions exposed by the logout hook.
 */
export interface UseLogoutResult {
  /**
   * Execute the authenticated user's logout flow.
   */
  readonly logout: () => Promise<LogoutResponse>;

  /**
   * Indicates that the logout request is currently in progress.
   */
  readonly isLoggingOut: boolean;

  /**
   * Most recent logout error, or null when no error has occurred.
   */
  readonly error: unknown;
}

/**
 * Manage the authenticated user's logout lifecycle.
 *
 * Server-side session revocation happens first.
 *
 * The local AuthSession is removed only after the backend logout request
 * succeeds. This prevents the client from presenting logout as successful
 * when the server-side session revocation failed.
 */
export function useLogout(): UseLogoutResult {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const logout = useCallback(async (): Promise<LogoutResponse> => {
    setIsLoggingOut(true);
    setError(null);

    try {
      /**
       * Revoke the current backend session.
       *
       * The API adapter intentionally receives no sessionPublicId because
       * the backend derives the current session from the authenticated JWT.
       */
      const response = await logoutUser();

      /**
       * Remove the locally persisted AuthSession only after the backend
       * confirms successful logout.
       */
      await authSessionStorage.remove();

      return response;
    } catch (caughtError) {
      setError(caughtError);
      throw caughtError;
    } finally {
      setIsLoggingOut(false);
    }
  }, []);

  return {
    logout,
    isLoggingOut,
    error,
  };
}