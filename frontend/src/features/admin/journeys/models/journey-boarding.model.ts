
/**
 * sisiMove — Journey Boarding Model
 *
 * Frontend types for the Journey Boarding API response.
 *
 * A boarding record tracks the boarding lifecycle, participants,
 * and recorded boarding events for a journey.
 *
 * Mapping the backend journey identifier to a public journey ID
 * is the responsibility of the response mapper, not this model.
 */

// -----------------------------------------------------------------------------
// Boarding status and event types
// -----------------------------------------------------------------------------

export type JourneyBoardingStatus = string;

export type JourneyBoardingParticipantRole = string;

export type JourneyBoardingParticipantStatus = string;

export type JourneyBoardingEventType = string;

// -----------------------------------------------------------------------------
// Boarding participant
// -----------------------------------------------------------------------------

export interface JourneyBoardingParticipant {
  publicId: string;
  boardingId: string;
  memberPublicId: string;
  bookingPublicId?: string | null;

  role: JourneyBoardingParticipantRole;
  status: JourneyBoardingParticipantStatus;

  expectedAt: string | null;
  boardedAt: string | null;
  withdrawnAt: string | null;
  noShowAt: string | null;
  removedAt: string | null;

  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Boarding event
// -----------------------------------------------------------------------------

export interface JourneyBoardingEvent {
  publicId: string;
  boardingId: string;
  type: JourneyBoardingEventType;

  memberPublicId?: string | null;
  bookingPublicId?: string | null;
  actorPublicId?: string | null;

  occurredAt: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

// -----------------------------------------------------------------------------
// Journey boarding
// -----------------------------------------------------------------------------

export interface JourneyBoarding {
  publicId: string;

  /**
   * Journey public identifier resolved by the backend mapper.
   */
  journeyId: string;

  providerPublicId: string;
  status: JourneyBoardingStatus;

  boardingStartedAt: string | null;
  journeyStartedAt: string | null;
  cancelledAt: string | null;

  version: number;

  participants: JourneyBoardingParticipant[];
  events: JourneyBoardingEvent[];

  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// API response aliases
// -----------------------------------------------------------------------------

export type JourneyBoardingResponseModel = JourneyBoarding;
