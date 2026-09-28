'use client';

// -----------------------------------------------------------------------------
// sisiMove — Publish Journey Demand Mutation Hook
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import { publishJourneyDemand } from '../../api/journey-demands/publish-journey-demand.api';

type PublishJourneyDemandRequest =
  Parameters<typeof publishJourneyDemand>[1];

export interface UsePublishJourneyDemandResult {
  readonly isLoading: boolean;
  readonly error: Error | null;

  readonly publishJourneyDemand: (
    journeyDemandPublicId: string,
    request: PublishJourneyDemandRequest,
  ) => Promise<void>;
}

export function usePublishJourneyDemand(): UsePublishJourneyDemandResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (
      journeyDemandPublicId: string,
      request: PublishJourneyDemandRequest,
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await publishJourneyDemand(journeyDemandPublicId, request);
      } catch (cause) {
        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error('Unable to publish the Journey Demand.');

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
    publishJourneyDemand: execute,
  };
}