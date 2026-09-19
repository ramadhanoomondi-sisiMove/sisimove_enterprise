// -----------------------------------------------------------------------------
// sisiMove — Use Delete Travel Corridor
// -----------------------------------------------------------------------------
//
// React hook for deleting an existing Traveller Profile travel corridor.
//
// Responsibilities:
// - Execute the travel corridor deletion operation.
// - Expose mutation loading and error state.
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
//     ../api/delete-travel-corridor.api.ts
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

import { deleteTravelCorridor } from '../api';

// =============================================================================
// Hook Result
// =============================================================================

export interface UseDeleteTravelCorridorResult {
  remove: (
    travellerProfileId: string,
    corridorId: string,
  ) => Promise<void>;
  isDeleting: boolean;
  error: Error | null;
  reset: () => void;
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Delete an existing travel corridor.
 *
 * Backend route:
 *
 *     DELETE /traveller-profiles/:travellerProfileId/corridors/:corridorId
 *
 * The backend returns no response body.
 *
 * Therefore the mutation resolves with `void`.
 *
 * The backend remains authoritative for authentication, authorization,
 * ownership, validation, persistence, and corridor business rules.
 */
export function useDeleteTravelCorridor(): UseDeleteTravelCorridorResult {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = useCallback(
    async (
      travellerProfileId: string,
      corridorId: string,
    ): Promise<void> => {
      setIsDeleting(true);
      setError(null);

      try {
        await deleteTravelCorridor(travellerProfileId, corridorId);
      } catch (cause) {
        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error('Failed to delete travel corridor.');

        setError(normalizedError);
        throw normalizedError;
      } finally {
        setIsDeleting(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    remove,
    isDeleting,
    error,
    reset,
  };
}