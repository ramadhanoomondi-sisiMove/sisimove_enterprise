// =============================================================================
// sisiMove — Get My Financial Withdrawals By Status API
// =============================================================================
//
// Transport function for retrieving withdrawals belonging to the member's
// financial account filtered by withdrawal lifecycle status.
//
// Backend endpoint:
//
//     GET /financial-account-withdrawals/
//         accounts/:accountPublicId/status/:status
//
// Important boundaries:
//
// - The backend controller exposes an account-scoped status collection route.
// - We do NOT invent a `/me` endpoint.
// - `accountPublicId` should represent the authenticated member's own
//   financial account.
// - The frontend validates the account identifier and status before transport.
// - The backend remains authoritative for authorization, account ownership,
//   and the actual withdrawal data.
// - Database IDs are never exposed to the frontend.
// - Every response item is mapped through the withdrawal mapper.
// - Request cancellation is not passed because the current
//   authenticatedApiClient RequestOptions does not support AbortSignal.
//
// =============================================================================

import { authenticatedApiClient } from '@/features/authentication';

import type {
  FinancialWithdrawal,
  FinancialWithdrawalStatus,
} from '../models';

import {
  mapFinancialWithdrawal,
  type FinancialWithdrawalApiResponse,
} from '../mappers';

const FINANCIAL_WITHDRAWALS_PATH = '/financial-account-withdrawals';

/**
 * Validates a financial account public identifier before transport.
 */
function assertAccountPublicId(accountPublicId: string): void {
  if (typeof accountPublicId !== 'string') {
    throw new TypeError('Financial account public ID must be a string.');
  }

  if (accountPublicId.trim().length === 0) {
    throw new Error('Financial account public ID is required.');
  }
}

/**
 * Validates a withdrawal status before constructing the request URL.
 */
function assertWithdrawalStatus(
  status: FinancialWithdrawalStatus,
): void {
  const validStatuses: readonly FinancialWithdrawalStatus[] = [
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED',
    'CANCELLED',
  ];

  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid financial withdrawal status: ${status}.`);
  }
}

/**
 * Retrieves the member's withdrawals filtered by lifecycle status.
 *
 * @param accountPublicId Public identifier of the member's financial account.
 * @param status Withdrawal lifecycle status.
 */
export async function getMyWithdrawalsByStatus(
  accountPublicId: string,
  status: FinancialWithdrawalStatus,
): Promise<FinancialWithdrawal[]> {
  assertAccountPublicId(accountPublicId);
  assertWithdrawalStatus(status);

  const response =
    await authenticatedApiClient.get<FinancialWithdrawalApiResponse[]>(
      `${FINANCIAL_WITHDRAWALS_PATH}/accounts/${encodeURIComponent(
        accountPublicId.trim(),
      )}/status/${encodeURIComponent(status)}`,
    );

  return response.map(mapFinancialWithdrawal);
}
