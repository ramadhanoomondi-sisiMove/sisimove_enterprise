// -----------------------------------------------------------------------------
// sisiMove — Authenticate Login Hook
// -----------------------------------------------------------------------------
//
// Feature hook for the complete client-side login operation.
//
// Responsibilities:
//
//     Login Form
//         │
//         ▼
//     useAuthenticateLogin()
//         │
//         ├── authenticateLogin()
//         │       └── HTTP API
//         │
//         ├── map successful response → AuthSession
//         │
//         └── AuthenticationContext.authenticate()
//                 ├── persist session
//                 └── update authentication state
//
// This hook intentionally does NOT:
//
// - validate form values;
// - construct device fingerprints;
// - construct HTTP headers;
// - persist directly to localStorage;
// - manipulate AuthenticationContext state directly;
// - navigate the application;
// - decode JWTs;
// - refresh tokens;
// - perform registration.
//
// Those responsibilities belong to the appropriate feature boundaries.
//
// -----------------------------------------------------------------------------
// Client Component
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

// -----------------------------------------------------------------------------
// Authentication — API
// -----------------------------------------------------------------------------

import { authenticateLogin } from '../api';

// -----------------------------------------------------------------------------
// Authentication — Models
// -----------------------------------------------------------------------------

import type {
  AuthenticateLoginRequest,
  AuthenticateLoginResponse,
} from '../models';

// -----------------------------------------------------------------------------
// Authentication — Session
// -----------------------------------------------------------------------------

import type { AuthSession } from '../../session';

// -----------------------------------------------------------------------------
// Authentication — State
// -----------------------------------------------------------------------------

import { useAuthentication } from '../../state';

// =============================================================================
// Hook State
// =============================================================================

export interface UseAuthenticateLoginState {
  /**
   * Indicates whether the login operation is currently executing.
   */
  readonly isLoading: boolean;

  /**
   * Successful backend login response.
   *
   * This remains available after authentication state has been established
   * and allows the caller to access the backend login result when required.
   */
  readonly data: AuthenticateLoginResponse | null;

  /**
   * Normalized login error.
   */
  readonly error: Error | null;
}

// =============================================================================
// Hook Result
// =============================================================================

export interface UseAuthenticateLoginResult
  extends UseAuthenticateLoginState {
  /**
   * Executes the login operation.
   *
   * On success:
   *
   * 1. The backend response is converted to AuthSession.
   * 2. AuthenticationContext.authenticate() persists the session.
   * 3. AuthenticationContext transitions to AUTHENTICATED.
   *
   * The successful backend response is returned to the caller.
   */
  readonly login: (
    request: AuthenticateLoginRequest,
  ) => Promise<AuthenticateLoginResponse>;

  /**
   * Clears the hook's transient request state.
   *
   * This does not log the user out and does not modify the global
   * authentication state.
   */
  readonly reset: () => void;
}

// =============================================================================
// Response → Session Mapping
// =============================================================================

/**
 * Converts the backend login response into the frontend authentication
 * session contract.
 *
 * The mapping is intentionally explicit rather than spreading the response.
 * This keeps the AuthSession contract independent from the HTTP response
 * representation.
 */
function toAuthSession(
  response: AuthenticateLoginResponse,
): AuthSession {
  if (!response) {
    throw new Error('Authentication login response is required.');
  }

  return {
    identityPublicId: response.identityPublicId,
    authenticationPublicId: response.authenticationPublicId,
    devicePublicId: response.devicePublicId,
    sessionPublicId: response.sessionPublicId,
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
  };
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Provides the client-side login workflow.
 *
 * Authentication state and session persistence are delegated to the existing
 * AuthenticationContext rather than being reimplemented here.
 */
export function useAuthenticateLogin(): UseAuthenticateLoginResult {
  // ---------------------------------------------------------------------------
  // Authentication State Boundary
  // ---------------------------------------------------------------------------

  const { authenticate } = useAuthentication();

  // ---------------------------------------------------------------------------
  // Request State
  // ---------------------------------------------------------------------------

  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] =
    useState<AuthenticateLoginResponse | null>(null);

  const [error, setError] = useState<Error | null>(null);

  // ---------------------------------------------------------------------------
  // Login
  // ---------------------------------------------------------------------------

  const login = useCallback(
    async (
      request: AuthenticateLoginRequest,
    ): Promise<AuthenticateLoginResponse> => {
      setIsLoading(true);
      setData(null);
      setError(null);

      try {
        // ---------------------------------------------------------------------
        // HTTP Authentication
        // ---------------------------------------------------------------------
        //
        // The API boundary adds the required device headers. The hook only
        // supplies the user credential request.
        //
        // ---------------------------------------------------------------------

        const response = await authenticateLogin(request);

        // ---------------------------------------------------------------------
        // Establish Frontend Authentication Session
        // ---------------------------------------------------------------------
        //
        // AuthenticationContext owns:
        //
        // - session persistence;
        // - authenticated state;
        // - subsequent consumers of authentication state.
        //
        // ---------------------------------------------------------------------

        const session = toAuthSession(response);

        await authenticate(session);

        // ---------------------------------------------------------------------
        // Store Successful Request Result
        // ---------------------------------------------------------------------

        setData(response);

        return response;
      } catch (caughtError: unknown) {
        // ---------------------------------------------------------------------
        // Normalize Unknown Errors
        // ---------------------------------------------------------------------

        const normalizedError =
          caughtError instanceof Error
            ? caughtError
            : new Error('Unable to sign in.');

        setError(normalizedError);

        // ---------------------------------------------------------------------
        // Preserve Failure Semantics
        // ---------------------------------------------------------------------
        //
        // The caller may use the rejected promise for form-level handling,
        // while the hook also exposes the error through its state.
        //
        // ---------------------------------------------------------------------

        throw normalizedError;
      } finally {
        setIsLoading(false);
      }
    },
    [authenticate],
  );

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------

  const reset = useCallback(() => {
    setIsLoading(false);
    setData(null);
    setError(null);
  }, []);

  // ---------------------------------------------------------------------------
  // Result
  // ---------------------------------------------------------------------------

  return {
    isLoading,
    data,
    error,
    login,
    reset,
  };
}

