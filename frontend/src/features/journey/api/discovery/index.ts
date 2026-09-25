// -----------------------------------------------------------------------------
// sisiMove — Journey Discovery API Barrel
// -----------------------------------------------------------------------------
//
// Public barrel export for Journey discovery API adapters.
//
// Discovery APIs are responsible for retrieving publicly discoverable Journey
// data from the Journey HTTP boundary.
//
// Current discovery capabilities:
//
//   GET /journeys/public
//   GET /journeys/search
//   GET /journeys/:journeyPublicId
//
// Public discovery uses the foundation `apiClient` rather than the
// authenticated API client because marketplace discovery must not require
// authentication.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Public marketplace collection
// -----------------------------------------------------------------------------

export {
  getPublicJourneys,
  type GetPublicJourneysParams,
} from './get-public-journeys.api';

// -----------------------------------------------------------------------------
// Published Journey search
// -----------------------------------------------------------------------------

export {
  searchPublishedJourneys,
  type SearchPublishedJourneysParams,
} from './search-published-journeys.api';

// -----------------------------------------------------------------------------
// Public Journey detail
// -----------------------------------------------------------------------------

export {
  getJourney,
} from './get-journey.api';