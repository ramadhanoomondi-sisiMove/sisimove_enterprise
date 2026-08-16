// src/domains/trust/trust.module.ts

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

import { TrustBadgeController } from './presentation/rest/controllers/trust-badge.controller';
import { TrustProfileController } from './presentation/rest/controllers/trust-profile.controller';

// -----------------------------------------------------------------------------
// Infrastructure — Dependency Injection
// -----------------------------------------------------------------------------

import { trustBadgeProviders } from './infrastructure/dependency-injection/trust-badge.providers';
import { trustProfileProviders } from './infrastructure/dependency-injection/trust-profile.providers';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { TRUST_BADGE_TOKENS } from './application/trust-badge.tokens';
import { TRUST_PROFILE_TOKENS } from './application/trust-profile.tokens';

// -----------------------------------------------------------------------------
// Application — Trust Badge Command Handlers
// -----------------------------------------------------------------------------

import {
  ActivateTrustBadgeHandler,
  ChangeTrustBadgeDescriptionHandler,
  ChangeTrustBadgeNameHandler,
  ChangeTrustBadgeTypeHandler,
  CreateTrustBadgeHandler,
  DeactivateTrustBadgeHandler,
  SetTrustBadgeAssetHandler,
  UpdateTrustBadgeHandler,
} from './application/handlers/trust-badge';

// -----------------------------------------------------------------------------
// Application — Trust Badge Query Handlers
// -----------------------------------------------------------------------------

import {
  GetActiveTrustBadgesQueryHandler,
  GetTrustBadgeByNameQueryHandler,
  GetTrustBadgeByTypeQueryHandler,
  GetTrustBadgesByAssetQueryHandler,
  GetTrustBadgeQueryHandler,
} from './application/query-handlers/trust-badge';

// -----------------------------------------------------------------------------
// Application — Trust Profile Command Handlers
// -----------------------------------------------------------------------------

import {
  ApplyJourneyCancelledHandler,
  ApplyJourneyCompletedHandler,
  ApplyTrustDisputeOpenedHandler,
  ApplyTrustDisputeResolvedHandler,
  ApplyTrustManualAdjustmentHandler,
  AwardTrustBadgeHandler,
  ChangeTrustProfileStatusHandler,
  ChangeTrustRatingScoreHandler,
  CreateTrustProfileHandler,
  CreateTrustReviewHandler,
  GrantTrustVerificationHandler,
  HideTrustRatingHandler,
  ReceiveTrustRatingHandler,
  RemoveTrustRatingHandler,
  RemoveTrustReviewHandler,
  RestoreTrustRatingHandler,
  RevokeTrustBadgeHandler,
  RevokeTrustVerificationHandler,
  UpdateTrustReviewHandler,
} from './application/handlers/trust-profile';

// -----------------------------------------------------------------------------
// Application — Trust Profile Query Handlers
// -----------------------------------------------------------------------------

