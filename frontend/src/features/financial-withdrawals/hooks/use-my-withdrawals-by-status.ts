// =============================================================================
// sisiMove — My Withdrawals By Status Query Hook
// =============================================================================
//
// React Query hook for retrieving the authenticated member's financial
// withdrawals filtered by lifecycle status.
//
// Backend endpoint:
//
//     GET /financial-account-withdrawals/
//         accounts/:accountPublicId/status/:status
//
// Important boundaries:
//
// - The account public ID should come from the authenticated member's own
//   financial account.
// - The backend remains authoritative for authorization and account ownership.
// - The status is a public lifecycle contract, not a backend workflow command.
// - Stable query keys are used so status-specific collections can be
//   invalidated predictably after mutations.
//
// =============================================================================

import { useQuery } from '@tanstack/react-query';

import {
  getMyWithdrawalsByStatus,
} from '../api';

import type {
  FinancialWithdrawal,
  FinancialWithdrawalStatus,
} from '../models';

import {
  financialWithdrawalQueryKeys,
} from './use-financial-withdrawal';

const WITHDRAWAL_STATUSES: readonly FinancialWithdrawalStatus[] = [
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
];

/**
 * Determines whether a value is a supported withdrawal status.
 */
function isFinancialWithdrawalStatus(
  value: string,
): value is FinancialWithdrawalStatus {
  return WITHDRAWAL_STATUSES.includes(
    value as FinancialWithdrawalStatus,
  );
}

/**
 * Retrieves the authenticated member's withdrawals filtered by status.
 */
export function useMyWithdrawalsByStatus(
  accountPublicId: string | undefined,
  status: FinancialWithdrawalStatus | undefined,
) {
  const normalizedAccountPublicId =
    accountPublicId?.trim() ?? '';

  const normalizedStatus =
    status?.trim() ?? '';

  const isValidAccountPublicId =
    normalizedAccountPublicId.length > 0;

  const isValidStatus =
    isFinancialWithdrawalStatus(normalizedStatus);

  const isEnabled =
    isValidAccountPublicId && isValidStatus;

  return useQuery<FinancialWithdrawal[], Error>({
    queryKey: isEnabled
      ? [
          ...financialWithdrawalQueryKeys.all,
          'account',
          normalizedAccountPublicId,
          'status',
          normalizedStatus,
        ]
      : financialWithdrawalQueryKeys.all,

    queryFn: () => {
      if (!isValidAccountPublicId) {
        throw new Error(
          'Financial account public ID is required.',
        );
      }

      if (!isValidStatus) {
        throw new Error(
          'A valid financial withdrawal status is required.',
        );
      }

      return getMyWithdrawalsByStatus(
        normalizedAccountPublicId,
        normalizedStatus,
      );
    },

    enabled: isEnabled,
  });
}

