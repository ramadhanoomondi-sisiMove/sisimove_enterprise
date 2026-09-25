// -----------------------------------------------------------------------------
// sisiMove — Get Public Journey Demand API
// -----------------------------------------------------------------------------
//
// Backend:
//     GET /journey-demands/:journeyDemandPublicId
//
// Authentication:
//     Not required.
//
// This returns the public marketplace projection rather than the aggregate.
//
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http';

import type { PublicJourneyDemand } from '../models';

export async function getJourneyDemand(
  journeyDemandPublicId: string,
): Promise<PublicJourneyDemand | null> {
  return apiClient.get<PublicJourneyDemand | null>(
    `/journey-demands/${journeyDemandPublicId}`,
  );
}