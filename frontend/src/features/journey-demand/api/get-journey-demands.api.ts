// -----------------------------------------------------------------------------
// sisiMove — Get Public Journey Demands API
// -----------------------------------------------------------------------------
//
// Backend:
//     GET /journey-demands
//
// Authentication:
//     Not required.
//
// This is the anonymous marketplace collection boundary.
//
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http';

import type { PublicJourneyDemand } from '../models';

export interface GetJourneyDemandsParams {
  from?: string;
  to?: string;
  date?: string;
  limit?: number;
  offset?: number;
}

export async function getJourneyDemands(
  params?: GetJourneyDemandsParams,
): Promise<PublicJourneyDemand[]> {
  return apiClient.get<PublicJourneyDemand[]>(
    '/journey-demands',
    {
      query: params,
    },
  );
}