// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Account operation mutations
// -----------------------------------------------------------------------------
// Backend permissions remain authoritative. A mutation error is surfaced to
// the caller; this hook does not optimistically change account status.
// -----------------------------------------------------------------------------

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  adminFinancialAccountsApi,
  type ActivateAdminFinancialAccountRequest,
  type CloseAdminFinancialAccountRequest,
  type CreateAdminFinancialAccountRequest,
  type SuspendAdminFinancialAccountRequest,
} from '../api';
import { adminFinancialAccountKeys } from './useAdminFinancialAccounts';

export function useAdminFinancialAccountOperations() {
  const queryClient = useQueryClient();

  const invalidateAccountData = async (publicId?: string) => {
    const tasks: Promise<void>[] = [
      queryClient.invalidateQueries({ queryKey: adminFinancialAccountKeys.all }),
    ];

    if (publicId?.trim()) {
      tasks.push(
        queryClient.invalidateQueries({
          queryKey: adminFinancialAccountKeys.detail(publicId),
        }),
        queryClient.invalidateQueries({
          queryKey: adminFinancialAccountKeys.balance(publicId),
        }),
      );
    }

    await Promise.all(tasks);
  };

  const create = useMutation({
    mutationFn: (request: CreateAdminFinancialAccountRequest) =>
      adminFinancialAccountsApi.create(request),
    onSuccess: async (account) => invalidateAccountData(account.publicId),
  });

  const activate = useMutation({
    mutationFn: ({
      accountPublicId,
      request,
    }: {
      accountPublicId: string;
      request: ActivateAdminFinancialAccountRequest;
    }) => adminFinancialAccountsApi.activate(accountPublicId, request),
    onSuccess: async (account) => invalidateAccountData(account.publicId),
  });

  const suspend = useMutation({
    mutationFn: ({
      accountPublicId,
      request,
    }: {
      accountPublicId: string;
      request: SuspendAdminFinancialAccountRequest;
    }) => adminFinancialAccountsApi.suspend(accountPublicId, request),
    onSuccess: async (account) => invalidateAccountData(account.publicId),
  });

  const close = useMutation({
    mutationFn: ({
      accountPublicId,
      request,
    }: {
      accountPublicId: string;
      request: CloseAdminFinancialAccountRequest;
    }) => adminFinancialAccountsApi.close(accountPublicId, request),
    onSuccess: async (account) => invalidateAccountData(account.publicId),
  });

  return {
    create,
    activate,
    suspend,
    close,
    isPending:
      create.isPending ||
      activate.isPending ||
      suspend.isPending ||
      close.isPending,
  };
}
