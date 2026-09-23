// =============================================================================
// sisiMove — Financial Withdrawal Query Hook
// =============================================================================
//
// React Query hook for retrieving one financial withdrawal.
//
// Responsibilities:
//
// - Expose the getWithdrawal API operation to React components.
// - Manage server-state loading, success, and error states.
// - Use stable query keys for predictable caching and invalidation.
// - Validate the withdrawal public ID before fetching.
//
// The hook does NOT:
// - mutate withdrawal lifecycle state;
// - process, complete, fail, or cancel withdrawals;
// - calculate financial balances;
// - perform authorization.
//
// Request cancellation:
//
// The current authenticatedApiClient RequestOptions contract does not expose
// AbortSignal, so this hook intentionally does not pass a cancellation signal.
// Cancellation should be introduced at the shared API-client boundary rather
// than bypassing its typed contract here.
//
// =============================================================================

import { useQuery } from '@tanstack/react-query';

import {
  getWithdrawal,
} from '../api';

import type {
  FinancialWithdrawal,
} from '../models';

// =============================================================================
// Query Keys
// =============================================================================
//
// Keep withdrawal query keys centralized and deterministic so that individual
// withdrawal queries can be invalidated or updated without relying on
// duplicated string literals throughout the feature.
//
// =============================================================================

export const financialWithdrawalQueryKeys = {
  all: ['financial-withdrawals'] as const,

  detail: (withdrawalPublicId: string) =>
    [
      'financial-withdrawals',
      'withdrawal',
      withdrawalPublicId,
    ] as const,
};

/**
 * Validates a withdrawal public identifier before a request is made.
 *
 * Public IDs are opaque application identifiers. The frontend validates only
 * that a usable identifier was supplied. The backend remains authoritative
 * for existence and authorization.
 */
function assertWithdrawalPublicId(
  withdrawalPublicId: string,
): void {
  if (typeof withdrawalPublicId !== 'string') {
    throw new TypeError(
      'Withdrawal public ID must be a string.',
    );
  }

  if (withdrawalPublicId.trim().length === 0) {
    throw new Error(
      'Withdrawal public ID is required.',
    );
  }
}

/**
 * Retrieves a financial withdrawal by its public identifier.
 */
export function useFinancialWithdrawal(
  withdrawalPublicId: string | undefined,
) {
  const normalizedWithdrawalPublicId =
    withdrawalPublicId?.trim() ?? '';

  const isValidWithdrawalPublicId =
    normalizedWithdrawalPublicId.length > 0;

  return useQuery<FinancialWithdrawal, Error>({
    queryKey: isValidWithdrawalPublicId
      ? financialWithdrawalQueryKeys.detail(
          normalizedWithdrawalPublicId,
        )
      : financialWithdrawalQueryKeys.all,

    queryFn: () => {
      assertWithdrawalPublicId(
        normalizedWithdrawalPublicId,
      );

      return getWithdrawal(
        normalizedWithdrawalPublicId,
      );
    },

    enabled: isValidWithdrawalPublicId,
  });
}

