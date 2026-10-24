// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Account balance hook
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { adminFinancialAccountsApi } from '../api';
import { adminFinancialAccountKeys } from './useAdminFinancialAccounts';

export function useAdminFinancialAccountBalance(accountPublicId: string | undefined) {
  const publicId = accountPublicId?.trim() ?? '';

  return useQuery({
    queryKey: publicId
      ? adminFinancialAccountKeys.balance(publicId)
      : [...adminFinancialAccountKeys.balances(), 'missing-public-id'],
    queryFn: () => adminFinancialAccountsApi.getBalance(publicId),
    enabled: publicId.length > 0,
  });
}
