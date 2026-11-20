/**
 * -----------------------------------------------------------------------------
 * Financial Payment — HTTP Controller
 * -----------------------------------------------------------------------------
 *
 * REST controller for Financial Payment operations.
 *
 * Responsibilities:
 * - HTTP transport;
 * - DTO validation;
 * - conversion from transport primitives to domain value objects;
 * - dispatching application commands and queries.
 *
 * Domain behavior remains inside FinancialPaymentAggregate.
 * Application orchestration remains inside command/query handlers.
 * Persistence remains behind FinancialPaymentRepository.
 *
 * Financial Transaction creation and posting remain separate concerns.
 *
 * -----------------------------------------------------------------------------
 */

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Authentication
// -----------------------------------------------------------------------------

import {
  CurrentIdentity,
  type AuthenticatedIdentity,
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../../../../../foundation/security/auth';

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';
import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { FINANCIAL_ACCOUNT_TOKENS } from '../../../application/financial-account.tokens';
import { FINANCIAL_PAYMENT_TOKENS } from '../../../application/financial-payment.tokens';

import {
  CancelFinancialPaymentCommand,
  CreateFinancialPaymentCommand,
  ExpireFinancialPaymentCommand,
  FailFinancialPaymentCommand,
  LinkFinancialPaymentTransactionCommand,
  ProcessFinancialPaymentCommand,
  SucceedFinancialPaymentCommand,
} from '../../../application/commands';

import { QueryMpesaPaymentStatusService } from '../../../application/services/query-mpesa-payment-status.service';
import {
  CountFinancialPaymentsQuery,
  GetAllFinancialPaymentsQuery,
  GetFinancialPaymentQuery,
  GetMyFinancialAccountQuery,
  GetMyFinancialPaymentsQuery,
} from '../../../application/queries';

import type { FinancialPaymentAggregate } from '../../../domain/aggregates/financial-payment.aggregate';
import type { FinancialAccountAggregate } from '../../../domain/aggregates/financial-account.aggregate';
import {
  Currency,
  FinancialPaymentChannel,
  FinancialPaymentMethodPublicId,
  FinancialPaymentPublicId,
  FinancialReferencePublicId,
  FinancialReferenceType,
  FinancialAccountOwnerPublicId,
  Money,
} from '../../../domain/value-objects';

import { PublicEntityId } from '../../../../../foundation/kernel/domain/public-entity-id';

import {
  CancelFinancialPaymentDto,
  CreateFinancialPaymentDto,
  ExpireFinancialPaymentDto,
  FailFinancialPaymentDto,
  LinkFinancialPaymentTransactionDto,
  ProcessFinancialPaymentDto,
  SucceedFinancialPaymentDto,
} from '../dto/request';

import { FinancialPaymentResponseMapper } from '../mappers/financial-payment.response.mapper';

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Financial Payments')
@Controller('financial-payments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FinancialPaymentsController {
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

    @Inject(FINANCIAL_PAYMENT_TOKENS.QUERY_HANDLERS.COUNT)
    private readonly countFinancialPaymentsHandler: QueryHandler<
      CountFinancialPaymentsQuery,
      number
    >,

    @Inject(FINANCIAL_PAYMENT_TOKENS.QUERY_HANDLERS.GET_ALL)
    private readonly getAllFinancialPaymentsHandler: QueryHandler<
      GetAllFinancialPaymentsQuery,
      FinancialPaymentAggregate[]
    >,

    @Inject(FINANCIAL_ACCOUNT_TOKENS.QUERY_HANDLERS.GET_ME)
    private readonly getMyFinancialAccountHandler: QueryHandler<
      GetMyFinancialAccountQuery,
      FinancialAccountAggregate
    >,

    @Inject(FINANCIAL_PAYMENT_TOKENS.QUERY_HANDLERS.GET_MY_PAYMENTS)
    private readonly getMyFinancialPaymentsHandler: QueryHandler<
      GetMyFinancialPaymentsQuery,
      FinancialPaymentAggregate[]
    >,

    private readonly queryMpesaPaymentStatusService: QueryMpesaPaymentStatusService,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  @Get('count')
  @RequirePermissions('financial:read')
  public async count(): Promise<number> {
    return this.countFinancialPaymentsHandler.execute(
      new CountFinancialPaymentsQuery(),
    );
  }

  @Get()
  @RequirePermissions('financial:read')
  public async getAll(): Promise<
    ReturnType<typeof FinancialPaymentResponseMapper.toResponse>[]
  > {
    const aggregates = await this.getAllFinancialPaymentsHandler.execute(
      new GetAllFinancialPaymentsQuery(),
    );

    return aggregates.map((aggregate) =>
      FinancialPaymentResponseMapper.toResponse(aggregate),
    );
  }

  /**
   * Returns every payment belonging to the authenticated customer's own
   * Financial Account, including incomplete and terminal payment states.
   *
   * The account is resolved from the authenticated identity. The client does
   * not supply an account ID, preventing cross-account payment enumeration.
   */
  @Get('me')
  public async getMyPayments(
    @CurrentIdentity() identity: AuthenticatedIdentity,
  ): Promise<ReturnType<typeof FinancialPaymentResponseMapper.toResponse>[]> {
    const account = await this.getMyFinancialAccountHandler.execute(
      new GetMyFinancialAccountQuery(
        FinancialAccountOwnerPublicId.create(identity.identityPublicId),
      ),
    );

    const aggregates = await this.getMyFinancialPaymentsHandler.execute(
      new GetMyFinancialPaymentsQuery(account.publicId),
    );

    return aggregates.map((aggregate) =>
      FinancialPaymentResponseMapper.toResponse(aggregate),
    );
  }

  @Get(':paymentPublicId')
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
  public async create(
    @Body() dto: CreateFinancialPaymentDto,
  ): Promise<ReturnType<typeof FinancialPaymentResponseMapper.toResponse>> {
    // -------------------------------------------------------------------------
    // Payment Channel
    // -------------------------------------------------------------------------

    if (dto.channel !== 'STK_PUSH' && dto.channel !== 'C2B') {
      throw new BadRequestException(
        'Financial Payment channel must be STK_PUSH or C2B.',
      );
    }

    const channel = FinancialPaymentChannel.create(dto.channel);

    // -------------------------------------------------------------------------
    // Payment Method
    // -------------------------------------------------------------------------

    const methodId =
      dto.methodId !== undefined
        ? new FinancialPaymentMethodPublicId(dto.methodId)
        : undefined;

    // -------------------------------------------------------------------------
    // Channel-specific payment method validation
    // -------------------------------------------------------------------------

    if (channel.isC2B() && methodId !== undefined) {
      throw new BadRequestException(
        'C2B payments do not require a registered Financial Payment Method.',
      );
    }

    if (channel.isStkPush() && methodId === undefined) {
      throw new BadRequestException(
        'A Financial Payment Method is required for STK Push.',
      );
    }

    // -------------------------------------------------------------------------
    // Business Reference
    // -------------------------------------------------------------------------

    const hasReferenceType = dto.referenceType !== undefined;
    const hasReferencePublicId = dto.referencePublicId !== undefined;

    if (hasReferenceType !== hasReferencePublicId) {
      throw new BadRequestException(
        'Financial Payment reference type and public ID must be provided together',
      );
    }

    const referenceType = hasReferenceType
      ? FinancialReferenceType.create(dto.referenceType)
      : undefined;

    const referencePublicId = hasReferencePublicId
      ? FinancialReferencePublicId.create(dto.referencePublicId)
      : undefined;

    // -------------------------------------------------------------------------
    // Payment Amount
    // -------------------------------------------------------------------------
    //
    // REST receives whole KES amounts as strings.
    //
    // Example:
    //   Frontend input:  "100"
    //   API amount:      "100"
    //   Domain amount:   10000 minor units
    //   M-PESA amount:   100 KES
    //
    // Convert exactly once at this boundary.
    //
    // -------------------------------------------------------------------------

    if (typeof dto.amount !== 'string' || !/^[1-9]\d*$/.test(dto.amount)) {
      throw new BadRequestException(
        'Financial Payment amount must be a positive whole KES amount.',
      );
    }

    const majorAmount = Number(dto.amount);

    if (!Number.isSafeInteger(majorAmount)) {
      throw new BadRequestException(
        'Financial Payment amount exceeds the supported monetary range.',
      );
    }

    const amountMinorUnits = majorAmount * 100;

    if (!Number.isSafeInteger(amountMinorUnits)) {
      throw new BadRequestException(
        'Financial Payment amount exceeds the supported monetary range.',
      );
    }

    // -------------------------------------------------------------------------
    // Create Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.createFinancialPaymentHandler.execute(
      new CreateFinancialPaymentCommand(
        // Financial Account
        new PublicEntityId(dto.accountId),

        // Payment Amount
        Money.create(amountMinorUnits, Currency.create(dto.currency)),

        // Payment Channel
        channel,

        // Correlation
        dto.correlationId,

        // Payment Method
        methodId,

        // Reference Type
        referenceType,

        // Reference Public ID
        referencePublicId,

        // Causation
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
        new PublicEntityId(paymentPublicId),
        dto.correlationId,
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
        new PublicEntityId(paymentPublicId),
        dto.correlationId,
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
        new PublicEntityId(paymentPublicId),
        dto.correlationId,
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
        new PublicEntityId(paymentPublicId),
        dto.correlationId,
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
        new PublicEntityId(paymentPublicId),
        dto.correlationId,
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
        new PublicEntityId(paymentPublicId),
        dto.transactionPublicId,
        dto.correlationId,
        dto.causationId,
      ),
    );

    return FinancialPaymentResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Query M-PESA Payment Status
  // ---------------------------------------------------------------------------

  @Post(':paymentPublicId/mpesa/query')
  @RequirePermissions('admin:read')
  public async queryMpesaPaymentStatus(
    @Param('paymentPublicId') paymentPublicId: string,
  ) {
    return this.queryMpesaPaymentStatusService.execute(paymentPublicId);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialPaymentsController;
