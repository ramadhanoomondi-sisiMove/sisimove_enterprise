// -----------------------------------------------------------------------------
// Path: src/features/journey/hooks/queries/use-public-journeys.ts
// -----------------------------------------------------------------------------
//
// sisiMove — Use Public Journeys
//
// Loads the public Journey marketplace projection.
//
// Responsibilities:
// - execute the public Journey API query;
// - expose loading/error/data state;
// - provide an explicit refetch operation;
// - cancel superseded requests;
// - prevent stale overlapping responses from replacing newer results.
//
// The hook does not:
// - construct Journey domain objects;
// - apply Journey lifecycle rules;
// - perform client-side filtering;
// - create Journey domain behavior.
//
// Query parameters are passed to the backend public Journey projection.
//
// -----------------------------------------------------------------------------

"use client";

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

import {
  getPublicJourneys,
  type GetPublicJourneysQuery,
} from "../../api/journeys/get-public-journeys";

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

import type { PublicJourney } from "../../models/public-journey";

// =============================================================================
// Types
// =============================================================================

export interface UsePublicJourneysResult {
  readonly journeys: PublicJourney[];
  readonly isLoading: boolean;
  readonly error: Error | null;
  readonly refetch: () => void;
}

// =============================================================================
// Hook
// =============================================================================

export function usePublicJourneys(
  query: GetPublicJourneysQuery = {},
): UsePublicJourneysResult {
  // ===========================================================================
  // Query State
  // ===========================================================================

  const [journeys, setJourneys] =
    useState<PublicJourney[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<Error | null>(null);

  // ===========================================================================
  // Explicit Refetch State
  // ===========================================================================

  const [refetchVersion, setRefetchVersion] =
    useState(0);

  // ===========================================================================
  // Request Lifecycle
  // ===========================================================================

  const requestGenerationRef =
    useRef(0);

  const abortControllerRef =
    useRef<AbortController | null>(null);

  // ===========================================================================
  // Normalized Query
  // ===========================================================================

  const from =
    query.from?.trim() ?? "";

  const to =
    query.to?.trim() ?? "";

  const date =
    query.date?.trim() ?? "";

  // ===========================================================================
  // Explicit Refetch
  // ===========================================================================

  const refetch = useCallback((): void => {
    setRefetchVersion(
      (current) => current + 1,
    );
  }, []);

  // ===========================================================================
  // Query Effect
  // ===========================================================================
  //
  // Every query change:
  //
  // 1. aborts the previous HTTP request;
  // 2. creates a new request controller;
  // 3. increments the request generation;
  // 4. starts the latest request;
  // 5. allows only the latest request to update state.
  //
  // The AbortController prevents unnecessary network work.
  //
  // The generation guard remains necessary because cancellation is not itself
  // the correctness boundary. A request may already have completed or a
  // transport implementation may not immediately honor cancellation.
  //
  // ===========================================================================

  useEffect(() => {
    // -------------------------------------------------------------------------
    // Cancel previous request.
    // -------------------------------------------------------------------------

    abortControllerRef.current?.abort();

    // -------------------------------------------------------------------------
    // Create controller for this request.
    // -------------------------------------------------------------------------

    const abortController =
      new AbortController();

    abortControllerRef.current =
      abortController;

    // -------------------------------------------------------------------------
    // Assign request generation.
    // -------------------------------------------------------------------------

    const requestGeneration =
      requestGenerationRef.current + 1;

    requestGenerationRef.current =
      requestGeneration;

    let cancelled = false;

    // =========================================================================
    // Execute
    // =========================================================================

    const execute =
      async (): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
          const result =
            await getPublicJourneys(
              {
                from:
                  from || undefined,

                to:
                  to || undefined,

                date:
                  date || undefined,
              },
              {
                context: {
                  signal:
                    abortController.signal,
                },
              },
            );

          // -------------------------------------------------------------------
          // Ignore stale / cancelled responses.
          // -------------------------------------------------------------------

          if (
            cancelled ||
            abortController.signal.aborted ||
            requestGeneration !==
              requestGenerationRef.current
          ) {
            return;
          }

          setJourneys(result);
        } catch (cause) {
          // -------------------------------------------------------------------
          // Cancellation is expected when a newer query replaces this request.
          // -------------------------------------------------------------------

          if (
            cancelled ||
            abortController.signal.aborted ||
            requestGeneration !==
              requestGenerationRef.current
          ) {
            return;
          }

          const nextError =
            cause instanceof Error
              ? cause
              : new Error(
                  "Failed to load public journeys.",
                );

          setError(nextError);
        } finally {
          // -------------------------------------------------------------------
          // Only the active request may end loading.
          // -------------------------------------------------------------------

          if (
            !cancelled &&
            !abortController.signal.aborted &&
            requestGeneration ===
              requestGenerationRef.current
          ) {
            setIsLoading(false);
          }
        }
      };

    void execute();

    // =========================================================================
    // Cleanup
    // =========================================================================

    return () => {
      cancelled = true;

      abortController.abort();

      if (
        abortControllerRef.current ===
        abortController
      ) {
        abortControllerRef.current =
          null;
      }
    };
  }, [
    from,
    to,
    date,
    refetchVersion,
  ]);

  // ===========================================================================
  // Result
  // ===========================================================================

  return {
    journeys,
    isLoading,
    error,
    refetch,
  };
}