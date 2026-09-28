// -----------------------------------------------------------------------------
// sisiMove — Use Expire Journey
// -----------------------------------------------------------------------------

"use client";

import { useCallback, useState } from "react";

import {
  expireJourney,
  type ExpireJourneyRequest,
} from "../../api/journeys/expire-journey";

export interface UseExpireJourneyResult {
  readonly expire: (
    journeyPublicId: string,
    request?: ExpireJourneyRequest,
  ) => Promise<void>;
  readonly isPending: boolean;
  readonly error: Error | null;
}

export function useExpireJourney(): UseExpireJourneyResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const expire = useCallback(
    async (
      journeyPublicId: string,
      request: ExpireJourneyRequest = {},
    ): Promise<void> => {
      setIsPending(true);
      setError(null);

      try {
        await expireJourney(journeyPublicId, request);
      } catch (cause) {
        const nextError =
          cause instanceof Error
            ? cause
            : new Error("Failed to expire the journey.");

        setError(nextError);
        throw nextError;
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return {
    expire,
    isPending,
    error,
  };
}