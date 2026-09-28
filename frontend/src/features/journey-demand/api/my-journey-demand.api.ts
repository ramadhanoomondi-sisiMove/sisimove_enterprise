
import { authenticatedApiClient } from '@/features/authentication';

import type { MyJourneyDemand } from '../models';

// =============================================================================
// Types
// =============================================================================

/**
 * Query parameters for the authenticated Journey Demand collection.
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
 */
const JOURNEY_DEMANDS_PATH = '/journey-demands';



// =============================================================================
// Single Journey Demand
// =============================================================================

/**
 * Retrieve one Journey Demand belonging to the currently authenticated user.
 *
 * Backend:
 *
 *     GET /journey-demands/me/:journeyDemandPublicId
 *
 * Ownership:
 *
 *     Derived and enforced by the backend from the authenticated Identity.
 *
 * The frontend provides only the Journey Demand public ID.
 *
 * It must never provide requesterPublicId.
 *
 * Success:
 *
 *     MyJourneyDemand
 *
 * Failure:
 *
 *     The backend's normal HTTP/application error is propagated unchanged
 *     through authenticatedApiClient.
 *
 * This function deliberately does not return `null`. A Journey Demand that
 * cannot be resolved for the authenticated requester is a backend resource
 * error, not a successful empty result.
 */
export async function getMyJourneyDemand(
  journeyDemandPublicId: string,
): Promise<MyJourneyDemand> {
  return authenticatedApiClient.get<MyJourneyDemand>(
    `${JOURNEY_DEMANDS_PATH}/me/${encodeURIComponent(journeyDemandPublicId)}`,
  );
}

