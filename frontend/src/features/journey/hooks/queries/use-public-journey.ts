// -----------------------------------------------------------------------------
// sisiMove — Use Public Journey
// -----------------------------------------------------------------------------
//
// Loads one public Journey marketplace/detail projection.
//
// Responsibilities:
// - execute the public Journey API query;
// - expose loading/error/data state;
// - provide an explicit refetch operation.
//
// The hook does not:
// - construct Journey domain objects;
// - apply Journey lifecycle rules;
// - fetch Traveller or Trust independently;
// - recreate Journey domain behavior.
//
// -----------------------------------------------------------------------------

"use client";

import { useCallback, useEffect, useState } from "react";

import { getPublicJourney } from "../../api/journeys/get-public-journey";
import type { PublicJourney } from "../../models/public-journey";

export interface UsePublicJourneyResult {
  readonly journey: PublicJourney | null;
  readonly isLoading: boolean;
  readonly error: Error | null;
  readonly refetch: () => Promise<void>;
}

export function usePublicJourney(
  journeyPublicId: string,
): UsePublicJourneyResult {
  const [journey, setJourney] = useState<PublicJourney | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const normalizedJourneyPublicId = journeyPublicId.trim();

  const loadJourney = useCallback(async () => {
    if (!normalizedJourneyPublicId) {
      setJourney(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getPublicJourney(normalizedJourneyPublicId);

      setJourney(result);
    } catch (cause) {
      const nextError =
        cause instanceof Error
          ? cause
          : new Error("Failed to load the public journey.");

      setJourney(null);
      setError(nextError);
    } finally {
      setIsLoading(false);
    }
  }, [normalizedJourneyPublicId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadJourney();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadJourney]);

  return {
    journey,
    isLoading,
    error,
    refetch: loadJourney,
  };
}