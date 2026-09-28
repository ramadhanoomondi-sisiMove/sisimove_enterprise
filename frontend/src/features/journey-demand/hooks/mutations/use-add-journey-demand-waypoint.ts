'use client';

// -----------------------------------------------------------------------------
// sisiMove — Add Journey Demand Waypoint Mutation Hook
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import { addJourneyDemandWaypoint } from '../../api/waypoints/add-journey-demand-waypoint.api';

type AddJourneyDemandWaypointRequest =
  Parameters<typeof addJourneyDemandWaypoint>[1];

export interface UseAddJourneyDemandWaypointResult {
  readonly isLoading: boolean;
  readonly error: Error | null;

  readonly addJourneyDemandWaypoint: (
    journeyDemandPublicId: string,
    request: AddJourneyDemandWaypointRequest,
  ) => Promise<void>;
}

export function useAddJourneyDemandWaypoint(): UseAddJourneyDemandWaypointResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (
      journeyDemandPublicId: string,
      request: AddJourneyDemandWaypointRequest,
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await addJourneyDemandWaypoint(journeyDemandPublicId, request);
      } catch (cause) {
        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error(
                'Unable to add the Journey Demand waypoint.',
              );

        setError(normalizedError);
        throw normalizedError;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    isLoading,
    error,
    addJourneyDemandWaypoint: execute,
  };
}