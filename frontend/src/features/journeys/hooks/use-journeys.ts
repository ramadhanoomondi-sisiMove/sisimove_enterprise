// -----------------------------------------------------------------------------
// Use Journeys
// -----------------------------------------------------------------------------
//
// React hook for retrieving publicly discoverable Journeys.
//
// Public Journey discovery is Journey-first:
//
//   GET /journeys/status/PUBLISHED
//
// Search is delegated to the Journey domain:
//
//   GET /journeys/search?from=&to=&date=
//
// The backend Journey domain owns both the published Journey collection and
// Journey search. This hook therefore does not perform discovery filtering
// locally and does not depend on a traveller-discovery endpoint.
//
// A single Journey can subsequently be resolved through useJourney() using its
// public identifier.
// -----------------------------------------------------------------------------

import { useCallback, useRef, useState } from 'react';

import { journeysApi } from '../api';
import type { Journey } from '../models';

// -----------------------------------------------------------------------------
// Search Values
// -----------------------------------------------------------------------------

export interface UseJourneysSearchValues {
  from: string;
  to: string;
  date: string;
}

// -----------------------------------------------------------------------------
// Hook State
// -----------------------------------------------------------------------------

export interface UseJourneysState {
  journeys: Journey[];
  isLoading: boolean;
  error: Error | null;
}

// -----------------------------------------------------------------------------
// Hook Result
// -----------------------------------------------------------------------------

export interface UseJourneysResult extends UseJourneysState {
  load: () => Promise<Journey[]>;
  search: (values: UseJourneysSearchValues) => Promise<Journey[]>;
  refresh: () => Promise<Journey[]>;
  reset: () => void;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourneys(): UseJourneysResult {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const requestSequenceRef = useRef(0);

  // ---------------------------------------------------------------------------
  // Load Published Journeys
  // ---------------------------------------------------------------------------

  const load = useCallback(async () => {
    const requestSequence = ++requestSequenceRef.current;

    setIsLoading(true);
    setError(null);

    try {
      const results = await journeysApi.getPublished();

      if (requestSequence !== requestSequenceRef.current) {
        return [];
      }

      setJourneys(results);

      return results;
    } catch (cause) {
      if (requestSequence !== requestSequenceRef.current) {
        return [];
      }

      const normalizedError =
        cause instanceof Error
          ? cause
          : new Error('Unable to load published Journeys.');

      setJourneys([]);
      setError(normalizedError);

      return [];
    } finally {
      if (requestSequence === requestSequenceRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Search Published Journeys
  // ---------------------------------------------------------------------------

  /**
   * Searches published Journeys using the Journey backend search operation.
   *
   * No filtering is performed in the frontend.
   *
   * The latest request wins. A stale response cannot replace the results of
   * a newer search or load operation.
   */
  const search = useCallback(
    async ({
      from,
      to,
      date,
    }: UseJourneysSearchValues): Promise<Journey[]> => {
      const requestSequence = ++requestSequenceRef.current;

      setIsLoading(true);
      setError(null);

      try {
        const results = await journeysApi.searchPublished(
          from,
          to,
          date,
        );

        if (requestSequence !== requestSequenceRef.current) {
          return [];
        }

        setJourneys(results);

        return results;
      } catch (cause) {
        if (requestSequence !== requestSequenceRef.current) {
          return [];
        }

        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error('Unable to search published Journeys.');

        setJourneys([]);
        setError(normalizedError);

        return [];
      } finally {
        if (requestSequence === requestSequenceRef.current) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Refresh
  // ---------------------------------------------------------------------------

  const refresh = useCallback(async () => {
    return load();
  }, [load]);

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------

  const reset = useCallback(() => {
    requestSequenceRef.current += 1;

    setJourneys([]);
    setIsLoading(false);
    setError(null);
  }, []);

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    journeys,
    isLoading,
    error,
    load,
    search,
    refresh,
    reset,
  };
}