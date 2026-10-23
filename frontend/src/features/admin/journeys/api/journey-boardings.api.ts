
/**
 * sisiMove — Journey Boardings API
 *
 * HTTP adapter for the Journey Boarding REST API.
 *
 * Responsibilities:
 * - Expose confirmed boarding endpoints.
 * - Use the authenticated API client.
 * - Encode public IDs safely.
 * - Keep HTTP transport separate from response mapping.
 *
 * Backend source:
 * JourneyBoardingController
 *
 * Base route: /journey-boardings
 */

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

import type { JourneyBoardingBackendResponse } from '../mappers/journey-boarding.mapper';

// -----------------------------------------------------------------------------
// Request contracts
// -----------------------------------------------------------------------------

export interface CreateJourneyBoardingRequest {
  journeyId: string;
  causationId?: string;
}

export interface OpenJourneyBoardingRequest {
  causationId?: string;
  boardingStartedAt?: string;
}

export interface StartJourneyRequest {
  causationId?: string;
  journeyStartedAt?: string;
}

export interface CancelJourneyBoardingRequest {
  causationId?: string;
  cancelledAt?: string;
}

export interface BoardProviderRequest {
  causationId?: string;
  boardedAt?: string;
}

export interface BoardPassengerRequest {
  causationId?: string;
  boardedAt?: string;
}

export interface MarkPassengerNoShowRequest {
  causationId?: string;
  noShowAt?: string;
}

export interface WithdrawParticipantRequest {
  causationId?: string;
  withdrawnAt?: string;
}

export interface RemoveParticipantRequest {
  causationId?: string;
  removedAt?: string;
}

// -----------------------------------------------------------------------------
// Response contracts
// -----------------------------------------------------------------------------

