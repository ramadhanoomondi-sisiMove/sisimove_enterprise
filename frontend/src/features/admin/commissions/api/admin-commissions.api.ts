// /src/features/admin/commissions/api/admin-commissions.api.ts
// -----------------------------------------------------------------------------
// sisiMove Admin — Commissions API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Execute authenticated commission API requests.
// - Expose typed methods for commission queries and commands.
// - Delegate response normalization to commission mappers.
//
// Non-responsibilities:
// - Authentication session management.
// - HTTP implementation.
// - Endpoint construction.
// - Business rule enforcement.
// - UI state management.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import {
  AdminBookingCommissionMapper,
  AdminCommissionRuleMapper,
  AdminEarningCommissionMapper,
} from '../mappers';

import type {
  AdminBookingCommissionModel,
  AdminCommissionRuleModel,
  AdminEarningCommissionModel,
} from '../models';

import { ADMIN_COMMISSIONS_ENDPOINTS } from './admin-commissions.endpoints';

// -----------------------------------------------------------------------------
// Request Types
// -----------------------------------------------------------------------------

interface RequestMetadata {
  readonly correlationId?: string;
  readonly causationId?: string;
}

// -----------------------------------------------------------------------------
// Booking Commission Requests
// -----------------------------------------------------------------------------

export interface CreateAdminBookingCommissionRequest
  extends RequestMetadata {
  readonly commissionRulePublicId: string;
  readonly bookingPublicId: string;
  readonly journeyPublicId: string;
  readonly percentage: string;
  readonly baseAmount: number;
  readonly commissionAmount: number;
  readonly currency: string;
}

export interface AssessAdminBookingCommissionRequest
  extends RequestMetadata {
  readonly assessedAt: string;
}

export interface CancelAdminBookingCommissionRequest
  extends RequestMetadata {
  readonly cancelledAt: string;
}

// -----------------------------------------------------------------------------
// Earning Commission Requests
// -----------------------------------------------------------------------------

export interface CreateAdminEarningCommissionRequest
  extends RequestMetadata {
  readonly commissionRulePublicId: string;
  readonly journeyPublicId: string;
  readonly settlementPublicId: string;
  readonly providerPublicId: string;
  readonly percentage: string;
  readonly baseAmount: number;
  readonly commissionAmount: number;
  readonly netAmount: number;
  readonly currency: string;
}

export interface AssessAdminEarningCommissionRequest
  extends RequestMetadata {
  readonly assessedAt: string;
}

export interface CancelAdminEarningCommissionRequest
  extends RequestMetadata {
  readonly cancelledAt: string;
}

// -----------------------------------------------------------------------------
// Commission Rule Requests
// -----------------------------------------------------------------------------

export interface CreateAdminCommissionRuleRequest
  extends RequestMetadata {
  readonly type: AdminCommissionRuleModel['type'];
  readonly percentage: string;
  readonly effectiveFrom: string;
  readonly effectiveTo?: string;
  readonly version: number;
}

export interface UpdateAdminCommissionRuleRequest
  extends CreateAdminCommissionRuleRequest {
  readonly updatedAt: string;
}

export interface ActivateAdminCommissionRuleRequest
  extends RequestMetadata {
  readonly activatedAt: string;
}

