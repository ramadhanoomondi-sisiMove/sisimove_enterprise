// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Mapper
// -----------------------------------------------------------------------------
//
// Maps the public Journey Demand API representation into the frontend
// PublicJourneyDemand model.
//
// The API and frontend models currently have the same representation, so this
// mapper intentionally performs a shallow pass-through rather than introducing
// unnecessary field-by-field transformations.
//
// Keep this mapper as the boundary where API-to-frontend transformation can
// evolve later if the external API representation diverges from the frontend
// model.
// -----------------------------------------------------------------------------

import type { PublicJourneyDemand } from '../models';

// -----------------------------------------------------------------------------
// API Representation
// -----------------------------------------------------------------------------

type PublicJourneyDemandApiResponse = PublicJourneyDemand;

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export function mapPublicJourneyDemand(
  response: PublicJourneyDemandApiResponse,
): PublicJourneyDemand {
  return {
    ...response,
  };
}
