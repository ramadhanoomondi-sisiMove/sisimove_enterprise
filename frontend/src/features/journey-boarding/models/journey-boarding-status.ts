// src/domains/journey-boarding/models/journey-boarding-status.ts

// ============================================================
// sisiMove — Journey Boarding Status
// ============================================================
//
// Frontend representation of the backend JourneyBoardingStatus
// domain enum.
//
// Responsibilities:
// - Represent the lifecycle state of a Journey Boarding.
// - Provide a stable frontend type for API responses and UI
//   logic.
//
// Backend lifecycle:
//
//   NOT_STARTED → BOARDING → STARTED
//
//                         ↘ CANCELLED
//
// The frontend intentionally mirrors the backend enum exactly.
//
// IMPORTANT:
// - Do not add UI-specific states here.
// - Do not add derived states such as "READY", "COMPLETED",
//   "IN_PROGRESS", etc.
// - Do not encode aggregate capabilities such as canOpen(),
//   canStart(), or canCancel() here.
//
// Those rules belong to the backend JourneyBoardingAggregate.
// ============================================================

/**
 * Journey Boarding lifecycle status.
 *
 * Represents the current operational state of a Journey Boarding
 * aggregate as exposed by the REST API.
 */
export enum JourneyBoardingStatus {
  /**
   * Boarding has not yet been opened.
   *
   * This is the initial lifecycle state.
   */
  NOT_STARTED = 'NOT_STARTED',

  /**
   * Boarding is currently open.
   *
   * Provider and passenger boarding operations may be performed
   * according to the backend aggregate rules.
   */
  BOARDING = 'BOARDING',

  /**
   * The physical Journey has started.
   *
   * This is a terminal successful lifecycle state for boarding.
   */
  STARTED = 'STARTED',

  /**
   * Boarding was cancelled.
   *
   * This is a terminal cancellation state.
   */
  CANCELLED = 'CANCELLED',
}