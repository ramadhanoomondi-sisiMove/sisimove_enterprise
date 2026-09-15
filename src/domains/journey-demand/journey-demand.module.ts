// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Module
// -----------------------------------------------------------------------------
//
// The Journey Demand bounded context owns:
//
// - Journey Demand creation and lifecycle;
// - Journey Demand-owned components;
// - Journey Demand persistence;
// - Journey Demand commands and queries;
// - the public Journey Demand marketplace read boundary.
//
// The public Journey Demand read boundary may compose Journey Demand-owned
// data with reduced public projections from other bounded contexts.
//
// Those projections are consumed through exported application capabilities.
// Journey Demand does not own, persist, or reconstruct Traveller Profile or
// Trust Profile data.
//
// -----------------------------------------------------------------------------
//
// PUBLIC MARKETPLACE READ COMPOSITION
//
// A public Journey Demand contains an opaque requesterPublicId.
//
// That identifier is a cross-domain reference to the member/traveller
// associated with the Demand. It is deliberately not a Prisma relation and
// does not make Traveller Profile or Trust Profile part of the Journey Demand
// aggregate.
//
// The public Journey Demand query composes:
//
//     Journey Demand
//          │
//          ├── requesterPublicId
//          │        │
//          │        ├──► Traveller public read capability
//          │        │
//          │        └──► Trust public read capability
//          │
//          ├── Journey Demand-owned public data
//          │
//          └── participants
//                   │
//                   ├── participant member reference
//                   │        │
//                   │        ├──► Traveller public read capability
//                   │        │
//                   │        └──► Trust public read capability
//                   │
//                   └── Journey Demand-owned participant data
//
// Therefore:
//
// - Journey Demand remains the owner of Demand creation;
// - Journey Demand remains the owner of Demand persistence;
// - Journey Demand remains the owner of Demand participants;
// - Traveller Profile remains owned by SocialModule;
// - Trust Profile remains owned by TrustModule;
// - the public Journey Demand queries are responsible only for read-side
//   composition.
//
// Journey Demand does NOT:
//
// - inject TravellerProfileRepository;
// - inject TrustProfileRepository;
// - query Traveller or Trust persistence directly;
// - construct TravellerProfileAggregate;
// - construct TrustProfileAggregate;
// - register Traveller or Trust query handlers locally.
//
// Instead, Journey Demand imports the modules that export the public
// application capabilities it consumes.
//
// -----------------------------------------------------------------------------
//
// PUBLIC JOURNEY DEMAND QUERY BOUNDARY
//
// Two public query handlers are registered:
//
// - GET_PUBLIC:
//     Retrieves one publicly discoverable Journey Demand by public ID.
//
// - GET_PUBLIC_MANY:
//     Retrieves the public Journey Demand marketplace collection.
//
// The collection query supports:
//
// - an empty query to retrieve all publicly discoverable demands;
// - optional origin filtering;
// - optional destination filtering;
// - optional departure-date filtering;
// - optional pagination.
//
// Both handlers return public read models rather than raw domain entities.
//
// -----------------------------------------------------------------------------
//
// MODULE DEPENDENCY DIRECTION
//
//     Journey Demand public read boundary
//              │
//              ├──────────────► SocialModule
//              │                    │
//              │                    └── public Traveller capability
//              │
//              └──────────────► TrustModule
//                                   │
//                                   └── public Trust capability
//
// These are application-level read dependencies, not domain ownership
// relationships.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
//
// The public Journey Demand response must not expose:
//
// - requesterPublicId;
// - participant memberPublicId;
// - internal database identifiers;
// - aggregate version;
// - persistence timestamps;
// - private Journey Demand state.
//
// The public query handlers are responsible for projecting the Demand into
// its public marketplace representation.
//
// -----------------------------------------------------------------------------
//
// PUBLIC VISIBILITY
//
// Anonymous public discovery is governed by the Journey Demand repository's
// public visibility rules. The public collection and public detail handlers
// must not bypass those rules by using generic internal queries.
//
// -----------------------------------------------------------------------------
//
// MODULE RESPONSIBILITY
//
// This module:
//
// - registers Journey Demand infrastructure;
// - registers Journey Demand command handlers;
// - registers Journey Demand query handlers;
// - imports the public Traveller and Trust application capabilities;
// - exposes only the Journey Demand repository token.
//
// It does not re-export Traveller or Trust capabilities.
//
// -----------------------------------------------------------------------------

