// -----------------------------------------------------------------------------
// Accounting — Periods HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Accounting Period aggregate operations.
//
// Aggregate:
//
// AccountingPeriodAggregate
// └── AccountingPeriodEntity
//
// -----------------------------------------------------------------------------
//
// Period operations:
//
// 1. POST   /accounting/periods
//    Create an Accounting Period.
//
// 2. GET    /accounting/periods
//    List Accounting Periods.
//
// 3. GET    /accounting/periods/:publicId
//    Get an Accounting Period by public identity.
//
// 4. PATCH  /accounting/periods/:publicId/close
//    Close an Accounting Period.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - HTTP transport;
// - DTO binding and validation;
// - conversion from transport primitives to domain value objects;
// - generation of application correlation identifiers;
// - dispatching Accounting commands and queries;
// - mapping application/domain results to transport responses.
//
// The controller contains NO business rules.
//
// Domain behavior remains inside:
//
// - AccountingPeriodAggregate;
// - AccountingPeriodEntity.
//
// Application orchestration remains inside:
//
// - command handlers;
// - query handlers.
//
// Persistence remains behind:
//
// - AccountingPeriodRepository.
//
// -----------------------------------------------------------------------------
//
// Important:
//
// - Internal entity identifiers are never returned to clients.
// - publicId is the externally exposed Accounting Period identity.
// - Response mapping is centralized in AccountingPeriodResponseMapper.
// - The controller never accesses Prisma or repositories directly.
// - Lifecycle transitions are delegated entirely to command handlers/domain.
// - Correlation identifiers are generated at the transport boundary.
// - Creation-event recording remains the responsibility of the create handler.
// - The route publicId is authoritative for lifecycle operations.
// - The close request does not expose closedAt; the application workflow
//   establishes the effective closing timestamp.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Node.js
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
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Foundation — Security
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

import { ACCOUNTING_TOKENS } from '../../../application/accounting.tokens';

// -----------------------------------------------------------------------------
// Application — Commands
// -----------------------------------------------------------------------------

import {
  CloseAccountingPeriodCommand,
  CreateAccountingPeriodCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import {
  GetAccountingPeriodQuery,
  GetAccountingPeriodsQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { AccountingPeriodAggregate } from '../../../domain/aggregates/accounting-period.aggregate';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  AccountingPeriodName,
  AccountingPeriodPublicId,
  AccountingPeriodStatus,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import { CreateAccountingPeriodRequestDto } from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Query DTO
// -----------------------------------------------------------------------------

import { GetAccountingPeriodsQueryDto } from '../dto/queries';

// -----------------------------------------------------------------------------
// Presentation — Response Mapper
// -----------------------------------------------------------------------------

import {
  AccountingPeriodResponseMapper,
  type AccountingPeriodResponse,
} from '../mappers/accounting-period.response.mapper';

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Accounting Periods')
@ApiBearerAuth('access-token')
@Controller('accounting/periods')
export class AccountingPeriodsController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Command Handlers
    // -------------------------------------------------------------------------

    @Inject(ACCOUNTING_TOKENS.COMMAND_HANDLERS.CREATE_ACCOUNTING_PERIOD)
    private readonly createAccountingPeriodHandler: CommandHandler<
      CreateAccountingPeriodCommand,
      AccountingPeriodAggregate
    >,

    @Inject(ACCOUNTING_TOKENS.COMMAND_HANDLERS.CLOSE_ACCOUNTING_PERIOD)
    private readonly closeAccountingPeriodHandler: CommandHandler<
      CloseAccountingPeriodCommand,
      AccountingPeriodAggregate
    >,

    // -------------------------------------------------------------------------
    // Query Handlers
    // -------------------------------------------------------------------------

    @Inject(ACCOUNTING_TOKENS.QUERY_HANDLERS.GET_ACCOUNTING_PERIOD)
    private readonly getAccountingPeriodHandler: QueryHandler<
      GetAccountingPeriodQuery,
      AccountingPeriodAggregate | null
    >,

    @Inject(ACCOUNTING_TOKENS.QUERY_HANDLERS.GET_ACCOUNTING_PERIODS)
    private readonly getAccountingPeriodsHandler: QueryHandler<
      GetAccountingPeriodsQuery,
      readonly AccountingPeriodAggregate[]
    >,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Accounting Periods
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'List accounting periods',
    description:
      'Returns Accounting Periods optionally filtered by lifecycle status.',
  })
  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('accounting-period:read')
  public async getPeriods(
    @Query() dto: GetAccountingPeriodsQueryDto,
  ): Promise<AccountingPeriodResponse[]> {
    const status =
      dto.status === undefined
        ? undefined
        : AccountingPeriodStatus.create(dto.status);

    const query = new GetAccountingPeriodsQuery(status);

    const periods = await this.getAccountingPeriodsHandler.execute(query);

    return periods.map((period) =>
      AccountingPeriodResponseMapper.toResponse(period),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Accounting Period
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get an accounting period',
    description:
      'Returns an Accounting Period identified by its public identity.',
  })
  @ApiParam({
    name: 'publicId',
    type: String,
    required: true,
    description: 'Public ID of the Accounting Period.',
    example: '7b4c7b7e-2d2a-4e6c-8a8b-7f2d9a1c1234',
  })
  @Get(':publicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('accounting-period:read')
  public async get(
    @Param('publicId') publicId: string,
  ): Promise<AccountingPeriodResponse | null> {
    const query = new GetAccountingPeriodQuery(
      new AccountingPeriodPublicId(publicId),
    );

    const period = await this.getAccountingPeriodHandler.execute(query);

    if (period === null) {
      return null;
    }

    return AccountingPeriodResponseMapper.toResponse(period);
  }

  // ===========================================================================
  // Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Accounting Period
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Create an accounting period',
    description:
      'Creates a new Accounting Period using the supplied name and period boundaries.',
  })
  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('accounting-period:create')
  public async create(
    @Body() dto: CreateAccountingPeriodRequestDto,
  ): Promise<AccountingPeriodResponse> {
    const command = new CreateAccountingPeriodCommand(
      AccountingPeriodName.create(dto.name),
      dto.startsAt,
      dto.endsAt,
      randomUUID(),
    );

    const period = await this.createAccountingPeriodHandler.execute(command);

    return AccountingPeriodResponseMapper.toResponse(period);
  }

  // ---------------------------------------------------------------------------
  // Close Accounting Period
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Close an accounting period',
    description:
      'Closes an Accounting Period according to its domain lifecycle rules.',
  })
  @ApiParam({
    name: 'publicId',
    type: String,
    required: true,
    description: 'Public ID of the Accounting Period to close.',
    example: '7b4c7b7e-2d2a-4e6c-8a8b-7f2d9a1c1234',
  })
  @Patch(':publicId/close')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('accounting-period:close')
  public async close(
    @Param('publicId') publicId: string,
  ): Promise<AccountingPeriodResponse> {
    const command = new CloseAccountingPeriodCommand(
      new AccountingPeriodPublicId(publicId),
      undefined,
      randomUUID(),
    );

    const period = await this.closeAccountingPeriodHandler.execute(command);

    return AccountingPeriodResponseMapper.toResponse(period);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AccountingPeriodsController;
