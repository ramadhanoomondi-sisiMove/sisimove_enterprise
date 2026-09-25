// -----------------------------------------------------------------------------
// sisiMove — Journey Schedule API Barrel
// -----------------------------------------------------------------------------
//
// Public barrel export for Journey schedule API adapters.
//
// Schedule capabilities exposed by the frozen Journey controller:
//
//   GET    /journeys/:journeyPublicId/schedule
//   POST   /journeys/:journeyPublicId/schedule
//   DELETE /journeys/:journeyPublicId/schedule
//
// IMPORTANT:
//
// The Journey controller does NOT create schedule details.
//
// The POST operation only attaches an existing schedule using:
//
//   {
//     schedulePublicId: string
//   }
//
// Schedule creation and management therefore remain outside this Journey API
// surface.
//
// All adapters use the authenticated API client because these are protected
// Journey management operations.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Get schedule
// -----------------------------------------------------------------------------

export {
  getJourneySchedule,
} from './get-journey-schedule.api';

// -----------------------------------------------------------------------------
// Attach schedule
// -----------------------------------------------------------------------------

export {
  attachJourneySchedule,
  type AttachJourneyScheduleRequest,
} from './attach-journey-schedule.api';

// -----------------------------------------------------------------------------
// Remove schedule
// -----------------------------------------------------------------------------

export {
  removeJourneySchedule,
} from './remove-journey-schedule.api';