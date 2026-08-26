// -----------------------------------------------------------------------------
// Financial Account Withdrawals — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Financial Account Withdrawal operations.
//
// Aggregate:
//
// FinancialAccountWithdrawalAggregate
// └── FinancialAccountWithdrawalEntity
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
// - FinancialAccountWithdrawalAggregate;
// - FinancialAccountWithdrawalEntity.
//
// Application orchestration remains inside command/query handlers.
//
// Persistence remains behind FinancialAccountWithdrawalRepository.
//
// -----------------------------------------------------------------------------
// Withdrawal Lifecycle
// -----------------------------------------------------------------------------
//
//     PENDING
//        │
//        ├── PROCESSING
//        │      ├── COMPLETED
//        │      ├── FAILED
//        │      └── CANCELLED
//        │
//        └── CANCELLED
//
// COMPLETED, FAILED and CANCELLED are terminal states.
//
// -----------------------------------------------------------------------------
// Destination
// -----------------------------------------------------------------------------
//
// A withdrawal captures its selected destination as:
//
//     FinancialAccountWithdrawalDestination
//
// The destination is an immutable snapshot owned by the withdrawal.
//
// This controller does NOT:
//
// - resolve FinancialDisbursementDestination;
// - query a destination repository;
// - expose destination aggregate identities;
// - mutate configured destination state.
//
// Destination selection belongs to the application boundary before the
// withdrawal command is constructed.
//
// -----------------------------------------------------------------------------
// This controller does NOT:
//
// - modify Financial Account balances;
// - create or execute Financial Transactions;
// - create or execute Financial Disbursements;
// - call external providers;
// - perform settlement;
// - perform accounting;
// - persist aggregates directly.
//
// Those responsibilities belong to the appropriate application/domain and
// integration workflows.
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

import { FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS } from '../../../application/financial-account-withdrawal.tokens';

// -----------------------------------------------------------------------------
// Application — Commands
// -----------------------------------------------------------------------------

