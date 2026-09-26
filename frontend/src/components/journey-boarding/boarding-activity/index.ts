// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Activity Barrel
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Provide the public export surface for Journey Boarding activity components.
// - Keep consumers independent from individual activity file locations.
//
// Architectural rules:
// - No business logic belongs in this barrel.
// - No presentation logic belongs here.
// - Activity components remain responsible for rendering event history.
// -----------------------------------------------------------------------------

export {
  JourneyBoardingActivity,
  type JourneyBoardingActivityProps,
} from './journey-boarding-activity';

export {
  JourneyBoardingEventItem,
  type JourneyBoardingEventItemProps,
} from './journey-boarding-event-item';