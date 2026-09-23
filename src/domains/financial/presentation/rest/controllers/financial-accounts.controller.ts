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
// -----------------------------------------------------------------------------
//
// Financial Account read boundaries:
//
// 1. GET /financial-accounts/me
//
//    Authenticated self-read.
//
//    The authenticated Identity is resolved from the access token through
//    CurrentIdentity.
//
//        Access Token
//             ↓
//        JwtAuthGuard
//             ↓
//        CurrentIdentity
//             ↓
//        IdentityPublicId
//             ↓
//        FinancialAccountOwnerPublicId
//             ↓
//        GetMyFinancialAccountQuery
//             ↓
//        findByOwnerPublicId()
//             ↓
//        FinancialAccountAggregate
//
//    This endpoint requires authentication only.
//
//    It does NOT require:
//
//        PermissionsGuard
//        financial-account:read
//
// 2. GET /financial-accounts/:accountPublicId
//
//    Direct Financial Account read.
//
//    This endpoint is protected by:
//
//        JwtAuthGuard
//        PermissionsGuard
//        financial-account:read
//
// 3. GET /financial-accounts/:accountPublicId/balance
//
//    Direct Financial Account balance read.
//
//    Authentication is required.
//
//    The balance is aggregate-owned and is therefore retrieved through:
//
//        GetFinancialAccountBalanceQuery
//             ↓
//        GetFinancialAccountBalanceHandler
//             ↓
//        FinancialAccountAggregate
//             ↓
//        aggregate.balance
//             ↓
//        FinancialAccountBalanceEntity
//
//    This endpoint does NOT require:
//
//        PermissionsGuard
//        financial-account:read
//
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// GetMyFinancialAccountQuery and GetFinancialAccountQuery are intentionally
// separate application queries.
//
// GetMyFinancialAccountQuery:
//
//     FinancialAccountOwnerPublicId → findByOwnerPublicId()
//
// GetFinancialAccountQuery:
//
//     FinancialAccountPublicId → findByPublicId()
//
// GetFinancialAccountBalanceQuery:
//
//     FinancialAccountPublicId → aggregate containing balance
//
// The controller must not pass FinancialAccountPublicId to the self-read
// query.
//
// The balance query handler returns FinancialAccountAggregate because the
// FinancialAccountBalanceEntity is aggregate-owned and is not an independent
// aggregate.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - HTTP transport;
// - DTO binding and validation;
// - extraction of authenticated identity from JWT security context;
// - conversion of transport primitives to domain value objects;
// - dispatching application commands and queries;
// - mapping application/domain results to HTTP response models.
//
// The controller contains NO business rules.
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

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Foundation — Security
// -----------------------------------------------------------------------------

import {
  CurrentIdentity,
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
  type AuthenticatedIdentity,
} from '../../../../../foundation/security/auth';

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
  GetMyFinancialAccountQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregates
// -----------------------------------------------------------------------------

import type { FinancialAccountAggregate } from '../../../domain/aggregates/financial-account.aggregate';

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

    @Inject(FINANCIAL_ACCOUNT_TOKENS.QUERY_HANDLERS.GET_ME)
    private readonly getMyFinancialAccountHandler: QueryHandler<
      GetMyFinancialAccountQuery,
      FinancialAccountAggregate
    >,

    @Inject(FINANCIAL_ACCOUNT_TOKENS.QUERY_HANDLERS.GET_BALANCE)
    private readonly getFinancialAccountBalanceHandler: QueryHandler<
      GetFinancialAccountBalanceQuery,
      FinancialAccountAggregate
    >,
  ) {}

  // ===========================================================================
  // Financial Account Queries — Authenticated Owner
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Current Authenticated Financial Account
  // ---------------------------------------------------------------------------
  //
  // Self-read.
  //
  // Authentication is required, but Financial Account read permission is NOT.
  //
  // The account is resolved from the authenticated Identity rather than from
  // an account public ID supplied by the client.
  //
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get current financial account',
    description:
      'Returns the Financial Account belonging to the authenticated identity.',
  })
  @Get('me')
  @UseGuards(JwtAuthGuard)
  public async getCurrent(
    @CurrentIdentity() identity: AuthenticatedIdentity,
  ): Promise<ReturnType<typeof FinancialAccountResponseMapper.toResponse>> {
    const query = new GetMyFinancialAccountQuery(
      FinancialAccountOwnerPublicId.create(identity.identityPublicId),
    );

    const aggregate = await this.getMyFinancialAccountHandler.execute(query);

    return FinancialAccountResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Financial Account Queries — Direct Account Access
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Financial Account
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get a financial account',
    description: 'Returns a Financial Account aggregate by its public ID.',
  })
  @Get(':accountPublicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
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
  //
  // The application handler returns the complete FinancialAccountAggregate.
  //
  // The balance is owned by that aggregate:
  //
  //     FinancialAccountAggregate
  //     └── balance: FinancialAccountBalanceEntity
  //
  // Therefore the controller extracts aggregate.balance before passing the
  // domain entity to balanceFromEntity().
  //
  // This is important because balanceFromEntity() operates on the actual
  // FinancialAccountBalanceEntity and may call domain behavior such as:
  //
  //     balance.totalAmount()
  //
  // The aggregate itself exposes totalAmount as a property, whereas the
  // balance entity exposes totalAmount() as a domain method.
  //
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get financial account balance',
    description:
      'Returns the balance belonging to an authenticated Financial Account.',
  })
  @Get(':accountPublicId/balance')
  @UseGuards(JwtAuthGuard)
  public async getBalance(
    @Param('accountPublicId') accountPublicId: string,
  ): Promise<
    ReturnType<typeof FinancialAccountResponseMapper.balanceFromEntity>
  > {
    const aggregate = await this.getFinancialAccountBalanceHandler.execute(
      new GetFinancialAccountBalanceQuery(
        new FinancialAccountPublicId(accountPublicId),
      ),
    );

    return FinancialAccountResponseMapper.balanceFromEntity(aggregate.balance);
  }

  // ===========================================================================
  // Financial Account Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Financial Account
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create financial account',
    description: 'Creates a Financial Account.',
  })
  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
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

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Activate financial account',
    description: 'Activates a Financial Account.',
  })
  @Post(':accountPublicId/activate')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
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

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Suspend financial account',
    description: 'Suspends a Financial Account.',
  })
  @Post(':accountPublicId/suspend')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
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

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Close financial account',
    description: 'Closes a Financial Account.',
  })
  @Post(':accountPublicId/close')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
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
