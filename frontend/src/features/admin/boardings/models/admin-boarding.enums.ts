
/**
 * sisiMove — Admin Boarding Enums
 *
 * Path:
 * src/features/admin/boardings/models/admin-boarding.enums.ts
 *
 * These enums mirror the Journey Boarding domain lifecycle.
 * Keep values aligned with the backend API.
 */

// -----------------------------------------------------------------------------
// Boarding Lifecycle
// -----------------------------------------------------------------------------

export enum AdminBoardingStatus {
  NOT_STARTED = 'NOT_STARTED',
  BOARDING = 'BOARDING',
  STARTED = 'STARTED',
  CANCELLED = 'CANCELLED',
}

// -----------------------------------------------------------------------------
// Participant Role
// -----------------------------------------------------------------------------

export enum AdminBoardingParticipantRole {
  PROVIDER = 'PROVIDER',
  PASSENGER = 'PASSENGER',
}

// -----------------------------------------------------------------------------
// Participant Lifecycle
// -----------------------------------------------------------------------------

export enum AdminBoardingParticipantStatus {
  EXPECTED = 'EXPECTED',
  BOARDED = 'BOARDED',
  WITHDRAWN = 'WITHDRAWN',
  NO_SHOW = 'NO_SHOW',
  REMOVED = 'REMOVED',
}

// -----------------------------------------------------------------------------
// Boarding Event Types
// -----------------------------------------------------------------------------

export enum AdminBoardingEventType {
  BOARDING_OPENED = 'BOARDING_OPENED',
  PROVIDER_BOARDED = 'PROVIDER_BOARDED',
  PASSENGER_BOARDED = 'PASSENGER_BOARDED',
  PASSENGER_NO_SHOW = 'PASSENGER_NO_SHOW',
  BOARDING_WITHDRAWN = 'BOARDING_WITHDRAWN',
  PARTICIPANT_REMOVED = 'PARTICIPANT_REMOVED',
  JOURNEY_STARTED = 'JOURNEY_STARTED',
  BOARDING_CANCELLED = 'BOARDING_CANCELLED',
}
