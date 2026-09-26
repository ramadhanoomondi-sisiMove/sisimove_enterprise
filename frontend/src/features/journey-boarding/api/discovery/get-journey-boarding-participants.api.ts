// -----------------------------------------------------------------------------
// sisiMove — Get Journey Boarding Participants API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Retrieve participants belonging to a JourneyBoarding.
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
// GET /journey-boardings/:journeyBoardingPublicId/participants
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
 * This mirrors the fields exposed by JourneyBoardingParticipantEntity /
 * JourneyBoardingParticipantResponse.
 *
 * Dates are represented as ISO strings at the HTTP boundary.
 */
export interface GetJourneyBoardingParticipantsResponse {
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

// -----------------------------------------------------------------------------
// Parameters
// -----------------------------------------------------------------------------

export interface GetJourneyBoardingParticipantsParams {
  /**
   * Opaque public identifier of the JourneyBoarding.
   *
   * The frontend does not construct the backend JourneyBoardingPublicId
   * value object. It transports the identifier to the HTTP endpoint.
   */
  publicId: string;
}

// -----------------------------------------------------------------------------
// API Adapter
// -----------------------------------------------------------------------------

/**
 * Retrieves all participants belonging to a JourneyBoarding.
 *
 * Backend endpoint:
 *
 * GET /journey-boardings/:journeyBoardingPublicId/participants
 */
export async function getJourneyBoardingParticipants(
  params: GetJourneyBoardingParticipantsParams,
  options?: RequestOptions,
): Promise<GetJourneyBoardingParticipantsResponse[]> {
  return authenticatedApiClient.get<
    GetJourneyBoardingParticipantsResponse[]
  >(
    `/journey-boardings/${encodeURIComponent(
      params.publicId,
    )}/participants`,
    options,
  );
}