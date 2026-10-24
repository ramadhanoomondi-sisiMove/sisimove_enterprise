/**
 * sisiMove — Admin Boardings API Adapter
 *
 * Path:
 * src/features/admin/boardings/api/admin-boardings.api.ts
 *
 * Responsibilities:
 * - Retrieve normalized boarding records.
 * - Retrieve an individual boarding by boarding public ID.
 * - Retrieve boarding by journey public ID.
 * - Retrieve participants and participant counts.
 * - Create and open boarding.
 * - Manage provider and passenger boarding.
 * - Manage participant lifecycle.
 * - Start or cancel a journey boarding.
 *
 * Flat REST responses are normalized by the canonical response mapper.
 * Legacy aggregate responses remain supported where older mutation endpoints
 * have not yet adopted the canonical REST contract.
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
   * Returns flat REST DTOs. The mapper temporarily supports legacy aggregate
   * entries while older backend responses are being migrated.
   */
  public async getAll(): Promise<AdminBoarding[]> {
    const responses =
      await authenticatedApiClient.get<BoardingAggregateResponse[]>(
        this.basePath,
      );

    return mapAdminBoardings(responses);
  }

  /**
   * GET /journey-boardings/:boardingPublicId
   *
   * The identifier must be the boarding public ID, for example:
   * JBD-MTOZQO
   *
   * The endpoint returns a canonical flat REST DTO. Do not pass the associated
   * journey public ID or an internal database ID.
   */
  public async getByPublicId(
    boardingPublicId: string,
  ): Promise<AdminBoarding> {
    const publicId = this.requirePublicId(
      boardingPublicId,
      'Boarding public ID',
    );

    const response =
      await authenticatedApiClient.get<AdminBoardingApiResponse>(
        `${this.basePath}/${encodeURIComponent(publicId)}`,
      );

    return mapAdminBoarding(response);
  }

  /**
   * GET /journey-boardings/journey/:journeyPublicId
   *
   * The identifier must be the associated journey's public ID.
   * This endpoint returns a canonical REST response.
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
   * GET /journey-boardings/:boardingPublicId/participants
   *
   * Returns canonical participant responses.
   */
  public async getParticipants(
    boardingPublicId: string,
  ): Promise<AdminBoardingParticipant[]> {
    const publicId = this.requirePublicId(
      boardingPublicId,
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
   * Returns a domain aggregate.
   *
   * Note: journeyId must match the identifier expected by the backend's
   * create-boarding contract. Confirm whether that contract requires the
   * journey public ID or internal journey ID.
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
   * POST /journey-boardings/:boardingPublicId/open
   *
   * Returns a domain aggregate.
   */
  public async open(
    boardingPublicId: string,
    request: OpenAdminBoardingRequest = {},
  ): Promise<AdminBoarding> {
    const publicId = this.requirePublicId(
      boardingPublicId,
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
   * POST /journey-boardings/:boardingPublicId/start
   *
   * Returns a canonical REST response.
   */
  public async startJourney(
    boardingPublicId: string,
    request: StartAdminJourneyRequest = {},
  ): Promise<AdminBoarding> {
    const publicId = this.requirePublicId(
      boardingPublicId,
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
   * POST /journey-boardings/:boardingPublicId/cancel
   *
   * Returns a canonical REST response.
   */
  public async cancel(
    boardingPublicId: string,
    request: CancelAdminBoardingRequest = {},
  ): Promise<AdminBoarding> {
    const publicId = this.requirePublicId(
      boardingPublicId,
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
   * POST /journey-boardings/:boardingPublicId/provider/board
   *
   * Returns a domain aggregate.
   */
  public async boardProvider(
    boardingPublicId: string,
    request: BoardAdminProviderRequest = {},
  ): Promise<AdminBoarding> {
    const publicId = this.requirePublicId(
      boardingPublicId,
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
   * POST /journey-boardings/:boardingPublicId/participants/:participantPublicId/board
   *
   * Returns a canonical REST response.
   */
  public async boardPassenger(
    boardingPublicId: string,
    participantPublicId: string,
    request: BoardAdminPassengerRequest = {},
  ): Promise<AdminBoarding> {
    const boardingId = this.requirePublicId(
      boardingPublicId,
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
   * POST /journey-boardings/:boardingPublicId/participants/:participantPublicId/no-show
   *
   * Returns a canonical REST response.
   */
  public async markPassengerNoShow(
    boardingPublicId: string,
    participantPublicId: string,
    request: MarkAdminPassengerNoShowRequest = {},
  ): Promise<AdminBoarding> {
    const boardingId = this.requirePublicId(
      boardingPublicId,
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
   * POST /journey-boardings/:boardingPublicId/participants/:participantPublicId/withdraw
   *
   * Returns a canonical REST response.
   */
  public async withdrawParticipant(
    boardingPublicId: string,
    participantPublicId: string,
    request: WithdrawAdminBoardingParticipantRequest = {},
  ): Promise<AdminBoarding> {
    const boardingId = this.requirePublicId(
      boardingPublicId,
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
   * POST /journey-boardings/:boardingPublicId/participants/:participantPublicId/remove
   *
   * Returns a canonical REST response.
   */
  public async removeParticipant(
    boardingPublicId: string,
    participantPublicId: string,
    request: RemoveAdminBoardingParticipantRequest = {},
  ): Promise<AdminBoarding> {
    const boardingId = this.requirePublicId(
      boardingPublicId,
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
