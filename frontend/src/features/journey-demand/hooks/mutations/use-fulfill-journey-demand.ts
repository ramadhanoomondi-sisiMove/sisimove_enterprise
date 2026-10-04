'use client';

// -----------------------------------------------------------------------------
// sisiMove — Fulfill Journey Demand Mutation Hook
// -----------------------------------------------------------------------------
//
// Owns client-side mutation state for fulfilling a Journey Demand.
//
// Architecture:
// - delegates the HTTP operation to the API module;
// - owns loading state;
// - owns normalized mutation error state;
// - does not perform authorization checks;
// - does not inspect Journey Demand lifecycle state;
// - does not determine whether fulfillment is allowed;
// - does not update or recreate Journey Demand state locally.
//
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import {
  fulfillJourneyDemand,
  type FulfillJourneyDemandRequest,
} from '../../api/journey-demands/fulfill-journey-demand.api';

// =============================================================================
// Result
// =============================================================================

export interface UseFulfillJourneyDemandResult {
  readonly isLoading: boolean;
  readonly error: Error | null;

  readonly fulfillJourneyDemand: (
    journeyDemandPublicId: string,
    request: FulfillJourneyDemandRequest,
  ) => Promise<void>;
}

// =============================================================================
// Hook
// =============================================================================

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