// -----------------------------------------------------------------------------
// sisiMove — Use My Journeys
// -----------------------------------------------------------------------------
//
// Loads the authenticated user's Journey projections.
//
// Responsibilities:
// - execute the authenticated My Journeys API query;
// - expose loading/error/data state;
// - provide an explicit refetch operation.
//
// Authentication is handled by authenticatedApiClient.
// This hook does not access session storage directly.
//
// The returned Journey state is authoritative backend projection data.
// The hook does not recreate Journey domain behavior or lifecycle rules.
//
// -----------------------------------------------------------------------------

"use client";

import { useCallback, useEffect, useState } from "react";

import { getMyJourneys } from "../../api/journeys/get-my-journeys";
import type { MyJourney } from "../../models/my-journey";

// -----------------------------------------------------------------------------
// Result
// -----------------------------------------------------------------------------

export interface UseMyJourneysResult {
  readonly journeys: MyJourney[];
  readonly isLoading: boolean;
  readonly error: Error | null;
  readonly refetch: () => Promise<void>;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useMyJourneys(): UseMyJourneysResult {
  const [journeys, setJourneys] = useState<MyJourney[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadJourneys = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getMyJourneys();

      setJourneys(result);
    } catch (cause: unknown) {
      const nextError =
        cause instanceof Error
          ? cause
          : new Error("Failed to load your journeys.");

      setError(nextError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getMyJourneys();

        if (active) {
          setJourneys(result);
        }
      } catch (cause: unknown) {
        if (active) {
          const nextError =
            cause instanceof Error
              ? cause
              : new Error("Failed to load your journeys.");

          setError(nextError);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  return {
    journeys,
    isLoading,
    error,
    refetch: loadJourneys,
  };
}
