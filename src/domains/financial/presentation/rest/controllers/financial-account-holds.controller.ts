// -----------------------------------------------------------------------------
// Financial Account Hold — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Financial Account Hold operations.
//
// Aggregate:
//
// FinancialAccountHoldAggregate
// └── FinancialAccountHoldEntity
//
// Controller responsibilities:
// - HTTP transport;
// - request DTO validation;
// - conversion of transport primitives into domain value objects;
// - dispatching application commands and queries;
// - mapping application/domain results into REST responses.
//
// Domain behavior remains inside FinancialAccountHoldAggregate.
// Application orchestration remains inside command/query handlers.
// Persistence remains behind FinancialAccountHoldRepository.
//
// Financial Account Holds represent reservations of funds against a
// Financial Account.
//
// The controller does NOT:
// - modify Financial Account balances;
// - create or execute Financial Transactions directly;
// - move money;
// - communicate with payment providers;
// - coordinate multiple Financial Account Holds;
// - persist aggregates directly.
//
// Financial balance mutations and Financial Transaction creation/execution
// belong to the appropriate Financial application/domain workflow.
//
// Lifecycle:
//
//     ACTIVE
//        │
//        ├── RELEASED
//        ├── CAPTURED
//        └── CANCELLED
//
// RELEASED, CAPTURED and CANCELLED are terminal states.
//
// RELEASE:
// - resolves the reservation without capturing the funds.
//
// CAPTURE:
// - resolves the reservation through capture.
//
// CANCEL:
// - invalidates the reservation as a business operation;
// - requires a RELEASE transaction to resolve the reserved funds.
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

import { FINANCIAL_ACCOUNT_HOLD_TOKENS } from '../../../application/financial-account-hold.tokens';

// -----------------------------------------------------------------------------
// Application — Commands
// -----------------------------------------------------------------------------

