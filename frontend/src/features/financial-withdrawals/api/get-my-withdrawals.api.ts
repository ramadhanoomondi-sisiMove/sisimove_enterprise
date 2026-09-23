// =============================================================================
// sisiMove — Get My Financial Withdrawals API
// =============================================================================
//
// Transport function for retrieving withdrawals belonging to the member's
// financial account.
//
// Backend endpoint:
//
//     GET /financial-account-withdrawals/accounts/:accountPublicId
//
// Important boundaries:
//
// - The backend controller exposes an account-scoped collection endpoint.
// - We therefore do NOT invent a `/me` withdrawal endpoint.
// - `accountPublicId` should be resolved from the authenticated member's own
//   financial account rather than arbitrary user-supplied account data.
// - The frontend validates the identifier before making the request.
// - The backend remains responsible for authorization and account ownership.
// - Database IDs are never exposed to the frontend.
// - Every response item is mapped through the withdrawal mapper.
//
// NOTE:
// Request cancellation is intentionally not passed to the API client here
// because the current authenticatedApiClient RequestOptions contract does
// not support `AbortSignal`. Cancellation should be added centrally to the
// authenticated API client before feature APIs begin passing signals.
//
// =============================================================================

import { authenticatedApiClient } from '@/features/authentication';

import type { FinancialWithdrawal } from '../models';

import {
  mapFinancialWithdrawal,
  type FinancialWithdrawalApiResponse,
} from '../mappers';

const FINANCIAL_WITHDRAWALS_PATH = '/financial-account-withdrawals';

/**
 * Validates a financial account public identifier before transport.
 *
 * Public IDs are opaque application identifiers. We deliberately validate
 * only that a usable non-empty string was supplied here. The backend remains
 * authoritative for whether the identifier exists and belongs to the caller.
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
 * Retrieves withdrawals belonging to the specified member financial account.
 *
 * @param accountPublicId Public identifier of the member's financial account.
 */
export async function getMyWithdrawals(
  accountPublicId: string,
): Promise<FinancialWithdrawal[]> {
  assertAccountPublicId(accountPublicId);

  const response =
    await authenticatedApiClient.get<FinancialWithdrawalApiResponse[]>(
      `${FINANCIAL_WITHDRAWALS_PATH}/accounts/${encodeURIComponent(
        accountPublicId.trim(),
      )}`,
    );

  return response.map(mapFinancialWithdrawal);
}

