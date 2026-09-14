// src/features/journeys/mappers/map-public-journey.ts
// -----------------------------------------------------------------------------
// sisiMove — Public Journey Mapper
// -----------------------------------------------------------------------------
//
// Maps the API representation of a publicly discoverable Journey into the
// frontend PublicJourney model.
//
// Responsibilities:
// - normalize the external API representation;
// - provide the frontend with its stable PublicJourney shape;
// - keep API representation details out of UI components.
//
// This mapper must remain intentionally thin.
//
// It does NOT:
// - fetch Traveller Profile data;
// - fetch Trust data;
// - fetch Assets;
// - compose Journey Demand;
// - perform marketplace composition;
// - contain business rules.
//
// Cross-domain enrichment belongs to the appropriate feature or to the
// Marketplace read boundary.
//
// -----------------------------------------------------------------------------

import type { PublicJourney } from '../models';

// -----------------------------------------------------------------------------
// API Representation
// -----------------------------------------------------------------------------
//
// The public Journey endpoint currently returns the Journey representation
// directly. Keep this type local to the mapper so API representation details
// do not leak throughout the frontend.
//
// The shape intentionally mirrors the public Journey model.
//
// If the backend public DTO later changes independently from the frontend
// model, this boundary is where that translation belongs.
// -----------------------------------------------------------------------------

type PublicJourneyApiResponse = PublicJourney;

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export function mapPublicJourney(
  response: PublicJourneyApiResponse,
): PublicJourney {
  return {
    ...response,
  };
}