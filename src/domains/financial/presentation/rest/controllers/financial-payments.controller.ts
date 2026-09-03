// -----------------------------------------------------------------------------
// Financial Payment — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Financial Payment operations.
//
// Aggregate:
//
// FinancialPaymentAggregate
// ├── FinancialPaymentEntity
// └── FinancialPaymentAttemptEntity[]
//
// The controller is responsible only for:
// - HTTP transport;
// - DTO validation;
// - conversion from transport primitives to domain value objects;
// - dispatching application commands and queries.
//
// Domain behavior remains inside FinancialPaymentAggregate.
// Application orchestration remains inside command/query handlers.
// Persistence remains behind FinancialPaymentRepository.
//
// FinancialPaymentAttemptEntity is owned by the FinancialPaymentAggregate and
// is therefore returned through the Financial Payment response mapper.
//
// Payment provider execution remains outside this controller and aggregate,
// within the appropriate integration/application workflow.
//
// Financial Transaction creation and posting remain separate concerns.
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

import { FINANCIAL_PAYMENT_TOKENS } from '../../../application/financial-payment.tokens';

// -----------------------------------------------------------------------------
// Application — Commands
// -----------------------------------------------------------------------------

import {
  CancelFinancialPaymentCommand,
  CreateFinancialPaymentCommand,
  ExpireFinancialPaymentCommand,
  FailFinancialPaymentCommand,
  LinkFinancialPaymentTransactionCommand,
  ProcessFinancialPaymentCommand,
  SucceedFinancialPaymentCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import { GetFinancialPaymentQuery } from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { FinancialPaymentAggregate } from '../../../domain/aggregates/financial-payment.aggregate';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  Currency,
  FinancialPaymentMethodPublicId,
  FinancialPaymentPublicId,
  FinancialReferencePublicId,
  FinancialReferenceType,
  Money,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Foundation — Value Objects
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  CancelFinancialPaymentDto,
  CreateFinancialPaymentDto,
  ExpireFinancialPaymentDto,
  FailFinancialPaymentDto,
  LinkFinancialPaymentTransactionDto,
  ProcessFinancialPaymentDto,
  SucceedFinancialPaymentDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Response Mapper
// -----------------------------------------------------------------------------

import { FinancialPaymentResponseMapper } from '../mappers/financial-payment.response.mapper';

// -----------------------------------------------------------------------------
// Controller
// -----------------------------------------------------------------------------

@ApiTags('Financial Payments')
@Controller('financial-payments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FinancialPaymentsController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Command Handlers
    // -------------------------------------------------------------------------

    @Inject(FINANCIAL_PAYMENT_TOKENS.COMMAND_HANDLERS.CREATE)
    private readonly createFinancialPaymentHandler: CommandHandler<
      CreateFinancialPaymentCommand,
      FinancialPaymentAggregate
    >,

    @Inject(FINANCIAL_PAYMENT_TOKENS.COMMAND_HANDLERS.PROCESS)
    private readonly processFinancialPaymentHandler: CommandHandler<
      ProcessFinancialPaymentCommand,
      FinancialPaymentAggregate
    >,

    @Inject(FINANCIAL_PAYMENT_TOKENS.COMMAND_HANDLERS.SUCCEED)
    private readonly succeedFinancialPaymentHandler: CommandHandler<
      SucceedFinancialPaymentCommand,
      FinancialPaymentAggregate
    >,

    @Inject(FINANCIAL_PAYMENT_TOKENS.COMMAND_HANDLERS.FAIL)
    private readonly failFinancialPaymentHandler: CommandHandler<
      FailFinancialPaymentCommand,
      FinancialPaymentAggregate
    >,

    @Inject(FINANCIAL_PAYMENT_TOKENS.COMMAND_HANDLERS.CANCEL)
    private readonly cancelFinancialPaymentHandler: CommandHandler<
      CancelFinancialPaymentCommand,
      FinancialPaymentAggregate
    >,

    @Inject(FINANCIAL_PAYMENT_TOKENS.COMMAND_HANDLERS.EXPIRE)
    private readonly expireFinancialPaymentHandler: CommandHandler<
      ExpireFinancialPaymentCommand,
      FinancialPaymentAggregate
    >,

    @Inject(FINANCIAL_PAYMENT_TOKENS.COMMAND_HANDLERS.LINK_TRANSACTION)
    private readonly linkFinancialPaymentTransactionHandler: CommandHandler<
      LinkFinancialPaymentTransactionCommand,
      FinancialPaymentAggregate
    >,

    // -------------------------------------------------------------------------
    // Query Handlers
    // -------------------------------------------------------------------------

    @Inject(FINANCIAL_PAYMENT_TOKENS.QUERY_HANDLERS.GET)
    private readonly getFinancialPaymentHandler: QueryHandler<
      GetFinancialPaymentQuery,
      FinancialPaymentAggregate | null
    >,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Financial Payment
  // ---------------------------------------------------------------------------

  @Get(':paymentPublicId')
  @RequirePermissions('financial-payment:read')
  public async get(
    @Param('paymentPublicId') paymentPublicId: string,
  ): Promise<ReturnType<
    typeof FinancialPaymentResponseMapper.toResponse
  > | null> {
    const aggregate = await this.getFinancialPaymentHandler.execute(
      new GetFinancialPaymentQuery(
        new FinancialPaymentPublicId(paymentPublicId),
      ),
    );

    if (aggregate === null) {
      return null;
    }

    return FinancialPaymentResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Financial Payment
  // ---------------------------------------------------------------------------

  @Post()
  @RequirePermissions('financial-payment:create')
  public async create(
    @Body() dto: CreateFinancialPaymentDto,
  ): Promise<ReturnType<typeof FinancialPaymentResponseMapper.toResponse>> {
    // -------------------------------------------------------------------------
    // Payment Method
    // -------------------------------------------------------------------------

    const methodId =
      dto.methodId !== undefined
        ? new FinancialPaymentMethodPublicId(dto.methodId)
        : undefined;

    // -------------------------------------------------------------------------
    // Business Reference
    // -------------------------------------------------------------------------

    const referenceType =
      dto.referenceType !== undefined
        ? FinancialReferenceType.create(dto.referenceType)
        : undefined;

    const referencePublicId =
      dto.referencePublicId !== undefined
        ? FinancialReferencePublicId.create(dto.referencePublicId)
        : undefined;

    // -------------------------------------------------------------------------
    // Payment Amount
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
        'Financial Payment amount must be a safe integer in minor units',
      );
    }

    // -------------------------------------------------------------------------
    // Create Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.createFinancialPaymentHandler.execute(
      new CreateFinancialPaymentCommand(
        // ---------------------------------------------------------------------
        // Financial Account
        // ---------------------------------------------------------------------

        new PublicEntityId(dto.accountId),

        // ---------------------------------------------------------------------
        // Payment Amount
        // ---------------------------------------------------------------------

        Money.create(amount, Currency.create(dto.currency)),

        // ---------------------------------------------------------------------
        // Correlation
        // ---------------------------------------------------------------------

        dto.correlationId,

        // ---------------------------------------------------------------------
        // Payment Method
        // ---------------------------------------------------------------------

        methodId,

        // ---------------------------------------------------------------------
        // Reference Type
        // ---------------------------------------------------------------------

        referenceType,

        // ---------------------------------------------------------------------
        // Reference Public ID
        // ---------------------------------------------------------------------

        referencePublicId,

        // ---------------------------------------------------------------------
        // Causation
        // ---------------------------------------------------------------------

        dto.causationId,
      ),
    );

    // -------------------------------------------------------------------------
    // Response
    // -------------------------------------------------------------------------

    return FinancialPaymentResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Process Financial Payment
  // ---------------------------------------------------------------------------

  @Post(':paymentPublicId/process')
  @RequirePermissions('financial-payment:process')
  public async process(
    @Param('paymentPublicId') paymentPublicId: string,
    @Body() dto: ProcessFinancialPaymentDto,
  ): Promise<ReturnType<typeof FinancialPaymentResponseMapper.toResponse>> {
    const aggregate = await this.processFinancialPaymentHandler.execute(
      new ProcessFinancialPaymentCommand(
        // Payment Public ID
        new PublicEntityId(paymentPublicId),

        // Correlation
        dto.correlationId,

        // Causation
        dto.causationId,
      ),
    );

    return FinancialPaymentResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Succeed Financial Payment
  // ---------------------------------------------------------------------------

  @Post(':paymentPublicId/succeed')
  @RequirePermissions('financial-payment:succeed')
  public async succeed(
    @Param('paymentPublicId') paymentPublicId: string,
    @Body() dto: SucceedFinancialPaymentDto,
  ): Promise<ReturnType<typeof FinancialPaymentResponseMapper.toResponse>> {
    const aggregate = await this.succeedFinancialPaymentHandler.execute(
      new SucceedFinancialPaymentCommand(
        // Payment Public ID
        new PublicEntityId(paymentPublicId),

        // Correlation
        dto.correlationId,

        // Causation
        dto.causationId,
      ),
    );

    return FinancialPaymentResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Fail Financial Payment
  // ---------------------------------------------------------------------------

  @Post(':paymentPublicId/fail')
  @RequirePermissions('financial-payment:fail')
  public async fail(
    @Param('paymentPublicId') paymentPublicId: string,
    @Body() dto: FailFinancialPaymentDto,
  ): Promise<ReturnType<typeof FinancialPaymentResponseMapper.toResponse>> {
    const aggregate = await this.failFinancialPaymentHandler.execute(
      new FailFinancialPaymentCommand(
        // Payment Public ID
        new PublicEntityId(paymentPublicId),

        // Correlation
        dto.correlationId,

        // Causation
        dto.causationId,
      ),
    );

    return FinancialPaymentResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Cancel Financial Payment
  // ---------------------------------------------------------------------------

  @Post(':paymentPublicId/cancel')
  @RequirePermissions('financial-payment:cancel')
  public async cancel(
    @Param('paymentPublicId') paymentPublicId: string,
    @Body() dto: CancelFinancialPaymentDto,
  ): Promise<ReturnType<typeof FinancialPaymentResponseMapper.toResponse>> {
    const aggregate = await this.cancelFinancialPaymentHandler.execute(
      new CancelFinancialPaymentCommand(
        // Payment Public ID
        new PublicEntityId(paymentPublicId),

        // Correlation
        dto.correlationId,

        // Causation
        dto.causationId,
      ),
    );

    return FinancialPaymentResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Expire Financial Payment
  // ---------------------------------------------------------------------------

  @Post(':paymentPublicId/expire')
  @RequirePermissions('financial-payment:expire')
  public async expire(
    @Param('paymentPublicId') paymentPublicId: string,
    @Body() dto: ExpireFinancialPaymentDto,
  ): Promise<ReturnType<typeof FinancialPaymentResponseMapper.toResponse>> {
    const aggregate = await this.expireFinancialPaymentHandler.execute(
      new ExpireFinancialPaymentCommand(
        // Payment Public ID
        new PublicEntityId(paymentPublicId),

        // Correlation
        dto.correlationId,

        // Causation
        dto.causationId,
      ),
    );

    return FinancialPaymentResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Link Financial Payment to Financial Transaction
  // ---------------------------------------------------------------------------

  @Post(':paymentPublicId/transaction')
  @RequirePermissions('financial-payment:link-transaction')
  public async linkTransaction(
    @Param('paymentPublicId') paymentPublicId: string,
    @Body() dto: LinkFinancialPaymentTransactionDto,
  ): Promise<ReturnType<typeof FinancialPaymentResponseMapper.toResponse>> {
    const aggregate = await this.linkFinancialPaymentTransactionHandler.execute(
      new LinkFinancialPaymentTransactionCommand(
        // Payment Public ID
        new PublicEntityId(paymentPublicId),

        // Transaction Public ID
        dto.transactionPublicId,

        // Correlation
        dto.correlationId,

        // Causation
        dto.causationId,
      ),
    );

    return FinancialPaymentResponseMapper.toResponse(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialPaymentsController;
