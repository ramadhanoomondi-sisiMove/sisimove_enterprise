// src/domains/social/social.module.ts

import { Module } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Domains
// -----------------------------------------------------------------------------

import { IdentityModule } from '../identity/identity.module';

// -----------------------------------------------------------------------------
// Infrastructure
// -----------------------------------------------------------------------------

import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';

import { travellerProfileProviders } from './infrastructure/dependency-injection/traveller-profile.providers';

// -----------------------------------------------------------------------------
// Presentation
// -----------------------------------------------------------------------------

import { TravellerProfileController } from './presentation/rest/controllers';

// -----------------------------------------------------------------------------
// Application Handlers
// -----------------------------------------------------------------------------

import {
  CreateTravellerProfileHandler,
  ChangeTravellerProfileHandleHandler,
  ChangeTravellerProfileBioHandler,
  ChangeTravellerProfileAvatarHandler,
  ChangeTravellerProfileCountryHandler,
  ChangeTravellerProfileStatusHandler,
  ChangeTravellerProfileVisibilityHandler,
  CreateTravellerProfilePreferencesHandler,
  ChangeTravellerProfilePreferencesHandler,
  RemoveTravellerProfilePreferencesHandler,
  AddTravellerProfileCorridorHandler,
  UpdateTravellerProfileCorridorHandler,
  RemoveTravellerProfileCorridorHandler,
  SetTravellerProfilePrimaryCorridorHandler,
  ClearTravellerProfilePrimaryCorridorHandler,
} from './application/handlers';

// -----------------------------------------------------------------------------
// Application Query Handlers
// -----------------------------------------------------------------------------

import {
  GetTravellerProfileQueryHandler,
  GetTravellerProfileByPublicIdQueryHandler,
  GetTravellerProfileByMemberPublicIdQueryHandler,
  GetTravellerProfileByHandleQueryHandler,
  GetTravellerProfilePreferencesQueryHandler,
  GetTravellerProfileCorridorQueryHandler,
  GetTravellerProfileCorridorsQueryHandler,
  GetTravellerProfilePrimaryCorridorQueryHandler,
} from './application/query-handlers';

// -----------------------------------------------------------------------------
// Application Tokens
// -----------------------------------------------------------------------------

import { TRAVELLER_PROFILE_TOKENS } from './application/traveller-profile.tokens';

// -----------------------------------------------------------------------------
// Module
// -----------------------------------------------------------------------------

