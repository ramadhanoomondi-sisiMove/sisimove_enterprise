// -----------------------------------------------------------------------------
// sisiMove — Change Identity Phone Number Hook
// -----------------------------------------------------------------------------

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { changeIdentityPhoneNumber } from '../api/identity.api';

// =============================================================================
// Hook
// =============================================================================

export function useChangeIdentityPhoneNumber() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, {
    identityPublicId: string;
    phoneNumber: string;
  }>({
    mutationFn: ({ identityPublicId, phoneNumber }) =>
      changeIdentityPhoneNumber(identityPublicId, phoneNumber),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['current-identity'],
      });
    },
  });
}

export default useChangeIdentityPhoneNumber;