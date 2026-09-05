// -----------------------------------------------------------------------------
// Accounting — NestJS Module
// -----------------------------------------------------------------------------
//
// Central NestJS module for the Accounting bounded context.
//
// Registered capabilities:
//
// - Accounting Account aggregate;
// - Accounting Period aggregate;
// - Accounting Journal aggregate;
// - chart-of-accounts lifecycle;
// - accounting-period lifecycle;
// - journal composition;
// - journal posting;
// - journal reversal;
// - accounting queries.
//
// The module wires:
//
// - REST controllers;
// - infrastructure repository providers;
// - application command handlers;
// - application query handlers.
//
// Domain behavior remains inside:
//
// - AccountingAccountAggregate;
// - AccountingPeriodAggregate;
// - AccountingJournalAggregate.
//
// Application handlers coordinate use cases and depend only on:
//
// - AccountingAccountRepository;
// - AccountingPeriodRepository;
// - AccountingJournalRepository.
//
// Infrastructure implements those abstractions through:
//
// - PrismaAccountingAccountRepository;
// - PrismaAccountingPeriodRepository;
// - PrismaAccountingJournalRepository.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundaries:
//
// AccountingAccountAggregate
// └── AccountingAccountEntity
//
// AccountingPeriodAggregate
// └── AccountingPeriodEntity
//
// AccountingJournalAggregate
// └── AccountingJournalEntity
//     └── AccountingJournalEntryEntity
//         └── AccountingJournalLineEntity
//
// -----------------------------------------------------------------------------
//
// Infrastructure boundary:
//
// Accounting Application
//          │
//          ▼
//   ACCOUNTING_TOKENS
//          │
//          └── REPOSITORIES
//                  │
//                  ├── ACCOUNTING_ACCOUNT
//                  │       │
//                  │       ▼
//                  │   PrismaAccountingAccountRepository
//                  │
//                  ├── ACCOUNTING_PERIOD
//                  │       │
//                  │       ▼
//                  │   PrismaAccountingPeriodRepository
//                  │
//                  └── ACCOUNTING_JOURNAL
//                          │
//                          ▼
//                     PrismaAccountingJournalRepository
//
// -----------------------------------------------------------------------------
//
// Prisma:
//
// PrismaModule provides PrismaService to the concrete Accounting Prisma
// repositories.
//
// The repositories remain hidden behind:
//
//     ACCOUNTING_TOKENS.REPOSITORIES.*
//
// -----------------------------------------------------------------------------
//
// Application command handlers:
//
// Accounting Account:
//
// - CreateAccountingAccountHandler
// - UpdateAccountingAccountHandler
// - ActivateAccountingAccountHandler
// - InactivateAccountingAccountHandler
// - CloseAccountingAccountHandler
//
// Accounting Period:
//
// - CreateAccountingPeriodHandler
// - CloseAccountingPeriodHandler
//
// Accounting Journal:
//
// - CreateAccountingJournalHandler
// - AddAccountingJournalEntryHandler
// - AddAccountingJournalLineHandler
// - PostAccountingJournalHandler
// - ReverseAccountingJournalHandler
//
// -----------------------------------------------------------------------------
//
// Application query handlers:
//
// Accounting Account:
//
// - GetAccountingAccountHandler
// - GetAccountingAccountsHandler
// - GetAccountingAccountByCodeHandler
//
// Accounting Period:
//
// - GetAccountingPeriodHandler
// - GetAccountingPeriodsHandler
//
// Accounting Journal:
//
// - GetAccountingJournalHandler
// - GetAccountingJournalsHandler
// - GetAccountingJournalsBySourceHandler
//
// -----------------------------------------------------------------------------
//
// Dependency direction:
//
// Presentation
//      │
//      ▼
// Application
//      │
//      ├── Accounting repository abstractions
//      │
//      ▼
// Infrastructure DI
//      │
//      ├── PrismaAccountingAccountRepository
//      ├── PrismaAccountingPeriodRepository
//      └── PrismaAccountingJournalRepository
//
// The application layer does not import concrete infrastructure
// implementations.
//
// -----------------------------------------------------------------------------
//
// Module boundary:
//
// AccountingModule owns:
//
// - controller registration;
// - repository registration;
// - command-handler registration;
// - query-handler registration.
//
// Concrete Prisma repositories remain internal to AccountingModule.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// Handler registrations MUST use the exact tokens defined in:
//
//     application/accounting.tokens.ts
//
// No additional or inferred tokens are introduced here.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Module } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Infrastructure — Database
// -----------------------------------------------------------------------------

