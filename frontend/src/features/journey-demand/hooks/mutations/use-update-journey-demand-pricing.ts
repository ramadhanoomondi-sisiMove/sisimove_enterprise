'use client';

// -----------------------------------------------------------------------------
// sisiMove — Update Journey Demand Pricing Mutation Hook
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import { updateJourneyDemandPricing } from '../../api/pricing/update-journey-demand-pricing.api';

type UpdateJourneyDemandPricingRequest =
  Parameters<typeof updateJourneyDemandPricing>[1];

export interface UseUpdateJourneyDemandPricingResult {
  readonly isLoading: boolean;
  readonly error: Error | null;

  readonly updateJourneyDemandPricing: (
    journeyDemandPublicId: string,
    request: UpdateJourneyDemandPricingRequest,
  ) => Promise<void>;
}

export function useUpdateJourneyDemandPricing(): UseUpdateJourneyDemandPricingResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (
      journeyDemandPublicId: string,
      request: UpdateJourneyDemandPricingRequest,
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await updateJourneyDemandPricing(journeyDemandPublicId, request);
      } catch (cause) {
        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error(
                'Unable to update the Journey Demand pricing.',
              );

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
    updateJourneyDemandPricing: execute,
  };
}