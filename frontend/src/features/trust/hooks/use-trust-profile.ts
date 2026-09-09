// -----------------------------------------------------------------------------
// sisiMove — Trust Profile Hook
// -----------------------------------------------------------------------------
//
// React application hook for loading a traveller's public Trust profile.
//
// This hook keeps request orchestration inside the Trust feature while
// exposing only the frontend Trust model to consuming components.
//
// Responsibilities:
// - Load a public Trust profile.
// - Track initial loading state.
// - Track refresh state when existing data is available.
// - Preserve existing data when a refresh fails.
// - Prevent stale requests from overwriting newer requests.
// - Keep the latest traveller handle available for refresh operations.
//
// This hook does not:
// - expose Trust domain entities;
// - calculate ratings;
// - determine verification status;
// - apply Trust business rules;
// - access persistence;
// - persist Trust data locally.
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
// Trust API
// -----------------------------------------------------------------------------

import {
  getPublicTrustProfile,
} from '../api';

// -----------------------------------------------------------------------------
// Trust Models
// -----------------------------------------------------------------------------

import type {
  TrustProfile,
} from '../models';

// -----------------------------------------------------------------------------
// Hook State
// -----------------------------------------------------------------------------

export interface UseTrustProfileState {
  /**
   * Currently loaded Trust profile.
   */
  data: TrustProfile | null;

  /**
   * Indicates that the initial profile request is in progress.
   *
   * This is true when there is no existing Trust profile data.
   */
  loading: boolean;

  /**
   * Indicates that a request is refreshing an existing Trust profile.
   *
   * Existing data remains available while the refresh is in progress.
   */
  refreshing: boolean;

  /**
   * Most recent request error.
   */
  error: Error | null;
}

// -----------------------------------------------------------------------------
// Hook Result
// -----------------------------------------------------------------------------

export interface UseTrustProfileResult
  extends UseTrustProfileState {
  /**
   * Loads a Trust profile.
   *
   * When no handle is supplied, the latest known handle is used.
   */
  load: (
    handle?: string,
  ) => Promise<TrustProfile | null>;

  /**
   * Refreshes the latest known Trust profile.
   */
  refresh: () => Promise<TrustProfile | null>;

  /**
   * Invalidates the current request and clears hook state.
   */
  reset: () => void;
}

// -----------------------------------------------------------------------------
// Handle Normalization
// -----------------------------------------------------------------------------

function normalizeHandle(
  value: string | null | undefined,
): string {
  return value?.trim() ?? '';
}

// -----------------------------------------------------------------------------
// Error Normalization
// -----------------------------------------------------------------------------

function normalizeError(
  cause: unknown,
): Error {
  if (cause instanceof Error) {
    return cause;
  }

  return new Error(
    'Failed to load traveller trust profile.',
  );
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useTrustProfile(
  initialHandle?: string,
): UseTrustProfileResult {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const [data, setData] =
    useState<TrustProfile | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<Error | null>(null);

  // ---------------------------------------------------------------------------
  // Refs
  // ---------------------------------------------------------------------------
  //
  // Refs deliberately hold request coordination state rather than duplicating
  // React-rendered state.
  //

  const handleRef =
    useRef<string | null>(
      normalizeHandle(initialHandle) || null,
    );

  const hasDataRef =
    useRef(false);

  const requestSequenceRef =
    useRef(0);

  // ---------------------------------------------------------------------------
  // Load
  // ---------------------------------------------------------------------------

  const load = useCallback(
    async (
      handle?: string,
    ): Promise<TrustProfile | null> => {
      const normalizedHandle =
        normalizeHandle(
          handle,
        ) ||
        handleRef.current ||
        '';

      if (!normalizedHandle) {
        const validationError =
          new Error(
            'Traveller handle is required.',
          );

        setError(validationError);
        setLoading(false);
        setRefreshing(false);

        return null;
      }

      // -----------------------------------------------------------------------
      // Store Latest Handle
      // -----------------------------------------------------------------------

      handleRef.current =
        normalizedHandle;

      // -----------------------------------------------------------------------
      // Request Sequence
      // -----------------------------------------------------------------------
      //
      // Every request receives a monotonically increasing sequence number.
      // Only the latest request may update the hook state.
      //

      const requestSequence =
        ++requestSequenceRef.current;

      const isRefresh =
        hasDataRef.current;

      // -----------------------------------------------------------------------
      // Request State
      // -----------------------------------------------------------------------

      setError(null);

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // -----------------------------------------------------------------------
      // Request
      // -----------------------------------------------------------------------

      try {
        const profile =
          await getPublicTrustProfile(
            normalizedHandle,
          );

        // ---------------------------------------------------------------------
        // Stale Request Protection
        // ---------------------------------------------------------------------

        if (
          requestSequence !==
          requestSequenceRef.current
        ) {
          return null;
        }

        // ---------------------------------------------------------------------
        // Update Data
        // ---------------------------------------------------------------------

        setData(profile);

        hasDataRef.current = true;

        return profile;
      } catch (cause: unknown) {
        // ---------------------------------------------------------------------
        // Ignore Stale Errors
        // ---------------------------------------------------------------------

        if (
          requestSequence !==
          requestSequenceRef.current
        ) {
          return null;
        }

        // ---------------------------------------------------------------------
        // Preserve Existing Data
        // ---------------------------------------------------------------------
        //
        // A refresh failure must not remove an already-loaded Trust profile.
        //

        setError(
          normalizeError(cause),
        );

        return null;
      } finally {
        // ---------------------------------------------------------------------
        // Finalize Latest Request Only
        // ---------------------------------------------------------------------

        if (
          requestSequence ===
          requestSequenceRef.current
        ) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Refresh
  // ---------------------------------------------------------------------------

  const refresh = useCallback(
    async (): Promise<TrustProfile | null> => {
      return load();
    },
    [load],
  );

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------

  const reset = useCallback(
    (): void => {
      // -----------------------------------------------------------------------
      // Invalidate In-Flight Requests
      // -----------------------------------------------------------------------

      requestSequenceRef.current += 1;

      // -----------------------------------------------------------------------
      // Reset Handle
      // -----------------------------------------------------------------------

      handleRef.current =
        normalizeHandle(
          initialHandle,
        ) || null;

      // -----------------------------------------------------------------------
      // Reset Data State
      // -----------------------------------------------------------------------

      hasDataRef.current = false;

      setData(null);
      setLoading(false);
      setRefreshing(false);
      setError(null);
    },
    [initialHandle],
  );

  // ---------------------------------------------------------------------------
  // Result
  // ---------------------------------------------------------------------------

  return {
    data,
    loading,
    refreshing,
    error,
    load,
    refresh,
    reset,
  };
}