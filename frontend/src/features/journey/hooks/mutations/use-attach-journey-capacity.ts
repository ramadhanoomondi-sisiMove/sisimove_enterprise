// -----------------------------------------------------------------------------
// sisiMove — Use Attach Journey Capacity
// -----------------------------------------------------------------------------

"use client";

import { useCallback, useState } from "react";

import {
  attachJourneyCapacity,
  type AttachJourneyCapacityRequest,
} from "../../api/capacity/attach-journey-capacity";

export interface UseAttachJourneyCapacityResult {
  readonly attach: (
    journeyPublicId: string,
    request: AttachJourneyCapacityRequest,
  ) => Promise<void>;
  readonly isPending: boolean;
  readonly error: Error | null;
}

export function useAttachJourneyCapacity(): UseAttachJourneyCapacityResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const attach = useCallback(
    async (
      journeyPublicId: string,
      request: AttachJourneyCapacityRequest,
    ): Promise<void> => {
      setIsPending(true);
      setError(null);

      try {
        await attachJourneyCapacity(journeyPublicId, request);
      } catch (cause) {
        const nextError =
          cause instanceof Error
            ? cause
            : new Error("Failed to attach the journey capacity.");

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