
// =============================================================================
// sisiMove — Create Withdrawal Hook
// =============================================================================
//
// React Query mutation hook for creating a financial withdrawal.
//
// Responsibilities:
//
// - Expose the createWithdrawal API operation.
// - Require an idempotency key for every withdrawal intent.
// - Preserve the backend-owned withdrawal lifecycle boundary.
// - Invalidate affected withdrawal collection queries after success.
//
// The hook does NOT:
// - process, complete, fail, or cancel withdrawals;
// - calculate balances;
// - perform financial authorization;
// - resolve the member's financial account;
// - generate new idempotency keys during retries.
//
// =============================================================================

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createWithdrawal,
} from '../api';

import type {
  CreateWithdrawalRequest,
  FinancialWithdrawal,
} from '../models';

/**
 * Variables required to create a withdrawal.
 */
export interface CreateWithdrawalMutationVariables {
  readonly accountPublicId: string;
  readonly request: CreateWithdrawalRequest;
  readonly idempotencyKey: string;
}

/**
 * Creates a financial withdrawal.
 */
export function useCreateWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation<
    FinancialWithdrawal,
    Error,
    CreateWithdrawalMutationVariables
  >({
    mutationFn: ({
      accountPublicId,
      request,
      idempotencyKey,
    }) =>
      createWithdrawal(
        accountPublicId,
        request,
        idempotencyKey,
      ),

    onSuccess: async (_withdrawal, { accountPublicId }) => {
      const normalizedAccountPublicId = accountPublicId.trim();

      // Invalidate the account-scoped withdrawal collection.
      await queryClient.invalidateQueries({
        queryKey: [
          'financial-withdrawals',
          'account',
          normalizedAccountPublicId,
        ],
      });

      // Invalidate status-filtered withdrawal collections.
      await queryClient.invalidateQueries({
        queryKey: [
          'financial-withdrawals',
          'account',
          normalizedAccountPublicId,
          'status',
        ],
      });
    },
  });
}
