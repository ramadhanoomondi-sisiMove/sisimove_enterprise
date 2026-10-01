// -----------------------------------------------------------------------------
// sisiMove — useMyJourneys
// -----------------------------------------------------------------------------
//
// Authenticated Journey data hook.
//
// Responsibilities:
//
//   React component
//        ↓
//   useMyJourneys()
//        ↓
//   getMyJourneys()
//        ↓
//   GET /journeys/me
//
// This hook is intentionally thin.
//
// It does NOT:
//
// - determine the current identity;
// - accept a providerPublicId;
// - perform authorization;
// - determine Journey ownership;
// - recreate Journey lifecycle rules;
// - query Traveller Profile;
// - query Trust;
// - query Assets independently.
//
// The backend remains the source of truth for authentication, authorization,
// ownership, and Journey lifecycle state.
//
// -----------------------------------------------------------------------------

'use client';


// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import { useCallback, useEffect, useState } from 'react';


// -----------------------------------------------------------------------------
// Journey — API
// -----------------------------------------------------------------------------

import { getMyJourneys } from '../api/my-journeys.api';


// -----------------------------------------------------------------------------
// Journey — Models
// -----------------------------------------------------------------------------

import type { MyJourney } from '../models';


// =============================================================================
// Types
// =============================================================================

export interface UseMyJourneysResult {
  /**
   * Journeys belonging to the currently authenticated identity.
   */
  readonly journeys: readonly MyJourney[];

  /**
   * True while the request is in progress.
   */
  readonly isLoading: boolean;

  /**
   * Error produced by the HTTP operation, if any.
   */
  readonly error: Error | null;

  /**
   * Re-fetch the authenticated user's Journeys.
   */
  readonly refetch: () => Promise<void>;
}


// =============================================================================
// Hook
// =============================================================================

/**
 * Retrieve the Journeys belonging to the currently authenticated identity.
 *
 * Backend:
 *
 *     GET /journeys/me
 *
 * The current identity is derived entirely by the backend from the
 * authenticated access token.
 */
export function useMyJourneys(): UseMyJourneysResult {
  const [journeys, setJourneys] = useState<readonly MyJourney[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // ---------------------------------------------------------------------------
  // Initial load
  // ---------------------------------------------------------------------------
  //
  // The request is started from the effect, but state updates happen only
  // after the asynchronous operation resolves or rejects.
  //
  // This avoids the synchronous setState-in-effect pattern flagged by the
  // React hooks lint rule.
  //
  useEffect(() => {
    let cancelled = false;

    const load = async (): Promise<void> => {
      try {
        const result = await getMyJourneys();

        if (cancelled) {
          return;
        }

        setJourneys(result);
        setError(null);
      } catch (cause) {
        if (cancelled) {
          return;
        }

        const nextError =
          cause instanceof Error
            ? cause
            : new Error('Failed to load your journeys.');

        setError(nextError);
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
  }, []);

  // ---------------------------------------------------------------------------
  // Refetch
  // ---------------------------------------------------------------------------
  //
  // Refetch is an explicit user/application action rather than an effect.
  //
  // It is therefore appropriate to update loading/error state synchronously
  // here before starting the request.
  //
  const refetch = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getMyJourneys();

      setJourneys(result);
    } catch (cause) {
      const nextError =
        cause instanceof Error
          ? cause
          : new Error('Failed to load your journeys.');

      setError(nextError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    journeys,
    isLoading,
    error,
    refetch,
  };
}
