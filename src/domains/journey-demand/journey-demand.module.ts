// src/domains/journey-demand/journey-demand.module.ts

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

import { JourneyDemandController } from './presentation/rest/controllers/journey-demand.controller';

// -----------------------------------------------------------------------------
// Infrastructure — Dependency Injection
// -----------------------------------------------------------------------------

import { JOURNEY_DEMAND_PROVIDERS } from './infrastructure/dependency-injection/journey-demand.providers';
// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_DEMAND_TOKENS } from './application/journey-demand.tokens';

// -----------------------------------------------------------------------------
// Application — Command Handlers
// -----------------------------------------------------------------------------

import {
  AddJourneyDemandParticipantHandler,
  AddJourneyDemandWaypointHandler,
  CancelJourneyDemandHandler,
  ConvertJourneyDemandHandler,
  CreateJourneyDemandHandler,
  ExpireJourneyDemandHandler,
  FulfillJourneyDemandHandler,
  MatchJourneyDemandHandler,
  PublishJourneyDemandHandler,
  RemoveJourneyDemandParticipantHandler,
  RemoveJourneyDemandWaypointHandler,
  UpdateJourneyDemandCapacityHandler,
  UpdateJourneyDemandCorridorHandler,
  UpdateJourneyDemandHandler,
  UpdateJourneyDemandParticipantHandler,
  UpdateJourneyDemandPricingHandler,
  UpdateJourneyDemandScheduleHandler,
  UpdateJourneyDemandWaypointHandler,
  WithdrawJourneyDemandParticipantHandler,
} from './application/handlers';

// -----------------------------------------------------------------------------
// Application — Query Handlers
// -----------------------------------------------------------------------------

