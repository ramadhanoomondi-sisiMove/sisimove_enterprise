// -----------------------------------------------------------------------------
// sisiMove — Create Journey API
// -----------------------------------------------------------------------------
//
// Creates a new Journey aggregate.
//
// Backend:
//     POST /journeys
//
// Authentication:
//     Required.
//
// Important:
//     The authenticated provider must be derived by the backend from the
//     current authenticated identity.
//
// The frontend therefore does NOT accept or send providerPublicId.
//
// The backend should return the newly-created Journey aggregate/read contract,
// including its publicId, which becomes the identifier used by all subsequent
// Journey creation steps.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

import type { Journey } from '../models/journey';

import type { CreateJourneyInput } from '../schemas/create-journey.schema';

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export async function createJourney(
  input: CreateJourneyInput,
): Promise<Journey> {
  return authenticatedApiClient.post<Journey>(
    '/journeys',
    input,
  );
}