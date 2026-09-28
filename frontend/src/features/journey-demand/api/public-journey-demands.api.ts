// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand API
// -----------------------------------------------------------------------------
//
// Public API operations for Journey Demand discovery.
//
// This API is intentionally limited to anonymous/public read operations.
//
// Canonical backend endpoints:
//
//   GET /journey-demands
//   GET /journey-demands/:journeyDemandPublicId
//
// The collection endpoint supports an empty query. Therefore, the public
// marketplace can display all publicly discoverable Journey Demands before
// the visitor applies any search or filtering.
//
// Public visibility is enforced by the backend public application query
// boundary. The frontend does not use a separate `/public/journey-demands`
// HTTP prefix.
//
// Authentication, mutation, participation, and private requester operations
// belong to their respective authenticated Journey Demand boundaries.
//
// The frontend consumes public read models only. It does not depend on the
// backend's JourneyDemandAggregate or persistence representation.
//
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http/api-client';

import type {
  PublicJourneyDemand,
  PublicJourneyDemandQuery,
} from '../models';

// -----------------------------------------------------------------------------
// API Paths
// -----------------------------------------------------------------------------

/**
 * Canonical Journey Demand HTTP resource path.
 *
 * Public discovery uses GET operations on this resource.
 *
 * Authenticated commands may also use this resource path, but authentication
 * and authorization are enforced by the corresponding backend command routes.
 */
const JOURNEY_DEMANDS_PATH = '/journey-demands';

// -----------------------------------------------------------------------------
// Public Collection
// -----------------------------------------------------------------------------

/**
 * Retrieve publicly discoverable Journey Demands.
 *
 * An omitted query means:
 *
 *     Return all publicly discoverable Journey Demands.
 *
 * Optional query parameters refine the marketplace collection:
 *
 * - from: origin location;
 * - to: destination location;
 * - date: requested departure date;
 * - limit: maximum number of results;
 * - offset: number of results to skip.
 *
 * Backend:
 *
 *     GET /journey-demands
 *
 * The response is a public marketplace read model. It must never expose
 * JourneyDemandAggregate, internal persistence entities, or private member
 * references.
 */
export async function getPublicJourneyDemands(
  query?: PublicJourneyDemandQuery,
): Promise<readonly PublicJourneyDemand[]> {
  return apiClient.get<readonly PublicJourneyDemand[]>(
    JOURNEY_DEMANDS_PATH,
    {
      query: {
        ...(query?.from !== undefined ? { from: query.from } : {}),
        ...(query?.to !== undefined ? { to: query.to } : {}),
        ...(query?.date !== undefined ? { date: query.date } : {}),
        ...(query?.limit !== undefined ? { limit: query.limit } : {}),
        ...(query?.offset !== undefined ? { offset: query.offset } : {}),
      },
    },
  );
}

// -----------------------------------------------------------------------------
// Public Detail
// -----------------------------------------------------------------------------

/**
 * Retrieve one publicly discoverable Journey Demand by public identifier.
 *
 * Backend:
 *
 *     GET /journey-demands/:journeyDemandPublicId
 *
 * The backend dispatches this operation through
 * GetPublicJourneyDemandQuery rather than the generic
 * GetJourneyDemandByPublicIdQuery.
 *
 * A valid public identifier alone does not authorize anonymous exposure.
 * The backend public-read boundary determines whether the Journey Demand is
 * currently eligible for public discovery.
 *
 * The response contains the composed public marketplace representation:
 *
 * - requester.traveller;
 * - requester.trust;
 * - route;
 * - schedule;
 * - capacity;
 * - pricing;
 * - public participant representations.
 *
 * The following internal fields remain outside this contract:
 *
 * - requesterPublicId;
 * - participant memberPublicId;
 * - internal database identifiers;
 * - aggregate version;
 * - persistence timestamps;
 * - private lifecycle state.
 */
export async function getPublicJourneyDemandByPublicId(
  journeyDemandPublicId: string,
): Promise<PublicJourneyDemand | null> {
  return apiClient.get<PublicJourneyDemand | null>(
    `${JOURNEY_DEMANDS_PATH}/${encodeURIComponent(
      journeyDemandPublicId,
    )}`,
  );
}