// -----------------------------------------------------------------------------
// sisiMove — Use Cancel Journey
// -----------------------------------------------------------------------------
//
// Cancels a Journey through the Journey aggregate.
//
// A cancellation reason is required by the backend command contract.
//
// -----------------------------------------------------------------------------

"use client";

import { useCallback, useState } from "react";

import {
  cancelJourney,
  type CancelJourneyRequest,
} from "../../api/journeys/cancel-journey";

export interface UseCancelJourneyResult {
  readonly cancel: (
    journeyPublicId: string,
    request: CancelJourneyRequest,
  ) => Promise<void>;
  readonly isPending: boolean;
  readonly error: Error | null;
}

export function useCancelJourney(): UseCancelJourneyResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cancel = useCallback(
    async (
      journeyPublicId: string,
      request: CancelJourneyRequest,
    ): Promise<void> => {
      setIsPending(true);
      setError(null);

      try {
        await cancelJourney(journeyPublicId, request);
      } catch (cause) {
        const nextError =
          cause instanceof Error
            ? cause
            : new Error("Failed to cancel the journey.");

        setError(nextError);
        throw nextError;
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return {
    cancel,
    isPending,
    error,
  };
}