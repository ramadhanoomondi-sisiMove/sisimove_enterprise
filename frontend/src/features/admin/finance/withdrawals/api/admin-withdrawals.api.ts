
import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

import {
  AdminWithdrawalMapper,
  type AdminWithdrawalResponse,
} from '../mappers';

import type { AdminWithdrawal } from '../models/admin-withdrawal.model';
import type { AdminWithdrawalStatus } from '../models/admin-withdrawal.enums';

import type {
  AdminWithdrawalRequest,
  AdminWithdrawalProcessRequest,
  AdminWithdrawalCompleteRequest,
  AdminWithdrawalFailRequest,
  AdminWithdrawalCancelRequest,
} from '../models/admin-withdrawal-operations.model';

import { ADMIN_WITHDRAWALS_ENDPOINTS } from './admin-withdrawals.endpoints';

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

/**
 * Admin Financial Account Withdrawals API.
 *
 * Responsibilities:
 * - Execute authenticated withdrawal requests.
 * - Retrieve withdrawals from the backend.
 * - Submit withdrawal lifecycle commands.
 * - Map backend responses into frontend models.
 *
 * Non-responsibilities:
 * - Authentication/session management.
 * - Domain lifecycle decisions.
 * - Local filtering and pagination.
 * - UI state management.
 */
export class AdminWithdrawalsApi {
  private constructor() {}

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  /**
   * Retrieve all financial account withdrawals.
   */
  public static async getAll(): Promise<AdminWithdrawal[]> {
    const response =
      await authenticatedApiClient.get<AdminWithdrawalResponse[]>(
        ADMIN_WITHDRAWALS_ENDPOINTS.collection,
      );

    return AdminWithdrawalMapper.toModels(response);
  }

  /**
   * Retrieve one withdrawal by its public ID.
   */
  public static async getById(
    withdrawalPublicId: string,
  ): Promise<AdminWithdrawal> {
    const response =
      await authenticatedApiClient.get<AdminWithdrawalResponse>(
        ADMIN_WITHDRAWALS_ENDPOINTS.byId(withdrawalPublicId),
      );

    return AdminWithdrawalMapper.toModel(response);
  }

  /**
   * Retrieve withdrawals belonging to one financial account.
   */
  public static async getByAccount(
    accountPublicId: string,
  ): Promise<AdminWithdrawal[]> {
    const response =
      await authenticatedApiClient.get<AdminWithdrawalResponse[]>(
        ADMIN_WITHDRAWALS_ENDPOINTS.byAccount(accountPublicId),
      );

    return AdminWithdrawalMapper.toModels(response);
  }

  /**
   * Retrieve withdrawals belonging to one account and matching a status.
   */
  public static async getByAccountAndStatus(
    accountPublicId: string,
    status: AdminWithdrawalStatus,
  ): Promise<AdminWithdrawal[]> {
    const response =
      await authenticatedApiClient.get<AdminWithdrawalResponse[]>(
        ADMIN_WITHDRAWALS_ENDPOINTS.byAccountAndStatus(
          accountPublicId,
          status,
        ),
      );

    return AdminWithdrawalMapper.toModels(response);
  }

  // ---------------------------------------------------------------------------
  // Commands
  // ---------------------------------------------------------------------------

  /**
   * Request a new financial account withdrawal.
   *
   * The backend creates the withdrawal in PENDING state.
   */
  public static async request(
    payload: AdminWithdrawalRequest,
  ): Promise<AdminWithdrawal> {
    const response =
      await authenticatedApiClient.post<AdminWithdrawalResponse>(
        ADMIN_WITHDRAWALS_ENDPOINTS.request,
        payload,
      );

    return AdminWithdrawalMapper.toModel(response);
  }

  /**
   * Move a withdrawal from PENDING to PROCESSING.
   *
   * This operation does not execute a financial disbursement.
   */
  public static async process(
    withdrawalPublicId: string,
    payload: AdminWithdrawalProcessRequest,
  ): Promise<AdminWithdrawal> {
    const response =
      await authenticatedApiClient.post<AdminWithdrawalResponse>(
        ADMIN_WITHDRAWALS_ENDPOINTS.process(withdrawalPublicId),
        payload,
      );

    return AdminWithdrawalMapper.toModel(response);
  }

  /**
   * Complete a withdrawal.
   */
  public static async complete(
    withdrawalPublicId: string,
    payload: AdminWithdrawalCompleteRequest,
  ): Promise<AdminWithdrawal> {
    const response =
      await authenticatedApiClient.post<AdminWithdrawalResponse>(
        ADMIN_WITHDRAWALS_ENDPOINTS.complete(withdrawalPublicId),
        payload,
      );

    return AdminWithdrawalMapper.toModel(response);
  }

  /**
   * Mark a withdrawal as failed.
   */
  public static async fail(
    withdrawalPublicId: string,
    payload: AdminWithdrawalFailRequest,
  ): Promise<AdminWithdrawal> {
    const response =
      await authenticatedApiClient.post<AdminWithdrawalResponse>(
        ADMIN_WITHDRAWALS_ENDPOINTS.fail(withdrawalPublicId),
        payload,
      );

    return AdminWithdrawalMapper.toModel(response);
  }

  /**
   * Cancel a withdrawal.
   */
  public static async cancel(
    withdrawalPublicId: string,
    payload: AdminWithdrawalCancelRequest,
  ): Promise<AdminWithdrawal> {
    const response =
      await authenticatedApiClient.post<AdminWithdrawalResponse>(
        ADMIN_WITHDRAWALS_ENDPOINTS.cancel(withdrawalPublicId),
        payload,
      );

    return AdminWithdrawalMapper.toModel(response);
  }
}

// -----------------------------------------------------------------------------
// Default export
// -----------------------------------------------------------------------------

export default AdminWithdrawalsApi;
