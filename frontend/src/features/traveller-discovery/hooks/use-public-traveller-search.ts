// -----------------------------------------------------------------------------
// Public Traveller Search Hook
// -----------------------------------------------------------------------------
//
// React hook for managing the public traveller-discovery search experience.
//
// Responsibilities:
//
// - Maintain the current search criteria
// - Update individual search criteria
// - Submit discovery searches
// - Refresh the current search
// - Reset search criteria
// - Expose discovery loading/error/result state
//
// This hook does not contain business rules.
//
// Backend responsibilities include:
//
// - Public visibility
// - Journey/demand eligibility
// - Route matching
// - Date matching
// - Safe location exposure
// - Trust/read-model composition
//
// Trust is NOT fetched independently by this hook.
//
// The discovery endpoint returns the composed public read model:
//
//   Traveller + Trust + Journey/Demand Activities
//
// The API layer normalizes the transport response before this hook receives it.
//
// -----------------------------------------------------------------------------

'use client';

import {
  useCallback,
  useState,
} from 'react';

import {
  usePublicTravellerDiscovery,
} from './use-public-traveller-discovery';

import type {
  PublicTravellerDiscovery,
  PublicTravellerDiscoveryActivityFilter,
  PublicTravellerDiscoveryQuery,
} from '../models';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

export interface UsePublicTravellerSearchState {
  /**
   * Current editable search criteria.
   *
   * These values represent the search form state and do not necessarily
   * represent the most recently submitted search.
   */
  query: PublicTravellerDiscoveryQuery;

  /**
   * Latest successful discovery response.
   *
   * The response includes the composed public traveller, trust, and activity
   * projections.
   */
  data: PublicTravellerDiscovery | null;

  /**
   * Indicates that the initial/current search is loading without existing data.
   */
  isLoading: boolean;

  /**
   * Indicates that an existing result is being refreshed.
   */
  isRefreshing: boolean;

  /**
   * Latest search error.
   */
  error: Error | null;
}

// -----------------------------------------------------------------------------
// Result
// -----------------------------------------------------------------------------

export interface UsePublicTravellerSearchResult
  extends UsePublicTravellerSearchState {
  /**
   * Updates the origin search value.
   */
  setFrom: (from: string) => void;

  /**
   * Updates the destination search value.
   */
  setTo: (to: string) => void;

  /**
   * Updates the requested travel date.
   */
  setDate: (date: string | undefined) => void;

  /**
   * Updates the activity filter.
   *
   * Passing undefined clears the activity filter.
   */
  setType: (
    type:
      | PublicTravellerDiscoveryActivityFilter
      | undefined,
  ) => void;

  /**
   * Replaces the complete search query.
   */
  setQuery: (
    query: PublicTravellerDiscoveryQuery,
  ) => void;

  /**
   * Executes discovery using the current search criteria.
   */
  search: () => Promise<PublicTravellerDiscovery | null>;

  /**
   * Executes discovery using a supplied query and updates the current
   * search criteria.
   */
  searchWith: (
    query: PublicTravellerDiscoveryQuery,
  ) => Promise<PublicTravellerDiscovery | null>;

  /**
   * Re-executes the current search criteria.
   */
  refresh: () => Promise<PublicTravellerDiscovery | null>;

  /**
   * Resets the search criteria and discovery result.
   */
  reset: () => void;
}

// -----------------------------------------------------------------------------
// Query Normalization
// -----------------------------------------------------------------------------

/**
 * Normalizes user-entered discovery criteria without applying business rules.
 *
 * This only removes meaningless empty strings.
 *
 * Route matching, location resolution, date validation, visibility, and
 * eligibility remain backend responsibilities.
 */
function normalizeDiscoveryQuery(
  query: PublicTravellerDiscoveryQuery,
): PublicTravellerDiscoveryQuery {
  return {
    from:
      query.from?.trim() || undefined,

    to:
      query.to?.trim() || undefined,

    date:
      query.date?.trim() || undefined,

    type:
      query.type || undefined,
  };
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function usePublicTravellerSearch(
  initialQuery: PublicTravellerDiscoveryQuery = {},
): UsePublicTravellerSearchResult {
  // ---------------------------------------------------------------------------
  // Initial Query
  // ---------------------------------------------------------------------------

  const normalizedInitialQuery =
    normalizeDiscoveryQuery(initialQuery);

  // ---------------------------------------------------------------------------
  // Search Query
  // ---------------------------------------------------------------------------

  const [query, setQueryState] =
    useState<PublicTravellerDiscoveryQuery>(
      normalizedInitialQuery,
    );

  // ---------------------------------------------------------------------------
  // Discovery
  // ---------------------------------------------------------------------------

  const {
    data,
    isLoading,
    isRefreshing,
    error,
    search: discover,
    reset: resetDiscovery,
  } = usePublicTravellerDiscovery();

  // ---------------------------------------------------------------------------
  // Field Updates
  // ---------------------------------------------------------------------------

  const setFrom = useCallback(
    (from: string): void => {
      setQueryState((current) => ({
        ...current,
        from:
          from.trim() || undefined,
      }));
    },
    [],
  );

  const setTo = useCallback(
    (to: string): void => {
      setQueryState((current) => ({
        ...current,
        to:
          to.trim() || undefined,
      }));
    },
    [],
  );

  const setDate = useCallback(
    (date: string | undefined): void => {
      setQueryState((current) => ({
        ...current,
        date:
          date?.trim() || undefined,
      }));
    },
    [],
  );

  const setType = useCallback(
    (
      type:
        | PublicTravellerDiscoveryActivityFilter
        | undefined,
    ): void => {
      setQueryState((current) => ({
        ...current,
        type:
          type || undefined,
      }));
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Complete Query
  // ---------------------------------------------------------------------------

  const setQuery = useCallback(
    (
      nextQuery: PublicTravellerDiscoveryQuery,
    ): void => {
      setQueryState(
        normalizeDiscoveryQuery(nextQuery),
      );
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Search
  // ---------------------------------------------------------------------------

  const search = useCallback(
    async (): Promise<PublicTravellerDiscovery | null> => {
      const normalizedQuery =
        normalizeDiscoveryQuery(query);

      return discover(normalizedQuery);
    },
    [discover, query],
  );

  // ---------------------------------------------------------------------------
  // Search With
  // ---------------------------------------------------------------------------

  const searchWith = useCallback(
    async (
      nextQuery: PublicTravellerDiscoveryQuery,
    ): Promise<PublicTravellerDiscovery | null> => {
      const normalizedQuery =
        normalizeDiscoveryQuery(nextQuery);

      setQueryState(normalizedQuery);

      return discover(normalizedQuery);
    },
    [discover],
  );

  // ---------------------------------------------------------------------------
  // Refresh
  // ---------------------------------------------------------------------------

  const refresh = useCallback(
    async (): Promise<PublicTravellerDiscovery | null> => {
      const normalizedQuery =
        normalizeDiscoveryQuery(query);

      return discover(normalizedQuery);
    },
    [discover, query],
  );

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------

  const reset = useCallback((): void => {
    setQueryState(
      normalizeDiscoveryQuery(initialQuery),
    );

    resetDiscovery();
  }, [initialQuery, resetDiscovery]);

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    query,
    data,
    isLoading,
    isRefreshing,
    error,

    setFrom,
    setTo,
    setDate,
    setType,
    setQuery,

    search,
    searchWith,
    refresh,
    reset,
  };
}