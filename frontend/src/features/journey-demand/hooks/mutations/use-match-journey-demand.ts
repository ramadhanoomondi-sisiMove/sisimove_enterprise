'use client';

// -----------------------------------------------------------------------------
// sisiMove — Match Journey Demand Mutation Hook
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import { matchJourneyDemand } from '../../api/journey-demands/match-journey-demand.api';

type MatchJourneyDemandRequest =
  Parameters<typeof matchJourneyDemand>[1];

export interface UseMatchJourneyDemandResult {
  readonly isLoading: boolean;
  readonly error: Error | null;

  readonly matchJourneyDemand: (
    journeyDemandPublicId: string,
    request: MatchJourneyDemandRequest,
  ) => Promise<void>;
}

export function useMatchJourneyDemand(): UseMatchJourneyDemandResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (
      journeyDemandPublicId: string,
      request: MatchJourneyDemandRequest,
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await matchJourneyDemand(journeyDemandPublicId, request);
      } catch (cause) {
        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error('Unable to match the Journey Demand.');

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
    matchJourneyDemand: execute,
  };
}