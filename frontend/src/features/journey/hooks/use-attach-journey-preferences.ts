// -----------------------------------------------------------------------------
// sisiMove — useAttachJourneyPreferences
// -----------------------------------------------------------------------------
//
// Mutation hook for provider-declared Journey preferences.
//
// -----------------------------------------------------------------------------

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  attachJourneyPreferences,
  type AttachJourneyPreferencesInput,
} from '../api';

import {
  journeyPreferencesQueryKeys,
} from './use-journey-preferences';

// =============================================================================
// Hook
// =============================================================================

export function useAttachJourneyPreferences() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    {
      journeyPublicId: string;
      input: AttachJourneyPreferencesInput;
    }
  >({
    mutationFn: ({
      journeyPublicId,
      input,
    }) =>
      attachJourneyPreferences(
        journeyPublicId,
        input,
      ),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey:
          journeyPreferencesQueryKeys.detail(
            variables.journeyPublicId,
          ),
      });
    },
  });
}