// -----------------------------------------------------------------------------
// sisiMove — useJourneyBoardings
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Fetch the available Journey Boarding records.
// - Manage server state through the application's query layer.
// - Map HTTP Journey Boarding responses into frontend models.
//
// Architectural rules:
// - The hook owns query orchestration only.
// - HTTP execution remains inside the API adapter.
// - Authentication remains inside AuthenticatedApiClient.
// - Response mapping remains inside the mapper.
// - No domain/business rules belong here.
// - Public identifiers remain opaque strings.
// - The list endpoint is intentionally treated as a root-entity response;
//   participants and events are not invented when the backend does not return
//   them.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// React Query
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

import {
  listJourneyBoardings,
  type ListJourneyBoardingsResponse,
} from '../../api';

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

import type { JourneyBoarding } from '../../models';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import { JourneyBoardingStatus } from '../../models';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

/**
 * Stable query key for the Journey Boarding collection.
 */
export const journeyBoardingsQueryKeys = {
  all: ['journey-boardings'] as const,

  list: () => ['journey-boardings', 'list'] as const,
};

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Maps the root-entity response returned by GET /journey-boardings into the
 * frontend JourneyBoarding model.
 *
 * The list endpoint does not return participants or events, so the hook keeps
 * those collections empty rather than inventing data.
 */
function mapJourneyBoarding(
  response: ListJourneyBoardingsResponse,
): JourneyBoarding {
  return {
    publicId: response.publicId,
    journeyId: response.journeyId,
    providerPublicId: response.providerPublicId,
    status: response.status as JourneyBoardingStatus,
    boardingStartedAt: response.boardingStartedAt,
    journeyStartedAt: response.journeyStartedAt,
    cancelledAt: response.cancelledAt,
    version: response.version,
    participants: [],
    events: [],
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Fetches Journey Boarding records.
 *
 * The returned `data` contains frontend JourneyBoarding models rather than
 * raw HTTP transport responses.
 */
export function useJourneyBoardings() {
  return useQuery<JourneyBoarding[]>({
    queryKey: journeyBoardingsQueryKeys.list(),

    queryFn: async () => {
      const responses = await listJourneyBoardings();

      return responses.map(mapJourneyBoarding);
    },
  });
}