import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';

// -----------------------------------------------------------------------------
// Presentation — Controllers
// -----------------------------------------------------------------------------

import {
  AccountingAccountsController,
  AccountingJournalsController,
  AccountingPeriodsController,
} from './presentation/rest/controllers';

// -----------------------------------------------------------------------------
// Infrastructure — Dependency Injection
// -----------------------------------------------------------------------------

import { ACCOUNTING_PROVIDERS } from './infrastructure/dependency-injection/accounting.providers';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { ACCOUNTING_TOKENS } from './application/accounting.tokens';

// -----------------------------------------------------------------------------
// Application — Command Handlers
// -----------------------------------------------------------------------------

import {
  ActivateAccountingAccountHandler,
  AddAccountingJournalEntryHandler,
  AddAccountingJournalLineHandler,
  CloseAccountingAccountHandler,
  CloseAccountingPeriodHandler,
  CreateAccountingAccountHandler,
  CreateAccountingJournalHandler,
  CreateAccountingPeriodHandler,
  InactivateAccountingAccountHandler,
  PostAccountingJournalHandler,
  ReverseAccountingJournalHandler,
  UpdateAccountingAccountHandler,
} from './application/command-handlers';

// -----------------------------------------------------------------------------
// Application — Query Handlers
// -----------------------------------------------------------------------------

import {
  GetAccountingAccountByCodeHandler,
  GetAccountingAccountHandler,
  GetAccountingAccountsHandler,
  GetAccountingJournalHandler,
  GetAccountingJournalsBySourceHandler,
  GetAccountingJournalsHandler,
  GetAccountingPeriodHandler,
  GetAccountingPeriodsHandler,
} from './application/query-handlers';

// =============================================================================
// Accounting Module
// =============================================================================

