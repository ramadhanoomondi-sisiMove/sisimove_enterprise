// =============================================================================
// sisiMove — Use My Financial Balance
// =============================================================================
//
// React Query hook for the Financial Account Balance belonging to the
// currently authenticated Identity.
//
// Backend boundary:
//
//     GET /financial-accounts/:accountPublicId/balance
//
// Account resolution:
//
//     GET /financial-accounts/me
//             ↓
//     MyFinancialAccount.publicId
//             ↓
//     GET /financial-accounts/:accountPublicId/balance
//
// The API function owns this resolution sequence. The hook therefore exposes
// a simple authenticated "my balance" interface to the UI.
//
// =============================================================================

import { useQuery } from '@tanstack/react-query';

import { getMyFinancialBalance } from '../api';
import type { FinancialAccountBalance } from '../models';
import {
  mapFinancialAccountBalance,
  type FinancialAccountBalanceApiResponse,
} from '../mappers';

// =============================================================================
// Query Key
// =============================================================================

/**
 * Stable query key for the authenticated member's Financial Account Balance.
 */
export const MY_FINANCIAL_BALANCE_QUERY_KEY = [
  'financial-account',
  'me',
  'balance',
] as const;

// =============================================================================
// Query
// =============================================================================

/**
 * Retrieve the authenticated member's Financial Account Balance.
 *
 * Monetary values remain integer minor units.
 *
 * Formatting belongs to presentation components, not this hook.
 */
export function useMyFinancialBalance() {
  return useQuery({
    queryKey: MY_FINANCIAL_BALANCE_QUERY_KEY,

    queryFn: async (): Promise<FinancialAccountBalance> => {
      const response = await getMyFinancialBalance();

      return mapFinancialAccountBalance(
        response as FinancialAccountBalanceApiResponse,
      );
    },
  });
}

