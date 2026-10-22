
'use client';

// -----------------------------------------------------------------------------
// sisiMove — Change Password Hook
// -----------------------------------------------------------------------------
//
// Feature hook for the authenticated password-change operation.
//
// Responsibilities:
// - Execute the password-change API request.
// - Read authenticationPublicId from the authenticated session.
// - Normalize failures into safe presentation categories.
// - Expose loading, success, and error state.
// - Preserve rejected-promise semantics for the caller.
//
// This hook does NOT:
// - validate form values;
// - hash passwords;
// - persist session data;
// - authorize the operation;
// - expose raw backend errors;
// - navigate the application.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

// -----------------------------------------------------------------------------
// Authentication — API
// -----------------------------------------------------------------------------

import { changePassword } from '../api';

// -----------------------------------------------------------------------------
// Authentication — Session
// -----------------------------------------------------------------------------

import { authSessionStorage } from '../../session';

// =============================================================================
// Error Categories
// =============================================================================

export type ChangePasswordErrorCategory =
  | 'AUTHENTICATION_REQUIRED'
  | 'NETWORK'
  | 'SERVICE_UNAVAILABLE'
  | 'FORBIDDEN'
  | 'UNKNOWN';

interface NormalizedChangePasswordError {
  readonly error: Error;
  readonly category: ChangePasswordErrorCategory;
}

// =============================================================================
// Error Normalization
// =============================================================================

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

function normalizeChangePasswordError(
  caughtError: unknown,
): NormalizedChangePasswordError {
  if (
    typeof caughtError === 'object' &&
    caughtError !== null &&
    'code' in caughtError &&
    caughtError.code === 'AUTHENTICATION_REQUIRED'
  ) {
    return {
      error: new Error('Please sign in to change your password.'),
      category: 'AUTHENTICATION_REQUIRED',
    };
  }

  const status = getHttpStatus(caughtError);

  if (status === 401) {
    return {
      error: new Error('Your session has expired. Please sign in again.'),
      category: 'AUTHENTICATION_REQUIRED',
    };
  }

  if (status === 403) {
    return {
      error: new Error('You are not authorized to change this password.'),
      category: 'FORBIDDEN',
    };
  }

  if (
    status === 502 ||
    status === 503 ||
    status === 504
  ) {
    return {
      error: new Error(
        'The password service is temporarily unavailable.',
      ),
      category: 'SERVICE_UNAVAILABLE',
    };
  }

  if (status !== undefined) {
    return {
      error: new Error('Unable to change your password. Please try again.'),
      category: 'UNKNOWN',
    };
  }

  if (caughtError instanceof TypeError) {
    return {
      error: new Error('Connection failed. Check your internet connection.'),
      category: 'NETWORK',
    };
  }

  return {
    error: new Error('Unable to change your password. Please try again.'),
    category: 'UNKNOWN',
  };
}

// =============================================================================
// Hook State
// =============================================================================

export interface UseChangePasswordState {
  readonly isLoading: boolean;
  readonly isSuccess: boolean;
  readonly error: Error | null;
  readonly errorCategory: ChangePasswordErrorCategory | null;
}

// =============================================================================
// Hook Result
// =============================================================================

export interface UseChangePasswordResult
  extends UseChangePasswordState {
  readonly changePassword: (password: string) => Promise<void>;
  readonly reset: () => void;
}

// =============================================================================
// Hook
// =============================================================================

export function useChangePassword(): UseChangePasswordResult {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [errorCategory, setErrorCategory] =
    useState<ChangePasswordErrorCategory | null>(null);

  const changePasswordRequest = useCallback(
    async (password: string): Promise<void> => {
      setIsLoading(true);
      setIsSuccess(false);
      setError(null);
      setErrorCategory(null);

      try {
        // ---------------------------------------------------------------------
        // Resolve the existing authenticated session.
        // ---------------------------------------------------------------------

        const session = await authSessionStorage.get();

        if (session === null) {
          throw Object.assign(
            new Error('Authentication is required.'),
            { code: 'AUTHENTICATION_REQUIRED' },
          );
        }

        // ---------------------------------------------------------------------
        // Execute the protected API request.
        // ---------------------------------------------------------------------

        await changePassword(session.authenticationPublicId, { password });

        setIsSuccess(true);
      } catch (caughtError: unknown) {
        const normalized =
          normalizeChangePasswordError(caughtError);

        setError(normalized.error);
        setErrorCategory(normalized.category);

        throw normalized.error;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setIsSuccess(false);
    setError(null);
    setErrorCategory(null);
  }, []);

  return {
    isLoading,
    isSuccess,
    error,
    errorCategory,
    changePassword: changePasswordRequest,
    reset,
  };
}
