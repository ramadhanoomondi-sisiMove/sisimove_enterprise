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
// Request cancellation and request IDs prevent stale responses from replacing
// newer marketplace results when filters or pagination change quickly.
//
// The API already returns the frontend PublicJourneyDemand representation.
// There is therefore no mapper layer here. A mapper should only be introduced
// if the API representation and frontend representation genuinely diverge.
//
// -----------------------------------------------------------------------------

'use client';

import { useEffect, useRef, useState } from 'react';

import { getPublicJourneyDemands } from '../api';
import type {
  PublicJourneyDemand,
  PublicJourneyDemandQuery,
} from '../models';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

export interface PublicJourneyDemandsState {
  readonly data: readonly PublicJourneyDemand[];
  readonly isLoading: boolean;
  readonly error: Error | null;
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

  const requestIdRef = useRef(0);

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
  // Load Public Journey Demands
  // ---------------------------------------------------------------------------

  useEffect(() => {
    let cancelled = false;
    const requestId = ++requestIdRef.current;

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
        // A visitor can change marketplace filters quickly. If an older
        // request finishes after a newer request, its response must not
        // overwrite the newer marketplace state.
        // ---------------------------------------------------------------------

        if (cancelled || requestId !== requestIdRef.current) {
          return;
        }

        // The public API already returns PublicJourneyDemand objects.
        //
        // No mapper is required because there is currently no API-to-frontend
        // transformation at this boundary.
        setData(journeyDemands);
      } catch (cause) {
        if (cancelled || requestId !== requestIdRef.current) {
          return;
        }

        setError(
          cause instanceof Error
            ? cause
            : new Error('Unable to load public Journey Demands.'),
        );
      } finally {
        if (!cancelled && requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [from, to, date, limit, offset]);

  // ---------------------------------------------------------------------------
  // Public Hook State
  // ---------------------------------------------------------------------------

  return {
    data,
    isLoading,
    error,
  };
}