import {
  CancelFinancialAccountHoldCommand,
  CaptureFinancialAccountHoldCommand,
  CreateFinancialAccountHoldCommand,
  ReleaseFinancialAccountHoldCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import { GetFinancialAccountHoldsQuery } from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { FinancialAccountHoldAggregate } from '../../../domain/aggregates/financial-account-hold.aggregate';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  FinancialAccountHeldAmount,
  FinancialAccountHoldPublicId,
  FinancialAccountPublicId,
  FinancialHoldExpiry,
  FinancialHoldReference,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  CancelFinancialAccountHoldRequestDto,
  CaptureFinancialAccountHoldRequestDto,
  CreateFinancialAccountHoldRequestDto,
  ReleaseFinancialAccountHoldRequestDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Response Mapper
// -----------------------------------------------------------------------------

import { FinancialAccountHoldResponseMapper } from '../mappers/financial-account-hold-response.mapper';

// -----------------------------------------------------------------------------
// Controller
// -----------------------------------------------------------------------------

@ApiTags('Financial Account Holds')
@Controller('financial-account-holds')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FinancialAccountHoldsController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Command Handlers
    // -------------------------------------------------------------------------

    @Inject(FINANCIAL_ACCOUNT_HOLD_TOKENS.COMMAND_HANDLERS.CREATE)
    private readonly createFinancialAccountHoldHandler: CommandHandler<
      CreateFinancialAccountHoldCommand,
      FinancialAccountHoldAggregate
    >,

    @Inject(FINANCIAL_ACCOUNT_HOLD_TOKENS.COMMAND_HANDLERS.CAPTURE)
    private readonly captureFinancialAccountHoldHandler: CommandHandler<
      CaptureFinancialAccountHoldCommand,
      FinancialAccountHoldAggregate
    >,

    @Inject(FINANCIAL_ACCOUNT_HOLD_TOKENS.COMMAND_HANDLERS.RELEASE)
    private readonly releaseFinancialAccountHoldHandler: CommandHandler<
      ReleaseFinancialAccountHoldCommand,
      FinancialAccountHoldAggregate
    >,

    @Inject(FINANCIAL_ACCOUNT_HOLD_TOKENS.COMMAND_HANDLERS.CANCEL)
    private readonly cancelFinancialAccountHoldHandler: CommandHandler<
      CancelFinancialAccountHoldCommand,
      FinancialAccountHoldAggregate
    >,

    // -------------------------------------------------------------------------
    // Query Handlers
    // -------------------------------------------------------------------------

    @Inject(FINANCIAL_ACCOUNT_HOLD_TOKENS.QUERY_HANDLERS.GET)
    private readonly getFinancialAccountHoldsHandler: QueryHandler<
      GetFinancialAccountHoldsQuery,
      FinancialAccountHoldAggregate[]
    >,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Financial Account Holds
  // ---------------------------------------------------------------------------

  /**
   * Returns Financial Account Holds belonging to a Financial Account.
   *
   * The application query determines which lifecycle states are returned.
   *
   * The controller does not perform domain filtering.
   */
  @Get('accounts/:accountPublicId')
  @RequirePermissions('financial-account-hold:read')
  public async getByAccount(
    @Param('accountPublicId') accountPublicId: string,
  ): Promise<
    ReturnType<typeof FinancialAccountHoldResponseMapper.toResponse>[]
  > {
    const aggregate = await this.getFinancialAccountHoldsHandler.execute(
      new GetFinancialAccountHoldsQuery(
        new FinancialAccountPublicId(accountPublicId),
      ),
    );

    return aggregate.map((hold) =>
      FinancialAccountHoldResponseMapper.toResponse(hold),
    );
  }

  // ===========================================================================
  // Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Financial Account Hold
  // ---------------------------------------------------------------------------

  /**
   * Creates a new Financial Account Hold.
   *
   * The domain creates the hold in ACTIVE state according to its creation
   * policy.
   *
   * The application workflow is responsible for coordinating the associated
   * Financial HOLD transaction and resulting balance effects.
   */
  @Post()
  @RequirePermissions('financial-account-hold:create')
  public async create(
    @Body() dto: CreateFinancialAccountHoldRequestDto,
  ): Promise<ReturnType<typeof FinancialAccountHoldResponseMapper.toResponse>> {
    // -------------------------------------------------------------------------
    // Business Reference
    // -------------------------------------------------------------------------

    const reference =
      dto.referenceType !== undefined && dto.referencePublicId !== undefined
        ? FinancialHoldReference.create(
            dto.referenceType,
            dto.referencePublicId,
          )
        : undefined;

    // -------------------------------------------------------------------------
    // Expiry
    // -------------------------------------------------------------------------

    const expiresAt =
      dto.expiresAt !== undefined
        ? FinancialHoldExpiry.create(new Date(dto.expiresAt))
        : undefined;

    // -------------------------------------------------------------------------
    // Create Hold
    // -------------------------------------------------------------------------

    const aggregate = await this.createFinancialAccountHoldHandler.execute(
      new CreateFinancialAccountHoldCommand(
        // ---------------------------------------------------------------------
        // Financial Account
        // ---------------------------------------------------------------------

        new FinancialAccountPublicId(dto.accountPublicId),

        // ---------------------------------------------------------------------
        // Held Amount
        // ---------------------------------------------------------------------

        FinancialAccountHeldAmount.create(dto.amount),

        // ---------------------------------------------------------------------
        // Business Reference
        // ---------------------------------------------------------------------

        reference,

        // ---------------------------------------------------------------------
        // Expiry
        // ---------------------------------------------------------------------

        expiresAt,

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

    return FinancialAccountHoldResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Capture Financial Account Hold
  // ---------------------------------------------------------------------------

  /**
   * Captures an ACTIVE Financial Account Hold.
   *
   * The supplied transaction public ID identifies the Financial CAPTURE
   * transaction created/executed by the application workflow.
   *
   * The controller does not execute the transaction itself.
   */
  @Post(':holdPublicId/capture')
  @RequirePermissions('financial-account-hold:capture')
  public async capture(
    @Param('holdPublicId') holdPublicId: string,
    @Body() dto: CaptureFinancialAccountHoldRequestDto,
  ): Promise<ReturnType<typeof FinancialAccountHoldResponseMapper.toResponse>> {
    const capturedAt =
      dto.capturedAt !== undefined ? new Date(dto.capturedAt) : new Date();

    const aggregate = await this.captureFinancialAccountHoldHandler.execute(
      new CaptureFinancialAccountHoldCommand(
        // ---------------------------------------------------------------------
        // Hold Public ID
        // ---------------------------------------------------------------------

        new FinancialAccountHoldPublicId(holdPublicId),

        // ---------------------------------------------------------------------
        // Capture Transaction
        // ---------------------------------------------------------------------

        dto.captureTransactionPublicId,

        // ---------------------------------------------------------------------
        // Captured At
        // ---------------------------------------------------------------------

        capturedAt,

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

    return FinancialAccountHoldResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Release Financial Account Hold
  // ---------------------------------------------------------------------------

  /**
   * Releases an ACTIVE Financial Account Hold.
   *
   * The supplied transaction public ID identifies the Financial RELEASE
   * transaction created/executed by the application workflow.
   *
   * The controller does not execute the transaction itself.
   */
  @Post(':holdPublicId/release')
  @RequirePermissions('financial-account-hold:release')
  public async release(
    @Param('holdPublicId') holdPublicId: string,
    @Body() dto: ReleaseFinancialAccountHoldRequestDto,
  ): Promise<ReturnType<typeof FinancialAccountHoldResponseMapper.toResponse>> {
    const releasedAt =
      dto.releasedAt !== undefined ? new Date(dto.releasedAt) : new Date();

    const aggregate = await this.releaseFinancialAccountHoldHandler.execute(
      new ReleaseFinancialAccountHoldCommand(
        // ---------------------------------------------------------------------
        // Hold Public ID
        // ---------------------------------------------------------------------

        new FinancialAccountHoldPublicId(holdPublicId),

        // ---------------------------------------------------------------------
        // Release Transaction
        // ---------------------------------------------------------------------

        dto.releaseTransactionPublicId,

        // ---------------------------------------------------------------------
        // Released At
        // ---------------------------------------------------------------------

        releasedAt,

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

    return FinancialAccountHoldResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Cancel Financial Account Hold
  // ---------------------------------------------------------------------------

  /**
   * Cancels an ACTIVE Financial Account Hold.
   *
   * Cancellation invalidates the hold as a business reservation and records
   * the Financial RELEASE transaction that resolves the reserved funds.
   *
   * The RELEASE transaction itself is created/executed by the appropriate
   * application workflow.
   *
   * The controller does not execute the RELEASE transaction directly.
   */
  @Post(':holdPublicId/cancel')
  @RequirePermissions('financial-account-hold:cancel')
  public async cancel(
    @Param('holdPublicId') holdPublicId: string,
    @Body() dto: CancelFinancialAccountHoldRequestDto,
  ): Promise<ReturnType<typeof FinancialAccountHoldResponseMapper.toResponse>> {
    const cancelledAt =
      dto.cancelledAt !== undefined ? new Date(dto.cancelledAt) : new Date();

    const aggregate = await this.cancelFinancialAccountHoldHandler.execute(
      new CancelFinancialAccountHoldCommand(
        // ---------------------------------------------------------------------
        // Hold Public ID
        // ---------------------------------------------------------------------

        new FinancialAccountHoldPublicId(holdPublicId),

        // ---------------------------------------------------------------------
        // Release Transaction
        // ---------------------------------------------------------------------

        dto.releaseTransactionPublicId,

        // ---------------------------------------------------------------------
        // Cancelled At
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

    // -------------------------------------------------------------------------
    // Response
    // -------------------------------------------------------------------------

    return FinancialAccountHoldResponseMapper.toResponse(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialAccountHoldsController;
