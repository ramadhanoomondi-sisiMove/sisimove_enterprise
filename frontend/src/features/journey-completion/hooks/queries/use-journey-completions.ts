// -----------------------------------------------------------------------------
// sisiMove — useJourneyCompletions
// -----------------------------------------------------------------------------
//
// Lists Journey Completion root entities.
//
// Important:
// The backend list endpoint returns JourneyCompletionEntity[] rather than
// JourneyCompletionAggregate[]. Therefore these results do not contain the
// aggregate's confirmations/disputes collections.
//
// A list item is mapped into a JourneyCompletion model with empty child
// collections because those collections are not present in this response.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { listJourneyCompletions } from '../../api/discovery/list-journey-completions.api';
import type { JourneyCompletion } from '../../models/journey-completion';
import { journeyCompletionKeys } from '../query-keys/journey-completion.keys';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export interface UseJourneyCompletionsOptions {
  journeyPublicId?: string;
  providerPublicId?: string;
  status?: string;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useJourneyCompletions(
  options: UseJourneyCompletionsOptions = {},
) {
  return useQuery({
    queryKey: journeyCompletionKeys.list(options),

    queryFn: async (): Promise<JourneyCompletion[]> => {
      const responses = await listJourneyCompletions({
        journeyPublicId: options.journeyPublicId,
        providerPublicId: options.providerPublicId,
        status: options.status,
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
  });
}

export default useJourneyCompletions;