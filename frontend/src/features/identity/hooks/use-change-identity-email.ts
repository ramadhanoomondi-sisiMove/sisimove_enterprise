// -----------------------------------------------------------------------------
// sisiMove — Change Identity Email Hook
// -----------------------------------------------------------------------------

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { changeIdentityEmail } from '../api/identity.api';

// =============================================================================
// Hook
// =============================================================================

export function useChangeIdentityEmail() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, {
    identityPublicId: string;
    email: string;
  }>({
    mutationFn: ({ identityPublicId, email }) =>
      changeIdentityEmail(identityPublicId, email),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['current-identity'],
      });
    },
  });
}

export default useChangeIdentityEmail;