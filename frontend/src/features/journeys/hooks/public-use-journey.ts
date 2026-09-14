// src/features/journeys/hooks/public-use-journey.ts
// -----------------------------------------------------------------------------
// sisiMove — Public Journey Detail Hook
// -----------------------------------------------------------------------------
//
// React hook for retrieving one publicly discoverable Journey.
//
// The public identifier is the only required input.
//
// The hook does not:
// - fetch Traveller Profile data;
// - fetch Trust data;
// - fetch Journey Demand;
// - compose marketplace data;
// - expose internal Journey lifecycle operations.
// -----------------------------------------------------------------------------

'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  getPublicJourneyByPublicId,
} from '../api';

import type {
  PublicJourney,
} from '../models';

import {
  mapPublicJourney,
} from '../mappers';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

export interface PublicJourneyState {
  readonly data: PublicJourney | null;
  readonly isLoading: boolean;
  readonly error: Error | null;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function usePublicJourney(
  journeyPublicId: string | null | undefined,
): PublicJourneyState {
  const hasPublicId =
    journeyPublicId !== undefined &&
    journeyPublicId !== null &&
    journeyPublicId.trim() !== '';

  const [data, setData] = useState<PublicJourney | null>(null);

  const [isLoading, setIsLoading] = useState(hasPublicId);

  const [error, setError] = useState<Error | null>(null);

  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!hasPublicId) {
      return;
    }

    let cancelled = false;
    const requestId = ++requestIdRef.current;

    const load = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const journey =
          await getPublicJourneyByPublicId(
            journeyPublicId,
          );

        if (
          cancelled ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        setData(
          journey === null
            ? null
            : mapPublicJourney(journey),
        );
      } catch (cause) {
        if (
          cancelled ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        setError(
          cause instanceof Error
            ? cause
            : new Error(
                'Unable to load the public Journey.',
              ),
        );
      } finally {
        if (
          !cancelled &&
          requestId === requestIdRef.current
        ) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [hasPublicId, journeyPublicId]);

  return {
    data,
    isLoading,
    error,
  };
}
