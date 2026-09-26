// src/domains/journey-boarding/models/index.ts

// ============================================================
// sisiMove — Journey Boarding Models
// ============================================================
//
// Public barrel for the Journey Boarding frontend models.
//
// Responsibilities:
// - Provide a single import surface for Journey Boarding models.
// - Keep consumers independent from individual model file paths.
//
// This file contains no business logic and no model definitions.
// ============================================================

// -----------------------------------------------------------------------------
// Lifecycle
// -----------------------------------------------------------------------------

export { JourneyBoardingStatus } from './journey-boarding-status';

// -----------------------------------------------------------------------------
// Participants
// -----------------------------------------------------------------------------

export { JourneyBoardingParticipantRole } from './journey-boarding-participant-role';

export { JourneyBoardingParticipantStatus } from './journey-boarding-participant-status';

export type { JourneyBoardingParticipant } from './journey-boarding-participant';

// -----------------------------------------------------------------------------
// Events
// -----------------------------------------------------------------------------

export { JourneyBoardingEventType } from './journey-boarding-event-type';

export type { JourneyBoardingEvent } from './journey-boarding-event';

// -----------------------------------------------------------------------------
// Journey Boarding
// -----------------------------------------------------------------------------

export type { JourneyBoarding } from './journey-boarding';