// =============================================================================
// sisiMove — Get Financial Withdrawal API
// =============================================================================
//
// Transport function for retrieving one FinancialAccountWithdrawal.
//
// Backend endpoint:
//
//     GET /financial-account-withdrawals/:withdrawalPublicId
//
// Important boundaries:
//
// - Only the public withdrawal identifier is sent to the backend.
// - The backend remains responsible for authorization and determining whether
//   the authenticated member may access the withdrawal.
// - No database IDs are exposed to the frontend.
// - The response is mapped at the API boundary before being returned to
//   feature consumers.
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
 * Retrieves a single financial withdrawal by its public identifier.
 *
 * @param withdrawalPublicId Public identifier of the withdrawal.
 */
export async function getWithdrawal(
  withdrawalPublicId: string,
): Promise<FinancialWithdrawal> {
  const response =
    await authenticatedApiClient.get<FinancialWithdrawalApiResponse>(
      `${FINANCIAL_WITHDRAWALS_PATH}/${encodeURIComponent(
        withdrawalPublicId,
      )}`,
    );

  return mapFinancialWithdrawal(response);
}

