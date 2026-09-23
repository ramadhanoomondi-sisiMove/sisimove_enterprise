// -----------------------------------------------------------------------------
// sisiMove — Publish Journey API
// -----------------------------------------------------------------------------
//
// Publishes a Journey that has completed the required creation steps.
//
// Backend:
//     POST /journeys/:journeyPublicId/publish
//
// Authentication:
//     Required.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/foundation/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// Request
// -----------------------------------------------------------------------------

export interface PublishJourneyInput {
  publishedAt?: string;
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export async function publishJourney(
  journeyPublicId: string,
  input: PublishJourneyInput = {},
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/publish`,
    input,
  );
}