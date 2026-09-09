// -----------------------------------------------------------------------------
// sisiMove — Use Journey Demands
// -----------------------------------------------------------------------------
//
// React hook for retrieving multiple public Journey Demands.
//
// The public Journey Demand collection/discovery experience is owned by the
// traveller-discovery read model.
//
// This hook therefore resolves a collection of already-known public Journey
// Demand identifiers. It does not implement public search or discovery logic.
//
// Architectural boundary:
//
// Journey Demand API
//       ↓
// JourneyDemandResponse[]
//       ↓
// JourneyDemandMapper
//       ↓
// JourneyDemand[]
//       ↓
// React state
//
// This hook must:
// - contain no business logic
// - contain no persistence concerns
// - contain no discovery/search rules
// - use the Journey Demand API layer for HTTP operations
// - map transport responses through JourneyDemandMapper
// - protect state from stale asynchronous responses
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import { useCallback, useRef, useState } from 'react';

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

import { journeyDemandsApi } from '../api';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import { journeyDemandMapper } from '../mappers';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

import type { JourneyDemand } from '../models';

// -----------------------------------------------------------------------------
// Hook State
// -----------------------------------------------------------------------------

export interface UseJourneyDemandsState {
  journeyDemands: JourneyDemand[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
}

// -----------------------------------------------------------------------------
// Hook Result
// -----------------------------------------------------------------------------

export interface UseJourneyDemandsResult
  extends UseJourneyDemandsState {
  load: (publicIds: string[]) => Promise<JourneyDemand[]>;
  refresh: () => Promise<JourneyDemand[]>;
  reset: () => void;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function normalizePublicIds(
  publicIds: string[],
): string[] {
  return Array.from(
    new Set(
      publicIds
        .map((publicId) => publicId.trim())
        .filter(Boolean),
    ),
  );
}

function normalizeError(cause: unknown): Error {
  if (cause instanceof Error) {
    return cause;
  }

  return new Error('Unable to load Journey Demands.');
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourneyDemands(): UseJourneyDemandsResult {
  const [journeyDemands, setJourneyDemands] =
    useState<JourneyDemand[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const requestSequenceRef = useRef(0);
  const publicIdsRef = useRef<string[]>([]);
  const hasDataRef = useRef(false);

  // ---------------------------------------------------------------------------
  // Load
  // ---------------------------------------------------------------------------

  const load = useCallback(
    async (publicIds: string[]): Promise<JourneyDemand[]> => {
      const normalizedPublicIds =
        normalizePublicIds(publicIds);

      const requestSequence =
        ++requestSequenceRef.current;

      publicIdsRef.current = normalizedPublicIds;

      setError(null);

      // -----------------------------------------------------------------------
      // Empty collection
      // -----------------------------------------------------------------------

      if (normalizedPublicIds.length === 0) {
        if (requestSequence === requestSequenceRef.current) {
          hasDataRef.current = false;

          setJourneyDemands([]);
          setIsLoading(false);
          setIsRefreshing(false);
        }

        return [];
      }

      const hasExistingData = hasDataRef.current;

      if (hasExistingData) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      // -----------------------------------------------------------------------
      // Load
      // -----------------------------------------------------------------------

      try {
        const responses = await Promise.all(
          normalizedPublicIds.map((publicId) =>
            journeyDemandsApi.getPublic(publicId),
          ),
        );

        if (
          requestSequence !==
          requestSequenceRef.current
        ) {
          return [];
        }

        const mappedJourneyDemands = responses.map(
          (response) => journeyDemandMapper.map(response),
        );

        hasDataRef.current = true;

        setJourneyDemands(mappedJourneyDemands);
        setError(null);

        return mappedJourneyDemands;
      } catch (cause) {
        if (
          requestSequence !==
          requestSequenceRef.current
        ) {
          return [];
        }

        setError(normalizeError(cause));

        return [];
      } finally {
        if (
          requestSequence ===
          requestSequenceRef.current
        ) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Refresh
  // ---------------------------------------------------------------------------

  const refresh = useCallback(
    async (): Promise<JourneyDemand[]> => {
      return load(publicIdsRef.current);
    },
    [load],
  );

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------

  const reset = useCallback(() => {
    requestSequenceRef.current += 1;

    publicIdsRef.current = [];
    hasDataRef.current = false;

    setJourneyDemands([]);
    setIsLoading(false);
    setIsRefreshing(false);
    setError(null);
  }, []);

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    journeyDemands,
    isLoading,
    isRefreshing,
    error,
    load,
    refresh,
    reset,
  };
}