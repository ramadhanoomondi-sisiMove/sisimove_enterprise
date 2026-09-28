// -----------------------------------------------------------------------------
// sisiMove — Use Complete Journey
// -----------------------------------------------------------------------------
//
// Requests Journey completion through the Journey aggregate.
//
// The backend owns the completion transition and its invariants.
// The frontend does not locally mark the Journey as completed.
//
// -----------------------------------------------------------------------------

"use client";

import { useCallback, useState } from "react";

import {
  completeJourney,
  type CompleteJourneyRequest,
} from "../../api/journeys/complete-journey";

export interface UseCompleteJourneyResult {
  readonly complete: (
    journeyPublicId: string,
    request?: CompleteJourneyRequest,
  ) => Promise<void>;
  readonly isPending: boolean;
  readonly error: Error | null;
}

export function useCompleteJourney(): UseCompleteJourneyResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const complete = useCallback(
    async (
      journeyPublicId: string,
      request: CompleteJourneyRequest = {},
    ): Promise<void> => {
      setIsPending(true);
      setError(null);

      try {
        await completeJourney(journeyPublicId, request);
      } catch (cause) {
        const nextError =
          cause instanceof Error
            ? cause
            : new Error("Failed to complete the journey.");

        setError(nextError);
        throw nextError;
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return {
    complete,
    isPending,
    error,
  };
}