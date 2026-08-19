// src/domains/journey-boarding/journey-boarding.module.ts

import { Module } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Domain Dependencies
// -----------------------------------------------------------------------------

import { IdentityModule } from '../identity/identity.module';

// -----------------------------------------------------------------------------
// Infrastructure
// -----------------------------------------------------------------------------

import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';

// -----------------------------------------------------------------------------
// Presentation
// -----------------------------------------------------------------------------

import { JourneyBoardingController } from './presentation/rest/controllers/journey-boarding.controller';

// -----------------------------------------------------------------------------
// Infrastructure — Dependency Injection
// -----------------------------------------------------------------------------

import { JOURNEY_BOARDING_PROVIDERS } from './infrastructure/dependency-injection/journey-boarding.providers';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_BOARDING_TOKENS } from './application/journey-boarding.tokens';

// -----------------------------------------------------------------------------
// Application — Command Handlers
// -----------------------------------------------------------------------------

import {
  BoardPassengerHandler,
  BoardProviderHandler,
  CancelJourneyBoardingHandler,
  CreateJourneyBoardingHandler,
  MarkPassengerNoShowHandler,
  OpenJourneyBoardingHandler,
  RemoveParticipantHandler,
  StartJourneyHandler,
  WithdrawParticipantHandler,
} from './application/command-handlers';

// -----------------------------------------------------------------------------
// Application — Query Handlers
// -----------------------------------------------------------------------------

import {
  GetJourneyBoardingHandler,
  GetJourneyBoardingByJourneyHandler,
  GetJourneyBoardingParticipantsHandler,
  ListJourneyBoardingsHandler,
} from './application/query-handlers';

// -----------------------------------------------------------------------------
// Module
// -----------------------------------------------------------------------------

@Module({
  // ===========================================================================
  // Imports
  // ===========================================================================

  imports: [
    // -------------------------------------------------------------------------
    // Identity
    //
    // Provides authentication and authorization infrastructure required by the
    // Journey Boarding REST presentation boundary.
    // -------------------------------------------------------------------------

    IdentityModule,

    // -------------------------------------------------------------------------
    // Prisma
    //
    // Provides the Prisma client required by Journey Boarding persistence.
    // -------------------------------------------------------------------------

    PrismaModule,
  ],

  // ===========================================================================
  // Controllers
  // ===========================================================================

  controllers: [JourneyBoardingController],

  // ===========================================================================
  // Providers
  // ===========================================================================

  providers: [
    // -------------------------------------------------------------------------
    // Infrastructure
    // -------------------------------------------------------------------------

    ...JOURNEY_BOARDING_PROVIDERS,

    // =========================================================================
    // Journey Boarding Lifecycle Command Handlers
    // =========================================================================

    {
      provide: JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.CREATE,
      useClass: CreateJourneyBoardingHandler,
    },

    {
      provide: JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.OPEN,
      useClass: OpenJourneyBoardingHandler,
    },

    {
      provide: JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.START_JOURNEY,
      useClass: StartJourneyHandler,
    },

    {
      provide: JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.CANCEL,
      useClass: CancelJourneyBoardingHandler,
    },

    // =========================================================================
    // Provider Boarding
    // =========================================================================

    {
      provide: JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.BOARD_PROVIDER,
      useClass: BoardProviderHandler,
    },

    // =========================================================================
    // Passenger Boarding
    // =========================================================================

    {
      provide: JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.BOARD_PASSENGER,
      useClass: BoardPassengerHandler,
    },

    {
      provide: JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.MARK_PASSENGER_NO_SHOW,
      useClass: MarkPassengerNoShowHandler,
    },

    // =========================================================================
    // Participant Lifecycle
    // =========================================================================

    {
      provide: JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.WITHDRAW_PARTICIPANT,
      useClass: WithdrawParticipantHandler,
    },

    {
      provide: JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.REMOVE_PARTICIPANT,
      useClass: RemoveParticipantHandler,
    },

    // =========================================================================
    // Journey Boarding Query Handlers
    // =========================================================================

    {
      provide: JOURNEY_BOARDING_TOKENS.QUERY_HANDLERS.GET,
      useClass: GetJourneyBoardingHandler,
    },

    {
      provide: JOURNEY_BOARDING_TOKENS.QUERY_HANDLERS.GET_BY_JOURNEY,
      useClass: GetJourneyBoardingByJourneyHandler,
    },

    {
      provide: JOURNEY_BOARDING_TOKENS.QUERY_HANDLERS.LIST,
      useClass: ListJourneyBoardingsHandler,
    },

    // =========================================================================
    // Participant Query Handlers
    // =========================================================================

    {
      provide: JOURNEY_BOARDING_TOKENS.QUERY_HANDLERS.GET_PARTICIPANTS,
      useClass: GetJourneyBoardingParticipantsHandler,
    },
  ],

  // ===========================================================================
  // Exports
  // ===========================================================================
  //
  // Keep the module boundary narrow.
  //
  // Command and query handlers are consumed internally by the controller and
  // therefore remain private to this module.
  //
  // The repository token is exported so other bounded contexts can integrate
  // with Journey Boarding through its application contract rather than directly
  // depending on Prisma persistence.
  // ===========================================================================

  exports: [JOURNEY_BOARDING_TOKENS.REPOSITORY],
})
export class JourneyBoardingModule {}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JourneyBoardingModule;
