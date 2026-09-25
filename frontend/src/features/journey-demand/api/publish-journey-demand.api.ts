// -----------------------------------------------------------------------------
// sisiMove — Publish Journey Demand API
// -----------------------------------------------------------------------------
//
// Backend:
//     POST /journey-demands/:journeyDemandPublicId/publish
//
// Authentication:
//     Required.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

export interface PublishJourneyDemandInput {
  correlationId?: string;
  causationId?: string;
}

export async function publishJourneyDemand(
  journeyDemandPublicId: string,
  input: PublishJourneyDemandInput = {},
): Promise<void> {
  await authenticatedApiClient.post(
    `/journey-demands/${journeyDemandPublicId}/publish`,
    input,
  );
}