
// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Accounts API
// -----------------------------------------------------------------------------
// Feature adapter for the Financial Accounts REST controller.
// Uses the shared AuthenticatedApiClient; it does not read session storage,
// attach tokens itself, or use internal database identifiers.
//
// Endpoints:
//   GET  /financial-accounts
//   GET  /financial-accounts/me
//   GET  /financial-accounts/:accountPublicId
//   GET  /financial-accounts/:accountPublicId/balance
//   POST /financial-accounts
//   POST /financial-accounts/:accountPublicId/activate
//   POST /financial-accounts/:accountPublicId/suspend
//   POST /financial-accounts/:accountPublicId/close
//
// GET /financial-accounts requires authentication and the
// financial-account:read permission in the backend controller.
//
// Request fields follow the controller's visible DTO usage. Confirm validation
// constraints against the DTO definitions before wiring forms to these methods.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

import {
  AdminFinancialAccountMapper,
  type FinancialAccountApiPayload,
} from '../mappers';

import type {
  AdminFinancialAccount,
  AdminFinancialAccountBalanceOnly,
} from '../models';

// -----------------------------------------------------------------------------
// Request types
// -----------------------------------------------------------------------------

/** Fields consumed by CreateFinancialAccountDto in the controller. */
export interface CreateAdminFinancialAccountRequest {
  ownerPublicId: string;
  type: string;
  currency: string;
  correlationId?: string;
  causationId?: string;
}

/** Fields consumed by ActivateFinancialAccountDto in the controller. */
export interface ActivateAdminFinancialAccountRequest {
  activatedAt: string;
  correlationId?: string;
  causationId?: string;
}

/** Fields consumed by SuspendFinancialAccountDto in the controller. */
export interface SuspendAdminFinancialAccountRequest {
  suspendedAt: string;
  correlationId?: string;
  causationId?: string;
}

/** Fields consumed by CloseFinancialAccountDto in the controller. */
export interface CloseAdminFinancialAccountRequest {
  closedAt: string;
  correlationId?: string;
  causationId?: string;
}

// -----------------------------------------------------------------------------
// API adapter
// -----------------------------------------------------------------------------

const BASE_PATH = '/financial-accounts';

function accountPath(accountPublicId: string): string {
  const normalized = accountPublicId.trim();

  if (!normalized) {
    throw new Error('A financial account public ID is required.');
  }

  return `${BASE_PATH}/${encodeURIComponent(normalized)}`;
}

function mapAccountResponse(
  payload: FinancialAccountApiPayload,
): AdminFinancialAccount {
  return AdminFinancialAccountMapper.toAccount(payload);
}

export const adminFinancialAccountsApi = {
  /**
   * List all financial accounts.
   * GET /financial-accounts
   *
   * Backend permission: financial-account:read.
   */
  async getAll(): Promise<AdminFinancialAccount[]> {
    const payload =
      await authenticatedApiClient.get<FinancialAccountApiPayload>(
        BASE_PATH,
      );

    return AdminFinancialAccountMapper.toAccounts(payload);
  },

  /** Authenticated self-read: GET /financial-accounts/me. */
  async getCurrent(): Promise<AdminFinancialAccount> {
    const payload =
      await authenticatedApiClient.get<FinancialAccountApiPayload>(
        `${BASE_PATH}/me`,
      );

    return mapAccountResponse(payload);
  },

  /** Direct account read; backend requires financial-account:read. */
  async getByPublicId(
    accountPublicId: string,
  ): Promise<AdminFinancialAccount | null> {
    const payload =
      await authenticatedApiClient.get<
        FinancialAccountApiPayload | null
      >(accountPath(accountPublicId));

    return payload === null ? null : mapAccountResponse(payload);
  },

  /** Balance read; response omits accountPublicId per the response mapper. */
  async getBalance(
    accountPublicId: string,
  ): Promise<AdminFinancialAccountBalanceOnly> {
    const payload =
      await authenticatedApiClient.get<FinancialAccountApiPayload>(
        `${accountPath(accountPublicId)}/balance`,
      );

    return AdminFinancialAccountMapper.toBalance(payload);
  },

  /** Create an account; backend permission: financial-account:create. */
  async create(
    request: CreateAdminFinancialAccountRequest,
  ): Promise<AdminFinancialAccount> {
    const payload =
      await authenticatedApiClient.post<FinancialAccountApiPayload>(
        BASE_PATH,
        request,
      );

    return mapAccountResponse(payload);
  },

  /** Activate an account; backend permission: financial-account:activate. */
  async activate(
    accountPublicId: string,
    request: ActivateAdminFinancialAccountRequest,
  ): Promise<AdminFinancialAccount> {
    const payload =
      await authenticatedApiClient.post<FinancialAccountApiPayload>(
        `${accountPath(accountPublicId)}/activate`,
        request,
      );

    return mapAccountResponse(payload);
  },

  /** Suspend an account; backend permission: financial-account:suspend. */
  async suspend(
    accountPublicId: string,
    request: SuspendAdminFinancialAccountRequest,
  ): Promise<AdminFinancialAccount> {
    const payload =
      await authenticatedApiClient.post<FinancialAccountApiPayload>(
        `${accountPath(accountPublicId)}/suspend`,
        request,
      );

    return mapAccountResponse(payload);
  },

  /** Close an account; backend permission: financial-account:close. */
  async close(
    accountPublicId: string,
    request: CloseAdminFinancialAccountRequest,
  ): Promise<AdminFinancialAccount> {
    const payload =
      await authenticatedApiClient.post<FinancialAccountApiPayload>(
        `${accountPath(accountPublicId)}/close`,
        request,
      );

    return mapAccountResponse(payload);
  },
};

export type AdminFinancialAccountsApi =
  typeof adminFinancialAccountsApi;
