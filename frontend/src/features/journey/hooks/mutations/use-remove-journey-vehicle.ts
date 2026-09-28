// -----------------------------------------------------------------------------
// sisiMove — Use Remove Journey Vehicle
// -----------------------------------------------------------------------------

"use client";

import { useCallback, useState } from "react";

import { removeJourneyVehicle } from "../../api/vehicle/remove-journey-vehicle";

export interface UseRemoveJourneyVehicleResult {
  readonly remove: (journeyPublicId: string) => Promise<void>;
  readonly isPending: boolean;
  readonly error: Error | null;
}

export function useRemoveJourneyVehicle(): UseRemoveJourneyVehicleResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = useCallback(async (journeyPublicId: string) => {
    setIsPending(true);
    setError(null);

    try {
      await removeJourneyVehicle(journeyPublicId);
    } catch (cause) {
      const nextError =
        cause instanceof Error
          ? cause
          : new Error("Failed to remove the journey vehicle.");

      setError(nextError);
      throw nextError;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { remove, isPending, error };
}