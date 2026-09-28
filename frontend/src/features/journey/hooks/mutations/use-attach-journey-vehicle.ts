// -----------------------------------------------------------------------------
// sisiMove — Use Attach Journey Vehicle
// -----------------------------------------------------------------------------

"use client";

import { useCallback, useState } from "react";

import {
  attachJourneyVehicle,
  type AttachJourneyVehicleRequest,
} from "../../api/vehicle/attach-journey-vehicle";

export interface UseAttachJourneyVehicleResult {
  readonly attach: (
    journeyPublicId: string,
    request: AttachJourneyVehicleRequest,
  ) => Promise<void>;
  readonly isPending: boolean;
  readonly error: Error | null;
}

export function useAttachJourneyVehicle(): UseAttachJourneyVehicleResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const attach = useCallback(
    async (
      journeyPublicId: string,
      request: AttachJourneyVehicleRequest,
    ): Promise<void> => {
      setIsPending(true);
      setError(null);

      try {
        await attachJourneyVehicle(journeyPublicId, request);
      } catch (cause) {
        const nextError =
          cause instanceof Error
            ? cause
            : new Error("Failed to attach the journey vehicle.");

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