// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Corridor API
// -----------------------------------------------------------------------------
//
// Backend:
//     POST /journeys/:journeyPublicId/corridor
//
// Authentication:
//     Required.
//
// The Journey controller expects:
//
//     {
//       corridorPublicId: string
//     }
//
// The corridor itself is owned by the Journey domain. The frontend sends
// only its public reference.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/foundation/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// Request
// -----------------------------------------------------------------------------

export interface AttachJourneyCorridorInput {
  corridorPublicId: string;
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export async function attachJourneyCorridor(
  journeyPublicId: string,
  input: AttachJourneyCorridorInput,
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/corridor`,
    input,
  );
}