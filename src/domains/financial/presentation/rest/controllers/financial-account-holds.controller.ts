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
// Responsibilities:
// - HTTP transport and request DTO validation;
// - conversion of transport primitives to domain value objects;
// - dispatching application commands and queries;
// - mapping application/domain results to HTTP responses.
//
// Business rules remain inside the aggregate.
// Application orchestration remains inside command/query handlers.
// Persistence remains behind the repository.
//
// The controller does not execute financial transactions or modify balances
// directly.
//
// Lifecycle:
//
// ACTIVE -> RELEASED
// ACTIVE -> CAPTURED
// ACTIVE -> CANCELLED
//
// RELEASED, CAPTURED and CANCELLED are terminal states.
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

import { randomUUID } from 'node:crypto';

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Security
// -----------------------------------------------------------------------------

import {
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../../../../../foundation/security/auth';

// -----------------------------------------------------------------------------
// Application — Handler Contracts
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

import {
  GetAllFinancialAccountHoldsQuery,
  GetFinancialAccountHoldsQuery,
} from '../../../application/queries';

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
@ApiBearerAuth('access-token')
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

    @Inject(FINANCIAL_ACCOUNT_HOLD_TOKENS.QUERY_HANDLERS.GET_ALL)
    private readonly getAllFinancialAccountHoldsHandler: QueryHandler<
      GetAllFinancialAccountHoldsQuery,
      FinancialAccountHoldAggregate[]
    >,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get All Financial Account Holds
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get all financial account holds',
    description: 'Returns Financial Account Hold aggregates.',
  })
  @Get()
  @RequirePermissions('admin:read')
  public async getAll(): Promise<
    ReturnType<typeof FinancialAccountHoldResponseMapper.toResponse>[]
  > {
    const aggregates = await this.getAllFinancialAccountHoldsHandler.execute(
      new GetAllFinancialAccountHoldsQuery(),
    );

    return aggregates.map((aggregate) =>
      FinancialAccountHoldResponseMapper.toResponse(aggregate),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Financial Account Holds by Account
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get financial account holds by account',
    description:
      'Returns Financial Account Holds associated with a Financial Account.',
  })
  @Get('accounts/:accountPublicId')
  @RequirePermissions('admin:read')
  public async getByAccount(
    @Param('accountPublicId') accountPublicId: string,
  ): Promise<
    ReturnType<typeof FinancialAccountHoldResponseMapper.toResponse>[]
  > {
    const aggregates = await this.getFinancialAccountHoldsHandler.execute(
      new GetFinancialAccountHoldsQuery(
        new FinancialAccountPublicId(accountPublicId),
      ),
    );

    return aggregates.map((aggregate) =>
      FinancialAccountHoldResponseMapper.toResponse(aggregate),
    );
  }

  // ===========================================================================
  // Create Financial Account Hold
  // ===========================================================================

  @ApiOperation({
    summary: 'Create financial account hold',
    description: 'Creates an ACTIVE Financial Account Hold.',
  })
  @Post()
  @RequirePermissions('admin:read')
  public async create(
    @Body() dto: CreateFinancialAccountHoldRequestDto,
  ): Promise<ReturnType<typeof FinancialAccountHoldResponseMapper.toResponse>> {
    const reference =
      dto.referenceType !== undefined && dto.referencePublicId !== undefined
        ? FinancialHoldReference.create(
            dto.referenceType,
            dto.referencePublicId,
          )
        : undefined;

    const expiresAt =
      dto.expiresAt !== undefined
        ? FinancialHoldExpiry.create(new Date(dto.expiresAt))
        : undefined;

    const aggregate = await this.createFinancialAccountHoldHandler.execute(
      new CreateFinancialAccountHoldCommand(
        new FinancialAccountPublicId(dto.accountPublicId),
        FinancialAccountHeldAmount.create(dto.amount),
        reference,
        expiresAt,
        dto.correlationId,
        dto.causationId,
      ),
    );

    return FinancialAccountHoldResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Capture Financial Account Hold
  // ===========================================================================

  @ApiOperation({
    summary: 'Capture financial account hold',
    description:
      'Captures an ACTIVE Financial Account Hold using its capture transaction.',
  })
  @Post(':holdPublicId/capture')
  @RequirePermissions('admin:read')
  public async capture(
    @Param('holdPublicId') holdPublicId: string,
    @Body() dto: CaptureFinancialAccountHoldRequestDto,
  ): Promise<ReturnType<typeof FinancialAccountHoldResponseMapper.toResponse>> {
    const aggregate = await this.captureFinancialAccountHoldHandler.execute(
      new CaptureFinancialAccountHoldCommand(
        new FinancialAccountHoldPublicId(holdPublicId),
        dto.captureTransactionPublicId,
        new Date(dto.capturedAt),
        randomUUID(),
        dto.causationId,
      ),
    );

    return FinancialAccountHoldResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Release Financial Account Hold
  // ===========================================================================

  @ApiOperation({
    summary: 'Release financial account hold',
    description:
      'Releases an ACTIVE Financial Account Hold using its release transaction.',
  })
  @Post(':holdPublicId/release')
  @RequirePermissions('admin:read')
  public async release(
    @Param('holdPublicId') holdPublicId: string,
    @Body() dto: ReleaseFinancialAccountHoldRequestDto,
  ): Promise<ReturnType<typeof FinancialAccountHoldResponseMapper.toResponse>> {
    const aggregate = await this.releaseFinancialAccountHoldHandler.execute(
      new ReleaseFinancialAccountHoldCommand(
        new FinancialAccountHoldPublicId(holdPublicId),
        dto.releaseTransactionPublicId,
        new Date(dto.releasedAt),
        randomUUID(),
        dto.causationId,
      ),
    );

    return FinancialAccountHoldResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Cancel Financial Account Hold
  // ===========================================================================

  @ApiOperation({
    summary: 'Cancel financial account hold',
    description:
      'Cancels an ACTIVE Financial Account Hold and records its release transaction.',
  })
  @Post(':holdPublicId/cancel')
  @RequirePermissions('admin:read')
  public async cancel(
    @Param('holdPublicId') holdPublicId: string,
    @Body() dto: CancelFinancialAccountHoldRequestDto,
  ): Promise<ReturnType<typeof FinancialAccountHoldResponseMapper.toResponse>> {
    const aggregate = await this.cancelFinancialAccountHoldHandler.execute(
      new CancelFinancialAccountHoldCommand(
        new FinancialAccountHoldPublicId(holdPublicId),
        dto.releaseTransactionPublicId,
        new Date(dto.cancelledAt),
        randomUUID(),
        dto.causationId,
      ),
    );

    return FinancialAccountHoldResponseMapper.toResponse(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialAccountHoldsController;
