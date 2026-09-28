// -----------------------------------------------------------------------------
// sisiMove — Use Attach Journey Corridor
// -----------------------------------------------------------------------------

"use client";

import { useCallback, useState } from "react";

import {
  attachJourneyCorridor,
  type AttachJourneyCorridorRequest,
} from "../../api/corridor/attach-journey-corridor";

export interface UseAttachJourneyCorridorResult {
  readonly attach: (
    journeyPublicId: string,
    request: AttachJourneyCorridorRequest,
  ) => Promise<void>;
  readonly isPending: boolean;
  readonly error: Error | null;
}

export function useAttachJourneyCorridor(): UseAttachJourneyCorridorResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const attach = useCallback(
    async (
      journeyPublicId: string,
      request: AttachJourneyCorridorRequest,
    ): Promise<void> => {
      setIsPending(true);
      setError(null);

      try {
        await attachJourneyCorridor(journeyPublicId, request);
      } catch (cause) {
        const nextError =
          cause instanceof Error
            ? cause
            : new Error("Failed to attach the journey corridor.");

        setError(nextError);
        throw nextError;
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { attach, isPending, error };
}