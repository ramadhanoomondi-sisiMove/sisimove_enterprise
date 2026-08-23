// -----------------------------------------------------------------------------
// Financial — NestJS Module
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
// Presentation
// -----------------------------------------------------------------------------

import { FinancialAccountsController } from './presentation/rest/controllers/financial-accounts.controller';

// -----------------------------------------------------------------------------
// Infrastructure — Dependency Injection
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_PROVIDERS } from './infrastructure/dependency-injection/financial-account.providers';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_TOKENS } from './application/financial-account.tokens';

// -----------------------------------------------------------------------------
// Application — Command Handlers
// -----------------------------------------------------------------------------

import {
  ActivateFinancialAccountHandler,
  CloseFinancialAccountHandler,
  CreateFinancialAccountHandler,
  SuspendFinancialAccountHandler,
} from './application/command-handlers';

// -----------------------------------------------------------------------------
// Application — Query Handlers
// -----------------------------------------------------------------------------

import {
  GetFinancialAccountBalanceHandler,
  GetFinancialAccountHandler,
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

  controllers: [FinancialAccountsController],

  // ===========================================================================
  // Providers
  // ===========================================================================

  providers: [
    // -------------------------------------------------------------------------
    // Infrastructure — Repository
    // -------------------------------------------------------------------------

    ...FINANCIAL_ACCOUNT_PROVIDERS,

    // =========================================================================
    // Financial Account Lifecycle
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
    // Financial Account Queries
    // =========================================================================

    {
      provide: FINANCIAL_ACCOUNT_TOKENS.QUERY_HANDLERS.GET,
      useClass: GetFinancialAccountHandler,
    },

    {
      provide: FINANCIAL_ACCOUNT_TOKENS.QUERY_HANDLERS.GET_BALANCE,
      useClass: GetFinancialAccountBalanceHandler,
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
  // The repository token is exported so other bounded contexts can integrate
  // through the Financial domain contract rather than directly depending on
  // Prisma persistence.
  // ===========================================================================

  exports: [FINANCIAL_ACCOUNT_TOKENS.REPOSITORY],
})
export class FinancialModule {}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialModule;
