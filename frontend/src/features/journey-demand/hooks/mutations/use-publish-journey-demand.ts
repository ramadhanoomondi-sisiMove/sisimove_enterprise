'use client';

// -----------------------------------------------------------------------------
// sisiMove — Publish Journey Demand Mutation Hook
// -----------------------------------------------------------------------------
//
// Owns client-side mutation state for publishing a Journey Demand.
//
// Architecture:
// - delegates the HTTP operation to the API module;
// - owns loading state;
// - owns normalized mutation error state;
// - does not perform authorization checks;
// - does not inspect Journey Demand lifecycle state;
// - does not determine whether publishing is allowed;
// - does not update or recreate Journey Demand state locally.
//
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import {
  publishJourneyDemand,
  type PublishJourneyDemandRequest,
} from '../../api/journey-demands/publish-journey-demand.api';

// =============================================================================
// Result
// =============================================================================

export interface UsePublishJourneyDemandResult {
  readonly isLoading: boolean;
  readonly error: Error | null;

  readonly publishJourneyDemand: (
    journeyDemandPublicId: string,
    request: PublishJourneyDemandRequest,
  ) => Promise<void>;
}

// =============================================================================
// Hook
// =============================================================================

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