export interface DeactivateAdminCommissionRuleRequest
  extends RequestMetadata {
  readonly deactivatedAt: string;
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

/**
 * Authenticated API adapter for the Admin Commissions feature.
 */
export class AdminCommissionsApi {
  // ===========================================================================
  // Booking Commissions — Queries
  // ===========================================================================

  /**
   * List booking commissions.
   */
  public async listBookingCommissions(): Promise<
    AdminBookingCommissionModel[]
  > {
    const response = await authenticatedApiClient.get<
      AdminBookingCommissionModel[]
    >(ADMIN_COMMISSIONS_ENDPOINTS.bookingCommissions.base);

    return AdminBookingCommissionMapper.toModels(response);
  }

  /**
   * Get a booking commission by public ID.
   */
  public async getBookingCommission(
    publicId: string,
  ): Promise<AdminBookingCommissionModel | null> {
    const response = await authenticatedApiClient.get<
      AdminBookingCommissionModel | null
    >(
      ADMIN_COMMISSIONS_ENDPOINTS.bookingCommissions.byId(publicId),
    );

    return response === null
      ? null
      : AdminBookingCommissionMapper.toModel(response);
  }

  /**
   * Get a booking commission by booking public ID.
   */
  public async getBookingCommissionByBooking(
    bookingPublicId: string,
  ): Promise<AdminBookingCommissionModel | null> {
    const endpoint =
      ADMIN_COMMISSIONS_ENDPOINTS.bookingCommissions.byBooking;

    const response = await authenticatedApiClient.get<
      AdminBookingCommissionModel | null
    >(
      `${endpoint}?bookingPublicId=${encodeURIComponent(bookingPublicId)}`,
    );

    return response === null
      ? null
      : AdminBookingCommissionMapper.toModel(response);
  }

  /**
   * Get booking commissions belonging to a journey.
   */
  public async getBookingCommissionsByJourney(
    journeyPublicId: string,
  ): Promise<AdminBookingCommissionModel[]> {
    const endpoint =
      ADMIN_COMMISSIONS_ENDPOINTS.bookingCommissions.byJourney;

    const response = await authenticatedApiClient.get<
      AdminBookingCommissionModel[]
    >(
      `${endpoint}?journeyPublicId=${encodeURIComponent(journeyPublicId)}`,
    );

    return AdminBookingCommissionMapper.toModels(response);
  }

  // ===========================================================================
  // Booking Commissions — Commands
  // ===========================================================================

  /**
   * Create a booking commission.
   */
  public async createBookingCommission(
    request: CreateAdminBookingCommissionRequest,
  ): Promise<AdminBookingCommissionModel> {
    const response = await authenticatedApiClient.post<
      AdminBookingCommissionModel
    >(
      ADMIN_COMMISSIONS_ENDPOINTS.bookingCommissions.base,
      request,
    );

    return AdminBookingCommissionMapper.toModel(response);
  }

  /**
   * Assess a booking commission.
   */
  public async assessBookingCommission(
    publicId: string,
    request: AssessAdminBookingCommissionRequest,
  ): Promise<AdminBookingCommissionModel> {
    const response = await authenticatedApiClient.post<
      AdminBookingCommissionModel
    >(
      ADMIN_COMMISSIONS_ENDPOINTS.bookingCommissions.assess(publicId),
      request,
    );

    return AdminBookingCommissionMapper.toModel(response);
  }

  /**
   * Cancel a booking commission.
   */
  public async cancelBookingCommission(
    publicId: string,
    request: CancelAdminBookingCommissionRequest,
  ): Promise<AdminBookingCommissionModel> {
    const response = await authenticatedApiClient.post<
      AdminBookingCommissionModel
    >(
      ADMIN_COMMISSIONS_ENDPOINTS.bookingCommissions.cancel(publicId),
      request,
    );

    return AdminBookingCommissionMapper.toModel(response);
  }

  // ===========================================================================
  // Earning Commissions — Queries
  // ===========================================================================

  /**
   * List earning commissions.
   */
  public async listEarningCommissions(): Promise<
    AdminEarningCommissionModel[]
  > {
    const response = await authenticatedApiClient.get<
      AdminEarningCommissionModel[]
    >(ADMIN_COMMISSIONS_ENDPOINTS.earningCommissions.base);

    return AdminEarningCommissionMapper.toModels(response);
  }

  /**
   * Get an earning commission by public ID.
   */
  public async getEarningCommission(
    publicId: string,
  ): Promise<AdminEarningCommissionModel | null> {
    const response = await authenticatedApiClient.get<
      AdminEarningCommissionModel | null
    >(
      ADMIN_COMMISSIONS_ENDPOINTS.earningCommissions.byId(publicId),
    );

    return response === null
      ? null
      : AdminEarningCommissionMapper.toModel(response);
  }

  /**
   * Get an earning commission by settlement public ID.
   */
  public async getEarningCommissionBySettlement(
    settlementPublicId: string,
  ): Promise<AdminEarningCommissionModel | null> {
    const endpoint =
      ADMIN_COMMISSIONS_ENDPOINTS.earningCommissions.bySettlement;

    const response = await authenticatedApiClient.get<
      AdminEarningCommissionModel | null
    >(
      `${endpoint}?settlementPublicId=${encodeURIComponent(settlementPublicId)}`,
    );

    return response === null
      ? null
      : AdminEarningCommissionMapper.toModel(response);
  }

  /**
   * Get earning commissions belonging to a journey.
   */
  public async getEarningCommissionsByJourney(
    journeyPublicId: string,
  ): Promise<AdminEarningCommissionModel[]> {
    const endpoint =
      ADMIN_COMMISSIONS_ENDPOINTS.earningCommissions.byJourney;

    const response = await authenticatedApiClient.get<
      AdminEarningCommissionModel[]
    >(
      `${endpoint}?journeyPublicId=${encodeURIComponent(journeyPublicId)}`,
    );

    return AdminEarningCommissionMapper.toModels(response);
  }

  /**
   * Get earning commissions belonging to a provider.
   */
  public async getEarningCommissionsByProvider(
    providerPublicId: string,
  ): Promise<AdminEarningCommissionModel[]> {
    const endpoint =
      ADMIN_COMMISSIONS_ENDPOINTS.earningCommissions.byProvider;

    const response = await authenticatedApiClient.get<
      AdminEarningCommissionModel[]
    >(
      `${endpoint}?providerPublicId=${encodeURIComponent(providerPublicId)}`,
    );

    return AdminEarningCommissionMapper.toModels(response);
  }

  // ===========================================================================
  // Earning Commissions — Commands
  // ===========================================================================

  /**
   * Create an earning commission.
   */
  public async createEarningCommission(
    request: CreateAdminEarningCommissionRequest,
  ): Promise<AdminEarningCommissionModel> {
    const response = await authenticatedApiClient.post<
      AdminEarningCommissionModel
    >(
      ADMIN_COMMISSIONS_ENDPOINTS.earningCommissions.base,
      request,
    );

    return AdminEarningCommissionMapper.toModel(response);
  }

  /**
   * Assess an earning commission.
   */
  public async assessEarningCommission(
    publicId: string,
    request: AssessAdminEarningCommissionRequest,
  ): Promise<AdminEarningCommissionModel> {
    const response = await authenticatedApiClient.post<
      AdminEarningCommissionModel
    >(
      ADMIN_COMMISSIONS_ENDPOINTS.earningCommissions.assess(publicId),
      request,
    );

    return AdminEarningCommissionMapper.toModel(response);
  }

  /**
   * Cancel an earning commission.
   */
  public async cancelEarningCommission(
    publicId: string,
    request: CancelAdminEarningCommissionRequest,
  ): Promise<AdminEarningCommissionModel> {
    const response = await authenticatedApiClient.post<
      AdminEarningCommissionModel
    >(
      ADMIN_COMMISSIONS_ENDPOINTS.earningCommissions.cancel(publicId),
      request,
    );

    return AdminEarningCommissionMapper.toModel(response);
  }

  // ===========================================================================
  // Commission Rules — Queries
  // ===========================================================================

  /**
   * List commission rules.
   */
  public async listCommissionRules(): Promise<AdminCommissionRuleModel[]> {
    const response = await authenticatedApiClient.get<
      AdminCommissionRuleModel[]
    >(ADMIN_COMMISSIONS_ENDPOINTS.commissionRules.base);

    return AdminCommissionRuleMapper.toModels(response);
  }

  /**
   * Get a commission rule by public ID.
   */
  public async getCommissionRule(
    publicId: string,
  ): Promise<AdminCommissionRuleModel | null> {
    const response = await authenticatedApiClient.get<
      AdminCommissionRuleModel | null
    >(
      ADMIN_COMMISSIONS_ENDPOINTS.commissionRules.byId(publicId),
    );

    return response === null
      ? null
      : AdminCommissionRuleMapper.toModel(response);
  }

  /**
   * Get the active commission rule for a commission type.
   */
  public async getActiveCommissionRule(
    type: AdminCommissionRuleModel['type'],
  ): Promise<AdminCommissionRuleModel | null> {
    const endpoint = ADMIN_COMMISSIONS_ENDPOINTS.commissionRules.active;

    const response = await authenticatedApiClient.get<
      AdminCommissionRuleModel | null
    >(
      `${endpoint}?type=${encodeURIComponent(type)}`,
    );

    return response === null
      ? null
      : AdminCommissionRuleMapper.toModel(response);
  }

  /**
   * Get a commission rule by commission type.
   */
  public async getCommissionRuleByType(
    type: AdminCommissionRuleModel['type'],
  ): Promise<AdminCommissionRuleModel | null> {
    const endpoint = ADMIN_COMMISSIONS_ENDPOINTS.commissionRules.byType;

    const response = await authenticatedApiClient.get<
      AdminCommissionRuleModel | null
    >(
      `${endpoint}?type=${encodeURIComponent(type)}`,
    );

    return response === null
      ? null
      : AdminCommissionRuleMapper.toModel(response);
  }

  // ===========================================================================
  // Commission Rules — Commands
  // ===========================================================================

  /**
   * Create a commission rule.
   */
  public async createCommissionRule(
    request: CreateAdminCommissionRuleRequest,
  ): Promise<AdminCommissionRuleModel> {
    const response = await authenticatedApiClient.post<
      AdminCommissionRuleModel
    >(
      ADMIN_COMMISSIONS_ENDPOINTS.commissionRules.base,
      request,
    );

    return AdminCommissionRuleMapper.toModel(response);
  }

  /**
   * Update a commission rule.
   */
  public async updateCommissionRule(
    publicId: string,
    request: UpdateAdminCommissionRuleRequest,
  ): Promise<AdminCommissionRuleModel> {
    const response = await authenticatedApiClient.post<
      AdminCommissionRuleModel
    >(
      ADMIN_COMMISSIONS_ENDPOINTS.commissionRules.update(publicId),
      request,
    );

    return AdminCommissionRuleMapper.toModel(response);
  }

  /**
   * Activate a commission rule.
   */
  public async activateCommissionRule(
    publicId: string,
    request: ActivateAdminCommissionRuleRequest,
  ): Promise<AdminCommissionRuleModel> {
    const response = await authenticatedApiClient.post<
      AdminCommissionRuleModel
    >(
      ADMIN_COMMISSIONS_ENDPOINTS.commissionRules.activate(publicId),
      request,
    );

    return AdminCommissionRuleMapper.toModel(response);
  }

  /**
   * Deactivate a commission rule.
   */
  public async deactivateCommissionRule(
    publicId: string,
    request: DeactivateAdminCommissionRuleRequest,
  ): Promise<AdminCommissionRuleModel> {
    const response = await authenticatedApiClient.post<
      AdminCommissionRuleModel
    >(
      ADMIN_COMMISSIONS_ENDPOINTS.commissionRules.deactivate(publicId),
      request,
    );

    return AdminCommissionRuleMapper.toModel(response);
  }
}

// -----------------------------------------------------------------------------
// Shared Instance
// -----------------------------------------------------------------------------

export const adminCommissionsApi = new AdminCommissionsApi();