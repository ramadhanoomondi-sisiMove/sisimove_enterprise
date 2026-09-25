//src/features/journey/hooks/queries/indec.ts
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Public Discovery
// -----------------------------------------------------------------------------

export {
  usePublicJourneys,
  PUBLIC_JOURNEYS_QUERY_KEY,
} from './use-public-journeys';

export {
  useSearchPublishedJourneys,
  SEARCH_PUBLISHED_JOURNEYS_QUERY_KEY,
} from './use-search-published-journeys';

export {
  useJourney,
  JOURNEY_QUERY_KEY,
  type UseJourneyOptions,
} from './use-journey';

// -----------------------------------------------------------------------------
// Authenticated Management
// -----------------------------------------------------------------------------

export {
  useMyJourneys,
  MY_JOURNEYS_QUERY_KEY,
} from './use-my-journeys';

export {
  useJourneysByProvider,
  JOURNEYS_BY_PROVIDER_QUERY_KEY,
} from './use-journeys-by-provider';

export {
  useJourneysByProviderStatus,
  JOURNEYS_BY_PROVIDER_STATUS_QUERY_KEY,
} from './use-journeys-by-provider-status';

// -----------------------------------------------------------------------------
// Journey Components
// -----------------------------------------------------------------------------

export {
  useJourneyCorridor,
  JOURNEY_CORRIDOR_QUERY_KEY,
} from './use-journey-corridor';

export {
  useJourneyWaypoints,
  JOURNEY_WAYPOINTS_QUERY_KEY,
} from './use-journey-waypoints';

export {
  useJourneyWaypoint,
  JOURNEY_WAYPOINT_QUERY_KEY,
} from './use-journey-waypoint';

export {
  useJourneySchedule,
  JOURNEY_SCHEDULE_QUERY_KEY,
} from './use-journey-schedule';

export {
  useJourneyVehicle,
  JOURNEY_VEHICLE_QUERY_KEY,
} from './use-journey-vehicle';

export {
  useJourneyCapacity,
  JOURNEY_CAPACITY_QUERY_KEY,
} from './use-journey-capacity';

export {
  useJourneyPricing,
  JOURNEY_PRICING_QUERY_KEY,
} from './use-journey-pricing';

export {
  useJourneyPreferences,
  JOURNEY_PREFERENCES_QUERY_KEY,
} from './use-journey-preferences';

export {
  useJourneyAssets,
  JOURNEY_ASSETS_QUERY_KEY,
} from './use-journey-assets';