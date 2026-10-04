'use client';

// -----------------------------------------------------------------------------
// sisiMove — Cancel Journey Demand Mutation Hook
// -----------------------------------------------------------------------------
//
// Owns client-side mutation state for cancelling a Journey Demand.
//
// Architecture:
// - delegates the HTTP operation to the API module;
// - owns loading state;
// - owns normalized mutation error state;
// - does not perform authorization checks;
// - does not inspect Journey Demand lifecycle state;
// - does not determine whether cancellation is allowed;
// - does not update or recreate Journey Demand state locally.
//
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import {
  cancelJourneyDemand,
  type CancelJourneyDemandRequest,
} from '../../api/journey-demands/cancel-journey-demand.api';

// =============================================================================
// Result
// =============================================================================

export interface UseCancelJourneyDemandResult {
  readonly isLoading: boolean;
  readonly error: Error | null;

  readonly cancelJourneyDemand: (
    journeyDemandPublicId: string,
    request: CancelJourneyDemandRequest,
  ) => Promise<void>;
}

// =============================================================================
// Hook
// =============================================================================

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