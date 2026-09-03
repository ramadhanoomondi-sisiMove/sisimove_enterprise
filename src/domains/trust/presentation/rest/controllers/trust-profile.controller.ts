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

import { ApiTags } from '@nestjs/swagger';

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

// -----------------------------------------------------------------------------
// Controller
// -----------------------------------------------------------------------------

@ApiTags('Trust Profiles')
@Controller('trust-profiles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
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
  // PROFILE QUERIES
  // ===========================================================================

  @Get('public/:publicId')
  @RequirePermissions('trust-profile:read')
  async getByPublicId(
    @Param('publicId') publicId: string,
  ): Promise<TrustProfileResponse | null> {
    const aggregate = await this.getTrustProfileQueryHandler.execute(
      new GetTrustProfileQuery(publicId),
    );

    return aggregate === null
      ? null
      : TrustProfileResponseMapper.fromAggregate(aggregate);
  }

  @Get('member/:memberPublicId')
  @RequirePermissions('trust-profile:read')
  async getByMemberPublicId(
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

  @Post()
  @RequirePermissions('trust-profile:create')
  async create(
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

  @Patch(':trustProfileId/status')
  @RequirePermissions('trust-profile:update')
  async changeStatus(
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

  @Post(':trustProfileId/verification')
  @RequirePermissions('trust-profile:update')
  async grantVerification(
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

  @Patch(':trustProfileId/verification/revoke')
  @RequirePermissions('trust-profile:update')
  async revokeVerification(
    @Param('trustProfileId') trustProfileId: string,
  ): Promise<void> {
    await this.revokeTrustVerificationHandler.execute(
      new RevokeTrustVerificationCommand(trustProfileId, randomUUID()),
    );
  }

  // ===========================================================================
  // RATING QUERIES
  // ===========================================================================

  @Get(':trustProfileId/ratings')
  @RequirePermissions('trust-rating:read')
  async getRatings(
    @Param('trustProfileId') trustProfileId: string,
  ): Promise<TrustRatingResponse[]> {
    const ratings = await this.getTrustProfileRatingsQueryHandler.execute(
      new GetTrustProfileRatingsQuery(trustProfileId),
    );

    return TrustProfileResponseMapper.fromRatings([...ratings]);
  }

  @Get(':trustProfileId/ratings/:ratingId')
  @RequirePermissions('trust-rating:read')
  async getRating(
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

  @Post(':trustProfileId/ratings')
  @RequirePermissions('trust-rating:create')
  async receiveRating(
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

  @Patch(':trustProfileId/ratings/:ratingId/score')
  @RequirePermissions('trust-rating:update')
  async changeRatingScore(
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

  @Patch(':trustProfileId/ratings/:ratingId/hide')
  @RequirePermissions('trust-rating:moderate')
  async hideRating(
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

  @Patch(':trustProfileId/ratings/:ratingId/remove')
  @RequirePermissions('trust-rating:moderate')
  async removeRating(
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

  @Patch(':trustProfileId/ratings/:ratingId/restore')
  @RequirePermissions('trust-rating:moderate')
  async restoreRating(
    @Param('trustProfileId') trustProfileId: string,
    @Param('ratingId') ratingId: string,
  ): Promise<void> {
    await this.restoreTrustRatingHandler.execute(
      new RestoreTrustRatingCommand(trustProfileId, ratingId, randomUUID()),
    );
  }

  // ===========================================================================
  // REVIEW QUERIES
  // ===========================================================================

  @Get(':trustProfileId/reviews')
  @RequirePermissions('trust-review:read')
  async getReviews(
    @Param('trustProfileId') trustProfileId: string,
  ): Promise<TrustReviewResponse[]> {
    const reviews = await this.getTrustProfileReviewsQueryHandler.execute(
      new GetTrustProfileReviewsQuery(trustProfileId),
    );

    return TrustProfileResponseMapper.fromReviews([...reviews]);
  }

  @Get(':trustProfileId/reviews/:reviewId')
  @RequirePermissions('trust-review:read')
  async getReview(
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

  @Post(':trustProfileId/reviews')
  @RequirePermissions('trust-review:create')
  async createReview(
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

  @Patch(':trustProfileId/reviews/:reviewId')
  @RequirePermissions('trust-review:update')
  async updateReview(
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

  @Patch(':trustProfileId/reviews/:reviewId/remove')
  @RequirePermissions('trust-review:moderate')
  async removeReview(
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
  // BADGE QUERIES
  // ===========================================================================

  @Get(':trustProfileId/badges')
  @RequirePermissions('trust-badge:read')
  async getBadges(
    @Param('trustProfileId') trustProfileId: string,
  ): Promise<TrustProfileBadgeResponse[]> {
    const profileBadges = await this.getTrustProfileBadgesQueryHandler.execute(
      new GetTrustProfileBadgesQuery(trustProfileId),
    );

    return TrustProfileResponseMapper.fromProfileBadges([...profileBadges]);
  }

  @Get(':trustProfileId/badges/:profileBadgeId')
  @RequirePermissions('trust-badge:read')
  async getBadge(
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

  @Post(':trustProfileId/badges')
  @RequirePermissions('trust-badge:award')
  async awardBadge(
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

  @Patch(':trustProfileId/badges/:profileBadgeId/revoke')
  @RequirePermissions('trust-badge:revoke')
  async revokeBadge(
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
  // EVENT QUERIES
  // ===========================================================================

  @Get(':trustProfileId/events')
  @RequirePermissions('trust-profile:read')
  async getEvents(
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

  @Post(':trustProfileId/journeys/completed')
  @RequirePermissions('trust-profile:project')
  async applyJourneyCompleted(
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

  @Post(':trustProfileId/journeys/cancelled')
  @RequirePermissions('trust-profile:project')
  async applyJourneyCancelled(
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

  @Post(':trustProfileId/disputes/opened')
  @RequirePermissions('trust-profile:project')
  async applyDisputeOpened(
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

  @Post(':trustProfileId/disputes/resolved')
  @RequirePermissions('trust-profile:project')
  async applyDisputeResolved(
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
  // MANUAL ADJUSTMENT
  // ===========================================================================

  @Post(':trustProfileId/adjustments')
  @RequirePermissions('trust-profile:adjust')
  async applyManualAdjustment(
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
