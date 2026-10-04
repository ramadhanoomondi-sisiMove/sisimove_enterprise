'use client';

// -----------------------------------------------------------------------------
// sisiMove — Update Journey Demand Corridor Mutation Hook
// -----------------------------------------------------------------------------
//
// Client-side mutation state for updating the corridor owned by a Journey
// Demand.
//
// Architectural boundary:
//
// - The API adapter owns the HTTP contract.
// - This hook owns mutation state and error normalization.
// - The request type is derived directly from the API function, preventing
//   the hook contract from drifting away from the backend/API contract.
// - The component/workflow owns when the mutation should execute.
// - Query invalidation/refetching belongs to the query/cache layer.
//
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

import { updateJourneyDemandCorridor } from '../../api/corridor/update-journey-demand-corridor.api';

// -----------------------------------------------------------------------------
// Request Contract
// -----------------------------------------------------------------------------

/**
 * Derive the mutation request directly from the API adapter.
 *
 * This intentionally avoids defining a second request interface in the hook.
 *
 * The API contract now includes:
 *
 * - origin
 * - originLatitude
 * - originLongitude
 * - destination
 * - destinationLatitude
 * - destinationLongitude
 * - correlationId
 * - causationId (optional)
 *
 * Any future API contract change therefore flows automatically into this hook.
 */
type UpdateJourneyDemandCorridorRequest =
  Parameters<typeof updateJourneyDemandCorridor>[1];

// -----------------------------------------------------------------------------
// Hook Result
// -----------------------------------------------------------------------------

export interface UseUpdateJourneyDemandCorridorResult {
  /**
   * True while the corridor update request is in flight.
   */
  readonly isLoading: boolean;

  /**
   * Normalized mutation error, when the most recent request failed.
   */
  readonly error: Error | null;

  /**
   * Execute the Journey Demand corridor update.
   */
  readonly updateJourneyDemandCorridor: (
    journeyDemandPublicId: string,
    request: UpdateJourneyDemandCorridorRequest,
  ) => Promise<void>;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Manage the Journey Demand corridor update mutation.
 *
 * This hook deliberately does not:
 *
 * - validate corridor business rules;
 * - calculate coordinates;
 * - resolve corridor keys;
 * - construct waypoints;
 * - modify Journey Demand state locally;
 * - invalidate queries.
 *
 * Those responsibilities belong to the appropriate architectural layers.
 */
export function useUpdateJourneyDemandCorridor(): UseUpdateJourneyDemandCorridorResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (
      journeyDemandPublicId: string,
      request: UpdateJourneyDemandCorridorRequest,
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await updateJourneyDemandCorridor(
          journeyDemandPublicId,
          request,
        );
      } catch (cause) {
        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error(
                'Unable to update the Journey Demand corridor.',
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
    updateJourneyDemandCorridor: execute,
  };
}

