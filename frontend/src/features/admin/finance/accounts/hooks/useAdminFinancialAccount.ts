// -----------------------------------------------------------------------------
// sisiMove Admin — Single Financial Account hook
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { adminFinancialAccountsApi } from '../api';
import { adminFinancialAccountKeys } from './useAdminFinancialAccounts';

export function useAdminFinancialAccount(accountPublicId: string | undefined) {
  const publicId = accountPublicId?.trim() ?? '';

  return useQuery({
    queryKey: publicId
      ? adminFinancialAccountKeys.detail(publicId)
      : [...adminFinancialAccountKeys.details(), 'missing-public-id'],
    queryFn: () => adminFinancialAccountsApi.getByPublicId(publicId),
    enabled: publicId.length > 0,
  });
}