import { Module } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Domain Dependencies
// -----------------------------------------------------------------------------

import { IdentityModule } from '../identity/identity.module';
import { SocialModule } from '../social/social.module';
import { TrustModule } from '../trust/trust.module';

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
  GetPublicJourneyDemandQueryHandler,
  GetPublicJourneyDemandsQueryHandler,
} from './application/query-handlers';

// -----------------------------------------------------------------------------
// Module
// -----------------------------------------------------------------------------

@Module({
  // ===========================================================================
  // Imports
  // ===========================================================================

  imports: [
    // =========================================================================
    // Identity / Authorization
    // =========================================================================
    //
    // Provides identity and authorization infrastructure required by the
    // presentation boundary, including authentication and permission guards.
    //
    // Journey Demand consumes Identity application capabilities but does not
    // own Identity.
    // =========================================================================

    IdentityModule,

    // =========================================================================
    // Social / Traveller Profile Public Read Boundary
    // =========================================================================
    //
    // SocialModule owns Traveller Profile.
    //
    // The public Journey Demand query handlers consume the reduced public
    // Traveller capability exported by SocialModule.
    //
    // Journey Demand does not:
    //
    // - inject TravellerProfileRepository;
    // - access Traveller Profile persistence directly;
    // - reconstruct TravellerProfileAggregate;
    // - register Traveller query handlers locally.
    // =========================================================================

    SocialModule,

    // =========================================================================
    // Trust / Public Trust Read Boundary
    // =========================================================================
    //
    // TrustModule owns Trust Profile and its related projections.
    //
    // The public Journey Demand query handlers consume the reduced public
    // Trust capability exported by TrustModule.
    //
    // Journey Demand does not:
    //
    // - inject TrustProfileRepository;
    // - access Trust persistence directly;
    // - reconstruct TrustProfileAggregate;
    // - register Trust query handlers locally.
    // =========================================================================

    TrustModule,

    // =========================================================================
    // Prisma
    // =========================================================================
    //
    // Provides the Prisma client used by Journey Demand persistence.
    //
    // Prisma is used for Journey Demand-owned persistence only. Public
    // Traveller and Trust data is obtained through their application-level
    // read capabilities, not through direct Prisma access.
    // =========================================================================

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
    // =========================================================================
    // Infrastructure
    // =========================================================================

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

    // =========================================================================
    // Public Journey Demand Detail
    // =========================================================================
    //
    // GET_PUBLIC is the anonymous/public detail boundary.
    //
    // It retrieves only publicly discoverable Journey Demands and composes
    // the public response with Traveller and Trust projections supplied by
    // their owning bounded contexts.
    // =========================================================================

    {
      provide: JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_PUBLIC,
      useClass: GetPublicJourneyDemandQueryHandler,
    },

    // =========================================================================
    // Public Journey Demand Collection
    // =========================================================================
    //
    // GET_PUBLIC_MANY is the anonymous/public marketplace collection boundary.
    //
    // An empty query returns all publicly discoverable Journey Demands.
    // Optional filters are applied by the public Journey Demand repository
    // contract before the handler composes Traveller and Trust projections.
    //
    // This handler must return public read models, never raw domain entities.
    // =========================================================================

    {
      provide: JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_PUBLIC_MANY,
      useClass: GetPublicJourneyDemandsQueryHandler,
    },

    // =========================================================================
    // Internal Collections
    // =========================================================================

    {
      provide: JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_ALL,
      useClass: GetJourneyDemandsQueryHandler,
    },

    {
      provide: JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_MY,
      useClass: GetMyJourneyDemandsQueryHandler,
    },

    // =========================================================================
    // Internal Discovery Query Handlers
    // =========================================================================

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
  // Journey Demand owns its repository and exposes that application capability
  // to other bounded contexts that genuinely need to integrate with Journey
  // Demand.
  //
  // Traveller and Trust capabilities are deliberately not re-exported here.
  // They remain owned by SocialModule and TrustModule respectively.
  //
  // Command and query handlers remain internal to Journey Demand unless
  // another bounded context has an explicit application-level integration
  // requirement.
  // ===========================================================================

  exports: [JOURNEY_DEMAND_TOKENS.REPOSITORY],
})
export class JourneyDemandModule {}
