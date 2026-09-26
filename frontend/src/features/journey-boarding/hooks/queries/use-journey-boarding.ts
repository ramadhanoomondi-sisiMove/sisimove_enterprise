// -----------------------------------------------------------------------------
// sisiMove — useJourneyBoarding
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Fetch one Journey Boarding by public identifier.
// - Manage the server-state lifecycle through the application's query layer.
// - Map the HTTP response into the frontend JourneyBoarding model.
//
// Architectural rules:
// - The hook owns query orchestration only.
// - HTTP execution remains inside the API adapter.
// - Authentication remains inside AuthenticatedApiClient.
// - Response mapping remains inside the mapper.
// - No domain/business rules belong here.
// - Public IDs remain opaque strings.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// React Query
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

import {
  getJourneyBoarding,
  type GetJourneyBoardingParams,
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
// Query Key
// -----------------------------------------------------------------------------

/**
 * Stable query-key factory for one Journey Boarding.
 *
 * Keeping the key construction local to the query hook prevents components
 * from having to know the server-state cache structure.
 */
export const journeyBoardingQueryKeys = {
  all: ['journey-boardings'] as const,

  detail: (journeyBoardingPublicId: string) =>
    ['journey-boardings', 'detail', journeyBoardingPublicId] as const,
};

// -----------------------------------------------------------------------------
// Hook Parameters
// -----------------------------------------------------------------------------

export interface UseJourneyBoardingParams
  extends GetJourneyBoardingParams {
  /**
   * Allows callers to explicitly control whether the query should execute.
   *
   * This is useful for route-level components where the public identifier
   * may not yet be available.
   */
  enabled?: boolean;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Fetches one Journey Boarding by public identifier.
 *
 * The returned `data` is the frontend domain-facing model rather than the
 * raw HTTP response.
 */
export function useJourneyBoarding(
  params: UseJourneyBoardingParams,
) {
  const { publicId, enabled = true } = params;

  return useQuery<JourneyBoarding>({
    queryKey: journeyBoardingQueryKeys.detail(publicId),

    queryFn: async () => {
      const response = await getJourneyBoarding({
        publicId,
      });

      return journeyBoardingMapper.toModel(response);
    },

    enabled: enabled && publicId.trim().length > 0,
  });
}