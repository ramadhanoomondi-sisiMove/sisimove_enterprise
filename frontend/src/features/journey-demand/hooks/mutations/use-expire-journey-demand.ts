'use client';

// -----------------------------------------------------------------------------
// sisiMove — Expire Journey Demand Mutation Hook
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import { expireJourneyDemand } from '../../api/journey-demands/expire-journey-demand.api';

type ExpireJourneyDemandRequest =
  Parameters<typeof expireJourneyDemand>[1];

export interface UseExpireJourneyDemandResult {
  readonly isLoading: boolean;
  readonly error: Error | null;

  readonly expireJourneyDemand: (
    journeyDemandPublicId: string,
    request: ExpireJourneyDemandRequest,
  ) => Promise<void>;
}

export function useExpireJourneyDemand(): UseExpireJourneyDemandResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (
      journeyDemandPublicId: string,
      request: ExpireJourneyDemandRequest,
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await expireJourneyDemand(journeyDemandPublicId, request);
      } catch (cause) {
        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error('Unable to expire the Journey Demand.');

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
    expireJourneyDemand: execute,
  };
}