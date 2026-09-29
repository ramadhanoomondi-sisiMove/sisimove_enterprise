// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demands Hook
// -----------------------------------------------------------------------------
//
// Client-side hook for discovering publicly available Journey Demands.
//
// The hook intentionally loads the public collection on mount and whenever the
// marketplace query changes.
//
// An empty query is valid and represents the default marketplace state:
//
//     show publicly discoverable Journey Demands
//
// Search and filtering are refinements of that marketplace state, not a
// prerequisite for discovery.
//
// The hook also exposes `refetch` so a parent component can explicitly retry
// the current marketplace request after an error.
//
// Request cancellation and request generations prevent stale responses from
// replacing newer marketplace results when filters, pagination, or an explicit
// retry changes the active request.
//
// The API already returns the frontend PublicJourneyDemand representation.
// There is therefore no mapper layer here. A mapper should only be introduced
// if the API representation and frontend representation genuinely diverge.
//
// -----------------------------------------------------------------------------

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { getPublicJourneyDemands } from '../../api';
import type {
  PublicJourneyDemand,
  PublicJourneyDemandQuery,
} from '../../models';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

export interface PublicJourneyDemandsState {
  readonly data: readonly PublicJourneyDemand[];
  readonly isLoading: boolean;
  readonly error: Error | null;

  /**
   * Explicitly reloads the current public Journey Demand collection.
   *
   * The hook owns the request implementation. Consumers only decide when a
   * retry should occur.
   */
  readonly refetch: () => void;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourneyDemands(
  query?: PublicJourneyDemandQuery,
): PublicJourneyDemandsState {
  const [data, setData] = useState<readonly PublicJourneyDemand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Changing this value explicitly requests the current collection again.
   */
  const [refetchVersion, setRefetchVersion] = useState(0);

  /**
   * Monotonically increasing request generation.
   *
   * The ref is intentionally used for request identity rather than render
   * state. A newer request invalidates every older request immediately.
   */
  const requestGenerationRef = useRef(0);

  // ---------------------------------------------------------------------------
  // Query Dependencies
  // ---------------------------------------------------------------------------
  //
  // Extract primitive values so the effect does not re-run merely because a
  // caller creates a new query object with the same values.
  //
  // Pagination values are included because changing either value represents a
  // new marketplace collection request.
  // ---------------------------------------------------------------------------

  const from = query?.from;
  const to = query?.to;
  const date = query?.date;
  const limit = query?.limit;
  const offset = query?.offset;

  // ---------------------------------------------------------------------------
  // Explicit Refetch
  // ---------------------------------------------------------------------------

  const refetch = useCallback((): void => {
    setRefetchVersion((current) => current + 1);
  }, []);

  // ---------------------------------------------------------------------------
  // Load Public Journey Demands
  // ---------------------------------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const requestGeneration = ++requestGenerationRef.current;

    const load = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const journeyDemands = await getPublicJourneyDemands({
          ...(from !== undefined ? { from } : {}),
          ...(to !== undefined ? { to } : {}),
          ...(date !== undefined ? { date } : {}),
          ...(limit !== undefined ? { limit } : {}),
          ...(offset !== undefined ? { offset } : {}),
        });

        // ---------------------------------------------------------------------
        // Ignore cancelled or superseded requests.
        // ---------------------------------------------------------------------
        //
        // A visitor can change marketplace filters or explicitly retry while
        // another request is still in flight. An older request must never
        // overwrite state produced by the current request.
        // ---------------------------------------------------------------------

        if (
          cancelled ||
          requestGeneration !== requestGenerationRef.current
        ) {
          return;
        }

        // ---------------------------------------------------------------------
        // Public API → frontend model
        // ---------------------------------------------------------------------
        //
        // The public API already returns PublicJourneyDemand objects.
        //
        // No mapper is required because there is currently no API-to-frontend
        // transformation at this boundary.
        // ---------------------------------------------------------------------

        setData(journeyDemands);
      } catch (cause) {
        if (
          cancelled ||
          requestGeneration !== requestGenerationRef.current
        ) {
          return;
        }

        setError(
          cause instanceof Error
            ? cause
            : new Error('Unable to load public Journey Demands.'),
        );
      } finally {
        if (
          !cancelled &&
          requestGeneration === requestGenerationRef.current
        ) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [from, to, date, limit, offset, refetchVersion]);

  // ---------------------------------------------------------------------------
  // Public Hook State
  // ---------------------------------------------------------------------------

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}