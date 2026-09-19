// -----------------------------------------------------------------------------
// sisiMove — Use Update Travel Corridor
// -----------------------------------------------------------------------------
//
// React hook for updating an existing Traveller Profile travel corridor.
//
// Responsibilities:
// - Execute the travel corridor update operation.
// - Expose mutation loading and error state.
// - Return the updated corridor.
// - Provide a reset operation.
//
// Non-responsibilities:
// - HTTP configuration.
// - Authentication/token handling.
// - Authorization.
// - Domain validation.
// - Profile ownership checks.
// - Rendering or navigation.
//
// HTTP concerns remain in:
//     ../api/update-travel-corridor.api.ts
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

import { updateTravelCorridor } from '../api';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

import type { TravellerProfileCorridor } from '../models';

// -----------------------------------------------------------------------------
// Schemas
// -----------------------------------------------------------------------------

import type { UpdateTravelCorridorInput } from '../schemas';

// =============================================================================
// Hook Result
// =============================================================================

export interface UseUpdateTravelCorridorResult {
  update: (
    travellerProfileId: string,
    corridorId: string,
    input: UpdateTravelCorridorInput,
  ) => Promise<TravellerProfileCorridor>;
  isUpdating: boolean;
  error: Error | null;
  reset: () => void;
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Update an existing travel corridor.
 *
 * Backend route:
 *
 *     PATCH /traveller-profiles/:travellerProfileId/corridors/:corridorId
 *
 * The backend remains authoritative for authentication, authorization,
 * ownership, validation, persistence, and corridor business rules.
 */
export function useUpdateTravelCorridor(): UseUpdateTravelCorridorResult {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(
    async (
      travellerProfileId: string,
      corridorId: string,
      input: UpdateTravelCorridorInput,
    ): Promise<TravellerProfileCorridor> => {
      setIsUpdating(true);
      setError(null);

      try {
        return await updateTravelCorridor(
          travellerProfileId,
          corridorId,
          input,
        );
      } catch (cause) {
        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error('Failed to update travel corridor.');

        setError(normalizedError);
        throw normalizedError;
      } finally {
        setIsUpdating(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    update,
    isUpdating,
    error,
    reset,
  };
}