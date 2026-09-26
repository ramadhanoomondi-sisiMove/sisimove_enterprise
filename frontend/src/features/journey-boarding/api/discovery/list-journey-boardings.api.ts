// -----------------------------------------------------------------------------
// sisiMove — List Journey Boardings API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Retrieve JourneyBoarding records available to the authenticated caller.
// - Define the HTTP transport contract for this endpoint.
// - Delegate authenticated HTTP execution to AuthenticatedApiClient.
//
// Architectural rules:
// - This is an API adapter only.
// - No domain/business rules belong here.
// - No response mapping belongs here.
// - No direct access to authentication storage.
// - The authenticated API client owns authentication concerns.
// - Public IDs remain opaque strings at the frontend boundary.
//
// Backend endpoint:
// GET /journey-boardings
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// HTTP
// -----------------------------------------------------------------------------

import type { RequestOptions } from '@/foundation/http';

// -----------------------------------------------------------------------------
// Authentication HTTP Client
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// Response Contract
// -----------------------------------------------------------------------------

/**
 * Transport representation of a JourneyBoarding root entity.
 *
 * The current backend list endpoint returns JourneyBoardingEntity[] rather
 * than the complete JourneyBoardingResponse projection.
 *
 * Therefore this contract intentionally contains only the JourneyBoarding
 * root fields exposed by the entity.
 *
 * Participants and events are not invented here because the current
 * controller does not return them from the list endpoint.
 */
export interface ListJourneyBoardingsResponse {
  publicId: string;
  journeyId: string;
  providerPublicId: string;
  status: string;
  boardingStartedAt?: string;
  journeyStartedAt?: string;
  cancelledAt?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// API Adapter
// -----------------------------------------------------------------------------

/**
 * Retrieves JourneyBoarding records for the authenticated caller.
 *
 * Backend endpoint:
 *
 * GET /journey-boardings
 */
export async function listJourneyBoardings(
  options?: RequestOptions,
): Promise<ListJourneyBoardingsResponse[]> {
  return authenticatedApiClient.get<
    ListJourneyBoardingsResponse[]
  >(
    '/journey-boardings',
    options,
  );
}