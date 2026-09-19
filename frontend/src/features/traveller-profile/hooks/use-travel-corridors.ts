// -----------------------------------------------------------------------------
// sisiMove — Use Travel Corridors
// -----------------------------------------------------------------------------
//
// React hook for retrieving a Traveller Profile's travel corridors.
//
// Responsibilities:
// - Load travel corridors.
// - Expose loading, error, and data state.
// - Provide a reload operation.
//
// Non-responsibilities:
// - HTTP configuration.
// - Authentication/token handling.
// - Corridor creation.
// - Corridor updates.
// - Corridor deletion.
// - Domain validation.
// - Rendering or navigation.
//
// HTTP concerns remain in:
//     ../api/get-travel-corridors.api.ts
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

import { getTravelCorridors } from '../api';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

import type { TravellerProfileCorridor } from '../models';

// =============================================================================
// Hook Result
// =============================================================================

export interface UseTravelCorridorsResult {
  corridors: readonly TravellerProfileCorridor[];
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Retrieve the travel corridors for a Traveller Profile.
 *
 * Backend route:
 *
 *     GET /traveller-profiles/:travellerProfileId/corridors
 *
 * An empty array is a valid successful response.
 */
export function useTravelCorridors(
  travellerProfileId: string,
): UseTravelCorridorsResult {
  const [corridors, setCorridors] = useState<
    readonly TravellerProfileCorridor[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadCorridors = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getTravelCorridors(travellerProfileId);

      setCorridors(result);
    } catch (cause) {
      const normalizedError =
        cause instanceof Error
          ? cause
          : new Error('Failed to load travel corridors.');

      setError(normalizedError);
    } finally {
      setIsLoading(false);
    }
  }, [travellerProfileId]);

  useEffect(() => {
    let cancelled = false;

    const load = async (): Promise<void> => {
      try {
        const result = await getTravelCorridors(travellerProfileId);

        if (cancelled) {
          return;
        }

        setCorridors(result);
        setError(null);
      } catch (cause) {
        if (cancelled) {
          return;
        }

        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error('Failed to load travel corridors.');

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
    corridors,
    isLoading,
    error,
    reload: loadCorridors,
  };
}