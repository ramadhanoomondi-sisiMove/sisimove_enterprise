// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Mapper
// -----------------------------------------------------------------------------
//
// Maps the public Journey Demand API representation into the frontend
// PublicJourneyDemand model.
//
// The API and frontend representations currently share the same contract.
// This mapper therefore performs an intentional shallow pass-through.
//
// Keep this boundary only if the application expects the API representation
// and frontend representation to diverge later. If they remain identical,
// callers should import and consume PublicJourneyDemand directly and this
// mapper should be removed.
// -----------------------------------------------------------------------------

import type { PublicJourneyDemand } from '../models';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export function mapPublicJourneyDemand(
  response: PublicJourneyDemand,
): PublicJourneyDemand {
  return response;
}
