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
  journeyDemand: JourneyDemand | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
}

// -----------------------------------------------------------------------------
// Hook Result
// -----------------------------------------------------------------------------

export interface UseJourneyDemandResult
  extends UseJourneyDemandState {
  load: (publicId: string) => Promise<JourneyDemand | null>;
  refresh: () => Promise<JourneyDemand | null>;
  reset: () => void;
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

  return new Error('Unable to load Journey Demand.');
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourneyDemand(): UseJourneyDemandResult {
  const [journeyDemand, setJourneyDemand] =
    useState<JourneyDemand | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const requestSequenceRef = useRef(0);
  const publicIdRef = useRef<string | null>(null);
  const hasDataRef = useRef(false);

  // ---------------------------------------------------------------------------
  // Load
  // ---------------------------------------------------------------------------

  const load = useCallback(
    async (publicId: string): Promise<JourneyDemand | null> => {
      const normalizedPublicId = normalizePublicId(publicId);

      const requestSequence = ++requestSequenceRef.current;

      if (!normalizedPublicId) {
        if (requestSequence === requestSequenceRef.current) {
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

      publicIdRef.current = normalizedPublicId;

      const hasExistingData = hasDataRef.current;

      setError(null);

      if (hasExistingData) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const response =
          await journeyDemandsApi.getPublic(
            normalizedPublicId,
          );

        if (
          requestSequence !==
          requestSequenceRef.current
        ) {
          return null;
        }

        const mappedJourneyDemand =
          journeyDemandMapper.map(response);

        hasDataRef.current = true;

        setJourneyDemand(mappedJourneyDemand);
        setError(null);

        return mappedJourneyDemand;
      } catch (cause) {
        if (
          requestSequence !==
          requestSequenceRef.current
        ) {
          return null;
        }

        setError(normalizeError(cause));

        return null;
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

  const refresh = useCallback(async (): Promise<JourneyDemand | null> => {
    const publicId = publicIdRef.current;

    if (!publicId) {
      return null;
    }

    return load(publicId);
  }, [load]);

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------

  const reset = useCallback(() => {
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