// -----------------------------------------------------------------------------
// sisiMove — Use Attach Journey Schedule
// -----------------------------------------------------------------------------

"use client";

import { useCallback, useState } from "react";

import {
  attachJourneySchedule,
  type AttachJourneyScheduleRequest,
} from "../../api/schedule/attach-journey-schedule";

export interface UseAttachJourneyScheduleResult {
  readonly attach: (
    journeyPublicId: string,
    request: AttachJourneyScheduleRequest,
  ) => Promise<void>;
  readonly isPending: boolean;
  readonly error: Error | null;
}

export function useAttachJourneySchedule(): UseAttachJourneyScheduleResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const attach = useCallback(
    async (
      journeyPublicId: string,
      request: AttachJourneyScheduleRequest,
    ): Promise<void> => {
      setIsPending(true);
      setError(null);

      try {
        await attachJourneySchedule(journeyPublicId, request);
      } catch (cause) {
        const nextError =
          cause instanceof Error
            ? cause
            : new Error("Failed to attach the journey schedule.");

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