// -----------------------------------------------------------------------------
//
// sisiMove — Journey Module
//
// -----------------------------------------------------------------------------
//
// The Journey bounded context owns:
//
// - Journey creation and lifecycle;
// - Journey-owned components;
// - Journey persistence;
// - Journey commands and queries;
// - the public Journey marketplace read boundary.
//
// The public marketplace read boundary may compose Journey-owned data with
// reduced public projections from other bounded contexts. Those projections
// are consumed through exported application capabilities; Journey does not
// own, persist, or reconstruct those external contexts.
//
// -----------------------------------------------------------------------------
//
// MODULE DEPENDENCY DIRECTION
//
// Journey
//   ├── IdentityModule
//   ├── SocialModule
//   ├── TrustModule
//   ├── AssetsModule
//   ├── JourneyBoardingModule
//   └── PrismaModule
//
// JourneyBoardingModule supplies the Journey Boarding repository required by
// PublishJourneyHandler.
//
// PublishJourneyHandler creates the Journey Boarding aggregate when a Journey
// is published. The boarding repository must use the ambient Prisma transaction
// so Journey publication and boarding initialization remain atomic.
//
// JourneyBoardingModule must export JOURNEY_BOARDING_TOKENS.REPOSITORY.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { forwardRef, Module } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Domain Dependencies
// -----------------------------------------------------------------------------

import { IdentityModule } from '../identity/identity.module';
import { SocialModule } from '../social/social.module';
import { TrustModule } from '../trust/trust.module';
import { AssetsModule } from '../assets/assets.module';
import { JourneyBoardingModule } from '../journey-boarding/journey-boarding.module';
import { JourneyBookingModule } from '../journey-booking/journey-booking.module';
import { MessagingModule } from '../messaging/messaging.module';
// -----------------------------------------------------------------------------
// Infrastructure
// -----------------------------------------------------------------------------

import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';

// -----------------------------------------------------------------------------
// Presentation
// -----------------------------------------------------------------------------

import { JourneyController } from './presentation/rest/controllers/journey.controller';

// -----------------------------------------------------------------------------
// Infrastructure — Dependency Injection
// -----------------------------------------------------------------------------

import { journeyProviders } from './infrastructure/dependency-injection/journey.providers';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from './application/journey.tokens';

// -----------------------------------------------------------------------------
// Application — Command Handlers
// -----------------------------------------------------------------------------

import {
  AddJourneyWaypointHandler,
  AttachAssetHandler,
  AttachJourneyCapacityHandler,
  AttachJourneyCorridorHandler,
  AttachJourneyScheduleHandler,
  AttachJourneyVehicleHandler,
  AttachPreferencesHandler,
  AttachPricingHandler,
  CancelJourneyHandler,
  CompleteJourneyHandler,
  CreateJourneyHandler,
  ExpireJourneyHandler,
  PublishJourneyHandler,
  RemoveAssetHandler,
  RemoveJourneyCapacityHandler,
  RemoveJourneyCorridorHandler,
  RemoveJourneyScheduleHandler,
  RemoveJourneyWaypointHandler,
  RemovePreferencesHandler,
  RemovePricingHandler,
  RemoveVehicleHandler,
  StartJourneyHandler,
} from './application/handlers/journey';

// -----------------------------------------------------------------------------
// Application — Query Handlers
// -----------------------------------------------------------------------------

import {
  GetJourneyAssetByReferenceQueryHandler,
  GetJourneyAssetsQueryHandler,
  GetJourneyCapacityQueryHandler,
  GetJourneyCorridorQueryHandler,
  GetJourneyPreferencesQueryHandler,
  GetJourneyPricingQueryHandler,
  GetJourneyQueryHandler,
  GetJourneyScheduleQueryHandler,
  GetJourneyVehicleQueryHandler,
  GetJourneyWaypointQueryHandler,
  GetJourneyWaypointsQueryHandler,
  GetJourneysByProviderAndStatusQueryHandler,
  GetJourneysByProviderQueryHandler,
  GetJourneysByStatusQueryHandler,
  GetPublicJourneysQueryHandler,
  SearchPublishedJourneysQueryHandler,
} from './application/query-handlers/journey';

// =============================================================================
// Module
// =============================================================================

