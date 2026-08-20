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
} from '../../../../identity/presentation/auth';

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
  ) {}

  // ===========================================================================
  // QUERY ENDPOINTS
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // List Journey Settlements
  // ---------------------------------------------------------------------------

  @Get()
  @RequirePermissions('journey-settlement:read')
  public async list(
    @Query() dto: ListJourneySettlementsQueryDto,
  ): Promise<JourneySettlementEntity[]> {
    return this.listJourneySettlementsHandler.execute(
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
  }

  // ---------------------------------------------------------------------------
  // Get Journey Settlement By Completion
  // ---------------------------------------------------------------------------

  @Get('by-completion')
  @RequirePermissions('journey-settlement:read')
  public async getByCompletion(
    @Query() dto: GetJourneySettlementByCompletionQueryDto,
  ): Promise<JourneySettlementEntity | null> {
    return this.getJourneySettlementByCompletionHandler.execute(
      new GetJourneySettlementByCompletionQuery({
        completionPublicId: dto.completionPublicId,
      }),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Journey Settlement
  // ---------------------------------------------------------------------------

  @Get(':journeySettlementPublicId')
  @RequirePermissions('journey-settlement:read')
  public async get(
    @Param('journeySettlementPublicId') journeySettlementPublicId: string,
  ): Promise<JourneySettlementAggregate | null> {
    return this.getJourneySettlementHandler.execute(
      new GetJourneySettlementQuery({
        journeySettlementPublicId,
      }),
    );
  }

  // ===========================================================================
  // CREATE
  // ===========================================================================

  @Post()
  @RequirePermissions('journey-settlement:create')
  public async create(
    @Body() dto: CreateJourneySettlementDto,
  ): Promise<JourneySettlementAggregate> {
    return this.createJourneySettlementHandler.execute(
      new CreateJourneySettlementCommand(
        new UniqueEntityId(dto.completionId),
        dto.journeyPublicId,
        dto.providerPublicId,
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  // ===========================================================================
  // SUBMIT
  // ===========================================================================

  @Post(':journeySettlementPublicId/submit')
  @RequirePermissions('journey-settlement:submit')
  public async submit(
    @Param('journeySettlementPublicId') journeySettlementPublicId: string,
    @Body() dto: SubmitJourneySettlementDto,
  ): Promise<JourneySettlementAggregate> {
    return this.submitJourneySettlementHandler.execute(
      new SubmitJourneySettlementCommand(
        new JourneySettlementPublicId(journeySettlementPublicId),
        dto.correlationId,
        dto.causationId,
        dto.submittedAt !== undefined ? new Date(dto.submittedAt) : undefined,
      ),
    );
  }

  // ===========================================================================
  // PROCESS
  // ===========================================================================

  @Post(':journeySettlementPublicId/process')
  @RequirePermissions('journey-settlement:process')
  public async process(
    @Param('journeySettlementPublicId') journeySettlementPublicId: string,
    @Body() dto: ProcessJourneySettlementDto,
  ): Promise<JourneySettlementAggregate> {
    return this.processJourneySettlementHandler.execute(
      new ProcessJourneySettlementCommand(
        new JourneySettlementPublicId(journeySettlementPublicId),
        dto.correlationId,
        dto.causationId,
        dto.processingAt !== undefined ? new Date(dto.processingAt) : undefined,
      ),
    );
  }

  // ===========================================================================
  // COMPLETE
  // ===========================================================================

  @Post(':journeySettlementPublicId/complete')
  @RequirePermissions('journey-settlement:complete')
  public async complete(
    @Param('journeySettlementPublicId') journeySettlementPublicId: string,
    @Body() dto: CompleteJourneySettlementDto,
  ): Promise<JourneySettlementAggregate> {
    return this.completeJourneySettlementHandler.execute(
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
  }

  // ===========================================================================
  // FAIL
  // ===========================================================================

  @Post(':journeySettlementPublicId/fail')
  @RequirePermissions('journey-settlement:fail')
  public async fail(
    @Param('journeySettlementPublicId') journeySettlementPublicId: string,
    @Body() dto: FailJourneySettlementDto,
  ): Promise<JourneySettlementAggregate> {
    return this.failJourneySettlementHandler.execute(
      new FailJourneySettlementCommand(
        new JourneySettlementPublicId(journeySettlementPublicId),
        JourneySettlementFailureReason.create(dto.failureReason),
        dto.correlationId,
        dto.causationId,
        dto.failedAt !== undefined ? new Date(dto.failedAt) : undefined,
      ),
    );
  }

  // ===========================================================================
  // HOLD
  // ===========================================================================

  @Post(':journeySettlementPublicId/hold')
  @RequirePermissions('journey-settlement:hold')
  public async hold(
    @Param('journeySettlementPublicId') journeySettlementPublicId: string,
    @Body() dto: HoldJourneySettlementDto,
  ): Promise<JourneySettlementAggregate> {
    return this.holdJourneySettlementHandler.execute(
      new HoldJourneySettlementCommand(
        new JourneySettlementPublicId(journeySettlementPublicId),
        dto.correlationId,
        dto.causationId,
        dto.heldAt !== undefined ? new Date(dto.heldAt) : undefined,
      ),
    );
  }

  // ===========================================================================
  // CANCEL
  // ===========================================================================

  @Post(':journeySettlementPublicId/cancel')
  @RequirePermissions('journey-settlement:cancel')
  public async cancel(
    @Param('journeySettlementPublicId') journeySettlementPublicId: string,
    @Body() dto: CancelJourneySettlementDto,
  ): Promise<JourneySettlementAggregate> {
    return this.cancelJourneySettlementHandler.execute(
      new CancelJourneySettlementCommand(
        new JourneySettlementPublicId(journeySettlementPublicId),
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

export default JourneySettlementController;
