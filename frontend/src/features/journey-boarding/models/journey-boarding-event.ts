// src/domains/journey-boarding/models/journey-boarding-event.ts

// ============================================================
// sisiMove — Journey Boarding Event
// ============================================================
//
// Frontend representation of a historical Journey Boarding event.
//
// Backend source:
// - JourneyBoardingEventEntity
// - JourneyBoardingEventResponse
//
// Events belong to the JourneyBoardingAggregate's historical
// event collection. They describe what happened; they are not
// the source of current boarding state.
//
// The backend REST mapper converts domain value objects into
// primitive values before returning the response.
//
// HTTP date values are represented as ISO date-time strings on
// the frontend.
//
// IMPORTANT:
// - Events are immutable historical records from the frontend's
//   perspective.
// - Do not use events as a replacement for current aggregate
//   status or participant status.
// - Do not invent event metadata fields.
// ============================================================

import type { JourneyBoardingEventType } from './journey-boarding-event-type';

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

/**
 * REST representation of a historical Journey Boarding event.
 *
 * Corresponds to the backend `JourneyBoardingEventResponse`.
 */
export interface JourneyBoardingEvent {
  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identifier of the historical event.
   */
  publicId: string;

  /**
   * Public identifier of the Journey Boarding aggregate to which
   * this event belongs.
   */
  boardingId: string;

  // ===========================================================================
  // Event
  // ===========================================================================

  /**
   * Type of domain event that occurred.
   */
  type: JourneyBoardingEventType;

  /**
   * Public identifier of the member associated with the event,
   * when applicable.
   */
  memberPublicId?: string;

  /**
   * Public identifier of the Journey Booking associated with the
   * event, when applicable.
   */
  bookingPublicId?: string;

  /**
   * Public identifier of the actor responsible for the event,
   * when applicable.
   */
  actorPublicId?: string;

  /**
   * Timestamp at which the event occurred.
   */
  occurredAt: string;

  /**
   * Event-specific metadata.
   *
   * The backend deliberately exposes metadata as a generic record
   * because its structure varies by event type.
   */
  metadata?: Record<string, unknown>;

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Timestamp at which the historical event record was created.
   */
  createdAt: string;
}