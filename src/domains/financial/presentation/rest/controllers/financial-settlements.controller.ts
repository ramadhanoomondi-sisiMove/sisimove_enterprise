// -----------------------------------------------------------------------------
// Financial Settlement — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Financial Settlement operations.
//
// Aggregate:
//
// FinancialSettlementAggregate
// ├── FinancialSettlementEntity
// └── FinancialSettlementItemEntity[]
//     └── FinancialSettlementAllocationEntity[]
//
// Controller responsibilities:
//
// - HTTP transport;
// - request DTO validation;
// - conversion from transport primitives into domain value objects;
// - dispatching application commands and queries;
// - mapping application/domain results into REST responses.
//
// Domain behavior remains inside FinancialSettlementAggregate and its owned
// entities.
//
// Application orchestration remains inside command/query handlers.
//
// Persistence remains behind FinancialSettlementRepository.
//
// -----------------------------------------------------------------------------
//
// Settlement lifecycle:
//
//     PENDING
//        │
//        ├── PROCESSING
//        │      │
//        │      ├── item allocation
//        │      │
//        │      └── item settlement
//        │
//        ├── FAILED
//        └── CANCELLED
//
//     PROCESSING → COMPLETED
//
// Item lifecycle:
//
//     PENDING → ALLOCATED → SETTLED
//
// Allocation is intentionally an Item-level operation.
//
// -----------------------------------------------------------------------------
//
// The controller does NOT:
//
// - calculate settlement amounts;
// - allocate money directly;
// - mutate Financial Account balances;
// - create Financial Transactions directly;
// - execute Financial Transactions directly;
// - execute disbursements;
// - perform accounting;
// - communicate with financial providers;
// - persist aggregates directly.
//
// Financial Transaction creation/execution and Financial Account balance
// mutations belong to their respective application/domain workflows.
//
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

import { FINANCIAL_SETTLEMENT_TOKENS } from '../../../application/financial-settlement.tokens';

// -----------------------------------------------------------------------------
// Application — Commands
// -----------------------------------------------------------------------------

