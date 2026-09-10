// -----------------------------------------------------------------------------
// sisiMove — Use Journey Demand
// -----------------------------------------------------------------------------
//
// React hook for retrieving a single public Journey Demand.
//
// Architectural boundary:
//
// Journey Demand API
//       ↓
// Transport response
//       ↓
// JourneyDemandMapper
//       ↓
// JourneyDemand feature model
//       ↓
// React state
//
// This hook owns request state for the Journey Demand feature while keeping
// HTTP concerns inside the Journey Demand API layer.
//
// Fetching is explicitly controlled through `load` and `refresh`.
// The hook does not perform automatic fetching through an effect.
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

export interface UseJourneyDemandState {
  readonly journeyDemand: JourneyDemand | null;
  readonly isLoading: boolean;
  readonly isRefreshing: boolean;
  readonly error: Error | null;
}


// -----------------------------------------------------------------------------
// Hook Result
// -----------------------------------------------------------------------------

export interface UseJourneyDemandResult
  extends UseJourneyDemandState {
  readonly load: (
    publicId: string,
  ) => Promise<JourneyDemand | null>;
  readonly refresh: () => Promise<JourneyDemand | null>;
  readonly reset: () => void;
}


// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function normalizePublicId(
  value: string | null | undefined,
): string {
  return value?.trim() ?? '';
}

function normalizeError(cause: unknown): Error {
  if (cause instanceof Error) {
    return cause;
  }

  return new Error(
    'Unable to load Journey Demand.',
  );
}


// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourneyDemand(): UseJourneyDemandResult {
  const [journeyDemand, setJourneyDemand] =
    useState<JourneyDemand | null>(null);

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
  // Prevents an older asynchronous request from overwriting state established
  // by a newer request.
  //

  const requestSequenceRef =
    useRef(0);

  // ---------------------------------------------------------------------------
  // Current public identifier
  // ---------------------------------------------------------------------------
  //
  // Used by refresh() to reload the currently selected Journey Demand.
  //

  const publicIdRef =
    useRef<string | null>(null);

  // ---------------------------------------------------------------------------
  // Successful-load tracking
  // ---------------------------------------------------------------------------
  //
  // Tracks successful data independently from the value itself.
  //

  const hasDataRef =
    useRef(false);

  // ---------------------------------------------------------------------------
  // Load
  // ---------------------------------------------------------------------------

  const load = useCallback(
    async (
      publicId: string,
    ): Promise<JourneyDemand | null> => {
      const normalizedPublicId =
        normalizePublicId(publicId);

      const requestSequence =
        ++requestSequenceRef.current;

      // -----------------------------------------------------------------------
      // Invalid identifier
      // -----------------------------------------------------------------------

      if (!normalizedPublicId) {
        if (
          requestSequence ===
          requestSequenceRef.current
        ) {
          publicIdRef.current = null;
          hasDataRef.current = false;

          setJourneyDemand(null);

          setError(
            new Error(
              'Journey Demand public ID is required.',
            ),
          );

          setIsLoading(false);
          setIsRefreshing(false);
        }

        return null;
      }

      // -----------------------------------------------------------------------
      // Remember the current Journey Demand.
      // -----------------------------------------------------------------------

      publicIdRef.current =
        normalizedPublicId;

      const hasExistingData =
        hasDataRef.current;

      setError(null);

      if (hasExistingData) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      // -----------------------------------------------------------------------
      // Load Journey Demand
      // -----------------------------------------------------------------------

      try {
        // ---------------------------------------------------------------------
        // Retrieve the Journey Demand through the bounded-context API.
        //
        // `get()` is the single-resource API operation.
        // ---------------------------------------------------------------------

        const response =
          await journeyDemandsApi.get(
            normalizedPublicId,
          );

        // ---------------------------------------------------------------------
        // Ignore stale responses.
        // ---------------------------------------------------------------------

        if (
          requestSequence !==
          requestSequenceRef.current
        ) {
          return null;
        }

        // ---------------------------------------------------------------------
        // Map transport representation into the feature model.
        // ---------------------------------------------------------------------

        const mappedJourneyDemand =
          journeyDemandMapper.map(response);

        hasDataRef.current = true;

        setJourneyDemand(
          mappedJourneyDemand,
        );

        setError(null);

        return mappedJourneyDemand;
      } catch (cause) {
        // ---------------------------------------------------------------------
        // Ignore errors from stale requests.
        // ---------------------------------------------------------------------

        if (
          requestSequence !==
          requestSequenceRef.current
        ) {
          return null;
        }

        setError(
          normalizeError(cause),
        );

        // ---------------------------------------------------------------------
        // Preserve existing data during refresh failure.
        // ---------------------------------------------------------------------

        return null;
      } finally {
        // ---------------------------------------------------------------------
        // Only the current request may update loading state.
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
    async (): Promise<JourneyDemand | null> => {
      const publicId =
        publicIdRef.current;

      if (!publicId) {
        return null;
      }

      return load(publicId);
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

    publicIdRef.current = null;
    hasDataRef.current = false;

    setJourneyDemand(null);
    setIsLoading(false);
    setIsRefreshing(false);
    setError(null);
  }, []);

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    journeyDemand,
    isLoading,
    isRefreshing,
    error,
    load,
    refresh,
    reset,
  };
}