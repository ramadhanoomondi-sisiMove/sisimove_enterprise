// -----------------------------------------------------------------------------
// Use Journey
// -----------------------------------------------------------------------------
//
// React hook for retrieving a single public Journey.
//
// This hook owns request state for the Journey feature while keeping HTTP
// concerns inside the Journey API layer.
//
// Public Journey retrieval is Journey-first:
//
//   GET /journeys/:journeyPublicId
//
// The hook intentionally does not fetch automatically through an effect.
// Consumers explicitly control retrieval through `load()` or `refresh()`.
//
// Stale requests are ignored so that an older response cannot overwrite the
// state produced by a newer request.
// -----------------------------------------------------------------------------

import { useCallback, useRef, useState } from 'react';

import { journeysApi } from '../api';
import type { Journey } from '../models';

// -----------------------------------------------------------------------------
// Hook State
// -----------------------------------------------------------------------------

export interface UseJourneyState {
  journey: Journey | null;
  isLoading: boolean;
  error: Error | null;
}

// -----------------------------------------------------------------------------
// Hook Result
// -----------------------------------------------------------------------------

export interface UseJourneyResult extends UseJourneyState {
  load: (publicId: string) => Promise<Journey | null>;
  refresh: () => Promise<Journey | null>;
  reset: () => void;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourney(): UseJourneyResult {
  const [journey, setJourney] = useState<Journey | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Monotonically increasing request identifier.
   *
   * Every new load invalidates the result of any previous request.
   */
  const requestSequenceRef = useRef(0);

  /**
   * Public identifier of the currently loaded Journey.
   *
   * Refresh uses this identifier without requiring the caller to provide it
   * again.
   */
  const publicIdRef = useRef<string | null>(null);

  // ---------------------------------------------------------------------------
  // Load
  // ---------------------------------------------------------------------------

  const load = useCallback(async (publicId: string) => {
    const normalizedPublicId = publicId.trim();

    if (!normalizedPublicId) {
      const validationError = new Error(
        'Journey public ID is required.',
      );

      /**
       * Invalidate any request that may still be in flight.
       */
      requestSequenceRef.current += 1;
      publicIdRef.current = null;

      setJourney(null);
      setError(validationError);
      setIsLoading(false);

      return null;
    }

    const requestSequence = ++requestSequenceRef.current;

    publicIdRef.current = normalizedPublicId;

    setIsLoading(true);
    setError(null);

    try {
      const result = await journeysApi.getPublic(normalizedPublicId);

      /**
       * Ignore a response belonging to an older request.
       */
      if (requestSequence !== requestSequenceRef.current) {
        return null;
      }

      setJourney(result);

      return result;
    } catch (cause) {
      /**
       * Ignore errors belonging to an older request.
       */
      if (requestSequence !== requestSequenceRef.current) {
        return null;
      }

      const normalizedError =
        cause instanceof Error
          ? cause
          : new Error('Unable to load Journey.');

      setJourney(null);
      setError(normalizedError);

      return null;
    } finally {
      /**
       * Only the current request may change the loading state.
       */
      if (requestSequence === requestSequenceRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Refresh
  // ---------------------------------------------------------------------------

  const refresh = useCallback(async () => {
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
    /**
     * Invalidate any request currently in flight.
     */
    requestSequenceRef.current += 1;
    publicIdRef.current = null;

    setJourney(null);
    setIsLoading(false);
    setError(null);
  }, []);

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    journey,
    isLoading,
    error,
    load,
    refresh,
    reset,
  };
}