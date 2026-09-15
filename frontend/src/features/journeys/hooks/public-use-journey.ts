// src/features/journeys/hooks/public-use-journey.ts

// -----------------------------------------------------------------------------
// sisiMove — Public Journey Detail Hook
// -----------------------------------------------------------------------------
//
// React hook for retrieving one publicly discoverable Journey.
//
// Public Journey detail flow:
//
//     usePublicJourney(publicId)
//             │
//             ▼
//     getPublicJourneyByPublicId()
//             │
//             ▼
//     GET /journeys/:journeyPublicId
//             │
//             ▼
//     Journey public-read boundary
//             │
//             ▼
//     PublicJourney API response
//             │
//             ▼
//     mapPublicJourney()
//             │
//             ▼
//     frontend PublicJourney
//
// Architectural boundary
// ----------------------
//
// Journey remains the primary domain object.
//
// The backend public-read boundary is responsible for returning the complete
// public Journey representation, including the provider composition:
//
//     provider.traveller
//     provider.trust
//
// This hook does not reconstruct that relationship.
//
// Responsibilities:
// - accept a Journey public identifier;
// - retrieve the public Journey detail;
// - map the API representation into the frontend PublicJourney model;
// - expose loading, data, and error state;
// - prevent stale Journey data from being displayed after navigation;
// - prevent obsolete requests from mutating current state.
//
// This hook does NOT:
// - fetch Traveller Profile data;
// - fetch Trust data;
// - fetch Journey Demand data;
// - compose Marketplace data;
// - perform Journey lifecycle operations;
// - require authentication;
// - implement Journey business rules;
// - determine Journey public visibility.
//
// Marketplace composition belongs above the Journey feature boundary.
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
  getPublicJourneyByPublicId,
} from '../api';

// -----------------------------------------------------------------------------
// Journey — Public Models
// -----------------------------------------------------------------------------

