// -----------------------------------------------------------------------------
// sisiMove — useJourneyBoardingByJourney
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Fetch the Journey Boarding associated with a Journey.
// - Manage server state through the application's query layer.
// - Map the HTTP response into the frontend JourneyBoarding model.
//
// Architectural rules:
// - The hook owns query orchestration only.
// - HTTP execution remains inside the API adapter.
// - Authentication remains inside AuthenticatedApiClient.
// - Response mapping remains inside the mapper.
// - No domain/business rules belong here.
// - Journey public identifiers remain opaque strings.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// React Query
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

import {
  getJourneyBoardingByJourney,
  type GetJourneyBoardingByJourneyParams,
} from '../../api';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

import type { JourneyBoarding } from '../../models';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import { journeyBoardingMapper } from '../../mappers';

// -----------------------------------------------------------------------------
// Query Parameters
// -----------------------------------------------------------------------------

export interface UseJourneyBoardingByJourneyParams
  extends GetJourneyBoardingByJourneyParams {
  /**
   * Allows callers to explicitly control whether the query should execute.
   *
   * This is useful when the Journey public identifier is obtained
   * asynchronously, such as from a route parameter.
   */
  enabled?: boolean;
}

// -----------------------------------------------------------------------------
// Query Keys
// -----------------------------------------------------------------------------

/**
 * Stable query-key factory for Journey Boarding discovery by Journey.
 */
export const journeyBoardingByJourneyQueryKeys = {
  detail: (journeyPublicId: string) =>
    ['journey-boardings', 'journey', journeyPublicId] as const,
};

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Fetches the Journey Boarding associated with a Journey public identifier.
 *
 * The returned `data` is the frontend JourneyBoarding model rather than the
 * raw HTTP transport response.
 */
export function useJourneyBoardingByJourney(
  params: UseJourneyBoardingByJourneyParams,
) {
  const {
    journeyPublicId,
    enabled = true,
  } = params;

  return useQuery<JourneyBoarding>({
    queryKey: journeyBoardingByJourneyQueryKeys.detail(journeyPublicId),

    queryFn: async () => {
      const response = await getJourneyBoardingByJourney({
        journeyPublicId,
      });

      return journeyBoardingMapper.toModel({
        publicId: response.publicId,
        journeyId: response.journeyId,
        providerPublicId: response.providerPublicId,
        status: response.status,
        boardingStartedAt: response.boardingStartedAt,
        journeyStartedAt: response.journeyStartedAt,
        cancelledAt: response.cancelledAt,
        version: response.version,
        participants: response.participants,
        events: response.events,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      });
    },

    enabled:
      enabled &&
      journeyPublicId.trim().length > 0,
  });
}