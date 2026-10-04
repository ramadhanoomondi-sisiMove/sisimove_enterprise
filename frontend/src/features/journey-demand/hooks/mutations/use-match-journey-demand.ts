'use client';

// -----------------------------------------------------------------------------
// sisiMove — Match Journey Demand Mutation Hook
// -----------------------------------------------------------------------------
//
// Owns client-side mutation state for matching a Journey Demand.
//
// Architecture:
// - delegates the HTTP operation to the API module;
// - owns loading state;
// - owns normalized mutation error state;
// - does not perform authorization checks;
// - does not inspect Journey Demand lifecycle state;
// - does not determine whether matching is allowed;
// - does not update or recreate Journey Demand state locally.
//
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import {
  matchJourneyDemand,
  type MatchJourneyDemandRequest,
} from '../../api/journey-demands/match-journey-demand.api';

// =============================================================================
// Result
// =============================================================================

export interface UseMatchJourneyDemandResult {
  readonly isLoading: boolean;
  readonly error: Error | null;

  readonly matchJourneyDemand: (
    journeyDemandPublicId: string,
    request: MatchJourneyDemandRequest,
  ) => Promise<void>;
}

// =============================================================================
// Hook
// =============================================================================

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
