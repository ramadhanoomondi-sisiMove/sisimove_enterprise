// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demands Hook
// -----------------------------------------------------------------------------
//
// Client-side hook for discovering publicly available Journey Demands.
//
// The hook intentionally loads the public collection on mount and whenever the
// marketplace query changes. An empty query is valid and represents the
// default marketplace state: show publicly available Journey Demands without
// requiring the visitor to search first.
//
// Request cancellation and request IDs prevent stale responses from replacing
// newer marketplace results when filters change quickly.
// -----------------------------------------------------------------------------

'use client';

import { useEffect, useRef, useState } from 'react';

import { getPublicJourneyDemands } from '../api';
import type {
  PublicJourneyDemand,
  PublicJourneyDemandQuery,
} from '../models';
import { mapPublicJourneyDemand } from '../mappers';

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
  //
  // Extract primitive values so the effect does not re-run merely because a
  // caller creates a new query object with the same values.
  // ---------------------------------------------------------------------------

  const from = query?.from;
  const to = query?.to;
  const date = query?.date;

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
          from,
          to,
          date,
        });

        // Ignore responses from cancelled or superseded requests.
        if (cancelled || requestId !== requestIdRef.current) {
          return;
        }

        setData(journeyDemands.map(mapPublicJourneyDemand));
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
  }, [from, to, date]);

  return {
    data,
    isLoading,
    error,
  };
}

