// -----------------------------------------------------------------------------
// Use Journey
// -----------------------------------------------------------------------------
//
// React hook for retrieving a single public Journey.
//
// This hook owns request state for the Journey feature while keeping API
// concerns inside the Journey API layer.
//
// It intentionally does not use an effect for automatic fetching. The caller
// explicitly controls when the request is made through `load` or `refresh`.
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

  const requestSequenceRef = useRef(0);
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

      if (requestSequence !== requestSequenceRef.current) {
        return null;
      }

      setJourney(result);

      return result;
    } catch (cause) {
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