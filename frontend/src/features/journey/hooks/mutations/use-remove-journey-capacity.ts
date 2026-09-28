// -----------------------------------------------------------------------------
// sisiMove — Use Remove Journey Capacity
// -----------------------------------------------------------------------------

"use client";

import { useCallback, useState } from "react";

import { removeJourneyCapacity } from "../../api/capacity/remove-journey-capacity";

export interface UseRemoveJourneyCapacityResult {
  readonly remove: (journeyPublicId: string) => Promise<void>;
  readonly isPending: boolean;
  readonly error: Error | null;
}

export function useRemoveJourneyCapacity(): UseRemoveJourneyCapacityResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = useCallback(async (journeyPublicId: string) => {
    setIsPending(true);
    setError(null);

    try {
      await removeJourneyCapacity(journeyPublicId);
    } catch (cause) {
      const nextError =
        cause instanceof Error
          ? cause
          : new Error("Failed to remove the journey capacity.");

      setError(nextError);
      throw nextError;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { remove, isPending, error };
}