// -----------------------------------------------------------------------------
// sisiMove — Use Remove Journey Waypoint
// -----------------------------------------------------------------------------

"use client";

import { useCallback, useState } from "react";

import { removeJourneyWaypoint } from "../../api/waypoints/remove-journey-waypoint";

export interface UseRemoveJourneyWaypointResult {
  readonly remove: (
    journeyPublicId: string,
    waypointPublicId: string,
  ) => Promise<void>;
  readonly isPending: boolean;
  readonly error: Error | null;
}

export function useRemoveJourneyWaypoint(): UseRemoveJourneyWaypointResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = useCallback(
    async (
      journeyPublicId: string,
      waypointPublicId: string,
    ): Promise<void> => {
      setIsPending(true);
      setError(null);

      try {
        await removeJourneyWaypoint(journeyPublicId, waypointPublicId);
      } catch (cause) {
        const nextError =
          cause instanceof Error
            ? cause
            : new Error("Failed to remove the journey waypoint.");

        setError(nextError);
        throw nextError;
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { remove, isPending, error };
}