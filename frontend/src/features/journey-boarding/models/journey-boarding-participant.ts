// src/domains/journey-boarding/models/journey-boarding-participant.ts

// ============================================================
// sisiMove — Journey Boarding Participant
// ============================================================
//
// Frontend representation of the JourneyBoardingParticipant REST
// response.
//
// Backend source:
// - JourneyBoardingParticipantEntity
// - JourneyBoardingParticipantResponse
//
// The backend REST mapper converts domain value objects into
// primitive values before returning the response.
//
// HTTP date values are represented as ISO date-time strings on
// the frontend.
//
// IMPORTANT:
// - This model represents API data only.
// - It does not contain participant transition methods.
// - It does not determine which actions are permitted.
// - It does not load Traveller, Trust, or Booking projections.
//
// Participant lifecycle rules remain authoritative in the
// JourneyBoardingAggregate.
// ============================================================

import type { JourneyBoardingParticipantRole } from './journey-boarding-participant-role';

import type { JourneyBoardingParticipantStatus } from './journey-boarding-participant-status';

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

/**
 * REST representation of a Journey Boarding participant.
 *
 * Corresponds to the backend `JourneyBoardingParticipantResponse`.
 */
export interface JourneyBoardingParticipant {
  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identifier of the boarding participant.
   */
  publicId: string;

  /**
   * Public identifier of the Journey Boarding aggregate that owns
   * this participant.
   */
  boardingId: string;

  /**
   * Public identifier of the member represented by this participant.
   */
  memberPublicId: string;

  /**
   * Public identifier of the associated Journey Booking.
   *
   * Provider participants do not have a booking, so this value is
   * absent for provider participants.
   */
  bookingPublicId?: string;

  // ===========================================================================
  // Boarding
  // ===========================================================================

  /**
   * Operational role of the participant.
   */
  role: JourneyBoardingParticipantRole;

  /**
   * Current boarding status of the participant.
   */
  status: JourneyBoardingParticipantStatus;

  /**
   * Expected boarding timestamp.
   */
  expectedAt: string;

  /**
   * Timestamp at which the participant boarded.
   *
   * Absent when the participant has not boarded.
   */
  boardedAt?: string;

  /**
   * Timestamp at which the participant withdrew.
   *
   * Absent when the participant has not withdrawn.
   */
  withdrawnAt?: string;

  /**
   * Timestamp at which the participant was recorded as a
   * no-show.
   *
   * Absent when the participant has not been recorded as a
   * no-show.
   */
  noShowAt?: string;

  /**
   * Timestamp at which the participant was removed.
   *
   * Absent when the participant has not been removed.
   */
  removedAt?: string;

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Timestamp at which the participant record was created.
   */
  createdAt: string;

  /**
   * Timestamp at which the participant record was last updated.
   */
  updatedAt: string;
}