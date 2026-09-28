// -----------------------------------------------------------------------------
// sisiMove — Use Publish Journey
// -----------------------------------------------------------------------------
//
// Publishes a Journey through the Journey aggregate.
//
// The backend owns publication invariants. The frontend only submits the
// command and exposes mutation state.
//
// The endpoint returns void, so successful state should be obtained by
// refetching the authoritative MyJourney projection.
//
// -----------------------------------------------------------------------------

"use client";

import { useCallback, useState } from "react";

import {
  publishJourney,
  type PublishJourneyRequest,
} from "../../api/journeys/publish-journey";

export interface UsePublishJourneyResult {
  readonly publish: (
    journeyPublicId: string,
    request?: PublishJourneyRequest,
  ) => Promise<void>;
  readonly isPending: boolean;
  readonly error: Error | null;
}

export function usePublishJourney(): UsePublishJourneyResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const publish = useCallback(
    async (
      journeyPublicId: string,
      request: PublishJourneyRequest = {},
    ): Promise<void> => {
      setIsPending(true);
      setError(null);

      try {
        await publishJourney(journeyPublicId, request);
      } catch (cause) {
        const nextError =
          cause instanceof Error
            ? cause
            : new Error("Failed to publish the journey.");

        setError(nextError);
        throw nextError;
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return {
    publish,
    isPending,
    error,
  };
}