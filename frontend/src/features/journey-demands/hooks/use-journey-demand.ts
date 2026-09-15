// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Detail Hook
// -----------------------------------------------------------------------------
//
// Client-side hook for loading one publicly discoverable Journey Demand.
//
// A missing public ID does not trigger a request. The hook therefore remains
// safe to use while a route parameter is unavailable.
//
// Public visibility is enforced by the backend public-read boundary. The
// frontend does not attempt to determine whether a Journey Demand is public.
//
// The API already returns the frontend PublicJourneyDemand representation.
// There is therefore no mapper layer in this hook. A mapper should only be
// introduced if the API representation and frontend representation genuinely
// diverge.
//
// Request cancellation and request IDs prevent a stale detail response from
// replacing the result for a newer public Journey Demand.
//
// The effect is responsible only for synchronizing the hook with the external
// API request. It does not synchronously reset React state from inside the
// effect body.
// -----------------------------------------------------------------------------

'use client';

import { useEffect, useRef, useState } from 'react';

import { getPublicJourneyDemandByPublicId } from '../api';
import type { PublicJourneyDemand } from '../models';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

export interface PublicJourneyDemandState {
  readonly data: PublicJourneyDemand | null;
  readonly isLoading: boolean;
  readonly error: Error | null;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourneyDemand(
  journeyDemandPublicId: string | null | undefined,
): PublicJourneyDemandState {
  const normalizedPublicId = journeyDemandPublicId?.trim() || null;
  const hasPublicId = normalizedPublicId !== null;

  const [data, setData] = useState<PublicJourneyDemand | null>(null);
  const [isLoading, setIsLoading] = useState(hasPublicId);
  const [error, setError] = useState<Error | null>(null);

  const requestIdRef = useRef(0);

  // ---------------------------------------------------------------------------
  // Load Public Journey Demand
  // ---------------------------------------------------------------------------
  //
  // A missing public ID means that there is no external resource to load.
  //
  // The effect therefore exits without synchronously mutating React state.
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (normalizedPublicId === null) {
      return;
    }

    let cancelled = false;
    const requestId = ++requestIdRef.current;

    const load = async (): Promise<void> => {
      try {
        const journeyDemand =
          await getPublicJourneyDemandByPublicId(normalizedPublicId);

        // Ignore responses from cancelled or superseded requests.
        if (cancelled || requestId !== requestIdRef.current) {
          return;
        }

        // The public API already returns the frontend public read model.
        //
        // No API-to-frontend mapper is required because both boundaries
        // currently use the same PublicJourneyDemand contract.
        setData(journeyDemand);
        setError(null);
      } catch (cause) {
        if (cancelled || requestId !== requestIdRef.current) {
          return;
        }

        setData(null);

        setError(
          cause instanceof Error
            ? cause
            : new Error('Unable to load the public Journey Demand.'),
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
  }, [normalizedPublicId]);

  // ---------------------------------------------------------------------------
  // Public State
  // ---------------------------------------------------------------------------
  //
  // When no public ID exists, there is no resource being requested.
  //
  // Return the appropriate derived state directly instead of synchronously
  // resetting React state from inside the effect.
  // ---------------------------------------------------------------------------

  if (!hasPublicId) {
    return {
      data: null,
      isLoading: false,
      error: null,
    };
  }

  return {
    data,
    isLoading,
    error,
  };
}