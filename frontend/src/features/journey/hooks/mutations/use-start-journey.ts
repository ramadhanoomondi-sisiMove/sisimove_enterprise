// -----------------------------------------------------------------------------
// sisiMove — Use Start Journey
// -----------------------------------------------------------------------------

"use client";

import { useCallback, useState } from "react";

import {
  startJourney,
  type StartJourneyRequest,
} from "../../api/journeys/start-journey";

export interface UseStartJourneyResult {
  readonly start: (
    journeyPublicId: string,
    request?: StartJourneyRequest,
  ) => Promise<void>;
  readonly isPending: boolean;
  readonly error: Error | null;
}

export function useStartJourney(): UseStartJourneyResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const start = useCallback(
    async (
      journeyPublicId: string,
      request: StartJourneyRequest = {},
    ): Promise<void> => {
      setIsPending(true);
      setError(null);

      try {
        await startJourney(journeyPublicId, request);
      } catch (cause) {
        const nextError =
          cause instanceof Error
            ? cause
            : new Error("Failed to start the journey.");

        setError(nextError);
        throw nextError;
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return {
    start,
    isPending,
    error,
  };
}