'use client';

// -----------------------------------------------------------------------------
// sisiMove — Convert Journey Demand Mutation Hook
// -----------------------------------------------------------------------------
//
// Owns client-side mutation state for converting a Journey Demand.
//
// Architecture:
// - delegates the HTTP operation to the API module;
// - owns loading state;
// - owns normalized mutation error state;
// - does not perform authorization checks;
// - does not inspect Journey Demand lifecycle state;
// - does not determine whether conversion is allowed;
// - does not update or recreate Journey Demand state locally.
//
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import {
  convertJourneyDemand,
  type ConvertJourneyDemandRequest,
} from '../../api/journey-demands/convert-journey-demand.api';

// =============================================================================
// Result
// =============================================================================

export interface UseConvertJourneyDemandResult {
  readonly isLoading: boolean;
  readonly error: Error | null;

  readonly convertJourneyDemand: (
    journeyDemandPublicId: string,
    request: ConvertJourneyDemandRequest,
  ) => Promise<void>;
}

// =============================================================================
// Hook
// =============================================================================

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