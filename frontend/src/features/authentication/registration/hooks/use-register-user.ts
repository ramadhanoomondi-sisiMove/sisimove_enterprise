// -----------------------------------------------------------------------------
// sisiMove — Register User Hook
// -----------------------------------------------------------------------------
//
// React hook for executing the user-registration API operation.
//
// Flow:
//
//     RegisterForm
//          │
//          ▼
//     useRegisterUser()
//          │
//          ▼
//     registerUser()
//          │
//          ▼
//     ApiClient
//          │
//          ▼
//     POST /authentications/register
//
// This hook owns the client-side execution state of the registration request.
//
// It does NOT own:
//
// - form validation;
// - password confirmation;
// - request DTO construction beyond accepting the API request model;
// - password hashing;
// - Identity creation;
// - TravellerProfile creation;
// - TrustProfile creation;
// - Verification;
// - Authentication creation;
// - Session creation;
// - token storage;
// - authentication state;
// - navigation.
//
// Registration is intentionally not authentication.
//
// A successful registration returns:
//
//     {
//       status: 'REGISTERED',
//       identityPublicId: string,
//       travellerHandle: string,
//       next: 'LOGIN'
//     }
//
// The consuming registration page/form decides how to present that result and
// navigate the user to login.
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import {
  useCallback,
  useState,
} from 'react';

// -----------------------------------------------------------------------------
// Registration — API
// -----------------------------------------------------------------------------

import {
  registerUser,
} from '../api';

// -----------------------------------------------------------------------------
// Registration — Models
// -----------------------------------------------------------------------------

import type {
  RegisterUserRequest,
  RegisterUserResponse,
} from '../models';

// =============================================================================
// Hook State
// =============================================================================

export interface UseRegisterUserState {
  /**
   * Indicates whether a registration request is currently being submitted.
   */
  readonly isLoading: boolean;

  /**
   * Successful registration result.
   *
   * Reset when a subsequent registration attempt begins.
   */
  readonly data: RegisterUserResponse | null;

  /**
   * Error produced by the registration request.
   *
   * Reset when a subsequent registration attempt begins.
   */
  readonly error: Error | null;
}

// =============================================================================
// Hook Result
// =============================================================================

export interface UseRegisterUserResult
  extends UseRegisterUserState {
  /**
   * Executes the registration request.
   *
   * The request must already conform to RegisterUserRequest.
   *
   * Form-only fields such as `confirmPassword` must be removed before calling
   * this function.
   */
  readonly register: (
    request: RegisterUserRequest,
  ) => Promise<RegisterUserResponse>;

  /**
   * Clears the current registration error and successful result.
   *
   * This does not perform another API request.
   */
  readonly reset: () => void;
}

// =============================================================================
// Hook
// =============================================================================

export function useRegisterUser(): UseRegisterUserResult {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState<RegisterUserResponse | null>(null);

  const [error, setError] = useState<Error | null>(null);

  // ---------------------------------------------------------------------------
  // Register
  // ---------------------------------------------------------------------------
  //
  // A new request clears the previous result/error before execution.
  //
  // The error is retained in hook state and also re-thrown so the consuming
  // form can perform request-specific behavior when required.
  //
  // ---------------------------------------------------------------------------

  const register = useCallback(
    async (
      request: RegisterUserRequest,
    ): Promise<RegisterUserResponse> => {
      setIsLoading(true);
      setData(null);
      setError(null);

      try {
        const response = await registerUser(request);

        setData(response);

        return response;
      } catch (caughtError) {
        const error =
          caughtError instanceof Error
            ? caughtError
            : new Error('Unable to register your account.');

        setError(error);

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [],
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
    register,
    reset,
  };
}