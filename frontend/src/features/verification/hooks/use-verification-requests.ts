// -----------------------------------------------------------------------------
// sisiMove — useVerificationRequests
// -----------------------------------------------------------------------------
//
// React hook for retrieving Verification Requests belonging to a Verification
// aggregate.
//
// Responsibilities:
// - load Verification Requests;
// - expose loading/error state;
// - expose reload capability.
//
// Non-responsibilities:
// - authentication/session management;
// - authorization;
// - Verification Request lifecycle rules;
// - HTTP transport;
// - submission or cancellation of requests.
//
// Those responsibilities remain inside their respective feature boundaries.
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
  getVerificationRequests,
} from '../api';

// -----------------------------------------------------------------------------
// Verification — Models
// -----------------------------------------------------------------------------

import type { VerificationRequest } from '../models';

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

  return new Error('Unable to load verification requests.');
}

// =============================================================================
// Hook Result
// =============================================================================

export interface UseVerificationRequestsResult {
  requests: readonly VerificationRequest[];
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Retrieve Verification Requests belonging to a Verification aggregate.
 *
 * Backend route:
 *
 *     GET /verifications/:verificationPublicId/requests
 *
 * Pass null when no Verification aggregate is currently selected.
 */
export function useVerificationRequests(
  verificationPublicId: string | null,
): UseVerificationRequestsResult {
  // ===========================================================================
  // State
  // ===========================================================================

  const [requests, setRequests] = useState<
    readonly VerificationRequest[]
  >([]);

  const [isLoading, setIsLoading] = useState(
    verificationPublicId !== null,
  );

  const [error, setError] = useState<Error | null>(null);

  // ===========================================================================
  // Load Requests
  // ===========================================================================

  const loadRequests = useCallback(async () => {
    if (verificationPublicId === null) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getVerificationRequests(
        verificationPublicId,
      );

      setRequests(result);
    } catch (cause) {
      setError(normalizeError(cause));
    } finally {
      setIsLoading(false);
    }
  }, [verificationPublicId]);

  // ===========================================================================
  // Initial / Identifier Change Load
  // ===========================================================================

  useEffect(() => {
    if (verificationPublicId === null) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getVerificationRequests(
          verificationPublicId,
        );

        if (cancelled) {
          return;
        }

        setRequests(result);
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
  }, [verificationPublicId]);

  // ===========================================================================
  // Result
  // ===========================================================================

  return {
    requests,
    isLoading,
    error,
    reload: loadRequests,
  };
}