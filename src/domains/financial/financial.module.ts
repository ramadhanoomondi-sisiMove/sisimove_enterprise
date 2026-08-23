// -----------------------------------------------------------------------------
// Financial — NestJS Module
// -----------------------------------------------------------------------------
//
// Financial bounded context.
//
// Responsibilities:
//
// - Financial Account management;
// - Financial Transaction management;
// - Financial account balance queries;
// - Financial account transaction queries;
// - Financial transaction queries;
// - Financial lifecycle orchestration.
//
// The module owns the Financial bounded-context dependency graph.
//
// Domain behavior remains inside Financial aggregates.
// Application orchestration remains inside command/query handlers.
// Persistence remains behind domain repository contracts.
//
// Other bounded contexts integrate through exported domain/application
// contracts rather than directly depending on Prisma persistence.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Module } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Domain Dependencies
// -----------------------------------------------------------------------------

import { IdentityModule } from '../identity/identity.module';

// -----------------------------------------------------------------------------
// Infrastructure
// -----------------------------------------------------------------------------

import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';

// -----------------------------------------------------------------------------
// Presentation — Controllers
// -----------------------------------------------------------------------------

import { FinancialAccountsController } from './presentation/rest/controllers/financial-accounts.controller';

import { FinancialTransactionsController } from './presentation/rest/controllers/financial-transactions.controller';

// -----------------------------------------------------------------------------
// Infrastructure — Financial Account Dependency Injection
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_PROVIDERS } from './infrastructure/dependency-injection/financial-account.providers';

// -----------------------------------------------------------------------------
// Infrastructure — Financial Transaction Dependency Injection
// -----------------------------------------------------------------------------

import { FINANCIAL_TRANSACTION_PROVIDERS } from './infrastructure/dependency-injection/financial-transaction.providers';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_TOKENS } from './application/financial-account.tokens';

import { FINANCIAL_TRANSACTION_TOKENS } from './application/financial-transaction.tokens';

// -----------------------------------------------------------------------------
// Application — Command Handlers
// -----------------------------------------------------------------------------

import {
  ActivateFinancialAccountHandler,
  CancelFinancialTransactionHandler,
  CloseFinancialAccountHandler,
  CompleteFinancialTransactionHandler,
  CreateFinancialAccountHandler,
  CreateFinancialTransactionHandler,
  FailFinancialTransactionHandler,
  ReverseFinancialTransactionHandler,
  SuspendFinancialAccountHandler,
} from './application/command-handlers';

// -----------------------------------------------------------------------------
// Application — Query Handlers
// -----------------------------------------------------------------------------

import {
  GetFinancialAccountBalanceHandler,
  GetFinancialAccountHandler,
  GetFinancialAccountTransactionsHandler,
  GetFinancialTransactionHandler,
} from './application/query-handlers';

// -----------------------------------------------------------------------------
// Module
// -----------------------------------------------------------------------------

@Module({
  // ===========================================================================
  // Imports
  // ===========================================================================

  imports: [
    // -------------------------------------------------------------------------
    // Identity
    // -------------------------------------------------------------------------

    IdentityModule,

    // -------------------------------------------------------------------------
    // Prisma
    // -------------------------------------------------------------------------

    PrismaModule,
  ],

  // ===========================================================================
  // Controllers
  // ===========================================================================

  controllers: [
    // -------------------------------------------------------------------------
    // Financial Account
    // -------------------------------------------------------------------------

    FinancialAccountsController,

    // -------------------------------------------------------------------------
    // Financial Transaction
    // -------------------------------------------------------------------------

    FinancialTransactionsController,
  ],

  // ===========================================================================
  // Providers
  // ===========================================================================

  providers: [
    // =========================================================================
    // Infrastructure — Financial Account
    // =========================================================================

    ...FINANCIAL_ACCOUNT_PROVIDERS,

    // =========================================================================
    // Infrastructure — Financial Transaction
    // =========================================================================

    ...FINANCIAL_TRANSACTION_PROVIDERS,

    // =========================================================================
    // Financial Account — Command Handlers
    // =========================================================================

    {
      provide: FINANCIAL_ACCOUNT_TOKENS.COMMAND_HANDLERS.CREATE,
      useClass: CreateFinancialAccountHandler,
    },

    {
      provide: FINANCIAL_ACCOUNT_TOKENS.COMMAND_HANDLERS.ACTIVATE,
      useClass: ActivateFinancialAccountHandler,
    },

    {
      provide: FINANCIAL_ACCOUNT_TOKENS.COMMAND_HANDLERS.SUSPEND,
      useClass: SuspendFinancialAccountHandler,
    },

    {
      provide: FINANCIAL_ACCOUNT_TOKENS.COMMAND_HANDLERS.CLOSE,
      useClass: CloseFinancialAccountHandler,
    },

    // =========================================================================
    // Financial Account — Query Handlers
    // =========================================================================

    {
      provide: FINANCIAL_ACCOUNT_TOKENS.QUERY_HANDLERS.GET,
      useClass: GetFinancialAccountHandler,
    },

    {
      provide: FINANCIAL_ACCOUNT_TOKENS.QUERY_HANDLERS.GET_BALANCE,
      useClass: GetFinancialAccountBalanceHandler,
    },

    // =========================================================================
    // Financial Transaction — Command Handlers
    // =========================================================================

    {
      provide: FINANCIAL_TRANSACTION_TOKENS.COMMAND_HANDLERS.CREATE,
      useClass: CreateFinancialTransactionHandler,
    },

    {
      provide: FINANCIAL_TRANSACTION_TOKENS.COMMAND_HANDLERS.COMPLETE,
      useClass: CompleteFinancialTransactionHandler,
    },

    {
      provide: FINANCIAL_TRANSACTION_TOKENS.COMMAND_HANDLERS.FAIL,
      useClass: FailFinancialTransactionHandler,
    },

    {
      provide: FINANCIAL_TRANSACTION_TOKENS.COMMAND_HANDLERS.REVERSE,
      useClass: ReverseFinancialTransactionHandler,
    },

    {
      provide: FINANCIAL_TRANSACTION_TOKENS.COMMAND_HANDLERS.CANCEL,
      useClass: CancelFinancialTransactionHandler,
    },

    // =========================================================================
    // Financial Transaction — Query Handlers
    // =========================================================================

    {
      provide: FINANCIAL_TRANSACTION_TOKENS.QUERY_HANDLERS.GET,
      useClass: GetFinancialTransactionHandler,
    },

    {
      provide:
        FINANCIAL_TRANSACTION_TOKENS.QUERY_HANDLERS.GET_ACCOUNT_TRANSACTIONS,
      useClass: GetFinancialAccountTransactionsHandler,
    },
  ],

  // ===========================================================================
  // Exports
  // ===========================================================================
  //
  // Keep the Financial bounded-context boundary narrow.
  //
  // Controllers and application handlers remain private to this module.
  //
  // Repository tokens are exported so other bounded contexts can integrate
  // through Financial domain contracts rather than directly depending on
  // Prisma persistence.
  //
  // ===========================================================================

  exports: [
    // -------------------------------------------------------------------------
    // Financial Account Repository
    // -------------------------------------------------------------------------

    FINANCIAL_ACCOUNT_TOKENS.REPOSITORY,

    // -------------------------------------------------------------------------
    // Financial Transaction Repository
    // -------------------------------------------------------------------------

    FINANCIAL_TRANSACTION_TOKENS.REPOSITORY,
  ],
})
export class FinancialModule {}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialModule;
