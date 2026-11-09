
import type { AdminWithdrawalStatus } from '../models/admin-withdrawal.enums';

// -----------------------------------------------------------------------------
// Base endpoint
// -----------------------------------------------------------------------------

const BASE = '/financial-account-withdrawals';

// -----------------------------------------------------------------------------
// Endpoints
// -----------------------------------------------------------------------------

export const ADMIN_WITHDRAWALS_ENDPOINTS = {
  collection: BASE,

  byId: (withdrawalPublicId: string): string =>
    `${BASE}/${encodeURIComponent(withdrawalPublicId)}`,

  byAccount: (accountPublicId: string): string =>
    `${BASE}/accounts/${encodeURIComponent(accountPublicId)}`,

  byAccountAndStatus: (
    accountPublicId: string,
    status: AdminWithdrawalStatus,
  ): string =>
    `${BASE}/accounts/${encodeURIComponent(accountPublicId)}/status/${encodeURIComponent(status)}`,

  request: BASE,

  process: (withdrawalPublicId: string): string =>
    `${BASE}/${encodeURIComponent(withdrawalPublicId)}/process`,

  complete: (withdrawalPublicId: string): string =>
    `${BASE}/${encodeURIComponent(withdrawalPublicId)}/complete`,

  fail: (withdrawalPublicId: string): string =>
    `${BASE}/${encodeURIComponent(withdrawalPublicId)}/fail`,

  cancel: (withdrawalPublicId: string): string =>
    `${BASE}/${encodeURIComponent(withdrawalPublicId)}/cancel`,
} as const;
