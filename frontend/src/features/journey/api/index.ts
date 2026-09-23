// -----------------------------------------------------------------------------
// sisiMove — Journeys API Barrel
// -----------------------------------------------------------------------------
//
// Public API adapters exposed by the Journeys feature.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Journey lifecycle
// -----------------------------------------------------------------------------

export { createJourney } from './create-journey.api';

export { getJourney } from './get-journey.api';

export { getMyJourneys } from './get-my-journeys.api';

export {
  publishJourney,
} from './publish-journey.api';

export type {
  PublishJourneyInput,
} from './publish-journey.api';

// -----------------------------------------------------------------------------
// Corridor
// -----------------------------------------------------------------------------

export {
  attachJourneyCorridor,
} from './corridor/attach-journey-corridor.api';

export type {
  AttachJourneyCorridorInput,
} from './corridor/attach-journey-corridor.api';

export {
  getJourneyCorridor,
} from './corridor/get-journey-corridor.api';

// -----------------------------------------------------------------------------
// Waypoints
// -----------------------------------------------------------------------------

export {
  addJourneyWaypoint,
} from './waypoints/add-journey-waypoint.api';

export type {
  AddJourneyWaypointInput,
} from './waypoints/add-journey-waypoint.api';

export {
  getJourneyWaypoint,
} from './waypoints/get-journey-waypoint.api';

export {
  getJourneyWaypoints,
} from './waypoints/get-journey-waypoints.api';

export {
  removeJourneyWaypoint,
} from './waypoints/remove-journey-waypoint.api';

// -----------------------------------------------------------------------------
// Schedule
// -----------------------------------------------------------------------------

export {
  attachJourneySchedule,
} from './schedule/attach-journey-schedule.api';

export type {
  AttachJourneyScheduleInput,
} from './schedule/attach-journey-schedule.api';

export {
  getJourneySchedule,
} from './schedule/get-journey-schedule.api';

// -----------------------------------------------------------------------------
// Vehicle
// -----------------------------------------------------------------------------

export {
  attachJourneyVehicle,
} from './vehicle/attach-journey-vehicle.api';

export type {
  AttachJourneyVehicleInput,
} from './vehicle/attach-journey-vehicle.api';

export {
  getJourneyVehicle,
} from './vehicle/get-journey-vehicle.api';

// -----------------------------------------------------------------------------
// Capacity
// -----------------------------------------------------------------------------

export {
  attachJourneyCapacity,
} from './capacity/attach-journey-capacity.api';

export type {
  AttachJourneyCapacityInput,
} from './capacity/attach-journey-capacity.api';

export {
  getJourneyCapacity,
} from './capacity/get-journey-capacity.api';

// -----------------------------------------------------------------------------
// Pricing
// -----------------------------------------------------------------------------

export {
  attachJourneyPricing,
} from './pricing/attach-journey-pricing.api';

export type {
  AttachJourneyPricingInput,
} from './pricing/attach-journey-pricing.api';

export {
  getJourneyPricing,
} from './pricing/get-journey-pricing.api';

// -----------------------------------------------------------------------------
// Preferences
// -----------------------------------------------------------------------------

export {
  attachJourneyPreferences,
} from './preferences/attach-journey-preferences.api';

export type {
  AttachJourneyPreferencesInput,
} from './preferences/attach-journey-preferences.api';

export {
  getJourneyPreferences,
} from './preferences/get-journey-preferences.api';

// -----------------------------------------------------------------------------
// Assets
// -----------------------------------------------------------------------------

export {
  attachJourneyAsset,
} from './assets/attach-journey-asset.api';

export type {
  AttachJourneyAssetInput,
} from './assets/attach-journey-asset.api';

export {
  getJourneyAsset,
} from './assets/get-journey-asset.api';

export {
  getJourneyAssets,
} from './assets/get-journey-assets.api';

export {
  removeJourneyAsset,
} from './assets/remove-journey-asset.api';