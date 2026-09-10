// -----------------------------------------------------------------------------
// Journeys API
// -----------------------------------------------------------------------------
//
// Public API client for Journey read operations.
//
// The Journey domain is the source of truth for public discovery.
//
// Public discovery starts with published Journeys:
//
//   GET /journeys/status/PUBLISHED
//
// Public Journey search is delegated to the Journey backend query layer:
//
//   GET /journeys/search?from=&to=&date=
//
// After a Journey is selected, its public components are established from
// the Journey public identifier:
//
//   GET /journeys/:journeyPublicId
//   GET /journeys/:journeyPublicId/corridor
//   GET /journeys/:journeyPublicId/waypoints
//   GET /journeys/:journeyPublicId/schedule
//   GET /journeys/:journeyPublicId/vehicle
//   GET /journeys/:journeyPublicId/capacity
//   GET /journeys/:journeyPublicId/pricing
//   GET /journeys/:journeyPublicId/preferences
//   GET /journeys/:journeyPublicId/assets
//
// This API intentionally consumes frontend Journey read models rather than
// exposing backend domain entities, Prisma models, or aggregate structures.
//
// Authentication is not required for these public read operations.
// -----------------------------------------------------------------------------

import { apiClient } from '../../../foundation/http/api-client';

import type { Journey } from '../models';

// -----------------------------------------------------------------------------
// API Paths
// -----------------------------------------------------------------------------

const JOURNEYS_PATH = '/journeys';

// -----------------------------------------------------------------------------
// Get Published Journeys
// -----------------------------------------------------------------------------

/**
 * Retrieves Journeys currently published for public discovery.
 *
 * Backend:
 *
 * GET /journeys/status/PUBLISHED
 */
export async function getPublishedJourneys(): Promise<Journey[]> {
  return apiClient.get<Journey[]>(
    `${JOURNEYS_PATH}/status/PUBLISHED`,
  );
}

// -----------------------------------------------------------------------------
// Search Published Journeys
// -----------------------------------------------------------------------------

/**
 * Searches published Journeys by origin, destination, and departure date.
 *
 * The search criteria are passed to the Journey application query layer.
 * This client does not perform discovery filtering locally.
 *
 * Backend:
 *
 * GET /journeys/search?from=&to=&date=
 *
 * @param from Journey origin.
 * @param to Journey destination.
 * @param date Departure date in YYYY-MM-DD format.
 */
export async function searchPublishedJourneys(
  from: string,
  to: string,
  date: string,
): Promise<Journey[]> {
  const normalizedFrom = from.trim();
  const normalizedTo = to.trim();
  const normalizedDate = date.trim();

  if (!normalizedFrom) {
    throw new Error('Journey origin is required.');
  }

  if (!normalizedTo) {
    throw new Error('Journey destination is required.');
  }

  if (!normalizedDate) {
    throw new Error('Journey date is required.');
  }

  const searchParams = new URLSearchParams({
    from: normalizedFrom,
    to: normalizedTo,
    date: normalizedDate,
  });

  return apiClient.get<Journey[]>(
    `${JOURNEYS_PATH}/search?${searchParams.toString()}`,
  );
}

// -----------------------------------------------------------------------------
// Get Public Journey
// -----------------------------------------------------------------------------

/**
 * Retrieves a publicly discoverable Journey by its public identifier.
 *
 * Backend:
 *
 * GET /journeys/:journeyPublicId
 *
 * @param publicId Public Journey identifier.
 */
export async function getPublicJourney(
  publicId: string,
): Promise<Journey> {
  const normalizedPublicId = publicId.trim();

  if (!normalizedPublicId) {
    throw new Error('Journey public ID is required.');
  }

  return apiClient.get<Journey>(
    `${JOURNEYS_PATH}/${encodeURIComponent(normalizedPublicId)}`,
  );
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export const journeysApi = {
  getPublished: getPublishedJourneys,
  searchPublished: searchPublishedJourneys,
  getPublic: getPublicJourney,
};