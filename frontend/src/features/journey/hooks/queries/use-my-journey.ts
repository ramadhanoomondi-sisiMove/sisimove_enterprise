// -----------------------------------------------------------------------------
// sisiMove — useMyJourney
// -----------------------------------------------------------------------------
//
// Authenticated single-Journey selection.
//
// Backend contract:
//
//     GET /journeys/me
//
// There is intentionally no:
//
//     GET /journeys/me/:journeyPublicId
//
// The backend returns the authenticated user's complete MyJourney collection.
// This hook selects one Journey from that collection.
//
// The provider identity is never supplied by the client. It is derived by the
// backend from the authenticated JWT.
//
// -----------------------------------------------------------------------------

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { getMyJourneys } from "../../api/journeys/get-my-journeys";

import type { MyJourney } from "../../models";

// =============================================================================
// Result
// =============================================================================

export interface UseMyJourneyResult {
  readonly journey: MyJourney | null;
  readonly isLoading: boolean;
  readonly error: Error | null;
  readonly refetch: () => Promise<void>;
}

// =============================================================================
// Hook
// =============================================================================

export function useMyJourney(
  journeyPublicId: string | undefined,
): UseMyJourneyResult {
  const normalizedJourneyPublicId = journeyPublicId?.trim() ?? "";

  // ---------------------------------------------------------------------------
  // Query state
  // ---------------------------------------------------------------------------
  //
  // The initial loading state is represented directly by the initial state.
  // We therefore do not need an effect to synchronously call setIsLoading(true).
  // ---------------------------------------------------------------------------

  const [journeys, setJourneys] = useState<readonly MyJourney[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [requestError, setRequestError] = useState<Error | null>(null);

  // ---------------------------------------------------------------------------
  // Fetch authenticated My Journeys
  // ---------------------------------------------------------------------------
  //
  // The state transitions happen after the asynchronous API operation
  // completes. This keeps the effect from synchronously cascading a render.
  // ---------------------------------------------------------------------------

  const fetchJourneys = useCallback(async (): Promise<void> => {
    if (normalizedJourneyPublicId.length === 0) {
      return;
    }

    setIsLoading(true);
    setRequestError(null);

    try {
      const result = await getMyJourneys();

      setJourneys(result);
    } catch (cause) {
      const nextError =
        cause instanceof Error
          ? cause
          : new Error("Failed to load your journey.");

      setRequestError(nextError);
    } finally {
      setIsLoading(false);
    }
  }, [normalizedJourneyPublicId]);

  // ---------------------------------------------------------------------------
  // Initial / identifier-change load
  // ---------------------------------------------------------------------------
  //
  // The asynchronous function is invoked from the effect, but the effect does
  // not itself synchronously mutate React state.
  //
  // The API request yields before the successful/error state is committed.
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (normalizedJourneyPublicId.length === 0) {
      return;
    }

    void (async () => {
      try {
        const result = await getMyJourneys();

        setJourneys(result);
        setRequestError(null);
      } catch (cause) {
        const nextError =
          cause instanceof Error
            ? cause
            : new Error("Failed to load your journey.");

        setRequestError(nextError);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [normalizedJourneyPublicId]);

  // ---------------------------------------------------------------------------
  // Identifier validation
  // ---------------------------------------------------------------------------
  //
  // This is derived state. We do not store "missing Journey ID" in React state
  // because it is completely determined by the hook input.
  // ---------------------------------------------------------------------------

  const identifierError = useMemo<Error | null>(() => {
    if (normalizedJourneyPublicId.length > 0) {
      return null;
    }

    return new Error("Journey public ID is required.");
  }, [normalizedJourneyPublicId]);

  // ---------------------------------------------------------------------------
  // Selected Journey
  // ---------------------------------------------------------------------------
  //
  // The backend returns the authenticated user's Journeys. The frontend only
  // selects the requested public ID from that already-authorized collection.
  // ---------------------------------------------------------------------------

  const journey = useMemo(
    () =>
      journeys.find(
        (candidate) => candidate.publicId === normalizedJourneyPublicId,
      ) ?? null,
    [journeys, normalizedJourneyPublicId],
  );

  // ---------------------------------------------------------------------------
  // Public error
  // ---------------------------------------------------------------------------

  const error = identifierError ?? requestError;

  // ---------------------------------------------------------------------------
  // Explicit refetch
  // ---------------------------------------------------------------------------
  //
  // Refetch is a user/component-triggered operation, so it may explicitly
  // transition the loading state before making the request.
  // ---------------------------------------------------------------------------

  const refetch = useCallback(async (): Promise<void> => {
    if (normalizedJourneyPublicId.length === 0) {
      return;
    }

    await fetchJourneys();
  }, [fetchJourneys, normalizedJourneyPublicId]);

  // ---------------------------------------------------------------------------
  // Result
  // ---------------------------------------------------------------------------

  return {
    journey,
    isLoading,
    error,
    refetch,
  };
}

