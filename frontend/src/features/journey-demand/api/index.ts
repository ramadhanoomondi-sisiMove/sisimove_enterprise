// -----------------------------------------------------------------------------
// sisiMove — Journey Demand API
// -----------------------------------------------------------------------------
//
// Public API adapters for the Journey Demand feature.
//
// This barrel intentionally exports transport operations only.
// Models and schemas remain separate concerns.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Journey Demand
// -----------------------------------------------------------------------------

export {
  createJourneyDemand,
} from './create-journey-demand.api';

export {
  getJourneyDemands,
  type GetJourneyDemandsParams,
} from './get-journey-demands.api';

export {
  getJourneyDemand,
} from './get-journey-demand.api';

export {
  getMyJourneyDemands,
  type GetMyJourneyDemandsParams,
} from './get-my-journey-demands.api';

export {
  publishJourneyDemand,
  type PublishJourneyDemandInput,
} from './publish-journey-demand.api';

// -----------------------------------------------------------------------------
// Corridor
// -----------------------------------------------------------------------------

export {
  attachJourneyDemandCorridor,
} from './corridor/attach-journey-demand-corridor.api';

export {
  getJourneyDemandCorridor,
} from './corridor/get-journey-demand-corridor.api';

// -----------------------------------------------------------------------------
// Waypoints
// -----------------------------------------------------------------------------

export {
  addJourneyDemandWaypoint,
} from './waypoints/add-journey-demand-waypoint.api';

export {
  getJourneyDemandWaypoints,
} from './waypoints/get-journey-demand-waypoints.api';

export {
  updateJourneyDemandWaypoint,
  type UpdateJourneyDemandWaypointInput,
} from './waypoints/update-journey-demand-waypoint.api';

export {
  removeJourneyDemandWaypoint,
  type RemoveJourneyDemandWaypointInput,
} from './waypoints/remove-journey-demand-waypoint.api';

// -----------------------------------------------------------------------------
// Schedule
// -----------------------------------------------------------------------------

export {
  attachJourneyDemandSchedule,
} from './schedule/attach-journey-demand-schedule.api';

export {
  getJourneyDemandSchedule,
} from './schedule/get-journey-demand-schedule.api';

// -----------------------------------------------------------------------------
// Capacity
// -----------------------------------------------------------------------------

export {
  attachJourneyDemandCapacity,
} from './capacity/attach-journey-demand-capacity.api';

export {
  getJourneyDemandCapacity,
} from './capacity/get-journey-demand-capacity.api';

// -----------------------------------------------------------------------------
// Pricing
// -----------------------------------------------------------------------------

export {
  attachJourneyDemandPricing,
  type AttachJourneyDemandPricingInput,
} from './pricing/attach-journey-demand-pricing.api';

export {
  getJourneyDemandPricing,
} from './pricing/get-journey-demand-pricing.api';

// -----------------------------------------------------------------------------
// Participants
// -----------------------------------------------------------------------------

export {
  addJourneyDemandParticipant,
} from './participants/add-journey-demand-participant.api';

export {
  getJourneyDemandParticipant,
} from './participants/get-journey-demand-participant.api';

export {
  getJourneyDemandParticipants,
} from './participants/get-journey-demand-participants.api';

export {
  updateJourneyDemandParticipant,
  type UpdateJourneyDemandParticipantInput,
} from './participants/update-journey-demand-participant.api';

export {
  removeJourneyDemandParticipant,
  type RemoveJourneyDemandParticipantInput,
} from './participants/remove-journey-demand-participant.api';

export {
  withdrawJourneyDemandParticipant,
  type WithdrawJourneyDemandParticipantInput,
} from './participants/withdraw-journey-demand-participant.api';