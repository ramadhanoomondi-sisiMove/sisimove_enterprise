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
// The effect is responsible only for synchronizing the hook with the external
// API request. It does not synchronously reset React state from inside the
// effect body, which avoids cascading-render warnings from React's hooks
// linting rules.
// -----------------------------------------------------------------------------

'use client';

import { useEffect, useRef, useState } from 'react';

import { getPublicJourneyDemandByPublicId } from '../api';
import type { PublicJourneyDemand } from '../models';
import { mapPublicJourneyDemand } from '../mappers';

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
  const normalizedPublicId =
    journeyDemandPublicId?.trim() || null;

  const hasPublicId = normalizedPublicId !== null;

  const [data, setData] = useState<PublicJourneyDemand | null>(null);
  const [isLoading, setIsLoading] = useState(hasPublicId);
  const [error, setError] = useState<Error | null>(null);

  const requestIdRef = useRef(0);

  // ---------------------------------------------------------------------------
  // Load Public Journey Demand
  // ---------------------------------------------------------------------------
  //
  // The effect does not synchronously reset state when the ID is missing.
  //
  // A missing ID simply means there is no external request to synchronize.
  // The returned state is derived accordingly below.
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

        if (cancelled || requestId !== requestIdRef.current) {
          return;
        }

        setData(
          journeyDemand === null
            ? null
            : mapPublicJourneyDemand(journeyDemand),
        );

        setError(null);
      } catch (cause) {
        if (cancelled || requestId !== requestIdRef.current) {
          return;
        }

        setError(
          cause instanceof Error
            ? cause
            : new Error(
                'Unable to load the public Journey Demand.',
              ),
        );

        setData(null);
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
  // When no public ID exists, there is no resource being loaded. Rather than
  // synchronously mutating React state from the effect, expose the appropriate
  // derived state directly.
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

