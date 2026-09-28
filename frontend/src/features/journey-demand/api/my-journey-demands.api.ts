// -----------------------------------------------------------------------------
// sisiMove — My Journey Demands API
// -----------------------------------------------------------------------------
//
// Authenticated API operations for the currently authenticated user's
// Journey Demands.
//
// This API is intentionally separated from the public Journey Demand API.
//
// Public discovery:
//
//     GET /journey-demands
//     GET /journey-demands/:journeyDemandPublicId
//
// Authenticated ownership:
//
//     GET /journey-demands/me
//
// The `/me` endpoint is resolved from the authenticated identity on the
// backend. The frontend does not send a requesterPublicId and must never
// determine ownership by trusting a client-supplied requester identifier.
//
// Authentication rule:
//
//     Public Journey Demand reads
//         → apiClient
//
//     Authenticated "my Journey Demands" reads
//         → authenticatedApiClient
//
// The authenticated API client obtains the current AuthSession and injects:
//
//     Authorization: Bearer <accessToken>
//
// into the request.
//
// The response is an authenticated owner read model. It is different from
// PublicJourneyDemand because the owner needs lifecycle and management state
// that is intentionally not exposed by the public marketplace projection.
//
// The frontend consumes the MyJourneyDemand read model only. It does not
// depend on JourneyDemandAggregate, domain entities, Prisma models, or other
// backend persistence representations.
//
// IMPORTANT:
//
// An empty array is a successful result:
//
//     []
//
// It means the authenticated user currently has no Journey Demands.
//
// It is NOT an error and must not be converted into an exception here.
// The presentation layer is responsible for displaying the appropriate
// empty state.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

import type { MyJourneyDemand } from '../models';

// =============================================================================
// Types
// =============================================================================

/**
 * Query parameters for the authenticated "my Journey Demands" collection.
 *
 * Ownership is deliberately absent from this contract.
 *
 * The backend derives the requester from the authenticated identity.
 */
export interface MyJourneyDemandQuery {
  readonly limit?: number;
  readonly offset?: number;
}

// =============================================================================
// API Paths
// =============================================================================

/**
 * Canonical Journey Demand HTTP resource path.
 *
 * The authenticated owner collection is exposed through the `/me` sub-route.
 */
const JOURNEY_DEMANDS_PATH = '/journey-demands';

// =============================================================================
// My Journey Demands
// =============================================================================

/**
 * Retrieve Journey Demands belonging to the currently authenticated user.
 *
 * Backend:
 *
 *     GET /journey-demands/me
 *
 * Authentication:
 *
 *     Bearer access token
 *
 * Ownership:
 *
 *     The backend derives ownership from the authenticated Identity.
 *
 * The frontend therefore does NOT provide:
 *
 *     requesterPublicId
 *
 * This is deliberate. A "my" resource must be resolved from the authenticated
 * session rather than from a client-supplied identity identifier.
 *
 * Optional pagination:
 *
 * - limit: maximum number of Journey Demands to return;
 * - offset: number of Journey Demands to skip.
 *
 * The response is an authenticated owner read model. It may contain lifecycle
 * information such as:
 *
 * - DRAFT;
 * - OPEN;
 * - MATCHED;
 * - CONVERTED;
 * - FULFILLED;
 * - CANCELLED;
 * - EXPIRED.
 *
 * This information belongs to the user's Journey Demand management experience
 * and is therefore intentionally separate from the public marketplace model.
 *
 * Empty collection:
 *
 *     []
 *
 * is a valid successful response and means the user has no Journey Demands.
 */
export async function getMyJourneyDemands(
  query?: MyJourneyDemandQuery,
): Promise<readonly MyJourneyDemand[]> {
  return authenticatedApiClient.get<readonly MyJourneyDemand[]>(
    `${JOURNEY_DEMANDS_PATH}/me`,
    {
      query: {
        ...(query?.limit !== undefined ? { limit: query.limit } : {}),
        ...(query?.offset !== undefined ? { offset: query.offset } : {}),
      },
    },
  );
}