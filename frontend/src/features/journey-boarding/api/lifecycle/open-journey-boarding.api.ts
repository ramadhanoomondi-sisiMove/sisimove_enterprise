// -----------------------------------------------------------------------------
// sisiMove — Open Journey Boarding API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Open the boarding process for a JourneyBoarding.
// - Define the HTTP request/response transport contract.
// - Delegate authenticated HTTP execution to AuthenticatedApiClient.
//
// Architectural rules:
// - This is an API adapter only.
// - No lifecycle/business rules belong here.
// - No aggregate is created or orchestrated in the frontend.
// - No domain value objects are constructed in the frontend.
// - No authentication storage is accessed directly.
// - The authenticated API client owns authentication concerns.
// - Public identifiers remain opaque strings at the frontend boundary.
//
// Backend endpoint:
// POST /journey-boardings/:journeyBoardingPublicId/open
//
// Backend command inputs:
// - journeyBoardingPublicId
// - boardingStartedAt (optional)
//
// The backend aggregate owns the NOT_STARTED → BOARDING transition,
// lifecycle invariants, version increment, timestamp handling, and event
// recording.
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
// Request Contract
// -----------------------------------------------------------------------------

/**
 * Request body accepted by the open JourneyBoarding endpoint.
 *
 * The JourneyBoarding public identifier belongs in the URL path.
 *
 * `boardingStartedAt` is optional because the backend command supports an
 * optional explicit timestamp. When omitted, the backend/application layer
 * determines the appropriate timestamp.
 */
export interface OpenJourneyBoardingRequest {
  boardingStartedAt?: string;
}

// -----------------------------------------------------------------------------
// Response Contract
// -----------------------------------------------------------------------------

/**
 * Transport representation of a JourneyBoarding participant.
 */
export interface OpenJourneyBoardingParticipantResponse {
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
export interface OpenJourneyBoardingEventResponse {
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
 * HTTP response returned by the open endpoint.
 *
 * Dates are serialized as ISO strings at the HTTP boundary.
 */
export interface OpenJourneyBoardingResponse {
  publicId: string;
  journeyId: string;
  providerPublicId: string;
  status: string;
  boardingStartedAt?: string;
  journeyStartedAt?: string;
  cancelledAt?: string;
  version: number;
  participants: OpenJourneyBoardingParticipantResponse[];
  events: OpenJourneyBoardingEventResponse[];
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Parameters
// -----------------------------------------------------------------------------

export interface OpenJourneyBoardingParams {
  /**
   * Opaque public identifier of the JourneyBoarding to open.
   */
  journeyBoardingPublicId: string;
}

// -----------------------------------------------------------------------------
// API Adapter
// -----------------------------------------------------------------------------

/**
 * Opens the boarding process for a JourneyBoarding.
 *
 * Backend endpoint:
 *
 * POST /journey-boardings/:journeyBoardingPublicId/open
 */
export async function openJourneyBoarding(
  params: OpenJourneyBoardingParams,
  request?: OpenJourneyBoardingRequest,
  options?: RequestOptions,
): Promise<OpenJourneyBoardingResponse> {
  return authenticatedApiClient.post<OpenJourneyBoardingResponse>(
    `/journey-boardings/${encodeURIComponent(
      params.journeyBoardingPublicId,
    )}/open`,
    request,
    options,
  );
}