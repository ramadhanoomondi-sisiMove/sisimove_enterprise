// -----------------------------------------------------------------------------
// Financial Transaction — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Financial Transaction operations.
//
// Aggregate:
//
// FinancialTransactionAggregate
// ├── FinancialTransactionEntity
// └── FinancialTransactionEntryEntity[]
//
// The controller is responsible only for:
// - HTTP transport;
// - DTO validation;
// - conversion from transport primitives to domain value objects;
// - dispatching application commands and queries.
//
// Domain behavior remains inside FinancialTransactionAggregate.
// Application orchestration remains inside command/query handlers.
// Persistence remains behind FinancialTransactionRepository.
//
// FinancialTransactionEntryEntity is owned by the
// FinancialTransactionAggregate and is therefore returned through the
// Financial Transaction response mapper.
//
// Accounting remains a separate bounded context.
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
} from '../../../../identity/presentation/auth';

// -----------------------------------------------------------------------------
// Foundation — Application
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_TRANSACTION_TOKENS } from '../../../application/financial-transaction.tokens';

// -----------------------------------------------------------------------------
// Application — Commands
// -----------------------------------------------------------------------------

import {
  CancelFinancialTransactionCommand,
  CompleteFinancialTransactionCommand,
  CreateFinancialTransactionCommand,
  FailFinancialTransactionCommand,
  ReverseFinancialTransactionCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import { GetFinancialTransactionQuery } from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { FinancialTransactionAggregate } from '../../../domain/aggregates/financial-transaction.aggregate';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  Currency,
  FinancialAccountReference,
  FinancialTransactionPublicId,
  FinancialTransactionReference,
  FinancialTransactionType,
  Money,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  CancelFinancialTransactionDto,
  CompleteFinancialTransactionDto,
  CreateFinancialTransactionDto,
  FailFinancialTransactionDto,
  ReverseFinancialTransactionDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Response Mapper
// -----------------------------------------------------------------------------

import { FinancialTransactionResponseMapper } from '../mappers/financial-transaction-response.mapper';

// -----------------------------------------------------------------------------
// Controller
// -----------------------------------------------------------------------------

@ApiTags('Financial Transactions')
@Controller('financial-transactions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FinancialTransactionsController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Command Handlers
    // -------------------------------------------------------------------------

    @Inject(FINANCIAL_TRANSACTION_TOKENS.COMMAND_HANDLERS.CREATE)
    private readonly createFinancialTransactionHandler: CommandHandler<
      CreateFinancialTransactionCommand,
      FinancialTransactionAggregate
    >,

    @Inject(FINANCIAL_TRANSACTION_TOKENS.COMMAND_HANDLERS.COMPLETE)
    private readonly completeFinancialTransactionHandler: CommandHandler<
      CompleteFinancialTransactionCommand,
      FinancialTransactionAggregate
    >,

    @Inject(FINANCIAL_TRANSACTION_TOKENS.COMMAND_HANDLERS.FAIL)
    private readonly failFinancialTransactionHandler: CommandHandler<
      FailFinancialTransactionCommand,
      FinancialTransactionAggregate
    >,

    @Inject(FINANCIAL_TRANSACTION_TOKENS.COMMAND_HANDLERS.REVERSE)
    private readonly reverseFinancialTransactionHandler: CommandHandler<
      ReverseFinancialTransactionCommand,
      FinancialTransactionAggregate
    >,

    @Inject(FINANCIAL_TRANSACTION_TOKENS.COMMAND_HANDLERS.CANCEL)
    private readonly cancelFinancialTransactionHandler: CommandHandler<
      CancelFinancialTransactionCommand,
      FinancialTransactionAggregate
    >,

    // -------------------------------------------------------------------------
    // Query Handlers
    // -------------------------------------------------------------------------

    @Inject(FINANCIAL_TRANSACTION_TOKENS.QUERY_HANDLERS.GET)
    private readonly getFinancialTransactionHandler: QueryHandler<
      GetFinancialTransactionQuery,
      FinancialTransactionAggregate | null
    >,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Financial Transaction
  // ---------------------------------------------------------------------------

  @Get(':transactionPublicId')
  @RequirePermissions('financial-transaction:read')
  public async get(
    @Param('transactionPublicId') transactionPublicId: string,
  ): Promise<ReturnType<
    typeof FinancialTransactionResponseMapper.toResponse
  > | null> {
    const aggregate = await this.getFinancialTransactionHandler.execute(
      new GetFinancialTransactionQuery(
        new FinancialTransactionPublicId(transactionPublicId),
      ),
    );

    if (aggregate === null) {
      return null;
    }

    return FinancialTransactionResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Financial Transaction
  // ---------------------------------------------------------------------------

  @Post()
  @RequirePermissions('financial-transaction:create')
  public async create(
    @Body() dto: CreateFinancialTransactionDto,
  ): Promise<ReturnType<typeof FinancialTransactionResponseMapper.toResponse>> {
    // -------------------------------------------------------------------------
    // Source Account Reference
    // -------------------------------------------------------------------------

    const sourceAccount =
      dto.sourceAccountType !== undefined &&
      dto.sourceAccountPublicId !== undefined
        ? FinancialAccountReference.create(
            dto.sourceAccountType,
            dto.sourceAccountPublicId,
          )
        : undefined;

    // -------------------------------------------------------------------------
    // Destination Account Reference
    // -------------------------------------------------------------------------

    const destinationAccount =
      dto.destinationAccountType !== undefined &&
      dto.destinationAccountPublicId !== undefined
        ? FinancialAccountReference.create(
            dto.destinationAccountType,
            dto.destinationAccountPublicId,
          )
        : undefined;

    // -------------------------------------------------------------------------
    // Business Reference
    // -------------------------------------------------------------------------

    const reference =
      dto.referenceType !== undefined && dto.referencePublicId !== undefined
        ? FinancialTransactionReference.create(
            dto.referenceType,
            dto.referencePublicId,
          )
        : undefined;

    // -------------------------------------------------------------------------
    // Transaction Amount
    // -------------------------------------------------------------------------
    //
    // REST transports monetary amounts as strings.
    //
    // The Financial Money VO stores integer minor units as a safe JavaScript
    // number.
    //
    // The Money VO remains the authoritative domain validation boundary.
    //
    // -------------------------------------------------------------------------

    const amount = Number(dto.amount);

    if (!Number.isFinite(amount) || !Number.isSafeInteger(amount)) {
      throw new Error(
        'Financial Transaction amount must be a safe integer in minor units',
      );
    }

    // -------------------------------------------------------------------------
    // Create Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.createFinancialTransactionHandler.execute(
      new CreateFinancialTransactionCommand(
        // ---------------------------------------------------------------------
        // Transaction Type
        // ---------------------------------------------------------------------

        FinancialTransactionType.create(dto.type),

        // ---------------------------------------------------------------------
        // Transaction Amount
        // ---------------------------------------------------------------------

        Money.create(amount, Currency.create(dto.currency)),

        // ---------------------------------------------------------------------
        // Correlation
        // ---------------------------------------------------------------------

        dto.correlationId,

        // ---------------------------------------------------------------------
        // Source Account
        // ---------------------------------------------------------------------

        sourceAccount,

        // ---------------------------------------------------------------------
        // Destination Account
        // ---------------------------------------------------------------------

        destinationAccount,

        // ---------------------------------------------------------------------
        // Business Reference
        // ---------------------------------------------------------------------

        reference,

        // ---------------------------------------------------------------------
        // Causation
        // ---------------------------------------------------------------------

        dto.causationId,
      ),
    );

    // -------------------------------------------------------------------------
    // Response
    // -------------------------------------------------------------------------

    return FinancialTransactionResponseMapper.toResponse(aggregate);
  }
  // ---------------------------------------------------------------------------
  // Complete Financial Transaction
  // ---------------------------------------------------------------------------

  @Post(':transactionPublicId/complete')
  @RequirePermissions('financial-transaction:complete')
  public async complete(
    @Param('transactionPublicId') transactionPublicId: string,
    @Body() dto: CompleteFinancialTransactionDto,
  ): Promise<ReturnType<typeof FinancialTransactionResponseMapper.toResponse>> {
    const aggregate = await this.completeFinancialTransactionHandler.execute(
      new CompleteFinancialTransactionCommand(
        // Transaction Public ID
        new FinancialTransactionPublicId(transactionPublicId),

        // Correlation
        dto.correlationId,

        // Causation
        dto.causationId,
      ),
    );

    return FinancialTransactionResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Fail Financial Transaction
  // ---------------------------------------------------------------------------

  @Post(':transactionPublicId/fail')
  @RequirePermissions('financial-transaction:fail')
  public async fail(
    @Param('transactionPublicId') transactionPublicId: string,
    @Body() dto: FailFinancialTransactionDto,
  ): Promise<ReturnType<typeof FinancialTransactionResponseMapper.toResponse>> {
    const aggregate = await this.failFinancialTransactionHandler.execute(
      new FailFinancialTransactionCommand(
        // Transaction Public ID
        new FinancialTransactionPublicId(transactionPublicId),

        // Correlation
        dto.correlationId,

        // Failure Reason
        dto.reason,

        // Causation
        dto.causationId,
      ),
    );

    return FinancialTransactionResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Reverse Financial Transaction
  // ---------------------------------------------------------------------------

  @Post(':transactionPublicId/reverse')
  @RequirePermissions('financial-transaction:reverse')
  public async reverse(
    @Param('transactionPublicId') transactionPublicId: string,
    @Body() dto: ReverseFinancialTransactionDto,
  ): Promise<ReturnType<typeof FinancialTransactionResponseMapper.toResponse>> {
    const aggregate = await this.reverseFinancialTransactionHandler.execute(
      new ReverseFinancialTransactionCommand(
        // Transaction Public ID
        new FinancialTransactionPublicId(transactionPublicId),

        // Correlation
        dto.correlationId,

        // Reversal Reason
        dto.reason,

        // Causation
        dto.causationId,
      ),
    );

    return FinancialTransactionResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Cancel Financial Transaction
  // ---------------------------------------------------------------------------

  @Post(':transactionPublicId/cancel')
  @RequirePermissions('financial-transaction:cancel')
  public async cancel(
    @Param('transactionPublicId') transactionPublicId: string,
    @Body() dto: CancelFinancialTransactionDto,
  ): Promise<ReturnType<typeof FinancialTransactionResponseMapper.toResponse>> {
    const aggregate = await this.cancelFinancialTransactionHandler.execute(
      new CancelFinancialTransactionCommand(
        // Transaction Public ID
        new FinancialTransactionPublicId(transactionPublicId),

        // Correlation
        dto.correlationId,

        // Cancellation Reason
        dto.reason,

        // Causation
        dto.causationId,
      ),
    );

    return FinancialTransactionResponseMapper.toResponse(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialTransactionsController;
