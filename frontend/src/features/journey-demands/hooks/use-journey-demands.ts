// -----------------------------------------------------------------------------
// sisiMove — Use Journey Demands
// -----------------------------------------------------------------------------
//
// React hook for retrieving the public Journey Demand collection.
//
// Public Journey Demand discovery is provided directly by the Journey Demand
// bounded context:
//
//   GET /journey-demands/open
//
// The hook does not:
// - resolve individual public IDs;
// - perform client-side filtering;
// - implement discovery rules;
// - perform matching;
// - own HTTP concerns.
//
// The API owns which Journey Demands are publicly discoverable.
//
// Architectural boundary:
//
// Journey Demand API
//       ↓
// JourneyDemandsResponse
//       ↓
// JourneyDemandMapper
//       ↓
// JourneyDemand[]
//       ↓
// React state
//
// This hook:
// - contains no business logic;
// - contains no persistence concerns;
// - contains no search or matching rules;
// - uses the Journey Demand API layer for HTTP operations;
// - maps transport responses through JourneyDemandMapper;
// - preserves existing data during refresh;
// - protects state from stale asynchronous responses.
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
  readonly journeyDemands: JourneyDemand[];
  readonly isLoading: boolean;
  readonly isRefreshing: boolean;
  readonly error: Error | null;
}


// -----------------------------------------------------------------------------
// Hook Result
// -----------------------------------------------------------------------------

export interface UseJourneyDemandsResult
  extends UseJourneyDemandsState {
  readonly load: () => Promise<JourneyDemand[]>;
  readonly refresh: () => Promise<JourneyDemand[]>;
  readonly reset: () => void;
}


// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function normalizeError(cause: unknown): Error {
  if (cause instanceof Error) {
    return cause;
  }

  return new Error(
    'Unable to load public Journey Demands.',
  );
}


// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourneyDemands(): UseJourneyDemandsResult {
  const [journeyDemands, setJourneyDemands] =
    useState<JourneyDemand[]>([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [error, setError] =
    useState<Error | null>(null);

  // ---------------------------------------------------------------------------
  // Request sequencing
  // ---------------------------------------------------------------------------
  //
  // Protects React state from stale asynchronous responses.
  //

  const requestSequenceRef =
    useRef(0);

  // ---------------------------------------------------------------------------
  // Successful-load tracking
  // ---------------------------------------------------------------------------
  //
  // An empty collection can be a valid successful response, so this must not
  // be inferred from journeyDemands.length.
  //

  const hasLoadedRef =
    useRef(false);

  // ---------------------------------------------------------------------------
  // Load
  // ---------------------------------------------------------------------------

  const load = useCallback(
    async (): Promise<JourneyDemand[]> => {
      const requestSequence =
        ++requestSequenceRef.current;

      const hasExistingData =
        hasLoadedRef.current;

      setError(null);

      if (hasExistingData) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        // ---------------------------------------------------------------------
        // Retrieve the backend-authoritative public/open collection.
        // ---------------------------------------------------------------------

        const response =
          await journeyDemandsApi.getOpen();

        // ---------------------------------------------------------------------
        // Ignore stale responses.
        // ---------------------------------------------------------------------

        if (
          requestSequence !==
          requestSequenceRef.current
        ) {
          return [];
        }

        // ---------------------------------------------------------------------
        // Map transport records into frontend feature models.
        //
        // JourneyDemandsResponse is a plain array:
        //
        //   JourneyDemandResponse[]
        //
        // Therefore the records are mapped directly from `response`.
        // ---------------------------------------------------------------------

        const mappedJourneyDemands =
          response.map((item) =>
            journeyDemandMapper.map(item),
          );

        // ---------------------------------------------------------------------
        // Mark the collection as successfully loaded.
        //
        // This remains true even when the backend returns an empty array.
        // ---------------------------------------------------------------------

        hasLoadedRef.current = true;

        setJourneyDemands(
          mappedJourneyDemands,
        );

        setError(null);

        return mappedJourneyDemands;
      } catch (cause) {
        // ---------------------------------------------------------------------
        // Ignore errors from stale requests.
        // ---------------------------------------------------------------------

        if (
          requestSequence !==
          requestSequenceRef.current
        ) {
          return [];
        }

        setError(
          normalizeError(cause),
        );

        // ---------------------------------------------------------------------
        // Preserve the previous successful collection during refresh failure.
        // ---------------------------------------------------------------------

        return [];
      } finally {
        // ---------------------------------------------------------------------
        // Only the current request may change loading state.
        // ---------------------------------------------------------------------

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
      return load();
    },
    [load],
  );

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------

  const reset = useCallback(() => {
    // -------------------------------------------------------------------------
    // Invalidate any request currently in flight.
    // -------------------------------------------------------------------------

    requestSequenceRef.current += 1;

    hasLoadedRef.current = false;

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