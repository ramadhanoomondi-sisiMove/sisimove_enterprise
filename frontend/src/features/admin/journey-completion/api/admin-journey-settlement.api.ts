
import {
  authenticatedApiClient,
} from '@/features/authentication/http/authenticated-api-client';

import type { RequestOptions } from '@/foundation/http';

import type { AdminJourneySettlement } from '../models/admin-journey-settlement.model';

import type {
  AdminJourneySettlementStatus,
} from '../models/admin-journey-settlement.enums';

import {
  ADMIN_JOURNEY_SETTLEMENT_ENDPOINTS,
  type AdminJourneySettlementListParams,
} from './admin-journey-settlement.endpoints';

// -----------------------------------------------------------------------------
// Admin Journey Settlement API
// -----------------------------------------------------------------------------

/**
 * HTTP adapter for Journey Settlement administration.
 *
 * Responsibilities:
 * - Retrieve Journey Settlement records.
 * - Retrieve settlement counts by status.
 * - Execute supported Journey Settlement lifecycle commands.
 * - Use the shared authenticated API client.
 *
 * Non-responsibilities:
 * - Authentication session management.
 * - Direct HTTP implementation.
 * - Financial ledger operations.
 * - Financial transaction execution.
 * - Settlement business rules.
 * - Local persistence.
 *
 * This adapter manages Journey-domain settlements associated with
 * Journey Completion. It is not a Financial Settlement API.
 */
export class AdminJourneySettlementApi {
  // ===========================================================================
  // Settlement Queries
  // ===========================================================================

  /**
   * Retrieve settlements using optional backend filters.
   */
  public async list(
    params?: AdminJourneySettlementListParams,
    options: RequestOptions = {},
  ): Promise<AdminJourneySettlement[]> {
    return authenticatedApiClient.get<AdminJourneySettlement[]>(
      ADMIN_JOURNEY_SETTLEMENT_ENDPOINTS.list(params),
      options,
    );
  }

  /**
   * Retrieve the number of settlements in a given status.
   */
  public async countByStatus(
    status: AdminJourneySettlementStatus,
    options: RequestOptions = {},
  ): Promise<number> {
    return authenticatedApiClient.get<number>(
      ADMIN_JOURNEY_SETTLEMENT_ENDPOINTS.countByStatus(status),
      options,
    );
  }

  /**
   * Retrieve the settlement associated with a completion.
   *
   * The backend may return null when no settlement exists.
   */
  public async getByCompletion(
    completionPublicId: string,
    options: RequestOptions = {},
  ): Promise<AdminJourneySettlement | null> {
    return authenticatedApiClient.get<AdminJourneySettlement | null>(
      ADMIN_JOURNEY_SETTLEMENT_ENDPOINTS.byCompletion(completionPublicId),
      options,
    );
  }

  /**
   * Retrieve one settlement by its public ID.
   *
   * The backend may return null when it does not exist.
   */
  public async get(
    settlementPublicId: string,
    options: RequestOptions = {},
  ): Promise<AdminJourneySettlement | null> {
    return authenticatedApiClient.get<AdminJourneySettlement | null>(
      ADMIN_JOURNEY_SETTLEMENT_ENDPOINTS.detail(settlementPublicId),
      options,
    );
  }

  // ===========================================================================
  // Settlement Commands
  // ===========================================================================

  /**
   * Create a Journey Settlement record.
   */
  public async create<TResponse = unknown>(
    input: unknown,
    options: RequestOptions = {},
  ): Promise<TResponse> {
    return authenticatedApiClient.post<TResponse>(
      ADMIN_JOURNEY_SETTLEMENT_ENDPOINTS.create(),
      input,
      options,
    );
  }

  /**
   * Submit a settlement for processing.
   */
  public async submit<TResponse = unknown>(
    settlementPublicId: string,
    input?: unknown,
    options: RequestOptions = {},
  ): Promise<TResponse> {
    return authenticatedApiClient.post<TResponse>(
      ADMIN_JOURNEY_SETTLEMENT_ENDPOINTS.submit(settlementPublicId),
      input,
      options,
    );
  }

  /**
   * Start processing a submitted settlement.
   */
  public async process<TResponse = unknown>(
    settlementPublicId: string,
    input?: unknown,
    options: RequestOptions = {},
  ): Promise<TResponse> {
    return authenticatedApiClient.post<TResponse>(
      ADMIN_JOURNEY_SETTLEMENT_ENDPOINTS.process(settlementPublicId),
      input,
      options,
    );
  }

  /**
   * Mark a settlement as completed.
   */
  public async complete<TResponse = unknown>(
    settlementPublicId: string,
    input?: unknown,
    options: RequestOptions = {},
  ): Promise<TResponse> {
    return authenticatedApiClient.post<TResponse>(
      ADMIN_JOURNEY_SETTLEMENT_ENDPOINTS.complete(settlementPublicId),
      input,
      options,
    );
  }

  /**
   * Mark a settlement as failed.
   */
  public async fail<TResponse = unknown>(
    settlementPublicId: string,
    input: unknown,
    options: RequestOptions = {},
  ): Promise<TResponse> {
    return authenticatedApiClient.post<TResponse>(
      ADMIN_JOURNEY_SETTLEMENT_ENDPOINTS.fail(settlementPublicId),
      input,
      options,
    );
  }

  /**
   * Place a settlement on hold.
   */
  public async hold<TResponse = unknown>(
    settlementPublicId: string,
    input?: unknown,
    options: RequestOptions = {},
  ): Promise<TResponse> {
    return authenticatedApiClient.post<TResponse>(
      ADMIN_JOURNEY_SETTLEMENT_ENDPOINTS.hold(settlementPublicId),
      input,
      options,
    );
  }

  /**
   * Cancel a settlement.
   */
  public async cancel<TResponse = unknown>(
    settlementPublicId: string,
    input?: unknown,
    options: RequestOptions = {},
  ): Promise<TResponse> {
    return authenticatedApiClient.post<TResponse>(
      ADMIN_JOURNEY_SETTLEMENT_ENDPOINTS.cancel(settlementPublicId),
      input,
      options,
    );
  }
}

// -----------------------------------------------------------------------------
// Shared Instance
// -----------------------------------------------------------------------------

export const adminJourneySettlementApi = new AdminJourneySettlementApi();

export default adminJourneySettlementApi;
