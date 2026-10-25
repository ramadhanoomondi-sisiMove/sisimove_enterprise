// /src/features/admin/finance/account-holds/api/admin-account-holds.api.ts
// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Account Holds API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Call authenticated financial-account-hold endpoints.
// - Keep HTTP concerns separate from feature hooks and UI.
// - Map backend responses into admin account-hold models.
//
// Backend currently confirms:
// - GET  /financial-account-holds/accounts/:accountPublicId
// - POST /financial-account-holds
// - POST /financial-account-holds/:holdPublicId/capture
// - POST /financial-account-holds/:holdPublicId/release
// - POST /financial-account-holds/:holdPublicId/cancel
//
// A global list endpoint and single-hold GET endpoint are not yet confirmed.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

import {
  mapAdminAccountHold,
  mapAdminAccountHolds,
  type AdminAccountHoldApiResponse,
} from '../mappers';

import type { AdminAccountHold } from '../models/admin-account-hold.model';

import type {
  CreateAdminAccountHoldRequest,
  CaptureAdminAccountHoldRequest,
  ReleaseAdminAccountHoldRequest,
  CancelAdminAccountHoldRequest,
} from '../models/admin-account-hold-operations.model';

const BASE_PATH = '/financial-account-holds';

// -----------------------------------------------------------------------------
// Shared lifecycle operation
// -----------------------------------------------------------------------------

async function performAdminAccountHoldOperation(
  holdPublicId: string,
  operation: 'capture' | 'release' | 'cancel',
  request:
    | CaptureAdminAccountHoldRequest
    | ReleaseAdminAccountHoldRequest
    | CancelAdminAccountHoldRequest,
): Promise<AdminAccountHold> {
  const normalizedHoldPublicId = holdPublicId.trim();

  if (!normalizedHoldPublicId) {
    throw new Error(
      'A hold public ID is required to perform this operation.',
    );
  }

  const response =
    await authenticatedApiClient.post<AdminAccountHoldApiResponse>(
      `${BASE_PATH}/${encodeURIComponent(normalizedHoldPublicId)}/${operation}`,
      request,
    );

  return mapAdminAccountHold(response);
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export const adminAccountHoldsApi = {
    /**
   * Retrieve all financial account holds across all accounts.
   *
   * Includes all lifecycle statuses returned by the backend.
   *
   * GET /financial-account-holds
   */
  async getAll(): Promise<AdminAccountHold[]> {
    const response =
      await authenticatedApiClient.get<AdminAccountHoldApiResponse[]>(
        BASE_PATH,
      );

    return mapAdminAccountHolds(response);
  },
  /**
   * Retrieve holds belonging to one financial account.
   *
   * GET /financial-account-holds/accounts/:accountPublicId
   */
  async getByAccountPublicId(
    accountPublicId: string,
  ): Promise<AdminAccountHold[]> {
    const normalizedAccountPublicId = accountPublicId.trim();

    if (!normalizedAccountPublicId) {
      throw new Error(
        'An account public ID is required to retrieve account holds.',
      );
    }

    const response =
      await authenticatedApiClient.get<AdminAccountHoldApiResponse[]>(
        `${BASE_PATH}/accounts/${encodeURIComponent(normalizedAccountPublicId)}`,
      );

    return mapAdminAccountHolds(response);
  },

  /**
   * Create a hold.
   *
   * POST /financial-account-holds
   */
  async create(
    request: CreateAdminAccountHoldRequest,
  ): Promise<AdminAccountHold> {
    const response =
      await authenticatedApiClient.post<AdminAccountHoldApiResponse>(
        BASE_PATH,
        request,
      );

    return mapAdminAccountHold(response);
  },

  /**
   * Capture a hold using an existing capture transaction reference.
   */
  async capture(
    holdPublicId: string,
    request: CaptureAdminAccountHoldRequest,
  ): Promise<AdminAccountHold> {
    return performAdminAccountHoldOperation(
      holdPublicId,
      'capture',
      request,
    );
  },

  /**
   * Release a hold using an existing release transaction reference.
   */
  async release(
    holdPublicId: string,
    request: ReleaseAdminAccountHoldRequest,
  ): Promise<AdminAccountHold> {
    return performAdminAccountHoldOperation(
      holdPublicId,
      'release',
      request,
    );
  },

  /**
   * Cancel a hold using the release transaction reference required by
   * the backend.
   */
  async cancel(
    holdPublicId: string,
    request: CancelAdminAccountHoldRequest,
  ): Promise<AdminAccountHold> {
    return performAdminAccountHoldOperation(
      holdPublicId,
      'cancel',
      request,
    );
  },
};
