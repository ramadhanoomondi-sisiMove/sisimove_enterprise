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
//
// The successful result contains the public identifier of the newly-created
// Journey Demand so that the owning component can perform subsequent
// Journey Demand configuration mutations.
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import {
  createJourneyDemand,
  type CreateJourneyDemandResponse,
} from '../../api/journey-demands/create-journey-demand.api';

// =============================================================================
// Types
// =============================================================================

type CreateJourneyDemandRequest =
  Parameters<typeof createJourneyDemand>[0];

export interface UseCreateJourneyDemandResult {
  readonly isLoading: boolean;
  readonly error: Error | null;

  /**
   * Creates the Journey Demand root in DRAFT state.
   *
   * Returns the public identifier of the newly-created Journey Demand.
   */
  readonly createJourneyDemand: (
    request: CreateJourneyDemandRequest,
  ) => Promise<CreateJourneyDemandResponse>;
}

// =============================================================================
// Hook
// =============================================================================

export function useCreateJourneyDemand(): UseCreateJourneyDemandResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // ===========================================================================
  // Execute
  // ===========================================================================

  const execute = useCallback(
    async (
      request: CreateJourneyDemandRequest,
    ): Promise<CreateJourneyDemandResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        // ---------------------------------------------------------------------
        // Create Journey Demand
        // ---------------------------------------------------------------------

        const response = await createJourneyDemand(request);

        // ---------------------------------------------------------------------
        // Return Created Identity
        // ---------------------------------------------------------------------

        return response;
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

  // ===========================================================================
  // Result
  // ===========================================================================

  return {
    isLoading,
    error,
    createJourneyDemand: execute,
  };
}