import {
  FindJourneyDemandsByCorridorQueryHandler,
  FindJourneyDemandsByRequesterQueryHandler,
  FindJourneyDemandsByScheduleQueryHandler,
  FindMatchableJourneyDemandsQueryHandler,
  FindOpenJourneyDemandsQueryHandler,
  GetJourneyDemandByPublicIdQueryHandler,
  GetJourneyDemandCapacityQueryHandler,
  GetJourneyDemandCorridorQueryHandler,
  GetJourneyDemandParticipantQueryHandler,
  GetJourneyDemandParticipantsQueryHandler,
  GetJourneyDemandPricingQueryHandler,
  GetJourneyDemandQueryHandler,
  GetJourneyDemandsQueryHandler,
  GetJourneyDemandScheduleQueryHandler,
  GetJourneyDemandWaypointsQueryHandler,
  GetMyJourneyDemandsQueryHandler,
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
    // Provides identity/authorization infrastructure required by the
    // presentation boundary, including authentication and permission guards.
    // -------------------------------------------------------------------------

    IdentityModule,

    // -------------------------------------------------------------------------
    // Prisma
    //
    // Provides the Prisma client used by Journey Demand persistence.
    // -------------------------------------------------------------------------

    PrismaModule,
  ],

  // ===========================================================================
  // Controllers
  // ===========================================================================

  controllers: [JourneyDemandController],

  // ===========================================================================
  // Providers
  // ===========================================================================

  providers: [
    // -------------------------------------------------------------------------
    // Infrastructure
    // -------------------------------------------------------------------------

    ...JOURNEY_DEMAND_PROVIDERS,
    // =========================================================================
    // Lifecycle Command Handlers
    // =========================================================================

    {
      provide: JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.CREATE,
      useClass: CreateJourneyDemandHandler,
    },

    {
      provide: JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.UPDATE,
      useClass: UpdateJourneyDemandHandler,
    },

    {
      provide: JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.PUBLISH,
      useClass: PublishJourneyDemandHandler,
    },

    {
      provide: JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.MATCH,
      useClass: MatchJourneyDemandHandler,
    },

    {
      provide: JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.CONVERT,
      useClass: ConvertJourneyDemandHandler,
    },

    {
      provide: JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.FULFILL,
      useClass: FulfillJourneyDemandHandler,
    },

    {
      provide: JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.CANCEL,
      useClass: CancelJourneyDemandHandler,
    },

    {
      provide: JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.EXPIRE,
      useClass: ExpireJourneyDemandHandler,
    },

    // =========================================================================
    // Corridor Command Handlers
    // =========================================================================

    {
      provide: JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.UPDATE_CORRIDOR,
      useClass: UpdateJourneyDemandCorridorHandler,
    },

    // =========================================================================
    // Waypoint Command Handlers
    // =========================================================================

    {
      provide: JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.ADD_WAYPOINT,
      useClass: AddJourneyDemandWaypointHandler,
    },

    {
      provide: JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.UPDATE_WAYPOINT,
      useClass: UpdateJourneyDemandWaypointHandler,
    },

    {
      provide: JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.REMOVE_WAYPOINT,
      useClass: RemoveJourneyDemandWaypointHandler,
    },

    // =========================================================================
    // Schedule Command Handlers
    // =========================================================================

    {
      provide: JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.UPDATE_SCHEDULE,
      useClass: UpdateJourneyDemandScheduleHandler,
    },

    // =========================================================================
    // Capacity Command Handlers
    // =========================================================================

    {
      provide: JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.UPDATE_CAPACITY,
      useClass: UpdateJourneyDemandCapacityHandler,
    },

    // =========================================================================
    // Pricing Command Handlers
    // =========================================================================

    {
      provide: JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.UPDATE_PRICING,
      useClass: UpdateJourneyDemandPricingHandler,
    },

    // =========================================================================
    // Participant Command Handlers
    // =========================================================================

    {
      provide: JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.ADD_PARTICIPANT,
      useClass: AddJourneyDemandParticipantHandler,
    },

    {
      provide: JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.UPDATE_PARTICIPANT,
      useClass: UpdateJourneyDemandParticipantHandler,
    },

    {
      provide: JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.WITHDRAW_PARTICIPANT,
      useClass: WithdrawJourneyDemandParticipantHandler,
    },

    {
      provide: JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.REMOVE_PARTICIPANT,
      useClass: RemoveJourneyDemandParticipantHandler,
    },

    // =========================================================================
    // Core Query Handlers
    // =========================================================================

    {
      provide: JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET,
      useClass: GetJourneyDemandQueryHandler,
    },

    {
      provide: JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_BY_PUBLIC_ID,
      useClass: GetJourneyDemandByPublicIdQueryHandler,
    },

    {
      provide: JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_ALL,
      useClass: GetJourneyDemandsQueryHandler,
    },

    {
      provide: JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_MY,
      useClass: GetMyJourneyDemandsQueryHandler,
    },

    {
      provide: JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.FIND_OPEN,
      useClass: FindOpenJourneyDemandsQueryHandler,
    },

    {
      provide: JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.FIND_MATCHABLE,
      useClass: FindMatchableJourneyDemandsQueryHandler,
    },

    {
      provide: JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.FIND_BY_CORRIDOR,
      useClass: FindJourneyDemandsByCorridorQueryHandler,
    },

    {
      provide: JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.FIND_BY_SCHEDULE,
      useClass: FindJourneyDemandsByScheduleQueryHandler,
    },

    {
      provide: JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.FIND_BY_REQUESTER,
      useClass: FindJourneyDemandsByRequesterQueryHandler,
    },

    // =========================================================================
    // Corridor Query Handlers
    // =========================================================================

    {
      provide: JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_CORRIDOR,
      useClass: GetJourneyDemandCorridorQueryHandler,
    },

    // =========================================================================
    // Waypoint Query Handlers
    // =========================================================================

    {
      provide: JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_WAYPOINTS,
      useClass: GetJourneyDemandWaypointsQueryHandler,
    },

    // =========================================================================
    // Schedule Query Handlers
    // =========================================================================

    {
      provide: JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_SCHEDULE,
      useClass: GetJourneyDemandScheduleQueryHandler,
    },

    // =========================================================================
    // Capacity Query Handlers
    // =========================================================================

    {
      provide: JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_CAPACITY,
      useClass: GetJourneyDemandCapacityQueryHandler,
    },

    // =========================================================================
    // Pricing Query Handlers
    // =========================================================================

    {
      provide: JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_PRICING,
      useClass: GetJourneyDemandPricingQueryHandler,
    },

    // =========================================================================
    // Participant Query Handlers
    // =========================================================================

    {
      provide: JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_PARTICIPANT,
      useClass: GetJourneyDemandParticipantQueryHandler,
    },

    {
      provide: JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_PARTICIPANTS,
      useClass: GetJourneyDemandParticipantsQueryHandler,
    },
  ],

  // ===========================================================================
  // Exports
  // ===========================================================================
  //
  // Keep the module boundary narrow.
  //
  // Controllers consume their handlers internally, therefore command/query
  // handler tokens do not need to be exported.
  //
  // The repository token is exported because other bounded contexts may need
  // to integrate with Journey Demand through its application contract rather
  // than directly depending on Prisma persistence.
  // ===========================================================================

  exports: [JOURNEY_DEMAND_TOKENS.REPOSITORY],
})
export class JourneyDemandModule {}
