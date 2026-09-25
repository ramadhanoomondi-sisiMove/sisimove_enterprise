// src/features/journey/hooks/mutations/index.ts


// -----------------------------------------------------------------------------
// Journey creation
// -----------------------------------------------------------------------------

export {
  useCreateJourney,
} from './use-create-journey';

// -----------------------------------------------------------------------------
// Journey lifecycle
// -----------------------------------------------------------------------------

export {
  usePublishJourney,
  type PublishJourneyVariables,
} from './use-publish-journey';

export {
  useStartJourney,
  type StartJourneyVariables,
} from './use-start-journey';

export {
  useCompleteJourney,
  type CompleteJourneyVariables,
} from './use-complete-journey';

export {
  useCancelJourney,
  type CancelJourneyVariables,
} from './use-cancel-journey';

export {
  useExpireJourney,
  type ExpireJourneyVariables,
} from './use-expire-journey';

// -----------------------------------------------------------------------------
// Corridor
// -----------------------------------------------------------------------------

export {
  useAttachJourneyCorridor,
  type AttachJourneyCorridorVariables,
} from './use-attach-journey-corridor';

export {
  useRemoveJourneyCorridor,
  type RemoveJourneyCorridorVariables,
} from './use-remove-journey-corridor';


export {
  useAddJourneyWaypoint,
  type AddJourneyWaypointVariables,
} from './use-add-journey-waypoint';

export {
  useRemoveJourneyWaypoint,
  type RemoveJourneyWaypointVariables,
} from './use-remove-journey-waypoint';

// -----------------------------------------------------------------------------
// Schedule
// -----------------------------------------------------------------------------

export {
  useAttachJourneySchedule,
  type AttachJourneyScheduleVariables,
} from './use-attach-journey-schedule';

export {
  useRemoveJourneySchedule,
  type RemoveJourneyScheduleVariables,
} from './use-remove-journey-schedule';

// -----------------------------------------------------------------------------
// Vehicle
// -----------------------------------------------------------------------------

export {
  useAttachJourneyVehicle,
  type AttachJourneyVehicleVariables,
} from './use-attach-journey-vehicle';

export {
  useRemoveJourneyVehicle,
  type RemoveJourneyVehicleVariables,
} from './use-remove-journey-vehicle';

// -----------------------------------------------------------------------------
// Capacity
// -----------------------------------------------------------------------------

export {
  useAttachJourneyCapacity,
  type AttachJourneyCapacityVariables,
} from './use-attach-journey-capacity';

export {
  useRemoveJourneyCapacity,
  type RemoveJourneyCapacityVariables,
} from './use-remove-journey-capacity';

// -----------------------------------------------------------------------------
// Pricing
// -----------------------------------------------------------------------------

export {
  useAttachJourneyPricing,
  type AttachJourneyPricingVariables,
} from './use-attach-journey-pricing';

export {
  useRemoveJourneyPricing,
  type RemoveJourneyPricingVariables,
} from './use-remove-journey-pricing';

// -----------------------------------------------------------------------------
// Preferences
// -----------------------------------------------------------------------------

export {
  useAttachJourneyPreferences,
  type AttachJourneyPreferencesVariables,
} from './use-attach-journey-preferences';

export {
  useRemoveJourneyPreferences,
  type RemoveJourneyPreferencesVariables,
} from './use-remove-journey-preferences';

// -----------------------------------------------------------------------------
// Assets
// -----------------------------------------------------------------------------
//
// Journey asset mutations attach/remove an existing Asset reference.
// They do NOT upload or delete the underlying Asset.

export {
  useAttachJourneyAsset,
  type AttachJourneyAssetVariables,
} from './use-attach-journey-asset';

export {
  useRemoveJourneyAsset,
  type RemoveJourneyAssetVariables,
} from './use-remove-journey-asset';