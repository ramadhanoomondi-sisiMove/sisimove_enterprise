// -----------------------------------------------------------------------------
// Accounting — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Accounting Account aggregate operations.
//
// Aggregate:
//
// AccountingAccountAggregate
// └── AccountingAccountEntity
//
// -----------------------------------------------------------------------------
//
// Account operations:
//
// 1. POST   /accounting/accounts
//    Create an Accounting Account.
//
// 2. GET    /accounting/accounts
//    List Accounting Accounts.
//
// 3. GET    /accounting/accounts/code/:code
//    Get an Accounting Account by account code.
//
// 4. GET    /accounting/accounts/:publicId
//    Get an Accounting Account by public identity.
//
// 5. PATCH  /accounting/accounts/:publicId
//    Update an Accounting Account.
//
// 6. PATCH  /accounting/accounts/:publicId/activate
//    Activate an Accounting Account.
//
// 7. PATCH  /accounting/accounts/:publicId/inactivate
//    Inactivate an Accounting Account.
//
// 8. PATCH  /accounting/accounts/:publicId/close
//    Close an Accounting Account.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - HTTP transport;
// - DTO binding and validation;
// - conversion from transport primitives to domain value objects;
// - resolution of public parent-account identity into an internal identity;
// - generation of application correlation identifiers;
// - dispatching Accounting commands and queries;
// - mapping application/domain results to transport responses.
//
// The controller contains NO business rules.
//
// Domain behavior remains inside:
//
// - AccountingAccountAggregate;
// - AccountingAccountEntity.
//
// Application orchestration remains inside:
//
// - command handlers;
// - query handlers.
//
// Persistence remains behind:
//
// - AccountingAccountRepository.
//
// -----------------------------------------------------------------------------
//
// Important:
//
// - Internal entity identifiers are never returned to clients.
// - parentAccountId is used only to construct application commands.
// - Parent-account resolution is performed through the Accounting Account
//   query boundary.
// - Response mapping is centralized in AccountingAccountResponseMapper.
// - The controller never accesses Prisma or repositories directly.
// - Lifecycle transitions are delegated entirely to command handlers/domain.
// - Correlation identifiers are generated at the transport boundary.
// - Creation-event recording remains the responsibility of the create handler.
// - The route publicId is authoritative for update/lifecycle operations.
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
// Foundation — Domain
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { ACCOUNTING_TOKENS } from '../../../application/accounting.tokens';

// -----------------------------------------------------------------------------
// Application — Commands
// -----------------------------------------------------------------------------

