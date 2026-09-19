// -----------------------------------------------------------------------------
// sisiMove — Verification Request Hook
// -----------------------------------------------------------------------------
//
// Client-side application hook for loading one verification request.
//
// Responsibilities:
// - Load a verification request by its parent verification public ID.
// - Expose loading and error state.
// - Support explicit reloads.
// - Prevent stale asynchronous responses from updating state.
//
// Non-responsibilities:
// - HTTP transport.
// - Authentication.
// - Request submission.
// - Request cancellation.
// - Verification business rules.
//
// -----------------------------------------------------------------------------

'use client';

import { useCallback, useEffect, useState } from 'react';
import { getVerificationRequest } from '../api';
import type { VerificationRequest } from '../models';

function normalizeError(cause: unknown): Error {
  if (cause instanceof Error) return cause;
  if (typeof cause === 'string') return new Error(cause);
  return new Error('Unable to load verification request.');
}

export interface UseVerificationRequestResult {
  request: VerificationRequest | null;
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

export function useVerificationRequest(
  verificationPublicId: string | null,
  verificationRequestPublicId: string | null,
): UseVerificationRequestResult {
  const [request, setRequest] = useState<VerificationRequest | null>(null);
  const [isLoading, setIsLoading] = useState(
    verificationPublicId !== null &&
      verificationRequestPublicId !== null,
  );
  const [error, setError] = useState<Error | null>(null);

  const loadRequest = useCallback(async () => {
    if (
      verificationPublicId === null ||
      verificationRequestPublicId === null
    ) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getVerificationRequest(
        verificationPublicId,
        verificationRequestPublicId,
      );

      setRequest(result);
    } catch (cause) {
      setError(normalizeError(cause));
    } finally {
      setIsLoading(false);
    }
  }, [verificationPublicId, verificationRequestPublicId]);

  useEffect(() => {
    if (
      verificationPublicId === null ||
      verificationRequestPublicId === null
    ) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getVerificationRequest(
          verificationPublicId,
          verificationRequestPublicId,
        );

        if (cancelled) return;

        setRequest(result);
      } catch (cause) {
        if (cancelled) return;

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
  }, [verificationPublicId, verificationRequestPublicId]);

  return {
    request,
    isLoading,
    error,
    reload: loadRequest,
  };
}