// -----------------------------------------------------------------------------
// Accounting — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Accounting Journal aggregate operations.
//
// Aggregate:
//
// AccountingJournalAggregate
// ├── AccountingJournalEntity
// ├── AccountingJournalEntryEntity[]
// │   └── AccountingJournalLineEntity[]
// └── AccountingPostingReferenceEntity?
//
// Responsibilities:
//
// - HTTP transport;
// - DTO binding and validation;
// - conversion from transport primitives to domain value objects;
// - dispatching Accounting Journal commands and queries;
// - mapping application/domain results to transport responses;
// - generating application message correlation identifiers.
//
// The controller contains NO business rules.
//
// Domain behavior remains inside:
// - AccountingJournalAggregate;
// - AccountingJournalEntity;
// - AccountingJournalEntryEntity;
// - AccountingJournalLineEntity.
//
// Application orchestration remains inside command/query handlers.
//
// The controller does NOT:
//
// - access Prisma;
// - access repositories;
// - construct domain entities;
// - validate journal balancing;
// - determine whether accounts exist;
// - determine whether periods exist;
// - determine whether periods are open;
// - perform accounting calculations;
// - perform aggregate business rules.
//
// Cross-aggregate validation belongs to the application/domain workflow.
//
// -----------------------------------------------------------------------------
//
// Routes:
//
// POST   /accounting/journals
// GET    /accounting/journals
// GET    /accounting/journals/source
// GET    /accounting/journals/:publicId
// POST   /accounting/journals/:publicId/entries
// POST   /accounting/journals/:publicId/entries/:entryId/lines
// POST   /accounting/journals/:publicId/post
// POST   /accounting/journals/:publicId/reverse
//
// -----------------------------------------------------------------------------
//
// Lifecycle:
//
// DRAFT → POSTED → REVERSED
//
// REVERSED is terminal.
//
// -----------------------------------------------------------------------------
//
// Security:
//
// JWT authentication and Accounting Journal permissions are enforced at the
// HTTP boundary.
//
// Authorization remains outside the Accounting Journal aggregate.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Node
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
// Foundation — Application
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Foundation — Domain
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Foundation — Security
// -----------------------------------------------------------------------------

