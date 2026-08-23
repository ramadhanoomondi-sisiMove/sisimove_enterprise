// -----------------------------------------------------------------------------
// Financial Account — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Financial Account operations.
//
// Aggregate:
//
// FinancialAccountAggregate
// ├── FinancialAccountEntity
// └── FinancialAccountBalanceEntity
//
// The controller is responsible only for:
// - HTTP transport;
// - DTO validation;
// - conversion from transport primitives to domain value objects;
// - dispatching application commands and queries.
//
// Domain behavior remains inside FinancialAccountAggregate.
// Application orchestration remains inside command/query handlers.
// Persistence remains behind FinancialAccountRepository.
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

import { FINANCIAL_ACCOUNT_TOKENS } from '../../../application/financial-account.tokens';

// -----------------------------------------------------------------------------
// Application — Commands
// -----------------------------------------------------------------------------

import {
  ActivateFinancialAccountCommand,
  CloseFinancialAccountCommand,
  CreateFinancialAccountCommand,
  SuspendFinancialAccountCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import {
  GetFinancialAccountBalanceQuery,
  GetFinancialAccountQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregates
// -----------------------------------------------------------------------------

import type { FinancialAccountAggregate } from '../../../domain/aggregates/financial-account.aggregate';

// -----------------------------------------------------------------------------
// Domain — Entities
// -----------------------------------------------------------------------------

import type { FinancialAccountBalanceEntity } from '../../../domain/entities/financial-account-balance.entity';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  Currency,
  FinancialAccountOwnerPublicId,
  FinancialAccountPublicId,
  FinancialAccountType,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  ActivateFinancialAccountDto,
  CloseFinancialAccountDto,
  CreateFinancialAccountDto,
  SuspendFinancialAccountDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Response Mapper
// -----------------------------------------------------------------------------

import { FinancialAccountResponseMapper } from '../mappers/financial-account-response.mapper';

// -----------------------------------------------------------------------------
// Controller
// -----------------------------------------------------------------------------

@ApiTags('Financial Accounts')
@Controller('financial-accounts')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FinancialAccountsController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Command Handlers
    // -------------------------------------------------------------------------

    @Inject(FINANCIAL_ACCOUNT_TOKENS.COMMAND_HANDLERS.CREATE)
    private readonly createFinancialAccountHandler: CommandHandler<
      CreateFinancialAccountCommand,
      FinancialAccountAggregate
    >,

    @Inject(FINANCIAL_ACCOUNT_TOKENS.COMMAND_HANDLERS.ACTIVATE)
    private readonly activateFinancialAccountHandler: CommandHandler<
      ActivateFinancialAccountCommand,
      FinancialAccountAggregate
    >,

    @Inject(FINANCIAL_ACCOUNT_TOKENS.COMMAND_HANDLERS.SUSPEND)
    private readonly suspendFinancialAccountHandler: CommandHandler<
      SuspendFinancialAccountCommand,
      FinancialAccountAggregate
    >,

    @Inject(FINANCIAL_ACCOUNT_TOKENS.COMMAND_HANDLERS.CLOSE)
    private readonly closeFinancialAccountHandler: CommandHandler<
      CloseFinancialAccountCommand,
      FinancialAccountAggregate
    >,

    // -------------------------------------------------------------------------
    // Query Handlers
    // -------------------------------------------------------------------------

    @Inject(FINANCIAL_ACCOUNT_TOKENS.QUERY_HANDLERS.GET)
    private readonly getFinancialAccountHandler: QueryHandler<
      GetFinancialAccountQuery,
      FinancialAccountAggregate | null
    >,

    @Inject(FINANCIAL_ACCOUNT_TOKENS.QUERY_HANDLERS.GET_BALANCE)
    private readonly getFinancialAccountBalanceHandler: QueryHandler<
      GetFinancialAccountBalanceQuery,
      FinancialAccountBalanceEntity | null
    >,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Financial Account
  // ---------------------------------------------------------------------------

  @Get(':accountPublicId')
  @RequirePermissions('financial-account:read')
  public async get(
    @Param('accountPublicId') accountPublicId: string,
  ): Promise<ReturnType<
    typeof FinancialAccountResponseMapper.toResponse
  > | null> {
    const aggregate = await this.getFinancialAccountHandler.execute(
      new GetFinancialAccountQuery(
        new FinancialAccountPublicId(accountPublicId),
      ),
    );

    if (aggregate === null) {
      return null;
    }

    return FinancialAccountResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Get Financial Account Balance
  // ---------------------------------------------------------------------------

  @Get(':accountPublicId/balance')
  @RequirePermissions('financial-account:read')
  public async getBalance(
    @Param('accountPublicId') accountPublicId: string,
  ): Promise<FinancialAccountBalanceEntity | null> {
    return this.getFinancialAccountBalanceHandler.execute(
      new GetFinancialAccountBalanceQuery(
        new FinancialAccountPublicId(accountPublicId),
      ),
    );
  }

  // ===========================================================================
  // Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Financial Account
  // ---------------------------------------------------------------------------

  @Post()
  @RequirePermissions('financial-account:create')
  public async create(
    @Body() dto: CreateFinancialAccountDto,
  ): Promise<ReturnType<typeof FinancialAccountResponseMapper.toResponse>> {
    const aggregate = await this.createFinancialAccountHandler.execute(
      new CreateFinancialAccountCommand(
        FinancialAccountOwnerPublicId.create(dto.ownerPublicId),

        FinancialAccountType.create(dto.type),

        Currency.create(dto.currency),

        dto.correlationId,

        dto.causationId,
      ),
    );

    return FinancialAccountResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Activate Financial Account
  // ---------------------------------------------------------------------------

  @Post(':accountPublicId/activate')
  @RequirePermissions('financial-account:activate')
  public async activate(
    @Param('accountPublicId') accountPublicId: string,
    @Body() dto: ActivateFinancialAccountDto,
  ): Promise<ReturnType<typeof FinancialAccountResponseMapper.toResponse>> {
    const aggregate = await this.activateFinancialAccountHandler.execute(
      new ActivateFinancialAccountCommand(
        new FinancialAccountPublicId(accountPublicId),

        new Date(dto.activatedAt),

        dto.correlationId,

        dto.causationId,
      ),
    );

    return FinancialAccountResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Suspend Financial Account
  // ---------------------------------------------------------------------------

  @Post(':accountPublicId/suspend')
  @RequirePermissions('financial-account:suspend')
  public async suspend(
    @Param('accountPublicId') accountPublicId: string,
    @Body() dto: SuspendFinancialAccountDto,
  ): Promise<ReturnType<typeof FinancialAccountResponseMapper.toResponse>> {
    const aggregate = await this.suspendFinancialAccountHandler.execute(
      new SuspendFinancialAccountCommand(
        new FinancialAccountPublicId(accountPublicId),

        new Date(dto.suspendedAt),

        dto.correlationId,

        dto.causationId,
      ),
    );

    return FinancialAccountResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Close Financial Account
  // ---------------------------------------------------------------------------

  @Post(':accountPublicId/close')
  @RequirePermissions('financial-account:close')
  public async close(
    @Param('accountPublicId') accountPublicId: string,
    @Body() dto: CloseFinancialAccountDto,
  ): Promise<ReturnType<typeof FinancialAccountResponseMapper.toResponse>> {
    const aggregate = await this.closeFinancialAccountHandler.execute(
      new CloseFinancialAccountCommand(
        new FinancialAccountPublicId(accountPublicId),

        new Date(dto.closedAt),

        dto.correlationId,

        dto.causationId,
      ),
    );

    return FinancialAccountResponseMapper.toResponse(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialAccountsController;
