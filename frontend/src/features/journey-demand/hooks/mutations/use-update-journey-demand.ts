'use client';

// -----------------------------------------------------------------------------
// sisiMove — Update Journey Demand Mutation Hook
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import { updateJourneyDemand } from '../../api/journey-demands/update-journey-demand.api';

type UpdateJourneyDemandRequest =
  Parameters<typeof updateJourneyDemand>[1];

export interface UseUpdateJourneyDemandResult {
  readonly isLoading: boolean;
  readonly error: Error | null;

  readonly updateJourneyDemand: (
    journeyDemandPublicId: string,
    request: UpdateJourneyDemandRequest,
  ) => Promise<void>;
}

export function useUpdateJourneyDemand(): UseUpdateJourneyDemandResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (
      journeyDemandPublicId: string,
      request: UpdateJourneyDemandRequest,
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await updateJourneyDemand(journeyDemandPublicId, request);
      } catch (cause) {
        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error('Unable to update the Journey Demand.');

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
    updateJourneyDemand: execute,
  };
}