import type {
  PublicJourney,
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

/**
 * State returned by the public Journey detail hook.
 *
 * `data` is only exposed when it belongs to the currently requested public
 * identifier.
 *
 * This prevents a previously loaded Journey from appearing temporarily when
 * navigating from one Journey detail page to another.
 */
export interface PublicJourneyState {
  readonly data: PublicJourney | null;

  /**
   * True while the current public Journey identifier has not yet produced a
   * completed result.
   *
   * An invalid/empty identifier does not trigger a network request and is
   * therefore not considered loading.
   */
  readonly isLoading: boolean;

  /**
   * Error belonging to the currently requested public identifier.
   *
   * Errors from previous Journey requests are never exposed after navigation.
   */
  readonly error: Error | null;
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Retrieves one publicly discoverable Journey by public identifier.
 *
 * The public identifier is normalized before crossing the feature API
 * boundary.
 *
 * Example:
 *
 *     usePublicJourney('SM-JOURNEY-004')
 *
 * Navigation safety:
 *
 *     Journey A → Journey B
 *
 * immediately stops exposing Journey A. The hook derives the visible result
 * from `loadedPublicId`, so it does not need a synchronous setState call inside
 * the effect merely to clear stale data.
 *
 * Request sequencing additionally protects against an older HTTP response
 * arriving after a newer request has already completed.
 */
export function usePublicJourney(
  journeyPublicId: string | null | undefined,
): PublicJourneyState {
  // ===========================================================================
  // Normalize Identifier
  // ===========================================================================

  /**
   * Normalize the external identifier before using it as request state.
   *
   * Whitespace-only identifiers are treated as absent.
   */
  const normalizedPublicId =
    typeof journeyPublicId === 'string'
      ? journeyPublicId.trim()
      : '';

  const hasPublicId =
    normalizedPublicId.length > 0;

  // ===========================================================================
  // Result State
  // ===========================================================================

  const [data, setData] =
    useState<PublicJourney | null>(null);

  /**
   * Identifies the Journey represented by `data`.
   *
   * `null` means that no completed result is currently represented.
   */
  const [loadedPublicId, setLoadedPublicId] =
    useState<string | null>(null);

  const [error, setError] =
    useState<Error | null>(null);

  // ===========================================================================
  // Request Identity
  // ===========================================================================
  //
  // The request sequence advances whenever the identifier changes, including
  // when the identifier becomes empty.
  //
  // This is deliberate.
  //
  // Example:
  //
  //     Journey A request → id 1
  //     navigation to B   → id 2
  //     navigation to ""  → id 3
  //
  // No older request can commit after the identifier has moved on.
  //
  // ===========================================================================

  const requestIdRef =
    useRef(0);

  // ===========================================================================
  // Load Public Journey
  // ===========================================================================

  useEffect(() => {
    /*
     * Every identifier transition creates a new request generation.
     *
     * This happens before checking whether an identifier exists so that an
     * invalid/empty identifier also invalidates any previous network request.
     */
    const requestId =
      ++requestIdRef.current;

    /*
     * There is no request to perform without a valid public identifier.
     *
     * The returned state is derived from the identifier and loaded result, so
     * no synchronous state update is necessary here.
     */
    if (!hasPublicId) {
      return;
    }

    let cancelled = false;

    // -------------------------------------------------------------------------
    // Load
    // -------------------------------------------------------------------------

    const load = async (): Promise<void> => {
      try {
        // ---------------------------------------------------------------------
        // Request
        // ---------------------------------------------------------------------

        const journey =
          await getPublicJourneyByPublicId(
            normalizedPublicId,
          );

        // ---------------------------------------------------------------------
        // Stale Request Protection
        // ---------------------------------------------------------------------
        //
        // The response is ignored if:
        //
        // - the effect was cleaned up; or
        // - another identifier has created a newer request generation.
        //
        // ---------------------------------------------------------------------

        if (
          cancelled ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        // ---------------------------------------------------------------------
        // API → Frontend Model
        // ---------------------------------------------------------------------
        //
        // The backend has already composed the public Journey representation.
        //
        // The mapper performs only the API/frontend translation.
        //
        // It must preserve:
        //
        //     provider.traveller
        //     provider.trust
        //
        // without performing additional requests.
        //
        const mappedJourney =
          journey === null
            ? null
            : mapPublicJourney(journey);

        // ---------------------------------------------------------------------
        // Commit Result
        // ---------------------------------------------------------------------

        setData(mappedJourney);

        setLoadedPublicId(
          normalizedPublicId,
        );

        setError(null);
      } catch (cause: unknown) {
        // ---------------------------------------------------------------------
        // Ignore Stale Failures
        // ---------------------------------------------------------------------

        if (
          cancelled ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        // ---------------------------------------------------------------------
        // Commit Error
        // ---------------------------------------------------------------------
        //
        // The failed identifier is still marked as loaded because the request
        // has completed. This allows `isLoading` to become false while the
        // error remains associated with the correct Journey identifier.
        //
        // ---------------------------------------------------------------------

        setData(null);

        setLoadedPublicId(
          normalizedPublicId,
        );

        setError(
          cause instanceof Error
            ? cause
            : new Error(
                'Unable to load the public Journey.',
              ),
        );
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
    // The request sequence remains the stronger protection because the HTTP
    // operation itself may continue after React cleans up the effect.
    //
    // -------------------------------------------------------------------------

    return () => {
      cancelled = true;
    };
  }, [hasPublicId, normalizedPublicId]);

  // ===========================================================================
  // Current Result
  // ===========================================================================
  //
  // A stored result is valid only when it belongs to the currently requested
  // identifier.
  //
  // Therefore:
  //
  //     Journey A loaded
  //     ↓
  //     navigate to Journey B
  //     ↓
  //     loadedPublicId === A
  //     normalizedPublicId === B
  //     ↓
  //     A is not exposed
  //
  // This avoids rendering stale Journey A data while Journey B loads.
  //
  // ===========================================================================

  const isCurrentResult =
    hasPublicId &&
    loadedPublicId === normalizedPublicId;

  // ===========================================================================
  // Derived Loading State
  // ===========================================================================

  /**
   * A valid identifier is loading until a completed result or error has been
   * associated with that same identifier.
   */
  const isLoading =
    hasPublicId &&
    !isCurrentResult;

  // ===========================================================================
  // Derived Current Data
  // ===========================================================================

  const currentData =
    isCurrentResult
      ? data
      : null;

  // ===========================================================================
  // Derived Current Error
  // ===========================================================================

  const currentError =
    isCurrentResult
      ? error
      : null;

  // ===========================================================================
  // Public State
  // ===========================================================================

  return {
    data: currentData,
    isLoading,
    error: currentError,
  };
}

