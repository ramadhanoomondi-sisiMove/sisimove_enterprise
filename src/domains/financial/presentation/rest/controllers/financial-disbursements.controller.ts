// -----------------------------------------------------------------------------
// Financial Disbursements — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Financial Disbursement operations.
//
// Aggregate:
//
// FinancialDisbursementAggregate
// ├── FinancialDisbursementEntity
// │   └── FinancialDisbursementAttemptEntity[]
// └── FinancialDisbursementDestinationEntity (associated entity)
//
// Controller responsibilities:
//
// - HTTP transport;
// - request DTO validation;
// - conversion of transport primitives into domain value objects;
// - dispatching application commands and queries;
// - mapping application/domain results into REST responses.
//
// Domain lifecycle behavior remains inside:
//
// - FinancialDisbursementAggregate;
// - FinancialDisbursementEntity;
// - FinancialDisbursementAttemptEntity.
//
// Application orchestration remains inside command/query handlers.
//
// Persistence remains behind FinancialDisbursementRepository.
//
// -----------------------------------------------------------------------------
// Disbursement Lifecycle
// -----------------------------------------------------------------------------
//
//     PENDING
//        │
//        ├── PROCESSING
//        │      │
//        │      ├── COMPLETED
//        │      ├── FAILED
//        │      └── CANCELLED
//        │
//        ├── FAILED
//        └── CANCELLED
//
// COMPLETED, FAILED and CANCELLED are terminal states.
//
// -----------------------------------------------------------------------------
// Destination
// -----------------------------------------------------------------------------
//
// FinancialDisbursementDestinationEntity is an independently persisted
// Financial-domain entity associated with the source Financial Account.
//
// It is associated with the Financial Disbursement aggregate but is NOT owned
// by the Financial Disbursement aggregate.
//
// The aggregate exposes the selected destination through:
//
//     aggregate.destination
//
// The controller does not mutate destination state.
//
// -----------------------------------------------------------------------------
// REST Routes
// -----------------------------------------------------------------------------
//
// GET
//     /financial-disbursements/:disbursementPublicId
//
// GET
//     /financial-disbursements/:disbursementPublicId/attempts
//
// POST
//     /financial-disbursements
//
// POST
//     /financial-disbursements/process
//
// POST
//     /financial-disbursements/complete
//
// POST
//     /financial-disbursements/fail
//
// POST
//     /financial-disbursements/cancel
//
// -----------------------------------------------------------------------------
// This controller does NOT:
//
// - modify Financial Account balances;
// - create or post Financial Transactions;
// - execute external providers;
// - create or execute disbursement attempts directly;
// - perform settlement;
// - perform accounting;
// - persist aggregates directly.
//
// Those responsibilities belong to the appropriate application, domain,
// repository, and integration boundaries.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Node
// -----------------------------------------------------------------------------

import { randomUUID } from 'node:crypto';

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
  UseGuards,
} from '@nestjs/common';

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

import { ApiTags } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Identity — Authentication & Authorization
// -----------------------------------------------------------------------------

import {
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../../../../../foundation/security/auth';

// -----------------------------------------------------------------------------
// Foundation — Application
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_DISBURSEMENT_TOKENS } from '../../../application/financial-disbursement.tokens';

// -----------------------------------------------------------------------------
// Application — Commands
// -----------------------------------------------------------------------------

