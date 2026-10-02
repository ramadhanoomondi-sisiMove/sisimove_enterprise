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
  readonly isFetching: boolean;
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

  const [journeys, setJourneys] = useState<readonly MyJourney[]>([]);
  const [isLoading, setIsLoading] = useState(
    normalizedJourneyPublicId.length > 0,
  );
  const [requestError, setRequestError] = useState<Error | null>(null);

  // ---------------------------------------------------------------------------
  // Initial / identifier-change load
  // ---------------------------------------------------------------------------
  //
  // IMPORTANT:
  //
  // This effect deliberately performs NO synchronous React state updates.
  //
  // It only starts the external asynchronous request. React state is updated
  // from the Promise completion handlers.
  //
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (normalizedJourneyPublicId.length === 0) {
      return;
    }

    let cancelled = false;

    void getMyJourneys()
      .then((result) => {
        if (cancelled) {
          return;
        }

        setJourneys(result);
        setRequestError(null);
        setIsLoading(false);
      })
      .catch((cause: unknown) => {
        if (cancelled) {
          return;
        }

        const nextError =
          cause instanceof Error
            ? cause
            : new Error("Failed to load your journeys.");

        setRequestError(nextError);
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [normalizedJourneyPublicId]);

  // ---------------------------------------------------------------------------
  // Identifier validation
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
  // Refetch is NOT tied to `isLoading`.
  //
  // This is critical for the Journey editor:
  //
  //     mutation
  //        ↓
  //     refetch
  //        ↓
  //     existing JourneyEditor remains mounted
  //        ↓
  //     projection refreshed
  //        ↓
  //     JourneyEditor shows success modal
  //
  // ---------------------------------------------------------------------------

  const refetch = useCallback(async (): Promise<void> => {
    try {
      const result = await getMyJourneys();

      setJourneys(result);
      setRequestError(null);
    } catch (cause) {
      const nextError =
        cause instanceof Error
          ? cause
          : new Error("Failed to load your journeys.");

      setRequestError(nextError);

      throw nextError;
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Result
  // ---------------------------------------------------------------------------

  return {
    journey,
    isLoading,
    isFetching: false,
    error,
    refetch,
  };
}