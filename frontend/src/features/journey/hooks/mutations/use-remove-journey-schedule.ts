// -----------------------------------------------------------------------------
// sisiMove — Use Remove Journey Schedule
// -----------------------------------------------------------------------------

"use client";

import { useCallback, useState } from "react";

import { removeJourneySchedule } from "../../api/schedule/remove-journey-schedule";

export interface UseRemoveJourneyScheduleResult {
  readonly remove: (journeyPublicId: string) => Promise<void>;
  readonly isPending: boolean;
  readonly error: Error | null;
}

export function useRemoveJourneySchedule(): UseRemoveJourneyScheduleResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = useCallback(async (journeyPublicId: string) => {
    setIsPending(true);
    setError(null);

    try {
      await removeJourneySchedule(journeyPublicId);
    } catch (cause) {
      const nextError =
        cause instanceof Error
          ? cause
          : new Error("Failed to remove the journey schedule.");

      setError(nextError);
      throw nextError;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { remove, isPending, error };
}