import {
  AllocateFinancialSettlementItemCommand,
  CancelFinancialSettlementCommand,
  CompleteFinancialSettlementCommand,
  CreateFinancialSettlementCommand,
  FailFinancialSettlementCommand,
  ProcessFinancialSettlementCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import {
  GetFinancialSettlementItemsQuery,
  GetFinancialSettlementQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { FinancialSettlementAggregate } from '../../../domain/aggregates/financial-settlement.aggregate';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  Currency,
  FinancialSettlementItemPublicId,
  FinancialSettlementPublicId,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  AllocateFinancialSettlementItemRequestDto,
  CancelFinancialSettlementRequestDto,
  CompleteFinancialSettlementRequestDto,
  CreateFinancialSettlementRequestDto,
  FailFinancialSettlementRequestDto,
  ProcessFinancialSettlementRequestDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Response Mapper
// -----------------------------------------------------------------------------

import { FinancialSettlementResponseMapper } from '../mappers/financial-settlement-response.mapper';

// -----------------------------------------------------------------------------
// Controller
// -----------------------------------------------------------------------------

@ApiTags('Financial Settlements')
@Controller('financial-settlements')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FinancialSettlementsController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Command Handlers
    // -------------------------------------------------------------------------

    @Inject(FINANCIAL_SETTLEMENT_TOKENS.COMMAND_HANDLERS.CREATE)
    private readonly createFinancialSettlementHandler: CommandHandler<
      CreateFinancialSettlementCommand,
      FinancialSettlementAggregate
    >,

    @Inject(FINANCIAL_SETTLEMENT_TOKENS.COMMAND_HANDLERS.PROCESS)
    private readonly processFinancialSettlementHandler: CommandHandler<
      ProcessFinancialSettlementCommand,
      FinancialSettlementAggregate
    >,

    @Inject(FINANCIAL_SETTLEMENT_TOKENS.COMMAND_HANDLERS.ALLOCATE_ITEM)
    private readonly allocateFinancialSettlementItemHandler: CommandHandler<
      AllocateFinancialSettlementItemCommand,
      FinancialSettlementAggregate
    >,

    @Inject(FINANCIAL_SETTLEMENT_TOKENS.COMMAND_HANDLERS.COMPLETE)
    private readonly completeFinancialSettlementHandler: CommandHandler<
      CompleteFinancialSettlementCommand,
      FinancialSettlementAggregate
    >,

    @Inject(FINANCIAL_SETTLEMENT_TOKENS.COMMAND_HANDLERS.FAIL)
    private readonly failFinancialSettlementHandler: CommandHandler<
      FailFinancialSettlementCommand,
      FinancialSettlementAggregate
    >,

    @Inject(FINANCIAL_SETTLEMENT_TOKENS.COMMAND_HANDLERS.CANCEL)
    private readonly cancelFinancialSettlementHandler: CommandHandler<
      CancelFinancialSettlementCommand,
      FinancialSettlementAggregate
    >,

    // -------------------------------------------------------------------------
    // Query Handlers
    // -------------------------------------------------------------------------

    @Inject(FINANCIAL_SETTLEMENT_TOKENS.QUERY_HANDLERS.GET)
    private readonly getFinancialSettlementHandler: QueryHandler<
      GetFinancialSettlementQuery,
      FinancialSettlementAggregate | null
    >,

    @Inject(FINANCIAL_SETTLEMENT_TOKENS.QUERY_HANDLERS.GET_ITEMS)
    private readonly getFinancialSettlementItemsHandler: QueryHandler<
      GetFinancialSettlementItemsQuery,
      FinancialSettlementAggregate | null
    >,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Financial Settlement
  // ---------------------------------------------------------------------------

  /**
   * Returns a Financial Settlement by public identifier.
   *
   * The query handler owns retrieval and aggregate rehydration.
   *
   * The controller never exposes domain entities or value objects directly.
   */
  @Get(':settlementPublicId')
  @RequirePermissions('financial-settlement:read')
  public async get(
    @Param('settlementPublicId') settlementPublicId: string,
  ): Promise<ReturnType<
    typeof FinancialSettlementResponseMapper.toResponse
  > | null> {
    const aggregate = await this.getFinancialSettlementHandler.execute(
      new GetFinancialSettlementQuery(
        new FinancialSettlementPublicId(settlementPublicId),
      ),
    );

    if (aggregate === null) {
      return null;
    }

    return FinancialSettlementResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Get Financial Settlement Items
  // ---------------------------------------------------------------------------

  /**
   * Returns the Settlement Items belonging to a Financial Settlement.
   *
   * Retrieval remains a query responsibility.
   *
   * The controller does not access persistence directly.
   */
  @Get(':settlementPublicId/items')
  @RequirePermissions('financial-settlement:read')
  public async getItems(
    @Param('settlementPublicId') settlementPublicId: string,
  ): Promise<
    ReturnType<typeof FinancialSettlementResponseMapper.fromItemEntities>
  > {
    const aggregate = await this.getFinancialSettlementItemsHandler.execute(
      new GetFinancialSettlementItemsQuery(
        new FinancialSettlementPublicId(settlementPublicId),
      ),
    );

    if (aggregate === null) {
      return [];
    }

    return FinancialSettlementResponseMapper.fromItemEntities(
      aggregate.settlement.items,
      aggregate.settlement.publicId.value,
    );
  }

  // ===========================================================================
  // Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Financial Settlement
  // ---------------------------------------------------------------------------

  /**
   * Creates a new Financial Settlement.
   *
   * The command accepts a domain Currency value object.
   *
   * The newly created Settlement starts according to the domain creation
   * policy and does not begin processing automatically.
   */
  @Post()
  @RequirePermissions('financial-settlement:create')
  public async create(
    @Body() dto: CreateFinancialSettlementRequestDto,
  ): Promise<ReturnType<typeof FinancialSettlementResponseMapper.toResponse>> {
    // -------------------------------------------------------------------------
    // Currency
    // -------------------------------------------------------------------------
    //
    // The DTO contains transport primitives.
    //
    // Currency.create() is the domain validation boundary.
    //
    // -------------------------------------------------------------------------

    const currency = Currency.create(dto.currency);

    // -------------------------------------------------------------------------
    // Create Settlement
    // -------------------------------------------------------------------------

    const aggregate = await this.createFinancialSettlementHandler.execute(
      new CreateFinancialSettlementCommand(
        // ---------------------------------------------------------------------
        // Currency
        // ---------------------------------------------------------------------

        currency,

        // ---------------------------------------------------------------------
        // Correlation
        // ---------------------------------------------------------------------

        dto.correlationId,

        // ---------------------------------------------------------------------
        // Causation
        // ---------------------------------------------------------------------

        dto.causationId,
      ),
    );

    // -------------------------------------------------------------------------
    // Response
    // -------------------------------------------------------------------------

    return FinancialSettlementResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Process Financial Settlement
  // ---------------------------------------------------------------------------

  /**
   * Begins processing of a Financial Settlement.
   *
   * Expected lifecycle transition:
   *
   *     PENDING → PROCESSING
   *
   * The aggregate validates whether processing is allowed.
   */
  @Post(':settlementPublicId/process')
  @RequirePermissions('financial-settlement:process')
  public async process(
    @Param('settlementPublicId') settlementPublicId: string,
    @Body() dto: ProcessFinancialSettlementRequestDto,
  ): Promise<ReturnType<typeof FinancialSettlementResponseMapper.toResponse>> {
    const aggregate = await this.processFinancialSettlementHandler.execute(
      new ProcessFinancialSettlementCommand(
        // ---------------------------------------------------------------------
        // Settlement Public ID
        // ---------------------------------------------------------------------

        new FinancialSettlementPublicId(settlementPublicId),

        // ---------------------------------------------------------------------
        // Correlation
        // ---------------------------------------------------------------------

        dto.correlationId,

        // ---------------------------------------------------------------------
        // Causation
        // ---------------------------------------------------------------------

        dto.causationId,
      ),
    );

    // -------------------------------------------------------------------------
    // Response
    // -------------------------------------------------------------------------

    return FinancialSettlementResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Allocate Financial Settlement Item
  // ---------------------------------------------------------------------------

  /**
   * Allocates a Financial Settlement Item.
   *
   * Expected Item lifecycle transition:
   *
   *     PENDING → ALLOCATED
   *
   * Allocation is an aggregate/domain operation but does not itself move
   * financial funds.
   *
   * The command therefore carries only the Settlement and Item identities plus
   * correlation metadata.
   */
  @Post(':settlementPublicId/items/:itemPublicId/allocate')
  @RequirePermissions('financial-settlement:allocate')
  public async allocateItem(
    @Param('settlementPublicId') settlementPublicId: string,
    @Param('itemPublicId') itemPublicId: string,
    @Body() dto: AllocateFinancialSettlementItemRequestDto,
  ): Promise<ReturnType<typeof FinancialSettlementResponseMapper.toResponse>> {
    const aggregate = await this.allocateFinancialSettlementItemHandler.execute(
      new AllocateFinancialSettlementItemCommand(
        // -------------------------------------------------------------------
        // Settlement Public ID
        // -------------------------------------------------------------------

        new FinancialSettlementPublicId(settlementPublicId),

        // -------------------------------------------------------------------
        // Settlement Item Public ID
        // -------------------------------------------------------------------

        new FinancialSettlementItemPublicId(itemPublicId),

        // -------------------------------------------------------------------
        // Correlation
        // -------------------------------------------------------------------

        dto.correlationId,

        // -------------------------------------------------------------------
        // Causation
        // -------------------------------------------------------------------

        dto.causationId,
      ),
    );

    // -------------------------------------------------------------------------
    // Response
    // -------------------------------------------------------------------------

    return FinancialSettlementResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Complete Financial Settlement
  // ---------------------------------------------------------------------------

  /**
   * Completes a Financial Settlement.
   *
   * Expected lifecycle transition:
   *
   *     PROCESSING → COMPLETED
   *
   * The aggregate is responsible for validating that all required settlement
   * invariants have been satisfied.
   */
  @Post(':settlementPublicId/complete')
  @RequirePermissions('financial-settlement:complete')
  public async complete(
    @Param('settlementPublicId') settlementPublicId: string,
    @Body() dto: CompleteFinancialSettlementRequestDto,
  ): Promise<ReturnType<typeof FinancialSettlementResponseMapper.toResponse>> {
    const aggregate = await this.completeFinancialSettlementHandler.execute(
      new CompleteFinancialSettlementCommand(
        // ---------------------------------------------------------------------
        // Settlement Public ID
        // ---------------------------------------------------------------------

        new FinancialSettlementPublicId(settlementPublicId),

        // ---------------------------------------------------------------------
        // Correlation
        // ---------------------------------------------------------------------

        dto.correlationId,

        // ---------------------------------------------------------------------
        // Causation
        // ---------------------------------------------------------------------

        dto.causationId,
      ),
    );

    // -------------------------------------------------------------------------
    // Response
    // -------------------------------------------------------------------------

    return FinancialSettlementResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Fail Financial Settlement
  // ---------------------------------------------------------------------------

  /**
   * Marks a Financial Settlement as FAILED.
   *
   * Expected lifecycle transitions:
   *
   *     PENDING    → FAILED
   *     PROCESSING → FAILED
   *
   * The failure reason is a domain/operational explanation and must not contain
   * provider credentials, tokens, secrets, or private provider payloads.
   */
  @Post(':settlementPublicId/fail')
  @RequirePermissions('financial-settlement:fail')
  public async fail(
    @Param('settlementPublicId') settlementPublicId: string,
    @Body() dto: FailFinancialSettlementRequestDto,
  ): Promise<ReturnType<typeof FinancialSettlementResponseMapper.toResponse>> {
    const aggregate = await this.failFinancialSettlementHandler.execute(
      new FailFinancialSettlementCommand(
        // ---------------------------------------------------------------------
        // Settlement Public ID
        // ---------------------------------------------------------------------

        new FinancialSettlementPublicId(settlementPublicId),

        // ---------------------------------------------------------------------
        // Failure Reason
        // ---------------------------------------------------------------------

        dto.reason,

        // ---------------------------------------------------------------------
        // Correlation
        // ---------------------------------------------------------------------

        dto.correlationId,

        // ---------------------------------------------------------------------
        // Causation
        // ---------------------------------------------------------------------

        dto.causationId,
      ),
    );

    // -------------------------------------------------------------------------
    // Response
    // -------------------------------------------------------------------------

    return FinancialSettlementResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Cancel Financial Settlement
  // ---------------------------------------------------------------------------

  /**
   * Cancels a Financial Settlement.
   *
   * Expected lifecycle transitions:
   *
   *     PENDING    → CANCELLED
   *     PROCESSING → CANCELLED
   *
   * Cancellation records the Settlement lifecycle outcome only.
   *
   * It does not automatically reverse previously executed financial
   * transactions or mutate Financial Account balances.
   */
  @Post(':settlementPublicId/cancel')
  @RequirePermissions('financial-settlement:cancel')
  public async cancel(
    @Param('settlementPublicId') settlementPublicId: string,
    @Body() dto: CancelFinancialSettlementRequestDto,
  ): Promise<ReturnType<typeof FinancialSettlementResponseMapper.toResponse>> {
    const aggregate = await this.cancelFinancialSettlementHandler.execute(
      new CancelFinancialSettlementCommand(
        // ---------------------------------------------------------------------
        // Settlement Public ID
        // ---------------------------------------------------------------------

        new FinancialSettlementPublicId(settlementPublicId),

        // ---------------------------------------------------------------------
        // Cancellation Reason
        // ---------------------------------------------------------------------

        dto.reason,

        // ---------------------------------------------------------------------
        // Correlation
        // ---------------------------------------------------------------------

        dto.correlationId,

        // ---------------------------------------------------------------------
        // Causation
        // ---------------------------------------------------------------------

        dto.causationId,
      ),
    );

    // -------------------------------------------------------------------------
    // Response
    // -------------------------------------------------------------------------

    return FinancialSettlementResponseMapper.toResponse(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialSettlementsController;
