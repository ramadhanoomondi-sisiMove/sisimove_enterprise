// src/features/journeys/hooks/public-use-journeys.ts
// -----------------------------------------------------------------------------
// sisiMove — Public Journeys Hook
// -----------------------------------------------------------------------------
//
// React hook for retrieving publicly discoverable Journeys.
//
// Responsibilities:
// - execute the public Journey collection request;
// - expose loading, error, and data state;
// - preserve existing data while a new request is loading;
// - map API representations into frontend PublicJourney models;
// - protect state from stale requests.
//
// This hook does not:
// - compose Journey Demand;
// - own marketplace state;
// - perform authentication;
// - implement Journey business rules.
//
// Marketplace composition belongs to the Public Marketplace feature.
// -----------------------------------------------------------------------------

'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  getPublicJourneys,
} from '../api';

import type {
  PublicJourney,
  PublicJourneyQuery,
} from '../models';

import {
  mapPublicJourney,
} from '../mappers';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

export interface PublicJourneysState {
  readonly data: readonly PublicJourney[];
  readonly isLoading: boolean;
  readonly error: Error | null;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function usePublicJourneys(
  query?: PublicJourneyQuery,
): PublicJourneysState {
  const [data, setData] = useState<readonly PublicJourney[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const requestIdRef = useRef(0);

  const from = query?.from;
  const to = query?.to;
  const date = query?.date;

  useEffect(() => {
    let cancelled = false;
    const requestId = ++requestIdRef.current;

    const load = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const journeys = await getPublicJourneys({
          from,
          to,
          date,
        });

        if (
          cancelled ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        setData(
          journeys.map(mapPublicJourney),
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
                'Unable to load public Journeys.',
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
  }, [from, to, date]);

  return {
    data,
    isLoading,
    error,
  };
}