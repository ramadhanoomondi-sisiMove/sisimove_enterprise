// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Hook
// -----------------------------------------------------------------------------
//
// React hook for retrieving and managing a public Traveller Profile.
//
// Responsibilities:
// - Manage profile loading state.
// - Manage mapped profile data.
// - Manage request errors.
// - Support explicit profile loading.
// - Support refresh of the latest requested profile.
// - Prevent stale requests from overwriting newer results.
// - Provide reset behavior.
//
// Non-responsibilities:
// - No business rules.
// - No authentication logic.
// - No authorization logic.
// - No HTTP transport implementation.
// - No response normalization.
// - No transport-to-feature mapping.
//
// Boundary:
//
// API transport
//      ↓
// PublicTravellerProfileResponse
//      ↓
// TravellerProfileMapper
//      ↓
// TravellerProfile
//      ↓
// Hook state
//      ↓
// UI
//
// Trust is intentionally outside this hook.
// Trust belongs to:
//
// features/trust/
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import {
  useCallback,
  useRef,
  useState,
} from 'react';

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

import {
  getPublicTravellerProfile,
} from '../api';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import {
  travellerProfileMapper,
} from '../mappers';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

import type {
  TravellerProfile,
} from '../models';

// -----------------------------------------------------------------------------
// Hook State
// -----------------------------------------------------------------------------

export interface UseTravellerProfileState {
  /**
   * Mapped Traveller Profile feature model.
   */
  data: TravellerProfile | null;

  /**
   * True while the first profile load is in progress.
   */
  isLoading: boolean;

  /**
   * True while an existing profile is being refreshed.
   *
   * Existing data remains available while refreshing.
   */
  isRefreshing: boolean;

  /**
   * Most recent request error.
   */
  error: Error | null;
}

// -----------------------------------------------------------------------------
// Hook Result
// -----------------------------------------------------------------------------

export interface UseTravellerProfileResult
  extends UseTravellerProfileState {
  /**
   * Explicitly loads a traveller profile by social handle.
   */
  load: (
    handle: string,
  ) => Promise<TravellerProfile | null>;

  /**
   * Refreshes the most recently requested traveller profile.
   */
  refresh: () => Promise<TravellerProfile | null>;

  /**
   * Clears the current profile state and invalidates in-flight requests.
   */
  reset: () => void;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function normalizeHandle(
  value: string | null | undefined,
): string {
  return value?.trim() ?? '';
}

function normalizeError(
  cause: unknown,
): Error {
  if (cause instanceof Error) {
    return cause;
  }

  return new Error(
    'Unable to load the traveller profile.',
  );
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useTravellerProfile(
  initialHandle?: string,
): UseTravellerProfileResult {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const [data, setData] =
    useState<TravellerProfile | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [error, setError] =
    useState<Error | null>(null);

  // ---------------------------------------------------------------------------
  // Request State
  // ---------------------------------------------------------------------------

  /**
   * Latest successfully requested/current handle.
   */
  const latestHandleRef =
    useRef<string | null>(
      normalizeHandle(initialHandle) || null,
    );

  /**
   * Indicates whether successful profile data currently exists.
   */
  const hasDataRef =
    useRef(false);

  /**
   * Monotonically increasing request identifier.
   *
   * Only the latest request may commit state.
   */
  const requestSequenceRef =
    useRef(0);

  // ---------------------------------------------------------------------------
  // Load
  // ---------------------------------------------------------------------------

  const load = useCallback(
    async (
      handle: string,
    ): Promise<TravellerProfile | null> => {
      const normalizedHandle =
        normalizeHandle(handle);

      const requestSequence =
        ++requestSequenceRef.current;

      // -----------------------------------------------------------------------
      // Validate Handle
      // -----------------------------------------------------------------------

      if (!normalizedHandle) {
        if (
          requestSequence ===
          requestSequenceRef.current
        ) {
          latestHandleRef.current = null;
          hasDataRef.current = false;

          setData(null);
          setError(
            new Error(
              'Traveller handle is required.',
            ),
          );
          setIsLoading(false);
          setIsRefreshing(false);
        }

        return null;
      }

      // -----------------------------------------------------------------------
      // Track Request
      // -----------------------------------------------------------------------

      latestHandleRef.current =
        normalizedHandle;

      const hasExistingData =
        hasDataRef.current;

      setError(null);

      if (hasExistingData) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      // -----------------------------------------------------------------------
      // Request
      // -----------------------------------------------------------------------

      try {
        const response =
          await getPublicTravellerProfile(
            normalizedHandle,
          );

        // ---------------------------------------------------------------------
        // Ignore Stale Response
        // ---------------------------------------------------------------------

        if (
          requestSequence !==
          requestSequenceRef.current
        ) {
          return null;
        }

        // ---------------------------------------------------------------------
        // Map Transport → Feature Model
        // ---------------------------------------------------------------------

        const profile =
          travellerProfileMapper.map(
            response,
          );

        // ---------------------------------------------------------------------
        // Commit State
        // ---------------------------------------------------------------------

        hasDataRef.current = true;

        setData(profile);
        setError(null);

        return profile;
      } catch (cause: unknown) {
        // ---------------------------------------------------------------------
        // Ignore Stale Error
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

        // Deliberately preserve existing data.
        //
        // This is important during refresh: a temporary network/API
        // failure must not erase a profile that was already rendered.

        return null;
      } finally {
        // ---------------------------------------------------------------------
        // Complete Only Current Request
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
    async (): Promise<TravellerProfile | null> => {
      const handle =
        latestHandleRef.current;

      if (!handle) {
        return null;
      }

      return load(handle);
    },
    [load],
  );

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------

  const reset = useCallback(() => {
    // -------------------------------------------------------------------------
    // Invalidate In-Flight Requests
    // -------------------------------------------------------------------------

    requestSequenceRef.current += 1;

    // -------------------------------------------------------------------------
    // Reset Internal State
    // -------------------------------------------------------------------------

    hasDataRef.current = false;

    latestHandleRef.current =
      normalizeHandle(initialHandle) || null;

    // -------------------------------------------------------------------------
    // Reset React State
    // -------------------------------------------------------------------------

    setData(null);
    setError(null);
    setIsLoading(false);
    setIsRefreshing(false);
  }, [initialHandle]);

  // ---------------------------------------------------------------------------
  // Result
  // ---------------------------------------------------------------------------

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    load,
    refresh,
    reset,
  };
}