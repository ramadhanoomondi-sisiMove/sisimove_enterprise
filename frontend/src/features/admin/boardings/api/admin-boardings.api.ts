/**
 * sisiMove — Admin Boardings API Adapter
 *
 * Path:
 * src/features/admin/boardings/api/admin-boardings.api.ts
 *
 * Responsibilities:
 * - Retrieve normalized boarding records.
 * - Retrieve an individual boarding.
 * - Retrieve boarding by journey public ID.
 * - Retrieve participants and participant counts.
 * - Create and open boarding.
 * - Manage provider and passenger boarding.
 * - Manage participant lifecycle.
 * - Start or cancel a journey boarding.
 *
 * Backend authorization and boarding lifecycle rules remain authoritative.
 */

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

import type {
  AdminBoarding,
  AdminBoardingParticipant,
} from '../models';

import {
  mapAdminBoarding,
  mapAdminBoardings,
  mapAdminBoardingAggregate,
  mapAdminBoardingParticipant,
} from '../mappers';

import type {
  BoardingAggregateResponse,
  BoardingParticipantResponse as AdminBoardingParticipantApiResponse,
  BoardingResponse as AdminBoardingApiResponse,
} from '../mappers';

// -----------------------------------------------------------------------------
// Request Types
// -----------------------------------------------------------------------------

export interface CreateAdminBoardingRequest {
  journeyId: string;
  causationId?: string;
}

export interface OpenAdminBoardingRequest {
  causationId?: string;
  boardingStartedAt?: string;
}

export interface StartAdminJourneyRequest {
  causationId?: string;
  journeyStartedAt?: string;
}

export interface CancelAdminBoardingRequest {
  causationId?: string;
  cancelledAt?: string;
}

export interface BoardAdminProviderRequest {
  causationId?: string;
  boardedAt?: string;
}

export interface BoardAdminPassengerRequest {
  causationId?: string;
  boardedAt?: string;
}

export interface MarkAdminPassengerNoShowRequest {
  causationId?: string;
  noShowAt?: string;
}

export interface WithdrawAdminBoardingParticipantRequest {
  causationId?: string;
  withdrawnAt?: string;
}

export interface RemoveAdminBoardingParticipantRequest {
  causationId?: string;
  removedAt?: string;
}

// -----------------------------------------------------------------------------
// API Adapter
// -----------------------------------------------------------------------------

class AdminBoardingsApi {
  private readonly basePath = '/journey-boardings';

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  /**
   * GET /journey-boardings
   *
   * The collection endpoint returns domain aggregates with nested props
   * and value objects.
   */
  public async getAll(): Promise<AdminBoarding[]> {
    const responses =
      await authenticatedApiClient.get<BoardingAggregateResponse[]>(
        this.basePath,
      );

    return mapAdminBoardings(responses);
  }

  /**
   * GET /journey-boardings/:journeyBoardingPublicId
   *
   * The endpoint is expected to return a raw JourneyBoardingAggregate.
   */
  public async getByPublicId(
    journeyBoardingPublicId: string,
  ): Promise<AdminBoarding> {
    const publicId = this.requirePublicId(
      journeyBoardingPublicId,
      'Boarding public ID',
    );

    const response =
      await authenticatedApiClient.get<BoardingAggregateResponse>(
        `${this.basePath}/${encodeURIComponent(publicId)}`,
      );

    return mapAdminBoardingAggregate(response);
  }

  /**
   * GET /journey-boardings/journey/:journeyId
   *
   * Returns the canonical JourneyBoardingResponse.
   */
  public async getByJourney(
    journeyPublicId: string,
  ): Promise<AdminBoarding> {
    const publicId = this.requirePublicId(
      journeyPublicId,
      'Journey public ID',
    );

    const response =
      await authenticatedApiClient.get<AdminBoardingApiResponse>(
        `${this.basePath}/journey/${encodeURIComponent(publicId)}`,
      );

    return mapAdminBoarding(response);
  }

