// -----------------------------------------------------------------------------
// sisiMove — Use Public Journeys
// -----------------------------------------------------------------------------
//
// Loads the public Journey marketplace projection.
//
// Responsibilities:
// - execute the public Journey API query;
// - expose loading/error/data state;
// - provide an explicit refetch operation.
//
// The hook does not:
// - construct Journey domain objects;
// - apply Journey lifecycle rules;
// - perform client-side filtering;
// - create Journey domain behavior.
//
// Query parameters are passed to the backend public Journey projection.
//
// -----------------------------------------------------------------------------

"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getPublicJourneys,
  type GetPublicJourneysQuery,
} from "../../api/journeys/get-public-journeys";

import type { PublicJourney } from "../../models/public-journey";

export interface UsePublicJourneysResult {
  readonly journeys: PublicJourney[];
  readonly isLoading: boolean;
  readonly error: Error | null;
  readonly refetch: () => Promise<void>;
}

export function usePublicJourneys(
  query: GetPublicJourneysQuery = {},
): UsePublicJourneysResult {
  const [journeys, setJourneys] = useState<PublicJourney[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const from = query.from?.trim() ?? "";
  const to = query.to?.trim() ?? "";
  const date = query.date?.trim() ?? "";

  const loadJourneys = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getPublicJourneys({
        from: from || undefined,
        to: to || undefined,
        date: date || undefined,
      });

      setJourneys(result);
    } catch (cause) {
      const nextError =
        cause instanceof Error
          ? cause
          : new Error("Failed to load public journeys.");

      setError(nextError);
    } finally {
      setIsLoading(false);
    }
  }, [from, to, date]);

  useEffect(() => {
    const task = Promise.resolve().then(loadJourneys);

    return () => {
      void task;
    };
  }, [loadJourneys]);

  return {
    journeys,
    isLoading,
    error,
    refetch: loadJourneys,
  };
}