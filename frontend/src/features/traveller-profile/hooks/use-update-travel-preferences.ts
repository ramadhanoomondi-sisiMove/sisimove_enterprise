// -----------------------------------------------------------------------------
// sisiMove — Use Update Travel Preferences
// -----------------------------------------------------------------------------
//
// React hook for updating a Traveller Profile's travel preferences.
//
// Responsibilities:
// - Execute the travel preferences mutation.
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
//     ../api/update-travel-preferences.api.ts
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

import { updateTravelPreferences } from '../api';

// -----------------------------------------------------------------------------
// Schemas
// -----------------------------------------------------------------------------

import type { UpdateTravelPreferencesInput } from '../schemas';

// =============================================================================
// Hook Result
// =============================================================================

export interface UseUpdateTravelPreferencesResult {
  update: (
    travellerProfileId: string,
    input: UpdateTravelPreferencesInput,
  ) => Promise<void>;
  isUpdating: boolean;
  error: Error | null;
  reset: () => void;
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Update the travel preferences for a Traveller Profile.
 *
 * Backend route:
 *
 *     PATCH /traveller-profiles/:travellerProfileId/preferences
 *
 * The backend remains authoritative for authentication, authorization,
 * ownership, validation, persistence, and domain behavior.
 */
export function useUpdateTravelPreferences(): UseUpdateTravelPreferencesResult {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(
    async (
      travellerProfileId: string,
      input: UpdateTravelPreferencesInput,
    ): Promise<void> => {
      setIsUpdating(true);
      setError(null);

      try {
        await updateTravelPreferences(travellerProfileId, input);
      } catch (cause) {
        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error('Failed to update travel preferences.');

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