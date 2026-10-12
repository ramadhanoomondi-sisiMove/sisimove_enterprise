// -----------------------------------------------------------------------------
// sisiMove — Get Journey Boarding Participant Summary API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Retrieve a participant summary within a Journey Boarding context.
// - Define the HTTP transport contract for the participant-summary endpoint.
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
// Response Contracts
// -----------------------------------------------------------------------------

export interface GetJourneyBoardingParticipantSummaryResponse {
  participant: {
    publicId: string;
    handle: string;
    bio: string | null;
    countryCode: string;
    avatarUrl: string | null;
    accountStatus: string;
  };

  contact: {
    email: string;
    phoneNumber: string;
  } | null;

  verification: {
    status: string;
    level: string;
    active: boolean;
    verified: boolean;
    expiresAt: string | null;
  };

  trust: {
    verificationLevel: string;
    ratingAverage: number;
    ratingCount: number;
    completedJourneys: number;
    badges: GetJourneyBoardingParticipantBadgeResponse[];
  };

  verificationDisclaimer: string;
}

export interface GetJourneyBoardingParticipantBadgeResponse {
  publicId: string;
  type: string;
  name: string;
  description: string | null;
  asset: {
    publicId: string;
    url: string;
    alt: string;
  } | null;
}

// -----------------------------------------------------------------------------
// Parameters
// -----------------------------------------------------------------------------

export interface GetJourneyBoardingParticipantSummaryParams {
  /**
   * Public identifier of the Journey Boarding aggregate.
   */
  journeyBoardingPublicId: string;

  /**
   * Identity public identifier of the participant whose summary is requested.
   */
  participantIdentityPublicId: string;
}

// -----------------------------------------------------------------------------
// API Adapter
// -----------------------------------------------------------------------------

/**
 * Retrieves a participant summary within a Journey Boarding context.
 *
 * Backend endpoint:
 *
 * GET /journey-boardings/:journeyBoardingPublicId/participants/:participantIdentityPublicId/summary
 */
export async function getJourneyBoardingParticipantSummary(
  params: GetJourneyBoardingParticipantSummaryParams,
  options?: RequestOptions,
): Promise<GetJourneyBoardingParticipantSummaryResponse> {
  const journeyBoardingPublicId = encodeURIComponent(
    params.journeyBoardingPublicId,
  );

  const participantIdentityPublicId = encodeURIComponent(
    params.participantIdentityPublicId,
  );

  return authenticatedApiClient.get<GetJourneyBoardingParticipantSummaryResponse>(
    `/journey-boardings/${journeyBoardingPublicId}/participants/${participantIdentityPublicId}/summary`,
    options,
  );
}