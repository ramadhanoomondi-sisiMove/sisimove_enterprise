'use client';

// -----------------------------------------------------------------------------
// sisiMove — Cancel Journey Demand Mutation Hook
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import { cancelJourneyDemand } from '../../api/journey-demands/cancel-journey-demand.api';

type CancelJourneyDemandRequest =
  Parameters<typeof cancelJourneyDemand>[1];

export interface UseCancelJourneyDemandResult {
  readonly isLoading: boolean;
  readonly error: Error | null;

  readonly cancelJourneyDemand: (
    journeyDemandPublicId: string,
    request: CancelJourneyDemandRequest,
  ) => Promise<void>;
}

export function useCancelJourneyDemand(): UseCancelJourneyDemandResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (
      journeyDemandPublicId: string,
      request: CancelJourneyDemandRequest,
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await cancelJourneyDemand(journeyDemandPublicId, request);
      } catch (cause) {
        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error('Unable to cancel the Journey Demand.');

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
    cancelJourneyDemand: execute,
  };
}