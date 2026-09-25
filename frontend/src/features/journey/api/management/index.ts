// -----------------------------------------------------------------------------
// sisiMove — Journey Management API Barrel
// -----------------------------------------------------------------------------
//
// Public barrel export for authenticated Journey management API adapters.
//
// Management APIs retrieve Journey collections belonging to a provider.
//
// Current management capabilities:
//
//   GET /journeys/me
//   GET /journeys/provider/:providerPublicId
//   GET /journeys/provider/:providerPublicId/status/:status
//
// These endpoints are authenticated and therefore use the shared
// `authenticatedApiClient` inside their individual adapters.
//
// IMPORTANT:
//
// `/journeys/me` derives the provider from the authenticated JWT. Its adapter
// intentionally accepts no provider identifier.
//
// The explicit provider endpoints accept `providerPublicId` because that
// identifier is part of their frozen backend route contract.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authenticated provider's own Journeys
// -----------------------------------------------------------------------------

export {
  getMyJourneys,
} from './get-my-journeys.api';

// -----------------------------------------------------------------------------
// Journeys by provider
// -----------------------------------------------------------------------------

export {
  getJourneysByProvider,
} from './get-journeys-by-provider.api';

// -----------------------------------------------------------------------------
// Journeys by provider and lifecycle status
// -----------------------------------------------------------------------------

export {
  getJourneysByProviderStatus,
} from './get-journeys-by-provider-status.api';