// -----------------------------------------------------------------------------
// sisiMove — Journey Mappers Barrel
// -----------------------------------------------------------------------------
//
// Public barrel export for all Journey frontend mappers.
//
// Mappers form the boundary between API transport representations and the
// frontend feature models. Consumers should import mapper functions and their
// API response types from this barrel rather than reaching into individual
// mapper files.
//
// Responsibilities remain separated:
//
// - Component mappers
//     Normalize corridor, waypoint, schedule, vehicle, capacity, pricing,
//     preferences, and asset responses.
//
// - Journey mapper
//     Normalizes the authenticated Journey representation.
//
// - My Journey mapper
//     Normalizes the authenticated `/journeys/me` representation.
//
// - Public Journey mapper
//     Normalizes the public marketplace representation without exposing
//     providerPublicId.
//
// No API requests or UI logic belong in this barrel.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Journey Components
// -----------------------------------------------------------------------------

export {
  mapJourneyCorridor,
  type JourneyCorridorApiResponse,
} from './journey-corridor.mapper';

export {
  mapJourneyWaypoint,
  type JourneyWaypointApiResponse,
} from './journey-waypoint.mapper';

export {
  mapJourneySchedule,
  type JourneyScheduleApiResponse,
} from './journey-schedule.mapper';

export {
  mapJourneyVehicle,
  type JourneyVehicleApiResponse,
} from './journey-vehicle.mapper';

export {
  mapJourneyCapacity,
  type JourneyCapacityApiResponse,
} from './journey-capacity.mapper';

export {
  mapJourneyPricing,
  type JourneyPricingApiResponse,
} from './journey-pricing.mapper';

export {
  mapJourneyPreferences,
  type JourneyPreferencesApiResponse,
} from './journey-preferences.mapper';

export {
  mapJourneyAsset,
  type JourneyAssetApiResponse,
} from './journey-asset.mapper';

// -----------------------------------------------------------------------------
// Journey
// -----------------------------------------------------------------------------

export {
  mapJourney,
  type JourneyApiResponse,
} from './journey.mapper';

// -----------------------------------------------------------------------------
// My Journeys
// -----------------------------------------------------------------------------

export {
  mapMyJourney,
  mapMyJourneys,
  type MyJourneyApiResponse,
} from './my-journey.mapper';

// -----------------------------------------------------------------------------
// Public Journeys
// -----------------------------------------------------------------------------

export {
  mapPublicJourney,
  mapPublicJourneys,
  type PublicJourney,
  type PublicJourneyApiResponse,
  type PublicJourneyProviderApiResponse,
} from './public-journey.mapper';