// src/domains/trust/presentation/rest/controllers/trust-profile.controller.ts

import { randomUUID } from 'crypto';

import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../../../../../foundation/security/auth';

// -----------------------------------------------------------------------------
// Application Tokens
// -----------------------------------------------------------------------------

import { TRUST_PROFILE_TOKENS } from '../../../application/trust-profile.tokens';

// -----------------------------------------------------------------------------
// Application Commands
// -----------------------------------------------------------------------------

import {
  CreateTrustProfileCommand,
  ChangeTrustProfileStatusCommand,
  GrantTrustVerificationCommand,
  RevokeTrustVerificationCommand,
  ReceiveTrustRatingCommand,
  ChangeTrustRatingScoreCommand,
  HideTrustRatingCommand,
  RemoveTrustRatingCommand,
  RestoreTrustRatingCommand,
  CreateTrustReviewCommand,
  UpdateTrustReviewCommand,
  RemoveTrustReviewCommand,
  AwardTrustBadgeCommand,
  RevokeTrustBadgeCommand,
  ApplyJourneyCompletedCommand,
  ApplyJourneyCancelledCommand,
  ApplyTrustDisputeOpenedCommand,
  ApplyTrustDisputeResolvedCommand,
  ApplyTrustManualAdjustmentCommand,
} from '../../../application/commands/trust-profile';

// -----------------------------------------------------------------------------
// Application Queries
// -----------------------------------------------------------------------------

