// -----------------------------------------------------------------------------
// sisiMove — Use Attach Journey Preferences
// -----------------------------------------------------------------------------

"use client";

import { useCallback, useState } from "react";

import {
  attachJourneyPreferences,
  type AttachJourneyPreferencesRequest,
} from "../../api/preferences/attach-journey-preferences";

export interface UseAttachJourneyPreferencesResult {
  readonly attach: (
    journeyPublicId: string,
    request: AttachJourneyPreferencesRequest,
  ) => Promise<void>;
  readonly isPending: boolean;
  readonly error: Error | null;
}

export function useAttachJourneyPreferences(): UseAttachJourneyPreferencesResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const attach = useCallback(
    async (
      journeyPublicId: string,
      request: AttachJourneyPreferencesRequest,
    ): Promise<void> => {
      setIsPending(true);
      setError(null);

      try {
        await attachJourneyPreferences(journeyPublicId, request);
      } catch (cause) {
        const nextError =
          cause instanceof Error
            ? cause
            : new Error("Failed to attach the journey preferences.");

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