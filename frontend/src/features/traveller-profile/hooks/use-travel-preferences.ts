// -----------------------------------------------------------------------------
// sisiMove — Use Travel Preferences
// -----------------------------------------------------------------------------
//
// React hook for retrieving the authenticated Traveller Profile's travel
// preferences.
//
// Responsibilities:
// - Load travel preferences.
// - Expose loading, error, and data state.
// - Provide a reload operation.
//
// Non-responsibilities:
// - HTTP configuration.
// - Authentication/token handling.
// - Preference mutation.
// - Domain validation.
// - Rendering or navigation.
//
// HTTP concerns remain in:
//     ../api/get-travel-preferences.api.ts
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import { useCallback, useEffect, useState } from 'react';

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

import { getTravelPreferences } from '../api';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

import type { TravellerProfilePreferences } from '../models';

// =============================================================================
// Hook Result
// =============================================================================

export interface UseTravelPreferencesResult {
  preferences: TravellerProfilePreferences | null;
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Retrieve the travel preferences for a Traveller Profile.
 *
 * Backend route:
 *
 *     GET /traveller-profiles/:travellerProfileId/preferences
 *
 * A `null` result is valid and represents a Traveller Profile that does not
 * currently have a persisted preferences record.
 */
export function useTravelPreferences(
  travellerProfileId: string,
): UseTravelPreferencesResult {
  const [preferences, setPreferences] =
    useState<TravellerProfilePreferences | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadPreferences = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getTravelPreferences(travellerProfileId);

      setPreferences(result);
    } catch (cause) {
      const normalizedError =
        cause instanceof Error
          ? cause
          : new Error('Failed to load travel preferences.');

      setError(normalizedError);
    } finally {
      setIsLoading(false);
    }
  }, [travellerProfileId]);

  useEffect(() => {
    let cancelled = false;

    const load = async (): Promise<void> => {
      try {
        const result = await getTravelPreferences(travellerProfileId);

        if (cancelled) {
          return;
        }

        setPreferences(result);
        setError(null);
      } catch (cause) {
        if (cancelled) {
          return;
        }

        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error('Failed to load travel preferences.');

        setError(normalizedError);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [travellerProfileId]);

  return {
    preferences,
    isLoading,
    error,
    reload: loadPreferences,
  };
}