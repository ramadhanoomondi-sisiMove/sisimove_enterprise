'use client';

// -----------------------------------------------------------------------------
// sisiMove — Remove Journey Demand Waypoint Mutation Hook
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import { removeJourneyDemandWaypoint } from '../../api/waypoints/remove-journey-demand-waypoint.api';

type RemoveJourneyDemandWaypointRequest =
  Parameters<typeof removeJourneyDemandWaypoint>[2];

export interface UseRemoveJourneyDemandWaypointResult {
  readonly isLoading: boolean;
  readonly error: Error | null;

  readonly removeJourneyDemandWaypoint: (
    journeyDemandPublicId: string,
    waypointPublicId: string,
    request: RemoveJourneyDemandWaypointRequest,
  ) => Promise<void>;
}

export function useRemoveJourneyDemandWaypoint(): UseRemoveJourneyDemandWaypointResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (
      journeyDemandPublicId: string,
      waypointPublicId: string,
      request: RemoveJourneyDemandWaypointRequest,
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await removeJourneyDemandWaypoint(
          journeyDemandPublicId,
          waypointPublicId,
          request,
        );
      } catch (cause) {
        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error(
                'Unable to remove the Journey Demand waypoint.',
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
    removeJourneyDemandWaypoint: execute,
  };
}