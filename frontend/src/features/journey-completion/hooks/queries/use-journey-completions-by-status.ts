// -----------------------------------------------------------------------------
// sisiMove — useJourneyCompletionsByStatus
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getJourneyCompletionsByStatus } from '../../api/discovery/get-journey-completions-by-status.api';
import type { JourneyCompletion } from '../../models/journey-completion';
import { journeyCompletionKeys } from '../query-keys/journey-completion.keys';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export interface UseJourneyCompletionsByStatusOptions {
  status: string;
  providerPublicId?: string;
  journeyPublicId?: string;
}

export function useJourneyCompletionsByStatus(
  options: UseJourneyCompletionsByStatusOptions,
) {
  return useQuery({
    queryKey: journeyCompletionKeys.byStatus(options),

    queryFn: async (): Promise<JourneyCompletion[]> => {
      const responses = await getJourneyCompletionsByStatus({
        status: options.status,
        providerPublicId: options.providerPublicId,
        journeyPublicId: options.journeyPublicId,
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

    enabled: options.status.length > 0,
  });
}

export default useJourneyCompletionsByStatus;