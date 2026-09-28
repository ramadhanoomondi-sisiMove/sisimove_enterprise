// -----------------------------------------------------------------------------
// sisiMove — useMyJourneyDemand
// -----------------------------------------------------------------------------
//
// Authenticated hook for retrieving one Journey Demand belonging to the
// currently authenticated user.
//
// Backend:
//
//     GET /journey-demands/me/:journeyDemandPublicId
//
// Ownership is resolved by the backend from the authenticated session.
// The hook therefore accepts only the Journey Demand public ID.
//
// The hook does not:
//
// - accept requesterPublicId;
// - determine ownership;
// - call the public Journey Demand API;
// - cast PublicJourneyDemand into MyJourneyDemand;
// - recreate backend domain logic.
//
// Error behavior:
//
//     API/backend errors are preserved as Error values.
//
// A missing or inaccessible Journey Demand is NOT represented as a
// successful `null` result. The backend error is exposed through `error`.
//
// Effect behavior:
//
// The initial request is started from an effect because the request is an
// external side effect. The effect does not synchronously invoke a function
// that immediately updates React state.
//
// The request itself updates state only after the asynchronous API operation
// resolves or rejects.
//
// ----------------------------------------------------------------------------- 

'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  getMyJourneyDemand,
} from '../../api/my-journey-demand.api';

import type { MyJourneyDemand } from '../../models';

// =============================================================================
// Types
// =============================================================================

export interface UseMyJourneyDemandResult {
  /**
   * Authenticated owner read model.
   *
   * Undefined while the request has not successfully completed.
   */
  readonly demand: MyJourneyDemand | undefined;

  /**
   * True while the initial request or a refetch is in progress.
   */
  readonly isLoading: boolean;

  /**
   * Backend/API error.
   *
   * Null when no error has occurred.
   */
  readonly error: Error | null;

  /**
   * Re-execute the authenticated Journey Demand request.
   */
  readonly refetch: () => Promise<void>;
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Retrieve one Journey Demand belonging to the authenticated requester.
 *
 * The requester identity is intentionally not supplied by the component.
 * Authentication and ownership are handled by the backend through the
 * authenticated API client.
 *
 * The hook remains useful for both:
 *
 * - initial page loading;
 * - explicit retry/refetch after an API error.
 */
export function useMyJourneyDemand(
  journeyDemandPublicId: string,
): UseMyJourneyDemandResult {
  const [demand, setDemand] = useState<MyJourneyDemand | undefined>(
    undefined,
  );

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<Error | null>(null);

  // ---------------------------------------------------------------------------
  // Explicit refetch
  // ---------------------------------------------------------------------------

  /**
   * Re-execute the authenticated owner request.
   *
   * This function is intentionally exposed to the presentation/route layer
   * for retry behavior.
   */
  const refetch = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getMyJourneyDemand(
        journeyDemandPublicId,
      );

      setDemand(result);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause
          : new Error('Failed to load Journey Demand.'),
      );
    } finally {
      setIsLoading(false);
    }
  }, [journeyDemandPublicId]);

  // ---------------------------------------------------------------------------
  // Initial request
  // ---------------------------------------------------------------------------

  /**
   * Load the requested Journey Demand whenever its public ID changes.
   *
   * The asynchronous request is created inside the effect. State updates
   * occur only after the API promise settles, avoiding a synchronous
   * setState call from the effect body.
   *
   * The cancellation flag prevents an older request from updating state after
   * the hook has moved on to a different Journey Demand public ID.
   */
  useEffect(() => {
    let cancelled = false;

    const request = async (): Promise<void> => {
      try {
        const result = await getMyJourneyDemand(
          journeyDemandPublicId,
        );

        if (cancelled) {
          return;
        }

        setDemand(result);
        setError(null);
      } catch (cause) {
        if (cancelled) {
          return;
        }

        setError(
          cause instanceof Error
            ? cause
            : new Error('Failed to load Journey Demand.'),
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void request();

    return () => {
      cancelled = true;
    };
  }, [journeyDemandPublicId]);

  return {
    demand,
    isLoading,
    error,
    refetch,
  };
}

