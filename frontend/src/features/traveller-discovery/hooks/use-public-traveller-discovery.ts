// -----------------------------------------------------------------------------
// Public Traveller Discovery Hook
// -----------------------------------------------------------------------------
//
// React hook for consuming the public traveller-discovery API.
//
// Responsibilities:
//
// - Execute public traveller discovery
// - Track initial loading state
// - Track refresh state
// - Track errors
// - Expose the latest discovery result
// - Preserve existing data during refresh
// - Prevent stale requests from overwriting newer results
// - Allow the latest search to be repeated
//
// The API layer is responsible for:
//
// - HTTP transport
// - Response normalization
// - Mapping transport data into PublicTravellerDiscovery
//
// The discovery response already composes:
//
// - Public Traveller
// - Public Trust
// - Public Journey activity
// - Public Journey Demand activity
//
// Trust is therefore NOT fetched separately for each traveller.
//
// The hook does not automatically fetch from an effect.
//
// Consumers explicitly call `search()` when discovery should begin. This keeps
// data fetching explicit and avoids cascading renders caused by state updates
// inside effects.
//
// -----------------------------------------------------------------------------

'use client';

import {
  useCallback,
  useRef,
  useState,
} from 'react';

import {
  discoverPublicTravellers,
} from '../api';

import type {
  PublicTravellerDiscovery,
  PublicTravellerDiscoveryQuery,
} from '../models';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

export interface UsePublicTravellerDiscoveryState {
  /**
   * Latest successfully normalized discovery response.
   *
   * Existing data is intentionally preserved while a refresh is running.
   */
  data: PublicTravellerDiscovery | null;

  /**
   * Indicates that discovery is loading without existing data.
   */
  isLoading: boolean;

  /**
   * Indicates that discovery is being refreshed while existing data remains
   * available.
   */
  isRefreshing: boolean;

  /**
   * Latest discovery error.
   *
   * A successful request clears the previous error.
   */
  error: Error | null;
}

// -----------------------------------------------------------------------------
// Result
// -----------------------------------------------------------------------------

export interface UsePublicTravellerDiscoveryResult
  extends UsePublicTravellerDiscoveryState {
  /**
   * Executes a discovery search.
   *
   * The supplied query becomes the latest query and is used by `refresh()`.
   */
  search: (
    query?: PublicTravellerDiscoveryQuery,
  ) => Promise<PublicTravellerDiscovery | null>;

  /**
   * Re-executes the most recent discovery query.
   */
  refresh: () => Promise<PublicTravellerDiscovery | null>;

  /**
   * Clears the current discovery state and invalidates in-flight requests.
   */
  reset: () => void;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function usePublicTravellerDiscovery(): UsePublicTravellerDiscoveryResult {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const [data, setData] =
    useState<PublicTravellerDiscovery | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [error, setError] =
    useState<Error | null>(null);

  // ---------------------------------------------------------------------------
  // Refs
  // ---------------------------------------------------------------------------

  /**
   * Stores the latest successfully submitted query without causing a render
   * when it changes.
   */
  const latestQueryRef =
    useRef<PublicTravellerDiscoveryQuery>({});

  /**
   * Tracks whether a successful discovery response currently exists.
   *
   * This allows search lifecycle state to distinguish an initial load from
   * a refresh without introducing additional React state dependencies.
   */
  const hasDataRef =
    useRef(false);

  /**
   * Monotonically increasing request identifier.
   *
   * Only the latest request is allowed to update React state.
   */
  const requestSequenceRef =
    useRef(0);

  // ---------------------------------------------------------------------------
  // Search
  // ---------------------------------------------------------------------------

  const search = useCallback(
    async (
      query: PublicTravellerDiscoveryQuery = {},
    ): Promise<PublicTravellerDiscovery | null> => {
      const requestSequence =
        ++requestSequenceRef.current;

      const hasExistingData =
        hasDataRef.current;

      latestQueryRef.current = query;

      setError(null);

      if (hasExistingData) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        // ---------------------------------------------------------------------
        // API Request
        // ---------------------------------------------------------------------

        /**
         * The API layer performs transport handling and response mapping.
         *
         * Therefore this hook receives an already normalized
         * PublicTravellerDiscovery model.
         */
        const result =
          await discoverPublicTravellers(query);

        // ---------------------------------------------------------------------
        // Stale Request Protection
        // ---------------------------------------------------------------------

        if (
          requestSequence !== requestSequenceRef.current
        ) {
          return null;
        }

        // ---------------------------------------------------------------------
        // Commit Result
        // ---------------------------------------------------------------------

        hasDataRef.current = true;

        setData(result);

        return result;
      } catch (cause: unknown) {
        // ---------------------------------------------------------------------
        // Ignore Stale Errors
        // ---------------------------------------------------------------------

        if (
          requestSequence !== requestSequenceRef.current
        ) {
          return null;
        }

        const normalizedError =
          cause instanceof Error
            ? cause
            : new Error(
                'Unable to discover travellers.',
              );

        setError(normalizedError);

        return null;
      } finally {
        // ---------------------------------------------------------------------
        // Loading Lifecycle
        // ---------------------------------------------------------------------

        if (
          requestSequence === requestSequenceRef.current
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
    async (): Promise<PublicTravellerDiscovery | null> => {
      return search(latestQueryRef.current);
    },
    [search],
  );

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------

  const reset = useCallback((): void => {
    /**
     * Invalidate all in-flight requests.
     *
     * Responses belonging to those requests will be ignored when they resolve.
     */
    requestSequenceRef.current += 1;

    hasDataRef.current = false;

    latestQueryRef.current = {};

    setData(null);
    setError(null);
    setIsLoading(false);
    setIsRefreshing(false);
  }, []);

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    search,
    refresh,
    reset,
  };
}