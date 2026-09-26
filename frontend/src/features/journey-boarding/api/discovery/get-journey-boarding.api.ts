// -----------------------------------------------------------------------------
// sisiMove — Get Journey Boarding API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Retrieve one JourneyBoarding by its public identifier.
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
 * Transport representation of a JourneyBoarding participant.
 *
 * Dates are represented as ISO strings because this is the serialized
 * HTTP representation received by the browser.
 */
export interface GetJourneyBoardingParticipantResponse {
  publicId: string;
  boardingId: string;
  memberPublicId: string;
  bookingPublicId?: string;
  role: string;
  status: string;
  expectedAt: string;
  boardedAt?: string;
  withdrawnAt?: string;
  noShowAt?: string;
  removedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Transport representation of a JourneyBoarding event.
 *
 * Metadata intentionally remains an open record because the backend event
 * entity exposes event-specific metadata without imposing a frontend
 * domain model on it.
 */
export interface GetJourneyBoardingEventResponse {
  publicId: string;
  boardingId: string;
  type: string;
  memberPublicId?: string;
  bookingPublicId?: string;
  actorPublicId?: string;
  occurredAt: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

/**
 * HTTP response returned by:
 *
 * GET /journey-boardings/:journeyBoardingPublicId
 *
 * This mirrors the JourneyBoardingResponse presentation contract.
 */
export interface GetJourneyBoardingResponse {
  publicId: string;
  journeyId: string;
  providerPublicId: string;
  status: string;
  boardingStartedAt?: string;
  journeyStartedAt?: string;
  cancelledAt?: string;
  version: number;
  participants: GetJourneyBoardingParticipantResponse[];
  events: GetJourneyBoardingEventResponse[];
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Parameters
// -----------------------------------------------------------------------------

export interface GetJourneyBoardingParams {
  /**
   * Opaque public identifier of the JourneyBoarding.
   *
   * The frontend does not construct the backend value object. It simply
   * transports the identifier supplied by the caller.
   */
  publicId: string;
}

// -----------------------------------------------------------------------------
// API Adapter
// -----------------------------------------------------------------------------

/**
 * Retrieves a single JourneyBoarding by public identifier.
 *
 * Backend endpoint:
 *
 * GET /journey-boardings/:journeyBoardingPublicId
 */
export async function getJourneyBoarding(
  params: GetJourneyBoardingParams,
  options?: RequestOptions,
): Promise<GetJourneyBoardingResponse> {
  return authenticatedApiClient.get<GetJourneyBoardingResponse>(
    `/journey-boardings/${encodeURIComponent(params.publicId)}`,
    options,
  );
}