// -----------------------------------------------------------------------------
// sisiMove — Create Journey Demand API
// -----------------------------------------------------------------------------
//
// Application-facing API adapter for creating a Journey Demand.
//
// Backend:
//     POST /journey-demands
//
// Authentication:
//     Required.
//
// IMPORTANT:
//     The current backend CreateJourneyDemandDto still accepts
//     requesterPublicId. This adapter therefore preserves that contract.
//     The ownership refactor can later move requester resolution entirely
//     to the authenticated identity on the backend.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { JourneyDemand } from '../models';
import type { CreateJourneyDemandInput } from '../schemas';

export async function createJourneyDemand(
  input: CreateJourneyDemandInput,
): Promise<JourneyDemand> {
  return authenticatedApiClient.post<JourneyDemand>(
    '/journey-demands',
    input,
  );
}