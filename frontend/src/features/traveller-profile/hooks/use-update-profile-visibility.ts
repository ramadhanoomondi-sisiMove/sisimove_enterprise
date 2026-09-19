// -----------------------------------------------------------------------------
// sisiMove — Use Update Profile Visibility
// -----------------------------------------------------------------------------
//
// React hook for changing Traveller Profile visibility.
//
// Responsibilities:
// - Execute the profile visibility mutation.
// - Expose mutation loading and error state.
// - Provide a reusable reset operation.
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
//     ../api/update-profile-visibility.api.ts
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

import { updateProfileVisibility } from '../api';

// -----------------------------------------------------------------------------
// Schemas
// -----------------------------------------------------------------------------

import type { UpdateProfileVisibilityInput } from '../schemas';

// =============================================================================
// Hook Result
// =============================================================================

export interface UseUpdateProfileVisibilityResult {
  update: (
    travellerProfileId: string,
    input: UpdateProfileVisibilityInput,
  ) => Promise<void>;
  isUpdating: boolean;
  error: Error | null;
  reset: () => void;
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Update the visibility of a Traveller Profile.
 *
 * Backend route:
 *
 *     PATCH /traveller-profiles/:travellerProfileId/visibility
 *
 * The backend remains authoritative for authentication, authorization,
 * validation, ownership, and persistence.
 */
export function useUpdateProfileVisibility(): UseUpdateProfileVisibilityResult {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(
    async (
      travellerProfileId: string,
      input: UpdateProfileVisibilityInput,
    ): Promise<void> => {
      setIsUpdating(true);
      setError(null);

      try {
        await updateProfileVisibility(travellerProfileId, input);
      } catch (cause) {
        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error('Failed to update profile visibility.');

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