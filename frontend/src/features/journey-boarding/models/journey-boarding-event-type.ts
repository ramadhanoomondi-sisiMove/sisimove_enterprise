// src/domains/journey-boarding/models/journey-boarding-event-type.ts

// ============================================================
// sisiMove — Journey Boarding Event Type
// ============================================================
//
// Frontend representation of the backend
// JourneyBoardingEventType domain enum.
//
// Responsibilities:
// - Represent historical events recorded by the Journey Boarding
//   aggregate.
// - Provide a stable frontend type for API responses and
//   activity/timeline rendering.
//
// Backend event types:
//
//   BOARDING_OPENED
//   PROVIDER_BOARDED
//   PASSENGER_BOARDED
//   PASSENGER_NO_SHOW
//   BOARDING_WITHDRAWN
//   PARTICIPANT_REMOVED
//   JOURNEY_STARTED
//   BOARDING_CANCELLED
//
// IMPORTANT:
// - Events are historical records.
// - Events must not be treated as current aggregate state.
// - Do not add UI-only event types.
// - Do not infer lifecycle transitions from this enum alone.
//
// The backend aggregate remains authoritative for current
// Journey Boarding state and valid operations.
// ============================================================

/**
 * Historical event type recorded during Journey Boarding.
 *
 * Each value represents an event that occurred within the
 * Journey Boarding aggregate.
 */
export enum JourneyBoardingEventType {
  /**
   * Boarding was opened.
   */
  BOARDING_OPENED = 'BOARDING_OPENED',

  /**
   * The Journey provider boarded.
   */
  PROVIDER_BOARDED = 'PROVIDER_BOARDED',

  /**
   * A passenger boarded.
   */
  PASSENGER_BOARDED = 'PASSENGER_BOARDED',

  /**
   * A passenger was recorded as a no-show.
   */
  PASSENGER_NO_SHOW = 'PASSENGER_NO_SHOW',

  /**
   * A participant withdrew from boarding.
   */
  BOARDING_WITHDRAWN = 'BOARDING_WITHDRAWN',

  /**
   * A participant was removed from boarding.
   */
  PARTICIPANT_REMOVED = 'PARTICIPANT_REMOVED',

  /**
   * The physical Journey was started.
   */
  JOURNEY_STARTED = 'JOURNEY_STARTED',

  /**
   * Journey Boarding was cancelled.
   */
  BOARDING_CANCELLED = 'BOARDING_CANCELLED',
}