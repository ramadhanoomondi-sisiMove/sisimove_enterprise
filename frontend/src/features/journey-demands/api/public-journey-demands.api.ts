// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand API
// -----------------------------------------------------------------------------
//
// Public API operations for Journey Demand discovery.
//
// This API is intentionally limited to anonymous/public read operations.
// Authentication, mutation, participation, and private requester operations
// belong to their respective Journey Demand application boundaries.
//
// The public marketplace consumes these operations without depending on the
// backend's internal Journey Demand implementation.
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http/api-client';

import type {
  PublicJourneyDemand,
  PublicJourneyDemandQuery,
} from '../models';

// -----------------------------------------------------------------------------
// API Paths
// -----------------------------------------------------------------------------

const PUBLIC_JOURNEY_DEMANDS_PATH = '/public/journey-demands';

// -----------------------------------------------------------------------------
// Public Collection
// -----------------------------------------------------------------------------

/**
 * Retrieve Journey Demands available for public discovery.
 *
 * With no query supplied, the backend returns the publicly discoverable
 * Journey Demands without requiring the visitor to search first.
 *
 * Optional query parameters refine the public marketplace result.
 */
export async function getPublicJourneyDemands(
  query?: PublicJourneyDemandQuery,
): Promise<readonly PublicJourneyDemand[]> {
  return apiClient.get<readonly PublicJourneyDemand[]>(
    PUBLIC_JOURNEY_DEMANDS_PATH,
    {
      query: {
        from: query?.from,
        to: query?.to,
        date: query?.date,
      },
    },
  );
}

// -----------------------------------------------------------------------------
// Public Detail
// -----------------------------------------------------------------------------

/**
 * Retrieve one publicly discoverable Journey Demand by its public identifier.
 *
 * The backend public-read boundary is responsible for determining whether the
 * Journey Demand is actually eligible for anonymous/public visibility.
 *
 * A valid public identifier alone is therefore not treated as permission to
 * expose the resource.
 */
export async function getPublicJourneyDemandByPublicId(
  journeyDemandPublicId: string,
): Promise<PublicJourneyDemand | null> {
  return apiClient.get<PublicJourneyDemand>(
    `${PUBLIC_JOURNEY_DEMANDS_PATH}/${encodeURIComponent(
      journeyDemandPublicId,
    )}`,
  );
}

