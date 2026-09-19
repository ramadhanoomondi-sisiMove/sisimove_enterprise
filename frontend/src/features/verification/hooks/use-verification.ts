// -----------------------------------------------------------------------------
// sisiMove — useVerification
// -----------------------------------------------------------------------------
//
// React hook for retrieving and creating a Verification aggregate.
//
// Responsibilities:
// - load the current authenticated identity's Verification;
// - load a Verification by public ID when explicitly requested;
// - expose loading/error state;
// - expose reload capability;
// - start Verification for the authenticated identity.
//
// Non-responsibilities:
// - authentication/session management;
// - verification business rules;
// - authorization;
// - HTTP transport;
// - file upload;
// - Verification Request lifecycle.
//
// Those responsibilities remain inside their respective feature boundaries.
//
// -----------------------------------------------------------------------------
//
// Verification read boundaries:
//
// Current authenticated identity:
//
//     GET /verifications/me
//          ↓
//     getMyVerification()
//
// Explicit Verification resource:
//
//     GET /verifications/:verificationPublicId
//          ↓
//     getVerification(verificationPublicId)
//
// Registration creates a Verification aggregate, so `null` does NOT mean that
// the authenticated identity has no Verification. A current-user lookup should
// therefore use GET /verifications/me.
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

// -----------------------------------------------------------------------------
// Verification — API
// -----------------------------------------------------------------------------

import {
  createVerification,
  getMyVerification,
  getVerification,
} from '../api';

// -----------------------------------------------------------------------------
// Verification — Models
// -----------------------------------------------------------------------------

import type { Verification } from '../models';

// =============================================================================
// Error Normalization
// =============================================================================

function normalizeError(cause: unknown): Error {
  if (cause instanceof Error) {
    return cause;
  }

  if (typeof cause === 'string') {
    return new Error(cause);
  }

  return new Error('Unable to load verification.');
}

// =============================================================================
// Hook Options
// =============================================================================

export interface UseVerificationOptions {
  /**
   * Explicit Verification public ID.
   *
   * When supplied, the hook loads that Verification through:
   *
   *     GET /verifications/:verificationPublicId
   *
   * When omitted, the hook loads the Verification belonging to the currently
   * authenticated identity through:
   *
   *     GET /verifications/me
   *
   * The current-user mode is the default because normal registration creates
   * the Verification aggregate.
   */
  verificationPublicId?: string | null;
}

// =============================================================================
// Hook Result
// =============================================================================

export interface UseVerificationResult {
  verification: Verification | null;
  isLoading: boolean;
  isCreating: boolean;
  error: Error | null;
  reload: () => Promise<void>;
  startVerification: () => Promise<Verification>;
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Retrieve and manage a Verification aggregate.
 *
 * Default behavior:
 *
 *     useVerification()
 *          ↓
 *     GET /verifications/me
 *
 * Explicit resource behavior:
 *
 *     useVerification({
 *       verificationPublicId,
 *     })
 *          ↓
 *     GET /verifications/:verificationPublicId
 *
 * The hook does not determine verification ownership or authorization.
 * Those responsibilities remain with the backend.
 */
export function useVerification(
  options: UseVerificationOptions = {},
): UseVerificationResult {
  // =========================================================================== 
  // Options
  // ===========================================================================

  const {
    verificationPublicId = null,
  } = options;

  const hasExplicitVerification =
    verificationPublicId !== null;

  // =========================================================================== 
  // State
  // ===========================================================================

  const [verification, setVerification] =
    useState<Verification | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isCreating, setIsCreating] = useState(false);

  const [error, setError] = useState<Error | null>(null);

  // =========================================================================== 
  // Load Verification
  // ===========================================================================

  const loadVerification = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = hasExplicitVerification
        ? await getVerification(verificationPublicId)
        : await getMyVerification();

      setVerification(result);
    } catch (cause) {
      setError(normalizeError(cause));
    } finally {
      setIsLoading(false);
    }
  }, [hasExplicitVerification, verificationPublicId]);

  // =========================================================================== 
  // Initial / Identifier Change Load
  // ===========================================================================

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = hasExplicitVerification
          ? await getVerification(verificationPublicId)
          : await getMyVerification();

        if (cancelled) {
          return;
        }

        setVerification(result);
      } catch (cause) {
        if (cancelled) {
          return;
        }

        setError(normalizeError(cause));
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [hasExplicitVerification, verificationPublicId]);

  // =========================================================================== 
  // Start Verification
  // ===========================================================================

  const startVerification = useCallback(async (): Promise<Verification> => {
    setIsCreating(true);
    setError(null);

    try {
      const result = await createVerification();

      setVerification(result);

      return result;
    } catch (cause) {
      const normalizedError = normalizeError(cause);

      setError(normalizedError);

      throw normalizedError;
    } finally {
      setIsCreating(false);
    }
  }, []);

  // =========================================================================== 
  // Result
  // ===========================================================================

  return {
    verification,
    isLoading,
    isCreating,
    error,
    reload: loadVerification,
    startVerification,
  };
}