  /**
   * GET /journey-boardings/:journeyBoardingPublicId/participants
   */
  public async getParticipants(
    journeyBoardingPublicId: string,
  ): Promise<AdminBoardingParticipant[]> {
    const publicId = this.requirePublicId(
      journeyBoardingPublicId,
      'Boarding public ID',
    );

    const responses =
      await authenticatedApiClient.get<
        AdminBoardingParticipantApiResponse[]
      >(
        `${this.basePath}/${encodeURIComponent(publicId)}/participants`,
      );

    return responses.map(mapAdminBoardingParticipant);
  }

  /**
   * GET /journey-boardings/participants/count
   */
  public async countParticipants(): Promise<number> {
    return authenticatedApiClient.get<number>(
      `${this.basePath}/participants/count`,
    );
  }

  // ---------------------------------------------------------------------------
  // Create and Open Boarding
  // ---------------------------------------------------------------------------

  /**
   * POST /journey-boardings
   *
   * The endpoint is expected to return a raw JourneyBoardingAggregate.
   */
  public async create(
    request: CreateAdminBoardingRequest,
  ): Promise<AdminBoarding> {
    const journeyId = this.requirePublicId(
      request.journeyId,
      'Journey ID',
    );

    const response =
      await authenticatedApiClient.post<BoardingAggregateResponse>(
        this.basePath,
        {
          ...request,
          journeyId,
        },
      );

    return mapAdminBoardingAggregate(response);
  }

  /**
   * POST /journey-boardings/:journeyBoardingPublicId/open
   *
   * The endpoint is expected to return a raw JourneyBoardingAggregate.
   */
  public async open(
    journeyBoardingPublicId: string,
    request: OpenAdminBoardingRequest = {},
  ): Promise<AdminBoarding> {
    const publicId = this.requirePublicId(
      journeyBoardingPublicId,
      'Boarding public ID',
    );

    const response =
      await authenticatedApiClient.post<BoardingAggregateResponse>(
        `${this.basePath}/${encodeURIComponent(publicId)}/open`,
        request,
      );

    return mapAdminBoardingAggregate(response);
  }

  // ---------------------------------------------------------------------------
  // Journey Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * POST /journey-boardings/:journeyBoardingPublicId/start
   *
   * Returns the canonical REST response.
   */
  public async startJourney(
    journeyBoardingPublicId: string,
    request: StartAdminJourneyRequest = {},
  ): Promise<AdminBoarding> {
    const publicId = this.requirePublicId(
      journeyBoardingPublicId,
      'Boarding public ID',
    );

    const response =
      await authenticatedApiClient.post<AdminBoardingApiResponse>(
        `${this.basePath}/${encodeURIComponent(publicId)}/start`,
        request,
      );

    return mapAdminBoarding(response);
  }

  /**
   * POST /journey-boardings/:journeyBoardingPublicId/cancel
   */
  public async cancel(
    journeyBoardingPublicId: string,
    request: CancelAdminBoardingRequest = {},
  ): Promise<AdminBoarding> {
    const publicId = this.requirePublicId(
      journeyBoardingPublicId,
      'Boarding public ID',
    );

    const response =
      await authenticatedApiClient.post<AdminBoardingApiResponse>(
        `${this.basePath}/${encodeURIComponent(publicId)}/cancel`,
        request,
      );

    return mapAdminBoarding(response);
  }

  // ---------------------------------------------------------------------------
  // Provider Boarding
  // ---------------------------------------------------------------------------

  /**
   * POST /journey-boardings/:journeyBoardingPublicId/provider/board
   *
   * The endpoint is expected to return a raw JourneyBoardingAggregate.
   */
  public async boardProvider(
    journeyBoardingPublicId: string,
    request: BoardAdminProviderRequest = {},
  ): Promise<AdminBoarding> {
    const publicId = this.requirePublicId(
      journeyBoardingPublicId,
      'Boarding public ID',
    );

    const response =
      await authenticatedApiClient.post<BoardingAggregateResponse>(
        `${this.basePath}/${encodeURIComponent(publicId)}/provider/board`,
        request,
      );

    return mapAdminBoardingAggregate(response);
  }

