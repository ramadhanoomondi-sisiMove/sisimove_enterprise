'use client';

/**
 * sisiMove — Journey Query Hooks
 *
 * Responsibilities:
 * - Fetch public and administrative journey details through journeysApi.
 * - Map backend responses into frontend journey models.
 * - Centralize Journey detail query keys for reuse by mutations.
 * - Avoid requests when a required public ID is missing.
 *
 * Non-responsibilities:
 * - Performing HTTP requests outside the API adapter.
 * - Implementing Journey business rules.
 * - Treating public discovery and administrative access as equivalent.
 */

import { useQuery } from '@tanstack/react-query';

import { journeysApi } from '../api/journeys.api';

import {
  JourneyResponseMapper,
  type JourneyBackendResponse,
  type MappedJourney,
} from '../mappers/journey.mapper';

// -----------------------------------------------------------------------------
// Query Keys
// -----------------------------------------------------------------------------

export const journeyQueryKeys = {
  all: ['journeys'] as const,

  details: () => [...journeyQueryKeys.all, 'detail'] as const,

  detail: (journeyPublicId: string) =>
    [...journeyQueryKeys.details(), journeyPublicId] as const,

  adminDetails: () =>
    [...journeyQueryKeys.all, 'admin', 'detail'] as const,

  adminDetail: (journeyPublicId: string) =>
    [...journeyQueryKeys.adminDetails(), journeyPublicId] as const,
};

// -----------------------------------------------------------------------------
// Public Journey Hook
// -----------------------------------------------------------------------------

/**
 * Fetches a single publicly discoverable Journey.
 *
 * Endpoint:
 * GET /journeys/:journeyPublicId
 */
export function useJourney(
  journeyPublicId: string | undefined,
) {
  const normalizedPublicId = journeyPublicId?.trim() ?? '';

  return useQuery<MappedJourney | null, Error>({
    queryKey: journeyQueryKeys.detail(normalizedPublicId),

    queryFn: async () => {
      const response = await journeysApi.getPublicById<
        JourneyBackendResponse
      >(normalizedPublicId);

      if (response === null) {
        return null;
      }

      return JourneyResponseMapper.toModel(response);
    },

    enabled: normalizedPublicId.length > 0,

    staleTime: 30_000,
  });
}

// -----------------------------------------------------------------------------
// Administrative Journey Hook
// -----------------------------------------------------------------------------

/**
 * Fetches one complete Journey for authorized administrative inspection.
 *
 * Endpoint:
 * GET /journeys/admin/detailed/:journeyPublicId
 *
 * Uses the administrative endpoint rather than the public discovery endpoint.
 * Backend authorization remains authoritative.
 */
export function useDetailedJourney(
  journeyPublicId: string | undefined,
) {
  const normalizedPublicId = journeyPublicId?.trim() ?? '';

  return useQuery<MappedJourney, Error>({
    queryKey: journeyQueryKeys.adminDetail(normalizedPublicId),

    queryFn: async () => {
      const response = await journeysApi.getDetailedByPublicId(
        normalizedPublicId,
      );

      return JourneyResponseMapper.toModel(response);
    },

    enabled: normalizedPublicId.length > 0,

    staleTime: 30_000,
  });
}

export default useJourney;
