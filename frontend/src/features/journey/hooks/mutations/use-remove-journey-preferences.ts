// -----------------------------------------------------------------------------
// sisiMove — Use Remove Journey Preferences
// -----------------------------------------------------------------------------

"use client";

import { useCallback, useState } from "react";

import { removeJourneyPreferences } from "../../api/preferences/remove-journey-preferences";

export interface UseRemoveJourneyPreferencesResult {
  readonly remove: (journeyPublicId: string) => Promise<void>;
  readonly isPending: boolean;
  readonly error: Error | null;
}

export function useRemoveJourneyPreferences(): UseRemoveJourneyPreferencesResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = useCallback(async (journeyPublicId: string) => {
    setIsPending(true);
    setError(null);

    try {
      await removeJourneyPreferences(journeyPublicId);
    } catch (cause) {
      const nextError =
        cause instanceof Error
          ? cause
          : new Error("Failed to remove the journey preferences.");

      setError(nextError);
      throw nextError;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { remove, isPending, error };
}