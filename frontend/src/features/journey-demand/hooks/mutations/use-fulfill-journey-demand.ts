'use client';

// -----------------------------------------------------------------------------
// sisiMove — Fulfill Journey Demand Mutation Hook
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import { fulfillJourneyDemand } from '../../api/journey-demands/fulfill-journey-demand.api';

type FulfillJourneyDemandRequest =
  Parameters<typeof fulfillJourneyDemand>[1];

export interface UseFulfillJourneyDemandResult {
  readonly isLoading: boolean;
  readonly error: Error | null;

  readonly fulfillJourneyDemand: (
    journeyDemandPublicId: string,
    request: FulfillJourneyDemandRequest,
  ) => Promise<void>;
}

export function useFulfillJourneyDemand(): UseFulfillJourneyDemandResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (
      journeyDemandPublicId: string,
      request: FulfillJourneyDemandRequest,
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await fulfillJourneyDemand(journeyDemandPublicId, request);
      } catch (cause) {
        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error('Unable to fulfill the Journey Demand.');

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
    fulfillJourneyDemand: execute,
  };
}