@Module({
  // ===========================================================================
  // Imports
  // ===========================================================================
  //
  // PrismaModule provides PrismaService to the concrete Accounting Prisma
  // repositories registered through ACCOUNTING_PROVIDERS.
  //
  // ---------------------------------------------------------------------------

  imports: [PrismaModule],

  // ===========================================================================
  // Controllers
  // ===========================================================================
  //
  // Accounting REST transport boundary.
  //
  // Controllers contain no domain business rules.
  //
  // ---------------------------------------------------------------------------

  controllers: [
    AccountingAccountsController,
    AccountingPeriodsController,
    AccountingJournalsController,
  ],

  // ===========================================================================
  // Providers
  // ===========================================================================
  //
  // Infrastructure repository bindings are supplied by
  // ACCOUNTING_PROVIDERS.
  //
  // Application handlers are bound to their exact Accounting DI tokens.
  //
  // ---------------------------------------------------------------------------

  providers: [
    // =========================================================================
    // Infrastructure
    // =========================================================================

    ...ACCOUNTING_PROVIDERS,

    // =========================================================================
    // Accounting Account — Command Handlers
    // =========================================================================

    {
      provide: ACCOUNTING_TOKENS.COMMAND_HANDLERS.CREATE_ACCOUNTING_ACCOUNT,
      useClass: CreateAccountingAccountHandler,
    },

    {
      provide: ACCOUNTING_TOKENS.COMMAND_HANDLERS.UPDATE_ACCOUNTING_ACCOUNT,
      useClass: UpdateAccountingAccountHandler,
    },

    {
      provide: ACCOUNTING_TOKENS.COMMAND_HANDLERS.ACTIVATE_ACCOUNTING_ACCOUNT,
      useClass: ActivateAccountingAccountHandler,
    },

    {
      provide: ACCOUNTING_TOKENS.COMMAND_HANDLERS.INACTIVATE_ACCOUNTING_ACCOUNT,
      useClass: InactivateAccountingAccountHandler,
    },

    {
      provide: ACCOUNTING_TOKENS.COMMAND_HANDLERS.CLOSE_ACCOUNTING_ACCOUNT,
      useClass: CloseAccountingAccountHandler,
    },

    // =========================================================================
    // Accounting Period — Command Handlers
    // =========================================================================

    {
      provide: ACCOUNTING_TOKENS.COMMAND_HANDLERS.CREATE_ACCOUNTING_PERIOD,
      useClass: CreateAccountingPeriodHandler,
    },

    {
      provide: ACCOUNTING_TOKENS.COMMAND_HANDLERS.CLOSE_ACCOUNTING_PERIOD,
      useClass: CloseAccountingPeriodHandler,
    },

    // =========================================================================
    // Accounting Journal — Command Handlers
    // =========================================================================

    {
      provide: ACCOUNTING_TOKENS.COMMAND_HANDLERS.CREATE_ACCOUNTING_JOURNAL,
      useClass: CreateAccountingJournalHandler,
    },

    {
      provide: ACCOUNTING_TOKENS.COMMAND_HANDLERS.ADD_ACCOUNTING_JOURNAL_ENTRY,
      useClass: AddAccountingJournalEntryHandler,
    },

    {
      provide: ACCOUNTING_TOKENS.COMMAND_HANDLERS.ADD_ACCOUNTING_JOURNAL_LINE,
      useClass: AddAccountingJournalLineHandler,
    },

    {
      provide: ACCOUNTING_TOKENS.COMMAND_HANDLERS.POST_ACCOUNTING_JOURNAL,
      useClass: PostAccountingJournalHandler,
    },

    {
      provide: ACCOUNTING_TOKENS.COMMAND_HANDLERS.REVERSE_ACCOUNTING_JOURNAL,
      useClass: ReverseAccountingJournalHandler,
    },

    // =========================================================================
    // Accounting Account — Query Handlers
    // =========================================================================

    {
      provide: ACCOUNTING_TOKENS.QUERY_HANDLERS.GET_ACCOUNTING_ACCOUNT,
      useClass: GetAccountingAccountHandler,
    },

    {
      provide: ACCOUNTING_TOKENS.QUERY_HANDLERS.GET_ACCOUNTING_ACCOUNTS,
      useClass: GetAccountingAccountsHandler,
    },

    {
      provide: ACCOUNTING_TOKENS.QUERY_HANDLERS.GET_ACCOUNTING_ACCOUNT_BY_CODE,
      useClass: GetAccountingAccountByCodeHandler,
    },

    // =========================================================================
    // Accounting Period — Query Handlers
    // =========================================================================

    {
      provide: ACCOUNTING_TOKENS.QUERY_HANDLERS.GET_ACCOUNTING_PERIOD,
      useClass: GetAccountingPeriodHandler,
    },

    {
      provide: ACCOUNTING_TOKENS.QUERY_HANDLERS.GET_ACCOUNTING_PERIODS,
      useClass: GetAccountingPeriodsHandler,
    },

    // =========================================================================
    // Accounting Journal — Query Handlers
    // =========================================================================

    {
      provide: ACCOUNTING_TOKENS.QUERY_HANDLERS.GET_ACCOUNTING_JOURNAL,
      useClass: GetAccountingJournalHandler,
    },

    {
      provide: ACCOUNTING_TOKENS.QUERY_HANDLERS.GET_ACCOUNTING_JOURNALS,
      useClass: GetAccountingJournalsHandler,
    },

    {
      provide:
        ACCOUNTING_TOKENS.QUERY_HANDLERS.GET_ACCOUNTING_JOURNALS_BY_SOURCE,
      useClass: GetAccountingJournalsBySourceHandler,
    },
  ],

  // ===========================================================================
  // Exports
  // ===========================================================================
  //
  // Expose application-facing tokens only.
  //
  // Concrete Prisma repositories remain private to AccountingModule.
  //
  // ---------------------------------------------------------------------------

  exports: [
    // =========================================================================
    // Repositories
    // =========================================================================

    ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_ACCOUNT,

    ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_PERIOD,

    ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_JOURNAL,

    // =========================================================================
    // Accounting Account — Command Handlers
    // =========================================================================

    ACCOUNTING_TOKENS.COMMAND_HANDLERS.CREATE_ACCOUNTING_ACCOUNT,

    ACCOUNTING_TOKENS.COMMAND_HANDLERS.UPDATE_ACCOUNTING_ACCOUNT,

    ACCOUNTING_TOKENS.COMMAND_HANDLERS.ACTIVATE_ACCOUNTING_ACCOUNT,

    ACCOUNTING_TOKENS.COMMAND_HANDLERS.INACTIVATE_ACCOUNTING_ACCOUNT,

    ACCOUNTING_TOKENS.COMMAND_HANDLERS.CLOSE_ACCOUNTING_ACCOUNT,

    // =========================================================================
    // Accounting Period — Command Handlers
    // =========================================================================

    ACCOUNTING_TOKENS.COMMAND_HANDLERS.CREATE_ACCOUNTING_PERIOD,

    ACCOUNTING_TOKENS.COMMAND_HANDLERS.CLOSE_ACCOUNTING_PERIOD,

    // =========================================================================
    // Accounting Journal — Command Handlers
    // =========================================================================

    ACCOUNTING_TOKENS.COMMAND_HANDLERS.CREATE_ACCOUNTING_JOURNAL,

    ACCOUNTING_TOKENS.COMMAND_HANDLERS.ADD_ACCOUNTING_JOURNAL_ENTRY,

    ACCOUNTING_TOKENS.COMMAND_HANDLERS.ADD_ACCOUNTING_JOURNAL_LINE,

    ACCOUNTING_TOKENS.COMMAND_HANDLERS.POST_ACCOUNTING_JOURNAL,

    ACCOUNTING_TOKENS.COMMAND_HANDLERS.REVERSE_ACCOUNTING_JOURNAL,

    // =========================================================================
    // Accounting Account — Query Handlers
    // =========================================================================

    ACCOUNTING_TOKENS.QUERY_HANDLERS.GET_ACCOUNTING_ACCOUNT,

    ACCOUNTING_TOKENS.QUERY_HANDLERS.GET_ACCOUNTING_ACCOUNTS,

    ACCOUNTING_TOKENS.QUERY_HANDLERS.GET_ACCOUNTING_ACCOUNT_BY_CODE,

    // =========================================================================
    // Accounting Period — Query Handlers
    // =========================================================================

    ACCOUNTING_TOKENS.QUERY_HANDLERS.GET_ACCOUNTING_PERIOD,

    ACCOUNTING_TOKENS.QUERY_HANDLERS.GET_ACCOUNTING_PERIODS,

    // =========================================================================
    // Accounting Journal — Query Handlers
    // =========================================================================

    ACCOUNTING_TOKENS.QUERY_HANDLERS.GET_ACCOUNTING_JOURNAL,

    ACCOUNTING_TOKENS.QUERY_HANDLERS.GET_ACCOUNTING_JOURNALS,

    ACCOUNTING_TOKENS.QUERY_HANDLERS.GET_ACCOUNTING_JOURNALS_BY_SOURCE,
  ],
})
export class AccountingModule {}

// =============================================================================
// Default Export
// =============================================================================

export default AccountingModule;
