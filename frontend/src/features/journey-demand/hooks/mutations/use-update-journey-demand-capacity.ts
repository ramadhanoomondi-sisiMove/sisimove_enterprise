'use client';

// -----------------------------------------------------------------------------
// sisiMove — Update Journey Demand Capacity Mutation Hook
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import { updateJourneyDemandCapacity } from '../../api/capacity/update-journey-demand-capacity.api';

type UpdateJourneyDemandCapacityRequest =
  Parameters<typeof updateJourneyDemandCapacity>[1];

export interface UseUpdateJourneyDemandCapacityResult {
  readonly isLoading: boolean;
  readonly error: Error | null;

  readonly updateJourneyDemandCapacity: (
    journeyDemandPublicId: string,
    request: UpdateJourneyDemandCapacityRequest,
  ) => Promise<void>;
}

export function useUpdateJourneyDemandCapacity(): UseUpdateJourneyDemandCapacityResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (
      journeyDemandPublicId: string,
      request: UpdateJourneyDemandCapacityRequest,
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await updateJourneyDemandCapacity(journeyDemandPublicId, request);
      } catch (cause) {
        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error(
                'Unable to update the Journey Demand capacity.',
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
    updateJourneyDemandCapacity: execute,
  };
}