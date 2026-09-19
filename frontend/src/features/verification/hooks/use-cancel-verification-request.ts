// -----------------------------------------------------------------------------
// sisiMove — Cancel Verification Request Hook
// -----------------------------------------------------------------------------
//
// Client-side application hook for cancelling a verification request.
//
// Responsibilities:
// - Cancel a verification request through the verification API.
// - Expose cancellation/loading state.
// - Expose the updated verification request.
// - Normalize transport/application errors for UI consumption.
//
// Non-responsibilities:
// - HTTP transport.
// - Authentication.
// - Verification business rules.
// - Request eligibility decisions.
//
// -----------------------------------------------------------------------------

'use client';

import { useCallback, useState } from 'react';
import { cancelVerificationRequest } from '../api';
import type { VerificationRequest } from '../models';

function normalizeError(cause: unknown): Error {
  if (cause instanceof Error) return cause;
  if (typeof cause === 'string') return new Error(cause);
  return new Error('Unable to cancel verification request.');
}

export interface UseCancelVerificationRequestResult {
  request: VerificationRequest | null;
  isCancelling: boolean;
  error: Error | null;
  cancel: (
    verificationPublicId: string,
    verificationRequestPublicId: string,
  ) => Promise<VerificationRequest>;
  reset: () => void;
}

export function useCancelVerificationRequest(): UseCancelVerificationRequestResult {
  const [request, setRequest] =
    useState<VerificationRequest | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cancel = useCallback(
    async (
      verificationPublicId: string,
      verificationRequestPublicId: string,
    ): Promise<VerificationRequest> => {
      setIsCancelling(true);
      setError(null);

      try {
        const result = await cancelVerificationRequest(
          verificationPublicId,
          verificationRequestPublicId,
        );

        setRequest(result);

        return result;
      } catch (cause) {
        const normalizedError = normalizeError(cause);

        setError(normalizedError);

        throw normalizedError;
      } finally {
        setIsCancelling(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setRequest(null);
    setError(null);
  }, []);

  return {
    request,
    isCancelling,
    error,
    cancel,
    reset,
  };
}