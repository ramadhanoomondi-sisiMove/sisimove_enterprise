// src/features/journeys/models/public-journey-query.ts
// -----------------------------------------------------------------------------
// sisiMove — Public Journey Query
// -----------------------------------------------------------------------------
//
// Query state used when retrieving publicly discoverable Journeys.
//
// All fields are optional because the public Journey marketplace must work
// without search criteria:
//
//   GET /public/journeys
//
// Filters are optional refinements:
//
//   GET /public/journeys?from=Nairobi&to=Kisumu&date=2026-09-20
//
// This is a frontend/API query model, not a Journey domain model.
// -----------------------------------------------------------------------------

export interface PublicJourneyQuery {
  readonly from?: string;
  readonly to?: string;
  readonly date?: string;
}