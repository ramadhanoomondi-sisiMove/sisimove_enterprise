
// -----------------------------------------------------------------------------
// sisiMove — My Financial Account Balance API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Retrieve the balance for the supplied Financial Account public ID.
// - Map the backend response into the frontend balance model.
//
// Non-responsibilities:
// - Resolving the authenticated member's Financial Account.
// - Ownership resolution.
// - Financial calculations.
// - Monetary conversion or formatting.
//
// The caller resolves the authenticated Financial Account and supplies its
// public ID. The backend remains responsible for authorization.
//
// Monetary convention:
// - Amounts are returned in integer minor units.
// - KES 100 represents KES 1.00.
// - No monetary conversion occurs in this API module.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

import type { FinancialAccountBalance } from '../models';

import {
  mapFinancialAccountBalance,
  type FinancialAccountBalanceApiResponse,
} from '../mappers';

// =============================================================================
// Constants
// =============================================================================

const FINANCIAL_ACCOUNTS_PATH = '/financial-accounts';

// =============================================================================
// Get Financial Account Balance
// =============================================================================

/**
 * Retrieve the balance for a Financial Account.
 *
 * Endpoint:
 *
 *     GET /financial-accounts/:accountPublicId/balance
 *
 * The account public ID is supplied by the caller after resolving the
 * authenticated member's Financial Account.
 *
 * Authentication is required.
 *
 * Monetary amounts remain integer minor units.
 * No monetary conversion or formatting occurs here.
 */
export async function getMyFinancialBalance(
  accountPublicId: string,
): Promise<FinancialAccountBalance> {
  const response =
    await authenticatedApiClient.get<FinancialAccountBalanceApiResponse>(
      `${FINANCIAL_ACCOUNTS_PATH}/${encodeURIComponent(
        accountPublicId,
      )}/balance`,
    );

  return mapFinancialAccountBalance(response);
}
