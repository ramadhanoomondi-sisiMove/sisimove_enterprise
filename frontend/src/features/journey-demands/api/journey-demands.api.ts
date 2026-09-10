// -----------------------------------------------------------------------------
// sisiMove — Journey Demands API
// -----------------------------------------------------------------------------
//
// HTTP client for Journey Demand operations.
//
// This API client is responsible only for communication with the Journey
// Demand HTTP API.
//
// It must not:
// - contain business logic;
// - contain persistence logic;
// - expose Prisma models;
// - contain React or hook concerns;
// - own discovery state;
// - perform client-side filtering.
//
// Architectural boundary:
//
// HTTP API
//    ↓
// journey-demands.api.ts
//    ↓
// transport response
//    ↓
// JourneyDemandMapper
//    ↓
// Journey Demand feature model
//
// Public discovery is provided directly by the Journey Demand bounded context.
//
// Public discovery:
//
//   GET /journey-demands
//   GET /journey-demands/open
//   GET /journey-demands/:journeyDemandPublicId
//
// Authenticated Journey Demand operations use the same bounded-context API
// where the backend operation requires authentication.
//
// The frontend does not invent a `/public/journey-demands` route. The backend
// controller is mounted directly at `/journey-demands`.
//
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// Foundation HTTP Client
// -----------------------------------------------------------------------------

import { apiClient } from '../../../foundation/http/api-client';


// -----------------------------------------------------------------------------
// API Transport Types
// -----------------------------------------------------------------------------

import type {
  JourneyDemandResponse,
  JourneyDemandsResponse,
} from './journey-demands.types';


// -----------------------------------------------------------------------------
// API Paths
// -----------------------------------------------------------------------------

const JOURNEY_DEMANDS_PATH = '/journey-demands';


// -----------------------------------------------------------------------------
// Get Journey Demand
// -----------------------------------------------------------------------------

/**
 * Retrieves a Journey Demand by its public identifier.
 *
 * The backend currently exposes:
 *
 *   GET /journey-demands/:journeyDemandPublicId
 *
 * Authentication requirements, if any, are determined by the backend route
 * policy. The frontend does not duplicate that policy in the API client.
 *
 * @param publicId Journey Demand public identifier.
 */
export async function getJourneyDemand(
  publicId: string,
): Promise<JourneyDemandResponse> {
  const normalizedPublicId = publicId.trim();

  if (!normalizedPublicId) {
    throw new Error(
      'Journey Demand public ID is required.',
    );
  }

  return apiClient.get<JourneyDemandResponse>(
    `${JOURNEY_DEMANDS_PATH}/${encodeURIComponent(normalizedPublicId)}`,
  );
}


// -----------------------------------------------------------------------------
// Get Public Journey Demands
// -----------------------------------------------------------------------------

/**
 * Retrieves the public Journey Demand collection.
 *
 * This corresponds to:
 *
 *   GET /journey-demands
 *
 * The backend currently returns a plain array of Journey Demand transport
 * records.
 *
 * The backend owns:
 * - which Journey Demands are publicly discoverable;
 * - ordering;
 * - filtering;
 * - pagination, if supported by the endpoint.
 *
 * No client-side discovery filtering is performed here.
 */
export async function getPublicJourneyDemands(): Promise<JourneyDemandsResponse> {
  return apiClient.get<JourneyDemandsResponse>(
    JOURNEY_DEMANDS_PATH,
  );
}


// -----------------------------------------------------------------------------
// Get Open Journey Demands
// -----------------------------------------------------------------------------

/**
 * Retrieves Journey Demands currently classified as open by the backend.
 *
 * This corresponds to:
 *
 *   GET /journey-demands/open
 *
 * The backend currently returns a plain array of Journey Demand transport
 * records.
 *
 * The backend owns the definition of an open Journey Demand.
 */
export async function getOpenJourneyDemands(): Promise<JourneyDemandsResponse> {
  return apiClient.get<JourneyDemandsResponse>(
    `${JOURNEY_DEMANDS_PATH}/open`,
  );
}


// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export const journeyDemandsApi = {
  /**
   * Retrieves a Journey Demand by public identifier.
   */
  get: getJourneyDemand,

  /**
   * Retrieves the public Journey Demand collection.
   */
  getPublicMany: getPublicJourneyDemands,

  /**
   * Retrieves the public open Journey Demand collection.
   */
  getOpen: getOpenJourneyDemands,
};