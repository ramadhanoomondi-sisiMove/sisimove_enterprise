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
// - Financial Payment management;
// - Financial Payment Method management;
// - Financial account balance queries;
// - Financial account transaction queries;
// - Financial payment queries;
// - Financial payment method queries;
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

import { FinancialPaymentsController } from './presentation/rest/controllers/financial-payments.controller';

import { FinancialPaymentMethodsController } from './presentation/rest/controllers/financial-payment-methods.controller';

// -----------------------------------------------------------------------------
// Infrastructure — Financial Account Dependency Injection
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_PROVIDERS } from './infrastructure/dependency-injection/financial-account.providers';

// -----------------------------------------------------------------------------
// Infrastructure — Financial Transaction Dependency Injection
// -----------------------------------------------------------------------------

import { FINANCIAL_TRANSACTION_PROVIDERS } from './infrastructure/dependency-injection/financial-transaction.providers';

// -----------------------------------------------------------------------------
// Infrastructure — Financial Payment Dependency Injection
// -----------------------------------------------------------------------------

import { FINANCIAL_PAYMENT_PROVIDERS } from './infrastructure/dependency-injection/financial-payment.providers';

// -----------------------------------------------------------------------------
// Infrastructure — Financial Payment Method Dependency Injection
// -----------------------------------------------------------------------------

import { FINANCIAL_PAYMENT_METHOD_PROVIDERS } from './infrastructure/dependency-injection/financial-payment-method.providers';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_TOKENS } from './application/financial-account.tokens';

import { FINANCIAL_TRANSACTION_TOKENS } from './application/financial-transaction.tokens';

import { FINANCIAL_PAYMENT_TOKENS } from './application/financial-payment.tokens';

import { FINANCIAL_PAYMENT_METHOD_TOKENS } from './application/financial-payment-method.tokens';

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

import {
  CancelFinancialPaymentHandler,
  CreateFinancialPaymentHandler,
  ExpireFinancialPaymentHandler,
  FailFinancialPaymentHandler,
  LinkFinancialPaymentTransactionHandler,
  ProcessFinancialPaymentHandler,
  SucceedFinancialPaymentHandler,
} from './application/command-handlers';

import {
  AddFinancialPaymentMethodHandler,
  DeactivateFinancialPaymentMethodHandler,
  SetDefaultFinancialPaymentMethodHandler,
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

import { GetFinancialPaymentHandler } from './application/query-handlers';

import {
  GetDefaultFinancialPaymentMethodHandler,
  GetFinancialPaymentMethodHandler,
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

    // -------------------------------------------------------------------------
    // Financial Payment
    // -------------------------------------------------------------------------

    FinancialPaymentsController,

    // -------------------------------------------------------------------------
    // Financial Payment Method
    // -------------------------------------------------------------------------

    FinancialPaymentMethodsController,
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
    // Infrastructure — Financial Payment
    // =========================================================================

    ...FINANCIAL_PAYMENT_PROVIDERS,

    // =========================================================================
    // Infrastructure — Financial Payment Method
    // =========================================================================

    ...FINANCIAL_PAYMENT_METHOD_PROVIDERS,

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

    // =========================================================================
    // Financial Payment — Command Handlers
    // =========================================================================

    {
      provide: FINANCIAL_PAYMENT_TOKENS.COMMAND_HANDLERS.CREATE,
      useClass: CreateFinancialPaymentHandler,
    },

    {
      provide: FINANCIAL_PAYMENT_TOKENS.COMMAND_HANDLERS.PROCESS,
      useClass: ProcessFinancialPaymentHandler,
    },

    {
      provide: FINANCIAL_PAYMENT_TOKENS.COMMAND_HANDLERS.SUCCEED,
      useClass: SucceedFinancialPaymentHandler,
    },

    {
      provide: FINANCIAL_PAYMENT_TOKENS.COMMAND_HANDLERS.FAIL,
      useClass: FailFinancialPaymentHandler,
    },

    {
      provide: FINANCIAL_PAYMENT_TOKENS.COMMAND_HANDLERS.CANCEL,
      useClass: CancelFinancialPaymentHandler,
    },

    {
      provide: FINANCIAL_PAYMENT_TOKENS.COMMAND_HANDLERS.EXPIRE,
      useClass: ExpireFinancialPaymentHandler,
    },

    {
      provide: FINANCIAL_PAYMENT_TOKENS.COMMAND_HANDLERS.LINK_TRANSACTION,
      useClass: LinkFinancialPaymentTransactionHandler,
    },

    // =========================================================================
    // Financial Payment — Query Handlers
    // =========================================================================

    {
      provide: FINANCIAL_PAYMENT_TOKENS.QUERY_HANDLERS.GET,
      useClass: GetFinancialPaymentHandler,
    },

    // =========================================================================
    // Financial Payment Method — Command Handlers
    // =========================================================================

    {
      provide: FINANCIAL_PAYMENT_METHOD_TOKENS.COMMAND_HANDLERS.ADD,
      useClass: AddFinancialPaymentMethodHandler,
    },

    {
      provide: FINANCIAL_PAYMENT_METHOD_TOKENS.COMMAND_HANDLERS.SET_DEFAULT,
      useClass: SetDefaultFinancialPaymentMethodHandler,
    },

    {
      provide: FINANCIAL_PAYMENT_METHOD_TOKENS.COMMAND_HANDLERS.DEACTIVATE,
      useClass: DeactivateFinancialPaymentMethodHandler,
    },

    // =========================================================================
    // Financial Payment Method — Query Handlers
    // =========================================================================

    {
      provide: FINANCIAL_PAYMENT_METHOD_TOKENS.QUERY_HANDLERS.GET,
      useClass: GetFinancialPaymentMethodHandler,
    },

    {
      provide: FINANCIAL_PAYMENT_METHOD_TOKENS.QUERY_HANDLERS.GET_DEFAULT,
      useClass: GetDefaultFinancialPaymentMethodHandler,
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

    // -------------------------------------------------------------------------
    // Financial Payment Repository
    // -------------------------------------------------------------------------

    FINANCIAL_PAYMENT_TOKENS.REPOSITORY,

    // -------------------------------------------------------------------------
    // Financial Payment Method Repository
    // -------------------------------------------------------------------------

    FINANCIAL_PAYMENT_METHOD_TOKENS.REPOSITORY,
  ],
})
export class FinancialModule {}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialModule;
