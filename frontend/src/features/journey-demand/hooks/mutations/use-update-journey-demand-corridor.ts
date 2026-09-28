'use client';

// -----------------------------------------------------------------------------
// sisiMove — Update Journey Demand Corridor Mutation Hook
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import { updateJourneyDemandCorridor } from '../../api/corridor/update-journey-demand-corridor.api';

type UpdateJourneyDemandCorridorRequest =
  Parameters<typeof updateJourneyDemandCorridor>[1];

export interface UseUpdateJourneyDemandCorridorResult {
  readonly isLoading: boolean;
  readonly error: Error | null;

  readonly updateJourneyDemandCorridor: (
    journeyDemandPublicId: string,
    request: UpdateJourneyDemandCorridorRequest,
  ) => Promise<void>;
}

export function useUpdateJourneyDemandCorridor(): UseUpdateJourneyDemandCorridorResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (
      journeyDemandPublicId: string,
      request: UpdateJourneyDemandCorridorRequest,
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await updateJourneyDemandCorridor(journeyDemandPublicId, request);
      } catch (cause) {
        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error(
                'Unable to update the Journey Demand corridor.',
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
    updateJourneyDemandCorridor: execute,
  };
}