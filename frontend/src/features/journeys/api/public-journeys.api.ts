// src/features/journeys/api/public-journeys.api.ts
// -----------------------------------------------------------------------------
// sisiMove — Public Journeys API
// -----------------------------------------------------------------------------
//
// Public HTTP operations for Journey discovery.
//
// Responsibilities:
// - retrieve publicly discoverable Journeys;
// - retrieve one publicly discoverable Journey;
// - provide optional marketplace discovery filters;
// - translate frontend query state into HTTP query parameters.
//
// This module does not:
// - own Journey domain models;
// - implement marketplace composition;
// - perform authentication;
// - expose internal Journey lifecycle/status queries.
//
// The Marketplace feature may consume these operations when composing the
// public marketplace with Journey Demand.
//
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http/api-client';

import type {
  PublicJourney,
  PublicJourneyQuery,
} from '../models';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const PUBLIC_JOURNEYS_PATH = '/public/journeys';

// -----------------------------------------------------------------------------
// API Operations
// -----------------------------------------------------------------------------

/**
 * Retrieve publicly discoverable Journeys.
 *
 * With no query supplied, this returns the public Journey collection used
 * by the marketplace's initial unfiltered discovery state.
 *
 * Optional filters refine the collection:
 *
 *   from
 *   to
 *   date
 */
export async function getPublicJourneys(
  query?: PublicJourneyQuery,
): Promise<readonly PublicJourney[]> {
  return apiClient.get<readonly PublicJourney[]>(
    PUBLIC_JOURNEYS_PATH,
    {
      query: {
        from: query?.from,
        to: query?.to,
        date: query?.date,
      },
    },
  );
}

/**
 * Retrieve one publicly discoverable Journey by its public identifier.
 *
 * The backend public-read boundary is responsible for ensuring that the
 * Journey is actually publicly discoverable.
 */
export async function getPublicJourneyByPublicId(
  journeyPublicId: string,
): Promise<PublicJourney | null> {
  return apiClient.get<PublicJourney>(
    `${PUBLIC_JOURNEYS_PATH}/${encodeURIComponent(journeyPublicId)}`,
  );
}