@Module({
  // ===========================================================================
  // Imports
  // ===========================================================================

  imports: [
    // =========================================================================
    // Identity / Authorization
    // =========================================================================

    IdentityModule,

    // =========================================================================
    // Social / Traveller Profile Public Read Boundary
    // =========================================================================

    SocialModule,

    // =========================================================================
    // Trust / Public Trust Read Boundary
    // =========================================================================

    TrustModule,

    // =========================================================================
    // Assets / Public Asset Reference Boundary
    // =========================================================================

    AssetsModule,

    // =========================================================================
    // Journey Boarding / Boarding Repository
    // =========================================================================
    //
    // PublishJourneyHandler injects JOURNEY_BOARDING_TOKENS.REPOSITORY.
    //
    // Importing JourneyBoardingModule makes that provider available only if
    // JourneyBoardingModule registers and exports the repository token.
    //
    // This is an application dependency. Journey Boarding remains responsible
    // for its own aggregate, persistence, and participant invariants.
    // =========================================================================

    JourneyBoardingModule,

    forwardRef(() => JourneyBookingModule),

    MessagingModule,

    // =========================================================================
    // Prisma
    // =========================================================================

    PrismaModule,
  ],

  // ===========================================================================
  // Controllers
  // ===========================================================================

  controllers: [JourneyController],

  // ===========================================================================
  // Providers
  // ===========================================================================

  providers: [
    // =========================================================================
    // Infrastructure
    // =========================================================================

    ...journeyProviders,

    // =========================================================================
    // Journey — Lifecycle Command Handlers
    // =========================================================================

    {
      provide: JOURNEY_TOKENS.COMMAND_HANDLERS.CREATE,
      useClass: CreateJourneyHandler,
    },

    {
      provide: JOURNEY_TOKENS.COMMAND_HANDLERS.PUBLISH,
      useClass: PublishJourneyHandler,
    },

    {
      provide: JOURNEY_TOKENS.COMMAND_HANDLERS.START,
      useClass: StartJourneyHandler,
    },

    {
      provide: JOURNEY_TOKENS.COMMAND_HANDLERS.COMPLETE,
      useClass: CompleteJourneyHandler,
    },

    {
      provide: JOURNEY_TOKENS.COMMAND_HANDLERS.CANCEL,
      useClass: CancelJourneyHandler,
    },

    {
      provide: JOURNEY_TOKENS.COMMAND_HANDLERS.EXPIRE,
      useClass: ExpireJourneyHandler,
    },

    // =========================================================================
    // Journey — Corridor Commands
    // =========================================================================

    {
      provide: JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_CORRIDOR,
      useClass: AttachJourneyCorridorHandler,
    },

    {
      provide: JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_CORRIDOR,
      useClass: RemoveJourneyCorridorHandler,
    },

    // =========================================================================
    // Journey — Waypoint Commands
    // =========================================================================

    {
      provide: JOURNEY_TOKENS.COMMAND_HANDLERS.ADD_WAYPOINT,
      useClass: AddJourneyWaypointHandler,
    },

    {
      provide: JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_WAYPOINT,
      useClass: RemoveJourneyWaypointHandler,
    },

    // =========================================================================
    // Journey — Schedule Commands
    // =========================================================================

    {
      provide: JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_SCHEDULE,
      useClass: AttachJourneyScheduleHandler,
    },

    {
      provide: JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_SCHEDULE,
      useClass: RemoveJourneyScheduleHandler,
    },

    // =========================================================================
    // Journey — Vehicle Commands
    // =========================================================================

    {
      provide: JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_VEHICLE,
      useClass: AttachJourneyVehicleHandler,
    },

    {
      provide: JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_VEHICLE,
      useClass: RemoveVehicleHandler,
    },

    // =========================================================================
    // Journey — Capacity Commands
    // =========================================================================

    {
      provide: JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_CAPACITY,
      useClass: AttachJourneyCapacityHandler,
    },

    {
      provide: JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_CAPACITY,
      useClass: RemoveJourneyCapacityHandler,
    },

    // =========================================================================
    // Journey — Pricing Commands
    // =========================================================================

    {
      provide: JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_PRICING,
      useClass: AttachPricingHandler,
    },

    {
      provide: JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_PRICING,
      useClass: RemovePricingHandler,
    },

    // =========================================================================
    // Journey — Preferences Commands
    // =========================================================================

    {
      provide: JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_PREFERENCES,
      useClass: AttachPreferencesHandler,
    },

    {
      provide: JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_PREFERENCES,
      useClass: RemovePreferencesHandler,
    },

    // =========================================================================
    // Journey — Asset Commands
    // =========================================================================

    {
      provide: JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_ASSET,
      useClass: AttachAssetHandler,
    },

    {
      provide: JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_ASSET,
      useClass: RemoveAssetHandler,
    },

    // =========================================================================
    // Journey — General Query Handler Class
    // =========================================================================

    {
      provide: GetJourneyQueryHandler,
      useClass: GetJourneyQueryHandler,
    },

    // =========================================================================
    // Journey — General Query Handler Token
    // =========================================================================

    {
      provide: JOURNEY_TOKENS.QUERY_HANDLERS.GET,
      useExisting: GetJourneyQueryHandler,
    },

    // =========================================================================
    // Journey — Provider Queries
    // =========================================================================

    {
      provide: JOURNEY_TOKENS.QUERY_HANDLERS.GET_BY_PROVIDER,
      useClass: GetJourneysByProviderQueryHandler,
    },

    {
      provide: JOURNEY_TOKENS.QUERY_HANDLERS.GET_BY_STATUS,
      useClass: GetJourneysByStatusQueryHandler,
    },

    {
      provide: JOURNEY_TOKENS.QUERY_HANDLERS.GET_BY_PROVIDER_AND_STATUS,
      useClass: GetJourneysByProviderAndStatusQueryHandler,
    },

    // =========================================================================
    // Public Journey — Marketplace Collection
    // =========================================================================

    {
      provide: JOURNEY_TOKENS.QUERY_HANDLERS.GET_PUBLIC_MANY,
      useClass: GetPublicJourneysQueryHandler,
    },

    // =========================================================================
    // Journey — Published Journey Search
    // =========================================================================

    {
      provide: JOURNEY_TOKENS.QUERY_HANDLERS.SEARCH_PUBLISHED,
      useClass: SearchPublishedJourneysQueryHandler,
    },

    // =========================================================================
    // Journey — Corridor Queries
    // =========================================================================

    {
      provide: JOURNEY_TOKENS.QUERY_HANDLERS.GET_CORRIDOR,
      useClass: GetJourneyCorridorQueryHandler,
    },

    // =========================================================================
    // Journey — Waypoint Queries
    // =========================================================================

    {
      provide: JOURNEY_TOKENS.QUERY_HANDLERS.GET_WAYPOINT,
      useClass: GetJourneyWaypointQueryHandler,
    },

    {
      provide: JOURNEY_TOKENS.QUERY_HANDLERS.GET_WAYPOINTS,
      useClass: GetJourneyWaypointsQueryHandler,
    },

    // =========================================================================
    // Journey — Schedule Queries
    // =========================================================================

    {
      provide: JOURNEY_TOKENS.QUERY_HANDLERS.GET_SCHEDULE,
      useClass: GetJourneyScheduleQueryHandler,
    },

    // =========================================================================
    // Journey — Vehicle Queries
    // =========================================================================

    {
      provide: JOURNEY_TOKENS.QUERY_HANDLERS.GET_VEHICLE,
      useClass: GetJourneyVehicleQueryHandler,
    },

    // =========================================================================
    // Journey — Capacity Queries
    // =========================================================================

    {
      provide: JOURNEY_TOKENS.QUERY_HANDLERS.GET_CAPACITY,
      useClass: GetJourneyCapacityQueryHandler,
    },

    // =========================================================================
    // Journey — Pricing Queries
    // =========================================================================

    {
      provide: JOURNEY_TOKENS.QUERY_HANDLERS.GET_PRICING,
      useClass: GetJourneyPricingQueryHandler,
    },

    // =========================================================================
    // Journey — Preferences Queries
    // =========================================================================

    {
      provide: JOURNEY_TOKENS.QUERY_HANDLERS.GET_PREFERENCES,
      useClass: GetJourneyPreferencesQueryHandler,
    },

    // =========================================================================
    // Journey — Asset Queries
    // =========================================================================

    {
      provide: JOURNEY_TOKENS.QUERY_HANDLERS.GET_ASSETS,
      useClass: GetJourneyAssetsQueryHandler,
    },

    {
      provide: JOURNEY_TOKENS.QUERY_HANDLERS.GET_ASSET_BY_REFERENCE,
      useClass: GetJourneyAssetByReferenceQueryHandler,
    },
  ],

  // ===========================================================================
  // Exports
  // ===========================================================================

  exports: [
    // =========================================================================
    // Repository
    // =========================================================================

    JOURNEY_TOKENS.REPOSITORY,

    // =========================================================================
    // Journey — General Query Handler Class
    // =========================================================================

    GetJourneyQueryHandler,

    // =========================================================================
    // Journey — Lifecycle Command Handler Tokens
    // =========================================================================

    JOURNEY_TOKENS.COMMAND_HANDLERS.CREATE,
    JOURNEY_TOKENS.COMMAND_HANDLERS.PUBLISH,
    JOURNEY_TOKENS.COMMAND_HANDLERS.START,
    JOURNEY_TOKENS.COMMAND_HANDLERS.COMPLETE,
    JOURNEY_TOKENS.COMMAND_HANDLERS.CANCEL,
    JOURNEY_TOKENS.COMMAND_HANDLERS.EXPIRE,

    // =========================================================================
    // Corridor Command Handler Tokens
    // =========================================================================

    JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_CORRIDOR,
    JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_CORRIDOR,

    // =========================================================================
    // Waypoint Command Handler Tokens
    // =========================================================================

    JOURNEY_TOKENS.COMMAND_HANDLERS.ADD_WAYPOINT,
    JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_WAYPOINT,

    // =========================================================================
    // Schedule Command Handler Tokens
    // =========================================================================

    JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_SCHEDULE,
    JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_SCHEDULE,

    // =========================================================================
    // Vehicle Command Handler Tokens
    // =========================================================================

    JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_VEHICLE,
    JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_VEHICLE,

    // =========================================================================
    // Capacity Command Handler Tokens
    // =========================================================================

    JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_CAPACITY,
    JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_CAPACITY,

    // =========================================================================
    // Pricing Command Handler Tokens
    // =========================================================================

    JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_PRICING,
    JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_PRICING,

    // =========================================================================
    // Preferences Command Handler Tokens
    // =========================================================================

    JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_PREFERENCES,
    JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_PREFERENCES,

    // =========================================================================
    // Asset Command Handler Tokens
    // =========================================================================

    JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_ASSET,
    JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_ASSET,

    // =========================================================================
    // Journey — Query Handler Tokens
    // =========================================================================

    JOURNEY_TOKENS.QUERY_HANDLERS.GET,
    JOURNEY_TOKENS.QUERY_HANDLERS.GET_BY_PROVIDER,
    JOURNEY_TOKENS.QUERY_HANDLERS.GET_BY_STATUS,
    JOURNEY_TOKENS.QUERY_HANDLERS.GET_BY_PROVIDER_AND_STATUS,

    // =========================================================================
    // Public Journey — Marketplace Collection
    // =========================================================================

    JOURNEY_TOKENS.QUERY_HANDLERS.GET_PUBLIC_MANY,

    // =========================================================================
    // Published Journey Search
    // =========================================================================

    JOURNEY_TOKENS.QUERY_HANDLERS.SEARCH_PUBLISHED,

    // =========================================================================
    // Corridor Query Handler Token
    // =========================================================================

    JOURNEY_TOKENS.QUERY_HANDLERS.GET_CORRIDOR,

    // =========================================================================
    // Waypoint Query Handler Tokens
    // =========================================================================

    JOURNEY_TOKENS.QUERY_HANDLERS.GET_WAYPOINT,
    JOURNEY_TOKENS.QUERY_HANDLERS.GET_WAYPOINTS,

    // =========================================================================
    // Schedule Query Handler Token
    // =========================================================================

    JOURNEY_TOKENS.QUERY_HANDLERS.GET_SCHEDULE,

    // =========================================================================
    // Vehicle Query Handler Token
    // =========================================================================

    JOURNEY_TOKENS.QUERY_HANDLERS.GET_VEHICLE,

    // =========================================================================
    // Capacity Query Handler Token
    // =========================================================================

    JOURNEY_TOKENS.QUERY_HANDLERS.GET_CAPACITY,

    // =========================================================================
    // Pricing Query Handler Token
    // =========================================================================

    JOURNEY_TOKENS.QUERY_HANDLERS.GET_PRICING,

    // =========================================================================
    // Preferences Query Handler Token
    // =========================================================================

    JOURNEY_TOKENS.QUERY_HANDLERS.GET_PREFERENCES,

    // =========================================================================
    // Asset Query Handler Tokens
    // =========================================================================

    JOURNEY_TOKENS.QUERY_HANDLERS.GET_ASSETS,
    JOURNEY_TOKENS.QUERY_HANDLERS.GET_ASSET_BY_REFERENCE,
  ],
})
export class JourneyModule {}
