// src/features/journeys/hooks/public-use-journeys.ts

// -----------------------------------------------------------------------------
// sisiMove — Public Journeys Hook
// -----------------------------------------------------------------------------
//
// React hook for retrieving publicly discoverable Journeys.
//
// Public Journey read flow:
//
//     usePublicJourneys()
//             │
//             ▼
//     getPublicJourneys()
//             │
//             ▼
//     GET /journeys/public
//             │
//             ▼
//     Journey public-read boundary
//             │
//             ▼
//     PublicJourney API responses
//             │
//             ▼
//     mapPublicJourney()
//             │
//             ▼
//     frontend PublicJourney[]
//
// Architectural boundary
// ----------------------
//
// Journey remains the primary domain object.
//
// The backend public-read boundary is responsible for composing the public
// representation of a Journey, including:
//
//     provider.traveller
//     provider.trust
//
// The frontend hook does not reconstruct that relationship.
//
// Its only responsibility is:
//
//     transport → mapping → React state
//
// Responsibilities:
// - execute the public Journey collection request;
// - support the unfiltered marketplace collection;
// - support optional Journey discovery filters;
// - expose loading, error, and data state;
// - preserve existing Journey data while a new request is loading;
// - map API responses into the frontend PublicJourney model;
// - protect state from stale requests.
//
// This hook does NOT:
// - compose Journey Demand;
// - own marketplace state;
// - perform authentication;
// - implement Journey business rules;
// - determine Journey public visibility;
// - load Traveller Profile separately;
// - load Trust Profile separately;
// - reconstruct the Journey provider.
//
// Public visibility and provider composition belong to the backend Journey
// public-read boundary.
//
// Marketplace composition belongs to the Public Marketplace feature.
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import {
  useEffect,
  useRef,
  useState,
} from 'react';

// -----------------------------------------------------------------------------
// Journey — Public API
// -----------------------------------------------------------------------------

import {
  getPublicJourneys,
} from '../api';

// -----------------------------------------------------------------------------
// Journey — Public Models
// -----------------------------------------------------------------------------

import type {
  PublicJourney,
  PublicJourneyQuery,
} from '../models';

// -----------------------------------------------------------------------------
// Journey — Public Mappers
// -----------------------------------------------------------------------------

import {
  mapPublicJourney,
} from '../mappers';

// =============================================================================
// State
// =============================================================================

export interface PublicJourneysState {
  /**
   * Currently committed public Journey collection.
   *
   * Existing data is intentionally retained while a new request is loading.
   *
   * This prevents the marketplace from collapsing into an artificial empty
   * state whenever discovery filters change.
   */
  readonly data: readonly PublicJourney[];

  /**
   * Indicates that the current public Journey request is in flight.
   *
   * A stale request is never allowed to change this value.
   */
  readonly isLoading: boolean;

