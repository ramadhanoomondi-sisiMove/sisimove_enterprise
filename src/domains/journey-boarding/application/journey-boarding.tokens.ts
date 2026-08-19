// src/domains/journey-boarding/application/journey-boarding.tokens.ts

// -----------------------------------------------------------------------------
// Journey Boarding — Dependency Injection Tokens
// -----------------------------------------------------------------------------
//
// Centralized dependency-injection tokens for the Journey Boarding bounded
// context.
//
// Responsibilities:
// - Repository binding
// - Command handler bindings
// - Query handler bindings
//
// The tokens are intentionally independent of Prisma, NestJS, or any concrete
// infrastructure implementation.
// -----------------------------------------------------------------------------

export const JOURNEY_BOARDING_TOKENS = {
  // ===========================================================================
  // Repository
  // ===========================================================================

  REPOSITORY: Symbol('JourneyBoardingRepository'),

  // ===========================================================================
  // Command Handlers
  // ===========================================================================

  COMMAND_HANDLERS: {
    // -------------------------------------------------------------------------
    // Journey Boarding Lifecycle
    // -------------------------------------------------------------------------

    CREATE: Symbol('CreateJourneyBoardingHandler'),

    OPEN: Symbol('OpenJourneyBoardingHandler'),

    START_JOURNEY: Symbol('StartJourneyHandler'),

    CANCEL: Symbol('CancelJourneyBoardingHandler'),

    // -------------------------------------------------------------------------
    // Provider Boarding
    // -------------------------------------------------------------------------

    BOARD_PROVIDER: Symbol('BoardProviderHandler'),

    // -------------------------------------------------------------------------
    // Passenger Boarding
    // -------------------------------------------------------------------------

    BOARD_PASSENGER: Symbol('BoardPassengerHandler'),

    MARK_PASSENGER_NO_SHOW: Symbol('MarkPassengerNoShowHandler'),

    // -------------------------------------------------------------------------
    // Participant Lifecycle
    // -------------------------------------------------------------------------

    WITHDRAW_PARTICIPANT: Symbol('WithdrawParticipantHandler'),

    REMOVE_PARTICIPANT: Symbol('RemoveParticipantHandler'),
  },

  // ===========================================================================
  // Query Handlers
  // ===========================================================================

  QUERY_HANDLERS: {
    // -------------------------------------------------------------------------
    // Journey Boarding
    // -------------------------------------------------------------------------

    GET: Symbol('GetJourneyBoardingQueryHandler'),

    GET_BY_JOURNEY: Symbol('GetJourneyBoardingByJourneyQueryHandler'),

    LIST: Symbol('ListJourneyBoardingsQueryHandler'),

    // -------------------------------------------------------------------------
    // Participants
    // -------------------------------------------------------------------------

    GET_PARTICIPANTS: Symbol('GetJourneyBoardingParticipantsQueryHandler'),
  },
} as const;