import {
  GetTrustProfileBadgeQueryHandler,
  GetTrustProfileBadgesQueryHandler,
  GetTrustProfileByMemberQueryHandler,
  GetTrustProfileEventsQueryHandler,
  GetTrustProfileQueryHandler,
  GetTrustProfileRatingQueryHandler,
  GetTrustProfileRatingsQueryHandler,
  GetTrustProfileReviewQueryHandler,
  GetTrustProfileReviewsQueryHandler,
} from './application/query-handlers/trust-profile';

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
    //
    // Required by cross-domain authorization infrastructure such as:
    //
    //   PermissionsGuard
    //     -> GetIdentityPermissionsHandler
    //     -> GetIdentityRolesHandler
    //
    // IdentityModule exports both handlers.
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

  controllers: [
    // =========================================================================
    // Trust Badge
    // =========================================================================

    TrustBadgeController,

    // =========================================================================
    // Trust Profile
    // =========================================================================

    TrustProfileController,
  ],

  // ===========================================================================
  // Providers
  // ===========================================================================

  providers: [
    // =========================================================================
    // Infrastructure
    // =========================================================================

    ...trustBadgeProviders,
    ...trustProfileProviders,

    // =========================================================================
    // Trust Badge — Command Handlers
    // =========================================================================

    {
      provide: TRUST_BADGE_TOKENS.COMMAND_HANDLERS.CREATE,
      useClass: CreateTrustBadgeHandler,
    },

    {
      provide: TRUST_BADGE_TOKENS.COMMAND_HANDLERS.UPDATE,
      useClass: UpdateTrustBadgeHandler,
    },

    {
      provide: TRUST_BADGE_TOKENS.COMMAND_HANDLERS.CHANGE_TYPE,
      useClass: ChangeTrustBadgeTypeHandler,
    },

    {
      provide: TRUST_BADGE_TOKENS.COMMAND_HANDLERS.CHANGE_NAME,
      useClass: ChangeTrustBadgeNameHandler,
    },

    {
      provide: TRUST_BADGE_TOKENS.COMMAND_HANDLERS.CHANGE_DESCRIPTION,
      useClass: ChangeTrustBadgeDescriptionHandler,
    },

    {
      provide: TRUST_BADGE_TOKENS.COMMAND_HANDLERS.SET_ASSET,
      useClass: SetTrustBadgeAssetHandler,
    },

    {
      provide: TRUST_BADGE_TOKENS.COMMAND_HANDLERS.ACTIVATE,
      useClass: ActivateTrustBadgeHandler,
    },

    {
      provide: TRUST_BADGE_TOKENS.COMMAND_HANDLERS.DEACTIVATE,
      useClass: DeactivateTrustBadgeHandler,
    },

    // =========================================================================
    // Trust Badge — Query Handlers
    // =========================================================================

    {
      provide: TRUST_BADGE_TOKENS.QUERY_HANDLERS.GET,
      useClass: GetTrustBadgeQueryHandler,
    },

    {
      provide: TRUST_BADGE_TOKENS.QUERY_HANDLERS.GET_BY_TYPE,
      useClass: GetTrustBadgeByTypeQueryHandler,
    },

    {
      provide: TRUST_BADGE_TOKENS.QUERY_HANDLERS.GET_BY_NAME,
      useClass: GetTrustBadgeByNameQueryHandler,
    },

    {
      provide: TRUST_BADGE_TOKENS.QUERY_HANDLERS.GET_ACTIVE,
      useClass: GetActiveTrustBadgesQueryHandler,
    },

    {
      provide: TRUST_BADGE_TOKENS.QUERY_HANDLERS.GET_BY_ASSET,
      useClass: GetTrustBadgesByAssetQueryHandler,
    },

    // =========================================================================
    // Trust Profile — Profile Commands
    // =========================================================================

    {
      provide: TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.CREATE,
      useClass: CreateTrustProfileHandler,
    },

    {
      provide: TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_STATUS,
      useClass: ChangeTrustProfileStatusHandler,
    },

    {
      provide: TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.RESTRICT,
      useClass: ChangeTrustProfileStatusHandler,
    },

    {
      provide: TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.SUSPEND,
      useClass: ChangeTrustProfileStatusHandler,
    },

    {
      provide: TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.RESTORE,
      useClass: ChangeTrustProfileStatusHandler,
    },

    // =========================================================================
    // Trust Profile — Verification Commands
    // =========================================================================

    {
      provide: TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.GRANT_VERIFICATION,
      useClass: GrantTrustVerificationHandler,
    },

    {
      provide: TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.REVOKE_VERIFICATION,
      useClass: RevokeTrustVerificationHandler,
    },

    // =========================================================================
    // Trust Profile — Rating Commands
    // =========================================================================

    {
      provide: TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.RECEIVE_RATING,
      useClass: ReceiveTrustRatingHandler,
    },

    {
      provide: TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_RATING_SCORE,
      useClass: ChangeTrustRatingScoreHandler,
    },

    {
      provide: TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.HIDE_RATING,
      useClass: HideTrustRatingHandler,
    },

    {
      provide: TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.REMOVE_RATING,
      useClass: RemoveTrustRatingHandler,
    },

    {
      provide: TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.RESTORE_RATING,
      useClass: RestoreTrustRatingHandler,
    },

    // =========================================================================
    // Trust Profile — Review Commands
    // =========================================================================

    {
      provide: TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.CREATE_REVIEW,
      useClass: CreateTrustReviewHandler,
    },

    {
      provide: TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.UPDATE_REVIEW,
      useClass: UpdateTrustReviewHandler,
    },

    {
      provide: TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.REMOVE_REVIEW,
      useClass: RemoveTrustReviewHandler,
    },

    // =========================================================================
    // Trust Profile — Badge Commands
    // =========================================================================

    {
      provide: TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.AWARD_BADGE,
      useClass: AwardTrustBadgeHandler,
    },

    {
      provide: TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.REVOKE_BADGE,
      useClass: RevokeTrustBadgeHandler,
    },

    // =========================================================================
    // Trust Profile — Journey Projections
    // =========================================================================

    {
      provide: TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.APPLY_JOURNEY_COMPLETED,
      useClass: ApplyJourneyCompletedHandler,
    },

    {
      provide: TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.APPLY_JOURNEY_CANCELLED,
      useClass: ApplyJourneyCancelledHandler,
    },

    // =========================================================================
    // Trust Profile — Dispute Projections
    // =========================================================================

    {
      provide: TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.APPLY_DISPUTE_OPENED,
      useClass: ApplyTrustDisputeOpenedHandler,
    },

    {
      provide: TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.APPLY_DISPUTE_RESOLVED,
      useClass: ApplyTrustDisputeResolvedHandler,
    },

    // =========================================================================
    // Trust Profile — Manual Adjustment
    // =========================================================================

    {
      provide: TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.APPLY_MANUAL_ADJUSTMENT,
      useClass: ApplyTrustManualAdjustmentHandler,
    },

    // =========================================================================
    // Trust Profile — Query Handlers
    // =========================================================================

    {
      provide: TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET,
      useClass: GetTrustProfileQueryHandler,
    },

    {
      provide: TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_BY_MEMBER_PUBLIC_ID,
      useClass: GetTrustProfileByMemberQueryHandler,
    },

    {
      provide: TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_RATINGS,
      useClass: GetTrustProfileRatingsQueryHandler,
    },

    {
      provide: TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_RATING,
      useClass: GetTrustProfileRatingQueryHandler,
    },

    {
      provide: TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_REVIEWS,
      useClass: GetTrustProfileReviewsQueryHandler,
    },

    {
      provide: TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_REVIEW,
      useClass: GetTrustProfileReviewQueryHandler,
    },

    {
      provide: TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_BADGES,
      useClass: GetTrustProfileBadgesQueryHandler,
    },

    {
      provide: TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_BADGE,
      useClass: GetTrustProfileBadgeQueryHandler,
    },

    {
      provide: TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_EVENTS,
      useClass: GetTrustProfileEventsQueryHandler,
    },
  ],

  // ===========================================================================
  // Exports
  // ===========================================================================

  exports: [
    // =========================================================================
    // Repository Tokens
    // =========================================================================

    TRUST_BADGE_TOKENS.REPOSITORY,
    TRUST_PROFILE_TOKENS.REPOSITORY,

    // =========================================================================
    // Trust Badge — Command Tokens
    // =========================================================================

    TRUST_BADGE_TOKENS.COMMAND_HANDLERS.CREATE,
    TRUST_BADGE_TOKENS.COMMAND_HANDLERS.UPDATE,
    TRUST_BADGE_TOKENS.COMMAND_HANDLERS.CHANGE_TYPE,
    TRUST_BADGE_TOKENS.COMMAND_HANDLERS.CHANGE_NAME,
    TRUST_BADGE_TOKENS.COMMAND_HANDLERS.CHANGE_DESCRIPTION,
    TRUST_BADGE_TOKENS.COMMAND_HANDLERS.SET_ASSET,
    TRUST_BADGE_TOKENS.COMMAND_HANDLERS.ACTIVATE,
    TRUST_BADGE_TOKENS.COMMAND_HANDLERS.DEACTIVATE,

    // =========================================================================
    // Trust Badge — Query Tokens
    // =========================================================================

    TRUST_BADGE_TOKENS.QUERY_HANDLERS.GET,
    TRUST_BADGE_TOKENS.QUERY_HANDLERS.GET_BY_TYPE,
    TRUST_BADGE_TOKENS.QUERY_HANDLERS.GET_BY_NAME,
    TRUST_BADGE_TOKENS.QUERY_HANDLERS.GET_ACTIVE,
    TRUST_BADGE_TOKENS.QUERY_HANDLERS.GET_BY_ASSET,

    // =========================================================================
    // Trust Profile — Profile Command Tokens
    // =========================================================================

    TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.CREATE,
    TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_STATUS,
    TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.RESTRICT,
    TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.SUSPEND,
    TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.RESTORE,

    // =========================================================================
    // Trust Profile — Verification Command Tokens
    // =========================================================================

    TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.GRANT_VERIFICATION,
    TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.REVOKE_VERIFICATION,

    // =========================================================================
    // Trust Profile — Rating Command Tokens
    // =========================================================================

    TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.RECEIVE_RATING,
    TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_RATING_SCORE,
    TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.HIDE_RATING,
    TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.REMOVE_RATING,
    TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.RESTORE_RATING,

    // =========================================================================
    // Trust Profile — Review Command Tokens
    // =========================================================================

    TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.CREATE_REVIEW,
    TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.UPDATE_REVIEW,
    TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.REMOVE_REVIEW,

    // =========================================================================
    // Trust Profile — Badge Command Tokens
    // =========================================================================

    TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.AWARD_BADGE,
    TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.REVOKE_BADGE,

    // =========================================================================
    // Trust Profile — Journey Projection Tokens
    // =========================================================================

    TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.APPLY_JOURNEY_COMPLETED,
    TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.APPLY_JOURNEY_CANCELLED,

    // =========================================================================
    // Trust Profile — Dispute Projection Tokens
    // =========================================================================

    TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.APPLY_DISPUTE_OPENED,
    TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.APPLY_DISPUTE_RESOLVED,

    // =========================================================================
    // Trust Profile — Manual Adjustment Token
    // =========================================================================

    TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.APPLY_MANUAL_ADJUSTMENT,

    // =========================================================================
    // Trust Profile — Query Tokens
    // =========================================================================

    TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET,
    TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_BY_MEMBER_PUBLIC_ID,

    TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_RATINGS,
    TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_RATING,

    TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_REVIEWS,
    TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_REVIEW,

    TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_BADGES,
    TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_BADGE,

    TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_EVENTS,
  ],
})
export class TrustModule {}