  /**
   * Error produced by the current active request.
   *
   * Errors from stale requests are ignored.
   */
  readonly error: Error | null;
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Retrieves publicly discoverable Journeys.
 *
 * Unfiltered marketplace inventory:
 *
 *     usePublicJourneys()
 *
 * Filtered discovery:
 *
 *     usePublicJourneys({
 *       from: 'Nairobi',
 *       to: 'Kisumu',
 *       date: '2026-09-18',
 *     })
 *
 * The query values are extracted into primitives before entering the effect.
 * This prevents a caller creating a new query object on every render from
 * causing unnecessary requests.
 *
 * Example:
 *
 *     usePublicJourneys({
 *       from,
 *       to,
 *       date,
 *     })
 *
 * The object identity may change on every render. The actual discovery values
 * usually do not. Therefore the effect depends on:
 *
 *     from
 *     to
 *     date
 *
 * rather than the query object itself.
 */
export function usePublicJourneys(
  query?: PublicJourneyQuery,
): PublicJourneysState {
  // ===========================================================================
  // Query Values
  // ===========================================================================
  //
  // Extract primitive values so the request lifecycle follows actual query
  // changes rather than object identity.
  //
  // ===========================================================================

  const from = query?.from;
  const to = query?.to;
  const date = query?.date;

  // ===========================================================================
  // State
  // ===========================================================================

  const [data, setData] = useState<readonly PublicJourney[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<Error | null>(null);

  // ===========================================================================
  // Request Identity
  // ===========================================================================
  //
  // Each effect execution receives a monotonically increasing request ID.
  //
  // Example:
  //
  //     Request A starts → id 1
  //     Request B starts → id 2
  //     Request B completes
  //     Request A completes later
  //
  // Request A must not overwrite Request B.
  //
  // The request ID therefore protects state even when the underlying HTTP
  // client cannot physically abort an already-running request.
  //
  // ===========================================================================

  const requestIdRef = useRef(0);

  // ===========================================================================
  // Public Journey Request
  // ===========================================================================

  useEffect(() => {
    let cancelled = false;

    const requestId = ++requestIdRef.current;

    // -------------------------------------------------------------------------
    // Load
    // -------------------------------------------------------------------------

    const load = async (): Promise<void> => {
      // -----------------------------------------------------------------------
      // Request Start
      // -----------------------------------------------------------------------
      //
      // Do NOT clear `data`.
      //
      // The marketplace should continue displaying the previous committed
      // Journey collection while the next filtered collection is loading.
      //
      // This avoids:
      //
      //     data → []
      //     loading → true
      //
      // followed by the new response.
      //
      // Instead:
      //
      //     previous data remains visible
      //     loading → true
      //     new data replaces previous data when ready
      //
      // -----------------------------------------------------------------------

      setIsLoading(true);

      setError(null);

      try {
        // ---------------------------------------------------------------------
        // API Query
        // ---------------------------------------------------------------------
        //
        // An entirely empty query represents the marketplace inventory:
        //
        //     GET /journeys/public
        //
        // This corresponds to the backend's empty GetPublicJourneysQuery.
        //
        // Only defined filters are forwarded when discovery is being narrowed.
        //
        // ---------------------------------------------------------------------

        const apiQuery: PublicJourneyQuery | undefined =
          from === undefined &&
          to === undefined &&
          date === undefined
            ? undefined
            : {
                from,
                to,
                date,
              };

        // ---------------------------------------------------------------------
        // Request
        // ---------------------------------------------------------------------

        const responses = await getPublicJourneys(apiQuery);

        // ---------------------------------------------------------------------
        // Stale Request Protection
        // ---------------------------------------------------------------------
        //
        // Check immediately after the asynchronous boundary.
        //
        // A response from an obsolete request must not be allowed to continue
        // into mapping or state commitment.
        //
        // ---------------------------------------------------------------------

        if (
          cancelled ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        // ---------------------------------------------------------------------
        // API → Frontend Mapping
        // ---------------------------------------------------------------------
        //
        // The API layer owns HTTP communication.
        //
        // The mapper owns the API/frontend representation boundary.
        //
        // The mapper must preserve the provider composition supplied by the
        // backend:
        //
        //     provider.traveller
        //     provider.trust
        //
        // It must not issue additional network requests or reconstruct the
        // Journey provider.
        //
        // ---------------------------------------------------------------------

        const mappedJourneys = responses.map(
          mapPublicJourney,
        );

        // ---------------------------------------------------------------------
        // Commit
        // ---------------------------------------------------------------------
        //
        // The request was still current after the asynchronous HTTP operation,
        // so the mapped collection can become the new committed state.
        //
        // ---------------------------------------------------------------------

        setData(mappedJourneys);
      } catch (cause: unknown) {
        // ---------------------------------------------------------------------
        // Ignore Stale Failures
        // ---------------------------------------------------------------------
        //
        // A stale request must never replace the active request's error.
        //
        // ---------------------------------------------------------------------

        if (
          cancelled ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        // ---------------------------------------------------------------------
        // Normalize Error
        // ---------------------------------------------------------------------

        setError(
          cause instanceof Error
            ? cause
            : new Error(
                'Unable to load public Journeys.',
              ),
        );
      } finally {
        // ---------------------------------------------------------------------
        // Request Completion
        // ---------------------------------------------------------------------
        //
        // Only the active request can finish the loading state.
        //
        // Without the request identity check, an older request could complete
        // while a newer request is still in flight and incorrectly set:
        //
        //     isLoading = false
        //
        // ---------------------------------------------------------------------

        if (
          !cancelled &&
          requestId === requestIdRef.current
        ) {
          setIsLoading(false);
        }
      }
    };

    // -------------------------------------------------------------------------
    // Execute
    // -------------------------------------------------------------------------

    void load();

    // -------------------------------------------------------------------------
    // Cleanup
    // -------------------------------------------------------------------------
    //
    // Mark this request lifecycle as inactive.
    //
    // This does not necessarily abort the HTTP operation itself. The request
    // ID check remains the authoritative protection against stale state.
    //
    // -------------------------------------------------------------------------

    return () => {
      cancelled = true;
    };
  }, [from, to, date]);

  // ===========================================================================
  // Public Hook State
  // ===========================================================================

  return {
    data,
    isLoading,
    error,
  };
}
