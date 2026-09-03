// -----------------------------------------------------------------------------
// Journey Completion — HTTP Controller
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

import { ApiTags } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Authentication / Authorization
// -----------------------------------------------------------------------------

import {
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../../../../../foundation/security/auth';

// -----------------------------------------------------------------------------
// Foundation Application Contracts
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_COMPLETION_TOKENS } from '../../../application/journey-completion.tokens';

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

import {
  CancelJourneyCompletionCommand,
  ConfirmJourneyCompletionCommand,
  CreateJourneyCompletionCommand,
  OpenJourneyCompletionDisputeCommand,
  RejectJourneyCompletionDisputeCommand,
  RequestJourneyCompletionCommand,
  ResolveJourneyCompletionDisputeCommand,
  ReviewJourneyCompletionDisputeCommand,
  WithdrawJourneyCompletionConfirmationCommand,
  WithdrawJourneyCompletionDisputeCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

import {
  GetJourneyCompletionByJourneyQuery,
  GetJourneyCompletionConfirmationQuery,
  GetJourneyCompletionConfirmationsQuery,
  GetJourneyCompletionDisputeQuery,
  GetJourneyCompletionDisputesQuery,
  GetJourneyCompletionQuery,
  ListJourneyCompletionsByProviderQuery,
  ListJourneyCompletionsByStatusQuery,
  ListJourneyCompletionsQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { JourneyCompletionAggregate } from '../../../domain/aggregates/journey-completion.aggregate';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { JourneyCompletionEntity } from '../../../domain/entities/journey-completion.entity';

import type { JourneyCompletionConfirmationEntity } from '../../../domain/entities/journey-completion-confirmation.entity';

import type { JourneyCompletionDisputeEntity } from '../../../domain/entities/journey-completion-dispute.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyCompletionDisputePublicId,
  JourneyCompletionJourneyPublicId,
  JourneyCompletionMemberPublicId,
  JourneyCompletionProviderPublicId,
  JourneyCompletionPublicId,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Request DTOs
// -----------------------------------------------------------------------------

import {
  CancelJourneyCompletionDto,
  ConfirmJourneyCompletionDto,
  CreateJourneyCompletionDto,
  OpenJourneyCompletionDisputeDto,
  RejectJourneyCompletionDisputeDto,
  RequestJourneyCompletionDto,
  ResolveJourneyCompletionDisputeDto,
  ReviewJourneyCompletionDisputeDto,
  WithdrawJourneyCompletionConfirmationDto,
  WithdrawJourneyCompletionDisputeDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Query DTOs
// -----------------------------------------------------------------------------

import {
  GetJourneyCompletionConfirmationsQueryDto,
  GetJourneyCompletionDisputesQueryDto,
  GetJourneyCompletionQueryDto,
  ListJourneyCompletionsByProviderQueryDto,
  ListJourneyCompletionsByStatusQueryDto,
  ListJourneyCompletionsQueryDto,
} from '../dto/query';

// -----------------------------------------------------------------------------
// Request Type
// -----------------------------------------------------------------------------

interface AuthenticatedRequest {
  user: {
    publicId: string;
  };
}

// -----------------------------------------------------------------------------
// Controller
// -----------------------------------------------------------------------------

@ApiTags('Journey Completions')
@Controller('journey-completions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class JourneyCompletionController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // =========================================================================
    // Journey Completion Lifecycle Commands
    // =========================================================================

    @Inject(JOURNEY_COMPLETION_TOKENS.COMMAND_HANDLERS.CREATE)
    private readonly createJourneyCompletionHandler: CommandHandler<
      CreateJourneyCompletionCommand,
      JourneyCompletionAggregate
    >,

    @Inject(JOURNEY_COMPLETION_TOKENS.COMMAND_HANDLERS.REQUEST)
    private readonly requestJourneyCompletionHandler: CommandHandler<
      RequestJourneyCompletionCommand,
      JourneyCompletionAggregate
    >,

    @Inject(JOURNEY_COMPLETION_TOKENS.COMMAND_HANDLERS.CONFIRM)
    private readonly confirmJourneyCompletionHandler: CommandHandler<
      ConfirmJourneyCompletionCommand,
      JourneyCompletionAggregate
    >,

    @Inject(JOURNEY_COMPLETION_TOKENS.COMMAND_HANDLERS.WITHDRAW_CONFIRMATION)
    private readonly withdrawJourneyCompletionConfirmationHandler: CommandHandler<
      WithdrawJourneyCompletionConfirmationCommand,
      JourneyCompletionAggregate
    >,

    @Inject(JOURNEY_COMPLETION_TOKENS.COMMAND_HANDLERS.CANCEL)
    private readonly cancelJourneyCompletionHandler: CommandHandler<
      CancelJourneyCompletionCommand,
      JourneyCompletionAggregate
    >,

    // =========================================================================
    // Journey Completion Dispute Commands
    // =========================================================================

    @Inject(JOURNEY_COMPLETION_TOKENS.COMMAND_HANDLERS.OPEN_DISPUTE)
    private readonly openJourneyCompletionDisputeHandler: CommandHandler<
      OpenJourneyCompletionDisputeCommand,
      JourneyCompletionAggregate
    >,

    @Inject(JOURNEY_COMPLETION_TOKENS.COMMAND_HANDLERS.REVIEW_DISPUTE)
    private readonly reviewJourneyCompletionDisputeHandler: CommandHandler<
      ReviewJourneyCompletionDisputeCommand,
      JourneyCompletionAggregate
    >,

    @Inject(JOURNEY_COMPLETION_TOKENS.COMMAND_HANDLERS.RESOLVE_DISPUTE)
    private readonly resolveJourneyCompletionDisputeHandler: CommandHandler<
      ResolveJourneyCompletionDisputeCommand,
      JourneyCompletionAggregate
    >,

    @Inject(JOURNEY_COMPLETION_TOKENS.COMMAND_HANDLERS.REJECT_DISPUTE)
    private readonly rejectJourneyCompletionDisputeHandler: CommandHandler<
      RejectJourneyCompletionDisputeCommand,
      JourneyCompletionAggregate
    >,

    @Inject(JOURNEY_COMPLETION_TOKENS.COMMAND_HANDLERS.WITHDRAW_DISPUTE)
    private readonly withdrawJourneyCompletionDisputeHandler: CommandHandler<
      WithdrawJourneyCompletionDisputeCommand,
      JourneyCompletionAggregate
    >,

    // =========================================================================
    // Journey Completion Queries
    // =========================================================================

    @Inject(JOURNEY_COMPLETION_TOKENS.QUERY_HANDLERS.GET)
    private readonly getJourneyCompletionHandler: QueryHandler<
      GetJourneyCompletionQuery,
      JourneyCompletionAggregate | null
    >,

    @Inject(JOURNEY_COMPLETION_TOKENS.QUERY_HANDLERS.GET_BY_JOURNEY)
    private readonly getJourneyCompletionByJourneyHandler: QueryHandler<
      GetJourneyCompletionByJourneyQuery,
      JourneyCompletionEntity | null
    >,

    @Inject(JOURNEY_COMPLETION_TOKENS.QUERY_HANDLERS.LIST)
    private readonly listJourneyCompletionsHandler: QueryHandler<
      ListJourneyCompletionsQuery,
      JourneyCompletionEntity[]
    >,

    @Inject(JOURNEY_COMPLETION_TOKENS.QUERY_HANDLERS.LIST_BY_PROVIDER)
    private readonly listJourneyCompletionsByProviderHandler: QueryHandler<
      ListJourneyCompletionsByProviderQuery,
      JourneyCompletionEntity[]
    >,

    @Inject(JOURNEY_COMPLETION_TOKENS.QUERY_HANDLERS.LIST_BY_STATUS)
    private readonly listJourneyCompletionsByStatusHandler: QueryHandler<
      ListJourneyCompletionsByStatusQuery,
      JourneyCompletionEntity[]
    >,

    // =========================================================================
    // Confirmation Queries
    // =========================================================================

    @Inject(JOURNEY_COMPLETION_TOKENS.QUERY_HANDLERS.GET_CONFIRMATIONS)
    private readonly getJourneyCompletionConfirmationsHandler: QueryHandler<
      GetJourneyCompletionConfirmationsQuery,
      JourneyCompletionConfirmationEntity[]
    >,

    @Inject(JOURNEY_COMPLETION_TOKENS.QUERY_HANDLERS.GET_CONFIRMATION)
    private readonly getJourneyCompletionConfirmationHandler: QueryHandler<
      GetJourneyCompletionConfirmationQuery,
      JourneyCompletionConfirmationEntity | null
    >,

    // =========================================================================
    // Dispute Queries
    // =========================================================================

    @Inject(JOURNEY_COMPLETION_TOKENS.QUERY_HANDLERS.GET_DISPUTES)
    private readonly getJourneyCompletionDisputesHandler: QueryHandler<
      GetJourneyCompletionDisputesQuery,
      JourneyCompletionDisputeEntity[]
    >,

    @Inject(JOURNEY_COMPLETION_TOKENS.QUERY_HANDLERS.GET_DISPUTE)
    private readonly getJourneyCompletionDisputeHandler: QueryHandler<
      GetJourneyCompletionDisputeQuery,
      JourneyCompletionDisputeEntity | null
    >,
  ) {}

  // ===========================================================================
  // QUERY ENDPOINTS
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // List Journey Completions
  // ---------------------------------------------------------------------------

  @Get()
  @RequirePermissions('journey-completion:read')
  public async list(
    @Query() dto: ListJourneyCompletionsQueryDto,
  ): Promise<JourneyCompletionEntity[]> {
    return this.listJourneyCompletionsHandler.execute(
      new ListJourneyCompletionsQuery({
        ...(dto.journeyPublicId !== undefined
          ? { journeyPublicId: dto.journeyPublicId }
          : {}),
        ...(dto.providerPublicId !== undefined
          ? { providerPublicId: dto.providerPublicId }
          : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
      }),
    );
  }

  // ---------------------------------------------------------------------------
  // List By Provider
  // ---------------------------------------------------------------------------

  @Get('by-provider')
  @RequirePermissions('journey-completion:read')
  public async listByProvider(
    @Query() dto: ListJourneyCompletionsByProviderQueryDto,
  ): Promise<JourneyCompletionEntity[]> {
    return this.listJourneyCompletionsByProviderHandler.execute(
      new ListJourneyCompletionsByProviderQuery({
        providerPublicId: dto.providerPublicId,
        ...(dto.status !== undefined ? { status: dto.status } : {}),
      }),
    );
  }

  // ---------------------------------------------------------------------------
  // List By Status
  // ---------------------------------------------------------------------------

  @Get('by-status')
  @RequirePermissions('journey-completion:read')
  public async listByStatus(
    @Query() dto: ListJourneyCompletionsByStatusQueryDto,
  ): Promise<JourneyCompletionEntity[]> {
    return this.listJourneyCompletionsByStatusHandler.execute(
      new ListJourneyCompletionsByStatusQuery({
        status: dto.status,
        ...(dto.providerPublicId !== undefined
          ? { providerPublicId: dto.providerPublicId }
          : {}),
        ...(dto.journeyPublicId !== undefined
          ? { journeyPublicId: dto.journeyPublicId }
          : {}),
      }),
    );
  }

  // ---------------------------------------------------------------------------
  // Get By Journey
  // ---------------------------------------------------------------------------

  @Get('by-journey/:journeyPublicId')
  @RequirePermissions('journey-completion:read')
  public async getByJourney(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<JourneyCompletionEntity | null> {
    return this.getJourneyCompletionByJourneyHandler.execute(
      new GetJourneyCompletionByJourneyQuery({
        journeyPublicId,
      }),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Confirmations
  // ---------------------------------------------------------------------------

  @Get(':journeyCompletionPublicId/confirmations')
  @RequirePermissions('journey-completion:read')
  public async getConfirmations(
    @Param('journeyCompletionPublicId') journeyCompletionPublicId: string,
    @Query() dto: GetJourneyCompletionConfirmationsQueryDto,
  ): Promise<JourneyCompletionConfirmationEntity[]> {
    return this.getJourneyCompletionConfirmationsHandler.execute(
      new GetJourneyCompletionConfirmationsQuery({
        completionPublicId: journeyCompletionPublicId,
        ...(dto.memberPublicId !== undefined
          ? { memberPublicId: dto.memberPublicId }
          : {}),
        ...(dto.bookingPublicId !== undefined
          ? { bookingPublicId: dto.bookingPublicId }
          : {}),
        ...(dto.role !== undefined ? { role: dto.role } : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
      }),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Confirmation
  // ---------------------------------------------------------------------------

  @Get(':journeyCompletionPublicId/confirmations/:confirmationPublicId')
  @RequirePermissions('journey-completion:read')
  public async getConfirmation(
    @Param('journeyCompletionPublicId') journeyCompletionPublicId: string,
    @Param('confirmationPublicId') confirmationPublicId: string,
  ): Promise<JourneyCompletionConfirmationEntity | null> {
    return this.getJourneyCompletionConfirmationHandler.execute(
      new GetJourneyCompletionConfirmationQuery({
        completionPublicId: journeyCompletionPublicId,
        confirmationPublicId,
      }),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Disputes
  // ---------------------------------------------------------------------------

  @Get(':journeyCompletionPublicId/disputes')
  @RequirePermissions('journey-completion:read')
  public async getDisputes(
    @Param('journeyCompletionPublicId') journeyCompletionPublicId: string,
    @Query() dto: GetJourneyCompletionDisputesQueryDto,
  ): Promise<JourneyCompletionDisputeEntity[]> {
    return this.getJourneyCompletionDisputesHandler.execute(
      new GetJourneyCompletionDisputesQuery({
        completionPublicId: journeyCompletionPublicId,
        ...(dto.raisedByPublicId !== undefined
          ? { raisedByPublicId: dto.raisedByPublicId }
          : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.reason !== undefined ? { reason: dto.reason } : {}),
      }),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Dispute
  // ---------------------------------------------------------------------------

  @Get(':journeyCompletionPublicId/disputes/:disputePublicId')
  @RequirePermissions('journey-completion:read')
  public async getDispute(
    @Param('journeyCompletionPublicId') journeyCompletionPublicId: string,
    @Param('disputePublicId') disputePublicId: string,
  ): Promise<JourneyCompletionDisputeEntity | null> {
    return this.getJourneyCompletionDisputeHandler.execute(
      new GetJourneyCompletionDisputeQuery({
        completionPublicId: journeyCompletionPublicId,
        disputePublicId,
      }),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Journey Completion
  // ---------------------------------------------------------------------------

  @Get(':journeyCompletionPublicId')
  @RequirePermissions('journey-completion:read')
  public async get(
    @Param('journeyCompletionPublicId') journeyCompletionPublicId: string,
    @Query() dto: GetJourneyCompletionQueryDto,
  ): Promise<JourneyCompletionAggregate | null> {
    return this.getJourneyCompletionHandler.execute(
      new GetJourneyCompletionQuery({
        journeyCompletionPublicId,
        ...(dto.journeyPublicId !== undefined
          ? { journeyPublicId: dto.journeyPublicId }
          : {}),
        ...(dto.providerPublicId !== undefined
          ? { providerPublicId: dto.providerPublicId }
          : {}),
      }),
    );
  }

  // ===========================================================================
  // CREATE
  // ===========================================================================

  @Post()
  @RequirePermissions('journey-completion:create')
  public async create(
    @Body() dto: CreateJourneyCompletionDto,
  ): Promise<JourneyCompletionAggregate> {
    return this.createJourneyCompletionHandler.execute(
      new CreateJourneyCompletionCommand(
        new JourneyCompletionJourneyPublicId(dto.journeyPublicId),
        new JourneyCompletionProviderPublicId(dto.providerPublicId),
        dto.requiredConfirmations,
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  // ===========================================================================
  // REQUEST COMPLETION
  // ===========================================================================

  @Post(':journeyCompletionPublicId/request')
  @RequirePermissions('journey-completion:request')
  public async requestCompletion(
    @Param('journeyCompletionPublicId') journeyCompletionPublicId: string,
    @Body() dto: RequestJourneyCompletionDto,
  ): Promise<JourneyCompletionAggregate> {
    return this.requestJourneyCompletionHandler.execute(
      new RequestJourneyCompletionCommand(
        new JourneyCompletionPublicId(journeyCompletionPublicId),
        dto.correlationId,
        dto.causationId,
        dto.requestedAt !== undefined ? new Date(dto.requestedAt) : undefined,
      ),
    );
  }

  // ===========================================================================
  // CONFIRM
  // ===========================================================================

  @Post(':journeyCompletionPublicId/confirm')
  @RequirePermissions('journey-completion:confirm')
  public async confirm(
    @Param('journeyCompletionPublicId') journeyCompletionPublicId: string,
    @Body() dto: ConfirmJourneyCompletionDto,
  ): Promise<JourneyCompletionAggregate> {
    return this.confirmJourneyCompletionHandler.execute(
      new ConfirmJourneyCompletionCommand(
        new JourneyCompletionPublicId(journeyCompletionPublicId),
        dto.correlationId,
        dto.causationId,
        dto.confirmedAt !== undefined ? new Date(dto.confirmedAt) : undefined,
      ),
    );
  }

  // ===========================================================================
  // WITHDRAW CONFIRMATION
  // ===========================================================================

  @Post(
    ':journeyCompletionPublicId/confirmations/:confirmationPublicId/withdraw',
  )
  @RequirePermissions('journey-completion:confirmation:withdraw')
  public async withdrawConfirmation(
    @Param('journeyCompletionPublicId') journeyCompletionPublicId: string,
    @Param('confirmationPublicId') confirmationPublicId: string,
    @Body() dto: WithdrawJourneyCompletionConfirmationDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<JourneyCompletionAggregate> {
    const memberPublicId = dto.memberPublicId ?? request.user.publicId;

    return this.withdrawJourneyCompletionConfirmationHandler.execute(
      new WithdrawJourneyCompletionConfirmationCommand(
        journeyCompletionPublicId,
        confirmationPublicId,
        memberPublicId,
        dto.correlationId,
        dto.causationId,
      ),
    );
  }
  // ===========================================================================
  // OPEN DISPUTE
  // ===========================================================================

  @Post(':journeyCompletionPublicId/disputes')
  @RequirePermissions('journey-completion:dispute:open')
  public async openDispute(
    @Param('journeyCompletionPublicId') journeyCompletionPublicId: string,
    @Body() dto: OpenJourneyCompletionDisputeDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<JourneyCompletionAggregate> {
    const raisedByPublicId = dto.raisedByPublicId ?? request.user.publicId;

    const domainValues = dto.toDomainValues();

    return this.openJourneyCompletionDisputeHandler.execute(
      new OpenJourneyCompletionDisputeCommand(
        new JourneyCompletionPublicId(journeyCompletionPublicId),
        new JourneyCompletionMemberPublicId(raisedByPublicId),
        domainValues.reason,
        domainValues.description,
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  // ===========================================================================
  // REVIEW DISPUTE
  // ===========================================================================

  @Post(':journeyCompletionPublicId/disputes/:disputePublicId/review')
  @RequirePermissions('journey-completion:dispute:review')
  public async reviewDispute(
    @Param('disputePublicId') disputePublicId: string,
    @Body() dto: ReviewJourneyCompletionDisputeDto,
  ): Promise<JourneyCompletionAggregate> {
    return this.reviewJourneyCompletionDisputeHandler.execute(
      new ReviewJourneyCompletionDisputeCommand(
        new JourneyCompletionDisputePublicId(disputePublicId),
        dto.correlationId,
        dto.causationId,
        dto.underReviewAt !== undefined
          ? new Date(dto.underReviewAt)
          : undefined,
      ),
    );
  }

  // ===========================================================================
  // RESOLVE DISPUTE
  // ===========================================================================

  @Post(':journeyCompletionPublicId/disputes/:disputePublicId/resolve')
  @RequirePermissions('journey-completion:dispute:resolve')
  public async resolveDispute(
    @Param('journeyCompletionPublicId') journeyCompletionPublicId: string,
    @Param('disputePublicId') disputePublicId: string,
    @Body() dto: ResolveJourneyCompletionDisputeDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<JourneyCompletionAggregate> {
    const resolvedByPublicId = dto.resolvedByPublicId ?? request.user.publicId;

    return this.resolveJourneyCompletionDisputeHandler.execute(
      new ResolveJourneyCompletionDisputeCommand(
        new JourneyCompletionPublicId(journeyCompletionPublicId),
        new JourneyCompletionDisputePublicId(disputePublicId),
        new JourneyCompletionMemberPublicId(resolvedByPublicId),
        dto.resolutionSummary,
        dto.correlationId,
        dto.causationId,
        dto.resolvedAt !== undefined ? new Date(dto.resolvedAt) : undefined,
      ),
    );
  }

  // ===========================================================================
  // REJECT DISPUTE
  // ===========================================================================

  @Post(':journeyCompletionPublicId/disputes/:disputePublicId/reject')
  @RequirePermissions('journey-completion:dispute:reject')
  public async rejectDispute(
    @Param('journeyCompletionPublicId') journeyCompletionPublicId: string,
    @Param('disputePublicId') disputePublicId: string,
    @Body() dto: RejectJourneyCompletionDisputeDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<JourneyCompletionAggregate> {
    const resolvedByPublicId = dto.resolvedByPublicId ?? request.user.publicId;

    return this.rejectJourneyCompletionDisputeHandler.execute(
      new RejectJourneyCompletionDisputeCommand(
        new JourneyCompletionPublicId(journeyCompletionPublicId),
        new JourneyCompletionDisputePublicId(disputePublicId),
        new JourneyCompletionMemberPublicId(resolvedByPublicId),
        dto.resolutionSummary,
        dto.correlationId,
        dto.causationId,
        dto.rejectedAt !== undefined ? new Date(dto.rejectedAt) : undefined,
      ),
    );
  }

  // ===========================================================================
  // WITHDRAW DISPUTE
  // ===========================================================================

  @Post(':journeyCompletionPublicId/disputes/:disputePublicId/withdraw')
  @RequirePermissions('journey-completion:dispute:withdraw')
  public async withdrawDispute(
    @Param('journeyCompletionPublicId') journeyCompletionPublicId: string,
    @Param('disputePublicId') disputePublicId: string,
    @Body() dto: WithdrawJourneyCompletionDisputeDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<JourneyCompletionAggregate> {
    const withdrawnByPublicId =
      dto.withdrawnByPublicId ?? request.user.publicId;

    return this.withdrawJourneyCompletionDisputeHandler.execute(
      new WithdrawJourneyCompletionDisputeCommand(
        new JourneyCompletionPublicId(journeyCompletionPublicId),
        new JourneyCompletionDisputePublicId(disputePublicId),
        new JourneyCompletionMemberPublicId(withdrawnByPublicId),
        dto.correlationId,
        dto.causationId,
        dto.withdrawnAt !== undefined ? new Date(dto.withdrawnAt) : undefined,
      ),
    );
  }

  // ===========================================================================
  // CANCEL
  // ===========================================================================

  @Post(':journeyCompletionPublicId/cancel')
  @RequirePermissions('journey-completion:cancel')
  public async cancel(
    @Param('journeyCompletionPublicId') journeyCompletionPublicId: string,
    @Body() dto: CancelJourneyCompletionDto,
  ): Promise<JourneyCompletionAggregate> {
    return this.cancelJourneyCompletionHandler.execute(
      new CancelJourneyCompletionCommand(
        new JourneyCompletionPublicId(journeyCompletionPublicId),
        dto.correlationId,
        dto.causationId,
        dto.cancelledAt !== undefined ? new Date(dto.cancelledAt) : undefined,
      ),
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JourneyCompletionController;
