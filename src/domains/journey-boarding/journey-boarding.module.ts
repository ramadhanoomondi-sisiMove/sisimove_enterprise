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
    // Provides identity-related dependencies required by the Journey Boarding
    // presentation and application layers.
    // -------------------------------------------------------------------------

    IdentityModule,

    // -------------------------------------------------------------------------
    // Prisma
    //
    // Provides the shared Prisma infrastructure used by the Journey Boarding
    // persistence providers.
    //
    // Repositories using PrismaTransactionContext must continue to use the
    // ambient transaction client when one is available. They must not open
    // independent transactions that bypass the caller's unit of work.
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
    // Infrastructure Providers
    //
    // Includes the Journey Boarding repository implementation and its
    // associated infrastructure dependencies.
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
  // Export the repository contract token, not the concrete Prisma repository.
  //
  // JourneyModule can import JourneyBoardingModule and inject the repository
  // through JOURNEY_BOARDING_TOKENS.REPOSITORY without depending directly on
  // Journey Boarding's persistence implementation.
  //
  // Command and query handlers remain private because the controller resolves
  // them within this module.
  // ===========================================================================

  exports: [
    JOURNEY_BOARDING_TOKENS.REPOSITORY,
    JOURNEY_BOARDING_TOKENS.QUERY_HANDLERS.GET_BY_JOURNEY,
  ],
})
export class JourneyBoardingModule {}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JourneyBoardingModule;
