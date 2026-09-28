'use client';

// -----------------------------------------------------------------------------
// sisiMove — Update Journey Demand Waypoint Mutation Hook
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import { updateJourneyDemandWaypoint } from '../../api/waypoints/update-journey-demand-waypoint.api';

type UpdateJourneyDemandWaypointRequest =
  Parameters<typeof updateJourneyDemandWaypoint>[2];

export interface UseUpdateJourneyDemandWaypointResult {
  readonly isLoading: boolean;
  readonly error: Error | null;

  readonly updateJourneyDemandWaypoint: (
    journeyDemandPublicId: string,
    waypointPublicId: string,
    request: UpdateJourneyDemandWaypointRequest,
  ) => Promise<void>;
}

export function useUpdateJourneyDemandWaypoint(): UseUpdateJourneyDemandWaypointResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (
      journeyDemandPublicId: string,
      waypointPublicId: string,
      request: UpdateJourneyDemandWaypointRequest,
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await updateJourneyDemandWaypoint(
          journeyDemandPublicId,
          waypointPublicId,
          request,
        );
      } catch (cause) {
        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error(
                'Unable to update the Journey Demand waypoint.',
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
    updateJourneyDemandWaypoint: execute,
  };
}