import {
  CancelFinancialDisbursementCommand,
  CompleteFinancialDisbursementCommand,
  CreateFinancialDisbursementCommand,
  FailFinancialDisbursementCommand,
  ProcessFinancialDisbursementCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import {
  GetFinancialDisbursementAttemptsQuery,
  GetFinancialDisbursementQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { FinancialDisbursementAggregate } from '../../../domain/aggregates/financial-disbursement.aggregate';

// -----------------------------------------------------------------------------
// Domain — Entities
// -----------------------------------------------------------------------------

import type { FinancialDisbursementAttemptEntity } from '../../../domain/entities/financial-disbursement-attempt.entity';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  Currency,
  FinancialAccountPublicId,
  FinancialDisbursementDestinationPublicId,
  FinancialDisbursementPublicId,
  FinancialReferencePublicId,
  FinancialReferenceType,
  Money,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  CancelFinancialDisbursementRequestDto,
  CompleteFinancialDisbursementRequestDto,
  CreateFinancialDisbursementRequestDto,
  FailFinancialDisbursementRequestDto,
  ProcessFinancialDisbursementRequestDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Query/Param DTOs
// -----------------------------------------------------------------------------

import {
  GetFinancialDisbursementAttemptsQueryDto,
  GetFinancialDisbursementQueryDto,
} from '../queries';

// -----------------------------------------------------------------------------
// Presentation — Response Mapper
// -----------------------------------------------------------------------------

import {
  FinancialDisbursementResponseMapper,
  type FinancialDisbursementAttemptResponse,
  type FinancialDisbursementResponse,
} from '../mappers/financial-disbursement-response.mapper';

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Financial Disbursements')
@Controller('financial-disbursements')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FinancialDisbursementsController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Command Handlers
    // -------------------------------------------------------------------------

    @Inject(FINANCIAL_DISBURSEMENT_TOKENS.COMMAND_HANDLERS.CREATE)
    private readonly createFinancialDisbursementHandler: CommandHandler<
      CreateFinancialDisbursementCommand,
      FinancialDisbursementAggregate
    >,

    @Inject(FINANCIAL_DISBURSEMENT_TOKENS.COMMAND_HANDLERS.PROCESS)
    private readonly processFinancialDisbursementHandler: CommandHandler<
      ProcessFinancialDisbursementCommand,
      FinancialDisbursementAggregate
    >,

    @Inject(FINANCIAL_DISBURSEMENT_TOKENS.COMMAND_HANDLERS.COMPLETE)
    private readonly completeFinancialDisbursementHandler: CommandHandler<
      CompleteFinancialDisbursementCommand,
      FinancialDisbursementAggregate
    >,

    @Inject(FINANCIAL_DISBURSEMENT_TOKENS.COMMAND_HANDLERS.FAIL)
    private readonly failFinancialDisbursementHandler: CommandHandler<
      FailFinancialDisbursementCommand,
      FinancialDisbursementAggregate
    >,

    @Inject(FINANCIAL_DISBURSEMENT_TOKENS.COMMAND_HANDLERS.CANCEL)
    private readonly cancelFinancialDisbursementHandler: CommandHandler<
      CancelFinancialDisbursementCommand,
      FinancialDisbursementAggregate
    >,

    // -------------------------------------------------------------------------
    // Query Handlers
    // -------------------------------------------------------------------------

    @Inject(FINANCIAL_DISBURSEMENT_TOKENS.QUERY_HANDLERS.GET)
    private readonly getFinancialDisbursementHandler: QueryHandler<
      GetFinancialDisbursementQuery,
      FinancialDisbursementAggregate
    >,

    @Inject(FINANCIAL_DISBURSEMENT_TOKENS.QUERY_HANDLERS.GET_ATTEMPTS)
    private readonly getFinancialDisbursementAttemptsHandler: QueryHandler<
      GetFinancialDisbursementAttemptsQuery,
      readonly FinancialDisbursementAttemptEntity[]
    >,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Financial Disbursement Attempts
  // ---------------------------------------------------------------------------
  //
  // This route MUST remain before the generic /:disbursementPublicId route.
  // ---------------------------------------------------------------------------

  @Get(':disbursementPublicId/attempts')
  @RequirePermissions('financial-disbursement:read')
  public async getAttempts(
    @Param() params: GetFinancialDisbursementAttemptsQueryDto,
  ): Promise<FinancialDisbursementAttemptResponse[]> {
    const attempts = await this.getFinancialDisbursementAttemptsHandler.execute(
      new GetFinancialDisbursementAttemptsQuery(
        new FinancialDisbursementPublicId(params.disbursementPublicId),
      ),
    );

    return FinancialDisbursementResponseMapper.fromAttempts(attempts);
  }

  // ---------------------------------------------------------------------------
  // Get Financial Disbursement
  // ---------------------------------------------------------------------------

  @Get(':disbursementPublicId')
  @RequirePermissions('financial-disbursement:read')
  public async get(
    @Param() params: GetFinancialDisbursementQueryDto,
  ): Promise<FinancialDisbursementResponse> {
    const aggregate = await this.getFinancialDisbursementHandler.execute(
      new GetFinancialDisbursementQuery(
        new FinancialDisbursementPublicId(params.disbursementPublicId),
      ),
    );

    return FinancialDisbursementResponseMapper.toResponse(
      aggregate,
      aggregate.destination,
    );
  }

  // ===========================================================================
  // Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Financial Disbursement
  // ---------------------------------------------------------------------------

  @Post()
  @RequirePermissions('financial-disbursement:create')
  public async create(
    @Body() dto: CreateFinancialDisbursementRequestDto,
  ): Promise<FinancialDisbursementResponse> {
    const currency = Currency.create(dto.currency);

    const amount = Money.create(dto.amount, currency);

    const referenceType =
      dto.referenceType !== undefined
        ? FinancialReferenceType.create(dto.referenceType)
        : undefined;

    const referencePublicId =
      dto.referencePublicId !== undefined
        ? FinancialReferencePublicId.create(dto.referencePublicId)
        : undefined;

    const aggregate = await this.createFinancialDisbursementHandler.execute(
      new CreateFinancialDisbursementCommand(
        new FinancialAccountPublicId(dto.sourceAccountPublicId),
        new FinancialDisbursementDestinationPublicId(dto.destinationPublicId),
        amount,
        referenceType,
        referencePublicId,
        randomUUID(),
      ),
    );

    return FinancialDisbursementResponseMapper.toResponse(
      aggregate,
      aggregate.destination,
    );
  }

  // ---------------------------------------------------------------------------
  // Process Financial Disbursement
  // ---------------------------------------------------------------------------

  @Post('process')
  @RequirePermissions('financial-disbursement:process')
  public async process(
    @Body() dto: ProcessFinancialDisbursementRequestDto,
  ): Promise<FinancialDisbursementResponse> {
    const aggregate = await this.processFinancialDisbursementHandler.execute(
      new ProcessFinancialDisbursementCommand(
        new FinancialDisbursementPublicId(dto.disbursementPublicId),
        randomUUID(),
      ),
    );

    return FinancialDisbursementResponseMapper.toResponse(
      aggregate,
      aggregate.destination,
    );
  }

  // ---------------------------------------------------------------------------
  // Complete Financial Disbursement
  // ---------------------------------------------------------------------------

  @Post('complete')
  @RequirePermissions('financial-disbursement:complete')
  public async complete(
    @Body() dto: CompleteFinancialDisbursementRequestDto,
  ): Promise<FinancialDisbursementResponse> {
    const aggregate = await this.completeFinancialDisbursementHandler.execute(
      new CompleteFinancialDisbursementCommand(
        new FinancialDisbursementPublicId(dto.disbursementPublicId),
        randomUUID(),
      ),
    );

    return FinancialDisbursementResponseMapper.toResponse(
      aggregate,
      aggregate.destination,
    );
  }

  // ---------------------------------------------------------------------------
  // Fail Financial Disbursement
  // ---------------------------------------------------------------------------

  @Post('fail')
  @RequirePermissions('financial-disbursement:fail')
  public async fail(
    @Body() dto: FailFinancialDisbursementRequestDto,
  ): Promise<FinancialDisbursementResponse> {
    const aggregate = await this.failFinancialDisbursementHandler.execute(
      new FailFinancialDisbursementCommand(
        new FinancialDisbursementPublicId(dto.disbursementPublicId),
        dto.reason,
        randomUUID(),
      ),
    );

    return FinancialDisbursementResponseMapper.toResponse(
      aggregate,
      aggregate.destination,
    );
  }

  // ---------------------------------------------------------------------------
  // Cancel Financial Disbursement
  // ---------------------------------------------------------------------------

  @Post('cancel')
  @RequirePermissions('financial-disbursement:cancel')
  public async cancel(
    @Body() dto: CancelFinancialDisbursementRequestDto,
  ): Promise<FinancialDisbursementResponse> {
    const aggregate = await this.cancelFinancialDisbursementHandler.execute(
      new CancelFinancialDisbursementCommand(
        new FinancialDisbursementPublicId(dto.disbursementPublicId),
        randomUUID(),
      ),
    );

    return FinancialDisbursementResponseMapper.toResponse(
      aggregate,
      aggregate.destination,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialDisbursementsController;
