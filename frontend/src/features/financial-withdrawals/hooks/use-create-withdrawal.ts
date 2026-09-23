// =============================================================================
// sisiMove — Create Withdrawal Hook
// =============================================================================
//
// React Query mutation hook for creating a financial withdrawal.
//
// Responsibilities:
//
// - Expose the createWithdrawal API operation to React components.
// - Keep server-state mutation handling outside presentation components.
// - Preserve the backend-owned withdrawal lifecycle boundary.
// - Invalidate affected withdrawal collection queries after successful
//   creation so wallet/history views do not remain stale.
//
// The hook does NOT:
// - process, complete, fail, or cancel withdrawals;
// - calculate balances;
// - perform financial authorization;
// - resolve the member's financial account.
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
 *
 * The account public ID is supplied separately from the request body because
 * it belongs to the account-scoped API boundary.
 */
export interface CreateWithdrawalMutationVariables {
  readonly accountPublicId: string;
  readonly request: CreateWithdrawalRequest;
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
    mutationFn: ({ accountPublicId, request }) =>
      createWithdrawal(accountPublicId, request),

    onSuccess: async (_withdrawal, { accountPublicId }) => {
      const normalizedAccountPublicId = accountPublicId.trim();

      // Invalidate the account-scoped withdrawal collection so the next
      // render/refetch reflects the newly created withdrawal.
      await queryClient.invalidateQueries({
        queryKey: [
          'financial-withdrawals',
          'account',
          normalizedAccountPublicId,
        ],
      });

      // Also invalidate status-filtered collections belonging to the same
      // account. The newly created withdrawal normally starts as PENDING,
      // but invalidating the collection family keeps every status view
      // consistent with the server.
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

