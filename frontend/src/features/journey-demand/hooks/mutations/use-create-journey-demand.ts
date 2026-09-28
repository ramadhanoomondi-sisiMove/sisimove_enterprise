'use client';

// -----------------------------------------------------------------------------
// sisiMove — Create Journey Demand Mutation Hook
// -----------------------------------------------------------------------------
//
// Owns request state for Journey Demand creation.
//
// The backend owns aggregate creation and all domain invariants.
// This hook only bridges a component to the HTTP API and exposes request
// state to that component.
//
// Query refreshes are intentionally NOT performed here. The component that
// owns the mutation decides which query, if any, must be refreshed.
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import { createJourneyDemand } from '../../api/journey-demands/create-journey-demand.api';

type CreateJourneyDemandRequest =
  Parameters<typeof createJourneyDemand>[0];

export interface UseCreateJourneyDemandResult {
  readonly isLoading: boolean;
  readonly error: Error | null;

  readonly createJourneyDemand: (
    request: CreateJourneyDemandRequest,
  ) => Promise<void>;
}

export function useCreateJourneyDemand(): UseCreateJourneyDemandResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (request: CreateJourneyDemandRequest): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await createJourneyDemand(request);
      } catch (cause) {
        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error('Unable to create the Journey Demand.');

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
    createJourneyDemand: execute,
  };
}