export interface JourneyBoardingParticipantSummaryResponse {
  [key: string]: unknown;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const BASE_PATH = '/journey-boardings';

function encodePathSegment(value: string, fieldName: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required.`);
  }

  return encodeURIComponent(normalized);
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export const journeyBoardingsApi = {
  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  /**
   * GET /journey-boardings
   */
  async list<TResponse = unknown>(): Promise<readonly TResponse[]> {
    return authenticatedApiClient.get<TResponse[]>(BASE_PATH);
  },

  /**
   * GET /journey-boardings/participants/count
   */
  async getParticipantCount(): Promise<number> {
    return authenticatedApiClient.get<number>(
      `${BASE_PATH}/participants/count`,
    );
  },

  /**
   * GET /journey-boardings/journey/:journeyId
   */
  async getByJourney(
    journeyId: string,
  ): Promise<JourneyBoardingBackendResponse> {
    const id = encodePathSegment(journeyId, 'journeyId');

    return authenticatedApiClient.get<JourneyBoardingBackendResponse>(
      `${BASE_PATH}/journey/${id}`,
    );
  },

  /**
   * GET /journey-boardings/:journeyBoardingPublicId
   */
  async getByPublicId(
    journeyBoardingPublicId: string,
  ): Promise<JourneyBoardingBackendResponse> {
    const id = encodePathSegment(
      journeyBoardingPublicId,
      'journeyBoardingPublicId',
    );

    return authenticatedApiClient.get<JourneyBoardingBackendResponse>(
      `${BASE_PATH}/${id}`,
    );
  },

  /**
   * GET /journey-boardings/:journeyBoardingPublicId/participants
   */
  async getParticipants<TResponse = unknown>(
    journeyBoardingPublicId: string,
  ): Promise<readonly TResponse[]> {
    const id = encodePathSegment(
      journeyBoardingPublicId,
      'journeyBoardingPublicId',
    );

    return authenticatedApiClient.get<TResponse[]>(
      `${BASE_PATH}/${id}/participants`,
    );
  },

  /**
   * GET /journey-boardings/:journeyBoardingPublicId/participants/:participantIdentityPublicId/summary
   */
  async getParticipantSummary<TResponse = JourneyBoardingParticipantSummaryResponse>(
    journeyBoardingPublicId: string,
    participantIdentityPublicId: string,
  ): Promise<TResponse> {
    const boardingId = encodePathSegment(
      journeyBoardingPublicId,
      'journeyBoardingPublicId',
    );
    const participantId = encodePathSegment(
      participantIdentityPublicId,
      'participantIdentityPublicId',
    );

    return authenticatedApiClient.get<TResponse>(
      `${BASE_PATH}/${boardingId}/participants/${participantId}/summary`,
    );
  },

  // ---------------------------------------------------------------------------
  // Create and open
  // ---------------------------------------------------------------------------

  /**
   * POST /journey-boardings
   */
  async create(
    request: CreateJourneyBoardingRequest,
  ): Promise<JourneyBoardingBackendResponse> {
    return authenticatedApiClient.post<JourneyBoardingBackendResponse>(
      BASE_PATH,
      request,
    );
  },

  /**
   * POST /journey-boardings/:journeyBoardingPublicId/open
   */
  async open(
    journeyBoardingPublicId: string,
    request: OpenJourneyBoardingRequest = {},
  ): Promise<JourneyBoardingBackendResponse> {
    const id = encodePathSegment(
      journeyBoardingPublicId,
      'journeyBoardingPublicId',
    );

    return authenticatedApiClient.post<JourneyBoardingBackendResponse>(
      `${BASE_PATH}/${id}/open`,
      request,
    );
  },

  // ---------------------------------------------------------------------------
  // Journey lifecycle
  // ---------------------------------------------------------------------------

  /**
   * POST /journey-boardings/:journeyBoardingPublicId/start
   */
  async startJourney<TResponse = JourneyBoardingBackendResponse>(
    journeyBoardingPublicId: string,
    request: StartJourneyRequest = {},
  ): Promise<TResponse> {
    const id = encodePathSegment(
      journeyBoardingPublicId,
      'journeyBoardingPublicId',
    );

    return authenticatedApiClient.post<TResponse>(
      `${BASE_PATH}/${id}/start`,
      request,
    );
  },

  /**
   * POST /journey-boardings/:journeyBoardingPublicId/cancel
   */
  async cancel(
    journeyBoardingPublicId: string,
    request: CancelJourneyBoardingRequest = {},
  ): Promise<JourneyBoardingBackendResponse> {
    const id = encodePathSegment(
      journeyBoardingPublicId,
      'journeyBoardingPublicId',
    );

    return authenticatedApiClient.post<JourneyBoardingBackendResponse>(
      `${BASE_PATH}/${id}/cancel`,
      request,
    );
  },

  // ---------------------------------------------------------------------------
  // Provider boarding
  // ---------------------------------------------------------------------------

  /**
   * POST /journey-boardings/:journeyBoardingPublicId/provider/board
   */
  async boardProvider(
    journeyBoardingPublicId: string,
    request: BoardProviderRequest = {},
  ): Promise<JourneyBoardingBackendResponse> {
    const id = encodePathSegment(
      journeyBoardingPublicId,
      'journeyBoardingPublicId',
    );

    return authenticatedApiClient.post<JourneyBoardingBackendResponse>(
      `${BASE_PATH}/${id}/provider/board`,
      request,
    );
  },

  // ---------------------------------------------------------------------------
  // Passenger boarding
  // ---------------------------------------------------------------------------

  /**
   * POST /journey-boardings/:journeyBoardingPublicId/participants/:participantPublicId/board
   */
  async boardPassenger<TResponse = JourneyBoardingBackendResponse>(
    journeyBoardingPublicId: string,
    participantPublicId: string,
    request: BoardPassengerRequest = {},
  ): Promise<TResponse> {
    const boardingId = encodePathSegment(
      journeyBoardingPublicId,
      'journeyBoardingPublicId',
    );
    const participantId = encodePathSegment(
      participantPublicId,
      'participantPublicId',
    );

    return authenticatedApiClient.post<TResponse>(
      `${BASE_PATH}/${boardingId}/participants/${participantId}/board`,
      request,
    );
  },

  /**
   * POST /journey-boardings/:journeyBoardingPublicId/participants/:participantPublicId/no-show
   */
  async markPassengerNoShow(
    journeyBoardingPublicId: string,
    participantPublicId: string,
    request: MarkPassengerNoShowRequest = {},
  ): Promise<JourneyBoardingBackendResponse> {
    const boardingId = encodePathSegment(
      journeyBoardingPublicId,
      'journeyBoardingPublicId',
    );
    const participantId = encodePathSegment(
      participantPublicId,
      'participantPublicId',
    );

    return authenticatedApiClient.post<JourneyBoardingBackendResponse>(
      `${BASE_PATH}/${boardingId}/participants/${participantId}/no-show`,
      request,
    );
  },

  // ---------------------------------------------------------------------------
  // Participant lifecycle
  // ---------------------------------------------------------------------------

  /**
   * POST /journey-boardings/:journeyBoardingPublicId/participants/:participantPublicId/withdraw
   */
  async withdrawParticipant(
    journeyBoardingPublicId: string,
    participantPublicId: string,
    request: WithdrawParticipantRequest = {},
  ): Promise<JourneyBoardingBackendResponse> {
    const boardingId = encodePathSegment(
      journeyBoardingPublicId,
      'journeyBoardingPublicId',
    );
    const participantId = encodePathSegment(
      participantPublicId,
      'participantPublicId',
    );

    return authenticatedApiClient.post<JourneyBoardingBackendResponse>(
      `${BASE_PATH}/${boardingId}/participants/${participantId}/withdraw`,
      request,
    );
  },

  /**
   * POST /journey-boardings/:journeyBoardingPublicId/participants/:participantPublicId/remove
   */
  async removeParticipant(
    journeyBoardingPublicId: string,
    participantPublicId: string,
    request: RemoveParticipantRequest = {},
  ): Promise<JourneyBoardingBackendResponse> {
    const boardingId = encodePathSegment(
      journeyBoardingPublicId,
      'journeyBoardingPublicId',
    );
    const participantId = encodePathSegment(
      participantPublicId,
      'participantPublicId',
    );

    return authenticatedApiClient.post<JourneyBoardingBackendResponse>(
      `${BASE_PATH}/${boardingId}/participants/${participantId}/remove`,
      request,
    );
  },
};

export default journeyBoardingsApi;
