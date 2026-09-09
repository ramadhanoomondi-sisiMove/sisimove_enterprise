// -----------------------------------------------------------------------------
// Use Journeys
// -----------------------------------------------------------------------------
//
// React hook for retrieving multiple public Journeys.
//
// The Journey feature intentionally does not invent a generic public Journey
// collection endpoint. Public discovery is owned by the traveller-discovery
// read model:
//
//   GET /public/traveller-discovery
//
// This hook is therefore useful when a higher-level feature already has a
// collection of public Journey identifiers and needs to resolve their full
// Journey representations.
//
// -----------------------------------------------------------------------------

import { useCallback, useRef, useState } from 'react';

import { journeysApi } from '../api';
import type { Journey } from '../models';

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
  load: (publicIds: string[]) => Promise<Journey[]>;
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
  const publicIdsRef = useRef<string[]>([]);

  // ---------------------------------------------------------------------------
  // Load
  // ---------------------------------------------------------------------------

  const load = useCallback(async (publicIds: string[]) => {
    const normalizedPublicIds = Array.from(
      new Set(
        publicIds
          .map((publicId) => publicId.trim())
          .filter(Boolean),
      ),
    );

    publicIdsRef.current = normalizedPublicIds;

    const requestSequence = ++requestSequenceRef.current;

    setError(null);

    if (normalizedPublicIds.length === 0) {
      setJourneys([]);
      setIsLoading(false);

      return [];
    }

    setIsLoading(true);

    try {
      const results = await Promise.all(
        normalizedPublicIds.map((publicId) =>
          journeysApi.getPublic(publicId),
        ),
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
          : new Error('Unable to load Journeys.');

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
  // Refresh
  // ---------------------------------------------------------------------------

  const refresh = useCallback(async () => {
    return load(publicIdsRef.current);
  }, [load]);

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------

  const reset = useCallback(() => {
    requestSequenceRef.current += 1;
    publicIdsRef.current = [];

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
    refresh,
    reset,
  };
}