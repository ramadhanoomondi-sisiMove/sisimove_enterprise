// -----------------------------------------------------------------------------
// sisiMove — useMyJourneyDemands
// -----------------------------------------------------------------------------
//
// React hook for retrieving Journey Demands belonging to the currently
// authenticated user.
//
// Data boundary:
//
//     useMyJourneyDemands
//             ↓
//     getMyJourneyDemands()
//             ↓
//     GET /journey-demands/me
//             ↓
//     MyJourneyDemand[]
//
// Ownership is resolved by the backend from the authenticated session.
//
// The hook never accepts or sends a requesterPublicId.
//
// The hook owns only frontend request state:
//     - demands
//     - isLoading
//     - error
//     - refetch
//
// Authentication, authorization, and ownership remain backend concerns.
//
// -----------------------------------------------------------------------------

'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  getMyJourneyDemands,
} from '../api/my-journey-demands.api';

import type {
  MyJourneyDemand,
} from '../models';

// -----------------------------------------------------------------------------
// Result
// -----------------------------------------------------------------------------

export interface UseMyJourneyDemandsResult {
  readonly demands: readonly MyJourneyDemand[];
  readonly isLoading: boolean;
  readonly error: Error | null;
  readonly refetch: () => Promise<void>;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Retrieve the currently authenticated user's Journey Demands.
 *
 * The initial request is performed when the hook mounts.
 *
 * Subsequent requests can be triggered explicitly through `refetch`.
 */
export function useMyJourneyDemands(): UseMyJourneyDemandsResult {
  const [demands, setDemands] = useState<
    readonly MyJourneyDemand[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<Error | null>(null);

  // ---------------------------------------------------------------------------
  // Load
  // ---------------------------------------------------------------------------

  /**
   * Performs the actual API request.
   *
   * This function is intentionally responsible only for retrieving and
   * storing the successful result.
   *
   * Loading and error lifecycle state is managed by the caller so that the
   * initial effect and explicit refetch follow the same API boundary without
   * coupling request execution to one particular lifecycle.
   */
  const fetchDemands = useCallback(async (): Promise<void> => {
    const result = await getMyJourneyDemands();

    setDemands(result);
  }, []);

  // ---------------------------------------------------------------------------
  // Initial Load
  // ---------------------------------------------------------------------------

  /**
   * Load the authenticated user's Journey Demands after mount.
   *
   * The active flag prevents state updates after the component has been
   * unmounted or the effect has been invalidated.
   */
  useEffect(() => {
    let active = true;

    const load = async (): Promise<void> => {
      try {
        const result = await getMyJourneyDemands();

        if (!active) {
          return;
        }

        setDemands(result);
        setError(null);
      } catch (cause) {
        if (!active) {
          return;
        }

        setError(
          cause instanceof Error
            ? cause
            : new Error(
                'Failed to load your journey demands.',
              ),
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Refetch
  // ---------------------------------------------------------------------------

  /**
   * Explicitly reload the authenticated user's Journey Demands.
   *
   * Refetch is initiated by a user/application action and therefore owns the
   * request lifecycle state directly.
   */
  const refetch = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await fetchDemands();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause
          : new Error(
              'Failed to load your journey demands.',
            ),
      );
    } finally {
      setIsLoading(false);
    }
  }, [fetchDemands]);

  // ---------------------------------------------------------------------------
  // Result
  // ---------------------------------------------------------------------------

  return {
    demands,
    isLoading,
    error,
    refetch,
  };
}