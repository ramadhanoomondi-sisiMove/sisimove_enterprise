// src/domains/journey-boarding/models/journey-boarding-participant-role.ts

// ============================================================
// sisiMove — Journey Boarding Participant Role
// ============================================================
//
// Frontend representation of the backend
// JourneyBoardingParticipantRole domain enum.
//
// Responsibilities:
// - Represent the operational role of a participant within a
//   Journey Boarding.
// - Provide a stable frontend type for API responses and UI
//   logic.
//
// Backend roles:
//
//   PROVIDER
//   PASSENGER
//
// The frontend intentionally mirrors the backend enum exactly.
//
// IMPORTANT:
// - Do not introduce UI-only roles.
// - Do not infer permissions from the role.
// - Do not encode boarding capabilities here.
//
// Authorization and aggregate business rules remain backend
// responsibilities.
// ============================================================

/**
 * Role of a participant within a Journey Boarding.
 *
 * A Journey Boarding participant is either the Journey provider
 * or a passenger participating in the Journey.
 */
export enum JourneyBoardingParticipantRole {
  /**
   * The Journey provider.
   *
   * The provider is the participant responsible for operating
   * the Journey.
   */
  PROVIDER = 'PROVIDER',

  /**
   * A passenger participating in the Journey.
   *
   * Passenger participants are associated with a Journey Booking
   * in the backend domain.
   */
  PASSENGER = 'PASSENGER',
}