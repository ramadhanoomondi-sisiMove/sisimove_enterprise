 // -----------------------------------------------------------------------------
 // sisiMove — Submit Verification Request Hook
 // -----------------------------------------------------------------------------
 //
 // Client-side application hook for submitting a verification request.
 //
 // Responsibilities:
 // - Submit a verification request with its verification type and file.
 // - Expose submission/loading state.
 // - Expose the submitted verification result.
 // - Normalize transport/application errors for UI consumption.
 //
 // Non-responsibilities:
 // - File validation rules owned by the backend.
 // - Asset creation/upload orchestration.
 // - Verification business rules.
 // - HTTP transport.
 //
 // -----------------------------------------------------------------------------

'use client';

import { useCallback, useState } from 'react';
import { submitVerificationRequest } from '../api';
import type { Verification, VerificationRequestType } from '../models';
import type { SubmitVerificationRequestInput } from '../schemas';

function normalizeError(cause: unknown): Error {
  if (cause instanceof Error) return cause;
  if (typeof cause === 'string') return new Error(cause);
  return new Error('Unable to submit verification request.');
}

export interface UseSubmitVerificationRequestResult {
  verification: Verification | null;
  isSubmitting: boolean;
  error: Error | null;
  submit: (
    input: SubmitVerificationRequestInput,
    file: File,
  ) => Promise<Verification>;
  reset: () => void;
}

export function useSubmitVerificationRequest(): UseSubmitVerificationRequestResult {
  const [verification, setVerification] =
    useState<Verification | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = useCallback(
    async (
      input: SubmitVerificationRequestInput,
      file: File,
    ): Promise<Verification> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const result = await submitVerificationRequest(input, file);

        setVerification(result);

        return result;
      } catch (cause) {
        const normalizedError = normalizeError(cause);

        setError(normalizedError);

        throw normalizedError;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setVerification(null);
    setError(null);
  }, []);

  return {
    verification,
    isSubmitting,
    error,
    submit,
    reset,
  };
}