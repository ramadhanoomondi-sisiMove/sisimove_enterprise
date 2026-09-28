'use client';

// -----------------------------------------------------------------------------
// sisiMove — Convert Journey Demand Mutation Hook
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import { convertJourneyDemand } from '../../api/journey-demands/convert-journey-demand.api';

type ConvertJourneyDemandRequest =
  Parameters<typeof convertJourneyDemand>[1];

export interface UseConvertJourneyDemandResult {
  readonly isLoading: boolean;
  readonly error: Error | null;

  readonly convertJourneyDemand: (
    journeyDemandPublicId: string,
    request: ConvertJourneyDemandRequest,
  ) => Promise<void>;
}

export function useConvertJourneyDemand(): UseConvertJourneyDemandResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (
      journeyDemandPublicId: string,
      request: ConvertJourneyDemandRequest,
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await convertJourneyDemand(journeyDemandPublicId, request);
      } catch (cause) {
        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error('Unable to convert the Journey Demand.');

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
    convertJourneyDemand: execute,
  };
}