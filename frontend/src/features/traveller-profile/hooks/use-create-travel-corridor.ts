// -----------------------------------------------------------------------------
// sisiMove — Use Create Travel Corridor
// -----------------------------------------------------------------------------
//
// React hook for creating a Traveller Profile travel corridor.
//
// Responsibilities:
// - Execute the travel corridor creation operation.
// - Expose mutation loading and error state.
// - Return the created corridor.
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
//     ../api/create-travel-corridor.api.ts
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

import { createTravelCorridor } from '../api';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

import type { TravellerProfileCorridor } from '../models';

// -----------------------------------------------------------------------------
// Schemas
// -----------------------------------------------------------------------------

import type { CreateTravelCorridorInput } from '../schemas';

// =============================================================================
// Hook Result
// =============================================================================

export interface UseCreateTravelCorridorResult {
  create: (
    travellerProfileId: string,
    input: CreateTravelCorridorInput,
  ) => Promise<TravellerProfileCorridor>;
  isCreating: boolean;
  error: Error | null;
  reset: () => void;
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Create a new travel corridor for a Traveller Profile.
 *
 * Backend route:
 *
 *     POST /traveller-profiles/:travellerProfileId/corridors
 *
 * The backend remains authoritative for authentication, authorization,
 * ownership, validation, persistence, and corridor business rules.
 */
export function useCreateTravelCorridor(): UseCreateTravelCorridorResult {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(
    async (
      travellerProfileId: string,
      input: CreateTravelCorridorInput,
    ): Promise<TravellerProfileCorridor> => {
      setIsCreating(true);
      setError(null);

      try {
        return await createTravelCorridor(travellerProfileId, input);
      } catch (cause) {
        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error('Failed to create travel corridor.');

        setError(normalizedError);
        throw normalizedError;
      } finally {
        setIsCreating(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    create,
    isCreating,
    error,
    reset,
  };
}