  // ---------------------------------------------------------------------------
  // Passenger Boarding
  // ---------------------------------------------------------------------------

  /**
   * POST /journey-boardings/:journeyBoardingPublicId/participants/:participantPublicId/board
   */
  public async boardPassenger(
    journeyBoardingPublicId: string,
    participantPublicId: string,
    request: BoardAdminPassengerRequest = {},
  ): Promise<AdminBoarding> {
    const boardingId = this.requirePublicId(
      journeyBoardingPublicId,
      'Boarding public ID',
    );

    const participantId = this.requirePublicId(
      participantPublicId,
      'Participant public ID',
    );

    const response =
      await authenticatedApiClient.post<AdminBoardingApiResponse>(
        `${this.basePath}/${encodeURIComponent(boardingId)}/participants/${encodeURIComponent(participantId)}/board`,
        request,
      );

    return mapAdminBoarding(response);
  }

  /**
   * POST /journey-boardings/:journeyBoardingPublicId/participants/:participantPublicId/no-show
   */
  public async markPassengerNoShow(
    journeyBoardingPublicId: string,
    participantPublicId: string,
    request: MarkAdminPassengerNoShowRequest = {},
  ): Promise<AdminBoarding> {
    const boardingId = this.requirePublicId(
      journeyBoardingPublicId,
      'Boarding public ID',
    );

    const participantId = this.requirePublicId(
      participantPublicId,
      'Participant public ID',
    );

    const response =
      await authenticatedApiClient.post<AdminBoardingApiResponse>(
        `${this.basePath}/${encodeURIComponent(boardingId)}/participants/${encodeURIComponent(participantId)}/no-show`,
        request,
      );

    return mapAdminBoarding(response);
  }

  // ---------------------------------------------------------------------------
  // Participant Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * POST /journey-boardings/:journeyBoardingPublicId/participants/:participantPublicId/withdraw
   */
  public async withdrawParticipant(
    journeyBoardingPublicId: string,
    participantPublicId: string,
    request: WithdrawAdminBoardingParticipantRequest = {},
  ): Promise<AdminBoarding> {
    const boardingId = this.requirePublicId(
      journeyBoardingPublicId,
      'Boarding public ID',
    );

    const participantId = this.requirePublicId(
      participantPublicId,
      'Participant public ID',
    );

    const response =
      await authenticatedApiClient.post<AdminBoardingApiResponse>(
        `${this.basePath}/${encodeURIComponent(boardingId)}/participants/${encodeURIComponent(participantId)}/withdraw`,
        request,
      );

    return mapAdminBoarding(response);
  }

  /**
   * POST /journey-boardings/:journeyBoardingPublicId/participants/:participantPublicId/remove
   */
  public async removeParticipant(
    journeyBoardingPublicId: string,
    participantPublicId: string,
    request: RemoveAdminBoardingParticipantRequest = {},
  ): Promise<AdminBoarding> {
    const boardingId = this.requirePublicId(
      journeyBoardingPublicId,
      'Boarding public ID',
    );

    const participantId = this.requirePublicId(
      participantPublicId,
      'Participant public ID',
    );

    const response =
      await authenticatedApiClient.post<AdminBoardingApiResponse>(
        `${this.basePath}/${encodeURIComponent(boardingId)}/participants/${encodeURIComponent(participantId)}/remove`,
        request,
      );

    return mapAdminBoarding(response);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private requirePublicId(value: string, label: string): string {
    const publicId = value.trim();

    if (!publicId) {
      throw new Error(`${label} is required.`);
    }

    return publicId;
  }
}

// -----------------------------------------------------------------------------
// Export
// -----------------------------------------------------------------------------

export const adminBoardingsApi = new AdminBoardingsApi();
