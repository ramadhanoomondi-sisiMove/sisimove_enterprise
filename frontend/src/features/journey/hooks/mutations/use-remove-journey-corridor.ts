// -----------------------------------------------------------------------------
// sisiMove — Use Remove Journey Corridor
// -----------------------------------------------------------------------------

"use client";

import { useCallback, useState } from "react";

import { removeJourneyCorridor } from "../../api/corridor/remove-journey-corridor";

export interface UseRemoveJourneyCorridorResult {
  readonly remove: (journeyPublicId: string) => Promise<void>;
  readonly isPending: boolean;
  readonly error: Error | null;
}

export function useRemoveJourneyCorridor(): UseRemoveJourneyCorridorResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = useCallback(async (journeyPublicId: string) => {
    setIsPending(true);
    setError(null);

    try {
      await removeJourneyCorridor(journeyPublicId);
    } catch (cause) {
      const nextError =
        cause instanceof Error
          ? cause
          : new Error("Failed to remove the journey corridor.");

      setError(nextError);
      throw nextError;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { remove, isPending, error };
}