// -----------------------------------------------------------------------------
// sisiMove — useJourneyCompletionsByProvider
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getJourneyCompletionsByProvider } from '../../api/discovery/get-journey-completions-by-provider.api';
import type { JourneyCompletion } from '../../models/journey-completion';
import { journeyCompletionKeys } from '../query-keys/journey-completion.keys';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourneyCompletionsByProvider(
  providerPublicId: string | undefined,
  status?: string,
) {
  return useQuery({
    queryKey: providerPublicId
      ? journeyCompletionKeys.byProvider({
          providerPublicId,
          status,
        })
      : journeyCompletionKeys.lists(),

    queryFn: async (): Promise<JourneyCompletion[]> => {
      if (providerPublicId === undefined) {
        return [];
      }

      const responses = await getJourneyCompletionsByProvider({
        providerPublicId,
        status,
      });

      return responses.map((response) => ({
        publicId: response.publicId,
        journeyPublicId: response.journeyPublicId,
        providerPublicId: response.providerPublicId,
        status: response.status as JourneyCompletion['status'],
        completionRequestedAt: response.completionRequestedAt,
        confirmedAt: response.confirmedAt,
        disputedAt: response.disputedAt,
        cancelledAt: response.cancelledAt,
        requiredConfirmations: response.requiredConfirmations,
        confirmedCount: response.confirmedCount,
        version: response.version,
        confirmations: [],
        disputes: [],
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      }));
    },

    enabled:
      providerPublicId !== undefined &&
      providerPublicId.length > 0,
  });
}

export default useJourneyCompletionsByProvider;