// src/domains/journey-boarding/models/journey-boarding.ts

// ============================================================
// sisiMove — Journey Boarding
// ============================================================
//
// Frontend representation of the Journey Boarding REST response.
//
// Backend source:
// - JourneyBoardingAggregate
// - JourneyBoardingResponse
//
// The backend response mapper confirms that a complete Journey
// Boarding response contains:
//
//   JourneyBoarding
//   ├── participants
//   └── events
//
// Domain value objects are converted to primitives at the REST
// boundary.
//
// HTTP date values are represented as ISO date-time strings on
// the frontend.
//
// IMPORTANT:
// - This is an API/domain model for frontend consumption.
// - It does not recreate the backend aggregate.
// - It does not implement aggregate lifecycle methods.
// - It does not calculate backend capabilities such as
//   canOpen(), canStart(), canCancel(), or canModify().
// - The backend aggregate remains authoritative for all domain
//   decisions.
// ============================================================

import type { JourneyBoardingEvent } from './journey-boarding-event';

import type { JourneyBoardingParticipant } from './journey-boarding-participant';

import type { JourneyBoardingStatus } from './journey-boarding-status';

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

/**
 * REST representation of a Journey Boarding aggregate.
 *
 * Corresponds to the backend `JourneyBoardingResponse`.
 */
export interface JourneyBoarding {
  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identifier of the Journey Boarding.
   */
  publicId: string;

  /**
   * Public identifier of the Journey associated with this boarding.
   *
   * The backend domain calls this `journeyId`, and the REST mapper
   * exposes the value of that value object as a string.
   */
  journeyId: string;

  /**
   * Public identifier of the Journey provider.
   */
  providerPublicId: string;

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  /**
   * Current Journey Boarding lifecycle status.
   */
  status: JourneyBoardingStatus;

  /**
   * Timestamp at which boarding was opened.
   *
   * Undefined when boarding has not been opened.
   */
  boardingStartedAt?: string;

  /**
   * Timestamp at which the physical Journey was started.
   *
   * Undefined until the Journey has started.
   */
  journeyStartedAt?: string;

  /**
   * Timestamp at which boarding was cancelled.
   *
   * Undefined when boarding has not been cancelled.
   */
  cancelledAt?: string;

  /**
   * Optimistic concurrency version of the backend aggregate.
   *
   * The frontend preserves this value as supplied by the API.
   * Concurrency decisions remain a backend responsibility.
   */
  version: number;

  // ===========================================================================
  // Participants
  // ===========================================================================

  /**
   * Participants owned by the Journey Boarding aggregate.
   *
   * This collection contains the provider and passenger
   * participants returned by the backend response mapper.
   */
  participants: JourneyBoardingParticipant[];

  // ===========================================================================
  // Events
  // ===========================================================================

  /**
   * Historical events owned by the Journey Boarding aggregate.
   *
   * Events describe what happened during boarding and must not
   * be treated as mutable current state.
   */
  events: JourneyBoardingEvent[];

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Timestamp at which the Journey Boarding was created.
   */
  createdAt: string;

  /**
   * Timestamp at which the Journey Boarding was last updated.
   */
  updatedAt: string;
}