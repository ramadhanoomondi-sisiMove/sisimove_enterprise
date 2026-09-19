// -----------------------------------------------------------------------------
// sisiMove — Use Update Traveller Profile
// -----------------------------------------------------------------------------
//
// React hook for updating the authenticated user's Traveller Profile.
//
// Responsibilities:
// - Execute the profile update operation.
// - Expose mutation loading and error state.
// - Provide a reusable mutate function.
//
// Non-responsibilities:
// - HTTP configuration.
// - Authentication/token handling.
// - Domain validation.
// - Profile ownership checks.
// - Cache management.
// - Rendering or navigation.
//
// HTTP concerns remain in:
//     ../api/update-traveller-profile.api.ts
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

import { updateTravellerProfile } from '../api';

// -----------------------------------------------------------------------------
// Schemas
// -----------------------------------------------------------------------------

import type { UpdateTravellerProfileInput } from '../schemas';

// =============================================================================
// Hook Result
// =============================================================================

export interface UseUpdateTravellerProfileResult {
  update: (
    travellerProfileId: string,
    input: UpdateTravellerProfileInput,
  ) => Promise<void>;
  isUpdating: boolean;
  error: Error | null;
  reset: () => void;
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Update an existing Traveller Profile.
 *
 * The API layer delegates the individual field mutations to the backend:
 *
 *     PATCH /traveller-profiles/:travellerProfileId/handle
 *     PATCH /traveller-profiles/:travellerProfileId/bio
 *     PATCH /traveller-profiles/:travellerProfileId/country
 *
 * This hook owns only mutation state and React-facing behavior.
 */
export function useUpdateTravellerProfile(): UseUpdateTravellerProfileResult {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(
    async (
      travellerProfileId: string,
      input: UpdateTravellerProfileInput,
    ): Promise<void> => {
      setIsUpdating(true);
      setError(null);

      try {
        await updateTravellerProfile(travellerProfileId, input);
      } catch (cause) {
        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error('Failed to update traveller profile.');

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