import {
  ActivateAccountingAccountCommand,
  CloseAccountingAccountCommand,
  CreateAccountingAccountCommand,
  InactivateAccountingAccountCommand,
  UpdateAccountingAccountCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import {
  GetAccountingAccountByCodeQuery,
  GetAccountingAccountQuery,
  GetAccountingAccountsQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { AccountingAccountAggregate } from '../../../domain/aggregates/accounting-account.aggregate';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  AccountingAccountCode,
  AccountingAccountName,
  AccountingAccountPublicId,
  AccountingAccountStatus,
  AccountingAccountType,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  CreateAccountingAccountRequestDto,
  UpdateAccountingAccountRequestDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Query DTOs
// -----------------------------------------------------------------------------

import { GetAccountingAccountsQueryDto } from '../dto/queries';

// -----------------------------------------------------------------------------
// Presentation — Response Mapper
// -----------------------------------------------------------------------------

import {
  AccountingAccountResponseMapper,
  type AccountingAccountResponse,
} from '../mappers/accounting-account.response.mapper';

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Accounting Accounts')
@ApiBearerAuth('access-token')
@Controller('accounting/accounts')
export class AccountingAccountsController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Command Handlers
    // -------------------------------------------------------------------------

    @Inject(ACCOUNTING_TOKENS.COMMAND_HANDLERS.CREATE_ACCOUNTING_ACCOUNT)
    private readonly createAccountingAccountHandler: CommandHandler<
      CreateAccountingAccountCommand,
      AccountingAccountAggregate
    >,

    @Inject(ACCOUNTING_TOKENS.COMMAND_HANDLERS.UPDATE_ACCOUNTING_ACCOUNT)
    private readonly updateAccountingAccountHandler: CommandHandler<
      UpdateAccountingAccountCommand,
      AccountingAccountAggregate
    >,

    @Inject(ACCOUNTING_TOKENS.COMMAND_HANDLERS.ACTIVATE_ACCOUNTING_ACCOUNT)
    private readonly activateAccountingAccountHandler: CommandHandler<
      ActivateAccountingAccountCommand,
      AccountingAccountAggregate
    >,

    @Inject(ACCOUNTING_TOKENS.COMMAND_HANDLERS.INACTIVATE_ACCOUNTING_ACCOUNT)
    private readonly inactivateAccountingAccountHandler: CommandHandler<
      InactivateAccountingAccountCommand,
      AccountingAccountAggregate
    >,

    @Inject(ACCOUNTING_TOKENS.COMMAND_HANDLERS.CLOSE_ACCOUNTING_ACCOUNT)
    private readonly closeAccountingAccountHandler: CommandHandler<
      CloseAccountingAccountCommand,
      AccountingAccountAggregate
    >,

    // -------------------------------------------------------------------------
    // Query Handlers
    // -------------------------------------------------------------------------

    @Inject(ACCOUNTING_TOKENS.QUERY_HANDLERS.GET_ACCOUNTING_ACCOUNT)
    private readonly getAccountingAccountHandler: QueryHandler<
      GetAccountingAccountQuery,
      AccountingAccountAggregate | null
    >,

    @Inject(ACCOUNTING_TOKENS.QUERY_HANDLERS.GET_ACCOUNTING_ACCOUNTS)
    private readonly getAccountingAccountsHandler: QueryHandler<
      GetAccountingAccountsQuery,
      readonly AccountingAccountAggregate[]
    >,

    @Inject(ACCOUNTING_TOKENS.QUERY_HANDLERS.GET_ACCOUNTING_ACCOUNT_BY_CODE)
    private readonly getAccountingAccountByCodeHandler: QueryHandler<
      GetAccountingAccountByCodeQuery,
      AccountingAccountAggregate | null
    >,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Accounting Accounts
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'List accounting accounts',
    description:
      'Returns Accounting Accounts optionally filtered by lifecycle status and account type.',
  })
  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('accounting-account:read')
  public async getAccounts(
    @Query() dto: GetAccountingAccountsQueryDto,
  ): Promise<AccountingAccountResponse[]> {
    const status =
      dto.status === undefined
        ? undefined
        : AccountingAccountStatus.create(dto.status);

    const type =
      dto.type === undefined
        ? undefined
        : AccountingAccountType.create(dto.type);

    const query = new GetAccountingAccountsQuery(status, type);

    const accounts = await this.getAccountingAccountsHandler.execute(query);

    return accounts.map((account) =>
      AccountingAccountResponseMapper.toResponse(account),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Accounting Account By Code
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get an accounting account by code',
    description:
      'Returns an Accounting Account identified by its unique accounting code.',
  })
  @ApiParam({
    name: 'code',
    type: String,
    required: true,
    description: 'Unique accounting account code.',
    example: '1000',
  })
  @Get('code/:code')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('accounting-account:read')
  public async getByCode(
    @Param('code') code: string,
  ): Promise<AccountingAccountResponse | null> {
    const query = new GetAccountingAccountByCodeQuery(
      AccountingAccountCode.create(code),
    );

    const account = await this.getAccountingAccountByCodeHandler.execute(query);

    if (account === null) {
      return null;
    }

    return AccountingAccountResponseMapper.toResponse(account);
  }

  // ---------------------------------------------------------------------------
  // Get Accounting Account
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get an accounting account',
    description:
      'Returns an Accounting Account identified by its public identity.',
  })
  @ApiParam({
    name: 'publicId',
    type: String,
    required: true,
    description: 'Public ID of the Accounting Account.',
    example: 'ACC_550e8400-e29b-41d4-a716-446655440000',
  })
  @Get(':publicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('accounting-account:read')
  public async get(
    @Param('publicId') publicId: string,
  ): Promise<AccountingAccountResponse | null> {
    const query = new GetAccountingAccountQuery(
      new AccountingAccountPublicId(publicId),
    );

    const account = await this.getAccountingAccountHandler.execute(query);

    if (account === null) {
      return null;
    }

    return AccountingAccountResponseMapper.toResponse(account);
  }

  // ===========================================================================
  // Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Accounting Account
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Create an accounting account',
    description:
      'Creates a new Accounting Account with an optional parent account.',
  })
  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('accounting-account:create')
  public async create(
    @Body() dto: CreateAccountingAccountRequestDto,
  ): Promise<AccountingAccountResponse> {
    const parentAccountId: UniqueEntityId | undefined =
      dto.parentAccountPublicId === undefined
        ? undefined
        : await this.resolveParentAccountId(dto.parentAccountPublicId);

    const command = new CreateAccountingAccountCommand(
      AccountingAccountCode.create(dto.code),
      AccountingAccountName.create(dto.name),
      AccountingAccountType.create(dto.type),
      parentAccountId,
      randomUUID(),
    );

    const account = await this.createAccountingAccountHandler.execute(command);

    return AccountingAccountResponseMapper.toResponse(account);
  }

  // ---------------------------------------------------------------------------
  // Update Accounting Account
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Update an accounting account',
    description:
      'Updates the mutable properties of an existing Accounting Account.',
  })
  @ApiParam({
    name: 'publicId',
    type: String,
    required: true,
    description: 'Public ID of the Accounting Account to update.',
    example: 'ACC_550e8400-e29b-41d4-a716-446655440000',
  })
  @Patch(':publicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('accounting-account:update')
  public async update(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateAccountingAccountRequestDto,
  ): Promise<AccountingAccountResponse> {
    const parentAccountId: UniqueEntityId | undefined =
      dto.parentAccountPublicId === undefined
        ? undefined
        : await this.resolveParentAccountId(dto.parentAccountPublicId);

    const command = new UpdateAccountingAccountCommand(
      new AccountingAccountPublicId(publicId),

      dto.code === undefined
        ? undefined
        : AccountingAccountCode.create(dto.code),

      dto.name === undefined
        ? undefined
        : AccountingAccountName.create(dto.name),

      dto.type === undefined
        ? undefined
        : AccountingAccountType.create(dto.type),

      parentAccountId,

      dto.removeParentAccount ?? false,

      randomUUID(),
    );

    const account = await this.updateAccountingAccountHandler.execute(command);

    return AccountingAccountResponseMapper.toResponse(account);
  }

  // ---------------------------------------------------------------------------
  // Activate Accounting Account
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Activate an accounting account',
    description:
      'Activates an Accounting Account according to its domain lifecycle rules.',
  })
  @ApiParam({
    name: 'publicId',
    type: String,
    required: true,
    description: 'Public ID of the Accounting Account.',
    example: 'ACC_550e8400-e29b-41d4-a716-446655440000',
  })
  @Patch(':publicId/activate')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('accounting-account:activate')
  public async activate(
    @Param('publicId') publicId: string,
  ): Promise<AccountingAccountResponse> {
    const command = new ActivateAccountingAccountCommand(
      new AccountingAccountPublicId(publicId),
      randomUUID(),
    );

    const account =
      await this.activateAccountingAccountHandler.execute(command);

    return AccountingAccountResponseMapper.toResponse(account);
  }

  // ---------------------------------------------------------------------------
  // Inactivate Accounting Account
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Inactivate an accounting account',
    description:
      'Inactivates an Accounting Account according to its domain lifecycle rules.',
  })
  @ApiParam({
    name: 'publicId',
    type: String,
    required: true,
    description: 'Public ID of the Accounting Account.',
    example: 'ACC_550e8400-e29b-41d4-a716-446655440000',
  })
  @Patch(':publicId/inactivate')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('accounting-account:inactivate')
  public async inactivate(
    @Param('publicId') publicId: string,
  ): Promise<AccountingAccountResponse> {
    const command = new InactivateAccountingAccountCommand(
      new AccountingAccountPublicId(publicId),
      randomUUID(),
    );

    const account =
      await this.inactivateAccountingAccountHandler.execute(command);

    return AccountingAccountResponseMapper.toResponse(account);
  }

  // ---------------------------------------------------------------------------
  // Close Accounting Account
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Close an accounting account',
    description:
      'Closes an Accounting Account according to its domain lifecycle rules.',
  })
  @ApiParam({
    name: 'publicId',
    type: String,
    required: true,
    description: 'Public ID of the Accounting Account.',
    example: 'ACC_550e8400-e29b-41d4-a716-446655440000',
  })
  @Patch(':publicId/close')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('accounting-account:close')
  public async close(
    @Param('publicId') publicId: string,
  ): Promise<AccountingAccountResponse> {
    const command = new CloseAccountingAccountCommand(
      new AccountingAccountPublicId(publicId),
      randomUUID(),
    );

    const account = await this.closeAccountingAccountHandler.execute(command);

    return AccountingAccountResponseMapper.toResponse(account);
  }

  // ===========================================================================
  // Internal Transport Resolution
  // ===========================================================================

  /**
   * Resolves a public parent-account identity into the internal identity
   * required by the Accounting Account command.
   *
   * The query handler owns aggregate retrieval.
   *
   * The controller does not:
   *
   * - access repositories;
   * - access Prisma;
   * - inspect persistence models;
   * - validate parent-account business rules.
   *
   * The aggregate's own structural/business invariants remain authoritative.
   */
  private async resolveParentAccountId(
    parentAccountPublicId: string,
  ): Promise<UniqueEntityId> {
    const parent = await this.getAccountingAccountHandler.execute(
      new GetAccountingAccountQuery(
        new AccountingAccountPublicId(parentAccountPublicId),
      ),
    );

    if (parent === null) {
      throw new Error('Parent Accounting Account was not found.');
    }

    return parent.account.id;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AccountingAccountsController;
