// -----------------------------------------------------------------------------
// sisiMove — Use Add Journey Waypoint
// -----------------------------------------------------------------------------

"use client";

import { useCallback, useState } from "react";

import {
  addJourneyWaypoint,
  type AddJourneyWaypointRequest,
} from "../../api/waypoints/add-journey-waypoint";

export interface UseAddJourneyWaypointResult {
  readonly add: (
    journeyPublicId: string,
    request: AddJourneyWaypointRequest,
  ) => Promise<void>;
  readonly isPending: boolean;
  readonly error: Error | null;
}

export function useAddJourneyWaypoint(): UseAddJourneyWaypointResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const add = useCallback(
    async (
      journeyPublicId: string,
      request: AddJourneyWaypointRequest,
    ): Promise<void> => {
      setIsPending(true);
      setError(null);

      try {
        await addJourneyWaypoint(journeyPublicId, request);
      } catch (cause) {
        const nextError =
          cause instanceof Error
            ? cause
            : new Error("Failed to add the journey waypoint.");

        setError(nextError);
        throw nextError;
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { add, isPending, error };
}