import {
  CancelFinancialAccountWithdrawalCommand,
  CompleteFinancialAccountWithdrawalCommand,
  FailFinancialAccountWithdrawalCommand,
  ProcessFinancialAccountWithdrawalCommand,
  RequestFinancialAccountWithdrawalCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import {
  GetFinancialAccountWithdrawalQuery,
  GetFinancialAccountWithdrawalsByStatusQuery,
  GetFinancialAccountWithdrawalsQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { FinancialAccountWithdrawalAggregate } from '../../../domain/aggregates/financial-account-withdrawal.aggregate';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  Currency,
  FinancialAccountPublicId,
  FinancialAccountWithdrawalDestination,
  FinancialAccountWithdrawalPublicId,
  FinancialAccountWithdrawalStatus,
  FinancialAccountWithdrawalStatusValue,
  FinancialReferencePublicId,
  FinancialReferenceType,
  Money,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  CancelFinancialAccountWithdrawalRequestDto,
  CompleteFinancialAccountWithdrawalRequestDto,
  FailFinancialAccountWithdrawalRequestDto,
  ProcessFinancialAccountWithdrawalRequestDto,
  RequestFinancialAccountWithdrawalRequestDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Query DTOs
// -----------------------------------------------------------------------------

import {
  GetFinancialAccountWithdrawalQueryDto,
  GetFinancialAccountWithdrawalsByStatusQueryDto,
  GetFinancialAccountWithdrawalsQueryDto,
} from '../queries';

// -----------------------------------------------------------------------------
// Presentation — Response Mapper
// -----------------------------------------------------------------------------

import { FinancialAccountWithdrawalResponseMapper } from '../mappers/financial-account-withdrawal-response.mapper';

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Financial Account Withdrawals')
@Controller('financial-account-withdrawals')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FinancialAccountWithdrawalsController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Command Handlers
    // -------------------------------------------------------------------------

    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.COMMAND_HANDLERS.REQUEST)
    private readonly requestFinancialAccountWithdrawalHandler: CommandHandler<
      RequestFinancialAccountWithdrawalCommand,
      FinancialAccountWithdrawalAggregate
    >,

    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.COMMAND_HANDLERS.PROCESS)
    private readonly processFinancialAccountWithdrawalHandler: CommandHandler<
      ProcessFinancialAccountWithdrawalCommand,
      FinancialAccountWithdrawalAggregate
    >,

    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.COMMAND_HANDLERS.COMPLETE)
    private readonly completeFinancialAccountWithdrawalHandler: CommandHandler<
      CompleteFinancialAccountWithdrawalCommand,
      FinancialAccountWithdrawalAggregate
    >,

    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.COMMAND_HANDLERS.FAIL)
    private readonly failFinancialAccountWithdrawalHandler: CommandHandler<
      FailFinancialAccountWithdrawalCommand,
      FinancialAccountWithdrawalAggregate
    >,

    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.COMMAND_HANDLERS.CANCEL)
    private readonly cancelFinancialAccountWithdrawalHandler: CommandHandler<
      CancelFinancialAccountWithdrawalCommand,
      FinancialAccountWithdrawalAggregate
    >,

    // -------------------------------------------------------------------------
    // Query Handlers
    // -------------------------------------------------------------------------

    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.QUERY_HANDLERS.GET)
    private readonly getFinancialAccountWithdrawalHandler: QueryHandler<
      GetFinancialAccountWithdrawalQuery,
      FinancialAccountWithdrawalAggregate
    >,

    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.QUERY_HANDLERS.GET_ALL)
    private readonly getFinancialAccountWithdrawalsHandler: QueryHandler<
      GetFinancialAccountWithdrawalsQuery,
      FinancialAccountWithdrawalAggregate[]
    >,

    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.QUERY_HANDLERS.GET_BY_STATUS)
    private readonly getFinancialAccountWithdrawalsByStatusHandler: QueryHandler<
      GetFinancialAccountWithdrawalsByStatusQuery,
      FinancialAccountWithdrawalAggregate[]
    >,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Withdrawals By Account And Status
  // ---------------------------------------------------------------------------

  /**
   * Returns withdrawals belonging to a Financial Account and matching the
   * supplied lifecycle status.
   *
   * The transport status is converted into the domain
   * FinancialAccountWithdrawalStatus value object before the application
   * query is constructed.
   *
   * This route is declared before the generic public-ID route.
   */
  @Get('accounts/:accountPublicId/status/:status')
  @RequirePermissions('financial-account-withdrawal:read')
  public async getByAccountAndStatus(
    @Param() params: GetFinancialAccountWithdrawalsByStatusQueryDto,
  ): Promise<
    ReturnType<typeof FinancialAccountWithdrawalResponseMapper.toResponse>[]
  > {
    const status = FinancialAccountWithdrawalStatus.create(
      params.status as FinancialAccountWithdrawalStatusValue,
    );

    const aggregates =
      await this.getFinancialAccountWithdrawalsByStatusHandler.execute(
        new GetFinancialAccountWithdrawalsByStatusQuery(
          new FinancialAccountPublicId(params.accountPublicId),
          status,
        ),
      );

    return FinancialAccountWithdrawalResponseMapper.fromAggregates(aggregates);
  }

  // ---------------------------------------------------------------------------
  // Get Withdrawals By Account
  // ---------------------------------------------------------------------------

  /**
   * Returns all Financial Account Withdrawals belonging to a Financial
   * Account.
   */
  @Get('accounts/:accountPublicId')
  @RequirePermissions('financial-account-withdrawal:read')
  public async getByAccount(
    @Param() params: GetFinancialAccountWithdrawalsQueryDto,
  ): Promise<
    ReturnType<typeof FinancialAccountWithdrawalResponseMapper.toResponse>[]
  > {
    const aggregates = await this.getFinancialAccountWithdrawalsHandler.execute(
      new GetFinancialAccountWithdrawalsQuery(
        new FinancialAccountPublicId(params.accountPublicId),
      ),
    );

    return FinancialAccountWithdrawalResponseMapper.fromAggregates(aggregates);
  }

  // ---------------------------------------------------------------------------
  // Get Withdrawal
  // ---------------------------------------------------------------------------

  /**
   * Returns a single Financial Account Withdrawal by public identity.
   *
   * Static account routes above are intentionally declared before this generic
   * public-ID route.
   */
  @Get(':withdrawalPublicId')
  @RequirePermissions('financial-account-withdrawal:read')
  public async get(
    @Param() params: GetFinancialAccountWithdrawalQueryDto,
  ): Promise<
    ReturnType<typeof FinancialAccountWithdrawalResponseMapper.toResponse>
  > {
    const aggregate = await this.getFinancialAccountWithdrawalHandler.execute(
      new GetFinancialAccountWithdrawalQuery(
        new FinancialAccountWithdrawalPublicId(params.withdrawalPublicId),
      ),
    );

    return FinancialAccountWithdrawalResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Request Withdrawal
  // ---------------------------------------------------------------------------

  /**
   * Creates a new Financial Account Withdrawal in PENDING state.
   *
   * The selected external destination is converted into the immutable
   * FinancialAccountWithdrawalDestination value object.
   */
  @Post()
  @RequirePermissions('financial-account-withdrawal:create')
  public async request(
    @Body() dto: RequestFinancialAccountWithdrawalRequestDto,
  ): Promise<
    ReturnType<typeof FinancialAccountWithdrawalResponseMapper.toResponse>
  > {
    const currency = Currency.create(dto.currency);

    const amount = Money.create(dto.amount, currency);

    const destination = FinancialAccountWithdrawalDestination.create(
      dto.destinationType,
      dto.destinationValue,
    );

    const referenceType =
      dto.referenceType !== undefined
        ? FinancialReferenceType.create(dto.referenceType)
        : undefined;

    const referencePublicId =
      dto.referencePublicId !== undefined
        ? FinancialReferencePublicId.create(dto.referencePublicId)
        : undefined;

    const aggregate =
      await this.requestFinancialAccountWithdrawalHandler.execute(
        new RequestFinancialAccountWithdrawalCommand(
          new FinancialAccountPublicId(dto.accountId),
          amount,
          destination,
          dto.correlationId,
          referenceType,
          referencePublicId,
          dto.causationId,
        ),
      );

    return FinancialAccountWithdrawalResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Process Withdrawal
  // ---------------------------------------------------------------------------

  /**
   * Transitions:
   *
   *     PENDING -> PROCESSING
   *
   * This does not create or execute a Financial Disbursement.
   */
  @Post(':withdrawalPublicId/process')
  @RequirePermissions('financial-account-withdrawal:process')
  public async process(
    @Param('withdrawalPublicId') withdrawalPublicId: string,
    @Body() dto: ProcessFinancialAccountWithdrawalRequestDto,
  ): Promise<
    ReturnType<typeof FinancialAccountWithdrawalResponseMapper.toResponse>
  > {
    const aggregate =
      await this.processFinancialAccountWithdrawalHandler.execute(
        new ProcessFinancialAccountWithdrawalCommand(
          new FinancialAccountWithdrawalPublicId(withdrawalPublicId),
          dto.correlationId,
          dto.causationId,
        ),
      );

    return FinancialAccountWithdrawalResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Complete Withdrawal
  // ---------------------------------------------------------------------------

  /**
   * Transitions:
   *
   *     PROCESSING -> COMPLETED
   */
  @Post(':withdrawalPublicId/complete')
  @RequirePermissions('financial-account-withdrawal:complete')
  public async complete(
    @Param('withdrawalPublicId') withdrawalPublicId: string,
    @Body() dto: CompleteFinancialAccountWithdrawalRequestDto,
  ): Promise<
    ReturnType<typeof FinancialAccountWithdrawalResponseMapper.toResponse>
  > {
    const completedAt = new Date(dto.completedAt);

    const aggregate =
      await this.completeFinancialAccountWithdrawalHandler.execute(
        new CompleteFinancialAccountWithdrawalCommand(
          new FinancialAccountWithdrawalPublicId(withdrawalPublicId),
          completedAt,
          dto.correlationId,
          dto.causationId,
        ),
      );

    return FinancialAccountWithdrawalResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Fail Withdrawal
  // ---------------------------------------------------------------------------

  /**
   * Transitions:
   *
   *     PROCESSING -> FAILED
   *
   * The failure reason is workflow/event context and is not persisted as part
   * of the withdrawal lifecycle state.
   */
  @Post(':withdrawalPublicId/fail')
  @RequirePermissions('financial-account-withdrawal:fail')
  public async fail(
    @Param('withdrawalPublicId') withdrawalPublicId: string,
    @Body() dto: FailFinancialAccountWithdrawalRequestDto,
  ): Promise<
    ReturnType<typeof FinancialAccountWithdrawalResponseMapper.toResponse>
  > {
    const failedAt = new Date(dto.failedAt);

    const aggregate = await this.failFinancialAccountWithdrawalHandler.execute(
      new FailFinancialAccountWithdrawalCommand(
        new FinancialAccountWithdrawalPublicId(withdrawalPublicId),
        dto.reason,
        failedAt,
        dto.correlationId,
        dto.causationId,
      ),
    );

    return FinancialAccountWithdrawalResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Cancel Withdrawal
  // ---------------------------------------------------------------------------

  /**
   * Transitions:
   *
   *     PENDING -> CANCELLED
   *     PROCESSING -> CANCELLED
   *
   * Cancellation does not itself execute an external provider operation.
   */
  @Post(':withdrawalPublicId/cancel')
  @RequirePermissions('financial-account-withdrawal:cancel')
  public async cancel(
    @Param('withdrawalPublicId') withdrawalPublicId: string,
    @Body() dto: CancelFinancialAccountWithdrawalRequestDto,
  ): Promise<
    ReturnType<typeof FinancialAccountWithdrawalResponseMapper.toResponse>
  > {
    const cancelledAt = new Date(dto.cancelledAt);

    const aggregate =
      await this.cancelFinancialAccountWithdrawalHandler.execute(
        new CancelFinancialAccountWithdrawalCommand(
          // ---------------------------------------------------------------------
          // Withdrawal Public ID
          // ---------------------------------------------------------------------

          new FinancialAccountWithdrawalPublicId(withdrawalPublicId),

          // ---------------------------------------------------------------------
          // Cancellation Reason
          // ---------------------------------------------------------------------

          dto.reason,

          // ---------------------------------------------------------------------
          // Cancellation Timestamp
          // ---------------------------------------------------------------------

          cancelledAt,

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

    return FinancialAccountWithdrawalResponseMapper.toResponse(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialAccountWithdrawalsController;