import {
  GetTrustProfileQuery,
  GetTrustProfileByMemberQuery,
  GetTrustProfileRatingsQuery,
  GetTrustProfileRatingQuery,
  GetTrustProfileReviewsQuery,
  GetTrustProfileReviewQuery,
  GetTrustProfileBadgesQuery,
  GetTrustProfileBadgeQuery,
  GetTrustProfileEventsQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Application Contracts
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';
import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { TrustProfileAggregate } from '../../../domain/aggregates/trust-profile.aggregate';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { TrustRatingEntity } from '../../../domain/entities/trust-rating.entity';
import type { TrustReviewEntity } from '../../../domain/entities/trust-review.entity';
import type { TrustProfileBadgeEntity } from '../../../domain/entities/trust-profile-badge.entity';
import type { TrustEventEntity } from '../../../domain/entities/trust-event.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { TrustRatingScore } from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation DTOs
// -----------------------------------------------------------------------------

import {
  CreateTrustProfileDto,
  ChangeTrustProfileStatusDto,
  GrantTrustVerificationDto,
  ReceiveTrustRatingDto,
  ChangeTrustRatingScoreDto,
  HideTrustRatingDto,
  RemoveTrustRatingDto,
  CreateTrustReviewDto,
  UpdateTrustReviewDto,
  RemoveTrustReviewDto,
  AwardTrustBadgeDto,
  RevokeTrustBadgeDto,
  ApplyTrustJourneyCompletedDto,
  ApplyTrustJourneyCancelledDto,
  ApplyTrustDisputeOpenedDto,
  ApplyTrustDisputeResolvedDto,
  ApplyTrustManualAdjustmentDto,
} from '../dto';

// -----------------------------------------------------------------------------
// Presentation Responses
// -----------------------------------------------------------------------------

import {
  TrustProfileResponseMapper,
  type TrustProfileResponse,
  type TrustRatingResponse,
  type TrustReviewResponse,
  type TrustProfileBadgeResponse,
  type TrustEventResponse,
} from '../mappers/trust-profile-response.mapper';

// =============================================================================
// Trust Profile HTTP Controller
// =============================================================================
//
// This controller exposes two categories of Trust Profile operations:
//
// 1. PUBLIC TRUST DISCOVERY
//
//    These endpoints support the public SisiMove traveller experience:
//
//    - public trust profiles;
//    - trust profile lookup by member;
//    - ratings;
//    - reviews;
//    - trust badges.
//
//    These endpoints do NOT require authentication.
//
// 2. AUTHENTICATED TRUST MANAGEMENT
//
//    These endpoints modify trust state or expose operational/moderation data.
//    They require:
//
//        Access Token
//             ↓
//        JwtAuthGuard
//             ↓
//        PermissionsGuard
//             ↓
//        Required trust-* permission
//             ↓
//        Application Command / Query Handler
//
// Responsibilities:
//
// - HTTP transport;
// - DTO binding;
// - command/query construction;
// - dispatching application handlers;
// - mapping domain results to HTTP responses;
// - declaring authorization requirements.
//
// The controller contains no business rules.
//
// Domain behavior remains in:
//
// - TrustProfileAggregate;
// - TrustRatingEntity;
// - TrustReviewEntity;
// - TrustProfileBadgeEntity;
// - TrustEventEntity;
// - application command/query handlers.
//
// =============================================================================

@ApiTags('Trust Profiles')
@Controller('trust-profiles')
export class TrustProfileController {
  constructor(
    // ========================================================================
    // Profile Commands
    // ========================================================================

    @Inject(TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.CREATE)
    private readonly createTrustProfileHandler: CommandHandler<
      CreateTrustProfileCommand,
      TrustProfileAggregate
    >,

    @Inject(TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_STATUS)
    private readonly changeTrustProfileStatusHandler: CommandHandler<ChangeTrustProfileStatusCommand>,

    @Inject(TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.GRANT_VERIFICATION)
    private readonly grantTrustVerificationHandler: CommandHandler<GrantTrustVerificationCommand>,

    @Inject(TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.REVOKE_VERIFICATION)
    private readonly revokeTrustVerificationHandler: CommandHandler<RevokeTrustVerificationCommand>,

    // ========================================================================
    // Rating Commands
    // ========================================================================

    @Inject(TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.RECEIVE_RATING)
    private readonly receiveTrustRatingHandler: CommandHandler<ReceiveTrustRatingCommand>,

    @Inject(TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_RATING_SCORE)
    private readonly changeTrustRatingScoreHandler: CommandHandler<ChangeTrustRatingScoreCommand>,

    @Inject(TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.HIDE_RATING)
    private readonly hideTrustRatingHandler: CommandHandler<HideTrustRatingCommand>,

    @Inject(TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.REMOVE_RATING)
    private readonly removeTrustRatingHandler: CommandHandler<RemoveTrustRatingCommand>,

    @Inject(TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.RESTORE_RATING)
    private readonly restoreTrustRatingHandler: CommandHandler<RestoreTrustRatingCommand>,

    // ========================================================================
    // Review Commands
    // ========================================================================

    @Inject(TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.CREATE_REVIEW)
    private readonly createTrustReviewHandler: CommandHandler<CreateTrustReviewCommand>,

    @Inject(TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.UPDATE_REVIEW)
    private readonly updateTrustReviewHandler: CommandHandler<UpdateTrustReviewCommand>,

    @Inject(TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.REMOVE_REVIEW)
    private readonly removeTrustReviewHandler: CommandHandler<RemoveTrustReviewCommand>,

    // ========================================================================
    // Badge Commands
    // ========================================================================

    @Inject(TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.AWARD_BADGE)
    private readonly awardTrustBadgeHandler: CommandHandler<AwardTrustBadgeCommand>,

    @Inject(TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.REVOKE_BADGE)
    private readonly revokeTrustBadgeHandler: CommandHandler<RevokeTrustBadgeCommand>,

    // ========================================================================
    // Journey Commands
    // ========================================================================

    @Inject(TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.APPLY_JOURNEY_COMPLETED)
    private readonly applyTrustJourneyCompletedHandler: CommandHandler<ApplyJourneyCompletedCommand>,

    @Inject(TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.APPLY_JOURNEY_CANCELLED)
    private readonly applyTrustJourneyCancelledHandler: CommandHandler<ApplyJourneyCancelledCommand>,

    // ========================================================================
    // Dispute Commands
    // ========================================================================

    @Inject(TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.APPLY_DISPUTE_OPENED)
    private readonly applyTrustDisputeOpenedHandler: CommandHandler<ApplyTrustDisputeOpenedCommand>,

    @Inject(TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.APPLY_DISPUTE_RESOLVED)
    private readonly applyTrustDisputeResolvedHandler: CommandHandler<ApplyTrustDisputeResolvedCommand>,

    // ========================================================================
    // Manual Adjustment
    // ========================================================================

    @Inject(TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.APPLY_MANUAL_ADJUSTMENT)
    private readonly applyTrustManualAdjustmentHandler: CommandHandler<ApplyTrustManualAdjustmentCommand>,

    // ========================================================================
    // Profile Queries
    // ========================================================================

    @Inject(TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET)
    private readonly getTrustProfileQueryHandler: QueryHandler<
      GetTrustProfileQuery,
      TrustProfileAggregate | null
    >,

    @Inject(TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_BY_MEMBER_PUBLIC_ID)
    private readonly getTrustProfileByMemberPublicIdQueryHandler: QueryHandler<
      GetTrustProfileByMemberQuery,
      TrustProfileAggregate | null
    >,

    // ========================================================================
    // Rating Queries
    // ========================================================================

    @Inject(TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_RATINGS)
    private readonly getTrustProfileRatingsQueryHandler: QueryHandler<
      GetTrustProfileRatingsQuery,
      readonly TrustRatingEntity[]
    >,

    @Inject(TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_RATING)
    private readonly getTrustProfileRatingQueryHandler: QueryHandler<
      GetTrustProfileRatingQuery,
      TrustRatingEntity | null
    >,

    // ========================================================================
    // Review Queries
    // ========================================================================

    @Inject(TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_REVIEWS)
    private readonly getTrustProfileReviewsQueryHandler: QueryHandler<
      GetTrustProfileReviewsQuery,
      readonly TrustReviewEntity[]
    >,

    @Inject(TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_REVIEW)
    private readonly getTrustProfileReviewQueryHandler: QueryHandler<
      GetTrustProfileReviewQuery,
      TrustReviewEntity | null
    >,

    // ========================================================================
    // Badge Queries
    // ========================================================================

    @Inject(TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_BADGES)
    private readonly getTrustProfileBadgesQueryHandler: QueryHandler<
      GetTrustProfileBadgesQuery,
      readonly TrustProfileBadgeEntity[]
    >,

    @Inject(TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_BADGE)
    private readonly getTrustProfileBadgeQueryHandler: QueryHandler<
      GetTrustProfileBadgeQuery,
      TrustProfileBadgeEntity | null
    >,

    // ========================================================================
    // Event Queries
    // ========================================================================

    @Inject(TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_EVENTS)
    private readonly getTrustProfileEventsQueryHandler: QueryHandler<
      GetTrustProfileEventsQuery,
      readonly TrustEventEntity[]
    >,
  ) {}

  // ===========================================================================
  // PUBLIC TRUST PROFILE DISCOVERY
  // ===========================================================================
  //
  // Trust is a core part of the public SisiMove traveller experience.
  //
  // Visitors should be able to inspect a traveller's public trust profile
  // before deciding whether to interact with that traveller, without being
  // forced to authenticate first.
  //
  // The response mapper defines the public representation.
  //
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Trust Profile By Public ID
  // ---------------------------------------------------------------------------

  @Get('public/:publicId')
  public async getByPublicId(
    @Param('publicId') publicId: string,
  ): Promise<TrustProfileResponse | null> {
    const aggregate = await this.getTrustProfileQueryHandler.execute(
      new GetTrustProfileQuery(publicId),
    );

    return aggregate === null
      ? null
      : TrustProfileResponseMapper.fromAggregate(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Get Trust Profile By Member Public ID
  // ---------------------------------------------------------------------------

  @Get('member/:memberPublicId')
  public async getByMemberPublicId(
    @Param('memberPublicId') memberPublicId: string,
  ): Promise<TrustProfileResponse | null> {
    const aggregate =
      await this.getTrustProfileByMemberPublicIdQueryHandler.execute(
        new GetTrustProfileByMemberQuery(memberPublicId),
      );

    return aggregate === null
      ? null
      : TrustProfileResponseMapper.fromAggregate(aggregate);
  }

  // ===========================================================================
  // PROFILE COMMANDS
  // ===========================================================================
  //
  // Profile creation and state changes are authenticated operations.
  //
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Trust Profile
  // ---------------------------------------------------------------------------

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-profile:create')
  public async create(
    @Body() dto: CreateTrustProfileDto,
  ): Promise<TrustProfileResponse> {
    const aggregate = await this.createTrustProfileHandler.execute(
      new CreateTrustProfileCommand(
        dto.memberPublicId,
        undefined,
        undefined,
        randomUUID(),
      ),
    );

    return TrustProfileResponseMapper.fromAggregate(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Change Trust Profile Status
  // ---------------------------------------------------------------------------

  @Patch(':trustProfileId/status')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-profile:update')
  public async changeStatus(
    @Param('trustProfileId') trustProfileId: string,
    @Body() dto: ChangeTrustProfileStatusDto,
  ): Promise<void> {
    await this.changeTrustProfileStatusHandler.execute(
      new ChangeTrustProfileStatusCommand(
        trustProfileId,
        dto.status,
        randomUUID(),
      ),
    );
  }

  // ===========================================================================
  // VERIFICATION
  // ===========================================================================
  //
  // Verification state is public information when included in the public
  // TrustProfileResponse, but granting/revoking verification is privileged.
  //
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Grant Verification
  // ---------------------------------------------------------------------------

  @Post(':trustProfileId/verification')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-profile:update')
  public async grantVerification(
    @Param('trustProfileId') trustProfileId: string,
    @Body() dto: GrantTrustVerificationDto,
  ): Promise<void> {
    await this.grantTrustVerificationHandler.execute(
      new GrantTrustVerificationCommand(
        trustProfileId,
        dto.verificationLevel,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Revoke Verification
  // ---------------------------------------------------------------------------

  @Patch(':trustProfileId/verification/revoke')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-profile:update')
  public async revokeVerification(
    @Param('trustProfileId') trustProfileId: string,
  ): Promise<void> {
    await this.revokeTrustVerificationHandler.execute(
      new RevokeTrustVerificationCommand(trustProfileId, randomUUID()),
    );
  }

  // ===========================================================================
  // PUBLIC RATING DISCOVERY
  // ===========================================================================
  //
  // Ratings are part of the public trust/reputation surface.
  //
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Ratings
  // ---------------------------------------------------------------------------

  @Get(':trustProfileId/ratings')
  public async getRatings(
    @Param('trustProfileId') trustProfileId: string,
  ): Promise<TrustRatingResponse[]> {
    const ratings = await this.getTrustProfileRatingsQueryHandler.execute(
      new GetTrustProfileRatingsQuery(trustProfileId),
    );

    return TrustProfileResponseMapper.fromRatings([...ratings]);
  }

  // ---------------------------------------------------------------------------
  // Get Rating
  // ---------------------------------------------------------------------------

  @Get(':trustProfileId/ratings/:ratingId')
  public async getRating(
    @Param('trustProfileId') trustProfileId: string,
    @Param('ratingId') ratingId: string,
  ): Promise<TrustRatingResponse | null> {
    const rating = await this.getTrustProfileRatingQueryHandler.execute(
      new GetTrustProfileRatingQuery(trustProfileId, ratingId),
    );

    return rating === null
      ? null
      : TrustProfileResponseMapper.fromRating(rating);
  }

  // ===========================================================================
  // RATING COMMANDS
  // ===========================================================================
  //
  // Rating creation and modification require authentication.
  //
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Receive Rating
  // ---------------------------------------------------------------------------

  @Post(':trustProfileId/ratings')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-rating:create')
  public async receiveRating(
    @Param('trustProfileId') trustProfileId: string,
    @Body() dto: ReceiveTrustRatingDto,
  ): Promise<void> {
    await this.receiveTrustRatingHandler.execute(
      new ReceiveTrustRatingCommand(
        trustProfileId,
        dto.ratingId,
        dto.reviewerPublicId,
        dto.revieweePublicId,
        dto.journeyPublicId,
        dto.bookingPublicId,
        dto.role,
        dto.score,
        undefined,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Change Rating Score
  // ---------------------------------------------------------------------------

  @Patch(':trustProfileId/ratings/:ratingId/score')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-rating:update')
  public async changeRatingScore(
    @Param('trustProfileId') trustProfileId: string,
    @Param('ratingId') ratingId: string,
    @Body() dto: ChangeTrustRatingScoreDto,
  ): Promise<void> {
    await this.changeTrustRatingScoreHandler.execute(
      new ChangeTrustRatingScoreCommand(
        trustProfileId,
        ratingId,
        new TrustRatingScore(dto.score),
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Hide Rating
  // ---------------------------------------------------------------------------

  @Patch(':trustProfileId/ratings/:ratingId/hide')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-rating:moderate')
  public async hideRating(
    @Param('trustProfileId') trustProfileId: string,
    @Param('ratingId') ratingId: string,
    @Body() dto: HideTrustRatingDto,
  ): Promise<void> {
    await this.hideTrustRatingHandler.execute(
      new HideTrustRatingCommand(
        trustProfileId,
        ratingId,
        dto.reason,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Remove Rating
  // ---------------------------------------------------------------------------

  @Patch(':trustProfileId/ratings/:ratingId/remove')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-rating:moderate')
  public async removeRating(
    @Param('trustProfileId') trustProfileId: string,
    @Param('ratingId') ratingId: string,
    @Body() dto: RemoveTrustRatingDto,
  ): Promise<void> {
    await this.removeTrustRatingHandler.execute(
      new RemoveTrustRatingCommand(
        trustProfileId,
        ratingId,
        dto.reason,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Restore Rating
  // ---------------------------------------------------------------------------

  @Patch(':trustProfileId/ratings/:ratingId/restore')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-rating:moderate')
  public async restoreRating(
    @Param('trustProfileId') trustProfileId: string,
    @Param('ratingId') ratingId: string,
  ): Promise<void> {
    await this.restoreTrustRatingHandler.execute(
      new RestoreTrustRatingCommand(trustProfileId, ratingId, randomUUID()),
    );
  }

  // ===========================================================================
  // PUBLIC REVIEW DISCOVERY
  // ===========================================================================
  //
  // Reviews contribute directly to the public reputation experience.
  //
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Reviews
  // ---------------------------------------------------------------------------

  @Get(':trustProfileId/reviews')
  public async getReviews(
    @Param('trustProfileId') trustProfileId: string,
  ): Promise<TrustReviewResponse[]> {
    const reviews = await this.getTrustProfileReviewsQueryHandler.execute(
      new GetTrustProfileReviewsQuery(trustProfileId),
    );

    return TrustProfileResponseMapper.fromReviews([...reviews]);
  }

  // ---------------------------------------------------------------------------
  // Get Review
  // ---------------------------------------------------------------------------

  @Get(':trustProfileId/reviews/:reviewId')
  public async getReview(
    @Param('trustProfileId') trustProfileId: string,
    @Param('reviewId') reviewId: string,
  ): Promise<TrustReviewResponse | null> {
    const review = await this.getTrustProfileReviewQueryHandler.execute(
      new GetTrustProfileReviewQuery(trustProfileId, reviewId),
    );

    return review === null
      ? null
      : TrustProfileResponseMapper.fromReview(review);
  }

  // ===========================================================================
  // REVIEW COMMANDS
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Review
  // ---------------------------------------------------------------------------

  @Post(':trustProfileId/reviews')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-review:create')
  public async createReview(
    @Param('trustProfileId') trustProfileId: string,
    @Body() dto: CreateTrustReviewDto,
  ): Promise<void> {
    await this.createTrustReviewHandler.execute(
      new CreateTrustReviewCommand(
        trustProfileId,
        dto.reviewId,
        dto.ratingId,
        dto.content,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Update Review
  // ---------------------------------------------------------------------------

  @Patch(':trustProfileId/reviews/:reviewId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-review:update')
  public async updateReview(
    @Param('trustProfileId') trustProfileId: string,
    @Param('reviewId') reviewId: string,
    @Body() dto: UpdateTrustReviewDto,
  ): Promise<void> {
    await this.updateTrustReviewHandler.execute(
      new UpdateTrustReviewCommand(
        trustProfileId,
        reviewId,
        dto.content,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Remove Review
  // ---------------------------------------------------------------------------

  @Patch(':trustProfileId/reviews/:reviewId/remove')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-review:moderate')
  public async removeReview(
    @Param('trustProfileId') trustProfileId: string,
    @Param('reviewId') reviewId: string,
    @Body() dto: RemoveTrustReviewDto,
  ): Promise<void> {
    await this.removeTrustReviewHandler.execute(
      new RemoveTrustReviewCommand(
        trustProfileId,
        reviewId,
        dto.reason,
        randomUUID(),
      ),
    );
  }

  // ===========================================================================
  // PUBLIC BADGE DISCOVERY
  // ===========================================================================
  //
  // Trust badges are public reputation signals.
  //
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Badges
  // ---------------------------------------------------------------------------

  @Get(':trustProfileId/badges')
  public async getBadges(
    @Param('trustProfileId') trustProfileId: string,
  ): Promise<TrustProfileBadgeResponse[]> {
    const profileBadges = await this.getTrustProfileBadgesQueryHandler.execute(
      new GetTrustProfileBadgesQuery(trustProfileId),
    );

    return TrustProfileResponseMapper.fromProfileBadges([...profileBadges]);
  }

  // ---------------------------------------------------------------------------
  // Get Badge
  // ---------------------------------------------------------------------------

  @Get(':trustProfileId/badges/:profileBadgeId')
  public async getBadge(
    @Param('trustProfileId') trustProfileId: string,
    @Param('profileBadgeId') profileBadgeId: string,
  ): Promise<TrustProfileBadgeResponse | null> {
    const profileBadge = await this.getTrustProfileBadgeQueryHandler.execute(
      new GetTrustProfileBadgeQuery(trustProfileId, profileBadgeId),
    );

    return profileBadge === null
      ? null
      : TrustProfileResponseMapper.fromProfileBadge(profileBadge);
  }

  // ===========================================================================
  // BADGE COMMANDS
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Award Badge
  // ---------------------------------------------------------------------------

  @Post(':trustProfileId/badges')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-badge:award')
  public async awardBadge(
    @Param('trustProfileId') trustProfileId: string,
    @Body() dto: AwardTrustBadgeDto,
  ): Promise<void> {
    await this.awardTrustBadgeHandler.execute(
      new AwardTrustBadgeCommand(
        trustProfileId,
        dto.badgeId,
        dto.profileBadgeId,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Revoke Badge
  // ---------------------------------------------------------------------------

  @Patch(':trustProfileId/badges/:profileBadgeId/revoke')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-badge:revoke')
  public async revokeBadge(
    @Param('trustProfileId') trustProfileId: string,
    @Param('profileBadgeId') profileBadgeId: string,
    @Body() dto: RevokeTrustBadgeDto,
  ): Promise<void> {
    await this.revokeTrustBadgeHandler.execute(
      new RevokeTrustBadgeCommand(
        trustProfileId,
        profileBadgeId,
        dto.reason,
        randomUUID(),
      ),
    );
  }

  // ===========================================================================
  // INTERNAL TRUST EVENT QUERIES
  // ===========================================================================
  //
  // Trust events are operational/audit information and are therefore not part
  // of the anonymous public trust profile.
  //
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Trust Events
  // ---------------------------------------------------------------------------

  @Get(':trustProfileId/events')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-profile:read')
  public async getEvents(
    @Param('trustProfileId') trustProfileId: string,
  ): Promise<TrustEventResponse[]> {
    const events = await this.getTrustProfileEventsQueryHandler.execute(
      new GetTrustProfileEventsQuery(trustProfileId),
    );

    return TrustProfileResponseMapper.fromEvents([...events]);
  }

  // ===========================================================================
  // JOURNEY PROJECTIONS
  // ===========================================================================
  //
  // These operations project journey outcomes into the Trust domain.
  // They are internal/application-level operations and remain protected.
  //
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Apply Journey Completed
  // ---------------------------------------------------------------------------

  @Post(':trustProfileId/journeys/completed')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-profile:project')
  public async applyJourneyCompleted(
    @Param('trustProfileId') trustProfileId: string,
    @Body() dto: ApplyTrustJourneyCompletedDto,
  ): Promise<void> {
    await this.applyTrustJourneyCompletedHandler.execute(
      new ApplyJourneyCompletedCommand(
        trustProfileId,
        dto.journeyPublicId,
        dto.role,
        dto.bookingPublicId,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Apply Journey Cancelled
  // ---------------------------------------------------------------------------

  @Post(':trustProfileId/journeys/cancelled')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-profile:project')
  public async applyJourneyCancelled(
    @Param('trustProfileId') trustProfileId: string,
    @Body() dto: ApplyTrustJourneyCancelledDto,
  ): Promise<void> {
    await this.applyTrustJourneyCancelledHandler.execute(
      new ApplyJourneyCancelledCommand(
        trustProfileId,
        dto.journeyPublicId,
        dto.role,
        dto.bookingPublicId,
        dto.reason,
        randomUUID(),
      ),
    );
  }

  // ===========================================================================
  // DISPUTES
  // ===========================================================================
  //
  // Dispute projections are protected operational operations.
  //
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Apply Dispute Opened
  // ---------------------------------------------------------------------------

  @Post(':trustProfileId/disputes/opened')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-profile:project')
  public async applyDisputeOpened(
    @Param('trustProfileId') trustProfileId: string,
    @Body() dto: ApplyTrustDisputeOpenedDto,
  ): Promise<void> {
    await this.applyTrustDisputeOpenedHandler.execute(
      new ApplyTrustDisputeOpenedCommand(
        trustProfileId,
        dto.disputePublicId,
        dto.journeyPublicId,
        dto.bookingPublicId,
        dto.actorPublicId,
        dto.reason,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Apply Dispute Resolved
  // ---------------------------------------------------------------------------

  @Post(':trustProfileId/disputes/resolved')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-profile:project')
  public async applyDisputeResolved(
    @Param('trustProfileId') trustProfileId: string,
    @Body() dto: ApplyTrustDisputeResolvedDto,
  ): Promise<void> {
    await this.applyTrustDisputeResolvedHandler.execute(
      new ApplyTrustDisputeResolvedCommand(
        trustProfileId,
        dto.disputePublicId,
        dto.journeyPublicId,
        dto.bookingPublicId,
        dto.actorPublicId,
        dto.resolution,
        randomUUID(),
      ),
    );
  }

  // ===========================================================================
  // MANUAL TRUST ADJUSTMENT
  // ===========================================================================
  //
  // Manual trust adjustments are privileged administrative operations.
  //
  // ===========================================================================

  @Post(':trustProfileId/adjustments')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-profile:adjust')
  public async applyManualAdjustment(
    @Param('trustProfileId') trustProfileId: string,
    @Body() dto: ApplyTrustManualAdjustmentDto,
  ): Promise<void> {
    await this.applyTrustManualAdjustmentHandler.execute(
      new ApplyTrustManualAdjustmentCommand(
        trustProfileId,
        dto.actorPublicId,
        dto.reason,
        dto.adjustment,
        dto.metadata,
        randomUUID(),
      ),
    );
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default TrustProfileController;
