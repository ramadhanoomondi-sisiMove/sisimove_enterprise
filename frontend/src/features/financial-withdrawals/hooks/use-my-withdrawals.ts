// =============================================================================
// sisiMove — My Withdrawals Query Hook
// =============================================================================
//
// React Query hook for retrieving withdrawals belonging to the authenticated
// member's financial account.
//
// Backend endpoint:
//
//     GET /financial-account-withdrawals/accounts/:accountPublicId
//
// Important boundaries:
//
// - The account public ID should come from the authenticated member's own
//   financial account.
// - The backend remains authoritative for authorization and account ownership.
// - This hook does not resolve arbitrary accounts or mutate withdrawal state.
// - Stable query keys are shared with withdrawal mutations for predictable
//   cache invalidation.
//
// =============================================================================

import { useQuery } from '@tanstack/react-query';

import {
  getMyWithdrawals,
} from '../api';

import type {
  FinancialWithdrawal,
} from '../models';

import { financialWithdrawalQueryKeys } from './use-financial-withdrawal';

/**
 * Retrieves the authenticated member's financial withdrawals.
 */
export function useMyWithdrawals(
  accountPublicId: string | undefined,
) {
  const normalizedAccountPublicId =
    accountPublicId?.trim() ?? '';

  const isValidAccountPublicId =
    normalizedAccountPublicId.length > 0;

  return useQuery<FinancialWithdrawal[], Error>({
    queryKey: isValidAccountPublicId
      ? [
          ...financialWithdrawalQueryKeys.all,
          'account',
          normalizedAccountPublicId,
        ]
      : financialWithdrawalQueryKeys.all,

    queryFn: () => {
      if (!isValidAccountPublicId) {
        throw new Error(
          'Financial account public ID is required.',
        );
      }

      return getMyWithdrawals(
        normalizedAccountPublicId,
      );
    },

    enabled: isValidAccountPublicId,
  });
}

