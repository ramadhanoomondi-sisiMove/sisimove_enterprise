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
// - contain business logic
// - contain persistence logic
// - expose Prisma models
// - expose domain entities
// - map transport responses into feature models
// - contain React or hook concerns
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
// Public discovery and authenticated Journey Demand management are deliberately
// separated. Public discovery must use public read endpoints. Management
// operations must use authenticated endpoints.
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

const PUBLIC_JOURNEY_DEMANDS_PATH = '/public/journey-demands';

const JOURNEY_DEMANDS_PATH = '/journey-demands';

// -----------------------------------------------------------------------------
// Get Public Journey Demand
// -----------------------------------------------------------------------------

/**
 * Retrieves a publicly discoverable Journey Demand by its public identifier.
 *
 * Authentication is not required.
 *
 * The endpoint returns a public read representation rather than a Journey
 * Demand domain entity.
 *
 * @param publicId Public Journey Demand identifier.
 */
export async function getPublicJourneyDemand(
  publicId: string,
): Promise<JourneyDemandResponse> {
  const normalizedPublicId = publicId.trim();

  if (!normalizedPublicId) {
    throw new Error('Journey Demand public ID is required.');
  }

  return apiClient.get<JourneyDemandResponse>(
    `${PUBLIC_JOURNEY_DEMANDS_PATH}/${encodeURIComponent(normalizedPublicId)}`,
  );
}

// -----------------------------------------------------------------------------
// Get Public Journey Demands
// -----------------------------------------------------------------------------

/**
 * Retrieves publicly discoverable Journey Demands.
 *
 * Authentication is not required.
 *
 * This operation is intentionally kept separate from authenticated Journey
 * Demand management/search workflows.
 */
export async function getPublicJourneyDemands(): Promise<JourneyDemandsResponse> {
  return apiClient.get<JourneyDemandsResponse>(
    PUBLIC_JOURNEY_DEMANDS_PATH,
  );
}

// -----------------------------------------------------------------------------
// Get Authenticated Journey Demand
// -----------------------------------------------------------------------------

/**
 * Retrieves a Journey Demand belonging to the authenticated workflow.
 *
 * Authentication is required by the backend.
 *
 * This operation is intentionally separate from the public read endpoint.
 *
 * @param publicId Public Journey Demand identifier.
 */
export async function getJourneyDemand(
  publicId: string,
): Promise<JourneyDemandResponse> {
  const normalizedPublicId = publicId.trim();

  if (!normalizedPublicId) {
    throw new Error('Journey Demand public ID is required.');
  }

  return apiClient.get<JourneyDemandResponse>(
    `${JOURNEY_DEMANDS_PATH}/${encodeURIComponent(normalizedPublicId)}`,
  );
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export const journeyDemandsApi = {
  /**
   * Public Journey Demand read operations.
   */
  getPublic: getPublicJourneyDemand,
  getPublicMany: getPublicJourneyDemands,

  /**
   * Authenticated Journey Demand operations.
   */
  get: getJourneyDemand,
};