@Module({
  imports: [
    // =========================================================================
    // Identity
    //
    // Provides the authorization infrastructure used by the REST controller:
    //
    // - JwtAuthGuard
    // - PermissionsGuard
    // - GetIdentityPermissionsHandler
    // - GetIdentityRolesHandler
    // =========================================================================

    IdentityModule,

    // =========================================================================
    // Prisma
    // =========================================================================

    PrismaModule,
  ],

  // ===========================================================================
  // Controllers
  // ===========================================================================

  controllers: [TravellerProfileController],

  // ===========================================================================
  // Providers
  // ===========================================================================

  providers: [
    // =========================================================================
    // Infrastructure
    // =========================================================================

    ...travellerProfileProviders,

    // =========================================================================
    // Traveller Profile Command Handlers
    // =========================================================================

    {
      provide: TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CREATE,

      useClass: CreateTravellerProfileHandler,
    },

    {
      provide: TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_HANDLE,

      useClass: ChangeTravellerProfileHandleHandler,
    },

    {
      provide: TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_BIO,

      useClass: ChangeTravellerProfileBioHandler,
    },

    {
      provide: TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_AVATAR,

      useClass: ChangeTravellerProfileAvatarHandler,
    },

    {
      provide: TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_COUNTRY,

      useClass: ChangeTravellerProfileCountryHandler,
    },

    {
      provide: TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_STATUS,

      useClass: ChangeTravellerProfileStatusHandler,
    },

    {
      provide: TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_VISIBILITY,

      useClass: ChangeTravellerProfileVisibilityHandler,
    },

    // =========================================================================
    // Traveller Profile Preferences Command Handlers
    // =========================================================================

    {
      provide: TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CREATE_PREFERENCES,

      useClass: CreateTravellerProfilePreferencesHandler,
    },

    {
      provide: TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_PREFERENCES,

      useClass: ChangeTravellerProfilePreferencesHandler,
    },

    {
      provide: TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.REMOVE_PREFERENCES,

      useClass: RemoveTravellerProfilePreferencesHandler,
    },

    // =========================================================================
    // Traveller Profile Corridor Command Handlers
    // =========================================================================

    {
      provide: TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.ADD_CORRIDOR,

      useClass: AddTravellerProfileCorridorHandler,
    },

    {
      provide: TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.UPDATE_CORRIDOR,

      useClass: UpdateTravellerProfileCorridorHandler,
    },

    {
      provide: TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.REMOVE_CORRIDOR,

      useClass: RemoveTravellerProfileCorridorHandler,
    },

    {
      provide: TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.SET_PRIMARY_CORRIDOR,

      useClass: SetTravellerProfilePrimaryCorridorHandler,
    },

    {
      provide: TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CLEAR_PRIMARY_CORRIDOR,

      useClass: ClearTravellerProfilePrimaryCorridorHandler,
    },

    // =========================================================================
    // Traveller Profile Query Handlers
    // =========================================================================

    {
      provide: TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET,

      useClass: GetTravellerProfileQueryHandler,
    },

    {
      provide: TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET_BY_PUBLIC_ID,

      useClass: GetTravellerProfileByPublicIdQueryHandler,
    },

    {
      provide: TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET_BY_MEMBER_PUBLIC_ID,

      useClass: GetTravellerProfileByMemberPublicIdQueryHandler,
    },

    {
      provide: TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET_BY_HANDLE,

      useClass: GetTravellerProfileByHandleQueryHandler,
    },

    // =========================================================================
    // Traveller Profile Preferences Query Handlers
    // =========================================================================

    {
      provide: TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET_PREFERENCES,

      useClass: GetTravellerProfilePreferencesQueryHandler,
    },

    // =========================================================================
    // Traveller Profile Corridor Query Handlers
    // =========================================================================

    {
      provide: TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET_CORRIDOR,

      useClass: GetTravellerProfileCorridorQueryHandler,
    },

    {
      provide: TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET_CORRIDORS,

      useClass: GetTravellerProfileCorridorsQueryHandler,
    },

    {
      provide: TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET_PRIMARY_CORRIDOR,

      useClass: GetTravellerProfilePrimaryCorridorQueryHandler,
    },
  ],

  // ===========================================================================
  // Exports
  // ===========================================================================

  exports: [
    // =========================================================================
    // Repository
    // =========================================================================

    TRAVELLER_PROFILE_TOKENS.REPOSITORY,

    // =========================================================================
    // Command Handlers
    // =========================================================================

    TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CREATE,
    TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_HANDLE,
    TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_BIO,
    TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_AVATAR,
    TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_COUNTRY,
    TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_STATUS,
    TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_VISIBILITY,

    TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CREATE_PREFERENCES,
    TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_PREFERENCES,
    TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.REMOVE_PREFERENCES,

    TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.ADD_CORRIDOR,
    TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.UPDATE_CORRIDOR,
    TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.REMOVE_CORRIDOR,
    TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.SET_PRIMARY_CORRIDOR,
    TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CLEAR_PRIMARY_CORRIDOR,

    // =========================================================================
    // Query Handlers
    // =========================================================================

    TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET,
    TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET_BY_PUBLIC_ID,
    TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET_BY_MEMBER_PUBLIC_ID,
    TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET_BY_HANDLE,

    TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET_PREFERENCES,

    TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET_CORRIDOR,
    TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET_CORRIDORS,
    TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET_PRIMARY_CORRIDOR,
  ],
})
export class SocialModule {}
