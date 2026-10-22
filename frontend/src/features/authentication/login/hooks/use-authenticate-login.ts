// -----------------------------------------------------------------------------
// sisiMove — Authenticate Login Hook
// -----------------------------------------------------------------------------
//
// Feature hook for the complete client-side login operation.
//
// Responsibilities:
// - Execute the login API request.
// - Normalize errors into safe presentation categories.
// - Map the successful response to AuthSession.
// - Delegate session persistence and authentication state to
//   AuthenticationContext.
// - Expose request state, result, and safe error classification.
//
// This hook intentionally does NOT:
// - validate form values;
// - construct device fingerprints or HTTP headers;
// - persist sessions directly;
// - manipulate authentication context state directly;
// - navigate the application;
// - decode JWTs;
// - refresh tokens;
// - perform registration;
// - expose raw backend or transport messages to the presentation layer.
//
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
// Error Categories
// =============================================================================

/**
 * Safe categories consumed by the login presentation layer.
 *
 * These categories must not reveal whether an identity exists or disclose
 * identity lifecycle state, device state, or internal backend details.
 */
export type LoginErrorCategory =
  | 'INVALID_CREDENTIALS'
  | 'NETWORK'
  | 'SERVICE_UNAVAILABLE'
  | 'UNKNOWN';

interface NormalizedLoginError {
  readonly error: Error;
  readonly category: LoginErrorCategory;
}

// =============================================================================
// Error Normalization
// =============================================================================

/**
 * Reads a numeric HTTP status from common HTTP-client error shapes without
 * depending on a particular HTTP client implementation.
 *
 * This function does not inspect backend messages or response bodies.
 */
function getHttpStatus(error: unknown): number | undefined {
  if (
    typeof error !== 'object' ||
    error === null ||
    !('response' in error)
  ) {
    return undefined;
  }

  const response = error.response;

  if (
    typeof response !== 'object' ||
    response === null ||
    !('status' in response)
  ) {
    return undefined;
  }

  return typeof response.status === 'number'
    ? response.status
    : undefined;
}

/**
 * Converts an unknown failure into a safe error and presentation category.
 *
 * Classification rules:
 * - Confirmed 502, 503, and 504 responses indicate temporary service issues.
 * - A TypeError without an HTTP response is treated as a likely network error.
 * - Other HTTP statuses remain UNKNOWN until the API contract defines them.
 * - Unknown errors never expose their original messages.
 *
 * INVALID_CREDENTIALS is intentionally not inferred from HTTP status alone.
 * Map that category only after the backend's generic credential-failure
 * contract has been confirmed.
 */
function normalizeLoginError(
  caughtError: unknown,
): NormalizedLoginError {
  const status = getHttpStatus(caughtError);

  if (
    status === 502 ||
    status === 503 ||
    status === 504
  ) {
    return {
      error: new Error('Login service temporarily unavailable.'),
      category: 'SERVICE_UNAVAILABLE',
    };
  }

  if (status !== undefined) {
    return {
      error: new Error('Unable to sign in.'),
      category: 'UNKNOWN',
    };
  }

  if (caughtError instanceof TypeError) {
    return {
      error: new Error('Connection failed.'),
      category: 'NETWORK',
    };
  }

  return {
    error: new Error('Unable to sign in.'),
    category: 'UNKNOWN',
  };
}

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
   */
  readonly data: AuthenticateLoginResponse | null;

  /**
   * Safe normalized error.
   *
   * The original transport or backend error is not exposed here.
   */
  readonly error: Error | null;

  /**
   * Safe presentation category for LoginError.
   */
  readonly errorCategory: LoginErrorCategory | null;
}

// =============================================================================
// Hook Result
// =============================================================================

export interface UseAuthenticateLoginResult
  extends UseAuthenticateLoginState {
  /**
   * Executes login and establishes the frontend authentication session.
   *
   * The promise rejects with a safe normalized Error when login or session
   * establishment fails.
   */
  readonly login: (
    request: AuthenticateLoginRequest,
  ) => Promise<AuthenticateLoginResponse>;

  /**
   * Clears transient request state.
   *
   * This does not log the user out or modify global authentication state.
   */
  readonly reset: () => void;
}

// =============================================================================
// Response → Session Mapping
// =============================================================================

/**
 * Converts the backend login response into the frontend AuthSession contract.
 *
 * Explicit mapping keeps the session model independent from the HTTP response.
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

  const [errorCategory, setErrorCategory] =
    useState<LoginErrorCategory | null>(null);

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
      setErrorCategory(null);

      try {
        // ---------------------------------------------------------------------
        // HTTP Authentication
        // ---------------------------------------------------------------------

        const response = await authenticateLogin(request);

        // ---------------------------------------------------------------------
        // Establish Frontend Authentication Session
        // ---------------------------------------------------------------------

        const session = toAuthSession(response);

        await authenticate(session);

        // ---------------------------------------------------------------------
        // Store Successful Result
        // ---------------------------------------------------------------------

        setData(response);

        return response;
      } catch (caughtError: unknown) {
        // ---------------------------------------------------------------------
        // Normalize Failure
        // ---------------------------------------------------------------------

        const normalized = normalizeLoginError(caughtError);

        setError(normalized.error);
        setErrorCategory(normalized.category);

        // Preserve rejected-promise semantics for the caller.
        throw normalized.error;
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
    setErrorCategory(null);
  }, []);

  // ---------------------------------------------------------------------------
  // Result
  // ---------------------------------------------------------------------------

  return {
    isLoading,
    data,
    error,
    errorCategory,
    login,
    reset,
  };
}
