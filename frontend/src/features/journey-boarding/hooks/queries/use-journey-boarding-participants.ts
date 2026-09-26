// -----------------------------------------------------------------------------
// sisiMove — useJourneyBoardingParticipants
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Fetch participants belonging to one Journey Boarding.
// - Manage participant server state through the application's query layer.
// - Map HTTP participant responses into frontend participant models.
//
// Architectural rules:
// - The hook owns query orchestration only.
// - HTTP execution remains inside the API adapter.
// - Authentication remains inside AuthenticatedApiClient.
// - Response mapping remains inside the participant mapper.
// - No domain/business rules belong here.
// - Public identifiers remain opaque strings.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// React Query
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

import {
  getJourneyBoardingParticipants,
  type GetJourneyBoardingParticipantsParams,
} from '../../api';

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

import type { JourneyBoardingParticipant } from '../../models';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import { journeyBoardingParticipantMapper } from '../../mappers';

// -----------------------------------------------------------------------------
// Query Parameters
// -----------------------------------------------------------------------------

export interface UseJourneyBoardingParticipantsParams
  extends GetJourneyBoardingParticipantsParams {
  /**
   * Allows callers to explicitly control whether the query should execute.
   *
   * This is useful when the Journey Boarding public identifier is obtained
   * asynchronously, such as from a route parameter.
   */
  enabled?: boolean;
}

// -----------------------------------------------------------------------------
// Query Keys
// -----------------------------------------------------------------------------

/**
 * Stable query-key factory for Journey Boarding participants.
 */
export const journeyBoardingParticipantsQueryKeys = {
  all: ['journey-boardings', 'participants'] as const,

  list: (journeyBoardingPublicId: string) =>
    [
      'journey-boardings',
      'participants',
      journeyBoardingPublicId,
    ] as const,
};

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Fetches all participants belonging to one Journey Boarding.
 *
 * The returned `data` contains frontend JourneyBoardingParticipant models
 * rather than raw HTTP transport responses.
 */
export function useJourneyBoardingParticipants(
  params: UseJourneyBoardingParticipantsParams,
) {
  const {
    publicId,
    enabled = true,
  } = params;

  return useQuery<JourneyBoardingParticipant[]>({
    queryKey:
      journeyBoardingParticipantsQueryKeys.list(publicId),

    queryFn: async () => {
      const response = await getJourneyBoardingParticipants({
        publicId,
      });

      return journeyBoardingParticipantMapper.toModels(response);
    },

    enabled:
      enabled &&
      publicId.trim().length > 0,
  });
}