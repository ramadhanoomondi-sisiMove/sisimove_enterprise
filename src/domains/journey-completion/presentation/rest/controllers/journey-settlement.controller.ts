// -----------------------------------------------------------------------------
// Journey Settlement — HTTP Controller
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

import { JOURNEY_SETTLEMENT_TOKENS } from '../../../application/journey-settlement.tokens';

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

import {
  CancelJourneySettlementCommand,
  CompleteJourneySettlementCommand,
  CreateJourneySettlementCommand,
  FailJourneySettlementCommand,
  HoldJourneySettlementCommand,
  ProcessJourneySettlementCommand,
  SubmitJourneySettlementCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

import {
  CountJourneySettlementsByStatusQuery,
  GetJourneySettlementByCompletionQuery,
  GetJourneySettlementQuery,
  ListJourneySettlementsQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { JourneySettlementAggregate } from '../../../domain/aggregates/journey-settlement.aggregate';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { JourneySettlementEntity } from '../../../domain/entities/journey-settlement.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  JourneySettlementFailureReason,
  JourneySettlementFinancialTransactionPublicId,
  JourneySettlementPublicId,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Request DTOs
// -----------------------------------------------------------------------------

import {
  CancelJourneySettlementDto,
  CompleteJourneySettlementDto,
  CreateJourneySettlementDto,
  FailJourneySettlementDto,
  HoldJourneySettlementDto,
  ProcessJourneySettlementDto,
  SubmitJourneySettlementDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Query DTOs
// -----------------------------------------------------------------------------

import {
  GetJourneySettlementByCompletionQueryDto,
  ListJourneySettlementsQueryDto,
} from '../dto/query';
import { UniqueEntityId } from '@foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Response Mapper
// -----------------------------------------------------------------------------

import {
  JourneySettlementResponseMapper,
  type JourneySettlementResponse,
} from '../mappers/journey-settlement-response.mapper';

// -----------------------------------------------------------------------------
// Controller
// -----------------------------------------------------------------------------

@ApiTags('Journey Settlements')
@Controller('journey-settlements')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class JourneySettlementController {
  constructor(
    // =========================================================================
    // Commands
    // =========================================================================

    @Inject(JOURNEY_SETTLEMENT_TOKENS.COMMAND_HANDLERS.CREATE)
    private readonly createJourneySettlementHandler: CommandHandler<
      CreateJourneySettlementCommand,
      JourneySettlementAggregate
    >,

    @Inject(JOURNEY_SETTLEMENT_TOKENS.COMMAND_HANDLERS.SUBMIT)
    private readonly submitJourneySettlementHandler: CommandHandler<
      SubmitJourneySettlementCommand,
      JourneySettlementAggregate
    >,

    @Inject(JOURNEY_SETTLEMENT_TOKENS.COMMAND_HANDLERS.PROCESS)
    private readonly processJourneySettlementHandler: CommandHandler<
      ProcessJourneySettlementCommand,
      JourneySettlementAggregate
    >,

    @Inject(JOURNEY_SETTLEMENT_TOKENS.COMMAND_HANDLERS.COMPLETE)
    private readonly completeJourneySettlementHandler: CommandHandler<
      CompleteJourneySettlementCommand,
      JourneySettlementAggregate
    >,

    @Inject(JOURNEY_SETTLEMENT_TOKENS.COMMAND_HANDLERS.FAIL)
    private readonly failJourneySettlementHandler: CommandHandler<
      FailJourneySettlementCommand,
      JourneySettlementAggregate
    >,

    @Inject(JOURNEY_SETTLEMENT_TOKENS.COMMAND_HANDLERS.HOLD)
    private readonly holdJourneySettlementHandler: CommandHandler<
      HoldJourneySettlementCommand,
      JourneySettlementAggregate
    >,

    @Inject(JOURNEY_SETTLEMENT_TOKENS.COMMAND_HANDLERS.CANCEL)
    private readonly cancelJourneySettlementHandler: CommandHandler<
      CancelJourneySettlementCommand,
      JourneySettlementAggregate
    >,

    // =========================================================================
    // Queries
    // =========================================================================

    @Inject(JOURNEY_SETTLEMENT_TOKENS.QUERY_HANDLERS.GET)
    private readonly getJourneySettlementHandler: QueryHandler<
      GetJourneySettlementQuery,
      JourneySettlementAggregate | null
    >,

    @Inject(JOURNEY_SETTLEMENT_TOKENS.QUERY_HANDLERS.GET_BY_COMPLETION)
    private readonly getJourneySettlementByCompletionHandler: QueryHandler<
      GetJourneySettlementByCompletionQuery,
      JourneySettlementEntity | null
    >,

    @Inject(JOURNEY_SETTLEMENT_TOKENS.QUERY_HANDLERS.LIST)
    private readonly listJourneySettlementsHandler: QueryHandler<
      ListJourneySettlementsQuery,
      JourneySettlementEntity[]
    >,

    @Inject(JOURNEY_SETTLEMENT_TOKENS.QUERY_HANDLERS.COUNT_BY_STATUS)
    private readonly countJourneySettlementsByStatusHandler: QueryHandler<
      CountJourneySettlementsByStatusQuery,
      number
    >,
  ) {}

  // ===========================================================================
  // QUERY ENDPOINTS
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // List Journey Settlements
  // ---------------------------------------------------------------------------

  @Get()
  @RequirePermissions('settlement:read')
  public async list(
    @Query() dto: ListJourneySettlementsQueryDto,
  ): Promise<JourneySettlementResponse[]> {
    const settlements = await this.listJourneySettlementsHandler.execute(
      new ListJourneySettlementsQuery({
        ...(dto.journeyPublicId !== undefined
          ? { journeyPublicId: dto.journeyPublicId }
          : {}),
        ...(dto.providerPublicId !== undefined
          ? { providerPublicId: dto.providerPublicId }
          : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
      }),
    );

    return JourneySettlementResponseMapper.fromEntities(settlements);
  }

  // ---------------------------------------------------------------------------
  // Count Journey Settlements By Status
  // ---------------------------------------------------------------------------

  @Get('count-by-status')
  @RequirePermissions('settlement:read')
  public async countByStatus(@Query('status') status: string): Promise<number> {
    return this.countJourneySettlementsByStatusHandler.execute(
      new CountJourneySettlementsByStatusQuery({
        status: status.trim().toUpperCase() as
          | 'PENDING'
          | 'SUBMITTED'
          | 'PROCESSING'
          | 'COMPLETED'
          | 'FAILED'
          | 'HELD'
          | 'CANCELLED',
      }),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Journey Settlement By Completion
  // ---------------------------------------------------------------------------

  @Get('by-completion')
  @RequirePermissions('settlement:read')
  public async getByCompletion(
    @Query() dto: GetJourneySettlementByCompletionQueryDto,
  ): Promise<JourneySettlementResponse | null> {
    const settlement =
      await this.getJourneySettlementByCompletionHandler.execute(
        new GetJourneySettlementByCompletionQuery({
          completionPublicId: dto.completionPublicId,
        }),
      );

    return settlement
      ? JourneySettlementResponseMapper.fromEntity(settlement)
      : null;
  }

  // ---------------------------------------------------------------------------
  // Get Journey Settlement
  // ---------------------------------------------------------------------------

  @Get(':journeySettlementPublicId')
  @RequirePermissions('settlement:read')
  public async get(
    @Param('journeySettlementPublicId') journeySettlementPublicId: string,
  ): Promise<JourneySettlementResponse | null> {
    const aggregate = await this.getJourneySettlementHandler.execute(
      new GetJourneySettlementQuery({
        journeySettlementPublicId,
      }),
    );

    return aggregate
      ? JourneySettlementResponseMapper.toResponse(aggregate)
      : null;
  }

  // ===========================================================================
  // CREATE
  // ===========================================================================

  @Post()
  @RequirePermissions('settlement:create')
  public async create(
    @Body() dto: CreateJourneySettlementDto,
  ): Promise<JourneySettlementResponse> {
    const aggregate = await this.createJourneySettlementHandler.execute(
      new CreateJourneySettlementCommand(
        new UniqueEntityId(dto.completionId),
        dto.journeyPublicId,
        dto.providerPublicId,
        dto.correlationId,
        dto.causationId,
      ),
    );

    return JourneySettlementResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // SUBMIT
  // ===========================================================================

  @Post(':journeySettlementPublicId/submit')
  @RequirePermissions('settlement:submit')
  public async submit(
    @Param('journeySettlementPublicId') journeySettlementPublicId: string,
    @Body() dto: SubmitJourneySettlementDto,
  ): Promise<JourneySettlementResponse> {
    const aggregate = await this.submitJourneySettlementHandler.execute(
      new SubmitJourneySettlementCommand(
        new JourneySettlementPublicId(journeySettlementPublicId),
        dto.correlationId,
        dto.causationId,
        dto.submittedAt !== undefined ? new Date(dto.submittedAt) : undefined,
      ),
    );

    return JourneySettlementResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // PROCESS
  // ===========================================================================

  @Post(':journeySettlementPublicId/process')
  @RequirePermissions('settlement:process')
  public async process(
    @Param('journeySettlementPublicId') journeySettlementPublicId: string,
    @Body() dto: ProcessJourneySettlementDto,
  ): Promise<JourneySettlementResponse> {
    const aggregate = await this.processJourneySettlementHandler.execute(
      new ProcessJourneySettlementCommand(
        new JourneySettlementPublicId(journeySettlementPublicId),
        dto.correlationId,
        dto.causationId,
        dto.processingAt !== undefined ? new Date(dto.processingAt) : undefined,
      ),
    );

    return JourneySettlementResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // COMPLETE
  // ===========================================================================

  @Post(':journeySettlementPublicId/complete')
  @RequirePermissions('settlement:complete')
  public async complete(
    @Param('journeySettlementPublicId') journeySettlementPublicId: string,
    @Body() dto: CompleteJourneySettlementDto,
  ): Promise<JourneySettlementResponse> {
    const aggregate = await this.completeJourneySettlementHandler.execute(
      new CompleteJourneySettlementCommand(
        new JourneySettlementPublicId(journeySettlementPublicId),
        new JourneySettlementFinancialTransactionPublicId(
          dto.financialTransactionPublicId,
        ),
        dto.correlationId,
        dto.causationId,
        dto.completedAt !== undefined ? new Date(dto.completedAt) : undefined,
      ),
    );

    return JourneySettlementResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // FAIL
  // ===========================================================================

  @Post(':journeySettlementPublicId/fail')
  @RequirePermissions('settlement:fail')
  public async fail(
    @Param('journeySettlementPublicId') journeySettlementPublicId: string,
    @Body() dto: FailJourneySettlementDto,
  ): Promise<JourneySettlementResponse> {
    const aggregate = await this.failJourneySettlementHandler.execute(
      new FailJourneySettlementCommand(
        new JourneySettlementPublicId(journeySettlementPublicId),
        JourneySettlementFailureReason.create(dto.failureReason),
        dto.correlationId,
        dto.causationId,
        dto.failedAt !== undefined ? new Date(dto.failedAt) : undefined,
      ),
    );

    return JourneySettlementResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // HOLD
  // ===========================================================================

  @Post(':journeySettlementPublicId/hold')
  @RequirePermissions('settlement:hold')
  public async hold(
    @Param('journeySettlementPublicId') journeySettlementPublicId: string,
    @Body() dto: HoldJourneySettlementDto,
  ): Promise<JourneySettlementResponse> {
    const aggregate = await this.holdJourneySettlementHandler.execute(
      new HoldJourneySettlementCommand(
        new JourneySettlementPublicId(journeySettlementPublicId),
        dto.correlationId,
        dto.causationId,
        dto.heldAt !== undefined ? new Date(dto.heldAt) : undefined,
      ),
    );

    return JourneySettlementResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // CANCEL
  // ===========================================================================

  @Post(':journeySettlementPublicId/cancel')
  @RequirePermissions('settlement:cancel')
  public async cancel(
    @Param('journeySettlementPublicId') journeySettlementPublicId: string,
    @Body() dto: CancelJourneySettlementDto,
  ): Promise<JourneySettlementResponse> {
    const aggregate = await this.cancelJourneySettlementHandler.execute(
      new CancelJourneySettlementCommand(
        new JourneySettlementPublicId(journeySettlementPublicId),
        dto.correlationId,
        dto.causationId,
        dto.cancelledAt !== undefined ? new Date(dto.cancelledAt) : undefined,
      ),
    );

    return JourneySettlementResponseMapper.toResponse(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JourneySettlementController;
