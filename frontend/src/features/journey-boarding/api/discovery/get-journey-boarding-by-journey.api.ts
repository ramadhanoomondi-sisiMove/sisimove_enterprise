// -----------------------------------------------------------------------------
// sisiMove — Get Journey Boarding By Journey API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Retrieve the JourneyBoarding associated with a Journey.
// - Define the HTTP transport contract for this endpoint.
// - Delegate authenticated HTTP execution to AuthenticatedApiClient.
//
// Architectural rules:
// - This is an API adapter only.
// - No domain/business rules belong here.
// - No response mapping belongs here.
// - No direct access to authentication storage.
// - The authenticated API client owns authentication concerns.
// - Journey public identifiers remain opaque strings at the frontend
//   boundary.
//
// Backend endpoint:
// GET /journey-boardings/journey/:journeyId
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
export interface GetJourneyBoardingByJourneyParticipantResponse {
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
 */
export interface GetJourneyBoardingByJourneyEventResponse {
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
 * GET /journey-boardings/journey/:journeyId
 *
 * This mirrors the JourneyBoardingResponse presentation contract.
 */
export interface GetJourneyBoardingByJourneyResponse {
  publicId: string;
  journeyId: string;
  providerPublicId: string;
  status: string;
  boardingStartedAt?: string;
  journeyStartedAt?: string;
  cancelledAt?: string;
  version: number;
  participants: GetJourneyBoardingByJourneyParticipantResponse[];
  events: GetJourneyBoardingByJourneyEventResponse[];
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Parameters
// -----------------------------------------------------------------------------

export interface GetJourneyBoardingByJourneyParams {
  /**
   * Opaque public identifier of the Journey.
   *
   * The frontend does not construct the backend JourneyBoardingJourneyId
   * value object. It transports the identifier to the HTTP endpoint.
   */
  journeyPublicId: string;
}

// -----------------------------------------------------------------------------
// API Adapter
// -----------------------------------------------------------------------------

/**
 * Retrieves the JourneyBoarding associated with a Journey.
 *
 * Backend endpoint:
 *
 * GET /journey-boardings/journey/:journeyId
 */
export async function getJourneyBoardingByJourney(
  params: GetJourneyBoardingByJourneyParams,
  options?: RequestOptions,
): Promise<GetJourneyBoardingByJourneyResponse> {
  return authenticatedApiClient.get<GetJourneyBoardingByJourneyResponse>(
    `/journey-boardings/journey/${encodeURIComponent(
      params.journeyPublicId,
    )}`,
    options,
  );
}