import {
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../../../../../foundation/security/auth';

// -----------------------------------------------------------------------------
// Accounting — Application
// -----------------------------------------------------------------------------

import { ACCOUNTING_TOKENS } from '../../../application/accounting.tokens';

// -----------------------------------------------------------------------------
// Accounting — Commands
// -----------------------------------------------------------------------------

import {
  AddAccountingJournalEntryCommand,
  AddAccountingJournalLineCommand,
  CreateAccountingJournalCommand,
  PostAccountingJournalCommand,
  ReverseAccountingJournalCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Accounting — Queries
// -----------------------------------------------------------------------------

import {
  GetAccountingJournalQuery,
  GetAccountingJournalsBySourceQuery,
  GetAccountingJournalsQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Accounting — Domain
// -----------------------------------------------------------------------------

import type { AccountingJournalAggregate } from '../../../domain/aggregates/accounting-journal.aggregate';

import {
  AccountingAccountPublicId,
  AccountingAmount,
  AccountingCurrency,
  AccountingJournalLineType,
  AccountingJournalPublicId,
  AccountingJournalStatus,
  AccountingPeriodPublicId,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Accounting — Transport DTOs
// -----------------------------------------------------------------------------

import {
  AddAccountingJournalEntryRequestDto,
  AddAccountingJournalLineRequestDto,
  CreateAccountingJournalRequestDto,
} from '../dto/request';

import {
  GetAccountingJournalsBySourceQueryDto,
  GetAccountingJournalsQueryDto,
} from '../dto/queries';

// -----------------------------------------------------------------------------
// Accounting — Response Mapper
// -----------------------------------------------------------------------------

import {
  AccountingJournalResponseMapper,
  type AccountingJournalResponse,
} from '../mappers/accounting-journal.response.mapper';

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Accounting Journals')
@ApiBearerAuth()
@Controller('accounting/journals')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AccountingJournalsController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Commands
    // -------------------------------------------------------------------------

    @Inject(ACCOUNTING_TOKENS.COMMAND_HANDLERS.CREATE_ACCOUNTING_JOURNAL)
    private readonly createAccountingJournalHandler: CommandHandler<
      CreateAccountingJournalCommand,
      AccountingJournalAggregate
    >,

    @Inject(ACCOUNTING_TOKENS.COMMAND_HANDLERS.ADD_ACCOUNTING_JOURNAL_ENTRY)
    private readonly addAccountingJournalEntryHandler: CommandHandler<
      AddAccountingJournalEntryCommand,
      AccountingJournalAggregate
    >,

    @Inject(ACCOUNTING_TOKENS.COMMAND_HANDLERS.ADD_ACCOUNTING_JOURNAL_LINE)
    private readonly addAccountingJournalLineHandler: CommandHandler<
      AddAccountingJournalLineCommand,
      AccountingJournalAggregate
    >,

    @Inject(ACCOUNTING_TOKENS.COMMAND_HANDLERS.POST_ACCOUNTING_JOURNAL)
    private readonly postAccountingJournalHandler: CommandHandler<
      PostAccountingJournalCommand,
      AccountingJournalAggregate
    >,

    @Inject(ACCOUNTING_TOKENS.COMMAND_HANDLERS.REVERSE_ACCOUNTING_JOURNAL)
    private readonly reverseAccountingJournalHandler: CommandHandler<
      ReverseAccountingJournalCommand,
      AccountingJournalAggregate
    >,

    // -------------------------------------------------------------------------
    // Queries
    // -------------------------------------------------------------------------

    @Inject(ACCOUNTING_TOKENS.QUERY_HANDLERS.GET_ACCOUNTING_JOURNAL)
    private readonly getAccountingJournalHandler: QueryHandler<
      GetAccountingJournalQuery,
      AccountingJournalAggregate | null
    >,

    @Inject(ACCOUNTING_TOKENS.QUERY_HANDLERS.GET_ACCOUNTING_JOURNALS)
    private readonly getAccountingJournalsHandler: QueryHandler<
      GetAccountingJournalsQuery,
      readonly AccountingJournalAggregate[]
    >,

    @Inject(ACCOUNTING_TOKENS.QUERY_HANDLERS.GET_ACCOUNTING_JOURNALS_BY_SOURCE)
    private readonly getAccountingJournalsBySourceHandler: QueryHandler<
      GetAccountingJournalsBySourceQuery,
      readonly AccountingJournalAggregate[]
    >,
  ) {}

  // ===========================================================================
  // Create
  // ===========================================================================

  /**
   * Create a new Accounting Journal.
   *
   * POST /accounting/journals
   */
  @Post()
  @RequirePermissions('accounting-journal:create')
  @ApiOperation({
    summary: 'Create an Accounting Journal',
    description:
      'Creates a new Accounting Journal in DRAFT status. Currency defaults to KES when omitted.',
  })
  public async create(
    @Body() dto: CreateAccountingJournalRequestDto,
  ): Promise<AccountingJournalResponse> {
    // -------------------------------------------------------------------------
    // Currency
    // -------------------------------------------------------------------------

    const currency = AccountingCurrency.create(dto.currency ?? 'KES');

    // -------------------------------------------------------------------------
    // Optional Accounting Period
    // -------------------------------------------------------------------------
    //
    // The controller carries the period public identity into the application
    // command.
    //
    // The application workflow is responsible for resolving that public
    // identity to the internal Accounting Period identity.
    //
    // The controller must not access AccountingPeriodRepository directly.
    //
    // -------------------------------------------------------------------------

    const periodPublicId =
      dto.periodPublicId === undefined
        ? undefined
        : new AccountingPeriodPublicId(dto.periodPublicId);

    // -------------------------------------------------------------------------
    // Command
    // -------------------------------------------------------------------------

    const command = new CreateAccountingJournalCommand(
      currency,
      randomUUID(),
      undefined,
      periodPublicId,
    );

    // -------------------------------------------------------------------------
    // Execute
    // -------------------------------------------------------------------------

    const journal = await this.createAccountingJournalHandler.execute(command);

    // -------------------------------------------------------------------------
    // Response
    // -------------------------------------------------------------------------

    return AccountingJournalResponseMapper.toResponse(journal);
  }

  // ===========================================================================
  // Get Journals
  // ===========================================================================

  /**
   * Retrieve Accounting Journals using optional filters.
   *
   * GET /accounting/journals
   */
  @Get()
  @RequirePermissions('accounting-journal:read')
  @ApiOperation({
    summary: 'Get Accounting Journals',
    description:
      'Retrieves Accounting Journals with optional status, currency, and Accounting Period filters.',
  })
  public async getJournals(
    @Query() dto: GetAccountingJournalsQueryDto,
  ): Promise<readonly AccountingJournalResponse[]> {
    // -------------------------------------------------------------------------
    // Status
    // -------------------------------------------------------------------------

    const status =
      dto.status === undefined
        ? undefined
        : AccountingJournalStatus.create(dto.status);

    // -------------------------------------------------------------------------
    // Currency
    // -------------------------------------------------------------------------

    const currency =
      dto.currency === undefined
        ? undefined
        : AccountingCurrency.create(dto.currency);

    // -------------------------------------------------------------------------
    // Accounting Period
    // -------------------------------------------------------------------------

    const periodPublicId =
      dto.periodPublicId === undefined
        ? undefined
        : new AccountingPeriodPublicId(dto.periodPublicId);

    // -------------------------------------------------------------------------
    // Query
    // -------------------------------------------------------------------------

    const query = new GetAccountingJournalsQuery(
      status,
      currency,
      periodPublicId,
    );

    // -------------------------------------------------------------------------
    // Execute
    // -------------------------------------------------------------------------

    const journals = await this.getAccountingJournalsHandler.execute(query);

    // -------------------------------------------------------------------------
    // Response
    // -------------------------------------------------------------------------

    return journals.map((journal) =>
      AccountingJournalResponseMapper.toResponse(journal),
    );
  }

  // ===========================================================================
  // Get Journals By Source
  // ===========================================================================

  /**
   * Retrieve Accounting Journals by posting source.
   *
   * GET /accounting/journals/source
   *
   * This route is intentionally declared before /:publicId so the static
   * "source" segment cannot be interpreted as a journal public identifier.
   */
  @Get('source')
  @RequirePermissions('accounting-journal:read')
  @ApiOperation({
    summary: 'Get Accounting Journals by source',
    description:
      'Retrieves Accounting Journals associated with an opaque posting source identity.',
  })
  public async getJournalsBySource(
    @Query() dto: GetAccountingJournalsBySourceQueryDto,
  ): Promise<readonly AccountingJournalResponse[]> {
    // -------------------------------------------------------------------------
    // Query
    // -------------------------------------------------------------------------

    const query = new GetAccountingJournalsBySourceQuery(
      dto.sourceType,
      dto.sourcePublicId,
    );

    // -------------------------------------------------------------------------
    // Execute
    // -------------------------------------------------------------------------

    const journals =
      await this.getAccountingJournalsBySourceHandler.execute(query);

    // -------------------------------------------------------------------------
    // Response
    // -------------------------------------------------------------------------

    return journals.map((journal) =>
      AccountingJournalResponseMapper.toResponse(journal),
    );
  }

  // ===========================================================================
  // Get Journal
  // ===========================================================================

  /**
   * Retrieve a single Accounting Journal by public identity.
   *
   * GET /accounting/journals/:publicId
   */
  @Get(':publicId')
  @RequirePermissions('accounting-journal:read')
  @ApiOperation({
    summary: 'Get an Accounting Journal',
    description:
      'Retrieves a single Accounting Journal aggregate by its public identity.',
  })
  @ApiParam({
    name: 'publicId',
    description: 'Public identity of the Accounting Journal.',
    example: 'JNL_01JABC123XYZ',
  })
  public async getJournal(
    @Param('publicId') publicId: string,
  ): Promise<AccountingJournalResponse | null> {
    // -------------------------------------------------------------------------
    // Query
    // -------------------------------------------------------------------------

    const query = new GetAccountingJournalQuery(
      new AccountingJournalPublicId(publicId),
    );

    // -------------------------------------------------------------------------
    // Execute
    // -------------------------------------------------------------------------

    const journal = await this.getAccountingJournalHandler.execute(query);

    // -------------------------------------------------------------------------
    // Not Found
    // -------------------------------------------------------------------------

    if (journal === null) {
      return null;
    }

    // -------------------------------------------------------------------------
    // Response
    // -------------------------------------------------------------------------

    return AccountingJournalResponseMapper.toResponse(journal);
  }

  // ===========================================================================
  // Add Journal Entry
  // ===========================================================================

  /**
   * Add a Journal Entry to an existing Accounting Journal.
   *
   * POST /accounting/journals/:publicId/entries
   */
  @Post(':publicId/entries')
  @RequirePermissions('accounting-journal:update')
  @ApiOperation({
    summary: 'Add an Accounting Journal Entry',
    description:
      'Adds a new Journal Entry to an existing Accounting Journal aggregate.',
  })
  @ApiParam({
    name: 'publicId',
    description: 'Public identity of the Accounting Journal.',
    example: 'JNL_01JABC123XYZ',
  })
  public async addEntry(
    @Param('publicId') publicId: string,
    @Body() dto: AddAccountingJournalEntryRequestDto,
  ): Promise<AccountingJournalResponse> {
    // -------------------------------------------------------------------------
    // Command
    // -------------------------------------------------------------------------

    const command = new AddAccountingJournalEntryCommand(
      new AccountingJournalPublicId(publicId),
      dto.entryDate,
      randomUUID(),
      dto.description,
    );

    // -------------------------------------------------------------------------
    // Execute
    // -------------------------------------------------------------------------

    const journal =
      await this.addAccountingJournalEntryHandler.execute(command);

    // -------------------------------------------------------------------------
    // Response
    // -------------------------------------------------------------------------

    return AccountingJournalResponseMapper.toResponse(journal);
  }

  // ===========================================================================
  // Add Journal Line
  // ===========================================================================

  /**
   * Add a debit or credit line to an existing Journal Entry.
   *
   * POST /accounting/journals/:publicId/entries/:entryId/lines
   */
  @Post(':publicId/entries/:entryId/lines')
  @RequirePermissions('accounting-journal:update')
  @ApiOperation({
    summary: 'Add an Accounting Journal Line',
    description:
      'Adds a debit or credit line to an existing Accounting Journal Entry.',
  })
  @ApiParam({
    name: 'publicId',
    description: 'Public identity of the Accounting Journal.',
    example: 'JNL_01JABC123XYZ',
  })
  @ApiParam({
    name: 'entryId',
    description: 'Internal identity of the Accounting Journal Entry.',
    example: '01JABC123XYZ',
  })
  public async addLine(
    @Param('publicId') publicId: string,
    @Param('entryId') entryId: string,
    @Body() dto: AddAccountingJournalLineRequestDto,
  ): Promise<AccountingJournalResponse> {
    // -------------------------------------------------------------------------
    // Domain Value Objects
    // -------------------------------------------------------------------------

    const accountPublicId = new AccountingAccountPublicId(dto.accountPublicId);

    const type = AccountingJournalLineType.create(dto.type);

    const amount = AccountingAmount.create(dto.amount);

    const currency = AccountingCurrency.create(dto.currency);

    // -------------------------------------------------------------------------
    // Command
    // -------------------------------------------------------------------------

    const command = new AddAccountingJournalLineCommand(
      new AccountingJournalPublicId(publicId),
      new UniqueEntityId(entryId),
      accountPublicId,
      type,
      amount,
      currency,
      randomUUID(),
      dto.description,
    );

    // -------------------------------------------------------------------------
    // Execute
    // -------------------------------------------------------------------------

    const journal = await this.addAccountingJournalLineHandler.execute(command);

    // -------------------------------------------------------------------------
    // Response
    // -------------------------------------------------------------------------

    return AccountingJournalResponseMapper.toResponse(journal);
  }

  // ===========================================================================
  // Post Journal
  // ===========================================================================

  /**
   * Post an Accounting Journal.
   *
   * POST /accounting/journals/:publicId/post
   *
   * Lifecycle:
   *
   * DRAFT → POSTED
   */
  @Post(':publicId/post')
  @RequirePermissions('accounting-journal:post')
  @ApiOperation({
    summary: 'Post an Accounting Journal',
    description:
      'Posts a valid balanced Accounting Journal. The journal must be in DRAFT status and contain valid entries and lines.',
  })
  @ApiParam({
    name: 'publicId',
    description: 'Public identity of the Accounting Journal.',
    example: 'JNL_01JABC123XYZ',
  })
  public async post(
    @Param('publicId') publicId: string,
  ): Promise<AccountingJournalResponse> {
    // -------------------------------------------------------------------------
    // Command
    // -------------------------------------------------------------------------

    const command = new PostAccountingJournalCommand(
      new AccountingJournalPublicId(publicId),
      randomUUID(),
    );

    // -------------------------------------------------------------------------
    // Execute
    // -------------------------------------------------------------------------

    const journal = await this.postAccountingJournalHandler.execute(command);

    // -------------------------------------------------------------------------
    // Response
    // -------------------------------------------------------------------------

    return AccountingJournalResponseMapper.toResponse(journal);
  }

  // ===========================================================================
  // Reverse Journal
  // ===========================================================================

  /**
   * Reverse an Accounting Journal.
   *
   * POST /accounting/journals/:publicId/reverse
   *
   * Lifecycle:
   *
   * DRAFT → POSTED → REVERSED
   */
  @Post(':publicId/reverse')
  @RequirePermissions('accounting-journal:reverse')
  @ApiOperation({
    summary: 'Reverse an Accounting Journal',
    description:
      'Reverses a POSTED Accounting Journal. Existing entries and lines remain historically preserved.',
  })
  @ApiParam({
    name: 'publicId',
    description: 'Public identity of the Accounting Journal.',
    example: 'JNL_01JABC123XYZ',
  })
  public async reverse(
    @Param('publicId') publicId: string,
  ): Promise<AccountingJournalResponse> {
    // -------------------------------------------------------------------------
    // Command
    // -------------------------------------------------------------------------

    const command = new ReverseAccountingJournalCommand(
      new AccountingJournalPublicId(publicId),
      randomUUID(),
    );

    // -------------------------------------------------------------------------
    // Execute
    // -------------------------------------------------------------------------

    const journal = await this.reverseAccountingJournalHandler.execute(command);

    // -------------------------------------------------------------------------
    // Response
    // -------------------------------------------------------------------------

    return AccountingJournalResponseMapper.toResponse(journal);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AccountingJournalsController;
