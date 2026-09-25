// -----------------------------------------------------------------------------
// sisiMove — Get My Journey Demands API
// -----------------------------------------------------------------------------
//
// Backend:
//     GET /journey-demands/me
//
// Authentication:
//     Required.
//
// IMPORTANT:
//     requesterPublicId is intentionally NOT accepted here.
//     The backend derives the requester from the authenticated identity.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { MyJourneyDemand } from '../models';

export interface GetMyJourneyDemandsParams {
  limit?: number;
  offset?: number;
}

export async function getMyJourneyDemands(
  params?: GetMyJourneyDemandsParams,
): Promise<MyJourneyDemand[]> {
  return authenticatedApiClient.get<MyJourneyDemand[]>(
    '/journey-demands/me',
    {
      query: params,
    },
  );
}