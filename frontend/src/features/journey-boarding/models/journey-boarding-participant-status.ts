// src/domains/journey-boarding/models/journey-boarding-participant-status.ts

// ============================================================
// sisiMove — Journey Boarding Participant Status
// ============================================================
//
// Frontend representation of the backend
// JourneyBoardingParticipantStatus domain enum.
//
// Responsibilities:
// - Represent the operational state of an individual Journey
//   Boarding participant.
// - Provide a stable frontend type for API responses and UI
//   logic.
//
// Participant lifecycle:
//
//   EXPECTED
//      ├── BOARDED
//      ├── WITHDRAWN
//      ├── NO_SHOW
//      └── REMOVED
//
// These values describe the participant's boarding outcome.
//
// IMPORTANT:
// - Do not add UI-specific states.
// - Do not collapse distinct backend states into a generic
//   "INACTIVE" or "COMPLETED" state.
// - Do not encode transition rules here.
//
// Participant transition rules remain authoritative in the
// JourneyBoardingAggregate.
// ============================================================

/**
 * Operational status of a Journey Boarding participant.
 *
 * Represents the current boarding state of an individual
 * participant.
 */
export enum JourneyBoardingParticipantStatus {
  /**
   * The participant is expected to board.
   *
   * The participant has not yet reached a terminal boarding
   * outcome.
   */
  EXPECTED = 'EXPECTED',

  /**
   * The participant successfully boarded.
   */
  BOARDED = 'BOARDED',

  /**
   * The participant withdrew from boarding before boarding.
   */
  WITHDRAWN = 'WITHDRAWN',

  /**
   * The participant was recorded as a no-show.
   */
  NO_SHOW = 'NO_SHOW',

  /**
   * The participant was removed from the boarding process.
   */
  REMOVED = 'REMOVED',
}